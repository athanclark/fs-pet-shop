import express from 'express';
import pg from 'pg';

const psql = new pg.Client({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
});

await psql.connect();

const app = express();

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});

app.get('/pets', (req, res) => getAllPets(req, res, psql));

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

app.patch(
    '/pets/:idx',
    express.json({type: '*/*'}),
    (req, res, next) => patchAPet(req, res, parsed, next)
);

app.delete(
    '/pets/:idx',
    (req, res, next) => deleteAPet(req, res, parsed, next)
);

app.use((req, res, next) => {
    res.status(404).set('Content-Type', 'text/plain').send('Not Found');
});

app.listen(8003);


async function getAllPets(req, res, psql) {
    const result = await psql.query('SELECT age, name, kind FROM pets');
    res.json(result.rows);
}

function postAPet(req, res, parsed, next) {
    // { name: "foo", kind: "bar", age: 5 }
    const o = req.body;
    if (typeof o.age !== 'number' || typeof o.kind !== 'string' || typeof o.name !== 'string') {
        res.status(400).send('Bad Request');
        return;
    }
    parsed.push(o);
    fs.writeFile(FILE, JSON.stringify(parsed), err => {
        if (err) {
            console.error(err);
            res.status(500).set('Content-Type', 'text/plain').send('Server Error');
        } else {
            res.status(201).json(o);
        }
    });
}
// /pets/4

function patchAPet(req, res, parsed, next) {
    const idx = parseInt(req.params.idx);
    // { name: "foo" }, { age: 5 }, { kind: "foo", name: "bar" }, {}
    const o = req.body;
    const badKeys = Object.keys(o)
          .filter(k => k !== 'age' && k !== 'name' && k !== 'kind');
    const isPresentAndWrongType = (key, type) => o[key] ? typeof o[key] !== type : false;
    if (
        isPresentAndWrongType('age', 'number')
            || isPresentAndWrongType('name', 'string')
            || isPresentAndWrongType('kind', 'string')
            || badKeys.length > 0
    ) {
        console.log('bad keys:', badKeys);
        console.log('o', o);
        res.status(400).send('Bad Request');
        return;
    }
    parsed[idx] = { ...parsed[idx], ...o };
    fs.writeFile(FILE, JSON.stringify(parsed), err => {
        if (err) {
            console.error(err);
            res.status(500).set('Content-Type', 'text/plain').send('Server Error');
        } else {
            res.status(201).json(parsed[idx]);
        }
    });
}

function deleteAPet(req, res, parsed, next) {
    const idx = parseInt(req.params.idx);
    parsed.splice(idx, 1);
    fs.writeFile(FILE, JSON.stringify(parsed), err => {
        if (err) {
            console.error(err);
            res.status(500).set('Content-Type', 'text/plain').send('Server Error');
        } else {
            res.status(204).send('Deleted');
        }
    });
}
