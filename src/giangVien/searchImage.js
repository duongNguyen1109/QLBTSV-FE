import { FormControl, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

export default function SearchImage() {
    const [mon, setMon] = useState('');
    const [monList, setMonList] = useState([]);
    const [topicList, setTopicList] = useState([]);
    const [topic, setTopic] = useState('');
    const [kieuBT, setKieuBT] = useState('');
    const [imgList, setImgList] = useState([]);
    const [imgDetail, setImgDetail] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/monHocList/' + localStorage.getItem("id")).then(res => {
            setMonList(res.data);
        })
    }, []);

    const getTopicList = (maMon) => {
        axios.get('http://localhost:8080/api/topicList/' + maMon).then(res => {
            setTopicList(res.data);
        })
    }

    const handleChange = (e) => {
        if (e.target.name === 'mon') {
            setMon(e.target.value);
            if (e.target.value !== '') {
                getTopicList(e.target.value);
            } else { setTopicList([]); }
        } else if (e.target.name === 'topic') {
            setTopic(Number(e.target.value));
        }
    }

    const searchImg = () => {
        let data = {
            idTopic: (topic !== '') ? topic : 'null',
            kieuBT: (kieuBT !== '') ? kieuBT : 'null',
            maMon: mon
        }
        console.log(data);
        axios.get('http://localhost:8080/api/searchImg', {
            params: data
        }).then(res => {
            if (res.status === 200) {
                setImgList(res.data);
            }
        });
    }

    const showDetail = (maTL) => {
        axios.get('http://localhost:8080/api/taiLieu/' + maTL).then(res => {
            if (res.status === 200) {
                setImgDetail(res.data[0]);
                setShow(true);
            }
        })
    }

    return (
        <div className="mt-5 container">
            <Grid className="mb-3" container spacing={2}>
                <Grid item xs={12} sm={12} md={5}>
                    <FormControl fullWidth>
                        <InputLabel id="mon-input-label">Môn học</InputLabel>
                        <Select
                            name='mon'
                            labelId="mon-input-label"
                            id="mon-input"
                            value={mon}
                            label="Môn học"
                            onChange={handleChange}
                        >
                            <MenuItem value={''}><em>None</em></MenuItem>
                            {monList.map(item => (
                                <MenuItem key={item.maMon} value={item.maMon}>{item.tenMon}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="kieuBT-input-label">Kiểu bài tập</InputLabel>
                        <Select
                            labelId="kieuBT-input-label"
                            id="kieuBT-input"
                            value={kieuBT}
                            label="Kiểu bài tập"
                            onChange={(e) => setKieuBT(Number(e.target.value))}
                        >
                            <MenuItem value={''}><em>None</em></MenuItem>
                            <MenuItem value={0}>Cá nhân</MenuItem>
                            <MenuItem value={1}>Nhóm</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={5}>
                    <FormControl fullWidth>
                        <InputLabel id="topic-input-label">Topic</InputLabel>
                        <Select
                            name='topic'
                            labelId="topic-input-label"
                            id="topic-input"
                            value={topic}
                            label="Topic"
                            onChange={handleChange}
                        >
                            <MenuItem value={''}><em>None</em></MenuItem>
                            {topicList.map(item => (
                                <MenuItem key={item.idTopic} value={item.idTopic}>{item.ten}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Button color="primary" onClick={searchImg}>Tìm kiếm hình ảnh</Button>
            <ImageList className="mt-4" variant="masonry" cols={3} gap={8}>
                {imgList.map((item) => (
                    <div>
                        <ImageListItem style={{ cursor: 'pointer' }} key={item.maTL} onClick={() => showDetail(item.maTL)}>
                            <img
                                src={`${item.link}?w=248&fit=crop&auto=format`}
                                srcSet={`${item.link}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                loading="lazy"
                            />
                        </ImageListItem>
                    </div>
                ))}
            </ImageList>
            <Modal show={show} onHide={() => setShow(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Thông tin hình ảnh </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>
                                    <b>Thực hiện:</b>
                                    {imgDetail.kieuBT === 0 ? `${imgDetail.nguoiNop.hoTen} - ${imgDetail.nguoiNop.ma}` : ""}
                                </p>
                                <p>
                                    <b>Ngày nộp:</b>
                                    {imgDetail.ngayNop ? imgDetail.ngayNop : ""}
                                </p>
                                <p>
                                    <b>Môn:</b>
                                    {imgDetail.tenMon ? imgDetail.tenMon : ""}
                                </p>
                                <p>
                                    <b>Lớp:</b>
                                    {imgDetail.tenLop ? imgDetail.tenLop : ""}
                                </p>
                                <p>
                                    <b>Bài tập:</b>
                                    {imgDetail.tenBT ? imgDetail.tenBT : ""}
                                </p>
                            </Modal.Body>
                        </Modal>
        </div>
    )
}