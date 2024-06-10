import express, { json } from "express";
import sqlite3 from "sqlite3";

import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

import bcrypt from "bcrypt";

const router = express.Router();
const SQLite3 = sqlite3.verbose();
const db = new SQLite3.Database('myDatabase.db');

export default router;

//Получить всех пользователей

router.post("/form_test", (req, res) => {
    const { Login } = req.params
    res.json(true)
    console.log("data")
    console.log(Login)

})

router.get("/", (req, res) => {
    db.serialize(() => {
        db.all(`SELECT * FROM User`, (err, row) => {
            res.json(row);
        });
    });
});

router.get("/by_id", (req, res) => {
    const { ID } = req.query
    console.log(ID)
    db.serialize(() => {
        db.all(`SELECT * FROM User WHERE User_KEY = '${ID}'`, (err, row) => {
            console.log(row)
            res.json(row);
        });
    });
});

//Добавить пользователя

router.put("/create", async (req, res) => {

    const { User_name, Login, Password } = req.query;
    const code = uuidv4().split("-").join("")
    let newUser_name = User_name == (null || '') ? `user${code}` : User_name
    console.log(newUser_name)
    try {
        const hashPassword = await bcrypt.hash(Password, 8);
        // console.log(hashPassword);
        db.serialize(() => {

            db.run(`INSERT INTO User (User_KEY,User_name, Login, Password) VALUES (?,?,?,?)`, [uuidv4(), newUser_name, Login, hashPassword], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Error inserting data', action: false });
                }

                console.log(`Row inserted with ID`);
                res.json({ message: 'Data inserted successfully', action: true });
            })

        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing password', action: false });
    }

});

//Найти пользователя

router.get("/finde", async (req, res) => {

    const { Login, Password } = req.query;

    if (!Login || !Password) {
        return res.status(401).json({ message: "Login or Password missing" });
    }

    try {

        db.serialize(() => {
            db.all(`SELECT * FROM User`, async (err, row) => {

                const f = row.find((item) => item.Login === Login)
                if (f === undefined) {
                    res.json("Нет такого пользователя")
                    console.log(f)
                } else {
                    await bcrypt.compare(Password, f.Password, (err, result) => {
                        if (err) {
                            res.status(400).json(err)
                        }
                        if (result) {
                            res.json(f)
                        } else {
                            res.status(400).json("Неправильный пароль")
                        }
                    });
                }

            });
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing password' });
    }

})

const rename_basic_info = (data) => {
    const { UserName, Login, Birthday, UserID } = data
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("UPDATE User set User_name=?,Login=?,Birthday=? WHERE USer_KEY = ?", [UserName, Login, Birthday, UserID], (err) => {
                if (err) {
                    reject({ status: false, message: err.message })
                    return;
                }
                resolve({ status: true, message: "Информация изменена" })
            })
        })
        // resolve(`${UserID}-${UserName}-${Login}-${Birthday}`)
    })
}

const rename_email = (data) => {
    const { Email, UserID } = data
    return new Promise(async (resolve, reject) => {
        db.serialize(() => {
            db.run("UPDATE User set Email=? WHERE USer_KEY = ?", [Email, UserID], (err) => {
                if (err) {
                    reject({ status: false, message: err.message })
                }
                resolve({ status: true, message: "Информация изменена" })
            })
        })
        // resolve(`${UserID}-${UserName}-${Login}-${Birthday}`)
    })
}

