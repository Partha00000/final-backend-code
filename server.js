const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ dest: 'uploads/' });

const pool =  mysql.createPool({
    host:"localhost",
    user:"root",
    password:"admin",
    database:"domain database",
    connectionLimit: 10
})
//
// website_name	
// offer	
// imgLink Ascending 1	
// afflink
// posting 
app.post('/api/posts', upload.single('imgLink'), async (req, res) => {
  try {
    const { website_name, offer, afflink } = req.body;
    const imgLink = req.file.filename;
    console.log( req.file.filename)

    const [result] = await pool.query('INSERT INTO addwebsite SET ?', { imgLink, website_name, offer, afflink });

    // Move uploaded file from uploads directory to photos directory
    const oldPath = path.join(__dirname, req.file.path);
    const newPath = path.join(__dirname, 'photos', req.file.filename);
    fs.renameSync(oldPath, newPath);

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});







// Define a route for the API endpoint
app.get('/addWebsite', async (req, res) => {
    try {
      // Execute a query to fetch the data from the database
      const [rows] = await pool.query(`SELECT * FROM addWebsite`);
        // console.log(rows);
      // Transform the data into a JSON object
      const data = rows.map(row => {
        return {
          name: row.website_name,
          offer: row.offer,
          img: row.imgLink,
          aff: row.afflink
          // Add more properties as needed
        };
      });

       // Send the JSON object to the frontend
    res.json(data);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
});
  


app.listen(8383, () => {
    console.log('Server started on port 8383');
  });