function makeQuad(x, y, w, h) {
  return {
    positions: [
      // Assuming y + h is higher on screen than y, this goes counterclockwise
      [x, y, 0], [x + w, y, 0], [x + w, y + h, 0], [x, y + h, 0]
    ],
    cells: [
      [0, 1, 2], [0, 2, 3]
    ],
    uvs: [
      [0, 0], [1, 0], [0, 1], [1, 1]
    ],
    normals: [
      [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]
    ]
  };
}

module.exports = makeQuad;
