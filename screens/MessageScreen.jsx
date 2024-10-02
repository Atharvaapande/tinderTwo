import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

export default function MessageScreen({ route }) {
  const {
    matchUserFirstName,
    title,
    callEnable,
    conversationID,
    matchPhotoURL,
  } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const username = useSelector((state) => state.user.firstName);
  const receiver = matchUserFirstName;
  const flatListRef = useRef(null);

  useEffect(() => {
    const newSocket = io("http://192.168.27.159:3001");
    setSocket(newSocket);

    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("chatHistory", (data) => {
      if (data && Array.isArray(data.chat)) {
        setMessages(data.chat);
      } else {
        console.error("Chat history is not an array:", data);
      }
    });

    newSocket.emit("fetchChatHistory", conversationID);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("sendMessage", {
        chatID: conversationID,
        sender: username,
        receiver: receiver,
        content: message,
      });
      setMessage("");
    }
  };

  const renderMessageItem = ({ item }) => {
    return item.sender === username ? (
      <>
        <View className="self-end bg-purple-600 rounded-2xl rounded-tr-none px-6 py-2 mb-2 max-w-[70%]">
          <Text className="text-white text-base">{item.content}</Text>
          <Text className="text-white text-xs font-light text-end">
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text className="self-end">{item.sender}</Text>
      </>
    ) : (
      <>
        <View className="flex-row space-x-1 items-center justify-center self-start max-w-[70%]">
          <Image
            source={{ uri: matchPhotoURL }}
            className="h-9 w-9 rounded-full bg-red-400"
            resizeMode="cover"
          />
          <View>
            <View className=" bg-[#ff615f] rounded-2xl rounded-tl-none px-6 py-2 mb-2">
              <Text className="text-white text-base">{item.content}</Text>
              <Text className="text-white text-xs font-light text-start">
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
        <Text className="ml-10">{item.sender}</Text>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <Header title={title} callEnabled={callEnable} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={200} // Adjust based on your header height
        className="flex-1"
      >
        <View className="flex-1 mx-2">
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            inverted={true}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardDismissMode="interactive"
            className="flex-1 mb-12"
          />

          <View className="absolute bottom-1 left-0 flex-row items-center justify-center space-x-2">
            <TextInput
              className="rounded-3xl px-4 py-2 border border-solid border-gray-300 w-[88%]"
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message"
              onSubmitEditing={sendMessage}
              returnKeyType="send" // Set the return key type for better UX
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" color="#ff615f" size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
