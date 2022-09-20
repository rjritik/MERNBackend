import { backupmodel } from "../../../model/backup/backupmodel";
import path from "path";
const bcrypt = require("bcrypt");
import {exec} from 'child_process'
import fs from 'fs'
import { Client } from 'node-scp'
import{ NodeSSH } from 'node-ssh'
import { secretUtil } from "../../../utils/secretutil";
import { BackupCronModel } from "../../../model/backup/backupcron";
import app  from "../../../app"
import { zip } from 'zip-a-folder';
import extract from 'extract-zip'
import * as fse from 'fs-extra'
const dbOptions = {
  host: secretUtil.MONGODB_SERVER,
  port: secretUtil.MONGODB_PORT,
  database: secretUtil.MONGODB_DBNAME,
  collections: [],
};
const ssh = new NodeSSH();

class BackupServicesV1 {
  public ScheduledBackup = async (user:any, storage:any) => {
    try {
      let ack = {ack :'1', msg:"Backup Saved Successfully"};
      let backupLocation = await backupmodel.find({});
      let date = new Date();
        let curr_time =
          ("00" + (date.getMonth() + 1)).slice(-2) +
          ("00" + date.getDate()).slice(-2) +
          date.getFullYear() +
          ("00" + date.getHours()).slice(-2) +
          ("00" + date.getMinutes()).slice(-2) +
          ("00" + date.getSeconds()).slice(-2);
        let folderName = `DB_BACKUP_${curr_time}`;
        if(!fs.existsSync(path.join(process.cwd(),"dblocalbackup"))) {
          fs.mkdirSync(path.join(process.cwd(), "dblocalbackup"));
        }
        let src = path.join(process.cwd(), "dblocalbackup");
        let newBackupPath = path.join(process.cwd() , "dblocalbackup/" + folderName);
        let cmd =
          "mongodump --host " +
          dbOptions.host +
          " --port " +
          dbOptions.port +
          " --gzip" +
          " --db " +
          dbOptions.database +
          " --out " +
          newBackupPath;
        if(storage === 'remote' && backupLocation.length) {
        exec(cmd, async (err, stdout, stderr) => {
          const failed = []
          const successful = []
          if (this.empty(err)) {
            if(storage === 'remote' && backupLocation.length){
              const client = await Client({
                host:backupLocation[0]?.host,
                password:backupLocation[0]?.password,
                username:backupLocation[0]?.username,
                port: backupLocation[0]?.port
              });
            const result = await client.list(String(backupLocation[0]?.location));
            const dbs = result.filter(r => r.name.includes('DB_BACKUP_'));
            dbs.sort((a,b) => (a.modifyTime < b.modifyTime) ? 1 : (a.modifyTime > b.modifyTime ? -1 : 0));  
            let toBeDeleted = null;
            if(dbs.length >=7) toBeDeleted = dbs[0].name;
            await ssh.connect({
              host:backupLocation[0]?.host,
              password:backupLocation[0]?.password,
              username:backupLocation[0]?.username,
              port: backupLocation[0]?.port,
            }).then( async function(){
            console.log("Connected");
            if(toBeDeleted) {
              // console.log(toBeDeleted);
              await ssh.execCommand(`rm -r ${toBeDeleted}`,{ cwd:backupLocation[0]?.location }).then(result => console.log(result));
              toBeDeleted=null;
            }
            await ssh.putDirectory(newBackupPath, backupLocation[0]?.location + '/' + folderName, {recursive: true,
              concurrency: 10, tick:function(localPath, remotePath, error) {
                if (error) {
                  console.log("failed", localPath)
                } else {
                  console.log("Passed", remotePath)
                }
              }
            }).then(function(status) {
              console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
              console.log('failed transfers', failed.join(', '))
              console.log('successful transfers', successful.join(', '))})
            }).catch(err => {
              return {ack:'2', msg:"Could not connnect to remote"}
            })
            fs.rmdirSync(newBackupPath, {recursive:true});
          }
          } else {
            console.log(err);
          }
        });
      }
      else {
        
        exec(cmd, async (err, stdout, stderr) => {
          if(this.empty(err)) {
            ack['ack']='1';
            ack.msg='BAckup created on local location';
          }
        });
        this.deleteOldestlocal(src); 
      }
        return ack;
    } catch (error) {
      return {ack:'2', msg:"Some Errror Occured"};
    }
  }
  
