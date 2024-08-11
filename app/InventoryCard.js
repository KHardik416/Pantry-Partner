import React from "react";
import { Box, Typography, Button } from "@mui/material";

const InventoryCard = ({
  name,
  quantity,
  imageUrl,
  deleteItem,
  removeItem,
  addItem,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#DFE6DA",
        padding: "16px",
        boxShadow: 3,
        borderRadius: "12px",
        boxSizing: "border-box",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Typography
        variant="h5"
        color={"#333"}
        textAlign={"center"}
        sx={{ fontWeight: "bold" }}
      >
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "150px",
            borderRadius: "8px",
            marginTop: 2,
            objectFit: "cover",
          }}
        />
      )}

      <Typography
        variant="subtitle1"
        color={"#555"}
        textAlign={"center"}
        marginTop={2}
      >
        Quantity: {quantity}
      </Typography>

      <Box display={"flex"} flexDirection={"row"} gap={1} marginTop={2}>
        <Button
          variant="contained"
          sx={{
            minWidth: "40px",
            bgcolor: "#4CAF50",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#388E3C",
            },
          }}
          onClick={() => addItem(name)}
        >
          +
        </Button>
        <Button
          variant="contained"
          sx={{
            minWidth: "40px",
            bgcolor: "#FF9800",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#F57C00",
            },
          }}
          onClick={() => removeItem(name)}
        >
          -
        </Button>
        <Button
          variant="contained"
          sx={{
            minWidth: "100px",
            bgcolor: "#F44336",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#D32F2F",
            },
          }}
          onClick={() => deleteItem(name)}
        >
          Remove
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryCard;
