const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENT_SERECT);
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.129hgrr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const secretKey = process.env.SECRET;

//Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    const userCollection = client.db("sportMaster").collection("users");
    const classCollection = client.db("sportMaster").collection("classes");
    const paymentCollection = client.db("sportMaster").collection("payments");

    //JWT Post
    app.post("/create-jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secretKey, { expiresIn: "6h" });
      res.send({ token });
    });

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user?.role !== "admin") {
        return res
          .status(403)
          .send({ error: true, message: "forbidden message" });
      }
      next();
    };

    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user?.role !== "instructor") {
        return res
          .status(403)
          .send({ error: true, message: "forbidden message" });
      }
      next();
    };

    

    // class activity
    app.post("/classes", async (req, res) => {
      const item = req.body;
      const result = await classCollection.insertOne(item);
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    app.get("/email/classes/:email", async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    app.put("/classes/:id", authenticateToken, async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = { $set: { status } };
      const result = await classCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.post("/classes/:id/feedback", async (req, res) => {
      const { id } = req.params;
      const { feedback } = req.body;

      try {
        const query = { _id: new ObjectId(id) };
        const update = { $set: { feedback } };

        const result = await classCollection.updateOne(query, update);
        res.send(result);
      } catch (error) {
        console.error("Error updating class feedback:", error);
        res
          .status(500)
          .send({ error: true, message: "Failed to update class feedback" });
      }
    });

    app.put(
      "/classes/:id/reduce-seats",
      authenticateToken,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = {
          $inc: { availableSeats: -1 },
          $inc: { studentNumber: 1 },
        };
        const options = { upsert: true, returnOriginal: false };
        const result = await classCollection.findOneAndUpdate(
          filter,
          update,
          options
        );
        res.send(result);
      }
    );

    //user activity
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "Already Exists" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", authenticateToken, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", authenticateToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.get(
      "/users/admin/:email",
      authenticateToken,
      verifyAdmin,
      async (req, res) => {
        const email = req.params.email;

        if (req.decoded.email !== email) {
          res.send({ admin: false });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);
        const result = { admin: user?.role === "admin" };
        res.send(result);
      }
    );

    app.get(
      "/users/instructor/:email",
      authenticateToken,
      verifyInstructor,
      async (req, res) => {
        const email = req.params.email;

        if (req.decoded.email !== email) {
          res.send({ instructor: false });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);
        const result = { instructor: user?.role === "instructor" };
        res.send(result);
      }
    );

    app.get(
      "/users/student/:email",
      authenticateToken,
      verifyStudent,
      async (req, res) => {
        const email = req.params.email;

        if (req.decoded.email !== email) {
          res.send({ student: false });
        }

        const query = { email: email };
        const user = await userCollection.findOne(query);
        const result = { student: user?.role === "student" };
        res.send(result);
      }
    );

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, update);
      res.send(result);
    });

    app.patch("/users/instructor/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: {
          role: "instructor",
        },
      };
      const result = await userCollection.updateOne(filter, update);
      res.send(result);
    });

    //paymentSystem
    app.post("/create-payment-intent", authenticateToken, async (req, res) => {
      const { price } = req.body;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payments", authenticateToken, async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    });

    app.get("/payments/:email", authenticateToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const options = { sort: { date: -1 } };
      const result = await paymentCollection.find(query, options).toArray();
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Sport Master is running");
});

app.listen(port, () => {
  console.log(`Sport Master is listening on port ${port}`);
});
