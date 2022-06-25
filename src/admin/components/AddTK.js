import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import '../style/AddTK.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";

const initialState = {
    ma: "",
    hoTen: "",
    SDT: "",
    email: "",
    diaChi: "",
    ngaySinh: "",
    matKhau: "12345678",
    loaiTK: 3,
    khoa: "",
    lop: "",
    khoaHoc: ""
};

const AddTK = () => {

    const [state, setState] = useState(initialState);
    let navigate = useNavigate();

    let a = state.loaiTK;

    const {ma} = useParams();

    useEffect(() => {
        if(ma){
            getSingleTK(ma);
        }
    }, [ma])

    const getSingleTK = async (ma) => {
        const response = await axios.get(`http://localhost:8080/api/taiKhoan/${ma}`);
            if (response.status === 200) {
                setState({...response.data[0]});

            }
    }

    // const { ma, hoTen, SDT, email, diaChi, ngaySinh, loaiTK, khoa, lop, khoaHoc } = initialState;

    const addTaiKhoan = async (data) => {
        const response = await axios.post("http://localhost:8080/api/taiKhoan", data);
            if (response.status === 200) {
                toast.success('Tạo mới thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
    };

    const updateTaiKhoan = async (data, ma) => {
        const response = await axios.put(`http://localhost:8080/api/taiKhoan/${ma}`, data);
            if (response.status === 200) {
                toast.success('Cập nhật thành công', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                navigate(`/taiKhoan`);
                setState(initialState);
            }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let check = 1;

        for (let key in state) {
            if (key === "ma") {
                if (state[key].length !== 10) {
                    toast.error('Mã tài khoản phải đủ 10 ký tự', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                    check = 0;
                }
            } else if (key === "hoTen") {
                if (state[key] === "") {
                    toast.error('Họ tên không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                    check = 0;
                }
            } else if (key === "loaiTK") {
                if (state[key] === 2) {
                    if (state["khoa"] === "") {
                        toast.error('Khoa không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                        check = 0;
                    }
                } else if (state[key] === 1) {
                    if (state["lop"] === "") {
                        toast.error('Lớp không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                        check = 0;
                    }
                    if (state["khoa"] === "") {
                        toast.error('Khoa không được để trống', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500 });
                        check = 0;
                    }
                }
            }
            else if (state[key] === "") state[key] = null;
        }

        if (check === 1) {
            if(!ma){
                addTaiKhoan(state);
            } else {
                updateTaiKhoan(state, ma);
            }
            
        }
        
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "loaiTK") {
            setState({ ...state, [name]: Number(value) });
            a = value;
        } else if (name === "ma") {
            value = value.replace(/[^a-zA-Z0-9]/g, '');
            setState({ ...state, [name]: value });
        } else if (name === "hoTen") {
            value = value.replace(/[&#,+()$~%.'":*?<>{}]/g, '');
            setState({ ...state, [name]: value });
        } 
        else if (name === "SDT") {
            value = value.replace(/[^0-9]/g, '');
            setState({ ...state, [name]: value });
        }
        else {
            value = value.trim();
            setState({ ...state, [name]: value });
        }
    }

    return (
        <div className="container addTK">
            <div className="labelAdd"><h4>Thêm mới tài khoản</h4></div>
            <form onSubmit={handleSubmit} >
                <div className="row justify-content-between row-padding">
                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="ma">Mã</label>
                        <input className="col-sm-8" type="text" id="ma" name="ma" placeholder="Nhap ma" onChange={handleInputChange} value={state.ma} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="hoTen">Họ tên</label>
                        <input className="col-sm-8" type="text" id="hoTen" name="hoTen" placeholder="Nhap ho ten" onChange={handleInputChange} value={state.hoTen} />
                    </div>


                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="SDT">SĐT</label>
                        <input className="col-sm-8" type="tel" id="SDT" name="SDT" placeholder="Nhap SDT" onChange={handleInputChange} value={state.SDT} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="email">Email</label>
                        <input className="col-sm-8" type="email" id="email" name="email" placeholder="Nhap email" onChange={handleInputChange} value={state.email} />
                    </div>


                    <div className="col-12">
                        <label className="col-sm-10 label" htmlFor="diaChi">Địa chỉ</label>
                        <input className="col-sm-10" type="text" id="diaChi" name="diaChi" placeholder="Nhap dia chi" onChange={handleInputChange} value={state.diaChi} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="ngaySinh">Ngày sinh</label>
                        {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
                        <input className="col-sm-8" type="date" id="ngaySinh" name="ngaySinh" onChange={handleInputChange} value={state.ngaySinh} />
                    </div>

                    <div className="col-6">
                        <label className="col-sm-8 label" htmlFor="loaiTK">Loại tài khoản</label>
                        {/* <input className="col-7" type="number" id="loaiTK" name="loaiTK" placeholder="Nhap loai TK" onChange={handleInputChange} /> */}
                        <div className="row justify-content-evenly selectRow row-padding">
                            <div className="col-sm-8">
                                <select className="form-select form-select-sm" id="loaiTK" name="loaiTK" onChange={handleInputChange} value={state.loaiTK}>
                                    <option value="1">Sinh vien</option>
                                    <option value="2">Giao vien</option>
                                    <option value="3">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="loaiTK" id="inlineRadio1" value="1" onChange={handleInputChange} checked={state.loaiTK === 1} />
                                    <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="loaiTK" id="inlineRadio2" value="2" onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="inlineRadio2">2</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="loaiTK" id="inlineRadio3" value="3" onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="inlineRadio3">3</label>
                            </div> */}

                    <div className={`${a === 3 ? " hide" : "col-6"}`}>
                        <label className="col-sm-8 label" htmlFor="khoa">Khoa</label>
                        <input className="col-sm-8" type="text" id="khoa" name="khoa" placeholder="Nhap khoa" onChange={handleInputChange} value={state.khoa} />
                    </div>

                    <div className={`${a === 1 ? "col-6" : " hide"}`}>
                        <label className="col-sm-8 label" htmlFor="lop">Lớp</label>
                        <input className="col-sm-8" type="text" id="lop" name="lop" placeholder="Nhap lop" onChange={handleInputChange} value={state.lop} />
                    </div>

                    <div className={`${a === 1 ? "col-6" : " hide"}`}>
                        <label className="col-sm-8 label" htmlFor="khoaHoc">Khóa học</label>
                        <input className="col-sm-8" type="text" id="khoaHoc" name="khoaHoc" placeholder="Nhap khoa hoc" onChange={handleInputChange} value={state.khoaHoc} />
                    </div>

                    <div className="row row-padding justify-content-evenly">
                        <div className="col-sm-6">
                            <div className="row row-padding" >
                                <input type="submit" value={ma ? "Cập nhập" : "Thêm"} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddTK