import express, { json } from "express";
const router = express.Router();

const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');
import sqlite3 from "sqlite3";

router.get('/Test_table', (req, res) => {
    const ar = { 'fghhg': "sgds" };
    db.serialize(() => {


        db.all('SELECT * FROM Categories_Point', (err, row) => {
            res.json(row);
        });

    });

});

router.get('/Test_table_get', (req, res) => {
    const data = req.body.name;
    //res.json(data.name);
    db.serialize(() => {
        db.all('select * from Point', (err, row) => {
            res.json(row);
        });
    });
});

router.post('/Test_table', (req, res) => {

    const data = req.body;
    db.serialize(() => {
        try {
            const smtp = db.prepare('INSERT INTO Test_table (Name) VALUES (?)');
            if (Array.isArray(data)) {
                data.map((row) => {
                    smtp.run(row.name);
                })
            }
            else {
                smtp.run(data.name);
            }
            smtp.finalize();
            res.status(200).json("Данные записанны");

        } catch (err) {
            res.status(500).json(err);
        }

    });

});

router.put('/Test_table/:id', (req, res) => {

    const id = req.params.id;
    const data = req.body;

    db.serialize(() => {
        try {
            const smtp = db.prepare(`UPDATE Test_table SET Name = ? WHERE id = ${id}`);
            smtp.run(data.name);
            smtp.finalize();
            res.status(200).json("Данные записанны");

        } catch (err) {
            res.status(500).json(err);
        }

    });

});

router.delete('/Test_table/:id', (req, res) => {

    const id = req.params.id;
    db.serialize(() => {
        db.run(`DELETE FROM Test_table WHERE id = ${id}`, (err) => {
            if (err) {
                res.status(500).json(err.message);
            }
            res.status(200).json(`Запись №${id} успешно удалена`);
        });
    });

});

export default router;