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


router.get("/get_User", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM User", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Point", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM Point", (err, row) => {
            res.json(row)
        })
    })
})

router.delete("/delete_Point", (req, res) => {
    const { ID } = req.query
    db.serialize(() => {
        db.run(`Delete FROM Point WHERE ID = ${ID}`, (err) => {
            if (err) {
                res.json(false)
            }
            res.json(true)
        })
    })
})

router.get("/get_City", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM City", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Categories_Point", (req, res) => {
    db.serialize(() => {
        db.all("SELECT Categories_Point.* , Type_point.Name_Type FROM Categories_Point  LEFT JOIN Type_point  ON Categories_Point.Type_Point = Type_point.ID; ", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Type_Point", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM  Type_point ", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Tag", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM  Tag ", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Reviews", (req, res) => {
    db.serialize(() => {
        db.all("SELECT Reviews.*,User.User_name, User.Foto as Avatar,Point.Name_point FROM Reviews LEFT JOIN User ON Reviews.User = User.User_KEY LEFT JOIN Point ON Reviews.Point = Point.ID", (err, row) => {
            res.json(row)
        })
    })
})

router.get("/get_Tag_point", (req, res) => {
    db.serialize(() => {
        db.all("SELECT Tag_point.*,User.User_name,Point.Name_point,Tag.* FROM Tag_point LEFT JOIN User ON Tag_point.User = User.User_KEY LEFT JOIN Point ON Tag_point.Point = Point.ID LEFT JOIN Tag ON Tag_point.Tag = Tag.ID", (err, row) => {
            res.json(row)
        })
    })
})