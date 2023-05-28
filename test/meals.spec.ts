import { it, expect, beforeAll, afterAll, describe, beforeEach} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { afterEach } from 'node:test'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async() => {
    await app.close()
  })

  beforeEach(async() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })


  it('should be able to create a meal', async() => {
    await request(app.server)
    .post('/user/create')
    .send({
      email: 'teste2',
      senha: 'teste2'
    })

    const createLoginResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: 'teste2',
        senha: 'teste2'
      })

    const cookies = createLoginResponse.get('Set-Cookie')
    
    await request(app.server)
      .post('/meals/createMeal')
      .set('Cookie', cookies)
      .send({
        name: "Refeição 1",
        description: "Bolo",
        is_diet: true
      })
      .expect(201)
  })

  it('should be able to list all meals', async() => {
    await request(app.server)
    .post('/user/create')
    .send({
      email: 'teste',
      senha: 'teste'
    })

    const createLoginResponse = await request(app.server)
      .post('/user/login')
      .send({
        email: 'teste',
        senha: 'teste'
      })

    const cookies = createLoginResponse.get('Set-Cookie')
    
    await request(app.server)
      .post('/meals/createMeal')
      .set('Cookie', cookies)
      .send({
        name: "Refeição 1",
        description: "Bolo",
        is_diet: true
      })
    
    const listMealsResponse = await request(app.server)
      .get('/meals/listAll')
      .set('Cookie', cookies)
      .expect(200)
    
    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "Refeição 1",
        description: "Bolo",
      })
    ])
  })

  it('should be able to list one meal', async() => {
    await request(app.server)
    .post('/user/create')
    .send({
      email: 'teste',
      senha: 'teste'
    })

    const createLoginResponse = await request(app.server)
    .post('/user/login')
    .send({
      email: 'teste',
      senha: 'teste'
    })

    const cookies = createLoginResponse.get('Set-Cookie')

    await request(app.server)
    .post('/meals/createMeal')
    .set('Cookie', cookies)
    .send({
      name: "Refeição 1",
      description: "Bolo",
      is_diet: true
    })

    const listMealsResponse = await request(app.server)
    .get('/meals/listAll')
    .set('Cookie', cookies)
    .expect(200)

    const mealId = listMealsResponse.body.meals[0].id


    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: "Refeição 1",
        description: "Bolo"
      })
    )
  })
})