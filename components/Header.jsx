import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, callEnabled }) {
  const navigation = useNavigation();
  return (
    <>
      <View className="flex-row items-center justify-between mx-4 my-2">
        <View className="flex-row items-center justify-evenly">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" color="#ff615f" size={34} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4">{title}</Text>
        </View>
        {callEnabled && (
          <TouchableOpacity className="rounded-full p-2 bg-red-200">
            <Foundation name="telephone" size={20} color="#ff615f" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
const style = StyleSheet.create({
  boxShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1.41,
    elevation: 7,
  },
});
