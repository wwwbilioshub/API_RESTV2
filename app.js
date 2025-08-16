const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

// Création de l'application
const app = express();
const port = 300;

app.use(bodyParser.json());

// Connexion à SQLite (fichier local database.sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Définition du modèle Task
const Task = sequelize.define('Task', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

// Synchroniser le modèle avec la base
sequelize.sync()
    .then(() => console.log('Base de données synchronisée'))
    .catch(err => console.error('Erreur de synchronisation :', err));

// Récupérer toutes les tâches
app.get('/tasks', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// Récupérer une tâche par ID
app.get('/task/:id', async (req, res) => {
    const task = await Task.findOne({ where: { id: req.params.id } });
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Tâche non trouvée' });
    }
});

// Ajouter une tâche
app.post('/tasks', async (req, res) => {
    const { description } = req.body;
     const { id } = req.body;
    if (!description || description.trim() === '') {
        return res.status(400).json({ error: 'Description requise' });
    }
    const newTask = await Task.create({id, description });
    res.status(201).json(newTask);
});

// Modification d'une tâche
app.put('/task/:id', async (req, res) => {
    const { description } = req.body;
     const { id } = req.body;
    if (!description || description.trim() === '') {
        return res.status(400).json({ error: 'Description requise' });
    }
    const newTask = await Task.update( 
        { description: description },
        {
            where: {
                id: id,
            },
        }
    );
    res.status(201).json(newTask);
});

// Suppression d'une tâche
app.delete('/task/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await Task.destroy({
        where: {
            id: id
        }
    });
    if (deleted) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Tâche non trouvée' });
    }
});


// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});
