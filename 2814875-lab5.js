const express = require('express');
const { error } = require('node:console');
const app = express();
const PORT = 3000;

app.use(express.json());

// Your routes here

let books = [];

const STUDENT_NUMBER ='2814875';
app.get('/whoami', (req,res)=>{
    return res.status(200).json({studentNumber: STUDENT_NUMBER});
});

app.get('/books', (req,res)=>{
    return res.status(200).json(books);
});

app.get('/books/:id', (req,res)=>{
    const {id}=req.params;
    const book=books.find(book=>book.id===id);
    if(!book){
        return res.status(404).json({error:'Book not found'});
    }
    return res.status(200).json(book);
});

app.post('/books',(req,res)=>{
    const {id,title,details}=req.body;
    if(!id||!title){
        return res.status(400).json({error:'Missing required fields'});
    }
    const newBook={id:String(id),
                   title:title,
                   details:Array.isArray(details)?details:[]};
    books.push(newBook)            
    return res.status(201).json(newBook);
});

app.put('/books/:id',(req,res)=>{
    const {id}=req.params;
    const {title,details}=req.body;
    const book=books.find(book=>book.id===id);
    if(!book){
        return res.status(404).json({error:'Book not found'});
    }
    return res.status(200).json(books);
});

app.delete('/books/:id',(req,res)=>{
    const {id}=req.params;
    const bookIndex=books.findIndex(book=>book.id===id);
    if(bookIndex==-1){
        return res.status(404).json({error:'Book not found'});
    }
    books.splice(bookIndex,1);
    return res.status(200).json({message:'Book deleted successfully'});
});

app.post('/books/:id/details',(req,res)=>{
    const {id}=req.params;
    const {id:detailId,author,genre,publicationYear}=req.body;
    const book=books.find(book=>book.id===id);
    if(!book){
        return res.status(404).json({error:'Book not found'});
    }
    if (!detailId||!author||!genre||publicationYear===undefined){
        return res.status(400).json({error:'Missing Fields'});
    }
    const newDetail={id:String(detailId),
                    author:author,
                    genre: genre,
                    publicationYear: publicationYear};
    book.details.push(newDetail);
    return res.status(201).json(book);
});

app.delete('/books/:id/details/:detailId',(req,res)=>{
    const {id,detailId}=req.params;
    const book=books.find(book=>book.id===id);
     if(!book){
        return res.status(404).json({error:'Book or detail not found'});
    }
    const detailIndex=book.details.findIndex(detail=>detail.id===detailId);
    if(detailIndex===-1){
        return res.status(404).json({error:'Book or detail not found'});
    }
    book.details.splice(detailIndex,1);
    return res.status(200).json({message:'Detail deleted successfully'});
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});