import { FastifyInstance } from "fastify";
import { knex } from '../database'
import { randomUUID } from 'node:crypto' 
import { z } from 'zod'
import { getUserMetrics } from "../utils/getMetrics";


export async function user(app: FastifyInstance){
  app.post('/create', async(request, reply) => {
    const id = randomUUID()
    const createUserSchema = z.object({
      email: z.string(),
      senha: z.string()
    })

    const { email, senha } = createUserSchema.parse(request.body)
    
    
    const userExists = await knex('user').where({ email }).first()
    
    if(userExists){
      return reply.status(404).send({
        error: 'User already exists'
      })
    }
    
    await knex('user').insert({
      id,
      email,
      senha
    })

    return reply.status(201).send() 
  })

  app.post('/login', async(request, reply) => {
    
    const createLoginSchema = z.object({
      email: z.string(),
      senha: z.string()
    })

    const { email, senha } = createLoginSchema.parse(request.body)

    const user = await knex('user')
      .where({
        email,
        senha
      }).first()

    const [{id}] = await knex('user').select('id').where({
      email,
      senha
    })
  
    if(user){
      reply.cookie('userId', id, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }
  })

  app.get('/metrics', async(request) => {
    const { userId } = request.cookies
  
    const meals = await knex('meals')
      .where('user_id', userId)
      .select()

    const metrics = getUserMetrics(meals)

    return {
      metrics
    }
  })
}