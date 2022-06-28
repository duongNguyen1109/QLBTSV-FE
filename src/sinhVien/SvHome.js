import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import "./svStyle.css";
import axios from 'axios';

export default function SvHome(props) {
    const [listMon, setListMon] = useState([]);
    const [kyHocList, setKyHocList] = useState([]);
    const [kyHoc, setKyHoc] = useState({
        namHoc: '',
        ky: 0
    });

    useEffect(() => {
        // console.log(props.namHoc);
        // console.log(props.ky);
        axios.get(`http://localhost:8080/api/kyByTK/` + localStorage.getItem("id"))
            .then(response => {
                setKyHocList(response.data);
                setKyHoc({
                    namHoc: response.data[0].namHoc,
                    ky: response.data[0].ky
                })
                // setNamHoc(response.data[0].namHoc);
                // setKy(response.data[0].ky);
                //setKyHoc(response.data[0])
            });
    }, []);

    useEffect(() => {
        if (kyHoc.namHoc !== '' && kyHoc.ky !== 0) {
            axios.get(`http://localhost:8080/api/monByKy`, {
                params: {
                    ma: localStorage.getItem("id"),
                    namHoc: kyHoc.namHoc,
                    ky: kyHoc.ky,
                }
            }).then(response => {
                setListMon(response.data)
            });
        }
    }, [kyHoc])

    const handleKyHoc = (kyHoc) => {
        console.log(kyHoc);
        let kySplit = kyHoc.split("/");
        // setNamHoc(ky[0]);
        // setKy(Number(ky[1]));
        setKyHoc({ ...kyHoc, namHoc: kySplit[0], ky: kySplit[1] })
    }

    return (
        <div>
            <div className="container center" style={{ marginTop: "50px" }}>
                <select class="form-control" onChange={(e) => handleKyHoc(e.target.value)} >
                    {kyHocList.map((item) => (
                        <option value={item.namHoc + "/" + item.ky} >Năm {item.namHoc} kỳ {item.ky}</option>
                    ))}
                </select>
                <div className='mon'>
                    {listMon.map((item) => (
                        <LopItem key = {item.maMon} maLop = {item.maLop} name = {item.tenLop} tenGV = {item.tenGV} maGV = {item.maGV} maMon = {item.maMon}></LopItem>
                    ))}
                </div>
            </div>
        </div>
    )
}

function LopItem(props) {
    return (
        <div class="card" style={{ width: '300px',margin: "20px" }}>
            <div class="card-header"><Link to = {`lop/${props.name}/${props.maLop}/${props.maGV}/${props.maMon}`}><h5>{props.name}</h5></Link></div>
            <div class="card-body">
                <p>{`Mã môn: ${props.maMon}`}</p>
                <p>{`Giảng viên: ${props.tenGV}`}</p>
            </div>
        </div>
    )
}