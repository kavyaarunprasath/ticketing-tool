import React, { useState } from "react";

const initialTickets = [
  { id: 101, title: "Login page showing Error 500", category: "Technical", priority: "High", status: "Open", date: "2026-11-01", description: "Users are unable to log in due to backend 500 internal server crash." },
  { id: 102, title: "Invoice download not working", category: "Billing", priority: "Medium", status: "In Progress", date: "2026-11-03", description: "Clicking the PDF download link gives an access denied error." },
  { id: 103, title: "Update profile policy questions", category: "General", priority: "Low", status: "Resolved", date: "2026-11-04", description: "User requested clarification about profile update privacy guidelines." },
];

export default function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical");
  const [priority, setPriority] = useState("Low");
  const [description, setDescription] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTicket = {
      id: Math.floor(100 + Math.random() * 900),
      title: title,
      category: category,
      priority: priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
      description: description.trim() || "No detailed description provided.",
    };

    setTickets([newTicket, ...tickets]);
    setTitle("");
    setDescription("");
  };

  const handleDelete = (id) => {
    setTickets(tickets.filter((t) => t.id !== id));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", maxWidth: "950px", margin: "25px auto", padding: "20px", color: "#333" }}>
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>Support Ticketing Tool</h1>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "25px" }}>
        <div style={{ padding: "18px", background: "#e8f0fe", borderRadius: "10px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>Total Tickets</h4>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: "#1967d2" }}>{tickets.length}</span>
        </div>
        <div style={{ padding: "18px", background: "#fef7e0", borderRadius: "10px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>Open</h4>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: "#b06000" }}>
            {tickets.filter((t) => t.status === "Open").length}
          </span>
        </div>
        <div style={{ padding: "18px", background: "#e6f4ea", borderRadius: "10px", textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>Resolved</h4>
          <span style={{ fontSize: "28px", fontWeight: "bold", color: "#137333" }}>
            {tickets.filter((t) => t.status === "Resolved").length}
          </span>
        </div>
      </div>

      {/* Create Ticket Form */}
      <form onSubmit={handleAddTicket} style={{ background: "#f8f9fa", padding: "20px", borderRadius: "10px", marginBottom: "25px", border: "1px solid #e0e0e0" }}>
        <h3 style={{ marginTop: 0 }}>Create New Ticket</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Ticket Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="General">General</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
        <textarea
          placeholder="Issue Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          style={{ width: "100%", padding: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "12px" }}
        />
        <button
          type="submit"
          style={{ background: "#0d6efd", color: "#fff", padding: "10px 22px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
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
        style={{ width: "100%", padding: "11px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "20px" }}
      />

      {/* Ticket Listing Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#f1f3f4", borderBottom: "2px solid #dadce0" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Title</th>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Priority</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "12px" }}>#{t.id}</td>
                <td style={{ padding: "12px", fontWeight: "500" }}>{t.title}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ background: "#e8eaed", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      background: t.priority === "High" ? "#fce8e6" : t.priority === "Medium" ? "#fef7e0" : "#e6f4ea",
                      color: t.priority === "High" ? "#c5221f" : t.priority === "Medium" ? "#b06000" : "#137333",
                    }}
                  >
                    {t.priority}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setSelectedTicket(t)}
                    style={{ background: "#1a73e8", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{ background: "#d93025", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
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
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "10px", width: "90%", maxWidth: "450px" }}>
            <h2>Ticket Details #{selectedTicket.id}</h2>
            <p><strong>Title:</strong> {selectedTicket.title}</p>
            <p><strong>Category:</strong> {selectedTicket.category}</p>
            <p><strong>Priority:</strong> {selectedTicket.priority}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Created Date:</strong> {selectedTicket.date}</p>
            <p><strong>Description:</strong></p>
            <p style={{ background: "#f8f9fa", padding: "10px", borderRadius: "6px", border: "1px solid #eee" }}>{selectedTicket.description}</p>
            <button
              onClick={() => setSelectedTicket(null)}
              style={{ marginTop: "15px", background: "#5f6368", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}