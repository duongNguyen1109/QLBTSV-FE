import styles from "./styles.module.css";

const Exs = ({ ex }) => {
    return (
        <div className={styles.ex_container}>
            <img src={ex.link} alt="song_img" className={styles.ex_img} />
            <div className={styles.ex_info}>
                <p className={styles.ex_maBT} >Bài tập: {ex.maBT}</p>
                <p className={styles.ex_nguoiNop} >Người nộp: {ex.nguoiNop}</p>
                <p className={styles.ex_ngayNop} >Ngày nộp: {ex.ngayNop}</p>
                <p className={styles.ex_ghiChu} >Ghi chú: {ex.ghiChu}</p>
                {/* <p className={styles.ex_link} >Link: {ex.link}</p> */}
            </div>
        </div>

    );
};

export default Exs;