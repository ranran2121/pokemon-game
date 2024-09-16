const directions = [
  { x: -1, y: 0 }, // Left
  { x: 1, y: 0 }, // Right
  { x: 0, y: -1 }, // Up
  { x: 0, y: 1 }, // Down
];

// Helper function to get random starting point
const getRandomStartingPoint = (width: number, height: number) => ({
  x: Math.floor(Math.random() * width),
  y: Math.floor(Math.random() * height),
});

// Helper function to check if a cell is within the map boundaries
const isValidCell = (x: number, y: number, width: number, height: number) =>
  x >= 0 && x < width && y >= 0 && y < height;

// Helper function to check if the cell is surrounded by a specific terrain
const isSurroundedBy = (
  x: number,
  y: number,
  terrain: string,
  width: number,
  height: number,
  map: string[][]
) => {
  return directions.every((dir) => {
    const newX = x + dir.x;
    const newY = y + dir.y;
    return (
      isValidCell(newX, newY, width, height) && map[newY][newX] === terrain
    );
  });
};

export const placeContiguousArea = ({
  map,
  width,
  height,
  numCells,
  terrainType,
}: {
  map: string[][];
  width: number;
  height: number;
  numCells: number;
  terrainType: string;
}) => {
  let placedCells = 0;

  while (placedCells < numCells) {
    const { x: startX, y: startY } = getRandomStartingPoint(width, height);
    if (map[startY][startX] !== "land") continue; // Skip if starting point is not land

    const queue = [{ x: startX, y: startY }];
    const visited = new Set([`${startX},${startY}`]);

    while (queue.length > 0 && placedCells < numCells) {
      const { x, y } = queue.shift()!;

      if (map[y][x] === "land") {
        map[y][x] = terrainType;
        placedCells++;

        // Add neighboring land cells to the queue
        directions.forEach((dir) => {
          const newX = x + dir.x;
          const newY = y + dir.y;
          const key = `${newX},${newY}`;

          if (
            isValidCell(newX, newY, width, height) &&
            map[newY][newX] === "land" &&
            !visited.has(key)
          ) {
            queue.push({ x: newX, y: newY });
            visited.add(key);
          }
        });
      }
    }
  }
};

// Recheck for isolated cells on the edges
export const recheckMapForIsolatedLandCells = ({
  width,
  height,
  map,
}: {
  width: number;
  height: number;
  map: string[][];
}) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (
        map[y][x] === "land" &&
        isSurroundedBy(x, y, "sea", width, height, map)
      ) {
        map[y][x] = "sea"; // Convert isolated land cell surrounded by sea
      }
    }
  }
};
