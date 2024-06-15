import express, { json } from "express";
import sqlite3 from "sqlite3";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

const router = express.Router();
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');


import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default router;

router.get("/", (req, res) => {
    db.serialize(() => {

        db.all(`SELECT * FROM Reviews`, (err, row) => {
            res.json(row);
        });

    });
})

router.get("/by_point_id", (req, res) => {
    const { PointID } = req.query;

    db.serialize(() => {
        db.all(`SELECT Reviews.*, User.User_name, User.Foto as Avatar 
        FROM Reviews 
        LEFT JOIN User ON Reviews.User = User.User_KEY 
        WHERE Point = '${PointID}'`, (err, row) => {
            // console.log(row)
            res.json(row)
        })
    })
})

const get_point_rate = (ID) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT Rating_point, Sum_Rating, Koll_Rating FROM Point WHERE ID = ${ID}`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const update_point_rate = (ID, Rating_point, Sum_Rating, Koll_Rating) => {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Point SET Rating_point=${Rating_point}, Sum_Rating=${Sum_Rating} , Koll_Rating=${Koll_Rating} WHERE ID = ${ID}`, (err) => {
            if (err) {
                console.error(err.message);
                reject(false);
            } else {
                console.log(`Row inserted with ID`);
                resolve(true)
            }
        })
    })
}

router.put("/", async (req, res) => {
    const { PointID, Rating_Reviews, Text_Reviews, User } = req.body;
    // console.log("PointID:", PointID);
    // console.log("Rating_Reviews:", Rating_Reviews);
    // console.log("Text_Reviews:", Text_Reviews);
    // console.log("User:", User);
    const ID = uuidv4()
    const Rate = await get_point_rate(PointID);
    var { Rating_point, Sum_Rating, Koll_Rating } = Rate[0]
    Koll_Rating++;
    Sum_Rating += Number(Rating_Reviews);
    Rating_point = Sum_Rating / Koll_Rating
    const date = new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString()
    const r = await update_point_rate(PointID, Rating_point, Sum_Rating, Koll_Rating)
    if (r) {
        db.serialize(() => {
            db.run(`INSERT INTO Reviews (Key_Reviews,Point, Rating_Reviews, Text_Reviews,User,Date_Reviews) VALUES (?,?,?,?,?,?)`,
                [ID, PointID, Rating_Reviews, Text_Reviews, User, date], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Error inserting data', action: false });
                    }
                    console.log(`Row inserted with ID`);
                    res.json({ ID: ID, action: true });
                })
        })
    }
})

router.post("/", async (req, res) => {
    if (!req.files || !req.files.Foto) {
        return res.status(500).send({ msg: "File is not found" });
    }
    const { PointID, Rating_Reviews, Text_Reviews, User } = req.body;
    const file = req.files.Foto;
    const ID = uuidv4();
    const Rate = await get_point_rate(PointID);
    const { Rating_point, Sum_Rating, Koll_Rating } = Rate[0];
    const Koll_RatingUpdated = Koll_Rating + 1;
    const Sum_RatingUpdated = Sum_Rating + Number(Rating_Reviews);
    const Rating_pointUpdated = Sum_RatingUpdated / Koll_RatingUpdated;
    const date = new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString();
    const r = await update_point_rate(PointID, Rating_pointUpdated, Sum_RatingUpdated, Koll_RatingUpdated);
    if (!r) {
        return res.status(500).json({ error: 'Error updating point rate', action: false });
    }
    const ArrFile = [];
    const newPath = __dirname.replace('\\API_Requests', '');
    const uploadPath = `${newPath}/images/avatar/`;
    if (Array.isArray(file)) {
        for (let i = 0; i < file.length; i++) {
            const NewFileName = encodeURI(ID + "_" + file[i].name);
            file[i].mv(`${uploadPath}${NewFileName}`, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error 0 uploading file', action: false });
                }
                console.log("File was uploaded");
                ArrFile.push(`/images/point/comments/${NewFileName}`);
                if (ArrFile.length === file.length) {
                    await insertReviewToDB();
                }
            });
        }
    } else {
        const NewFileName = encodeURI(ID + "_" + file.name);
        file.mv(`${uploadPath}${NewFileName}`, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error 1 uploading file', action: false });
            }
            console.log("File was uploaded");
            ArrFile.push(`/images/point/comments/${NewFileName}`);
            await insertReviewToDB();
        });
    }
    async function insertReviewToDB() {
        db.run(`INSERT INTO Reviews (Key_Reviews,Point, Rating_Reviews, Text_Reviews,Foto,User,Date_Reviews) VALUES (?,?,?,?,?,?,?)`,
            [ID, PointID, Rating_Reviews, Text_Reviews, JSON.stringify(ArrFile), User, date], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Error inserting data', action: false });
                }

                console.log(`Row inserted with ID`);
                res.json({ message: 'Коментарий добавлен', action: true });
            });
    }
});

// router.get("/f", (req, res) => {
//     const { ID } = req.query
//     db.serialize(() => {

//         db.all(`SELECT Rating_point,Sum_Rating,Koll_Rating FROM Point WHERE ID = ${ID}`, (err, row) => {
//             res.json(row)
//         });

//     });
// })

router.get("/All_comment_foto_by_point", (req, res) => {
    const { ID } = req.query
    db.serialize(() => {
        db.all(`SELECT Foto FROM Reviews WHERE Point = ${ID}`, (err, row) => {
            const imgArr = new Array()
            row.map(item => {
                const data = JSON.parse(item.Foto)
                if (Array.isArray(data)) {
                    data.map(item => imgArr.push(item))

                }
            })
            res.json(JSON.stringify(imgArr))

        });

    });
})