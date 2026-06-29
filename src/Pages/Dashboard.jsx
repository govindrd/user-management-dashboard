import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { getUsers, addUser, updateUser, deleteUser } from "../api/userApi";
import UserForm from "../../Components/UserForm";

const departments = ["Engineering", "HR", "Marketing", "Finance", "Sales"];

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      const formattedUsers = data.map((user, index) => {
        const names = user.name.split(" ");
        return {
          id: user.id,
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          email: user.email,
          department: departments[index % departments.length],
        };
      });
      setUsers(formattedUsers);
    } catch (err) {
      handleError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    setError(message);
    setSnackOpen(true);
  };

  const handleCloseSnack = () => {
    setSnackOpen(false);
  };

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        });
        setUsers((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, ...userData } : user
          )
        );
      } else {
        const created = await addUser({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        });
        const newUser = {
          id: created.id || Math.max(0, ...users.map((u) => u.id)) + 1,
          ...userData,
        };
        setUsers((prev) => [...prev, newUser]);
      }
      handleCloseForm();
    } catch (err) {
      handleError("Unable to save user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Delete this user? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      handleError("Unable to delete user. Please try again.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = searchQuery.toLowerCase();
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchText) ||
        user.lastName.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText);
      const matchesDepartment =
        !departmentFilter || user.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [users, searchQuery, departmentFilter]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            User Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users with dynamic search, filters, and responsive cards.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ minWidth: 160 }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 4 }}>
        <TextField
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name or email"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          fullWidth
          label="Filter by Department"
          value={departmentFilter}
          onChange={(event) => setDepartmentFilter(event.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Grid key={user.id} item xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        ID #{user.id}
                      </Typography>
                      <Chip size="small" label={user.department} color="primary" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton color="primary" onClick={() => handleOpenEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  No users match your search.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting the search term or department filter.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <UserForm
        open={formOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
        selectedUser={selectedUser}
      />

      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;
