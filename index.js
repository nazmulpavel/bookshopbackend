const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const uri = "mongodb://localhost:27017/";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.wpi0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    // const userCollection = client.db("test-db").collection("test-users")
    const userListCollection = client.db("test-db").collection("userList")
    const categoryCollection = client.db("test-db").collection("categories")
    const productsCollection = client.db("test-db").collection("products")
    const categoryProductsCollection = client.db("test-db").collection("products")


    app.post("/addCategory", async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await categoryCollection.insertOne(category);
      res.send(result);
    });
    app.get("/categories", async (req, res) => {
      const qry = categoryCollection.find();
      const rslt = await qry.toArray();
      console.log(rslt.name);
      res.send(rslt)
    });



    app.get("/category/products/:cat_id", async (req, res) => {
      const cat_id = req.params.cat_id; // Convert to number if necessary
      const query = { categoryId: cat_id };
      const result = await categoryProductsCollection
        .find(query)
        .toArray();
      res.send(result);
    });

    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });

    // prodcuts portion
    app.get("/products", async (req, res) => {
      const qry = productsCollection.find();
      const rslt = await qry.toArray();
      res.send(rslt)
    });
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/productList/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await productsCollection.find({ query });
      console.log(result);
      res.send(result);
    });

    app.post("/userList", async (req, res) => {
      const users = req.body;
      console.log(users);
      const result = await userListCollection.insertOne(users);
      res.send(result);
    });

    app.get("/userList", async (req, res) => {
      const qry = userListCollection.find();
      const rslt = await qry.toArray();
      res.send(rslt)
    });
    app.get("/userlist/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await userListCollection.findOne(query);
      res.send(result);
    });


    // Update user by id
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      console.log({ user });
      const updatedUser = {
        $set: {
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          address: user.address,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        },
      };

      const result = await userListCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });



    app.put("/userlist/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);

      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updatedUser = {
        $set: {
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          address: user.address,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Bootcamp React Node CRUD Server is Running");
});

app.listen(port, () => {
  console.log(`Bootcamp React Node CRUD Server is Running on ${port}`);
});
