import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const departments = [
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
];

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
};

function UserForm({ open, onClose, onSave, selectedUser }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
    } else {
      setFormData(initialState);
    }

    setErrors({});
  }, [selectedUser, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    let temp = {};

    if (!formData.firstName.trim()) {
      temp.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      temp.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      temp.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      temp.email = "Invalid email address";
    }

    if (!formData.department) {
      temp.department = "Department is required";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave(formData);

    setFormData(initialState);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData(initialState);
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {selectedUser ? "Edit User" : "Add User"}
      </DialogTitle>

      <DialogContent>

        <TextField
          margin="normal"
          fullWidth
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          select
          margin="normal"
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          error={!!errors.department}
          helperText={errors.department}
        >
          {departments.map((dept) => (
            <MenuItem
              key={dept}
              value={dept}
            >
              {dept}
            </MenuItem>
          ))}
        </TextField>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={handleCancel}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {selectedUser ? "Update" : "Save"}
        </Button>

      </DialogActions>
    </Dialog>
  );
}

export default UserForm;