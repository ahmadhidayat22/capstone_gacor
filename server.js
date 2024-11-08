
const express = require('express');
const app = express();
const port = 3000;

app.get('/test', (req, res) => {
    res.json({
        message: 'test1'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


