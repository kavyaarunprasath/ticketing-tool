const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tickets = [
  { id: 101, title: "Login page showing Error 500", priority: "High", status: "Open", date: "2026-11-01" },
  { id: 102, title: "Profile picture upload fails", priority: "Medium", status: "In Progress", date: "2026-11-03" },
  { id: 103, title: "Typo in footer copyright notice", priority: "Low", status: "Resolved", date: "2026-11-04" },
];

// Get all tickets
app.get("/api/tickets", (req, res) => {
  res.json(tickets);
});

// Add new ticket
app.post("/api/tickets", (req, res) => {
  const newTicket = { id: Date.now(), ...req.body };
  tickets.unshift(newTicket);
  res.status(201).json(newTicket);
});

// Delete ticket
app.delete("/api/tickets/:id", (req, res) => {
  const ticketId = parseInt(req.params.id);
  tickets = tickets.filter((t) => t.id !== ticketId);
  res.json({ message: "Ticket deleted successfully" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));