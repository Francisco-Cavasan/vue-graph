import { Nodes, Edges, Layouts, defineConfigs } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "Lajeado" },
  node2: { name: "Guaporé" },
  node3: { name: "Estrela" },
  node4: { name: "Porto Alegre" },
  node5: { name: "São Paulo" },
  node6: { name: "Salvador" },
  node7: { name: "Acre" },
  node8: { name: "Passo Fundo" },
  node9: { name: "Alegrete" },
  node10: { name: "Itapema" },
  node11: { name: "Rio de Janeiro" },
  node12: { name: "Curitiba" },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", cost: 50 },
  edge2: { source: "node1", target: "node3", cost: 10 },
  edge3: { source: "node2", target: "node4", cost: 130 },
  edge4: { source: "node2", target: "node5", cost: 700 },
  edge5: { source: "node3", target: "node5", cost: 699 },
  edge6: { source: "node3", target: "node6", cost: 1090 },
  edge7: { source: "node4", target: "node7", cost: 3500 },
  edge8: { source: "node5", target: "node8", cost: 680 },
  edge9: { source: "node6", target: "node9", cost: 1470 },
  edge10: { source: "node7", target: "node10", cost: 3000 },
  edge11: { source: "node8", target: "node10", cost: 950 },
  edge12: { source: "node8", target: "node11", cost: 397 },
  edge13: { source: "node9", target: "node11", cost: 623 },
  edge14: { source: "node10", target: "node12", cost: 174 },
  edge15: { source: "node11", target: "node12", cost: 3 },
}

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
}

const configs = defineConfigs({
  node: {
	selectable: true,
    label: {
      visible: n => !!n.name,
    },
  },
  path: {
    visible: true,
    curveInNode: true,
    path: {
      width: 14,
      color: "#ff000088",
    },
  },
})

export default {
  nodes,
  edges,
  layouts,
  configs,
}