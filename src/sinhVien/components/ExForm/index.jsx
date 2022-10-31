import { useEffect, useState } from "react";
import axios from 'axios';
import FileInput from "../FileInput";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import { DateRangeTwoTone } from "@mui/icons-material";

const ExForm = () => {
    let { maBaiTap, maMon } = useParams();
    const [data, setData] = useState({
        maBT: Number(maBaiTap),
        nguoiNop: localStorage.getItem("id"),
        link: "",
        ngayNop: "",
        ghiChu: "",
        idTopic: ""
    });
    const [topicList, setTopicList] = useState([]);

    useEffect(() => {
        axios.get(' http://localhost:8080/api/topicList/' + maMon).then(res => {
            setTopicList(res.data);
            setData({ ...data, idTopic: res.data[0].idTopic });
        })
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleInputState = (name, value) => {
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = process.env.REACT_APP_API_URL + "/taiLieu";
            console.log(data);
            const { data: res } = await axios.post(url, data);
            console.log(res);
            if (res.length > 0) {
                alert("Nộp thành công!");
                // window.location.reload();
            };

        } catch (error) {
            console.log(error)
            alert(error);
        }
    };

    // const handleTime = () => {
    //     let d = new Date();
    //     new Intl.DateTimeFormat('vi', { dateStyle: 'short', timeStyle: 'long' }).format(date)
    // }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit} >
                <h1 className={styles.heading}>Nộp bài</h1>
                <FileInput
                    name="link"
                    label="Chọn ảnh"
                    handleInputState={handleInputState}
                    type="image"
                    value={data.link}
                />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Ghi chú"
                    name="ghiChu"
                    onChange={handleChange}
                    value={data.ghiChu}
                />
                <select
                    className={styles.input}
                    placeholder="Topic"
                    name="idTopic"
                    onChange={handleChange}
                    value={data.idTopic}>
                    {topicList.map(item => (
                        <option value={item.idTopic}> {item.ten}</option>
                    ))}
                </select>
                <button type="submit" className={styles.submit_btn} onClick={() => {
                    const date = new Date();
                    setData({ ...data, ngayNop: date.toUTCString() });
                    console.log(data);
                }} >
                    Nộp
                </button>
            </form>
        </div>
    );
};

export default ExForm;