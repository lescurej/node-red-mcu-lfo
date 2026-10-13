module.exports = function (RED) {
	function LFONode(config) {
		RED.nodes.createNode(this, config);
	}
	RED.nodes.registerType("mcu_lfo", LFONode);
};
