import React, { useState } from "react";

const initialTickets = [
  { id: 101, title: "Login page showing Error 500", priority: "High", status: "Open", date: "2026-11-01" },
  { id: 102, title: "Profile picture upload fails", priority: "Medium", status: "In Progress", date: "2026-11-03" },
  { id: 103, title: "Typo in footer copyright notice", priority: "Low", status: "Resolved", date: "2026-11-04" },
];

export default function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTicket = {
      id: Math.floor(100 + Math.random() * 900),
      title: title,
      priority: priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };

    setTickets([newTicket, ...tickets]);
    setTitle("");
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h1>Support Ticketing Tool</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
        <div style={{ flex: 1, padding: "15px", background: "#f0f4f8", borderRadius: "8px" }}>
          <h3>Total Tickets</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{tickets.length}</p>
        </div>
        <div style={{ flex: 1, padding: "15px", background: "#fff3cd", borderRadius: "8px" }}>
          <h3>Open</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {tickets.filter((t) => t.status === "Open").length}
          </p>
        </div>
        <div style={{ flex: 1, padding: "15px", background: "#d1e7dd", borderRadius: "8px" }}>
          <h3>Resolved</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {tickets.filter((t) => t.status === "Resolved").length}
          </p>
        </div>
      </div>

      {/* Create Ticket Form */}
      <form onSubmit={handleAddTicket} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter ticket title / issue description..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          type="submit"
          style={{ padding: "10px 20px", background: "#0d6efd", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Add Ticket
        </button>
      </form>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tickets by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "10px", boxSizing: "border-box", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
      />

      {/* Ticket List Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Title</th>
            <th style={{ padding: "12px" }}>Priority</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Date</th>
            <th style={{ padding: "12px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #dee2e6" }}>
              <td style={{ padding: "12px" }}>#{t.id}</td>
              <td style={{ padding: "12px" }}>{t.title}</td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    background: t.priority === "High" ? "#f8d7da" : t.priority === "Medium" ? "#fff3cd" : "#e2e3e5",
                  }}
                >
                  {t.priority}
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  style={{ padding: "5px", borderRadius: "4px" }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td style={{ padding: "12px" }}>{t.date}</td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
