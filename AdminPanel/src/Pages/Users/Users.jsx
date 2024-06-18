import axios from "axios"
import { useEffect, useState } from "react"
import { Avatar, Button, Carousel, Col, Divider, Dropdown, FlexboxGrid, IconButton, Input, List, MaskedInput, Modal, Pagination, Panel, Popover, Row, Table, Tabs, Text, Tooltip, Whisper } from "rsuite"
import { Cell, HeaderCell } from "rsuite-table"
import Column from "rsuite/esm/Table/TableColumn"


import { MdDriveFileRenameOutline, MdDeleteForever, MdOutlineAddBox, MdOutlineCropSquare } from "react-icons/md";
import { LuMinusSquare } from "react-icons/lu";
import { IoIosMore } from "react-icons/io";

export const Users = () => {

    window.onload = () => {
        sellData()
    }
    const [dataUser, setDataUser] = useState([])
    const sellData = async (v) => {
        setDataUser((await axios.get('/api/admin/get_User')).data)
    }


    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(9);

    const lastPointIndex = currentPage * postPerPage;
    const firstPostIndex = lastPointIndex - postPerPage;
    const currentData = dataUser.slice(firstPostIndex, lastPointIndex);
    const Count = dataUser.length / postPerPage

    const [isOpen, setIsOpen] = useState(false)
    const [dataId, setDataId] = useState({})

    const Delete_User = async (UserData) => {
        const ID = UserData.User_KEY;
        const file = UserData.Foto;


        if (confirm("Желаете удалить аккаунт?")) {
            const { data } = await axios({
                method: "delete",
                url: "/api/user/delete_by_id",
                params: {
                    UserID: ID,
                    file: file
                },
            })
            if (data) {
                location.reload()
            }
        }
    }

    useEffect(() => {
        sellData()
    }, [])

    // !



    // 

    return <div>
        <div style={{ width: "90%", margin: "15px auto" }}>
            <Panel bordered>
                <h3>Пользователи</h3>
            </Panel>
        </div>
        <div style={{ width: "90%", margin: "25px auto" }}>
            <Table
                data={currentData}
                height={400}
                bordered
                cellBordered
                rowHeight={80}
            >
                {/* <Column flexGrow={1} fixed resizable align="center">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {rowData => (
                            <IconButton icon={<MdDriveFileRenameOutline size={"1.5em"} />} appearance="link" onClick={() => { setDataId(rowData); setIsOpen(true) }} />
                        )}

                    </Cell>
                </Column> */}
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="User_KEY" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>User_name</HeaderCell>
                    <Cell dataKey="User_name" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Login</HeaderCell>
                    <Cell dataKey="Login" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Password</HeaderCell>
                    <Cell dataKey="Password" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="Email" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey="Phone" />
                </Column>
                <Column flexGrow={1} align="left" fullText >
                    <HeaderCell>Birthday</HeaderCell>
                    <Cell dataKey="Birthday" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Foto</HeaderCell>
                    <Cell dataKey="Foto" >
                        {rowData =>
                            <img src={"api/" + rowData.Foto} style={{ width: "50px", height: "50px" }} />
                        }
                    </Cell>
                </Column>
                <Column width={50} align="center" fixed>
                    <HeaderCell></HeaderCell>
                    <Cell style={{ padding: '5px' }}>
                        {rowData => (
                            <Whisper
                                trigger="click"
                                placement="bottomEnd"
                                speaker={<Popover style={{ padding: "0 5px" }}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item icon={<MdDriveFileRenameOutline size={'1.5em'} />}
                                            onClick={() => { setDataId(rowData); setIsOpen(true) }}
                                        >Редактировать</Dropdown.Item>
                                        {/* <Dropdown.Item>fdf</Dropdown.Item> */}
                                        <Divider style={{ margin: "5px" }} />
                                        <Dropdown.Item icon={<MdDeleteForever color="red" size={'1.5em'} />}
                                            onClick={() => Delete_User(rowData)}
                                        >Удалить</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Popover>}
                            >
                                <IconButton icon={<IoIosMore />} />
                            </Whisper>

                        )}
                    </Cell>
                </Column>


            </Table>
        </div>
        <div style={{ padding: "15px 25px", display: "flex", justifyContent: "space-between" }}>
            <Pagination
                next
                last
                prev
                first
                ellipsis={true}
                maxButtons={15}
                size="md"
                total={dataUser.length}
                limit={postPerPage}
                activePage={currentPage}
                onChangePage={setCurrentPage}
                layout={['|', 'skip', '|', 'pager', '|', '-']}
            />
            <Button appearance="primary">Добавить пользователя</Button>
        </div>


        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header>
                <Text muted>
                    {dataId.User_KEY}
                </Text>
            </Modal.Header>
            <Modal.Body>

                <form action="" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div>
                        <label>Имя пользователя</label>
                        <Input required defaultValue={dataId.User_name} />
                    </div>
                    <div>
                        <label>Логин</label>
                        <Input required defaultValue={dataId.Login} />
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ width: "100%" }}>
                            <label>Почта</label>
                            <Input required defaultValue={dataId.Email} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <label>Телефон</label>
                            <MaskedInput mask={['+', '7', '(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                showMask required defaultValue={dataId.Phone} />

                        </div>
                    </div>
                    <div>
                        <label>День рождения</label>
                        <MaskedInput mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]} showMask required defaultValue={dataId.Birthday} />
                    </div>
                    <Button appearance="primary">Изменить</Button>
                </form>
            </Modal.Body>

        </Modal>

    </div >
}