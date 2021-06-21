// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { GRID, TEMPLATE } = initSchema(schema);

export {
  GRID,
  TEMPLATE
};