const rename_password = (data) => {
    const { OldPassword, Password, UserID } = data
    return new Promise(async (resolve, reject) => {
        db.serialize(() => {

            db.all("SELECT Password FROM User WHERE User_KEY = ?", [UserID], async (err, row) => {
                if (err) {
                    reject({ status: false, message: err.message })
                    return;
                }
                // console.log(Password)
                // console.log(row[0].Password)
                await bcrypt.compare(OldPassword, row[0].Password, async (err, result) => {
                    if (result) {
                        const hashPassword = await bcrypt.hash(Password, 8);
                        db.run("UPDATE User set Password= ? WHERE User_KEY = ?", [hashPassword, UserID], (err) => {
                            if (err) {
                                reject({ status: false, message: err.message })
                            }
                            resolve({ status: true, message: "Пароль изменён" })
                        })
                    } else {
                        reject({ status: false, pass: 1, message: "Пароль не верен" })
                    }

                })
            })

            // db.run("UPDATE User set User_name=?,Login=?,Birthday=? WHERE User_KEY = ?", [UserName, Login, Birthday, UserID], (err) => {
            //     if (err) {
            //         reject({ status: false, message: err.message })
            //     }
            //     resolve({ status: true, message: "Информация изменена" })
            // })
        })
        // resolve(`${UserID}-${UserName}-${Login}-${Birthday}`)
    })
}

const rename_phone = (data) => {
    const { Phone, UserID } = data
    return new Promise(async (resolve, reject) => {
        db.serialize(() => {
            db.run("UPDATE User set Phone=? WHERE USer_KEY = ?", [Phone, UserID], (err) => {
                if (err) {
                    reject({ status: false, message: err.message })
                }
                resolve({ status: true, message: "Информация изменена" })
            })
        })
        // resolve(`${UserID}-${UserName}-${Login}-${Birthday}`)
    })
}

//Изменить пользователя
router.put('/rename_user', async (req, res) => {
    const { rename_type } = req.body;
    switch (rename_type) {
        case 'basic':
            await rename_basic_info(req.body).then((result) => {
                res.json(result)
            }).catch((error) => {
                res.json(error)
            })
            break;
        case "Email":
            rename_email(req.body).then((result) => {
                res.json(result)
            }).catch((error) => {
                res.json(error)
            })
            break;
        case "Phone":
            rename_phone(req.body).then((result) => {
                res.json(result)
            }).catch((error) => {
                res.json(error)
            })
            break;
        case "password":
            await rename_password(req.body).then((result) => {
                res.json(result)
            }).catch((error) => {
                res.json(error)
            })
            break;
        default:
            console.log('false')
            res.json({ status: false, message: "Нет такого типа" })
            break;
    }
})

//Удалить пользователя

router.delete('/delete_by_id', (req, res) => {
    const { UserID, file } = req.query;
    db.serialize(() => {
        db.run(`DELETE FROM User WHERE User_KEY = '${UserID}'`, async (err) => {
            if (err) {
                res.json(false)
            }
            try {
                const result = await removeimg(file);
                if (result) {
                    db.run(`DELETE FROM Favorites_Point WHERE User = '${UserID}'`, (err) => {
                        if (err) {
                            res.json(false)
                        }
                        res.json(true);
                    })
                }
            } catch (error) {
                console.error(error);
            }

        })
    })
})
import { removeimg } from "../Images_upload.js";

import nodemailed from "nodemailer"


const createNewPassword = (length) => {

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;

}

const updatePassbyUser = async (pass, login) => {
    const hashPassword = await bcrypt.hash(pass, 8);
    return new Promise((resolve, reject) => {
        db.serialize(async () => {
            db.run(`UPDATE User SET Password = '${hashPassword}' WHERE Login = '${login}'`, (err) => {
                if (err) {
                    reject(false)
                }
                resolve(true)
            })
        })
    })


}

router.get('/rename_Password', async (req, res) => {

    try {
        const { Login, Email } = req.query;
        // console.log(req.query)
        const transporter = nodemailed.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const newPass = await createNewPassword(8)

        const resolve = await updatePassbyUser(newPass, Login)
        if (resolve) {
            await transporter.sendMail({
                from: `Travel Raters система помощи "den-sochi99@mail.ru"`,
                to: Email,
                subject: "Замена пароля",
                text: `Добрый день. Поступил запрос на смену пароля для пользователя (${Login}), вот ваш новый пароль:${newPass}!`
            })
            console.log("se")
            return res.status(200).send(true)
        }


    } catch (err) {
        return res.json({ status: 500, message: "Ошибка при запросе" })
    }

})

