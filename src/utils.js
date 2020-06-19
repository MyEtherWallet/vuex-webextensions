/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

function filterObject(source, keys) {
  // eslint-disable-next-line
  console.log(source, keys);
  const newObject = {};

  keys.forEach((key) => {
    const value = source[key];

    if (typeof value !== 'undefined' && value) {
      newObject[key] = value;
    }
  });

  return newObject;
}

export { filterObject };
