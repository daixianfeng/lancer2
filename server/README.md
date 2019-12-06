### 预启动
- mysql
- redis

### 启动 
- pm2 start ./config/process.json
- node -r esm --experimental-modules ./src/app.js

- node -r esm --experimental-modules ./init/mysql.js