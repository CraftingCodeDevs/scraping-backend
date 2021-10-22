function getLastOne(results = []) {
  const data = results.sort((a, b) => {
      if (a.contribucion > b.contribucion) {
          return 1;
      }
      if (a.contribucion < b.contribucion) {
          return -1;
      }
      return 0;
  });
  return data[0];
}
function sortArray(results = []) {
  const data = results.sort((a, b) => {
      if (a.contribucion > b.contribucion) {
          return 1;
      }
      if (a.contribucion < b.contribucion) {
          return -1;
      }
      return 0;
  });
  return data;
}

module.exports = {
  getLastOne,
  sortArray
}