import { FastifyInstance } from 'fastify'
import { knex } from '../database' 
import  crypto  from 'node:crypto' 
import { checkUserIdExists } from '../middleware/check-user-id-exists'
import { z } from 'zod'

export interface MealProps {
  id: string
  name: string
  description: string
  is_diet: boolean
  created_at: Date
  user_id: string
}

export async function meals(app: FastifyInstance) {
  app.get('/listAll',
  {
    preHandler: [checkUserIdExists]
  },
  async(request) => {
    const { userId } = request.cookies
  
    const meals = await knex('meals')
      .where('user_id', userId)
      .select()
      
    return {
      meals
    }
  })

  app.get('/:id', 
  {
    preHandler: [checkUserIdExists]
  },async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)
    const { userId } = request.cookies

    const meal = await knex('meals')
      .where({
        user_id: userId,
        id
      })
      .first()

    if(!meal){
      reply.status(404).send({
        error: 'Unregistered meal'
      })
    }

    return {
      meal
    }
  })

  app.post('/createMeal',
  {
    preHandler: [checkUserIdExists]
  }, async (request, reply) => {

    const { userId } = request.cookies

    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean()
    })

    const { name, description, is_diet } = createMealSchema.parse(request.body)
    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      created_at: new Date().toISOString(),
      is_diet,
      user_id: userId
    })

    return reply.status(201).send()
  })

  app.put('/:id', 
  {
    preHandler: [checkUserIdExists]
  }
  , async(request, reply)=>{
    const { userId } = request.cookies
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean()
    })
    
    const { id } = getMealParamsSchema.parse(request.params)
    const {  name, description, is_diet } = createMealSchema.parse(request.body)

    const updatedMeal = await knex('meals')
      .where({
        user_id: userId,
        id
      }).update({
        name,
        description,
        is_diet,
        created_at: new Date().toISOString()
      })

    if(!updatedMeal){
      reply.status(404).send({
        error: 'Meal not found'
      })
    }
  })

  app.delete('/:id', 
  {
    preHandler: [checkUserIdExists]
  },
  async(request, reply)=>{
    const { userId } = request.cookies

    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const deletedMeal = await knex('meals')
      .where({
        user_id: userId,
        id
      })
      .delete()

    if(!deletedMeal){
      return reply.status(404).send({
        error: 'The meal does not exist'
      })
    }

    return reply.status(204).send()
  })
}
