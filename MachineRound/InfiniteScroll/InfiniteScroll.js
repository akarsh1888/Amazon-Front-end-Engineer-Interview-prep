import React, { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteScroll(props) {
  const { renderListItem, getData, listData, query } = props;
  const pageNumber = useRef(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);

  const lastElementObserver = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          pageNumber.current += 1;
          fetchData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const renderList = useCallback(() => {
    return listData.map((item, index) => {
      if (index === listData.length - 1)
        return renderListItem(item, index, lastElementObserver);
      return renderListItem(item, index, null);
    });
  }, [listData, renderListItem, lastElementObserver]);

  const fetchData = useCallback(() => {
    setLoading(true);
    getData(query, pageNumber.current).finally(() => {
      setLoading(false);
    });
  }, [getData, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {renderList()}
      {loading && "LOADING"}
    </>
  );
}
