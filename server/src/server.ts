import express from "express";
const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/hello', (req, res) => {
    res.json({msg: "hello world"})
})
app.post('/api/post', (req, res) => {
    res.send(req.query)
})
app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
})
