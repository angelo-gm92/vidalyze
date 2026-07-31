import React from "react";
import "../pages/History.css";

export default function History({ history, setUrl, setPage, deleteFromHistory }) {

    return (
        <div className="history-container">

            <h2 className="history-title">Historial de URLs analizadas</h2>

            {history.length === 0 && (
                <p className="history-empty">No hay URLs en el historial todavía.</p>
            )}

            {history.length > 0 && (
                <ul className="history-list">
                    {history.map((item, i) => (
                        <li key={i} className="history-item">

                            <div className="history-left" onClick={() => {
                                setUrl(item.url);
                                setPage("analyser");
                            }}>

                                <div className="history-info">
                                    <div className="history-title-item">
                                        {item.title || item.url}
                                    </div>

                                    <div className="history-date">
                                        ( {new Date(item.date).toLocaleString()} )
                                    </div>
                                </div>
                            </div>

                            <button
                                className="history-delete"
                                onClick={() => deleteFromHistory(item.url)}
                            >
                                ✕
                            </button>

                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}
