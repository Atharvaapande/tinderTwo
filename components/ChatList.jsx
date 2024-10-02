import { FlatList, Text } from "react-native";
import { useSelector } from "react-redux";
import ChatRow from "./ChatRow";

export default function ChatList({ matchData }) {
  // Ensure matchUsers is converted to an array if it's not already
  return (
    <>
      <FlatList
        data={matchData} // Pass matchUsers as data
        keyExtractor={(item) => item.swipedUresID} // Ensure _id is properly extracted as a string
        renderItem={({ item }) => (
          <ChatRow matchUser={item} conversationID={item.conversationID} />
        )}
        className="mt-2"
      />
    </>
  );
}
