import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Link,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import FondoLogin from "./images/FondoLogin.png";
import Logo from "./images/Logo.png";
import "./App.css";
import { login } from "./api";

export type AuthUser = {
  access_token: string;
};

type LoginProps = {
  onUserLogin: (user: AuthUser) => void;
};

export const Login = ({ onUserLogin }: LoginProps) => {
  const location = useLocation();
  const [email, emailSet] = useState("");
  const [password, passwordSet] = useState("");
  const [error, errorSet] = useState("");
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verifyEmailAddress, setVerifyEmailAddress] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verifyEmail") === "1") {
      setShowVerifyPopup(true);
      if (params.get("email")) {
        setVerifyEmailAddress(params.get("email") || "");
      }
      params.delete("verifyEmail");
      params.delete("email");
      const url = location.pathname;
      const newSearch = params.toString();
      const newUrl = newSearch ? `${url}?${newSearch}` : url;
      window.history.replaceState({}, "", newUrl);
    }
  }, [location]);

  async function onclickHandler() {
    errorSet("");
    try {
      const data = await login(email, password);
      onUserLogin(data);
    } catch (ex) {
      console.warn(ex);
      errorSet("Login failed");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${FondoLogin})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: { xs: "none", sm: "block" },
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: 280 }, maxWidth: 280, mx: "auto", p: 3 }}>
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <Box textAlign="center">
              <img src={Logo} alt="Magic Friendly Trade logo" style={{ maxWidth: "200px", width: "100%" }} />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => emailSet(e.target.value.toLowerCase())}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => passwordSet(e.target.value)}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={onclickHandler}
              disabled={!email || !password}
            >
              Continue
            </Button>
            <Box display="flex" justifyContent="space-between">
              <Link component={RouterLink} to="/forgot-password" sx={{ fontSize: "0.8rem" }}>
                ¿Has olvidado la contraseña?
              </Link>
              <Link component={RouterLink} to="/register" sx={{ fontSize: "0.8rem" }}>
                Regístrate
              </Link>
            </Box>
          </Box>
    </Box>
      </Box>
      <Dialog
        open={showVerifyPopup}
        onClose={() => setShowVerifyPopup(false)}
      >
        <DialogTitle>Verifica tu correo</DialogTitle>
        <DialogContent>
          <Typography>
            Te hemos enviado un correo de confirmación a {verifyEmailAddress}. Revisa tu bandeja de entrada para activar tu cuenta.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVerifyPopup(false)}>Entendido</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
