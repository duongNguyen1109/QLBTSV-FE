import styles from "./styles.module.css";

const Songs = ({ song }) => {
    return (
        // <div className={styles.song_grid}>
        <div className={styles.song_container}>
            <img src={song.link} alt="song_img" className={styles.song_img} />
            <div className={styles.song_info}>
                <p className={styles.song_maBT} >Bài tập: {song.maBT}</p>
                <p className={styles.song_nguoiNop} >Người nộp: {song.nguoiNop}</p>
                <p className={styles.song_ngayNop} >Ngày nộp: {song.ngayNop}</p>
                <p className={styles.song_ghiChu} >Ghi chú: {song.ghiChu}</p>
            </div>
        </div>
        // </div>


    );
};

export default Songs;