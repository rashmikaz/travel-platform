const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllListings = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { location: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          user: { select: { id: true, name: true } },
          likes: true,
        },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ listings, total, pages: Math.ceil(total / parseInt(limit)), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true } },
        likes: true,
      },
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createListing = async (req, res) => {
  const { title, location, imageUrl, description, price } = req.body;
  if (!title || !location || !imageUrl || !description)
    return res.status(400).json({ message: 'Title, location, image, and description are required' });
  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        location,
        imageUrl,
        description,
        price: price ? parseFloat(price) : null,
        userId: req.user.id,
      },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { title, location, imageUrl, description, price } = req.body;
    const updated = await prisma.listing.update({
      where: { id: parseInt(req.params.id) },
      data: { title, location, imageUrl, description, price: price ? parseFloat(price) : null },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await prisma.like.deleteMany({ where: { listingId: listing.id } });
    await prisma.listing.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const userId = req.user.id;
    const existing = await prisma.like.findUnique({ where: { userId_listingId: { userId, listingId } } });
    if (existing) {
      await prisma.like.delete({ where: { userId_listingId: { userId, listingId } } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId, listingId } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllListings, getListing, createListing, updateListing, deleteListing, toggleLike };
