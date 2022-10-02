<template>
	<div>
		<div>
			<label class="label">Node:</label>
			<button class="button" @click="addNode">Adicionar</button>
			<button class="button" :disabled="selectedNodes.length == 0" @click="removeNode">Remover</button>
		</div>
		<div>
			<label class="label">Edge:</label>
			<button class="button" :disabled="selectedNodes.length != 2" @click="addEdge">Adicionar</button>
			<button class="button" :disabled="selectedEdges.length == 0" @click="removeEdge">Remover</button>
		</div>
	</div>

	<v-network-graph
		v-model:selected-nodes="selectedNodes"
		v-model:selected-edges="selectedEdges"
		:nodes="nodes"
		:edges="edges"
		:layouts="data.layouts"
		:configs="data.configs"
	/>
</template>

<script>
	import data from './data';
	import { reactive, ref } from 'vue';

	export default {
		data() {
			return {
				nodes: reactive({ ...data.nodes }),
				edges: reactive({ ...data.edges }),
				nextNodeIndex: ref(Object.keys(data.nodes).length + 1),
				nextEdgeIndex: ref(Object.keys(data.edges).length + 1),
				data: data,
				selectedNodes: [],
				selectedEdges: [],
			};
		},
		methods: {
			addNode(event) {
				const nodeId = `node${this.nextNodeIndex}`;
				const name = `N${this.nextNodeIndex}`;
				this.nodes[nodeId] = { name };
				this.nextNodeIndex++;
			},
			removeNode() {
				for (const nodeId of this.selectedNodes) {
					delete this.nodes[nodeId];
				}
			},
			addEdge() {
				if (this.selectedNodes.length !== 2) return;
				const [source, target] = this.selectedNodes;
				const edgeId = `edge${this.nextEdgeIndex}`;
				this.edges[edgeId] = { source, target };
				this.nextEdgeIndex++;
			},
			removeEdge() {
				for (const edgeId of this.selectedEdges) {
					delete this.edges[edgeId];
				}
			},
		},
	};
</script>

<style>
	#app {
		width: 100%;
		min-height: 100vh;
	}

	.v-network-graph {
		width: 800px;
		height: 600px;
		border: 1px solid #000;
	}
</style>
