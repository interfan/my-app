import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: null,
  name: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; name: string }>) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.email = null;
      state.name = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
