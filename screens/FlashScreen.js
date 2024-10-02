import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";

export default function FlashScreen() {
  const navigation = useNavigation();
  return (
    <>
      <ImageBackground
        resizeMode="cover"
        className="flex-1 relative items-center justify-center"
        source={require("../assets/FinalLogo.png")}
      ></ImageBackground>
    </>
  );
}
