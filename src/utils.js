/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

function filterObject(source, keys) {
  const newObject = {};

  keys.forEach((key) => {
    const value = source[key];
    if(value && value !== 'undefined') {
      newObject[key] = value;
    }
  });

  return newObject;
}

export { filterObject };
