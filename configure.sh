#!/bin/sh
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update

sudo apt-get install -y mongodb-org
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

sleep 2
sudo npm install pm2 -g
sudo npm install pkg -g
sudo systemctl start mongod.service
sudo systemctl enable mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
d=$(cat /sys/class/net/en*/address)
first_mac=`echo "${d}" | head -1`
echo $d
text="_rsd"
a='{"customerId":"Admin","accountNo":"12345","password":"$2b$10$6nH7KdLptNLzqQQ.PHCgxuJxEaYO1p8MSqxGY8H8flbrCmm5DhNQ2","mobileNo":"9876543210",'
b='"Default_password":"'
c=$first_mac$text
e='"}'
document=$a$b$c$e
# document='{"customerId":"Admin","accountNo":"12345","password":"$2b$10$6nH7KdLptNLzqQQ.PHCgxuJxEaYO1p8MSqxGY8H8flbrCmm5DhNQ2","mobileNo":"9876543210"}'
mongo <<EOF
use rsdcustomer
db.createCollection("logindatahosts")
EOF
echo $document

mongo<<EOF
   use rsdcustomer
    var SuperAdmin = db.logindatahosts.find({"customerId":"Admin"}).toArray();
    if(!SuperAdmin.length){
        db.logindatahosts.insert(${document});
    }
EOF
eval "$(pm2 startup)"
pm2 start ./rsd-portal
pm2 save