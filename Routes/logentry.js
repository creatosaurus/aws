const express = require('express');
const logs = require('../Schema/logentry');
const multer = require('multer')

const router = express.Router();

//configuring the multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage }).array('photos', 10)


//uploading the log information
router.post('/log', upload, (req, res) => {

  const file = req.files
  if (!file) {
    const error = new Error('Please upload a file')
    res.status(400).send(error)
  }

  const name = file.map(data => {
    return data.destination + data.filename
  })
  req.body.images = name
  logs.create(req.body).then(data => {
      res.send(data)
  })

})

//getting all logs
router.get('/log',(req, res) => {
  logs.find({}).then(data =>{
    res.send(data)
  })
})


module.exports = router
