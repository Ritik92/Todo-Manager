// seed.js
const { MongoClient, ObjectId } = require('mongodb');
const { hash } = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string - replace with your actual connection string from .env
const MONGODB_URI = process.env.MONGODB_URL;

// This function replicates the connectToDatabase function from your app
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();
  return { db, client };
}

// Seed database function
async function seedDatabase() {
    let client;
  
    try {
      // Connect to the database using the same pattern as your app
      const { db, client: mongoClient } = await connectToDatabase();
      client = mongoClient;
      console.log('Connected to MongoDB');
      
      // Clear existing data
      console.log('Clearing existing collections...');
      await db.collection('users').deleteMany({});
      await db.collection('tasks').deleteMany({});
      console.log('Collections cleared');
  
      // Create a user with only the fields from your schema
      const userId = new ObjectId();
      const hashedPassword = await hash('Password123!', 10);
      
      const user = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: hashedPassword
      };
  
      const userResult = await db.collection('users').insertOne(user);
      console.log('Created user with ID:', userResult.insertedId.toString());
  
      // Task data - using only the fields in your schema
      const taskData = [
        {
          title: 'Complete project proposal',
          description: 'Finalize the project proposal document including budget, timeline, and resource allocation.',
          status: 'To Do',
          priority: 'High',
          dueDate: new Date(2025, 5, 15), // June 15, 2025
          userId: userResult.insertedId.toString() // String format as used in your API
        },
        {
          title: 'Fix navigation bug',
          description: 'The dropdown menu in the navigation bar isn\'t working on mobile devices. Debug and fix the issue.',
          status: 'In Progress',
          priority: 'High',
          dueDate: new Date(2025, 4, 20), // May 20, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Client status meeting',
          description: 'Prepare slides and talking points for the weekly client status meeting.',
          status: 'Completed',
          priority: 'Medium',
          dueDate: new Date(2025, 4, 10), // May 10, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Implement user profile page',
          description: 'Create the user profile page with photo upload, personal information editing, and settings options.',
          status: 'To Do',
          priority: 'Medium',
          dueDate: new Date(2025, 6, 1), // July 1, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Review pull request #42',
          description: 'Review code changes in PR #42 for the authentication service refactoring.',
          status: 'In Progress',
          priority: 'Medium',
          dueDate: new Date(2025, 4, 25), // May 25, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Update API documentation',
          description: 'Update the API documentation to include the newly added endpoints and parameter changes.',
          status: 'To Do',
          priority: 'Low',
          dueDate: new Date(2025, 5, 30), // June 30, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Database optimization',
          description: 'Identify and implement optimizations for slow-performing database queries.',
          status: 'To Do',
          priority: 'High',
          dueDate: new Date(2025, 5, 20), // June 20, 2025
          userId: userResult.insertedId.toString()
        },
        {
          title: 'Create user onboarding flow',
          description: 'Design and implement an improved user onboarding experience for new sign-ups.',
          status: 'Completed',
          priority: 'Medium',
          dueDate: new Date(2025, 4, 5), // May 5, 2025
          userId: userResult.insertedId.toString()
        }
      ];
  
      // Insert tasks
      const result = await db.collection('tasks').insertMany(taskData);
      console.log(`Created ${result.insertedCount} tasks`);
  
      console.log('Database seeding completed successfully');
      
      // Print login information
      console.log('\n----- Login Information -----');
      console.log('Email: john.smith@example.com');
      console.log('Password: Password123!');
      console.log('-----------------------------\n');
      
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      // Close the database connection
      if (client) {
        await client.close();
        console.log('Database connection closed');
      }
    }
  }
  
  // Run the seeding function
  seedDatabase().catch(console.error);
  
  // Run the seeding function
  seedDatabase().catch(console.error);