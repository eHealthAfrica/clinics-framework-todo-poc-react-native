import * as firebase from "firebase";
import { firebaseConfig, firebaseSecurity } from "./Config";
import uuid from "uuid";
import * as CryptoJS from "crypto-js";
import base64 from "react-native-base64";

import { func } from "prop-types";

async function encryptor(data, key) {
  //var ciphertext = data;

  var ciphertext = await CryptoJS.AES.encrypt(data, key);
  ciphertext = base64.encode(ciphertext.toString());
  return ciphertext;
  //return data;
}

function decryptor(cipher, key) {
  let ciphertext = CryptoJS.AES.decrypt(base64.decode(cipher), key);
  return ciphertext.toString(CryptoJS.enc.Utf8).toString();

  //return cipher;
}

let primary, secondary;
if (!firebase.apps.length) {
  primary = firebase.initializeApp(firebaseConfig);
  secondary = firebase.initializeApp(firebaseSecurity, "keyDB");
}

export { primary, secondary };

function getKV(data) {
  console.log("loading key");

  return data;
}

export function getKey(getKV) {
  readKey().then(data => {
    getKV(data);
  });
}
export function readKey() {
  let key = null;
  return secondary
    .database()
    .ref()
    .once("value", snap => {
      snap.forEach(child => {
        console.log(child.key + " data " + child.val());

        if (child.key === firebase.auth().currentUser.uid) key = child.val();
      });
    })
    .then(data => {
      return key;
    });
}

export async function addFood(name, ky, addComplete) {
  let cipherName = await encryptor(name, ky);

  console.log(
    "cipherName = " + "|" + name + "|" + String(cipherName) + "   " + ky
  );

  firebase
    .database()
    .ref("Food/" + uuid.v4())
    .set({ name: cipherName })
    .then(() => {
      addComplete(name);
      console.log("INSERTED");
    })
    .catch(err => {
      console.log(err);
    });
}

function removeFood(fid, key, foodRetrieved, filteredData) {
  //let cname = name; //encryptor(name, key);
  //let keyv = null;

  firebase
    .database()
    .ref("Food")
    .child(fid.id)
    .remove();
  foodRetrieved(filteredData);

  //okok
}

export async function getFoods(foodRetrieved) {
  let ky = await readKey();
  console.log("keyxxx " + ky);
  var foodList = [];
  firebase
    .database()
    .ref("Food")
    .orderByKey()
    .once("value", snapshot => {
      snapshot.forEach(child => {});

      foodRetrieved(foodList);
    })
    .then(() => {
      console.log("foodList= " + foodList);
      FoodChange(ky, foodList, foodRetrieved);
    });
}

export async function FoodChange(key, foodList, foodRetrieved) {
  var foodRef = firebase.database().ref("Food");

  foodRef.on("child_removed", snapshot => {
    let ele_removed = snapshot.val().name; // decryptor(snapshot.val().name, key);
    console.log("removeing " + ele_removed);
    // foodList.forEach(x => console.log(x));
    foodList = foodList.filter(item => item.id !== snapshot.key);
    foodRetrieved(foodList);
  });

  foodRef.on("child_added", snapshot => {
    let ele_added = snapshot.val().name;
    let ky = snapshot.key;
    console.log("ky----" + ky);

    ele_added = decryptor(ele_added, key);

    foodList.push({ id: ky, name: ele_added });
    //foodList.push(ele_added);
    foodRetrieved(foodList);
  });
}
function arrayRemove(arr, value) {
  return arr.filter(function(ele) {
    return ele != value;
  });
}

export function deleteItemById(foodRetrieved, foodList, fid, key) {
  console.log("===================================");
  console.log(fid);
  const filteredData = foodList.filter(item => item.id !== fid.id);
  foodRetrieved(filteredData);
  removeFood(fid, key, foodRetrieved, filteredData);
}

export function stopYellow() {
  console.ignoredYellowBox = ["Setting a timer"];
}
