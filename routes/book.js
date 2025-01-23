const express = require('express');
const BOOK = require('../models/book');
const { Createbook, Getallbook, GetbookbyId, Updatebook, Deletebook } = require('../controller/book');
const {  SearchFeature } = require('../controller/SearchFeature');

const router = express.Router();

router.route('/').post(Createbook).get(Getallbook)
router.route('/:id').get(GetbookbyId).put(Updatebook).delete(Deletebook)
router.get('/search' , SearchFeature)


module.exports = router