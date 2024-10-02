import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import FlashScreen from "./FlashScreen";
import Phone from "./phone";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import ChatScreen from "./ChatScreen";
import {
  setAgeRedux,
  setIdRedux,
  setImageURIRedux,
  setFirstNameRedux,
  setLastNameRedux,
  setOccupatioRedux,
  setProfilePhotoRedux,
  setMatchRedux,
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import MessageScreen from "./MessageScreen";

const stack = createNativeStackNavigator();

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigation = useNavigation();
  const { user } = useUser();
  const dispatch = useDispatch();
  // const [userDetails, setUserDetails] = useState(false);

  useEffect(() => {
    if (isSignedIn === true) {
      const userPhone = user.primaryPhoneNumber.phoneNumber;

      const saveUser = async () => {
        try {
          const doFetch = await fetch("http://yourAPI:3001/saveData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: userPhone,
              firstName: "",
              lastName: "",
              age: "",
              occupation: "",
              photoURL: "",
            }),
          });
          const data = await doFetch.json(); // Log server response
          dispatch(setIdRedux(data._id));
        } catch (error) {
          console.log("Error occurred while saving user:", error);
        }
      };
      const getUserData = async () => {
        try {
          const res = await fetch(
            `http://yourAPI:3001/getUser/${userPhone}`
          );
          const data = await res.json();
          if (!res.ok) {
            saveUser(); // Call saveUser if the response is not OK
            return; // Exit the function since there's no valid user data to process
          } else {
            // Proceed with dispatching user details
            dispatch(setIdRedux(data._id));
            dispatch(setFirstNameRedux(data.firstName));
            dispatch(setLastNameRedux(data.lastName));
            dispatch(setAgeRedux(data.age));
            dispatch(setOccupatioRedux(data.occupation));
            dispatch(setProfilePhotoRedux(data.photoURL));
          }
        } catch (error) {
          console.log("Error occurred while fetching user data:", error);
        }
      };

      getUserData();
      navigation.navigate("Home");
    } else if (isSignedIn === false) {
      navigation.navigate("Log");
    }
  }, [isSignedIn]);

  return (
    <>
      <stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Flash"
      >
        {isSignedIn ? (
          <>
            <stack.Screen name="Home" component={HomeScreen}></stack.Screen>
            <stack.Screen name="Chat" component={ChatScreen}></stack.Screen>
            <stack.Screen
              name="MessageScreen"
              component={MessageScreen}
            ></stack.Screen>
          </>
        ) : (
          <>
            {isLoaded ? (
              <>
                <stack.Screen name="Log" component={LoginScreen}></stack.Screen>
                <stack.Screen
                  name="SignUp"
                  component={SignUpScreen}
                ></stack.Screen>
                <stack.Screen name="phone" component={Phone}></stack.Screen>
              </>
            ) : (
              <stack.Screen name="Flash" component={FlashScreen}></stack.Screen>
            )}
          </>
        )}
      </stack.Navigator>
    </>
  );
}
