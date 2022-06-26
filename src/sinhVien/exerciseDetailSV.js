import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function ExcerciseDetailSV() {
    let { maBaiTap } = useParams();
    const [baiTap, setBaiTap] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/baiTap/' + maBaiTap).then(res => {
            setBaiTap(res.data[0]);
        });
        console.log(baiTap);
    }, [])
    return (
        <div className="container mt-3">
            <div className="mb-3 d-flex justify-content-between align-items-end" style={{ borderBottom: 'solid 1px black' }}>
                <div>
                    <h2>{baiTap.tenBT}</h2>
                    <p>{`${baiTap.loaiBT ? `${baiTap.loaiBT} - ` : ''}${baiTap.kieuBT ? 'Nhóm' : 'Cá nhân'}`}</p>
                </div>
                <div>
                    <p><b>Hạn nộp: </b><span>{baiTap.hanNop}</span></p>
                </div>
            </div>
            <div className="mb-3" style={{ borderBottom: 'solid 1px black' }}>
                <p>{baiTap.moTa ? baiTap.moTa : 'Bài tập này hiện chưa có mô tả'}</p>
            </div>
            <button className="btn btn-primary">Nộp bài</button>
        </div>
    )
}