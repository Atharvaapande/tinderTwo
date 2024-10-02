import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import { Text, TextInput, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMatchRedux } from "../features/userSlice";

export default function ChatScreen() {
  const matchID = useSelector((state) => state.user.matchID);
  console.log(matchID);
  const userID = useSelector((state) => state.user.id);
  const dispatch = useDispatch();
  const match = useSelector((state) => state.user.match);
  const [matchData, setMatchData] = useState([]);

  useEffect(() => {
    const getSwipedUserandConID = async () => {
      try {
        const isMatch = await fetch(
          `http://192.168.27.159:3001/matchFound/${matchID}`
        );
        const isMatchJson = await isMatch.json();
        setMatchData(isMatchJson);
        const matchFound = isMatchJson.match.some(
          (match) => match.matchID === userID
        );

        if (matchFound) {
          const exist = match.some((match) => match.swipedUresID === matchID);
          const conversationID = isMatchJson.match.find(
            (item) => item.matchID === userID
          )?.conversationID;
          if (!exist)
            dispatch(
              setMatchRedux({
                swipedUresID: isMatchJson._id,
                matchFirstName: isMatchJson.firstName,
                matchLastName: isMatchJson.lastName,
                matchPhotoURL: isMatchJson.photoURL,
                conversationID: conversationID,
              })
            );
        }
      } catch (error) {
        console.log("error while fetching match data in chatScreen", error);
      }
    };
    getSwipedUserandConID();
  }, []);

  return (
    <>
      <SafeAreaView>
        <Header title="Chats" callEnabled={false} />
        {match.length > 0 ? (
          <ChatList matchData={match} />
        ) : (
          <Text className="text-lg font-bold mx-4">No matches yet</Text>
        )}
      </SafeAreaView>
    </>
  );
}
