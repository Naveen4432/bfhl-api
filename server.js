const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
    const data = req.body.data;

    let validEdges = [];
    let invalid_entries = [];
    let duplicate_edges = [];

    const seen = new Set();

    // ✅ Validate
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
        let [p, c] = edge.split("->");

        if (!graph[p]) graph[p] = [];
        graph[p].push(c);

        childrenSet.add(c);
    });

    // ✅ Find roots
    let roots = Object.keys(graph).filter(node => !childrenSet.has(node));

    if (roots.length === 0 && validEdges.length > 0) {
        roots.push([...new Set(validEdges.join('').split(''))].sort()[0]);
    }

    let hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;

    function buildTree(node, visited = new Set()) {
        if (visited.has(node)) {
            return { cycle: true };
        }

        visited.add(node);

        let tree = {};
        let maxDepth = 1;

        if (graph[node]) {
            tree[node] = {};
            for (let child of graph[node]) {
                let res = buildTree(child, new Set(visited));

                if (res.cycle) return { cycle: true };

                tree[node][child] = res.tree[child];
                maxDepth = Math.max(maxDepth, 1 + res.depth);
            }
        } else {
            tree[node] = {};
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
                (result.depth === maxDepthGlobal && root < largest_tree_root)
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

app.listen(3000, () => console.log("Server running on port 3000"));