#!/bin/sh
cd frontend
rm -r build
npm i
npm run build
mv build ../backend/
cd ../backend
npm i
rm -r dist
npm run build
pkg -o rsd-portal .
mv rsd-portal ../
rm -r build
rm -r dist