const BOOK = require("../models/book")

async function Createbook(req , res) {
    const { title, author, isbn, publishedDate } = req.body

    try {
        if (!title || !author || !isbn || !publishedDate) {
            return res.status(400).json({ message: "Please provide all required fields: title, author, ISBN, and published date." })
        }
        const book = await BOOK.create({
            title,
            author,
            isbn,
            publishedDate:new Date(publishedDate)
        })
        res.status(201).json({message:`${book.title} has been created` , book})
    } catch (error) {
        if(error.code ===  11000){
            console.error("Duplicate Key Error:", error.keyValue);
            return res.status(400).json({ message: `Duplicate Key Error: ${JSON.stringify(error.keyValue)}` });
        }
        console.error("Error creating book:", error)
        res.status(500).json({message:"Oops! We encountered an unexpected error while adding the book. Please try again later."})  
    }
}

async function Getallbook(req , res) {
    
    try {
        const page = Number.parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 1
        const skip = req.query.skip || 0
        const sortdata = req.query.sortBy || "title"
        const sortorder = req.query.order || 'desc'?-1:1

        const vaildatesortdata =['title', 'author', 'isbn', 'publishedDate']
        if(!vaildatesortdata.includes(sortdata)){
            return res.status(400).json({ message: `Invalid sort field. Allowed fields are: ${vaildatesortdata.join(', ')}` });
        }

        const books = await BOOK.find({}).sort({[sortdata]:sortorder}).skip(skip).limit(limit)

        const totalbook =  await BOOK.countDocuments();
        const totalpages = Math.ceil(totalbook/limit)

        if(books.length  === 0){
            return res.status(404).json({message:"Be the first to add a book!"})
        }

        res.status(200).json({message:"Found" , books,
            pagination: {
                currentPage: page,
                totalpages,
                totalbook
              },
        })
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({message:"Oops! We encountered an unexpected error . Please try again later."})  
    }
}

async function GetbookbyId(req , res) {
    const {id} = req.params

    try {
        const book = await BOOK.findById({_id:id})

        if(!book){
            return res.status(404).json({message:"Book not found"})
        }

        res.status(202).json({message:`Book found ${book.title}` , book})
    } catch (error) {
        if(error.name === 'CastError'){
            console.log("Invaild Id" , id);
            return res.status(400).json({message: "Invalid ID format."})
            
        }
        console.error("Error creating book:", error)
        res.status(500).json({message:"Oops! We encountered an unexpected error . Please try again later."})
    }
}

async function Updatebook(req , res) {
    const {id} = req.params
    const {title , author} = req.body

    try {
        if(!title && !author){
            return res.status(400).json({message:"Please provide at least one field (title or author) to update."})
        }

        const Updatefield = {}
        if(title) Updatefield.title = title;
        if(author) Updatefield.author = author;

        const book = await BOOK.findByIdAndUpdate(id , Updatefield , {new:true})

        if(!book){
            return res.status(404).json({message:"Book not found"})
        }

        res.status(202).json({message:`Book Updated ${book.title}` , book})
    } catch (error) {
        console.error("Error creating book:", error)
        res.status(500).json({message:"Oops! We encountered an unexpected error . Please try again later."})
    }
}

async function Deletebook(req , res) {
    const {id} = req.params

    try {
        const book = await BOOK.findById({_id:id})

        if(!book){
            return res.status(404).json({message: "Book not found. It may have already been removed or the ID is incorrect."})
        }

        const {title , author} = book
        await BOOK.findByIdAndDelete(id)

        res.status(202).json({message:`"${title}" by ${author} has been successfully removed from the library.`, book})
    } catch (error) {
        console.error("Error creating book:", error)
        res.status(500).json({message:"Oops! We encountered an unexpected error . Please try again later."})
    }
}


module.exports = {
    Createbook,
    Getallbook,
    GetbookbyId,
    Updatebook,
    Deletebook
}