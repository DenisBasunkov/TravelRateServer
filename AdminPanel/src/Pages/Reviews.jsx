import axios from "axios"
import { useEffect, useState } from "react"
import { Avatar, Button, Carousel, Col, Divider, Dropdown, FlexboxGrid, IconButton, Input, List, MaskedInput, Modal, Pagination, Panel, Popover, Rate, Row, Table, Tabs, Tag, Text, Tooltip, Whisper } from "rsuite"
import { Cell, HeaderCell } from "rsuite-table"
import Column from "rsuite/esm/Table/TableColumn"

import { MdDriveFileRenameOutline, MdDeleteForever, MdOutlineAddBox, MdOutlineCropSquare } from "react-icons/md";
import { LuMinusSquare } from "react-icons/lu";
import { IoIosMore } from "react-icons/io";

export const Reviews = () => {

    window.onload = () => {

        sellData()
    }
    const [dataPoint, setDataPoint] = useState([])
    const sellData = async (v) => {
        setDataPoint((await axios.get('/api/admin/get_Reviews')).data)
    }

    const [isOpen, setIsOpen] = useState(false)
    const [dataId, setDataId] = useState({})

    const Delete_User = async (UserData) => {
        const ID = UserData.ID;
        if (confirm("Желаете удалить аккаунт?")) {
            const { data } = await axios({
                method: "delete",
                url: "/api/admin/delete_Point",
                params: {
                    ID: ID,
                },
            })
            if (data) {
                location.reload()
            }
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(7);

    const lastPointIndex = currentPage * postPerPage;
    const firstPostIndex = lastPointIndex - postPerPage;
    const currentData = dataPoint.slice(firstPostIndex, lastPointIndex);
    const Count = dataPoint.length / postPerPage

    useEffect(() => {
        sellData()
    }, [])
    // !

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleExpand = (rowKey, isExpanded) => {
        const nextExpandedRowKeys = isExpanded
            ? expandedRowKeys.filter(key => key !== rowKey)
            : [...expandedRowKeys, rowKey];
        setExpandedRowKeys(nextExpandedRowKeys);
    };
    //{rowData.Foto_point}
    const renderRowExpanded = rowData => (
        <Panel bordered>

            <div style={{ display: "grid", gridTemplateColumns: "50% 50%", gap: "25px" }}>

                <div>
                    <Carousel>
                        {
                            JSON.parse(rowData.Foto) == null ? null :
                                JSON.parse(rowData.Foto).map(item => {
                                    return <img src={"/api/" + item} />
                                })
                        }
                    </Carousel>
                </div>
                <List style={{ boxSizing: "border-box" }}>
                    <List.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", alignItems: "center", justifyItems: "center" }}>
                            <Avatar src={"/api/" + rowData.Avatar} />
                            <Text>{!rowData.User_name ? "Пользователь удален" : rowData.User_name}</Text>
                        </div>
                    </List.Item>
                    <List.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", alignItems: "center", }}>
                            <Text muted>Рейтинг</Text>
                            <Rate size="sm" value={rowData.Rating_Reviews} readOnly color="orange" />
                        </div>
                    </List.Item>
                    <List.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr" }}>
                            <Text muted>Место</Text>
                            <Text>{rowData.Name_point}</Text>
                        </div>
                    </List.Item>
                    <List.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr" }}>
                            <Text muted>Текст отзыва</Text>
                            <Text>{rowData.Text_Reviews}</Text>
                        </div>
                    </List.Item>
                </List>
            </div>
        </Panel>
    );

    const ExpandCell = ({ rowData, dataKey, ...props }) => (
        <Cell {...props} style={{ padding: 5 }}>
            <IconButton icon={expandedRowKeys.includes(rowData.Key_Reviews) ? (
                <LuMinusSquare size={"1.6em"} />
            ) : (
                <MdOutlineAddBox size={"1.6em"} />
            )}
                appearance="subtle"
                onClick={() => handleExpand(rowData.Key_Reviews, expandedRowKeys.includes(rowData.Key_Reviews))}
                style={{ cursor: 'pointer' }}
            />
        </Cell>
    );

    // 
    return <div>

        <div style={{ width: "90%", margin: "15px auto" }}>
            <Panel bordered>
                <h3>Отзывы пользователей</h3>
                {/* <form style={{ marginTop: "25px" }}>
                    <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px" }}>
                            <label>Тип места</label>
                            <Input />
                            <Button appearance="primary">Добавить</Button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <label>Описание</label>
                            <Input as="textarea" rows={6} />
                        </div>
                    </div>
                </form> */}
            </Panel>
        </div>

        <div style={{ width: "90%", margin: "0 auto" }}>
            <Table
                data={currentData}
                bordered
                cellBordered
                height={400}
                rowHeight={50}
                //     
                rowKey={"Key_Reviews"}
                expandedRowKeys={expandedRowKeys}
                renderRowExpanded={renderRowExpanded}
                rowExpandedHeight={500}
            >

                <Column width={50} align="center" >
                    <HeaderCell ></HeaderCell>
                    <ExpandCell dataKey="Key_Reviews" />
                </Column>
                <Column flexGrow={1} align="center" fullText>
                    <HeaderCell >#</HeaderCell>
                    <Cell dataKey="Key_Reviews" />
                </Column>
                <Column flexGrow={1} align="center" >
                    <HeaderCell >Дата добавления</HeaderCell>
                    <Cell dataKey="Date_Reviews" />
                </Column>
                <Column width={80} align="center" fullText>
                    <HeaderCell>Аватар</HeaderCell>
                    <Cell dataKey="Avatar" >
                        {
                            rowData => <Avatar src={"/api/" + rowData.Avatar} />
                        }
                    </Cell>
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Пользователь</HeaderCell>
                    <Cell dataKey="User_name" >
                        {
                            rowData => <Text>{!rowData.User_name ? "Пользователь удален" : rowData.User_name}</Text>
                        }
                    </Cell>
                </Column>
                <Column width={100} align="center" fullText>
                    <HeaderCell>Место</HeaderCell>
                    <Cell dataKey="Point" />
                </Column>
                <Column flexGrow={1} align="center" fullText>
                    <HeaderCell>Оценка</HeaderCell>
                    <Cell dataKey="Rating_Reviews" >
                        {rowData =>
                            <Rate size="xs" value={rowData.Rating_Reviews} readOnly color="orange" />
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
                                        <Dropdown.Item icon={<MdDriveFileRenameOutline size={'1.5em'} />}>Редактировать</Dropdown.Item>
                                        {/* <Dropdown.Item>fdf</Dropdown.Item> */}
                                        <Divider style={{ margin: "5px" }} />
                                        <Dropdown.Item icon={<MdDeleteForever color="red" size={'1.5em'} />}>Удалить</Dropdown.Item>
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
                total={dataPoint.length}
                limit={postPerPage}
                activePage={currentPage}
                onChangePage={setCurrentPage}
                layout={['|', 'skip', '|', 'pager', '|', '-']}
            />
            {/* <Button appearance="primary">Добавить тег</Button> */}
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