import { ObjectId } from 'mongodb';


const userCollection = mongoClient.db('sportMaster').collection('users');

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: 'Already Exists' });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ error: true, message: 'Failed to create user' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await userCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).send({ error: true, message: 'Failed to get users' });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const result = await userCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.error('Error getting user by email:', error);
    res.status(500).send({ error: true, message: 'Failed to get user by email' });
  }
};

// Other user-related controller functions can be added here
// ...

