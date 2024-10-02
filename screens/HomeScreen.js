import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Swiper from "react-native-deck-swiper";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import UserDetails from "../components/UserDetails";
import { useSelector, useDispatch } from "react-redux";
import MatchModal from "../components/MatchModal";
import {
  setConversationIDRedux,
  setMatchIdRedux,
  setMatchRedux,
} from "../features/userSlice";
import MatchEmptyModal from "../components/MatchEmptyModal";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const ref = useRef();
  const navigation = useNavigation();
  const [isMatch, setIsMatch] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [isModalShown, setIsModalShown] = useState(false);
  const [isModalEmptyShown, setIsModalEmptyShown] = useState(false);
  const [people, setPeople] = useState([]);
  const userID = useSelector((state) => state.user.id);
  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const [matchPhoto, setMatchPhoto] = useState("");
  const [matchFName, setMatchFirstName] = useState("");
  const [matchLName, setMatchLastName] = useState("");
  // const firstName = useSelector((state) => state.user.firstName);
  // const lastName = useSelector((state) => state.user.lastName);

  // const age = useSelector((state) => state.user.age);
  // const occupation = useSelector((state) => state.user.occupation);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://192.168.27.159:3001/people");
        const json = await res.json();
        const people = json.filter((user) => user._id !== userID);
        setPeople(people);
      } catch (error) {
        console.log("error occured :", error);
      }
    };

    getData();
  }, [userID]); //remove []

  const modalOpen = () => {
    setIsModalShown(!isModalShown);
  };

  const modalClose = () => {
    setIsModalShown(false);
  };

  const modalEmptyOpen = () => {
    setIsModalEmptyShown(!isModalShown);
  };

  const modalEmptyClose = () => {
    setIsModalEmptyShown(false);
  };

  const swipeLeft = async (cardIndex) => {
    const swipedUresID = people[cardIndex]._id;
    try {
      const putInPass = await fetch(
        `http://192.168.27.159:3001/updateData/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field: "pass",
            value: swipedUresID,
          }),
        }
      );
    } catch (error) {
      console.log("error on putting id in pass", error);
    }
  };

  const swipeRight = async (cardIndex) => {
    const swipedUresID = people[cardIndex]._id;
    dispatch(setMatchIdRedux(swipedUresID));
    const matchFirstName = people[cardIndex].firstName;
    const matchLastName = people[cardIndex].lastName;
    const matchPhotoURL = people[cardIndex].photoURL;

    try {
      const putInMatch = await fetch(
        `http://192.168.27.159:3001/updateData/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field: "match",
            value: swipedUresID,
            matchFirstName: matchFirstName,
            matchLastName: matchLastName,
            matchPhotoURL: matchPhotoURL,
            conversationID: "",
          }),
        }
      );
      if (!putInMatch.ok) {
        throw new Error("Failed to update user matches.");
      }
    } catch (error) {
      console.log("error on putting id in match", error);
    }

    try {
      const isMatch = await fetch(
        `http://192.168.27.159:3001/matchFound/${swipedUresID}`
      );
      const isMatchJson = await isMatch.json();
      const matchFound = isMatchJson.match.some(
        (match) => match.matchID === userID
      );

      if (matchFound) {
        setIsMatch(true);
        setMatchPhoto(matchPhotoURL);
        setMatchFirstName(matchFirstName);
        setMatchLastName(matchLastName);
        try {
          const createConversation = await fetch(
            "http://192.168.27.159:3001/messages",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [],
              }),
            }
          );
          const conversationData = await createConversation.json();
          const conversationID = conversationData._id;

          try {
            const updateMatchConversationID = await fetch(
              `http://192.168.27.159:3001/updateExsistingMatch/${userID}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: swipedUresID,
                  conversationID: conversationID,
                }),
              }
            );
            if (!updateMatchConversationID.ok) {
              throw new Error("Failed to update user matches.");
            }
          } catch (error) {
            console.log("error while updating match conversation ID", error);
          }

          try {
            const updateMatchConversationID = await fetch(
              `http://192.168.27.159:3001/updateExsistingMatch/${swipedUresID}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  value: userID,
                  conversationID: conversationID,
                }),
              }
            );
            if (!updateMatchConversationID.ok) {
              throw new Error("Failed to update user matches.");
            }
          } catch (error) {
            console.log("error while updating match conversation ID", error);
          }
        } catch (error) {}
      } else {
        console.log("No match found yet.");
      }
    } catch (error) {
      console.log("error while finding match", error);
    }
  };

  return (
    <>
      <MatchModal
        isVisibles={isMatch}
        isClose={() => setIsMatch(false)}
        matchPic={matchPhoto}
        matchFirstName={matchFName}
        matchLastName={matchLName}
      />
      <UserDetails isVisible={isModalShown} close={() => modalClose()} />
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-between items-center mx-4 my-2 ">
          <TouchableOpacity
            className="rounded-full border border-solid border-gray-500"
            onPress={modalOpen}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                className="w-8 h-8 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <AntDesign name="user" size={30} color="black" />
            )}
          </TouchableOpacity>
          <Image
            className="w-12 h-12 rounded-full"
            source={require("../assets/tinderLogo.png")}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubbles" size={32} color="#ff615f" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <Swiper
            ref={ref}
            cards={people}
            stackSize={5}
            cardIndex={0}
            animateCardOpacity
            backgroundColor="#f2f2f2"
            verticalSwipe={false}
            onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
            onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
            overlayLabels={{
              left: {
                title: "Nope",
                style: {
                  label: {
                    textAlign: "right",
                    color: "#ff774d",
                  },
                },
              },
              right: {
                title: "Match",
                style: {
                  label: {
                    textAlign: "left",
                    color: "#4ded30",
                  },
                },
              },
            }}
            renderCard={(cards) => {
              return (
                cards && (
                  <View key={cards._id} className="bg-white h-3/4 rounded-lg">
                    {cards.photoURL ? (
                      <Image
                        source={{ uri: cards.photoURL }}
                        className="flex-1 rounded-t-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Text className="text-center text-4xl">
                          😐 No image
                        </Text>
                      </View>
                    )}
                    <View
                      style={styles.shadoWed}
                      className="flex-row items-center justify-between px-4 py-2 bg-white rounded-b-lg"
                    >
                      <View>
                        <Text className="text-lg">{`${cards.firstName} ${cards.lastName}`}</Text>
                        <Text className="text-gray-400">
                          {cards.occupation}
                        </Text>
                      </View>
                      <Text className="text-xl">{cards.age}</Text>
                    </View>
                  </View>
                )
              );
            }}
          />
        </View>
        {/* <View className="absolute top-1/2 left-1/4 z-20">
          <Text className="text-4xl w-48 text-center">
            😇😇😇 Thats it for today folks
          </Text>
        </View> */}

        <View className="flex flex-row justify-evenly my-6 ">
          <TouchableOpacity
            className="bg-red-200 p-3 rounded-full"
            onPress={() => ref.current.swipeLeft()}
          >
            <Entypo name="cross" size={30} color="#ff615f" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-200 p-3 rounded-full"
            onPress={() => ref.current.swipeRight()}
          >
            <AntDesign name="heart" size={30} color="green" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  shadoWed: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
});
