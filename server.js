import express from "express";
import fetch from "node-fetch";

const app = express();

const PORT = process.env.PORT || 4000;

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwV-QVriMdUfOPBRtDeMi9NdpaKlIPY08G47PtMaOZRAoL6ssxqp3Xs2VKEEAJHPxsclw/exec";

app.use(express.json());

console.log("DEPLOY VERSION: DEBUG-V1");

/*
  Health check
*/
app.get("/", (req, res) => {
  res.send("Server is running");
});

/*
  Fetch IP data and save to Google Sheets
*/
app.get("/save", async (req, res) => {
  try {
    // Get IP information
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    console.log("IP Data:");
    console.log(data);

    // Send to Google Apps Script
    const saveResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // IMPORTANT: DO NOT USE .json()
    const googleBody = await saveResponse.text();

    console.log("Google Status:", saveResponse.status);
    console.log("Google Response:");
    console.log(googleBody);

    res.json({
      success: true,
      googleStatus: saveResponse.status,
      googleResponse: googleBody,
      data,
    });
  } catch (error) {
    console.error("ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});