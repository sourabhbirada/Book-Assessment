const express = require('express');
const BOOK = require('../models/book');
const { Createbook, Getallbook, GetbookbyId, Updatebook, Deletebook } = require('../controller/book');
const { SearchFeature } = require('../controller/SearchFeature');

const router = express.Router();


router.route('/').post(Createbook).get(Getallbook)
router.get('/search' , SearchFeature)
router.route('/:id').get(GetbookbyId).put(Updatebook).delete(Deletebook)



module.exports = router