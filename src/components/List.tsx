import React, { useRef, useEffect } from "react";

const List = ({
  list,
  title,
  isLog,
}: {
  list: any[];
  title: string;
  isLog: boolean;
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when the list updates
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [list]);

  return (
    <div className="h-full flex flex-col pb-8 bg-amber-100 pl-2 pt-2 rounded-md">
      <h3 className="uppercase font-bold underline underline-offset-4 text-orange-500">
        {title}:
      </h3>
      <div ref={listRef} className="overflow-y-auto flex-grow mt-2">
        <ul>
          {list.map((element, index) => (
            <li
              key={index}
              className="flex items-center border-b-2  border-orange-300 w-2/3 "
            >
              {isLog ? (
                <p>{element}</p>
              ) : (
                <p className="capitalize">
                  <img
                    src={element.sprite}
                    alt={element.name}
                    className="w-12 h-12 inline "
                  />
                  {element.name}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default List;
