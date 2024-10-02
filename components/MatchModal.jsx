import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

export default function MatchModal({
  isVisibles,
  isClose,
  matchPic,
  matchFirstName,
  matchLastName,
}) {
  const swipedUserID = useSelector((state) => state.user.matchID);
  const navigation = useNavigation();
  const match = useSelector((state) => state.user.match);
  const matchUser = match.find((item) => item.swipedUresID == swipedUserID);
  const userPhoto = useSelector((state) => state.user.profilePhoto);
  return (
    <>
      <View className="flex-1 absolute">
        <Modal transparent={true} animationType="slide" visible={isVisibles}>
          <View
            className="rounded-t-3xl bg-red-400 space-y-12 flex-1 mt-5 items-center justify-center"
            style={[style.boxShadow, { opacity: 0.89 }]}
          >
            <TouchableOpacity
              className="absolute top-5 right-4 p-1 z-10"
              onPress={isClose}
            >
              <Entypo name="cross" size={30} color="black" />
            </TouchableOpacity>
            <View className="h-24 w-full p-4">
              <Image
                className="h-24 w-full"
                resizeMode="contain"
                source={{
                  uri: "https://links.papareact.com/mg9",
                }}
              />
            </View>
            <View className="flex-row items-center justify-evenly w-full">
              <Image
                className="h-20 w-20 rounded-full"
                source={{ uri: userPhoto }}
              />
              <Text className="text-3xl">❤️❤️</Text>
              <Image
                className="h-20 w-20 rounded-full"
                source={{
                  uri: matchPic,
                }}
              />
            </View>
            <Text className="text-xl">
              You and {matchFirstName} {matchLastName} have a match!!
            </Text>

            <TouchableOpacity
              className="rounded-3xl bg-white px-6 py-2"
              onPress={() => navigation.navigate("Chat")}
              onPressOut={isClose}
            >
              <Text className="text-lg">
                Chat with {matchFirstName} {matchLastName}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    elevation: 9,
  },
});
