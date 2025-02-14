import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const [pages, setPages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => setPages(data.pages));
  }, []);

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #eaeaea" }}>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "1rem",
          margin: 0,
          padding: 0,
          justifyContent: "center",
        }}
      >
        <li
          style={{
            marginRight: "20px",
            color: router.pathname === "/" ? "#1677ff" : "inherit",
          }}
        >
          <Link
            href="/"
            style={{
              color: router.pathname === "/" ? "#1677ff" : "inherit",
            }}
          >
            首页
          </Link>
        </li>
        {pages.map((page) => (
          <li
            key={page.path}
            style={{
              marginRight: "20px",
              color: router.pathname === page.path ? "#1677ff" : "inherit",
            }}
          >
            <Link
              href={page.path}
              style={{
                color: router.pathname === page.path ? "#1677ff" : "inherit",
              }}
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
