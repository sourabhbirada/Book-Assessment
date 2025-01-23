const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const BOOK = require('../models/book');
const http = require('http');
const exp = require('constants');

beforeAll(async () => {
  
  await mongoose.connect('mongodb+srv://sourabh:F7xHxinq8rVK6atM@cluster0.8gdqi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {

  await mongoose.connection.close();
});

let server;

beforeAll((done) => {
  server = http.createServer(app).listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});


afterEach(async () => {
  await BOOK.deleteMany();
});




describe('Book API ', () => {
  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Book',
          author: 'Author',
          isbn: '12347',
          publishedDate: 2023
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.book.title).toBe('Book');
    });
    it('should return 400 for duplicate ISBN', async () => {
      const bookData = {
        title: 'New Book',
        author: 'New Author',
        isbn: '12347',  
        publishedDate: 2023,
      };
      
      await request(app).post('/api/books').send(bookData);
      
      const res = await request(app).post('/api/books').send(bookData);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Validation error: ISBN must be unique');
    });
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book'
        });
      expect(res.statusCode).toBe(400);
    });
  });
  describe('Get /api/books' , () => {
    it('should get all books', async () => {
      await BOOK.deleteMany(); 
      await BOOK.create([
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9787' },
          { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9700' }
      ]);
  
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.books.length).toBe(2);
    });
  
    it('should return 404 if no books are found', async () => {
      await BOOK.deleteMany(); 
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(404);
    });
  })
  describe("PUT /api/books/:id" , () => {
    let bookid;
    beforeEach(async () => {
      const book = await BOOK.create({
        title: 'Original Title',
        author: 'Original Author',
        isbn: '002300',
        publishedDate: 2020
      })
      bookid = book._id
      })
    it("Should update the book" ,  async () => {
      const res = await request(app).put(`/api/books/${bookid}`).send(
        {
          title:"update title",
          author:"update author"
        }
      )
      expect(res.statusCode).toBe(202)
      expect(res.body.book.title).toBe("update title")
      expect(res.body.book.author).toBe("update author")
    }) 
    it("Should return 400 if no field pass" , async () => {
      const res = await request(app).put(`/api/books/${bookid}`).send({})

      expect(res.statusCode).toBe(400)
    })
    it('should return 404 if book not found', async () => {
      const fakeid = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/books/${fakeid}`)
        .send({
          title: 'Updated Title'
        });
      expect(res.statusCode).toBe(404);
    });

    it('should update only title if only title provided', async () => {
      const res = await request(app)
        .put(`/api/books/${bookid}`)
        .send({
          title: 'Only Title Updated'
        });
      expect(res.statusCode).toBe(202);
      expect(res.body.book.title).toBe('Only Title Updated');
      expect(res.body.book.author).toBe('Original Author');
    }); 
  })
  describe('DELETE /api/books/:id', () => {
    let bookId;
    beforeEach(async () => {
      const book = await BOOK.create({
        title: 'Book to Delete',
        author: 'Delete Author',
        isbn: '9999999999',
        publishedDate: 2021
      });
      bookId = book._id;
    });
    it('should delete a book', async () => {
      const res = await request(app).delete(`/api/books/${bookId}`);
      expect(res.statusCode).toBe(202);
      expect(res.body.book.title).toBe('Book to Delete');
      const deletedBook = await BOOK.findById(bookId);
      expect(deletedBook).toBeNull();
    });
    it('should return 404 if book not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/books/${fakeId}`);
      expect(res.statusCode).toBe(404);
    })
  })
  describe('Search /api/books/search', () => {
    it('should search books by title', async () => {
      await BOOK.create([
        { title: 'mern', author: 'node.js', isbn: '9787' },
        { title: 'java', author: 'springboot', isbn: '9700' },
      ]);
  
      const res = await request(app).get('/api/books/search').query({ title: 'mern' });
      expect(res.statusCode).toBe(200);
      expect(res.body.books.length).toBe(1);
      expect(res.body.books[0].title).toBe('mern');
    })
  })
});