import { Request, Response } from "express"

import Product from "../models/Product.model"


export const getProducts = async (req: Request, res: Response) => {
    
    const products = await Product.findAll({
        order: [
            ['price', 'DESC']
        ],
        limit: 50,
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    res.json({data: products})
}


export const getProductById = async (req: Request, res: Response) => {

    // Obtener el param de la URL
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({error: 'El producto no existe.'})
        return
    }

    res.json({data: product})

}


export const createProduct = async (req: Request, res: Response) => {
    
    const product = await Product.create(req.body)
    res.status(201).json({data: product})
 
}


export const updateProduct = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({error: 'El producto no existe.'})
        return
    }

    // Actualizar el producto
    await product.update(req.body)
    await product.save()

    res.json({data: product})
}


export const updateProductAvailability = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({error: 'El producto no existe.'})
        return
    }

    // Actualizar el valor de "disponibilidad"
    product.availability = !product.dataValues.availability
    await product.save()

    res.json({data: product})

}


export const deleteProduct = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({error: 'El producto no existe.'})
        return
    }

    // Eliminar de BBDD
    await product.destroy()
    res.json({data: "Success: Producto eliminado"})

}