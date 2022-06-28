import { useState } from "react";
import axios from 'axios';
import FileInput from "../FileInput";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import { DateRangeTwoTone } from "@mui/icons-material";

const SongForm = () => {
    let { maBaiTap, maLop } = useParams();
    const [data, setData] = useState({
        maBT: maBaiTap,
        nguoiNop: localStorage.getItem("id"),
        link: "",
        ngayNop: "",
        ghiChu: "",
    });

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
            const { data: res } = await axios.post(url, data);
            console.log(res);
            if (res.status === 200) alert("Nộp thành công!");
        } catch (error) {
            console.log(error)
            alert(error);
        }
    };

    // let d = new Date();
    // let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    // let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    // let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    // let dat = `${ye}-${mo}-${da}`;
    // console.log(typeof (dat));

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
                <button type="submit" className={styles.submit_btn} onClick={() => {
                    const date = new Date();
                    setData({ ...data, ngayNop: date.toISOString() });
                    console.log(data);
                }} >
                    Nộp
                </button>
            </form>
        </div>
    );
};

export default SongForm;