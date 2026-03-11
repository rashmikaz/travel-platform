require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllListings = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : {};

    const total = await prisma.listing.count({ where });
    const listings = await prisma.listing.findMany({
      where,
      include: { user: { select: { id: true, name: true } }, likes: true },
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({
      listings,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { id: true, name: true } }, likes: true },
    });
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createListing = async (req, res) => {
  try {
    const { title, location, imageUrl, description, price } = req.body;
    if (!title || !location || !imageUrl || !description)
      return res.status(400).json({ message: "All fields required" });

    const listing = await prisma.listing.create({
      data: {
        title,
        location,
        imageUrl,
        description,
        price: price ? parseFloat(price) : null,
        userId: req.user.id,
      },
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const { title, location, imageUrl, description, price } = req.body;
    const updated = await prisma.listing.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        location,
        imageUrl,
        description,
        price: price ? parseFloat(price) : null,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!listing) return res.status(404).json({ message: "Not found" });
    if (listing.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await prisma.like.deleteMany({
      where: { listingId: parseInt(req.params.id) },
    });
    await prisma.listing.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const userId = req.user.id;
    const existing = await prisma.like.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_listingId: { userId, listingId } },
      });
      res.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId, listingId } });
      res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  toggleLike,
};
