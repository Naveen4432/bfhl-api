# 🚀 BFHL API – Full Stack Engineering Challenge

This project is developed as part of the **SRM Full Stack Engineering Challenge (Bajaj Finserv Health Limited)**.

---

## 🔗 Live API

👉 https://bfhl-api-agz8.onrender.com/bfhl

---

## 📌 Endpoint

### POST /bfhl

#### Request Body
```json
{
  "data": ["A->B", "B->C"]
}

{
  "user_id": "naveenmusiboina_02112004",
  "email_id": "nm0712@srmist.edu.in",
  "college_roll_number": "RA2311003012364",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "C": {}
          }
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
⚙️ Features
✅ Validates node format (X->Y)
❌ Rejects invalid inputs (e.g., hello, 1->2, A->)
🔁 Handles duplicate edges
🌳 Builds hierarchical tree structures
🔄 Detects cycles
📏 Calculates depth of trees
🌲 Supports multiple independent trees
📊 Provides summary:
Total trees
Total cycles
Largest tree root
