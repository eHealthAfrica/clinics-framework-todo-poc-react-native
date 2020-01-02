import React, { Component } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
  Platform,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import { ListItem, Divider } from "react-native-elements";
import {
  primary as firebase,
  addFood,
  getFoods,
  readKey,
  FoodChange,
  deleteItemById,
  getKey
} from "../FirebaseApi";
import SwipeView from "react-native-swipeview";
import uuid from "uuid";

export default class FoodList extends Component {
  colors = [];

  state = {
    foodList: [],

    currentFoodItem: null,
    email: "",
    displayName: "",
    key: ""
  };

  foodItem = (id, name) => {
    return { id: id, name: name };
  };

  onFoodAdded = food => {
    console.log("Food Added");
  };

  onFoodsReceived = foodList => {
    //console.log("why called multiple times " + foodList);
    this.setState(prevState => ({
      foodList: (prevState.foodList = foodList)
    }));

    // this.setState(prevState => ({
    //   foodList: (prevState.foodList = foodList)
    // }));
  };

  onFoodAdded = food => {
    this.setState(prevState => ({
      currentFoodItem: null
    }));
  };

  signOutUser = () => {
    console.log("logging out now");
    firebase.auth().signOut();
  };

  getKeyV = keyvalue => {
    console.log("vvvv" + keyvalue);
    this.setState({ key: keyvalue });
    return keyvalue;
  };

  key = async () => {
    return await readKey;
  };

  constructor() {
    super();
    console.ignoredYellowBox = ["Setting a timer"];
  }

  componentDidMount() {
    getFoods(this.onFoodsReceived);
    getKey(this.getKeyV);
    const { email, displayName } = firebase.auth().currentUser;

    this.setState({ email, displayName });
  }

  render() {
    function img2() {
      if (Platform.OS === "android") return;

      return (
        <Image
          source={require("../assets/eha.jpg")}
          style={{ width: 150, height: 150, alignContent: "center" }}
        />
      );
    }

    const swipeSettings = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {},
      onOpen: (secId, rowId, direction) => {}
    };
    return (
      <SafeAreaView
        style={{
          backgroundColor: Platform.OS == "web" ? "yellow" : "white",
          width: Platform.OS == "web" ? 650 : 400,
          alignSelf: "center"
        }}
      >
        {img2()}
        <View style={styles.row}>
          <Text>Hi {this.state.email}!</Text>

          <TouchableOpacity
            onPress={this.signOutUser}
            style={{ marginTop: 32 }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TextInput
            style={styles.formInput}
            placeholder="Add Food"
            value={this.state.currentFoodItem}
            onChangeText={text =>
              this.setState(prevState => ({
                currentFoodItem: (prevState.currentFoodItem = text)
              }))
            }
          />
          <Button
            title="Submit"
            style={styles.button}
            onPress={() => {
              addFood(
                this.state.currentFoodItem,
                this.state.key,
                this.onFoodAdded
              );
            }}
          />
        </View>
        <FlatList
          data={this.state.foodList}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: "black" }} />
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <SwipeView
                renderVisibleContent={() => (
                  <Text style={styles.ingredientItemText}>{item.name}</Text>
                )}
                onSwipedLeft={() =>
                  deleteItemById(
                    this.onFoodsReceived,
                    this.state.foodList,
                    item,
                    this.state.key
                  )
                }
              />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  row: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    padding: 10
  },
  container: {
    width: 200,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 32
  },
  formInput: {
    borderColor: "#B5B4BC",
    borderWidth: 1,
    padding: 8,
    height: 50,
    color: "black",
    width: "75%",
    marginBottom: 16,
    marginTop: 16
  },
  validationText: {
    color: "red"
  },
  longFormInput: {
    width: "100%",
    height: 50,
    color: "black",
    borderColor: "#B5B4BC",
    borderWidth: 1,
    padding: 8,
    margin: 16
  },
  ingredientItemText: {
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 16
  }
});
