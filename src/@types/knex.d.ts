import { Knex } from 'knex'

declare module "knex/types/table"{
  interface Tables {
    meals: {
      id: string,
      name: string,
      description: string,
      is_diet: boolean,
      created_at: string,
      session_id: string
    }
  }
}