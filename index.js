const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET_KEY}@cluster0.fp5eepf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristSpotDatabase = client.db("tourDB");
    const touristSpotCollection = touristSpotDatabase.collection("touristSpot");
    const countryCollection = touristSpotDatabase.collection("country");

    app.get("/touristSpot", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.put("/touristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTouristSpot = {
        $set: {
          spotName: req.body.spotName,
          countryName: req.body.countryName,
          imageUrl: req.body.imageUrl,
          location: req.body.location,
          averageCost: req.body.averageCost,
          seasonality: req.body.seasonality,
          travelTime: req.body.travelTime,
          totalVisitorsPerYear: req.body.totalVisitorsPerYear,
          shortDescription: req.body.shortDescription,
        },
      };
      const result = await touristSpotCollection.updateOne(
        query,
        updateTouristSpot,
        options
      );
      res.send(result);
      console.log(id, query, result);
    });

    app.post("/touristSpot", async (req, res) => {
      const newTouristSpot = req.body;
      console.log(newTouristSpot);
      const result = await touristSpotCollection.insertOne(newTouristSpot);
      res.send(result);
    });

    app.get("/myTouristSpot/:email", async (req, res) => {
      const result = await touristSpotCollection
        .find({ userEmail: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete("/myTouristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/country", async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dream Tourism server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
