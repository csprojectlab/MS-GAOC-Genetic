/**
 * Enum definition.
 */
const NODE_TYPE = {
  ADV: "Advanced",
  INT: "Intermediate",
  NRM: "Normal"
};

const LINK = {
  CH_LINK: 'Cluster_to_node_link',
  SINK_LINK: 'ClusterHead_to_sink_link'
};

const POPULATION_SIZE = 30,
  VICINITY = 70,
  VARPHI = 0.3,
  DELTA = 0.3,
  GAMMA = 0.35;

const CWIDTH = 500,
  CHEIGHT = 500,
  SPAWN_BORDER = 70,
  NUMBER_OF_NODES = 100,
  NUMBER_OF_CH = 15,
  NUMBER_OF_SINKS = 1,
  INTERMEDIATE_NODE_FRACTION = 0.1,
  ADVANCED_NODE_FRACTION = 0.2,
  ENERGY_FRACTION_ADVANCED_ALPHA = 2,
  ENERGY_FRACTION_INTERMEDIATE_BETA = 1,
  E_INITIAL_ENERGY = 0.5;
