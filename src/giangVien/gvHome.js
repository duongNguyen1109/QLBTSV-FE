import React, { Component, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import MonItem from './monItem';
import "./gvStyle.css";
import axios from 'axios';

export default function GvHome(props) {
    const [listMon, setListMon] = useState([]);
    const [kyHocList, setKyHocList] = useState([]);
    // const [namHoc, setNamHoc] = useState("");
    // const [ky, setKy] = useState(0);
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
                        <MonItem maMon={item.maMon} name={item.tenMon} lopList={item.tenLop}></MonItem>
                    ))}
                </div>
            </div>
        </div>
    )
}