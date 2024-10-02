import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: String | null,
    matchID: String | null,
    firstName: String | null,
    lastName: String | null,
    age: String | null,
    occupation: String | null,
    imageURI: null,
    profilePhoto: null,
    match: [],
  },
  reducers: {
    setIdRedux: (state, action) => {
      state.id = action.payload;
    },
    setMatchIdRedux: (state, action) => {
      state.matchID = action.payload;
    },
    setImageURIRedux: (state, action) => {
      state.imageURI = action.payload;
    },
    setProfilePhotoRedux: (state, action) => {
      state.profilePhoto = action.payload;
    },
    setFirstNameRedux: (state, action) => {
      state.firstName = action.payload;
    },
    setLastNameRedux: (state, action) => {
      state.lastName = action.payload;
    },
    setAgeRedux: (state, action) => {
      state.age = action.payload;
    },
    setOccupatioRedux: (state, action) => {
      state.occupation = action.payload;
    },
    setMatchRedux: (state, action) => {
      state.match.push(action.payload);
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIdRedux,
  setMatchIdRedux,
  setImageURIRedux,
  setProfilePhotoRedux,
  setFirstNameRedux,
  setLastNameRedux,
  setAgeRedux,
  setOccupatioRedux,
  setMatchRedux,
} = userSlice.actions;

export default userSlice.reducer;
