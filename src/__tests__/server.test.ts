import { connectDB } from '../server'
import db from '../config/db'

// TEST para simular un error al conectar a la BBDD
jest.mock('../config/db')
describe(
    'ConnectDB',
    () => {
        test(
            'Debe manejar el error de conexión a la BBDD',
            async () => {
                jest.spyOn(db, 'authenticate')
                    .mockRejectedValueOnce('Hubo un error al conectar a la BD')

                const consoleSpy = jest.spyOn(console, 'log')

                await connectDB()

                expect(consoleSpy).toHaveBeenCalledWith(
                    expect.stringContaining('Hubo un error al conectar a la BD')
                )
            }
        )
    }
)