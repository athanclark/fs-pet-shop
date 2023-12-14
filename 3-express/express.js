const fs = require('fs');
const express = require('express');

const FILE = '../pets.json';

// fs.readFile(FILE, (err, file) => {
//     if (err) {
//         console.error(err);
//         process.exit(1);
//     }
//     makeServer(JSON.parse(file));
// });

let petsFileP = fs.readFile(FILE);
petsFileP
    .then(file => makeServer(JSON.parse(file)))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });


function makeServer(initParsed) {
    const app = express();
    let parsed = initParsed;

    app.use((req, res, next) => {
        console.log(`Request: ${req.method} ${req.url}`);
        next();
    });

    app.get('/pets', (req, res) => getAllPets(req, res, parsed));

    app.get('/pets/:idx', (req, res, next) => {
        const idx = parseInt(req.params.idx);
        if (idx < 0 || idx >= parsed.length) {
            next();
        }
        res.json(parsed[idx]);
    });

    app.post(
        '/pets',
        express.json({type: '*/*'}),
        (req, res, next) => postAPet(req, res, parsed, next)
    );

    app.use((req, res, next) => {
        res.status(404).set('Content-Type', 'text/plain').send('Not Found');
    });

    app.listen(8003);
}


function getAllPets(req, res, parsed) {
    res.json(parsed);
}

function postAPet(req, res, parsed, next) {
    const o = req.body;
    if (typeof o.age !== 'number' || !o.kind || !o.name) {
        res.status(400).send('Bad Request');
        return;
    }
    parsed.push(o);
    // fs.writeFile(FILE, JSON.stringify(parsed), err => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).set('Content-Type', 'text/plain').send('Server Error');
    //     } else {
    //         res.status(201).json(o);
    //     }
    // });

    let fileContentP = fs.writeFile(FILE, JSON.stringify(parsed));
    fileContentP
        .then(() => {
            res.status(201).json(o);
        })
        .catch(err => {
            console.error(err);
            res.status(500).set('Content-Type', 'text/plain').send('Server Error');
        });
}
