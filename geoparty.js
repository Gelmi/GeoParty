const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build'), {dotfile: 'allow'}));
app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });
app.listen(3000, () => (console.log('App running on 4000')));
