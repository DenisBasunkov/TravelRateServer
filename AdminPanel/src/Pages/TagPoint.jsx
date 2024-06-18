import axios from "axios"
import { useEffect, useState } from "react"
import { Avatar, Button, Carousel, Col, Divider, Dropdown, FlexboxGrid, IconButton, Input, List, MaskedInput, Modal, Pagination, Panel, Popover, Row, Table, Tabs, Tag, Text, Tooltip, Whisper } from "rsuite"
import { Cell, HeaderCell } from "rsuite-table"
import Column from "rsuite/esm/Table/TableColumn"

import { MdDriveFileRenameOutline, MdDeleteForever, MdOutlineAddBox, MdOutlineCropSquare } from "react-icons/md";
import { LuMinusSquare } from "react-icons/lu";
import { IoIosMore } from "react-icons/io";

export const TagPoint = () => {

    window.onload = () => {
        sellData()
    }
    const [dataPoint, setDataPoint] = useState([])
    const sellData = async (v) => {
        setDataPoint((await axios.get('/api/admin/get_Tag_point')).data)
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
    const [postPerPage, setPostPerPage] = useState(9);

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

            <div style={{ display: "grid", gridTemplateColumns: "35% 65%", gap: "25px" }}>
                <div>
                    <Carousel>
                        {
                            JSON.parse(rowData.Foto_point) == null ? null :
                                JSON.parse(rowData.Foto_point).map(item => {
                                    return <img src={"/api/" + item} />
                                })
                        }
                    </Carousel>
                </div>
                <List style={{ boxSizing: "border-box" }}>
                    {Object.keys(JSON.parse(rowData.Description_point)).map(item => {
                        return <List.Item style={{ padding: "15px 25px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr" }}>
                                <Text>{item}</Text>
                                <Text>{JSON.parse(rowData.Description_point)[item]}</Text>
                            </div>
                        </List.Item>
                    })}
                    <List.Item>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr" }}>
                            <Text>Координаты</Text>
                            <Text>{rowData.Coordinates_point}</Text>
                        </div>
                    </List.Item>
                </List>
            </div>
        </Panel>
    );

    const ExpandCell = ({ rowData, dataKey, ...props }) => (
        <Cell {...props} style={{ padding: 5 }}>
            <IconButton icon={expandedRowKeys.includes(rowData.ID) ? (
                <LuMinusSquare size={"1.6em"} />
            ) : (
                <MdOutlineAddBox size={"1.6em"} />
            )}
                appearance="subtle"
                onClick={() => handleExpand(rowData.ID, expandedRowKeys.includes(rowData.ID))}
                style={{ cursor: 'pointer' }}
            />
        </Cell>
    );

    // 
    return <div>

        <div style={{ width: "90%", margin: "15px auto" }}>
            <Panel bordered>
                <h3>Теги по месту</h3>
            </Panel>
        </div>

        <div style={{ width: "90%", margin: "0 auto" }}>
            <Table
                data={currentData}
                bordered
                cellBordered
                height={500}
                rowHeight={50}
                //     
                rowKey={"ID"}
                expandedRowKeys={expandedRowKeys}
                renderRowExpanded={renderRowExpanded}
                rowExpandedHeight={500}
            >

                {/* <Column width={60} fixed resizable align="center">
                    <HeaderCell></HeaderCell>
                    <Cell>
                        {rowData => (
                            <IconButton icon={<MdDriveFileRenameOutline size={"1.5em"} />} appearance="link" onClick={() => { setDataId(rowData); setIsOpen(true) }} />
                        )}
                    </Cell>
                </Column> */}
                {/* <Column width={50} align="center" >
                    <HeaderCell ></HeaderCell>
                    <ExpandCell dataKey="District" />
                </Column> */}
                <Column flexGrow={1} align="center" >
                    <HeaderCell >#</HeaderCell>
                    <Cell dataKey="KEY" />
                </Column>
                <Column flexGrow={1} align="center" fullText>
                    <HeaderCell>Дата добавления</HeaderCell>
                    <Cell dataKey="Data_Add" />
                    {/* <Cell dataKey="Name_point" >
                        {rowData => <Text style={{ cursor: "pointer" }}>{rowData.Name_point}</Text>}
                    </Cell> */}
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Место</HeaderCell>
                    <Cell dataKey="Tag" >
                        {
                            rowData => <Tag color={rowData.Color}>{rowData.Tag_Name}</Tag>
                        }
                    </Cell>
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Место</HeaderCell>
                    <Cell dataKey="Name_point" />
                </Column>
                <Column flexGrow={1} align="left" fullText >
                    <HeaderCell>Пользователь</HeaderCell>
                    <Cell dataKey="User_name" />
                </Column>


                {/* <Column width={200} align="left" >
                    <HeaderCell>Email</HeaderCell>
                    <Cell dataKey="Email" />
                </Column> */}
                {/* <Column width={150} align="left" >
                    <HeaderCell>Phone</HeaderCell>
                    <Cell dataKey="Phone" />
                </Column> */}
                {/* <Column align="left" >
                    <HeaderCell>Birthday</HeaderCell>
                    <Cell dataKey="Birthday" />
                </Column> */}
                {/* <Column align="left" >
                    <HeaderCell>Foto</HeaderCell>
                    <Cell dataKey="Foto" >
                        {rowData =>
                            <img src={"api/" + rowData.Foto} width={100} />
                        }
                    </Cell>
                </Column> */}
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
                total={dataPoint.length}
                limit={postPerPage}
                activePage={currentPage}
                onChangePage={setCurrentPage}
                layout={['|', 'skip', '|', 'pager', '|', '-']}
            />
            <Button appearance="primary">Добавить тег к месту</Button>
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