const BOOK = require("../models/book");

async function SearchFeature(req , res) {

    try {

        const { title , author} = req.query


        const query = {};
        if(title) {
            query.title = {$regax:title , $options:"i"}
        }
        if(author){
            query.author = {$regax:author, $options:"i"}
        }

        const books = await BOOK.find(query)

        if(books.length === 0){
            return res.status(404).json({ message: 'No books found matching the search criteria.' });
        }

        res.status(200).json({ message: 'Books found', books })
        
    } catch (error) {
        console.error("Error searching for books:", error);
        res.status(500).json({ message: 'An error occurred while searching for books.' });
    }
    
}

module.exports = {
    SearchFeature
}