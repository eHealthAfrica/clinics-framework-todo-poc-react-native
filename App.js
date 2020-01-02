import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {
  creatStackNavigator,
  createStackNavigator
} from "react-navigation-stack";
import LoginScreen from "./screen/LoginScreen";

import LoadingScreen from "./screen/LoadingScreen";

//import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screen/Home";

import {  stopYellow } from "./FirebaseApi";

//initFirebase();

stopYellow();

const AppStack = createStackNavigator({
  Home: HomeScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);
