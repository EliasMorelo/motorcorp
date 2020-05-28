const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:root@cluster0-usuzk.mongodb.net/motorcorp?retryWrites=true&w=majority',{
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));

