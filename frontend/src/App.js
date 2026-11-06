import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/tickets";

const INITIAL_TICKETS = [
  {
    id: 101,
    title: "Unable to login to dashboard",
    description: "Login issue with 500 server crash on submit",
    category: "TECHNICAL",
    priority: "HIGH",
    status: "OPEN",
    createdAt: "2026-11-06",
  },
  {
    id: 102,
    title: "Invoice download link returning 403",
    description: "PDF invoice link returns 403 forbidden error",
    category: "BILLING",
    priority: "MEDIUM",
    status: "OPEN",
    createdAt: "2026-11-06",
  },
  {
    id: 103,
    title: "Profile update inquiry",
    description: "Need help changing registered email address",
    category: "GENERAL",
    priority: "LOW",
    status: "RESOLVED",
    createdAt: "2026-11-05",
  },
];

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");

  // 1. Fetch tickets (Connects to backend API if available, else uses initial data)
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      // Graceful fallback for production live preview
      console.log("Local API not running, using live data state");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 2. Create Ticket
  const handleAddTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTicket = {
      id: Date.now(),
      title,
      description,
      priority,
      status: "OPEN",
      category,
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
    } catch (err) {
      console.log("Using live local state update");
    }

    setTickets([newTicket, ...tickets]);
    setTitle("");
    setDescription("");
  };

  // 3. Update Status / Priority
  const handleUpdate = async (id, updatedFields) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.log("Using live local state update");
    }

    const updated = tickets.map((t) =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    setTickets(updated);

    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, ...updatedFields });
    }
  };

  // 4. Delete Ticket
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Using live local state delete");
    }

    setTickets(tickets.filter((t) => t.id !== id));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(null);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        maxWidth: "950px",
        margin: "25px auto",
        padding: "20px",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Support Ticketing Tool
      </h1>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            padding: "18px",
            background: "#e8f0fe",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>Total Tickets</h4>
          <span
            style={{ fontSize: "28px", fontWeight: "bold", color: "#1967d2" }}
          >
            {tickets.length}
          </span>
        </div>
        <div
          style={{
            padding: "18px",
            background: "#fef7e0",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>Open</h4>
          <span
            style={{ fontSize: "28px", fontWeight: "bold", color: "#b06000" }}
          >
            {tickets.filter((t) => t.status === "OPEN").length}
          </span>
        </div>
        <div
          style={{
            padding: "18px",
            background: "#e6f4ea",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>Resolved</h4>
          <span
            style={{ fontSize: "28px", fontWeight: "bold", color: "#137333" }}
          >
            {tickets.filter((t) => t.status === "RESOLVED").length}
          </span>
        </div>
      </div>

      {/* Create Ticket Form */}
      <form
        onSubmit={handleAddTicket}
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px",
          border: "1px solid #e0e0e0",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Create New Ticket</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <input
            type="text"
            placeholder="Ticket Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing</option>
            <option value="GENERAL">General</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
        </div>
        <textarea
          placeholder="Issue Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "12px",
          }}
          required
        />
        <button
          type="submit"
          style={{
            background: "#0d6efd",
            color: "#fff",
            padding: "10px 22px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Add Ticket
        </button>
      </form>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tickets by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "11px",
          boxSizing: "border-box",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "650px",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f3f4",
                borderBottom: "2px solid #dadce0",
              }}
            >
              <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Title</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Priority</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "12px" }}>#{t.id}</td>
                <td style={{ padding: "12px", fontWeight: "500" }}>
                  {t.title}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      background: "#e8eaed",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={t.priority}
                    onChange={(e) =>
                      handleUpdate(t.id, { priority: e.target.value })
                    }
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                    }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={t.status}
                    onChange={(e) =>
                      handleUpdate(t.id, { status: e.target.value })
                    }
                    style={{
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setSelectedTicket(t)}
                    style={{
                      background: "#1a73e8",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      background: "#d93025",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "450px",
            }}
          >
            <h2>Ticket Details #{selectedTicket.id}</h2>
            <p>
              <strong>Title:</strong> {selectedTicket.title}
            </p>
            <p>
              <strong>Category:</strong> {selectedTicket.category}
            </p>
            <p>
              <strong>Priority:</strong> {selectedTicket.priority}
            </p>
            <p>
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Date:</strong> {selectedTicket.createdAt || "2026-11-06"}
            </p>
            <p>
              <strong>Description:</strong>
            </p>
            <p
              style={{
                background: "#f8f9fa",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #eee",
              }}
            >
              {selectedTicket.description}
            </p>
            <button
              onClick={() => setSelectedTicket(null)}
              style={{
                marginTop: "15px",
                background: "#5f6368",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}