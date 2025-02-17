// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Initialize the Gemini AI API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to generate content
const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text(); // Ensure this returns the expected content
    } catch (err) {
        console.log(err);
        throw new Error("Failed to generate content"); // Handle any errors appropriately
    }
};

// API route for content generation
app.post('/api/content', async (req, res) => {
    try {
        const data = req.body.question; // Get the question from the request body
        if (!data) {
            return res.status(400).send({ error: "No question provided" });
        }
        const result = await generate(data);
        res.send({ "result": result });
    } catch (err) {
        console.log(err); // Log the error for debugging
        res.status(500).send({ error: "Error generating content" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
