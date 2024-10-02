import { Text, View } from "react-native";
export default function SenderMessage({ message }) {
  return (
    <>
      <View
        className="px-6 py-2 bg-[#ff615f] my-2 rounded-xl rounded-tr-none"
        style={{ width: "fit-content", alignSelf: "flex-end" }}
      >
        <Text className="text-end">{message}</Text>
      </View>
    </>
  );
}
