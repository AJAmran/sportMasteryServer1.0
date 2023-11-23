import { ObjectId } from 'mongodb';


const userCollection = mongoClient.db('sportMaster').collection('users');
const classCollection = mongoClient.db('sportMaster').collection('classes');

export const createClass = async (req, res) => {
  try {
    const item = req.body;
    const result = await classCollection.insertOne(item);
    res.send(result);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).send({ error: true, message: 'Failed to create class' });
  }
};

export const getClasses = async (req, res) => {
  try {
    const result = await classCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error('Error getting classes:', error);
    res.status(500).send({ error: true, message: 'Failed to get classes' });
  }
};

export const getClassesByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { instructorEmail: email };
    const result = await classCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error getting classes by email:', error);
    res.status(500).send({ error: true, message: 'Failed to get classes by email' });
  }
};

export const getClassById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await classCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error('Error getting class by ID:', error);
    res.status(500).send({ error: true, message: 'Failed to get class by ID' });
  }
};

export const updateClassStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = { $set: { status } };
    const result = await classCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    console.error('Error updating class status:', error);
    res.status(500).send({ error: true, message: 'Failed to update class status' });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const query = { _id: new ObjectId(id) };
    const update = { $set: { feedback } };

    const result = await classCollection.updateOne(query, update);
    res.send(result);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).send({ error: true, message: 'Failed to add feedback' });
  }
};

export const reduceSeats = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const update = {
      $inc: { availableSeats: -1, studentNumber: 1 },
    };
    const options = { upsert: true, returnOriginal: false };
    const result = await classCollection.findOneAndUpdate(filter, update, options);
    res.send(result);
  } catch (error) {
    console.error('Error reducing seats:', error);
    res.status(500).send({ error: true, message: 'Failed to reduce seats' });
  }
};
