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
    const userIp =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const response = await fetch(`https://ipinfo.io/${userIp}/json`);

    const data = await response.json();
    const saveResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const googleBody = await saveResponse.text();

    res.json({
      success: true,
      googleResponse: googleBody,
      data,
    });
    res.json({
      success: true,
      visitorIp: userIp,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
