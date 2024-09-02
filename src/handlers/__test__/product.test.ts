import request from 'supertest'
import server from '../../server'

// POST /api/products
describe(
    'POST /api/products',
    () => {

        test(
            'Debe mostrar los errores de validación',
            async () => {
                const response = await request(server).post('/api/products').send({})

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')

                expect(response.status).not.toBe(201)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe validar que el precio es > 0',
            async () => {
                const response = await request(server).post('/api/products').send({
                    name: "Monitor - TEST",
                    price: 0
                })

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors).toHaveLength(1)

                expect(response.status).not.toBe(404)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe crear un producto nuevo',
            async () => {
                const response = await request(server).post('/api/products').send({
                    name: "Mouse - TEST",
                    price: 50,
                    availability: false
                })

                expect(response.status).toBe(201)
                expect(response.body).toHaveProperty('data')

                expect(response.status).not.toBe(404)
                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('error')
            }
        )
    }
)

// GET /api/products
describe(
    'GET /api/products',
    () => {
        test(
            'Obtener un JSON con la lista de productos',
            async () => {
                const response = await request(server).get('/api/products')

                expect(response.status).toBe(200)
                expect(response.headers['content-type']).toMatch(/json/)
                expect(response.body).toHaveProperty('data')

                expect(response.status).not.toBe(404)
                expect(response.body).not.toHaveProperty('errors')
            }
        )
    }
)

// GET /api/products/:id
describe(
    'GET /api/products/:id',
    () => {
        test(
            'Devolver una respuesta 404 cuando no existe el producto',
            async () => {
                const productId = 2000
                const response = await request(server).get(`/api/products/${productId}`)

                expect(response.status).toBe(404)
                expect(response.body).toHaveProperty('error')
            }
        )

        test(
            'Checkear que se ha introducido un ID válido',
            async () => {
                const response = await request(server).get('/api/products/not-valid-id')

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe('ID no válido.')
            }
        )

        test(
            'Obtener un producto existente',
            async () => {
                const response = await request(server).get('/api/products/1')

                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('data')

                expect(response.body).not.toHaveProperty('errors')
            }
        )
    }
)

// PUT /api/products/:id
describe(
    'PUT /api/products/:id',
    () => {

        test(
            'Checkear que se ha introducido un ID válido',
            async () => {
                const response = await request(server).put('/api/products/not-valid-id').send({
                    "name": "monitor - TEST",
                    "price": 300,
                    "availability": true
                })

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors).toHaveLength(1)
                expect(response.body.errors[0].msg).toBe('ID no válido.')
            }
        )

        test(
            'Mostrar errores de validación al actualizar un producto',
            async () => {
                const response = await request(server).put('/api/products/1').send({})

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors).toHaveLength(5)

                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe validar que el precio es mayor que 0',
            async () => {
                const response = await request(server).put('/api/products/1').send({
                    "name": "monitor - TEST",
                    "price": -300,
                    "availability": true
                })

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors).toHaveLength(1)

                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe devolver un error 404 cuando el producto no existe',
            async () => {
                const productId = 2000
                const response = await request(server).put(`/api/products/${productId}`).send({
                    "name": "monitor - TEST",
                    "price": 300,
                    "availability": true
                })

                expect(response.status).toBe(404)
                expect(response.body).toHaveProperty('error')
                expect(response.body.error).toBe('El producto no existe.')

                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe actualizar un producto existente si los datos son válidos',
            async () => {
                const response = await request(server).put('/api/products/1').send({
                    "name": "monitor - TEST",
                    "price": 300,
                    "availability": true
                })

                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('data')

                expect(response.status).not.toBe(400)
                expect(response.body).not.toHaveProperty('errors')
            }
        )
    }
)

// PATCH /api/products/:id
describe(
    'PATCH /api/products/:id',
    () => {

        test(
            'Debe devolver un error 404 cuando el producto no existe',
            async () => {
                const productId = 2000
                const response = await request(server).patch(`/api/products/${productId}`)

                expect(response.status).toBe(404)
                expect(response.body).toHaveProperty('error')
                expect(response.body.error).toBe('El producto no existe.')

                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe actualizar un producto existente si los datos son válidos',
            async () => {
                const response = await request(server).patch('/api/products/1')

                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('data')
                expect(response.body.data.availability).toBe(false)

                expect(response.status).not.toBe(404)
                expect(response.status).not.toBe(400)
                expect(response.body).not.toHaveProperty('errors')
            }
        )
    }
)

// DELETE /api/products/:id
describe(
    'DELETE /api/products/:id',
    () => {
        test(
            'Checkear que se ha introducido un ID válido',
            async () => {
                const response = await request(server).delete('/api/products/not-valid-id')

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('errors')
                expect(response.body.errors[0].msg).toBe('ID no válido.')
            }
        )

        test(
            'Debe devolver un error 404 cuando el producto no existe',
            async () => {
                const productId = 2000
                const response = await request(server).delete(`/api/products/${productId}`)

                expect(response.status).toBe(404)
                expect(response.body).toHaveProperty('error')
                expect(response.body.error).toBe('El producto no existe.')

                expect(response.status).not.toBe(200)
                expect(response.body).not.toHaveProperty('data')
            }
        )

        test(
            'Debe eliminar el producto si el ID es válido',
            async () => {
                const response = await request(server).delete('/api/products/1')

                expect(response.status).toBe(200)
                expect(response.body).toHaveProperty('data')
                expect(response.body.data).toBe('Success: Producto eliminado')

                expect(response.status).not.toBe(404)
                expect(response.status).not.toBe(400)
            }
        )
    }
)