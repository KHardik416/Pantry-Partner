"use client";

import { Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";
// import auth from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed In
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <TextField
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <TextField
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <Button
        variant="outlined"
        onClick={() => {
          signIn();
          setEmail("");
          setPassword("");
        }}
      />
    </Box>
  );
}
