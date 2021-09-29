const express = require ('express');
const router  = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");



//ROUTE: 1 creating a endpoint for fetching all notes by request user using: GEt "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes  = await Note.find({user : req.user.id})
         res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
      }
})


//ROUTE: 2 creating a endpoint for adding a notes by request user using: POST "/api/notes/addnote"
router.post('/addnote', fetchuser,  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],  async (req, res)=>{
    try {
        //using descructor 
        const {title , description , tag} = req.body;

        //if there are errors return bad request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        //if there are no error create a new note and save it

        //create a Note
        const note  = new Note({
        title , description , tag, user : req.user.id
        })
         
        //saving a note
        const savedNote = await note.save()
        res.json(savedNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error");
      }
})

//ROUTE: 3 creating a endpoint for updating a notes by request user using: PUT "/api/notes/updatenote/:id"

router.put('/updatenote/:id', fetchuser,  async (req, res)=>{
     const {title,description,tag} = req.body;

     try {
       
      
     //creating a newnote onject
     const newNote  = {};
     if(title){newNote.title = title};
     if(description){newNote.description = description};
     if(tag){newNote.tag = tag};

     //Finding the note and updating it
     let note = await Note.findById(req.params.id);
     if(!note){return res.status(404).send("Not Found")}

     //checking that user is legit or not
     if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
 } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server error");
}
   
})

//ROUTE: 4 creating a endpoint for deleting a notes by request user using: DELETE "/api/notes/deletenote/:id"

router.delete('/deletenote/:id', fetchuser,  async (req, res)=>{
 
try {
  

  //Finding the note to delete it
  let note = await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")}

  //checking that user is legit or not
  if(note.user.toString() !== req.user.id){
   return res.status(401).send("Not Allowed");
}

note = await Note.findByIdAndDelete(req.params.id)

 res.json({"Success": "Note has been deleted" , note: note});
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server error");
}
})


module.exports = router;
