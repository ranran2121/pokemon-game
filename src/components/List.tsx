import React from "react";

const List = ({
  list,
  title,
  isLog,
}: {
  list: any[];
  title: string;
  isLog: boolean;
}) => {
  return (
    <div>
      <h3 className="uppercase">{title}: </h3>
      <ul>
        {list.map((element, index) => (
          <li
            key={index}
            className="flex items-center border-b-2  border-pink-200 w-1/2"
          >
            {isLog ? (
              <p>{element}</p>
            ) : (
              <>
                <img
                  src={element.sprite}
                  alt={element.name}
                  className="w-12 h-12 "
                />
                {element.name}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
