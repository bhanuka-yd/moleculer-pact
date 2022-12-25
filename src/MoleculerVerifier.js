import express from "express";


const app = express();
const port = 80; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});


export default class {
    constructor(broker) {
        this.#app = express();
        this.#broker = broker;
    }
}