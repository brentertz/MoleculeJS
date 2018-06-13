const app = require('express')();
const path = require('path');

(() => {
    app.get('/favicon.ico', (req, res) => res.sendStatus(200))

    app.get('/node_modules*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../') + req.url);
    });

    app.get('/tests*', (req, res) => res.sendFile(path.resolve(__dirname, '../') + req.url));

    app.get('/packages*', (req, res) => res.sendFile(path.resolve(__dirname, '../../') + req.url));

    app.get('/common*', (req, res) => res.sendFile(path.resolve(__dirname, '../') + req.url));

    app.get('/@molecule*', (req, res) => res.sendFile(path.resolve(__dirname, '../../packages/molecule-lit/node_modules') + req.url));

    app.get('/lit-html*', (req, res) => res.sendFile(path.resolve(__dirname, '../../packages/molecule-lit/node_modules') + req.url));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, req.url)));

    app.listen(3000);

})();