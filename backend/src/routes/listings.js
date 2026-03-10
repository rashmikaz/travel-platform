const express = require('express');
const router = express.Router();
const {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  toggleLike,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.get('/', getAllListings);
router.get('/:id', getListing);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
