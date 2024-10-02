import { Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchEmptyModal() {
  return (
    <>
      <Modal transparent={true} animationType="fade" visible={true}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="py-4 px-6 rounded-3xl bg-white">
            <Text className="text-4xl">Thats it for today!!</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
