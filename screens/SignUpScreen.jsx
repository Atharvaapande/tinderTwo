import {
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { CountryPicker } from "react-native-country-codes-picker";
import { useSignUp } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState("+91");
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState();
  const { signUp } = useSignUp();
  const [username, setUsername] = useState("");

  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      await signUp.create({
        phoneNumber: fullPhoneNumber,
      });
      signUp.preparePhoneNumberVerification();
      navigation.navigate("phone", {
        fullPhoneNumber,
        signin: false,
        username,
      });
    } catch (error) {
      console.error("error :", error);
    }
  };

  return (
    <>
      <ImageBackground
        resizeMode="cover"
        source={require("../assets/tinderBG.png")}
        className="flex-1"
      >
        <SafeAreaView className="p-4 space-y-2 flex-1">
          <ScrollView
            // keyboardDismissMode="on-drag"
            className="space-y-10 flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-center">
              {/* <TouchableOpacity
                className="absolute left-0 p-2 bg-white rounded-full"
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="arrowleft" size={20} color="black" />
              </TouchableOpacity> */}
              <Text className="text-3xl text-center font-bold text-white">
                Sign Up
              </Text>
            </View>
            {/* Header */}

            <View className="space-y-4">
              <Text className="text-xl font-bold tracking-wide text-white">
                Let's get started!
              </Text>
              <Text className="text-base text-justify text-gray-200 font-semibold leading-5 tracking-wide">
                Enter your phone number. We will send you a confirmation code
                there.
              </Text>

              {/* input fields */}
              <View className="flex-row items-center space-x-2">
                {/* Country Code Picker */}
                <TouchableOpacity
                  onPress={() => setShow(!show)}
                  className="px-4 py-3 bg-white text-center rounded-xl"
                >
                  <Text>{countryCode}</Text>
                </TouchableOpacity>
                {/* Country Code Picker */}

                {/* Mobile Number */}
                <TextInput
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  className="px-4 py-2 bg-white rounded-xl flex-1"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onBackdropPress={Keyboard.dismiss}
                ></TextInput>
                {/* Mobile Number */}
              </View>

              <TextInput
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                className="bg-white px-4 py-2 rounded-xl"
              />
              {/* input fields */}

              {/* Log in text */}
              <View className="flex-row">
                <Text className="text-white">Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Log")}>
                  <Text className="font-bold text-black underline">
                    {" "}
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
              {/* log in text */}
            </View>
          </ScrollView>

          {/* Sign UP btn */}
          <TouchableOpacity
            className="px-6 py-2 bg-white rounded-3xl"
            onPress={onSignUp}
          >
            <Text className="text-center text-lg font-bold ">Sign Up</Text>
          </TouchableOpacity>
          {/* Sign UP btn */}

          {/* Country Code Picker */}
          <View className="mt-32">
            <CountryPicker
              show={show}
              style={{
                modal: {
                  height: "80%", // Adjust height based on screen size
                  justifyContent: "center",
                },
                contentContainer: {
                  flex: 1, // Ensure it takes up full space
                },
              }}
              // when picker button press you will get the country object with dial code
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              onBackdropPress={() => {
                setShow(false);
              }}
            />
          </View>
          {/* Country Code Picker */}
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const style = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
  },
});
