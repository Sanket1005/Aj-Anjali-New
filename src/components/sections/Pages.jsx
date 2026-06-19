import { useEffect, useState } from "react";
import { getPages } from "../../services/pageService";

function Pages() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await getPages();

        console.log(data);

        setPages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPages();
  }, []);

  return (
    <section
      style={{
        padding: "100px 20px",
      }}
    >
      <h1>WordPress Pages</h1>

      {pages.map((page) => (
        <div
          key={page.id}
          style={{
            marginBottom: "50px",
          }}
        >
          {/* Featured Image */}
          {page._embedded?.["wp:featuredmedia"]?.[0]
            ?.source_url && (
            <img
              src={
                page._embedded[
                  "wp:featuredmedia"
                ][0].source_url
              }
              alt=""
              width="400"
            />
          )}

          {/* Title */}
          <h2
            dangerouslySetInnerHTML={{
              __html: page.title.rendered,
            }}
          />

          {/* Content */}
          <div
            dangerouslySetInnerHTML={{
              __html: page.content.rendered,
            }}
          />
        </div>
      ))}
    </section>
  );
}

export default Pages;