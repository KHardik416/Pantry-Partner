"use client";

import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Input,
  Modal,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import {
  collection,
  getDoc,
  query,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import InventoryCard from "./InventoryCard";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCount, setItemCount] = useState(1);

  // Variables dealing with images
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // For searchbar
  const [searchQuery, setSearchquery] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]);

  // Ingredients List
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    const ingredients_list = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });

      ingredients_list.push({
        name: doc.id,
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
    setIngredients(ingredients_list);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchQuery, inventory]);

  // Add, remove, delete functionality
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { imageUrl } = docSnap.data();
      if (imageUrl) {
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      await deleteDoc(docRef);
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, imageUrl } = docSnap.data();
      if (quantity === 1) {
        if (imageUrl) {
          const storage = getStorage();
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  const addItem = async (itemName, itemCount, imageUrl) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(
        docRef,
        { quantity: quantity + parseInt(itemCount), imageUrl },
        { merge: true }
      );
    } else {
      await setDoc(docRef, { quantity: parseInt(itemCount), imageUrl });
    }

    await updateInventory();
  };

  const addOne = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, imageUrl } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    }

    await updateInventory();
  };

  // Opening and closing the form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClassifyImage = async () => {
    if (!image) {
      console.error("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api?type=imgtt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data: ", data);
      setItemName(data.generated_text);
    } catch (error) {
      console.error("Error classifying image: ", error);
    }
  };

  // fix imageURL something is wrong with it
  const handleAddItem = async () => {
    if (!itemName || !itemCount) {
      // Handle validation if needed
      console.error("Item name and count are required.");
      return;
    }

    try {
      const storage = getStorage();
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addItem(itemName, itemCount, imageUrl);

      // Reset the fields
      setItemName("");
      setItemCount(1);
      setImage(null);
      setImagePreview("");
      handleClose();
    } catch (error) {
      console.error("Error adding items: ", error);
    }
  };

  const handleCancel = () => {
    setItemName("");
    setItemCount(1);
    setImage(null);
    setImagePreview("");
    handleClose();
  };

  const getRecipe = async () => {
    if (!ingredients || ingredients.length === 0) return;

    const ingredients_str = ingredients
      .map((ingredient) => ingredient.name)
      .join(", ");
    const formData = new FormData();
    formData.append("ingredient", ingredients_str);

    try {
      const response = await fetch("/api?type=recipe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data: ", data);
      setRecipe(data.generated_text || "Recipe not found");
    } catch (error) {
      console.error("Error classifying image: ", error);
    }
  };

  return (
    <Box
      bgcolor={"#CBD5C0"}
      width={"100vw"}
      height={"100vh"}
      padding={"0"}
      margin={"-8px"}
      boxSizing={"border-box"}
    >
      <Box display={"flex"} flexDirection={"row"} padding={"20px"}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            alignContent: "center",
            color: "#4CAF50",
            fontWeight: "bold",
            fontSize: "30px",
            fontStyle: "italic",
          }}
        >
          PantryPal
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Modal open={open} onClose={handleClose}>
            <Box
              position={"absolute"}
              top={"50%"}
              left={"50%"}
              bgcolor={"#E8F5E9"}
              border={"2px solid #333333"}
              boxShadow={24}
              padding={4}
              display={"flex"}
              flexDirection={"column"}
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" color={"#4CAF50"}>
                {/* Soft Blue for headings */}
                Add New Item
              </Typography>
              <Stack width={"100%"} direction={"column"} spacing={2}>
                <TextField
                  variant="outlined"
                  placeholder="Item Name"
                  width={"100%"}
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                />
                <TextField
                  variant="outlined"
                  placeholder="Item Count"
                  width={"100%"}
                  value={itemCount}
                  onChange={(e) => {
                    setItemCount(e.target.value);
                  }}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePreview}
                  style={{ marginBottom: "16px" }}
                />
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Image Preview"
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "200px",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  onClick={handleClassifyImage}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#388E3C",
                    },
                  }} // Fresh Green button
                >
                  Classify Image
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddItem}
                  sx={{
                    bgcolor: "#FF9800",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#F57C00",
                    },
                  }}
                >
                  Add Item
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  sx={{
                    bgcolor: "#F44336",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#D32F2F",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Modal>

          <TextField
            variant="outlined"
            value={searchQuery}
            onChange={(e) => {
              setSearchquery(e.target.value);
            }}
            placeholder="Search your pantry :)"
            sx={{
              borderColor: "#2196F3", // Soft Blue for the outline
            }}
          />

          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
            sx={{ bgcolor: "#4CAF50", color: "#ffffff" }} // Fresh Green button
          >
            Add New Item
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              getRecipe();
            }}
            sx={{ bgcolor: "#FF9800", color: "#ffffff" }} // Warm Orange button
          >
            Suggest a Dish
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingTop: "10px",
        }}
      >
        {/* Inventory Section */}
        <Box sx={{ width: "65%" }}>
          <Grid container spacing={3}>
            {/* Increased spacing for a cleaner look */}
            {filteredInventory.map(({ name, quantity, imageUrl }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <InventoryCard
                  name={name}
                  quantity={quantity}
                  imageUrl={imageUrl}
                  deleteItem={deleteItem}
                  removeItem={removeItem}
                  addItem={addOne}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Suggested Recipe Section */}
        <Box
          sx={{
            width: "35%",
            height: "70vh",
            bgcolor: "#DFE6DA",
            borderRadius: "8px",
            boxShadow: 3,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              marginBottom: "16px",
              fontWeight: "bold",
              color: "#4CAF50",
            }}
          >
            Suggested Recipe:
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#333333",
              padding: "0 12px",
              lineHeight: "1.6",
            }}
          >
            {recipe}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
