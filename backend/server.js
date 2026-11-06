const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory Ticket Database
let tickets = [
  {
    id: 101,
    title: "Unable to login",
    description: "Login issue with 500 server crash on submit",
    priority: "HIGH",
    status: "OPEN",
    category: "TECHNICAL",
    createdAt: "2026-11-01"
  },
  {
    id: 102,
    title: "Invoice download not working",
    description: "PDF invoice link returns 403 forbidden",
    priority: "MEDIUM",
    status: "OPEN",
    category: "BILLING",
    createdAt: "2026-11-03"
  },
  {
    id: 103,
    title: "Profile update inquiry",
    description: "Need help changing registered email address",
    priority: "LOW",
    status: "RESOLVED",
    category: "GENERAL",
    createdAt: "2026-11-04"
  }
];

// 1. GET /api/tickets - Get all tickets
app.get("/api/tickets", (req, res) => {
  res.status(200).json(tickets);
});

// 2. GET /api/tickets/:id - Get single ticket by ID
app.get("/api/tickets/:id", (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  res.status(200).json(ticket);
});

// 3. POST /api/tickets - Create a new ticket (with Validation)
app.post("/api/tickets", (req, res) => {
  const { title, description, priority, status, category } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required fields" });
  }

  const newTicket = {
    id: Math.floor(100 + Math.random() * 900),
    title: title.trim(),
    description: description.trim(),
    priority: (priority || "MEDIUM").toUpperCase(),
    status: (status || "OPEN").toUpperCase(),
    category: (category || "GENERAL").toUpperCase(),
    createdAt: new Date().toISOString().split("T")[0]
  };

  tickets.unshift(newTicket);
  res.status(201).json(newTicket);
});

// 4. PUT /api/tickets/:id - Update an existing ticket
app.put("/api/tickets/:id", (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const { title, description, priority, status, category } = req.body;

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...(title && { title: title.trim() }),
    ...(description && { description: description.trim() }),
    ...(priority && { priority: priority.toUpperCase() }),
    ...(status && { status: status.toUpperCase() }),
    ...(category && { category: category.toUpperCase() })
  };

  res.status(200).json(tickets[ticketIndex]);
});

// 5. DELETE /api/tickets/:id - Delete ticket
app.delete("/api/tickets/:id", (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  tickets = tickets.filter((t) => t.id !== ticketId);
  res.status(200).json({ message: "Ticket deleted successfully", id: ticketId });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Support Ticketing REST API running on http://localhost:${PORT}`);
});