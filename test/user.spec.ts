import { it, expect, beforeAll, afterAll, describe, beforeEach} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('User routes', () => {
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

  it('should be able to create a user', async() => {
    await request(app.server)
      .post('/user/create')
      .send({
        email: 'teste',
        senha: 'teste'
      })
      .expect(201)
  })

  it('should be able for the user to log in', async() => {
    await request(app.server)
    .post('/user/create')
    .send({
      email: 'teste1',
      senha: 'teste1'
    })

    await request(app.server)
      .post('/user/login')
      .send({
        email: 'teste1',
        senha: 'teste1'
      })
      .expect(200)
  })
})