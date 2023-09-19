import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './configs';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const Ajax = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const rec = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const { data } = await rec.json();
    if (!rec.ok) throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    throw err;
  }
};
/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const rec = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const { data } = await rec.json();
    if (!rec.ok) throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const rec = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const { data } = await rec.json();
    if (!rec.ok) throw new Error(`${data.message}(${rec.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
