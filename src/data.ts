import { Nodes, Edges, Layouts, defineConfigs } from 'v-network-graph';

const nodes: Nodes = {
	node1: { name: "Source" },
	node2: { name: "N2" },
	node3: { name: "N3" },
	node4: { name: "N4" },
	node5: { name: "N5" },
	node6: { name: "N6" },
	node7: { name: "N7" },
	node8: { name: "N8" },
	node9: { name: "N9" },
	node10: { name: "N10" },
	node11: { name: "N11" },
	node12: { name: "N12" },
};

const edges: Edges = {
	edge1: { source: "node1", target: "node2", cost: 10 },
	edge2: { source: "node1", target: "node3", cost: 5 },
	edge3: { source: "node2", target: "node4", cost: 9 },
	edge4: { source: "node2", target: "node5", cost: 8 },
	edge5: { source: "node3", target: "node5", cost: 5 },
	edge6: { source: "node3", target: "node6", cost: 10 },
	edge7: { source: "node4", target: "node7", cost: 3 },
	edge8: { source: "node5", target: "node8", cost: 5 },
	edge9: { source: "node6", target: "node9", cost: 10 },
	edge10: { source: "node7", target: "node10", cost: 11 },
	edge11: { source: "node8", target: "node10", cost: 13 },
	edge12: { source: "node8", target: "node11", cost: 2 },
	edge13: { source: "node9", target: "node11", cost: 7 },
	edge14: { source: "node10", target: "node12", cost: 5 },
	edge15: { source: "node11", target: "node12", cost: 4 },
};

const layouts: Layouts = {
	nodes: {
		node1: { x: 0, y: 100 },
		node2: { x: 75, y: 50 },
		node3: { x: 75, y: 150 },
		node4: { x: 150, y: 0 },
		node5: { x: 150, y: 100 },
		node6: { x: 150, y: 200 },
		node7: { x: 250, y: 0 },
		node8: { x: 250, y: 100 },
		node9: { x: 250, y: 200 },
		node10: { x: 325, y: 50 },
		node11: { x: 325, y: 150 },
		node12: { x: 400, y: 100 },
	},
};

const configs = defineConfigs({
	node: {
		selectable: 2, // up to 2 nodes
	},
	edge: {
		selectable: true,
		normal: {
			width: 3,
		},
	},
});

export default {
	nodes,
	edges,
	layouts,
	configs,
};
