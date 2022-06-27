import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import '../style/AddMon.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";

const initialState = {
    maMon: "",
    tenMon: "",
};

const AddMon = () => {

    const [state, setState] = useState(initialState);
    let navigate = useNavigate();

    const { maMon } = useParams();

    useEffect(() => {
        if (maMon) {
            getSingleMon(maMon);
        }
    }, [maMon])

    const getSingleMon = async (maMon) => {
        const response = await axios.get(`http://localhost:8080/api/monHoc/${maMon}`);
        if (response.status === 200) {
            setState({ ...response.data[0] });

        }
    }

    // const { ma, hoTen, SDT, email, diaChi, ngaySinh, loaiTK, khoa, lop, khoaHoc } = initialState;

    const addMonHoc = async (data) => {
        const response = await axios.post("http://localhost:8080/api/monHoc", data);
        if (response.status === 200) {
            toast.success('Tạo mới thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    const updateMonHoc = async (data, maMon) => {
        const response = await axios.put(`http://localhost:8080/api/monHoc/${maMon}`, data);
        if (response.status === 200) {
            toast.success('Cập nhật thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
            navigate(`/mon`);
            setState(initialState);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let check = 1;

        for (let key in state) {
            if (key === "maMon") {
                if (state[key].length >= 10) {
                    toast.error('Mã môn phải ít hơn 10 ký tự', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                    check = 0;
                }
            } else if (key === "tenMon") {
                if (state[key] === "") {
                    toast.error('Tên môn không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                    check = 0;
                }
            }
        }

        if (check === 1) {
            if (!maMon) {
                addMonHoc(state);
            } else {
                updateMonHoc(state, maMon);
            }

        }

    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "maMon") {
            value = value.replace(/[^a-zA-Z0-9]/g, '');
            setState({ ...state, [name]: value });
        } else if (name === "tenMon") {
            value = value.replace(/[&#,+()$~%.'":*?<>{}]/g, '');
            setState({ ...state, [name]: value });
        }
    }

    return (
        <div className="container">
            <div className="labelAdd"><h4>Thêm mới môn học</h4></div>
            <form onSubmit={handleSubmit} >
                <div className="row justify-content-between">
                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="maMon">Mã</label>
                        <input className="col-sm-8" type="text" id="maMon" name="maMon" placeholder="Nhap ma mon" onChange={handleInputChange} value={state.maMon} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="tenMon">Tên môn học</label>
                        <input className="col-sm-8" type="text" id="tenMon" name="tenMon" placeholder="Nhap ten mon" onChange={handleInputChange} value={state.tenMon} />
                    </div>

                    <div className="row justify-content-evenly">
                        <div className="col-sm-6">
                            <div className="row">
                                <input type="submit" value={maMon ? "Cập nhập" : "Thêm"} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddMon