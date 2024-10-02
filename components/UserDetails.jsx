import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import UploadOptionModal from "./UploadOptionModal";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  setAgeRedux,
  setFirstNameRedux,
  setIdRedux,
  setImageURIRedux,
  setProfilePhotoRedux,
  setLastNameRedux,
  setOccupatioRedux,
} from "../features/userSlice";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@clerk/clerk-expo";

export default function UserDetails({ isVisible, close }) {
  const { signOut } = useAuth();
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageURI = useSelector((state) => state.user.imageURI);
  const profilePhoto = useSelector((state) => state.user.profilePhoto);
  const id = useSelector((state) => state.user.id);
  const firstName = useSelector((state) => state.user.firstName);
  const lastName = useSelector((state) => state.user.lastName);
  const age = useSelector((state) => state.user.age);
  const occupation = useSelector((state) => state.user.occupation);
  const dispatch = useDispatch();

  // const saveUser = async () => {
  //   try {
  //     const doFetch = await fetch("http://192.168.27.159:3001/saveData", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstName: firstName,
  //         lastName: lastName,
  //         age: age,
  //         occupation: occupation,
  //         photoURL: profilePhoto,
  //       }),
  //     });
  //     const data = await doFetch.json(); // Log server response
  //     dispatch(setIdRedux(data._id));
  //   } catch (error) {
  //     console.log("Error occurred while saving user:", error);
  //   }
  // };

  const updateUser = async () => {
    try {
      const doFetch = await fetch(
        `http://192.168.27.159:3001/updateData/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            age: age,
            occupation: occupation,
            photoURL: profilePhoto,
          }),
        }
      );
      const data = await doFetch.json(); // Log server response
    } catch (error) {
      console.log("Error occurred while updating user:", error);
    }
  };

  const uploadImage = async (img) => {
    if (!img) return;

    setUploading(true);
    const response = await fetch(img);
    const blob = await response.blob();

    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `images/${Date.now()}`);

    // Upload the file
    uploadBytes(storageRef, blob)
      .then(async (snapshot) => {
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);
        // setDownloadURL(downloadURL);
        dispatch(setProfilePhotoRedux(downloadURL));
        setUploading(false);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      });
  };

  const handelCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setImageURIRedux(result.assets[0].uri));
      uploadImage(result.assets[0].uri);
      handelUploadModalClose();
    }
  };

  const handelGallary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      dispatch(setImageURIRedux(result.assets[0].uri));
      uploadImage(result.assets[0].uri);
      handelUploadModalClose();
    }
  };

  const handelUploadModalOpen = () => {
    setUploadModal(!uploadModal);
  };

  const handelUploadModalClose = () => {
    setUploadModal(false);
  };

  return (
    <>
      <UploadOptionModal
        isUploadOptionModalOpen={uploadModal}
        isUploadOptionModalClose={() => {
          handelUploadModalClose();
        }}
        openGallary={() => {
          handelGallary();
        }}
        openCamera={() => {
          handelCamera();
        }}
      />
      <Modal transparent={true} animationType="slide" visible={isVisible}>
        <SafeAreaView className="flex-1">
          <View
            className="mt-5 rounded-t-3xl bg-[#fff] flex-1"
            style={style.boxShadow}
          >
            <TouchableOpacity
              className="absolute top-5 right-4 p-1 z-10"
              onPress={close}
            >
              <Entypo name="cross" size={30} color="#ff615f" />
            </TouchableOpacity>
            <Image
              source={{ uri: "https://links.papareact.com/2pf" }}
              className="w-full h-20"
              resizeMode="contain"
            />
            <ScrollView keyboardDismissMode="on-drag" className="flex-1">
              <View className="m-4 space-y-4">
                <View className="items-center justify-center">
                  <TouchableOpacity
                    className=" border border-solid border-black rounded-full w-24 h-24 items-center justify-center relative"
                    onPress={handelUploadModalOpen}
                  >
                    {profilePhoto ? (
                      <Image
                        source={{ uri: imageURI }}
                        className="h-[100%] w-[100%] rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <AntDesign name="user" size={20} color="black" />
                    )}
                    <View className="absolute bottom-0 -right-2 bg-white p-1 rounded-full border border-solid border-black">
                      <AntDesign name="camera" size={20} color="black" />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text className="text-base text-center font-bold">
                  Upload profile picture to get more matches
                </Text>
                <Text className="text-base">Enter your name :</Text>
                <TextInput
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                  placeholder="First Name"
                  placeholderTextColor="gray"
                  onChangeText={(e) => dispatch(setFirstNameRedux(e))}
                  value={firstName}
                ></TextInput>
                <TextInput
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                  placeholder="Last Name"
                  placeholderTextColor="gray"
                  onChangeText={(e) => dispatch(setLastNameRedux(e))}
                  value={lastName}
                ></TextInput>
                <Text className="text-base">Enter your age :</Text>
                <TextInput
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                  placeholder="Your Age"
                  placeholderTextColor="gray"
                  onChangeText={(e) => dispatch(setAgeRedux(e))}
                  value={age}
                ></TextInput>
                <Text className="text-base">Enter your occupation :</Text>
                <TextInput
                  className="px-4 py-2 bg-gray-300 rounded-xl"
                  placeholder="Your Occupation"
                  placeholderTextColor="gray"
                  onChangeText={(e) => dispatch(setOccupatioRedux(e))}
                  value={occupation}
                ></TextInput>
                <TouchableOpacity
                  className="rounded-3xl px-4 py-2 bg-[#ff615f]"
                  onPress={updateUser}
                  onPressOut={() => setTimeout(close, 1000)}
                >
                  <Text className="text-white text-center text-base">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-3xl px-4 py-2 border border-solid border-black"
                  onPress={signOut}
                >
                  <Text className="text-center text-base">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
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
