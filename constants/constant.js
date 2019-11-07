/**
 * Enum definition. 
 */
const NODE_TYPE = {
    ADV: 'Advanced',
    INT: 'Intermediate',
    NRM: 'Normal'
}

const POPULATION_SIZE = 30;

const CWIDTH = 600,
      CHEIGHT = 600,
      SPAWN_BORDER = 70,
      NUMBER_OF_NODES = 50,
      NUMBER_OF_SINKS = 1,
      INTERMEDIATE_NODE_FRACTION = 0.1,
      ADVANCED_NODE_FRACTION = 0.2,
      ENERGY_FRACTION_ADVANCED_ALPHA = 2,
      ENERGY_FRACTION_INTERMEDIATE_BETA = 1,
      E_INITIAL_ENERGY = 0.5