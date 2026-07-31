import { useState, useEffect } from 'react'
import './App.css'
import VideoAnalyser from './components/VideoAnalyser'
import History from './pages/History';


function App() {
  const [dark, setDark] = useState(false)
  const [url, setUrl] = useState("")
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState("analyser");

  useEffect(() => {
    const saved = localStorage.getItem("va-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);


  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark])

  useEffect(() => {
    document.body.classList.toggle("url-active", url.length > 0);
  }, [url]);

  function addToHistory(url, thumbnail = null, title = null) {
    const entry = {
      url,
      thumbnail,
      title,
      date: new Date().toISOString()
    };

    setHistory(prev => {
      const filtered = prev.filter(e => e.url !== url);
      const updated = [entry, ...filtered].slice(0, 10);
      localStorage.setItem("va-history", JSON.stringify(updated));
      return updated;
    });
  }


  function deleteFromHistory(urlToDelete) {
    setHistory(prev => {
      const updated = prev.filter(e => e.url !== urlToDelete);
      localStorage.setItem("va-history", JSON.stringify(updated));
      return updated;
    });
  }



  return (
    <>
      <div className={`top-bar ${(url || page === "history") ? "compact" : ""}`}>
        <img className="logo" src="./public/vidalyze_logo_1.png" alt="" />

        <div className="theme-switch" onClick={() => setDark(!dark)}>
          <div className={`switch-track ${dark ? "on" : ""}`}>
            <div className="switch-thumb"></div>
          </div>
        </div>
      </div>

      <aside className={`side-nav ${(url || page === "history") ? "compact" : ""}`}>
        {page === "analyser" && (
          <button onClick={() => setPage("history")}>Historial</button>
        )}

        {page === "history" && (
          <button onClick={() => setPage("analyser")}>Volver al análisis</button>
        )}
      </aside>



      {page === "analyser" && (
        <div className="main-container">
          <VideoAnalyser
            url={url}
            setUrl={(u) => {
              setUrl(u);
            }}
            history={history}
          />

        </div>
      )}

      {page === "history" && (
        <History
          history={history}
          setUrl={setUrl}
          setPage={setPage}
          deleteFromHistory={deleteFromHistory}
        />
      )}

      <footer>
        © {new Date().getFullYear()} Angelo — V I D A L Y Z E
      </footer>
    </>
  )
}

export default App
