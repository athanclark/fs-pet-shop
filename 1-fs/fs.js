// const fs = require('fs');

// if (process.argv.length <= 2) {
//     console.error('Usage: node fs.js [read | create | update | destroy]');
//     process.exit(1);
// }

// if (process.argv.length > 2) {
//     // ['node', 'fs.js', 'someCommand']
//     // command === 'someCommand'


//     fs.readFile('../pets.json', 'utf8', function (err, data) {
//         if (err) {
//             console.error('Error while parsing pets.json', err);
//             process.exit(1);
//         }

//         const parsedFile = JSON.parse(data);
//         const command = process.argv[2];

//         // Reading a pet /////////////////////////////////////////
//         if (command === 'read') {
//             if (process.argv.length === 4) {

//                 const i = parseInt(process.argv[3]);
//                 if (parsedFile[i]) {
//                     console.log(parsedFile[i]);
//                 } else {
//                     console.error('Usage: node fs.js read INDEX');
//                     process.exit(1);
//                 }

//             } else {
//                 console.log(parsedFile);
//             }

//         // Creating a pet /////////////////////////////////////////
//         } else if (command === 'create') {
//             if (process.argv.length === 6) {
//                 const age = parseInt(process.argv[3]);
//                 const kind = process.argv[4];
//                 const name = process.argv[5];
//                 const newObject = {
//                     age: age,
//                     kind: kind,
//                     name: name
//                 };
//                 const newParsedFile = parsedFile.concat([newObject]);
//                 fs.writeFile('../pets.json', JSON.stringify(newParsedFile), function (err) {
//                     if (err) {
//                         console.error('Error while writing pets.json', err);
//                         process.exit(1);
//                     }
//                 });
//                 console.log(newObject);
//             } else {
//                 console.error('Usage: node fs.js create AGE KIND NAME');
//                 process.exit(1);
//             }
//         }

//     });
// }












































// import * as fs from 'fs';
const fs = require('fs');

if (process.argv.length <= 2) {
    usageError([[2, '[read | create | update | destroy]']]);
}

const cmd = process.argv[2];
const FILE = '../pets.json';

switch (cmd) {
case 'read':
    read();
    break;
case 'create':
    create();
    break;
}


function read() {
    fs.readFile(FILE, (err, file) => {
        const parsed = JSON.parse(file);
        if (process.argv.length === 3) {
            console.log(parsed);
        } else {
            const idx = Number(process.argv[3]);
            if (idx < 0 || idx >= parsed.length) {
                usageError([3, 'INDEX']);
            }
            console.log(parsed[idx]);
        }
    });
}

function create() {
    fs.readFile(FILE, (err, file) => {
        const parsed = JSON.parse(file);
        if (process.argv.length < 6) {
            usageError([
                [3, 'AGE'],
                [4, 'KIND'],
                [5, 'NAME']
            ]);
        } else {
            const o = {
                age: Number(process.argv[3]),
                kind: process.argv[4],
                name: process.argv[5]
            };
            console.log(o);
            fs.writeFile(FILE, JSON.stringify(parsed.concat([o])), err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
}


function usageError(idxs) {
    let args = process.argv;
    args[0] = 'node';
    args[1] = 'fs.js';
    for (const [i,v] of idxs) {
        if (args[i]) {
            args[i] = v;
        } else {
            args.push(v);
        }
    }
    console.error(`Usage: ${args.join(' ')}`);
    process.exit(1);
}
