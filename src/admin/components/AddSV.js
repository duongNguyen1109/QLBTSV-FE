import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from "axios";
import {toast} from 'react-toastify';
import '../style/AddSV.css';



const AddSV = () => {

    const [items, setItems] = useState([]);
    const {maLop} = useParams();


    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            
            for (let i = 0; i < d.length; i++) {
                createSVLop(d[i], i);
                // console.log(createSVLop(d[i]).promise.result);
            }
            console.log(d);
            setItems(d);
        });
    };

    const createSVLop = async (d, i) => {
        let check = 1;
        const res = await axios.get("http://localhost:8080/api/svLop", {
            params: {
                maLop: maLop,
                maSV: d.maSV
            }
        });
        if (res.status === 200) {
            if(res.data.length > 0){
                toast.error('Đã có trong danh sách lớp', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500});
                check = 0;
            }
        } else {
            check = 0;
        }

        const response = await axios.get(`http://localhost:8080/api/taiKhoan/${d.maSV}`);
        if(response.status === 200){
            if(response.data.length === 0){
                toast.error('Không tồn tại sinh viên này', { position: toast.POSITION.TOP_RIGHT, autoClose: 1500});
                check = 0;
            }
        } else {
            check = 0;
        }

        if(check === 1){
            let data = {
                maLop: maLop,
                maSV: d.maSV,
                lopTruong: Number(d.lopTruong)
            };


            const created = await axios.post("http://localhost:8080/api/svLop", data);
            if(created.status === 200){
                check = 1;
            } else {
                check = 0;
            }
        }

        
    };

    return (
        <div>
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setItems([]);
                    readExcel(file);
                }}
            />

            <table className="table container">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>maSV</th>
                        <th>lopTruong</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((d, index) => (
                        <tr key={d.maSV}>
                            <td>{index + 1}</td>
                            <td>{d.maSV}</td>
                            <td>{d.lopTruong}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AddSV;