  public empty = (mixedVar) => {
    let undef, key, i, len;
    const emptyValues = [undef, null, false, 0, "", "0"];
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixedVar === emptyValues[i]) {
        return true;
      }
    }
    if (typeof mixedVar === "object") {
      for (key in mixedVar) {
        return false;
      }
      return true;
    }
    return false;
  };
  public deleteOldestlocal = async(src) => {
    function getDirectories(p) {
      return fs.readdirSync(p).filter(function (file) {
        return fs.statSync(p+'/'+file).isDirectory();
      });
    }
    let backups = getDirectories(src);
    if(backups.length>=7) {
      // fs.rmdirSync(path.join(src, backups[0]), {recursive:true});
      await fse.remove(path.join(src,backups[0]))
    }
    else return;
  }
  public saveBackupLocation = async (req:any) => {
    try {
        let oldbackup = await backupmodel.find({});
        if (oldbackup.length) {
          let username = req?.username;
          // let salt = await bcrypt.genSalt(10);
          let password = req?.password; //await bcrypt.hash(req?.password, salt);
          let location = req?.location;
          let host = req?.host;
          let port = req?.port;
          let model = {
            username: username,
            password: password,
            host: host,
            location: location,
            port:port
          };
          let newBackup = await backupmodel.updateOne(
            { user: "Admin" },
            { $set: model }
          );
          if (newBackup)
            return { msg: "Backup Location has been updated succesfully" };
        }
        let model = new backupmodel();
        // const salt = await bcrypt.genSalt(10);
        // let password = await bcrypt.hash(req.password, salt);
        model.user = "Admin"
        model.host = req?.host;
        model.username = req?.username;
        model.location = req?.location;
        model.password = req?.password;
        model.port = req?.port;
        await model.save();
        return { msg: "Remote location has been set successfully;" };
      
    } catch (error) {
      return null;
    }
  };
  public getBackupLocation = async (req: any) => {
    try {
      let backupLocation = await backupmodel.find({});
      if (backupLocation) {
        return { IP: backupLocation[0].host, location: backupLocation[0].location };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };
  public uploadBackupNow = async (req: any) => {
    try {
      let ack = {ack :'1', msg:"Backup Saved Successfully"};
      let backupLocation = await backupmodel.find({});
      let date = new Date();
        let curr_time =
          ("00" + (date.getMonth() + 1)).slice(-2) +
          ("00" + date.getDate()).slice(-2) +
          date.getFullYear() +
          ("00" + date.getHours()).slice(-2) +
          ("00" + date.getMinutes()).slice(-2) +
          ("00" + date.getSeconds()).slice(-2);
        let folderName = `DB_BACKUP_${curr_time}`;
        if(!fs.existsSync(path.join(process.cwd(),"dblocalbackup"))) {
          fs.mkdirSync(path.join(process.cwd(), "dblocalbackup"));
        }
        let src = path.join(process.cwd(), "dblocalbackup");
        let newBackupPath = path.join(process.cwd() , "dblocalbackup/" + folderName);
        let cmd =
          "mongodump --host " +
          dbOptions.host +
          " --port " +
          dbOptions.port +
          " --gzip" +
          " --db " +
          dbOptions.database +
          " --out " +
          newBackupPath;
        if(req.storage === 'remote' && backupLocation.length) {
        exec(cmd, async (err, stdout, stderr) => {
          const failed = []
          const successful = []
          if (this.empty(err)) {
            if(req.storage === 'remote' && backupLocation.length){
            const client = await Client({
                host:backupLocation[0]?.host,
                password:backupLocation[0]?.password,
                username:backupLocation[0]?.username,
                port: backupLocation[0]?.port
              });
            const result = await client.list(String(backupLocation[0]?.location));
            const dbs = result.filter(r => r.name.includes('DB_BACKUP_'));
            dbs.sort((a,b) => (a.modifyTime < b.modifyTime) ? 1 : (a.modifyTime > b.modifyTime ? -1 : 0));  
            let toBeDeleted = null;
            if(dbs.length >=7) toBeDeleted = dbs[0].name;
            await ssh.connect({
              host:backupLocation[0]?.host,
              password:backupLocation[0]?.password,
              username:backupLocation[0]?.username,
              port: backupLocation[0]?.port,
            }).then( async function(){
            console.log("Connected");
            if(toBeDeleted) {
              // console.log(toBeDeleted);
              await ssh.execCommand(`rm -r ${toBeDeleted}`,{ cwd:backupLocation[0]?.location }).then(result => console.log(result));
              toBeDeleted=null;
            }
            await ssh.putDirectory(newBackupPath, backupLocation[0]?.location + '/' + folderName, {recursive: true,
              concurrency: 10, tick:function(localPath, remotePath, error) {
                if (error) {
                  console.log("failed", localPath)
                } else {
                  console.log("Passed", remotePath)
                }
              }
            }).then(function(status) {
              console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
              console.log('failed transfers', failed.join(', '))
              console.log('successful transfers', successful.join(', '))})
            }).catch(err => {
              return {ack:'2', msg:"Could not connnect to remote"}
            })
            fs.rmdirSync(newBackupPath, {recursive:true});
          }
          } else {
            console.log(err);
          }
        });
      }
      else {
        this.deleteOldestlocal(src);
        exec(cmd, async (err, stdout, stderr) => {
          if(this.empty(err)) {
            ack['ack']='1';
            ack.msg='BAckup created on local location';
          }
        }) 
      }
        return ack;
    } catch (error) {
      return {ack:'2', msg:"Some Errror Occured"};
    }
  };
  public  listAllBackups = async (req:any) => {
    async function test() {
      try {
        let backupLocation = await backupmodel.find({});
        if(backupLocation) {
          
        const client = await Client({
          host:backupLocation[0]?.host,
          password:backupLocation[0]?.password,
          username:backupLocation[0]?.username,
          port: backupLocation[0]?.port
        })
        let location = String(backupLocation[0]?.location);
        const result = await client.list(location);
        const dbs = result.filter(r => r.name.includes('DB_BACKUP_'));
        dbs.sort((a,b) => (a.modifyTime < b.modifyTime) ? 1 : (a.modifyTime > b.modifyTime ? -1 : 0));
        client.close();
        return dbs;
      } 
    }
    catch (e) {
      console.log(e)
    }
    }
  return test();
  }
  public  restoreLocal = async (req:any) => {
    try {
          let restoreBackupPath = path.join(process.cwd(), "dblocalbackup/"+ req.foldername);
      let cmd =
        "mongorestore --host " +
        dbOptions.host +
        " --port " +
        dbOptions.port +
        " --db " +
        dbOptions.database +
        " " +restoreBackupPath +'/' + dbOptions.database + " --gzip "
        +
        "--drop" 
      exec(cmd, (error, stdout, stderr) => {
        if (this.empty(error)) {
          return { ack: "1", msg: "Restored" };
        }
        console.log(error)
        return { ack: "0", msg: "Restore failed" };
      });
      return {ack:'1', msg:"Database Restored"};
    } catch (error) {
      return null;
    }
  }
  public  restoreRemote = async (req:any) => {
    try {
        let oldbackup = await backupmodel.find();
        if(oldbackup.length){
          const failed = []
          const successful = []
          await ssh.connect({
            host:oldbackup[0]?.host,
              password:oldbackup[0]?.password,
              username:oldbackup[0]?.username,
              port: oldbackup[0]?.port
          }).then(async function () {
            console.log("Connectd to remote");
            let localDir  = path.join(process.cwd(), "dblocalbackup");
            await ssh.getDirectory(localDir, `${oldbackup[0]?.location}/${req.foldername}`, {recursive:true, concurrency:10, tick:function(localPath, remotePath, error) {
              if (error) {
                console.log("failed", localPath)
              } else {
                console.log("Passed", remotePath)
              }
            }}).then(function(status) {
              console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
              console.log('failed transfers', failed.join(', '))
              console.log('successful transfers', successful.join(', '))})
          })
          let restoreBackupPath = path.join(process.cwd(), "dblocalbackup");
      let cmd =
        "mongorestore --host " +
        dbOptions.host +
        " --port " +
        dbOptions.port +
        " --db " +
        dbOptions.database +
        " " +restoreBackupPath +'/' + dbOptions.database + " --gzip "
        +
        "--drop" 
      exec(cmd, (error, stdout, stderr) => {
        if (this.empty(error)) {
          fs.rmdirSync(restoreBackupPath+'/'+dbOptions.database, {recursive:true});
          return { ack: "1", msg: "Restored" };
        }
        console.log(error)
        return { ack: "0", msg: "Restore failed" };
      });
      return {ack:'1', msg:"Database Restored"}
    }
    } catch (error) {
      return null;
    }
    return {ack:'0', msg:"Error"};
  }
  public  listLocalBackups = async (req:any) => {
    
    let source = path.join(process.cwd(), "dblocalbackup");
    function getDirectories(p) {
      return fs.readdirSync(p).filter(function (file) {
        return fs.statSync(p+'/'+file).isDirectory();
      });
    }
    return getDirectories(source);
    } 
    public downloadBackup = async (req,foldername,res:any) => {
      try {
        let pathurl = req.path;
        let sourceBackupPath = path.join(process.cwd(), `dblocalbackup/${foldername}`);
        await zip(sourceBackupPath, foldername+'.zip');
        let cd = path.join(process.cwd(),`${foldername}.zip`);
        if(pathurl!=='/') {
        const response = res.download(cd, `${foldername}.zip`,err => {
          if(err) return err;
          fs.unlinkSync(cd);
        },);
        return response;
      }
      } catch (error) {
        return {err:error};
      }
    };
    public savedailycron = async (req:any) => {
      try {
        let cron = await BackupCronModel.find({});
        if(cron.length) {
          let model = {
            user: "Admin",
            dailyexpression:req?.expression,
            dailystorage:req?.storage
          };
          let newCron = await BackupCronModel.updateOne(
            { user: "Admin" },
            { $set: model }
          );
          if(app.Manager.exists('dbdaily')) {
            app.Manager.update("dbdaily", req?.expression, () => {
              this.ScheduledBackup(req?.user, req?.storage);
            });
            }
            else {
            app.Manager.add('dbdaily', req?.expression, () => {
              this.ScheduledBackup(req?.user, req?.storage);
            }, {
              start:true,
              timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          }
          if (newCron)
            return { msg: "Backup Schedule has been updated succesfully" };
        }
        let model = new BackupCronModel();
        model.user = "Admin";
        model.dailyexpression = req?.expression;
        model.dailystorage= req?.storage;
        await model.save();
        if(app.Manager.exists('dbdaily')) {
          app.Manager.update("dbdaily", req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          });
          }
          else {
          app.Manager.add('dbdaily', req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          }, {
            start:true,
            timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        }
        return { msg: "Backup Schedule has been updated succesfully" };
      } catch (error) {
        return {msg:error};
      }
    };
    public saveWeeklyCron = async (req:any) => {
      try {
        let cron = await BackupCronModel.find({});
        if(cron.length) {
          let model = {
            user:"Admin",
            weeklyexpression:req?.expression,
            weeklystorage:req?.storage
          };
          let newCron = await BackupCronModel.updateOne(
            { user: "Admin" },
            {$set :model}
          );
          if(app.Manager.exists('dbweekly')) {
          app.Manager.update("dbweekly", req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          });
          }
          else {
          app.Manager.add('dbweekly', req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          }, {
            start:true,
            timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        }
          if (newCron)
            return { msg: "Backup Schedule has been updated succesfully" };
        }
        let model = new BackupCronModel();
        model.user = "Admin";
        model.weeklyexpression = req?.expression;
        model.weeklystorage= req?.storage;
        await model.save();
        if(app.Manager.exists('dbweekly')) {
          app.Manager.update("dbweekly", req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          });
          }
          else {
          app.Manager.add('dbweekly', req?.expression, () => {
            this.ScheduledBackup(req?.user, req?.storage);
          }, {
            start:true,
            timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        }
      } catch (error) {
        return null;
      }
    };
    public uploadBackupFiles = async (req) => {
      try {
        if(!req.files) return {ack:"0", msg:"Please select a file"}
      let file  = req.files.file;
      if(!file.name.startsWith('DB_BACKUP_')) return { ack :"0" , msg:"Please upload files with correct name" }; 
      let newFile = req.files.file.name.split('.')[0];
      if(fs.existsSync(path.join(process.cwd(), `dblocalbackup/${newFile}`))) return {ack:"0", msg:"Backup file already exists"}
      file.mv(path.join(process.cwd(), `${req.files.file.name}`))
      let src = path.join(process.cwd(), `${req.files.file.name}`);
      let dst = path.join(process.cwd(), `dblocalbackup/${req.files.file.name.split('.')[0]}`);
      await extract(src, {dir:dst})
      fs.unlinkSync(src);
      return {ack:"1",msg:"Database Backup Uploaded"};  
      } catch (error) {
        return {ack:"0",msg:error}
      }
    }
}

export const backupServicesV1 = new BackupServicesV1();
