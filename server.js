require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.get("/", (req, res) => {
  res.send("CasaVib Agent is running!");
});

app.post("/find-product", async (req, res) => {

  try {

    const { niche } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro"
    });

    const prompt = `
ابحث عن أفضل المنتجات الرابحة حاليا في مجال ${niche}

أعطني:
- اسم المنتج
- سبب نجاحه
- سعر الشراء
- سعر البيع
- هامش الربح
`;

    const result =
      await model.generateContent(prompt);

    res.json({
      success: true,
      data: result.response.text()
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
