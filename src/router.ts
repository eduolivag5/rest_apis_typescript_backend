import { Router } from 'express'
import { getProducts, createProduct, getProductById, updateProduct, updateProductAvailability, deleteProduct } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product name
 *                      example: Monitor de 49 pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product availability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags:
 *          - Products
 *      description: Return a list of products
 *      responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 * 
*/
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product detail by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product Not Found
 *          400:
 *              description: Bad Request - Invalid ID
 * 
*/
router.get('/:id', 
    param('id').isInt().withMessage('ID no válido.'),

    handleInputErrors,

    getProductById
)

/**
 * @swagger
 * /api/products/{id}:
 *  post:
 *      summary: Create a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Product created succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:        
 *              description: Bad Request - Invalid product data
 * 
*/
router.post('/', 

    // Validar
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio.'),
    
    body('price')
        .isNumeric().withMessage('El precio no es válido.')
        .notEmpty().withMessage('El precio del producto es obligatorio.')
        .custom((value) => value > 0).withMessage('El precio no es válido.'),
    
    handleInputErrors,
    
    createProduct

)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Product updated succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product Not Found
 *          400:        
 *              description: Bad Request - Invalid product data
 * 
*/
router.put('/:id', 

    param('id').isInt().withMessage('ID no válido.'),

    // Validar
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio.'),
    
    body('price')
        .isNumeric().withMessage('El precio no es válido.')
        .notEmpty().withMessage('El precio del producto es obligatorio.')
        .custom((value) => value > 0).withMessage('El precio no es válido.'),

    body('availability')
        .isBoolean().withMessage('El valor de disponibilidad no es válido.'),
    
    handleInputErrors,

    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update product availability
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Product availability updated succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product Not Found
 *          400:        
 *              description: Bad Request - Invalid ID
 * 
*/
router.patch('/:id', 

    param('id').isInt().withMessage('ID no válido.'),

    handleInputErrors,

    updateProductAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Product availability updated succesfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Success: Producto eliminado'
 *          404:
 *              description: Product Not Found
 *          400:        
 *              description: Bad Request - Invalid ID
 * 
*/
router.delete('/:id', 

    param('id').isInt().withMessage('ID no válido.'),

    handleInputErrors,

    deleteProduct
)

export default router