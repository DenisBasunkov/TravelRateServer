import express, { json } from "express";
import sqlite3 from "sqlite3";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

const router = express.Router();
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');

export default router;

router.put('/', (req, res) => {

    const { Point_ID, User_ID } = req.query;

    const Data_key = uuidv4()

    db.run(`INSERT INTO Favorites_Point (Data_Key,Point,User) VALUES (?,?,?)`, [Data_key, Point_ID, User_ID], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: 'Error inserting data', statys: false });
        }

        console.log(`Row inserted with ID`);
        res.json({ message: 'Data inserted successfully', statys: true, data: { Data_Key: Data_key, Point: Point_ID } });
    })

})

router.delete('/', (req, res) => {

    const { Data_Key } = req.query;

    db.run(`DELETE FROM Favorites_Point WHERE Data_Key = ? `, [Data_Key], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ message: 'Error deleted data', statys: false });
        }

        res.json({ message: 'Data delete successfully', statys: true });
    })

})

router.get('/User_ID', (req, res) => {

    const { User_ID } = req.query;

    db.serialize(() => {

        db.all(`SELECT Data_Key,Point FROM Favorites_Point WHERE User = '` + User_ID + `'`, (err, row) => {
            res.json(row);
        });

    });

})

router.get("/get_favorite_by_User", (req, res) => {

    const { User_ID } = req.query;

    db.serialize(() => {

        db.all(`SELECT Point.* FROM Point,Favorites_point WHERE ID = Favorites_point.Point and Favorites_point.User ='${User_ID}'`, (err, row) => {
            res.json(row);
        });

    });
    //

})