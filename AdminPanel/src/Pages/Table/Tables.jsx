import axios from "axios"
import { useEffect, useState } from "react"
import { Avatar, Tabs } from "rsuite"


export const Tables = () => {

    window.onload = () => {
        // userData()
        // pointData()
        sellData()
    }

    const [user, setUser] = useState([{}])
    const [point, setpoint] = useState([{}])
    const [data, setData] = useState([{}])

    const userData = async () => {
        const { data } = await axios.get(`/api/user/`)
        setUser(data)
    }
    const pointData = async () => {
        const { data } = await axios.get(`/api/point_type/`)
        setpoint(data)
    }

    const sellData = async (v) => {
        const { data } = await axios.get(`/api/${v}`)
        setData(data)
    }

    useEffect(() => {
        // userData()
        // pointData()
        sellData()
    }, [])

    const DataTable = () => {
        return <table>
            <thead>
                <tr>
                    {
                        Object.keys(data[0]) == null ? null :
                            Object.keys(data[0]).map((item) => {
                                return <th>{item}</th>
                            })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    data.map((data, index) => {
                        return <tr key={index}>
                            {
                                Object.entries(data).map(([key, value]) => {
                                    // if (key == "Foto") {
                                    //     return <td key={key}>
                                    //         <Avatar src={"api/" + value} size="xl" />
                                    //     </td>
                                    // } else {
                                    //     return <td key={key}>
                                    //         {value}
                                    //     </td>
                                    // }
                                    return <td key={key}>
                                        {value}
                                    </td>
                                })
                            }
                        </tr>
                    })
                }
            </tbody>
        </table>
    }

    return <div>
        <Tabs onSelect={sellData}>
            <Tabs.Tab eventKey="user/" title="Пользователь">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="point_type/" title="Места">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="point_type/get_type" title="Типы">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="point_type/get_category" title="Категории">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="point_type/All_city" title="Города">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="favorite/" title="Избранное">
                {DataTable()}
            </Tabs.Tab>
            <Tabs.Tab eventKey="coments/" title="Коментарии">
                {DataTable()}
            </Tabs.Tab>
        </Tabs>
    </div>
}