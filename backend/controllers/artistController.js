import User from "../models/User.js";
import Application from "../models/Application.js"; // add this line

// Get all artists
export const getArtists = async (req, res) => {
  try {
    let artists;

    // Check if user is logged in and their role
    if (req.user && req.user.role === "admin") {
      // Admin sees all artists
      artists = await User.find({ role: "artist" }).select("-password");
    } else {
      // Others see only approved artists
      artists = await User.find({ role: "artist", status: "approved" }).select("-password");
    }

    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update artist status (approved/rejected)
export const updateArtistStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.body; // expected: "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const artist = await User.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    artist.status = status;
    await artist.save();

    // ✅ Update all applications for this user
    await Application.updateMany(
      { user: artist._id },
      { $set: { status } }
    );

    res.json({ message: `Artist ${status} successfully`, artist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
