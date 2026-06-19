import { useEffect, useState } from "react";
import api from "./api/wordpress";

function App() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    api.get("/pages")
      .then((res) => {
        setPages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>WordPress Pages</h1>

      {pages.map((page) => (
        <div key={page.id} style={{ marginBottom: "30px" }}>
          <h2
            dangerouslySetInnerHTML={{
              __html: page.title.rendered,
            }}
          />

          <div
            dangerouslySetInnerHTML={{
              __html: page.content.rendered,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default App;