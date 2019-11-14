/**
 * Enum definition.
 */
const NODE_TYPE = {
  ADV: "Advanced",
  INT: "Intermediate",
  NRM: "Normal"
};

const LINK = {
  CH_LINK: "Cluster_to_node_link",
  SINK_LINK: "ClusterHead_to_sink_link"
};

const POPULATION_SIZE = 30,
  GENERATIONS = 300,
  VICINITY = 80,
  VARPHI = 0.3,
  DELTA = 0.3,
  GAMMA = 0.35,
  CROSSOVER_RATE = 0.6,
  MUTATION_RATE = 0.006;

const OWIDTH = 1100,
  OHEIGHT = 400,
  CWIDTH = OWIDTH / 2,
  CHEIGHT = OHEIGHT,
  SPAWN_BORDER = 70,
  NUMBER_OF_NODES = 100,
  NUMBER_OF_CH = 4,
  NUMBER_OF_SINKS = 4,
  /**
   * Fractions
   */
  INTERMEDIATE_NODE_FRACTION = 0.1,
  ADVANCED_NODE_FRACTION = 0.2,
  ENERGY_FRACTION_ADVANCED_ALPHA = 2,
  ENERGY_FRACTION_INTERMEDIATE_BETA = 1,
  /**
   * Energy
   */
  E_INITIAL_ENERGY = 0.5,
  E_ELC = 50 * 0.000000001, // Energy required for running transmitter and receiver
  E_EFS = 10 * 0.000000000001, // Amplification energy required for smaller distance
  E_AMP = 0.0013 * 0.000000000001; // Amplification energy required for larger distance
D_O = Math.sqrt(E_EFS / E_AMP);
PACKET_SIZE = 2000;

const COLOR_CODES = [
  [9, 13, 237],
  [237, 9, 192],
  [237, 9, 51],
  [237, 82, 9],
  [237, 165, 9],
  [188, 237, 9],
  [89, 237, 9],
  [9, 237, 135],
  [22, 224, 208],
  [44, 65, 99],
  [77, 72, 105],
  [195, 0, 255]
];
