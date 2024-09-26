import express, {response} from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const app = express()

app.use(cors())
app.use(express.json())

const carList = [
    {
        id: uuidv4(),
        modelo: 'uno',
        marca: 'fiat',
        ano: 2010,
        cor: 'branco',
        preco: 20000
    }
]

// 1. Endpoint para listar todos os carros
app.get('/cars', (request, response) => {
    if (carList.length === 0) {
        return response.status(404).json({
            message: 'nenhum carro encontado'
        })
    }
    
    const formattedList = carList.map(car => {
        return `ID: ${car.id} | Modelo: ${car.modelo} | Marca: ${car.marca} | Ano: ${car.ano} | Cor: ${car.cor} | Preço: R$${car.preco}`
    })
    
    return response.status(200).send(formattedList.join('\n'))
})


// 2. Endpoint para criar um carro
app.post('/cars', (request, response) => {
    const {modelo, marca, ano, cor, preco} = request.body

        if (!modelo || !marca || !ano || !cor || !preco) {
            return response.status(400).json({
                message: "obrigatório modelo, marca, ano, cor, preço"
            })
        }

        const newCar = {
            id: uuidv4(),
            modelo,
            marca,
            ano,
            cor,
            preco
        }

        carList.push(newCar)

        return response.status(201).json({
            message: 'carro cadastrado com sucesso!',
            newCar
        })
})


// 3. Endpoint para filtrar carros por marca
app.get('/cars/marca/:marca', (request, response) => {
    const { marca } = request.params

    const filteredCars = carList.filter(car => car.marca.toLocaleLowerCase() === marca.toLocaleLowerCase())

    if (filteredCars.length === 0) {
        return response.status(404).json({
            message: `Nenhum carro encontrado para a marca: ${marca}`
        })
    }

    const formattedCars = filteredCars.map(car => {
        return `ID: ${car.id} | Modelo: ${car.modelo} | Cor: ${car.cor} | Preço: ${car.preco}`
    })

    return response.status(200).send(formattedCars.join('\n'))
})


app.listen(3030, () => {
    console.log('servidor rodando na porta 3030')
})