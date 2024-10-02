import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ChatRow({ matchUser, conversationID }) {
  const navigation = useNavigation();
  const matchUserName = `${matchUser.matchFirstName} ${matchUser.matchLastName}`;
  const matchUserID = matchUser.swipedUresID;
  const matchUserFirstName = matchUser.matchFirstName;
  const matchPhotoURL = matchUser.matchPhotoURL;
  return (
    <>
      <TouchableOpacity
        className="mt-2"
        onPress={() =>
          navigation.navigate("MessageScreen", {
            matchUserFirstName: matchUserFirstName,
            matchUsersID: matchUserID,
            title: matchUserName,
            callEnable: true,
            conversationID,
            matchPhotoURL: matchPhotoURL,
          })
        }
      >
        <View className="flex-row items-center mx-6 my-2 space-x-6">
          <Image
            source={{ uri: matchPhotoURL }}
            resizeMode="cover"
            className="h-14 w-14 rounded-full ml-2"
          />
          <Text className="text-lg font-bold">{matchUserName}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}
