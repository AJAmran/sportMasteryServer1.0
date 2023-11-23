import { ObjectId } from 'mongodb';


const paymentCollection = mongoClient.db('sportMaster').collection('payments');

export const createPayment = async (req, res) => {
  try {
    const payment = req.body;
    const result = await paymentCollection.insertOne(payment);
    res.send(result);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).send({ error: true, message: 'Failed to create payment' });
  }
};

export const getPaymentsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    const options = { sort: { date: -1 } };
    const result = await paymentCollection.find(query, options).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error getting payments by email:', error);
    res.status(500).send({ error: true, message: 'Failed to get payments by email' });
  }
};

