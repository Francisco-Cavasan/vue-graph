<template>
	<div class="container">
		<div class="actions">
			<div>
				<label class="label">Node:</label>
				<button class="button" @click="addNode">Adicionar</button>
				<button class="button" :disabled="selectedNodes.length == 0" @click="removeNode">
					Remover
				</button>
			</div>
			<div>
				<label class="label">Edge:</label>
				<button class="button" :disabled="selectedNodes.length != 2" @click="addEdge">
					Adicionar
				</button>
				<button class="button" :disabled="selectedEdges.length == 0" @click="removeEdge">
					Remover
				</button>
			</div>
		</div>

		<v-network-graph
			:nodes="data.nodes"
			:edges="data.edges"
			:paths="paths"
			:layouts="data.layouts"
			:configs="data.configs"
			:event-handlers="eventHandlers"
		>
			<template #edge-label="{ edge, ...slotProps }">
				<v-edge-label
					:text="`${edge.cost}`"
					align="center"
					vertical-align="below"
					v-bind="slotProps"
				/>
			</template>
		</v-network-graph>
	</div>
</template>

<script setup lang="ts">
	import { ref, watchEffect, reactive } from 'vue';
	import * as vNG from 'v-network-graph';
	import initialData from './data';

	const data = initialData;

	const nodes = reactive({ ...data.nodes });
	const edges = reactive({ ...data.edges });
	let nextNodeIndex = ref(Object.keys(data.nodes).length + 1).value;
	let nextEdgeIndex = ref(Object.keys(data.edges).length + 1).value;
	let selectedNodes = [];
	let selectedEdges = [];

	type GraphMap = { [key: string]: { [key: string]: number } };
	type EdgeMap = { [key: string]: { [key: string]: string } };

	class Graph {
		map: GraphMap;
		edgeMap: EdgeMap;

		sorter = function (a: string, b: string) {
			return parseFloat(a) - parseFloat(b);
		};

		constructor(edges: vNG.Edges) {
			const map: GraphMap = {};
			const edgeMap: EdgeMap = {};
			Object.entries(edges).forEach(([edgeId, edge]) => {
				const source = edge.source;
				const target = edge.target;
				const cost = edge?.cost ?? 1;
				if (!map[source]) map[source] = {};
				if (!map[target]) map[target] = {};
				if (!edgeMap[source]) edgeMap[source] = {};
				if (!edgeMap[target]) edgeMap[target] = {};

				if (map[source][target]) {
					if (map[source][target] > cost) {
						map[source][target] = cost;
						map[target][source] = cost;
						edgeMap[source][target] = edgeId;
						edgeMap[target][source] = edgeId;
					}
				} else {
					map[source][target] = cost;
					map[target][source] = cost;
					edgeMap[source][target] = edgeId;
					edgeMap[target][source] = edgeId;
				}
			});
			this.map = map;
			this.edgeMap = edgeMap;
		}

		findPath(viaNodes: string[]) {
			return this.findShortestPath(this.map, viaNodes);
		}

		convertNodesToEdges(nodes: string[]): string[] {
			const edges: string[] = [];
			if (nodes.length === 0) {
				return [];
			}
			let prev = nodes[0];
			for (let i = 1; i < nodes.length; i++) {
				const next = nodes[i];
				edges.push(this.edgeMap[prev][next]);
				prev = next;
			}
			return edges;
		}

		extractKeys(obj: object) {
			const keys = [];
			let key;
			for (key in obj) {
				Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
			}
			return keys;
		}

		findPaths(map: GraphMap, start: string, end: string) {
			const costs: { [key: string]: number } = {};
			const open: { [key: string]: string[] } = { 0: [start] };
			const predecessors: { [key: string]: string } = {};
			let keys;

			const addToOpen = function (cost: number, vertex: string) {
				const key = '' + cost;
				if (!open[key]) {
					open[key] = [];
				}
				open[key].push(vertex);
			};

			costs[start] = 0;

			// eslint-disable-next-line no-unmodified-loop-condition
			while (open) {
				if (!(keys = this.extractKeys(open)).length) {
					break;
				}

				keys.sort(this.sorter);

				const key = keys[0];
				const bucket = open[key];
				const node = bucket.shift() || '';
				const currentCost = parseFloat(key);
				const adjacentNodes = map[node] || {};

				if (!bucket.length) {
					delete open[key];
				}

				for (const vertex in adjacentNodes) {
					if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
						const cost = adjacentNodes[vertex];
						const totalCost = cost + currentCost;
						const vertexCost = costs[vertex];

						if (vertexCost === undefined || vertexCost > totalCost) {
							costs[vertex] = totalCost;
							addToOpen(totalCost, vertex);
							predecessors[vertex] = node;
						}
					}
				}
			}

			if (costs[end] === undefined) {
				return null;
			} else {
				return predecessors;
			}
		}

		extractShortest(predecessors: { [key: string]: string }, end: string) {
			const nodes = [];
			let u = end;

			while (u !== undefined) {
				nodes.push(u);
				u = predecessors[u];
			}

			nodes.reverse();
			return nodes;
		}

		findShortestPath(map: GraphMap, nodes: string[]) {
			nodes = [...nodes]; // copy
			let start = nodes.shift() || '';
			let end: string;
			let predecessors;
			const path: string[] = [];
			let shortest;

			while (nodes.length) {
				end = nodes.shift() || '';
				predecessors = this.findPaths(map, start, end);

				if (predecessors) {
					shortest = this.extractShortest(predecessors, end);
					if (nodes.length) {
						path.push.apply(path, shortest.slice(0, -1));
					} else {
						return path.concat(shortest);
					}
				} else {
					return null;
				}

				start = end;
			}
		}
	}

	const paths = ref<vNG.Paths>({});

	const targetNode = ref('node12');
	watchEffect(() => {
		const graph = new Graph(data.edges);
		const routeOfNodes = graph.findPath(['node1', targetNode.value]);
		if (routeOfNodes) {
			const routeOfEdges = graph.convertNodesToEdges(routeOfNodes);
			paths.value = { shortestPath: { edges: routeOfEdges } };
		}
	});

	const eventHandlers: vNG.EventHandlers = {
		'node:pointerover': ({ node }) => {
			if (node === 'node1') return;
			targetNode.value = node;
		},
	};

	const addNode = (event) => {
		const nodeId = `node${nextNodeIndex}`;
		const name = `N${nextNodeIndex}`;
		nodes[nodeId] = { name };
		nextNodeIndex++;
	};
	const removeNode = () => {
		for (const nodeId of selectedNodes) {
			delete nodes[nodeId];
		}
	};
	const addEdge = () => {
		if (selectedNodes.length !== 2) return;
		const [source, target] = selectedNodes;
		const edgeId = `edge${nextEdgeIndex}`;
		edges[edgeId] = { source, target };
		nextEdgeIndex++;
	};
	const removeEdge = () => {
		for (const edgeId of selectedEdges) {
			delete edges[edgeId];
		}
	};
</script>

<style>
	#app {
		width: 100%;
		min-height: 100vh;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.v-network-graph {
		width: 800px;
		height: 600px;
		border: 1px solid #000;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 800px;
		gap: 20px;
		margin: 30px 0;
	}
</style>
