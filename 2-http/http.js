const fs = require('fs');
const http = require('http');

const FILE = '../pets.json';

fs.readFile(FILE, (err, file) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    const parsed = JSON.parse(file);
    const server = http.createServer((req, res) => handler(parsed, req, res));
    server.listen(8003);
});

function handler(parsed, req, res) {
    function error404() {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }

    function setJSON() {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
    }

    switch(req.method) {
    case 'GET':
        read();
        break;
    case 'POST':
        create();
        break;
    default:
        error404();
    }

    function read() {
        if (req.url === '/pets') {
            setJSON();
            res.end(JSON.stringify(parsed));
        } else {
            const matches = req.url.match(/^\/pets\/([0-9]+)$/);
            if (matches.length >= 2 && matches[1]) {
                const idx = Number(matches[1]);
                if (idx >= 0 && idx < parsed.length) {
                    setJSON();
                    res.end(JSON.stringify(parsed[idx]));
                    return;
                }
            }
            error404();
        }
    }

    function create() {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });
        req.on('end', () => {
            let postedBody;
            try {
                postedBody = JSON.parse(data);
            } catch(e) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Bad Request');
                return;
            }
            if (postedBody.name && postedBody.kind && typeof postedBody.age === 'number') {
                fs.writeFile(FILE, JSON.stringify(parsed.concat([postedBody])), err => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    setJSON();
                    res.end(JSON.stringify(postedBody));
                });
            } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Bad Request');
            }
        });
    }
}


