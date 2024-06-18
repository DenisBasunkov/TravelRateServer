import axios from "axios"
import { useEffect, useState } from "react"
import { Avatar, Button, Carousel, Col, Divider, Dropdown, FlexboxGrid, IconButton, Input, InputPicker, List, MaskedInput, Modal, Pagination, Panel, Popover, Row, SelectPicker, Table, Tabs, Text, Tooltip, Uploader, Whisper } from "rsuite"
import { Cell, HeaderCell } from "rsuite-table"
import Column from "rsuite/esm/Table/TableColumn"

import { MdDriveFileRenameOutline, MdDeleteForever, MdOutlineAddBox, MdOutlineCropSquare } from "react-icons/md";
import { LuMinusSquare } from "react-icons/lu";
import { IoIosMore } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { TbCameraPlus } from "react-icons/tb";

export const Point = () => {

    window.onload = () => {
        sellData()
        sellcategory()
        sellCity()
    }
    const [dataPoint, setDataPoint] = useState([])
    const [Category, setCategory] = useState([])
    const [City, setCity] = useState([])

    const sellData = async (v) => {
        setDataPoint((await axios.get('/api/admin/get_Point')).data)
    }

    const sellCity = async (v) => {
        setCity((await axios.get('/api/admin/get_City')).data)
    }

    const sellcategory = async (v) => {
        setCategory((await axios.get('/api/admin/get_Categories_Point')).data)
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
        sellcategory()
        sellCity()
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

    const [District, setDistrict] = useState('')
    const [Subject, setSubject] = useState('')

    // 
    return <div>

        <div style={{ width: "90%", margin: "15px auto" }}>
            <Panel bordered>
                <h3>Туристические места</h3>
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
                <Column width={50} align="center" >
                    <HeaderCell ></HeaderCell>
                    <ExpandCell dataKey="Name_point" />
                </Column>
                <Column width={50} align="center" >
                    <HeaderCell >#</HeaderCell>
                    <Cell dataKey="ID" />
                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Названия места</HeaderCell>
                    <Cell dataKey="Name_point" />

                </Column>
                <Column flexGrow={1} align="left" fullText>
                    <HeaderCell>Адрес</HeaderCell>
                    <Cell dataKey="Adress_point" />
                </Column>
                <Column flexGrow={1} align="left" fullText  >
                    <HeaderCell>Город</HeaderCell>
                    <Cell dataKey="City" />
                </Column>
                <Column flexGrow={.5} align="center" fullText>
                    <HeaderCell>Категория места</HeaderCell>
                    <Cell dataKey="Categories_Point" />
                </Column>
                <Column flexGrow={.5} align="center" >
                    <HeaderCell>Рейтинг</HeaderCell>
                    <Cell dataKey="Rating_point" />
                </Column>
                <Column flexGrow={.5} align="center" >
                    <HeaderCell >Отзывы</HeaderCell>
                    <Cell dataKey="Koll_Rating" />
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
                                        <Dropdown.Item onClick={() => { setIsOpen(true); setDataId(rowData) }} icon={<MdDriveFileRenameOutline size={'1.5em'} />}>Редактировать</Dropdown.Item>
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
                maxButtons={20}
                size="md"
                total={dataPoint.length}
                limit={postPerPage}
                activePage={currentPage}
                onChangePage={setCurrentPage}
                layout={['|', 'skip', '|', 'pager', '|', '-']}
            />
            <Button appearance="primary" onClick={() => setIsOpen(true)}>Добавить новое место</Button>
        </div>


        <Modal open={isOpen} onClose={() => { setIsOpen(false); setDataId(null) }} size={"90%"}>
            <Modal.Header>
                <h3>
                    {
                        dataId == null ? `Добавить новое место` : "Место №" + dataId.ID
                    }
                </h3>
            </Modal.Header>
            <Modal.Body style={{ boxSizing: "border-box" }}>

                <form action="" style={{ display: "grid", gridTemplateColumns: "50% 50%", gap: "15px" }}>
                    <div>

                        <div>
                            <label>Название места</label>
                            <Input required defaultValue={dataId != null ? dataId.Name_point : ""} />
                        </div>
                        <div>
                            <label>Адрес</label>
                            <Input required defaultValue={dataId != null ? dataId.Adress_point : ""} />
                        </div>
                        <div>
                            <label>Категория места</label>
                            <SelectPicker
                                block
                                placeholder=""
                                data={Category.map(item => ({ label: item.Name_Categories, value: item.ID }))}
                                defaultValue={dataId == null ? "" : Category.find(item => item.ID === dataId.Categories_Point) != null ? Category.find(item => item.ID === dataId.Categories_Point).ID : null}
                            />
                        </div>

                        <Panel bordered>
                            <Panel bordered >
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Input placeholder="Название" />
                                    <Input placeholder="Описание" />
                                </div>
                                <Button appearance="primary" style={{ margin: "5px", width: "100%" }}>Добавить</Button>

                            </Panel>
                            <List>
                                {
                                    dataId == null ? "" :
                                        dataId.Description_point == undefined ? "" :
                                            Object.keys(JSON.parse(dataId.Description_point)).map(item => {
                                                return <List.Item style={{}}>
                                                    <h6> <IconButton icon={<TiDelete color="red" />} />{item}:</h6>
                                                    {JSON.parse(dataId.Description_point)[item]}
                                                </List.Item>
                                            })
                                }
                            </List>
                        </Panel>

                    </div>
                    <div>
                        <div>
                            <Carousel>
                                {
                                    dataId == null ? "" :
                                        dataId.Foto_point == undefined ? "" :
                                            JSON.parse(dataId.Foto_point).map(item => {
                                                return <img src={'/api/' + item} />
                                            })
                                }
                            </Carousel>
                            <Panel bordered >
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>

                                    {
                                        dataId == null ? "" :
                                            dataId.Foto_point == undefined ? "" :
                                                JSON.parse(dataId.Foto_point).map(item => {
                                                    return <img src={'/api/' + item} width={60} height={60} />
                                                })
                                    }
                                    <Uploader multiple listType="picture" action="//jsonplaceholder.typicode.com/posts/">
                                        <button>
                                            <TbCameraPlus />
                                        </button>
                                    </Uploader>
                                </div>
                            </Panel>
                        </div>
                        <Panel bordered >
                            <h6>Выбор города</h6>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                                <InputPicker
                                    defaultValue={dataId == null ? "" : City.find(item => item.ID === dataId.City) != null ? City.find(item => item.ID === dataId.City).District : ""}
                                    onChange={setDistrict}
                                    data={Array.from(new Set(City.map(({ District }) => JSON.stringify({ label: District, value: District })))).map(item => JSON.parse(item))}
                                />
                                <InputPicker

                                    onChange={setSubject}
                                    defaultValue={dataId == null ? "" : City.find(item => item.ID === dataId.City) != null ? City.find(item => item.ID === dataId.City).Subject : ""}
                                    data={City.filter((item) => item.District == District).map(({ Subject }) => ({ label: Subject, value: Subject }))}
                                />
                                <InputPicker

                                    defaultValue={dataId == null ? "" : City.find(item => item.ID === dataId.City) != null ? City.find(item => item.ID === dataId.City).Name : ""}
                                    data={City.filter((item) => item.Subject == Subject).map(({ Name }) => ({ label: Name, value: Name }))}
                                />
                            </div>
                        </Panel>
                        <Panel bordered >
                            <h6>Выбор города</h6>
                            <Input defaultValue={dataId != null ? dataId.Coordinates_point : ""} />
                        </Panel>

                    </div>

                    <Button appearance="primary">Изменить</Button>
                </form>
            </Modal.Body>

        </Modal>

    </div >
}


// <div>
//                         <label>Логин</label>
//                         <Input required defaultValue={dataId.Login} />
//                     </div>
//                     <div style={{ display: "flex", gap: "15px" }}>
//                         <div style={{ width: "100%" }}>
//                             <label>Почта</label>
//                             <Input required defaultValue={dataId.Email} />
//                         </div>
//                         <div style={{ width: "100%" }}>
//                             <label>Телефон</label>
//                             <MaskedInput mask={['+', '7', '(', /\d/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
//                                 showMask required defaultValue={dataId.Phone} />

//                         </div>
//                     </div>
//                     <div>
//                         <label>День рождения</label>
//                         <MaskedInput mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]} showMask required defaultValue={dataId.Birthday} />
//                     </div>