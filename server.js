import express from "express";
import fetch from "node-fetch";

const app = express();

const PORT = process.env.PORT || 4000;

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwV-QVriMdUfOPBRtDeMi9NdpaKlIPY08G47PtMaOZRAoL6ssxqp3Xs2VKEEAJHPxsclw/exec";

app.use(express.json());

/*
  Health Check Route
*/
app.get("/", (req, res) => {
  res.send("Server is running");
});

/*
  Save data to Google Sheets
*/
app.get("/save", async (req, res) => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    console.log("Received JSON:");
    console.log(data);

    const saveResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    /*
      If your Apps Script returns JSON,
      keep .json()

      Otherwise use .text()
    */
    const result = await saveResponse.json();

    console.log(result);

    res.json({
      success: true,
      saved: result,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});