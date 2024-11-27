import { configureStore } from '@reduxjs/toolkit';
import { blogsApi } from './feature/blogs/blogsApi';
import authApi from './feature/auth/authApi';
import authReducer from './feature/auth/authSlice';
import commentApi from './feature/comments/commentApi';

export const store = configureStore({
  reducer: {
    [blogsApi.reducerPath]: blogsApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogsApi.middleware, commentApi.middleware, authApi.middleware),
});
