import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

const app = express();
const port = 3000;

const filename = "database.db";
console.log(filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Clase que representa un libro.
 * @class
 * @extends {Model}
 */
class Book extends Model { }
Book.init({
    /**
     * El autor del libro.
     * @type {string}
     */
    autor: DataTypes.STRING,
    /**
     * El ISBN del libro.
     * @type {number}
     */
    isbn: DataTypes.INTEGER,
    /**
     * La editorial del libro.
     * @type {string}
     */
    editorial: DataTypes.STRING,
    /**
     * El número de páginas del libro.
     * @type {number}
     */
    paginas: DataTypes.INTEGER
}, { 
    sequelize, 
    modelName: 'book' 
});

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Obtiene todos los libros.
 * @name get/books
 * @function
 * @async
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Obtiene un libro por su ID.
 * @name get/books/:id
 * @function
 * @async
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Crea un nuevo libro.
 * @name post/books
 * @function
 * @async
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Actualiza un libro por su ID.
 * @name put/books/:id
 * @function
 * @async
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Elimina un libro por su ID.
 * @name delete/books/:id
 * @function
 * @async
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia el servidor y escucha en el puerto especificado.
 * @name listen
 * @function
 * @param {number} port - El puerto en el que el servidor escucha.
 * @param {Function} callback - La función a ejecutar una vez que el servidor esté escuchando.
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
