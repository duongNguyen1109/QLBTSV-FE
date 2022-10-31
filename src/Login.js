import {React, useState }from "react";
import AppRouter from "./AppRouter";
import loginImage from "./login.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setName] = useState('');
    const [password, setPass] = useState('');

    var curDate = new Date();
    let history = useNavigate();
    let adminLogin = () => {
        localStorage.setItem("user", "admin");
        localStorage.setItem("id", username);
        console.log(localStorage.getItem("id"), 'admin login');
        console.log("admin");
        history("/admin");
    }
    let svLogin = () => {
        localStorage.setItem("user", "sv");
        localStorage.setItem("id", username);
        console.log(localStorage.getItem("id"));
        history("/sinhvien");
    }
    let gvLogin = () => {
        localStorage.setItem("user", "gv");
        localStorage.setItem("id", username);
        console.log(localStorage.getItem("id"));
        history("/giangvien");
    }

    const handleLogin = (event) => {
        event.preventDefault();
        if(password.length < 8){
            alert("Mật khẩu chưa đủ 8 kí tự");
        } 
        var url = 'http://localhost:8080/api/taiKhoan/'+ username;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                // console.log(data[0].matKhau);
                if(data.length === 1){
                    // console.log("alo");
                    if(data[0].matKhau === password){
                        // console.log(data[0].loaiTK);
                        switch(data[0].loaiTK){
                            case 1: svLogin(); break;
                            case 2: gvLogin(); break;
                            case 3: adminLogin(); break;
                        }
                    }else{alert("Mật khẩu không chính xác!")}
                }else{alert("Tài khoản không tồn tại!");}
            })
        .catch(console.log)
      };

    // function navigatePage() {
    //     history('/admin');
    // }

    return (
        <section className="vh-100" style={{backgroundColor: `rgb(32, 59, 135)`}}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style= {{borderRadius: `1rem`}}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img src={loginImage}
                                        alt="login form" className="img-fluid" style= {{borderRadius: `1rem 0 0 1rem`}} />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-black">

                                        <form>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <span className="h1 fw-bold mb-0" style= {{color: `rgb(1, 15, 138)`}} >Đăng nhập</span>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Username</label>
                                                <input type="text" id="username" name="username"
                                                value = {username}
                                                    className="form-control form-control-lg" onChange = {(e)=>{
                                                        setName(e.target.value)
                                                    }}/>
                                                <span className="error" style={{color: `red`}}></span>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <label className="form-label">Password</label>
                                                <input type="password" id="pass" name="pass"
                                                value={password}
                                                    className="form-control form-control-lg" onChange = {(e)=>{
                                                        setPass(e.target.value)
                                                    }} />
                                                <span className="error" style={{color: `red`}}></span>
                                            </div>

                                            <div className="pt-1 mb-4">
                                                <button className="btn btn-dark btn-lg" type="button" onClick={handleLogin}>Login</button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}