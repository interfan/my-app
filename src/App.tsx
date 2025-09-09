import * as React from "react";
import {
  Container,
  CssBaseline,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import DynamicForm, { FormConfig } from "./components/DynamicForm";
import { useAppSelector, useAppDispatch } from "./store";
import { login, logout } from "./store/slices/userSlice";

export default function App() {
  const user = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();

  // Signup Form
  const signupConfig: FormConfig = {
    title: "Create an account",
    submitLabel: "Save",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, minLength: 2 },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ],
        helperText: "Choose your role",
      },
      { name: "tos", label: "I agree to the Terms", type: "checkbox", required: true },
    ],
  };

  // Contact Us Form
  const contactConfig: FormConfig = {
    title: "Contact Us",
    submitLabel: "Send Message",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        minLength: 10,
        helperText: "At least 10 characters",
      },
      { name: "subscribe", label: "Subscribe to newsletter", type: "checkbox" },
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 6 }}>
          <Typography variant="h4" gutterBottom>
            Vite + React + TS + MUI + Formik + Redux
          </Typography>

          <Grid container spacing={3}>
            {/* Signup Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <DynamicForm
                  config={signupConfig}
                  onSubmit={(values) => {
                    const name = String(values.name || "");
                    const email = String(values.email || "");
                    dispatch(login({ name, email }));
                  }}
                />
              </Paper>
            </Grid>

            {/* Contact Us Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <DynamicForm
                  config={contactConfig}
                  onSubmit={(values) => {
                    console.log("Contact form submitted:", values);
                    alert("Thank you for reaching out!");
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Redux User State */}
          <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Redux user state
            </Typography>
            <pre style={{ margin: 0 }}>{JSON.stringify(user, null, 2)}</pre>
            {user.isAuthenticated && (
              <Button sx={{ mt: 2 }} variant="outlined" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
