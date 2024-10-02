import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { CountryPicker } from "react-native-country-codes-picker";
import { useAuth, useSignIn } from "@clerk/clerk-expo";

const SignInType = {
  Phone: "Phone",
  Email: "Email",
  Google: "Google",
  Apple: "Apple",
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState("+91");
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { signIn } = useSignIn();
  const { signOut, sessionId } = useAuth();

  const onSignIn = async (type) => {
    if (sessionId) {
      console.log("A session already exists. Signing out first..."); // Optional: implement sign-out logic here if needed
      return;
    }

    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const signInResponse = await signIn.create({
          identifier: fullPhoneNumber,
        });

        const { supportedFirstFactors } = signInResponse || {};

        if (!supportedFirstFactors) {
          throw new Error("No supported first factors found in response");
        }

        const firstPhoneFactor = supportedFirstFactors.find(
          (factor) => factor.strategy === "phone_code"
        );

        if (!firstPhoneFactor) {
          throw new Error("No phone code strategy found in supported factors");
        }

        const { phoneNumberId } = firstPhoneFactor;

        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        navigation.navigate("phone", { fullPhoneNumber, signin: true });
      } catch (err) {
        console.log("Error occurred: ", err);
      }
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
            keyboardDismissMode="on-drag"
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
                LogIn
              </Text>
            </View>
            {/* Header */}

            <View className="space-y-4">
              <Text className="text-xl font-bold tracking-wide text-white">
                Welcome back!
              </Text>
              <Text className="text-base text-justify text-gray-200 font-semibold leading-5 tracking-wide">
                Enter your phone number associated with your account
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
              {/* input fields */}
              <View className="flex-row">
                <Text className="text-white">Don't have account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text className="underline font-bold"> Create one.</Text>
                </TouchableOpacity>
              </View>
              {/* Sign UP btn */}
              <TouchableOpacity
                className="px-6 py-2 bg-white rounded-3xl"
                onPress={() => onSignIn(SignInType.Phone)}
              >
                <Text className="text-center text-lg font-bold ">Login</Text>
              </TouchableOpacity>
              {/* Sign UP btn */}

              <View className="flex-row items-center space-x-2 justify-center">
                <View className="h-[1px] flex-1 bg-gray-200"></View>
                <Text className="text-white font-semibold">or</Text>
                <View className="h-[1px] flex-1 bg-gray-200"></View>
              </View>

              <TouchableOpacity
                className="px-6 py-2 bg-white flex-row rounded-3xl items-center space-x-2 justify-center"
                onPress={() => onSignIn(SignInType.Email)}
              >
                <Ionicons name="mail" size={25} />
                <Text>Login with Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-6 py-2 bg-white flex-row rounded-3xl items-center space-x-2 justify-center"
                onPress={() => onSignIn(SignInType.Google)}
              >
                <Ionicons name="logo-google" size={25} />
                <Text>Login with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-6 py-2 bg-white flex-row rounded-3xl items-center space-x-2 justify-center"
                onPress={() => onSignIn(SignInType.Apple)}
              >
                <Ionicons name="logo-apple" size={25} />
                <Text>Login with Apple</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

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
