import express, { request } from "express";
import { PORT, mongoDBURL } from "./config.js"
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js'
import cors from 'cors';
const app = express();

//MIDDLEWARE FOR PARSING REQUEST
app.use(express.json());

//Allow All origins with deafult of cors(*)
//app.use(cors())

//Custom origin
app.use(
  cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.get('/', (request, response) => {
  console.log(request)
  return response.status(234).send("Welcome to Bookstore")

});

app.use('/books',booksRoute)

// app.post('/books', async (request, response) => {
//   try {
//     if (
//       !request.body.title ||
//       !request.body.author ||
//       !request.body.publishYear
//     ) {
//       return response.status(400).send({
//         message: 'Send all required fields: title,author,publisher',
//       });
//     }

//     const newBook = {
//       title: request.body.title,
//       author: request.body.author,
//       publishYear: request.body.publishYear,
//     };

//     const book = await Book.create(newBook);
//     return response.status(201).send(book);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// //Route to get All Books from database
// app.get('/books', async (request, response) => {
//   try {


//     const books = await Book.find({});

//     return response.status(200).json({
//       count: books.length,
//       data: books
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });


// //Route to get  books using their ID
// app.get('/books/:id', async (request, response) => {
//   try {

//     const { id } = request.params;
//     const books = await Book.findById(request.params.id);

//     return response.status(200).json(books);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });


// //Route for update a Book

// app.put('/books/:id', async (request, response) => {
//   try {
//     if (
//       !request.body.title ||
//       !request.body.author ||
//       !request.body.publishYear
//     ) {
//       return response.status(400).send({
//         message: 'Send all required fields: title,author,publishYear',
//       });
//     }

//     const { id } = request.params;
//     const result = await Book.findByIdAndUpdate(id, {
//       title: request.body.title,
//       author: request.body.author,
//       publishYear: request.body.publishYear || request.body.publisher // Handle both cases
//     }, { new: true });
//     if (!result) {
//       return response.status(404).json({ message: 'Book not found' });
//     }

//     return response.status(200).json({
//       message: 'Book found',
//       book: result
//     });
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });

//   }

// });


// //Route to Delete a book
// app.delete('/books/:id',async(request,response)=>{
//   try{
//     const{id}= request.params;
//     const result = await Book.findByIdAndDelete(id);

//     if(!result){
//       return response.status(404).json({message:'Book not found'})
//     }
//     return response.status(200).send({message:'Book deleted successfully'})
//   }catch(error){
//     console.log(error.message);
//     response.status(500).send({message: error.message});
//   }
// });

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`)
    })

  })
  .catch((error) => {
    console.log(error);

  });

