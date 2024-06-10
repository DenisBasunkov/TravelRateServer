import express, { json, request } from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');

import { v4 as uuidv4 } from 'uuid';
import { create_dir_point } from "../Images_upload.js";

export default router;

router.get('/get_type', (req, res) => {
    db.serialize(() => {

        db.all(`SELECT * FROM Type_Point`, (err, row) => {
            res.json(row);
        });

    });
})

router.get('/get_category', (req, res) => {
    db.serialize(() => {

        db.all(`SELECT * FROM Categories_Point`, (err, row) => {
            res.json(row);
        });

    });
})

router.get('/', (req, res) => {

    db.serialize(() => {

        db.all(`SELECT * FROM Point`, (err, row) => {
            res.json(row);
        });

    });

});

router.get('/point:id?', (req, res) => {
    const id = req.query.id;
    db.serialize(() => {
        db.all(`SELECT * FROM Point WHERE ID = ${id}`, (err, row) => {
            res.json(row);
        });
    });
});

router.get('/all', (req, res) => {

    const { CityName, SubjectName } = req.query;

    db.serialize(() => {

        db.all(`SELECT * FROM Point Where City == (SELECT ID FROM City Where name == "${CityName}" AND Subject == "${SubjectName}")`, (err, row) => {
            res.json(row);
        });

    });

});



// router.put('/set_city', (req, res) => {

//     const { Name, District, Subject } = req.query;

//     db.run(`INSERT INTO City (ID,Name, District, Subject) VALUES (?,?,?,?)`, [uuidv4(), Name, District, Subject], (err) => {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Error inserting data', action: false });
//         }

//         console.log(`Row inserted with ID`);
//         res.json({ message: 'Data inserted successfully', action: true });
//     })

// });


//{"type":"line","point":[[43.589695, 39.725535],[43.583908, 39.720697]]}

//function ar(dataToInsert, ID) {
//    const updateQuery = `UPDATE Point SET Coordinates_point = '${dataToInsert}' WHERE 'ID' = ${ID}`;
//    console.log(updateQuery);

//    db.run(updateQuery, function (err) {
//        if (err) {
//            return console.error(err.message);
//        }
//        console.log(`Rows inserted ${this.changes}`);
//    });


//}

//function isArrayofArrays(arr) {
//    if (!Array.isArray(arr)) {
//        return false; // Если переменная не является массивом, вернуть false
//    }
//    // Проверяем каждый элемент массива на то, является ли он массивом
//    return arr.every((item) => Array.isArray(item));
//}

//router.get('/d', (req, res) => {
//    db.serialize(() => {

//        db.all('SELECT * FROM Point', (err, row) => {
//            let ld = [];
//            row.forEach((name) => {

//                const col = JSON.parse(name.Coordinates_point)
//                if (Array.isArray(col)) {
//                    if (isArrayofArrays(col)) {
//                        //ld.push({ "type": "Groupe_poin", "point": name.Coordinates_point });
//                        const updateQuery = "UPDATE Point SET Coordinates_type_point = 'Groupe_poin' WHERE `ID` = " + name.ID;
//                        console.log(updateQuery);

//                        db.run(updateQuery, function (err) {
//                            if (err) {
//                                return console.error(err.message);
//                            }
//                            console.log(`Rows inserted ${this.changes}`);
//                        });
//                    } else {
//                        //ld.push({ "type": "Point", "point": name.Coordinates_point });

//                        const updateQuery = "UPDATE Point SET Coordinates_type_point = 'Point' WHERE `ID` = " + name.ID;
//                        console.log(updateQuery);

//                        db.run(updateQuery, function (err) {
//                            if (err) {
//                                return console.error(err.message);
//                            }
//                            console.log(`Rows inserted ${this.changes}`);
//                        });
//                    }

//                } else if (col instanceof Object) {

//                    const updateQuery = "UPDATE Point SET Coordinates_type_point = 'List' WHERE `ID` = " + name.ID;
//                    console.log(updateQuery);

//                    db.run(updateQuery, function (err) {
//                        if (err) {
//                            return console.error(err.message);
//                        }
//                        console.log(`Rows inserted ${this.changes}`);
//                    });
//                }

//            });
//            res.json(ld);
//        });

//    });

//});

//router.get('/Type_point/ID', (req, res) => {
//    db.serialize(() => {

//        db.all('SELECT * FROM Type_point', (err, row) => {
//            let ld = [];
//            row.forEach((name) => {
//                ld.push(name.ID);
//            });
//            res.json(ld);
//        });

//    });

//});

//router.get('/Categories_Point/:id?', (req, res) => {
//    db.serialize(() => {
//        req.params.id == null ?
//            db.all('SELECT * FROM Categories_Point', (err, row) => {
//                res.json(row);
//            })
//            :
//            db.get('SELECT * FROM Categories_Point WHERE ID =' + req.params.id, (err, row) => {
//                res.json(row);
//            });

//    });

//});

//router.get('/Categories_Point/type_point/:id?', (req, res) => {
//    const id = req.params.id;
//    db.serialize(() => {

//        db.all('SELECT * FROM Categories_Point Where Type_Point = ?', [id], (err, row) => {

//            res.json(row.map(({ ID, Name_Categories }) => {
//                return { [ID]: Name_Categories };
//            }));

//        });

//    });
//});


router.get("/category", (req, res) => {

    db.serialize(() => {

        db.all('SELECT * FROM Categories_Point', (err, row) => {
            res.json(row);
        });

    });


});

router.get("/type", (req, res) => {

    db.serialize(() => {

        db.all('SELECT * FROM Type_Point', (err, row) => {
            res.json(row);
        });

    });


})

router.get("/city", (req, res) => {

    const { ID } = req.query

    db.serialize(() => {

        db.all(`SELECT * FROM City WHERE ID = "${ID}"`, (err, row) => {
            res.json(row);
        });

    });


});

router.get("/All_city", (req, res) => {

    db.serialize(() => {

        db.all(`SELECT * FROM City `, (err, row) => {
            res.json(row);
        });

    });


});

router.put("/Add_point", (req, res) => {
    const { Name_point, Adress_point, Categories_Point, City, Description_point, Coordinates_type_point, Coordinates_point } = req.body;
    console.log(Name_point)
    console.log(Adress_point)
    console.log(Categories_Point)
    console.log(City)
    console.log(Coordinates_type_point)
    console.log(Coordinates_point)
    db.serialize(() => {

        db.run(`INSERT INTO Point (Name_point,Adress_point, Categories_Point, City,Description_point,Coordinates_type_point,Coordinates_point) VALUES (?,?,?,?,?,?,?)`, [Name_point, Adress_point, Categories_Point, City, Description_point, Coordinates_type_point, Coordinates_point], function (err) {
            if (err) {
                console.error(err.message);
                res.json(false)
            }
            console.log(`Point inserted`);
            create_dir_point(this.lastID)
            res.json({ status: true, ID: this.lastID })
        })

    })

})