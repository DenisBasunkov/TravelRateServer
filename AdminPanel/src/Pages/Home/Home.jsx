import { useState } from "react"
import { Button, Input, Nav, Sidenav } from "rsuite"
import { Header } from "../../Components/Header"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Users } from "../Users/Users"
import { Point } from "../Point"
import { CiViewTable } from "react-icons/ci";
import Table from '@rsuite/icons/Table';
import Off from "@rsuite/icons/Off"
import Branch from "@rsuite/icons/Branch"
import { City } from "../City"
import { Categorie } from "../Categories"
import { TypePoint } from "../TypePoint.jsx"
import { Tags } from "../Tags"
import { Reviews } from "../Reviews"
import { TagPoint } from "../TagPoint.jsx"

export const Home = () => {

    const [auth, setAuth] = useState({ login: "", password: "" })

    const [isAuth, setIsAuth] = useState(false)

    window.onload = () => {
        setIsAuth(sessionStorage.getItem("isAuth"))
    }

    const Submit = (e) => {
        e.preventDefault()
        if (JSON.stringify(auth) === JSON.stringify({ login: "admin", password: "12345" })) {
            sessionStorage.setItem("isAuth", true)
            location.href = "/Point"
        } else {

        }

    }


    const router = createBrowserRouter([
        {
            path: "/",
            element: <></>
        },
        {
            path: "/User",
            element: <Users />
        },
        {
            path: "/Point",
            element: <Point />
        },
        {
            path: "/City",
            element: <City />
        },
        {
            path: "/Categories",
            element: <Categorie />
        },
        {
            path: "/TypePoint",
            element: <TypePoint />
        },
        {
            path: "/Tags",
            element: <Tags />

        },
        {
            path: "/Reviews",
            element: <Reviews />
        },
        {
            path: "/TagPoint",
            element: <TagPoint />
        },
        {
            path: "/FavoritesPoint",
            element: <Reviews />
        },


    ])
    const [expanded, setExpanded] = useState(false);

    return <div>
        <Header />

        {
            isAuth ? <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "25vh" }}>
                <div>
                    <form onSubmit={Submit} style={{
                        boxShadow: "0 0 6px 0 hsla(0,0%,0%,.5)",
                        width: "450px",
                        padding: "15px 25px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                    }}>
                        <Input placeholder="Логин" required value={auth.login} onChange={(v, e) => setAuth({ ...auth, login: v })} />
                        <Input placeholder="Пароль" type="password" required value={auth.password} onChange={(v, e) => setAuth({ ...auth, password: v })} />
                        <Button appearance="primary" type="submit">Войти</Button>
                    </form>
                </div>
            </div> : null
        }

        <div style={{ display: "grid", gridTemplateColumns: "200px 80%", gridTemplateRows: "auto", height: "100vh" }}>
            {
                isAuth ? null : <Sidenav expanded={expanded} >
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Menu placement="rightStart" eventKey="3" title="Таблицы" icon={<Table />} >
                                <Nav.Item onClick={() => location.href = 'User'}>Пользователи</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'Point'}>Места</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'City'}>Города</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'Categories'}>Категории мест</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'TypePoint'}>Тип места</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'Tags'}>Теги</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'Reviews'}>Отзывы пользователей</Nav.Item>
                            </Nav.Menu>
                            <Nav.Menu placement="rightStart" eventKey="4" title="Связи таблиц" icon={<Branch />}>
                                <Nav.Item onClick={() => location.href = 'TagPoint'}>Теги мест</Nav.Item>
                                <Nav.Item onClick={() => location.href = 'FavoritesPoint'}>Списки избранного</Nav.Item>
                            </Nav.Menu>

                            <Nav.Item

                                icon={<Off color="red" />}
                                onClick={() => { sessionStorage.setItem("isAuth", false); location.href = "/" }}>Выйти</Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                    <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
                </Sidenav>
            }

            <RouterProvider router={router} />
        </div>
    </div>

}