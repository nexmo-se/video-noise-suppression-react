import { useContext } from "react";
import {
  Box,
  TextField, 
} from "@mui/material";

import { UserContext } from '../../context/UserContext';

export const UserSetting = () => {
  const { user, setUser } = useContext(UserContext);

  const handleUsernameChange = (e) => {
    localStorage.setItem("username", e.target.value);
    setUser({ ...user, username: e.target.value });
  };

  return (<>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField
      id="username"
      label="* Your Name"
      variant="outlined"
      value={user.username}
      onChange={handleUsernameChange}
    />
    </Box>
  </>);
};
