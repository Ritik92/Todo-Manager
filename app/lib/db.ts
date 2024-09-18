import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error('Missing environment variable: "MONGODB_URL"');
}

const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(); // By default, it will use the default database in the URI
  return { db, client };
}
