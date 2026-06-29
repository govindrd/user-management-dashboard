import api from "./axios";

// Get all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Add user
export const addUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};

// Update user
export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};