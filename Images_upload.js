import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');
import fs from "fs"
import { v4 as uuidv4 } from 'uuid';

import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default router;

router.post('/', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const { file } = req.files;
    // const typeImg = req.files.text;
    if (!file) return res.json({ error: "incorrect" })
    res.json(true)
})

// router.post('/point/upload', (req, res) => {
//     if (!req.files) {
//         return res.status(500).send({ msg: "file is not found" })
//     }
//     const { file, text } = req.files;
//     // const typeImg = req.files.text;
//     console.log(text)
//     if (!file) return res.json({ error: "incorrect" })
//     const NewFileName = encodeURI(Date.now() + "-" + file.name)
//     file.mv(`${__dirname}/images/point/${NewFileName}`, err => {
//         if (err) {
//             console.error(err)
//             return res.status(500).send(err)
//         }
//         console.log("file was unloaded")
//         res.json(true)
//     })
// })

const UpdateAvatar = (UserID, avatarPath) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE User SET Foto = "${avatarPath}" WHERE User_KEY = '${UserID}'`, (err) => {
            if (err) {
                console.error(err.message);
                reject(false);
            }
            resolve(true)
        })
    })
}

const UpdateComments = (CommentID, imgPath) => {
    return new Promise((resolve, reject) => {

        db.run(`UPDATE Reviews SET Foto = '[${imgPath}]' WHERE Key_Reviews = '${CommentID}'`, (err) => {
            if (err) {
                console.log("err.message");
                reject(false);
            }
            resolve(true)
        })
    })
}

router.post('/avatar/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const file = req.files.file;
    console.log(file)
    // const UserID = req.body.UserID
    // console.log(file)
    if (!file) return res.json({ error: "incorrect" })
    const fileName = file.name.split('.')
    // const types = file.name.split(".")[1]
    // const NewFileName = encodeURI(UserID + "." + types)
    const resulte = UpdateAvatar(fileName[0], `/images/avatar/${file.name}`)
    if (resulte) {
        file.mv(`${__dirname}/images/avatar/${file.name}`, err => {
            if (err) {
                console.error(err)
                return res.status(500).send(err)
            }
            console.log("file was unloaded")
            res.json({ valid: true, newPath: `/images/avatar/${file.name}` })
        })
    }

})



router.post('/comments/upload', (req, res) => {
    if (!req.files) {
        console.log(req.files)
        return res.status(400).send({ msg: "No files uploaded" });
    }

    const files = req.files.file;
    var filePath = '';
    var ID;
    if (!files) return res.json({ error: "incorrect" })

    if (Array.isArray(files)) {
        const filename = files[0].name.split('_')
        ID = (filename[0])
        var FilesArray = new Array()
        files.forEach((file) => {
            filePath = `/images/point/${filename[1]}/comments/${file.name}`
            FilesArray.push(`"${filePath}"`)
        })
        const resulte = UpdateComments(ID, FilesArray)
        if (resulte) {
            const ress = files.forEach((file) => {
                file.mv(`${__dirname}/images/point/${filename[1]}/comments/${file.name}`, err => {
                    if (err) {
                        console.log(err)
                        return false
                    }
                    console.log("file was unloaded")
                    return true
                })
                return true
            })
            res.json({ valid: true })
        }
    } else {
        const filename = files.name.split('_')
        ID = filename[0]
        filePath = `/images/point/${filename[1]}/comments/${files.name}`
        UpdateComments(ID, `"${filePath}"`).then(success => {
            if (success) {
                files.mv(`${__dirname}${filePath}`, err => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    console.log("file was unloaded")
                    res.json({ valid: true })
                })
            }
        }).catch(error => {
            console.log('Error updating review:', error);
        })
    }

    // const resulte = UpdateComments(ID, filePath)
    // if (resulte) {
    //     files.mv(`${__dirname}${filePath}`, err => {
    //         if (err) {
    //             console.error(err)
    //             return res.status(500).send(err)
    //         }
    //         console.log("file was unloaded")
    //         res.json({ valid: true, newPath: filePath })
    //     })
})

export const removeimg = (filePath) => {
    const absolutePath = path.join(__dirname, filePath);
    return new Promise((resolve, reject) => {
        fs.unlink(absolutePath, (err) => {
            if (err) {
                reject(false);
            }
            resolve(true);
        });
    })
}

export const create_dir_point = (pointID) => {

    const d = path.join(__dirname, "images/point/", JSON.stringify(pointID), "/comments")

    fs.mkdir(d, {
        recursive: true
    }, err => {
        if (err) console.error(err)
        console.log("Папка создана")
    })

}

const UpdatePoint = (PointID, imgPath) => {
    return new Promise((resolve, reject) => {

        db.run(`UPDATE Point SET Foto_point = '[${imgPath}]' WHERE ID = '${PointID}'`, (err) => {
            if (err) {
                console.log("err.message");
                reject(false);
            }
            resolve(true)
        })
    })
}

router.post('/point/upload', (req, res) => {
    if (!req.files) {
        console.log(req.files)
        return res.status(400).send({ msg: "No files uploaded" });
    }
    const files = req.files.file;
    var filePath = '';
    var ID;
    if (!files) return res.json({ error: "incorrect" })
    if (Array.isArray(files)) {
        const filename = files[0].name.split('_')
        ID = (filename[0])
        var FilesArray = new Array()
        files.forEach((file) => {
            filePath = `/images/point/${filename[0]}/${file.name}`
            FilesArray.push(`"${filePath}"`)
        })
        const resulte = UpdatePoint(ID, FilesArray)
        if (resulte) {
            const ress = files.forEach((file) => {
                file.mv(`${__dirname}/images/point/${filename[0]}/${file.name}`, err => {
                    if (err) {
                        console.log(err)
                        return false
                    }
                    console.log("file was unloaded")
                    return true
                })
                return true
            })
            res.json({ valid: true })
        }
    } else {
        const filename = files.name.split('_')
        ID = filename[0]
        filePath = `/images/point/${filename[0]}/${files.name}`
        UpdatePoint(ID, `"${filePath}"`).then(success => {
            if (success) {
                files.mv(`${__dirname}${filePath}`, err => {
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    console.log("file was unloaded")
                    res.json({ valid: true })
                })
            }
        }).catch(error => {
            console.log('Error updating review:', error);
        })
    }
})