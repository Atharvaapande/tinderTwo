import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";

export default function UploadOptionModal({
  isUploadOptionModalOpen,
  isUploadOptionModalClose,
  openGallary,
  openCamera,
}) {
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUploadOptionModalOpen}
      >
        <SafeAreaView className="flex-1 items-center justify-center">
          <View
            className="px-14 h-40 bg-[#f9f9f9] rounded-xl items-center justify-center"
            style={style.boxShadow}
          >
            <TouchableOpacity
              className="absolute top-2 right-4"
              onPress={isUploadOptionModalClose}
            >
              <Entypo name="cross" size={25} />
            </TouchableOpacity>
            <View className="flex-row items-center justify-center space-x-2">
              <TouchableOpacity
                className="items-center space-y-2 border border-solid border-black p-2 rounded-xl w-28 h-24"
                onPress={openGallary}
              >
                <AntDesign name="upload" size={30} color="black" />
                <Text>Upload from gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center space-y-2 border border-solid border-black p-2 rounded-xl w-28 h-24"
                onPress={openCamera}
              >
                <AntDesign name="camera" size={30} color="black" />
                <Text>Take a picture</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
const style = StyleSheet.create({
  boxShadow: {
    shadowColor: "black",
    shadowRadius: 1.41,
    shadowOffset: { width: 4, height: 1 },
    shadowOpacity: 0.3,
    elevation: 7,
  },
});
