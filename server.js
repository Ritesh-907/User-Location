import express from "express";
import fetch from "node-fetch";

const app = express();

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwV-QVriMdUfOPBRtDeMi9NdpaKlIPY08G47PtMaOZRAoL6ssxqp3Xs2VKEEAJHPxsclw/exec";

app.use(express.json());

app.get("/", async (req, res) => {
  try {

    /*
      Example API returning JSON.
      Replace with any API you want.
    */

    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    console.log("Received JSON:");
    console.log(data);

    /*
      Save JSON to Google Sheets
    */

    const saveResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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

app.listen(4000, () => {
  console.log("http://localhost:4000");
});