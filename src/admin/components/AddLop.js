import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import '../style/AddLop.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";

const initialState = {
    tenLop: "",
    namHoc: "",
    ky: 1,
    maGV: "",
    maMon: "",
};

const AddLop = () => {

    const [state, setState] = useState(initialState);
    let navigate = useNavigate();

    const [giaoVien, setGiaoVien] = useState();
    const [monHoc, setMonHoc] = useState();

    const { maLop } = useParams();

    useEffect(() => {
        if (maLop) {
            getSingleLop(maLop);
        }
        getGiaoVien();
        getMonHoc();
    }, [maLop])

    const getSingleLop = async (maLop) => {
        const response = await axios.get(`http://localhost:8080/api/lopHoc/${maLop}`);
        if (response.status === 200) {
            setState({ ...response.data[0] });

        }
    }

    const getGiaoVien = async () => {
        const response = await axios.get(`http://localhost:8080/api/taiKhoanGV`);
        if (response.status === 200){
            setGiaoVien(response.data);
        }
            
    }

    const getMonHoc = async () => {
        const response = await axios.get(`http://localhost:8080/api/monHocList`);
        if(response.status === 200){
            setMonHoc(response.data);
        }
            
    }

    // const { ma, hoTen, SDT, email, diaChi, ngaySinh, loaiTK, khoa, lop, khoaHoc } = initialState;

    const addLopHoc = async (data) => {
        const response = await axios.post("http://localhost:8080/api/lopHoc", data);
        if (response.status === 200) {
            toast.success('Tạo mới thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    const updateLopHoc = async (data, maLop) => {
        const response = await axios.put(`http://localhost:8080/api/lopHoc/${maLop}`, data);
        if (response.status === 200) {
            toast.success('Cập nhật thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
            navigate(`/lop`);
            setState(initialState);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let check = 1;

        for (let key in state) {
            if (key === "tenLop") {
                if (state[key] === "") {
                    toast.error('Tên lớp không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                    check = 0;
                }
            } else if(key === "maGV") {
                if(state[key] === ""){
                    state[key] = giaoVien[0].ma;
                }
            } else if(key === "maMon") {
                if(state[key] === ""){
                    state[key] = monHoc[0].maMon;
                }
            }
            else if (state[key] === "") state[key] = null;
        }

        if (check === 1) {
            if (!maLop) {
                addLopHoc(state);
            } else {
                updateLopHoc(state, maLop);
            }

        }

    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "ky") {
            setState({ ...state, [name]: Number(value) });
        // }
        //  else if (name === "namHoc") {
        //     value = value.replace(/[^0-9]/g, '');
        //     setState({ ...state, [name]: value });
        } else if (name === "tenLop") {
            value = value.replace(/[&#,+()$~%.'":*?<>{}]/g, '');
            setState({ ...state, [name]: value });
        }
        else {
            value = value.trim();
            setState({ ...state, [name]: value });
        }
    }

    return (
        <div className="container">
            <div className="labelAdd"><h4>Thêm mới lớp học</h4></div>
            <form onSubmit={handleSubmit} >
                <div className="row justify-content-between">
                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="tenLop">Tên lớp</label>
                        <input className="col-sm-8" type="text" id="tenLop" name="tenLop" placeholder="Nhap ten lop" onChange={handleInputChange} value={state.tenLop} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="namHoc">Năm học</label>
                        <input className="col-sm-8" type="text" id="namHoc" name="namHoc" placeholder="Nhap nam hoc" onChange={handleInputChange} value={state.namHoc} />
                    </div>


                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="ky">Kỳ học</label>
                        <input className="col-sm-8" type="number" id="ky" name="ky" placeholder="Nhap ky hoc" onChange={handleInputChange} value={state.ky} min="1" max="2" />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="maGV">Giáo viên</label>
                        <div className="row justify-content-evenly selectRow">
                            <div className="col-sm-8">
                                <select className="form-select form-select-sm" id="maGV" name="maGV" onChange={handleInputChange} value={state.maGV}>
                                    {giaoVien && giaoVien.map((gv, index) => {
                                        return (
                                        <option value={gv.ma} key={gv.ma}>{gv.ma} - {gv.hoTen}</option>
                                        )
                                    })}

                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="maMon">Môn học</label>
                        <div className="row justify-content-evenly selectRow">
                            <div className="col-sm-8">
                                <select className="form-select form-select-sm" id="maMon" name="maMon" onChange={handleInputChange} value={state.maMon}>
                                    {monHoc && monHoc.map((mon, index) => {
                                        return (
                                        <option value={mon.maMon} key={mon.maMon}>{`${mon.maMon} - ${mon.tenMon}`}</option>
                                        )
                                    })}

                                </select>
                            </div>
                        </div>
                    </div>
                    

                    <div className="row justify-content-evenly">
                        <div className="col-sm-6">
                            <div className="row">
                                <input type="submit" value={maLop ? "Cập nhập" : "Thêm"} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddLop