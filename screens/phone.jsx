import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { StyleSheet } from "react-native-web";

const CELL_COUNT = 6;

export default function Phone({ route, navigation }) {
  const { fullPhoneNumber, signin, username } = route.params;
  const [code, setValue] = useState("");
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();
  const ref = useBlurOnFulfill({ code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setValue,
  });

  useEffect(() => {
    if (code.length === 6) {
      if (signin === true) {
        verifySignIn();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  const verifyCode = async () => {
    try {
      await signUp.update({ username });
      const result = await signUp.attemptPhoneNumberVerification({
        code,
      });

      if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
      } else {
        console.log("Session creation failed.");
      }
    } catch (err) {
      console.log("Verification error: " + err);
    }
  };

  const verifySignIn = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      if (signIn.createdSessionId) {
        await setActive({ session: signIn.createdSessionId });
      } else {
        console.log("Session creation failed.");
      }
    } catch (err) {
      console.log("Sign-in error: " + err);
    }
  };

  return (
    <>
      <ImageBackground
        className="flex-1"
        source={require("../assets/tinderBG.png")}
      >
        <SafeAreaView className="p-4 space-y-2 flex-1">
          <ScrollView className="space-y-10">
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                className="absolute left-0 p-2 bg-white rounded-full"
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="arrowleft" size={20} color="black" />
              </TouchableOpacity>
              <Text className="text-3xl text-center font-bold text-white">
                Almost There!
              </Text>
            </View>

            <View className="space-y-4">
              <Text className="text-xl text-white font-bold tracking-wide">
                Enter the 6 digit code we sent to {fullPhoneNumber}
              </Text>
              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={code}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete={Platform.select({
                  android: "sms-otp",
                  default: "one-time-code",
                })}
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    className="rounded-md bg-white"
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
