const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
    const data = req.body.data;

    // ✅ Input validation
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid input format" });
    }

    let validEdges = [];
    let invalid_entries = [];
    let duplicate_edges = [];

    const seen = new Set();

    // ✅ Validate edges
    data.forEach(item => {
        let edge = item.trim();

        if (!/^[A-Z]->[A-Z]$/.test(edge) || edge[0] === edge[3]) {
            invalid_entries.push(item);
        } else {
            if (seen.has(edge)) {
                if (!duplicate_edges.includes(edge)) {
                    duplicate_edges.push(edge);
                }
            } else {
                seen.add(edge);
                validEdges.push(edge);
            }
        }
    });

    // ✅ Build graph
    let graph = {};
    let childrenSet = new Set();

    validEdges.forEach(edge => {
        let [parent, child] = edge.split("->");

        if (!graph[parent]) graph[parent] = [];

        // Handle multi-parent (first wins)
        if (!childrenSet.has(child)) {
            graph[parent].push(child);
            childrenSet.add(child);
        }
    });

    // ✅ Find roots
    let roots = Object.keys(graph).filter(node => !childrenSet.has(node));

    // If no root (cycle case)
    if (roots.length === 0 && validEdges.length > 0) {
        const nodes = new Set();
        validEdges.forEach(edge => {
            let [p, c] = edge.split("->");
            nodes.add(p);
            nodes.add(c);
        });
        roots.push([...nodes].sort()[0]);
    }

    let hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;

    // ✅ Build tree + detect cycle
    function buildTree(node, visited = new Set()) {
        if (visited.has(node)) {
            return { cycle: true };
        }

        visited.add(node);

        let tree = {};
        let maxDepth = 1;

        tree[node] = {};

        if (graph[node]) {
            for (let child of graph[node]) {
                let result = buildTree(child, new Set(visited));

                if (result.cycle) {
                    return { cycle: true };
                }

                tree[node][child] = result.tree[child];
                maxDepth = Math.max(maxDepth, 1 + result.depth);
            }
        }

        return { tree, depth: maxDepth };
    }

    let largest_tree_root = "";
    let maxDepthGlobal = 0;

    roots.forEach(root => {
        let result = buildTree(root);

        if (result.cycle) {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            total_trees++;
            hierarchies.push({
                root,
                tree: result.tree,
                depth: result.depth
            });

            if (
                result.depth > maxDepthGlobal ||
                (result.depth === maxDepthGlobal && (largest_tree_root === "" || root < largest_tree_root))
            ) {
                maxDepthGlobal = result.depth;
                largest_tree_root = root;
            }
        }
    });

    res.json({
        user_id: "naveenmusiboina_02112004",
        email_id: "nm0712@srmist.edu.in",
        college_roll_number: "RA2311003012364",
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    });
});

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});