import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class GRID {
  readonly id: string;
  readonly group?: string;
  readonly level?: string;
  readonly type?: string;
  readonly displayedId?: string;
  readonly globalUniqueId?: string;
  readonly description?: string;
  readonly label?: string;
  readonly status?: string;
  readonly baselineFinish?: string;
  readonly baselineStart?: string;
  readonly finish?: string;
  readonly start?: string;
  readonly templateID?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<GRID>);
  static copyOf(source: GRID, mutator: (draft: MutableModel<GRID>) => MutableModel<GRID> | void): GRID;
}

export declare class TEMPLATE {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly public?: boolean;
  readonly lastUpdateBy?: string;
  readonly lastUpdateDate?: string;
  readonly GRIDS?: (GRID | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<TEMPLATE>);
  static copyOf(source: TEMPLATE, mutator: (draft: MutableModel<TEMPLATE>) => MutableModel<TEMPLATE> | void): TEMPLATE;
}