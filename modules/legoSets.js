const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      setData.forEach(setElement => {
        let theme = themeData.find(themeElement => themeElement.id == setElement.theme_id);
        if (theme) {
          let setWithTheme = { ...setElement, theme: theme.name };
          sets.push(setWithTheme);
        } else {
          reject(`Theme with id ${setElement.theme_id} not found.`);
        }
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    if (sets.length > 0) {
      resolve(sets);
    } else {
      reject("No sets available.");
    }
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    let foundSet = sets.find(s => s.set_num == setNum);
    if (foundSet) {
      resolve(foundSet);
    } else {
      reject("Unable to find requested set");
    }
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    let foundSets = sets.filter(s => s.theme.toUpperCase().includes(theme.toUpperCase()));
    if (foundSets.length > 0) {
      resolve(foundSets);
    } else {
      reject("Unable to find requested sets");
    }
  });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
