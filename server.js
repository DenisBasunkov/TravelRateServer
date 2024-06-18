import axios from "axios";
import Express, { json } from "express";
import fileUpload from "express-fileupload";

import cors from "cors"
// import bodyParser from "body-parser";
import path, { dirname } from 'path';
import ip from "ip";

import dotenv from "dotenv";


import Point from './API_Requests/Point_type.js';
import UserRoute from './API_Requests/User_db.js';
import Favorite from './API_Requests/Favorite.js';
import Coments from './API_Requests/Coments.js';
import ImageUpload from "./Images_upload.js"

import adminPortfrom from "./Admin_search.js"

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import os from 'os';
import cluster from "cluster";
import { fileURLToPath } from "url";
import { error } from "console";
import * as admin from "./HL.js"

//if (cluster.isMaster) {
//    const numCPUs = os.cpus().length;
//    for (let i = 0; i < numCPUs - 6; i++) {
//        cluster.fork();
//    }
//} else {

const PORT = process.env.PORT;
const server = Express();

server.use(Express.json());
server.use(Express.static(__dirname + "/public"));
server.use(fileUpload())

server.use('/api/admin', adminPortfrom);

server.use('/api/point_type', Point);
server.use('/api/user', UserRoute);
server.use('/api/favorite', Favorite);
server.use('/api/coments', Coments);
server.use('/api/images', ImageUpload)

//
server.use('/api/images', Express.static('images'));

// Роут для получения изображения
server.get('/api/image/:imageName', (req, res) => {
    const { imageName } = req.params;
    res.sendFile(`${__dirname}/images/${imageName}`);
});


server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})


import { exec } from "node:child_process"

// exec('npm run dev', { cwd: __dirname + "/AdminPanel" }, (err, output) => {
//     if (error) {
//         console.error(`Error executing command: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`Error output: ${stderr}`);
//         return;
//     }
//     console.log(`Command output: ${stdout}`);
// })

server.listen(PORT, () => {
    console.log("http://" + ip.address() + ":" + process.env.PORT + "/\n💬\n" + process.pid);

})

//}
//{"type":"line","point":[[43.589695, 39.725535],[43.583908, 39.720697]]}
