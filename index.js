const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

//require for ROUTES
const study = require('./routes/study');
const code = require('./routes/code');
const exercise = require('./routes/exercise');
const studytype = require('./routes/studytype');
const codetype = require('./routes/codetype');
const exercisetype = require('./routes/exercisetype');
const auth = require('./routes/jwtAuth')


//middleware
app.use(cors());
app.use(express.json());    // to allow us to access req.body
const authorisation = require("./middleware/authorisation")

if (process.env.NODE_ENV === "production") {
    //server static content
    //npm run build
    app.use(express.static(path.join(__dirname, "client/build")));  //use build folder
}

//ROUTES
//STUDY
app.get('/study', authorisation, study.get_all_activity);                          //get all study activities
app.post('/study', authorisation, study.add_activity);                             //add a study add_activity
app.delete('/study/:id', authorisation, study.delete_activity);                    //delete a specific study activity
app.get('/study/:id', authorisation, authorisation, study.get_activity);                          //get a specific study activity
app.put('/study/:id', authorisation, study.edit_activity);                         //edit a specific study activity
app.get('/study/date/:date', authorisation, study.get_date_activity);              //get all study activities on date

//CODE
app.get('/code', authorisation, code.get_all_activity);                            //get all code activities
app.post('/code', authorisation, code.add_activity);                               //add a code add_activity
app.delete('/code/:id', authorisation, code.delete_activity);                      //delete a specific code activity
app.get('/code/:id', authorisation, code.get_activity);                            //get a specific code activity
app.put('/code/:id', authorisation, code.edit_activity);                           //edit a specific code activity
app.get('/code/date/:date', authorisation, code.get_date_activity);              //get all code activities on date

//EXERCISE
app.get('/exercise', authorisation, exercise.get_all_activity);                    //get all exercise activities
app.post('/exercise', authorisation, exercise.add_activity);                       //add a exercise add_activity
app.delete('/exercise/:id', authorisation, exercise.delete_activity);              //delete a specific exercise activity
app.get('/exercise/:id', authorisation, exercise.get_activity);                    //get a specific exercise activity
app.put('/exercise/:id', authorisation, exercise.edit_activity);                   //edit a specific exercise activity
app.get('/exercise/date/:date', authorisation, exercise.get_date_activity);           //get all exercise activities on date

//STUDY TYPES
app.get('/studytype', authorisation, studytype.get_all_studys);           //get all studytypes
app.post('/studytype', authorisation, studytype.add_study);               //add a studytype
app.delete('/studytype/:id', authorisation, studytype.delete_study);      //delete a specific studytype
app.get('/studytype/:id', authorisation, studytype.get_study);            //get a specific studytype
app.put('/studytype/:id', authorisation, studytype.edit_study);           //edit a specific studytype

//CODE TYPES
app.get('/codetype', authorisation, codetype.get_all_codes);           //get all codetypes
app.post('/codetype', authorisation, codetype.add_code);               //add a codetype
app.delete('/codetype/:id', authorisation, codetype.delete_code);      //delete a specific codetype
app.get('/codetype/:id', authorisation, codetype.get_code);            //get a specific codetype
app.put('/codetype/:id', authorisation, codetype.edit_code);           //edit a specific codetype

//EXERCISE TYPES
app.get('/exercisetype', authorisation, exercisetype.get_all_exercises);           //get all exercisetypes
app.post('/exercisetype', authorisation, exercisetype.add_exercise);               //add a exercisetype
app.delete('/exercisetype/:id', authorisation, exercisetype.delete_exercise);      //delete a specific exercisetype
app.get('/exercisetype/:id', authorisation, exercisetype.get_exercise);            //get a specific exercisetype
app.put('/exercisetype/:id', authorisation, exercisetype.edit_exercise);           //edit a specific exercisetype

//AUTHENTICATION
app.post('/auth/register', auth.register);                               //register
app.post('/auth/login', auth.login)                                      //Login
app.get('/auth/verify', authorisation, auth.verify)                      //verify

//CATCH ALL
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"))
})

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
});
