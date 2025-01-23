const { mongoose, Schema, Model, model } = require("mongoose");

const BookSchema = new Schema({
    title:{
        type:String,
        trim:true,
        require:[true , 'Please provide a title for the book'],
        maxlength:[70, 'Title cannot be more than 70 characters']
        
    },
    author:{
        type:String,
        required: [true, 'Please provide the author\'s name'],
        trim: true,
        maxlength: [50, 'Author name cannot be more than 50 characters']
    },
    isbn:{
        type:String,
        trim:true,
        required: [true, 'ISBN is required'],
        unique:true,
    },
    publishedDate:{
        type:Date
        
    }
}, {timestamps:true})


BookSchema.pre("validate", async function (next) {
    
    const existingBook = await this.constructor.findOne({ isbn: this.isbn });
    if (existingBook) {
        this.invalidate("isbn", "ISBN must be unique");
    }
    next();
});

BookSchema.post('save' , (err , doc , next) => {
    if(err.name ==='MongoError' && err.code === 11000){
        next(new Error("There was a duplicate key error"))
    }else {
        next(err)
    }
})

const BOOK = model("books" , BookSchema)

module.exports = BOOK;