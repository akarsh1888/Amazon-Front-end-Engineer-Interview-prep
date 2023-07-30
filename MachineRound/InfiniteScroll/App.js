import React, { useState, useCallback, useRef } from "react";
import InfiniteScroll from "./InfiniteScroll";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const controllerRef = useRef(null);

  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const renderItem = useCallback(
    ({ title }, key, ref) => (
      <div ref={ref} key={key}>
        {title}
      </div>
    ),
    []
  );

  const getData = useCallback(async (query, pageNumber) => {
    try {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();

      const response = await fetch(
        "https://openlibrary.org/search.json?" +
          new URLSearchParams({
            q: query,
            page: pageNumber
          }),
        { signal: controllerRef.current.signal }
      );

      const data = await response.json();
      setData((prevData) => [...prevData, ...data.docs]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <>
      <input type="text" value={query} onChange={handleInput} />
      <InfiniteScroll
        renderListItem={renderItem}
        getData={getData}
        listData={data}
        query={query}
      />
    </>
  );
}

export default App;
