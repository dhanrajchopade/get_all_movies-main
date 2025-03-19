const express = require("express")
const app = express()


const { title } = require("process")
const {initializeDatabase} = require("./db/db.connect") 
const Movie = require("./models/movies.models")
const { error } = require("console")

app.use(express.json())
initializeDatabase()
 
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

 // Create a new movie
app.post("/movies", async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json({message:"Movie saved successfully",savedMovie});
  } catch (error) {
    res.status(400).json({ error: "Failed to create movie", details: error.message });
  }
});


// find a movie with a particular title

async function readMovieByTitle(movieTitle) {
    try{
const movie = await Movie.findOne({title: movieTitle})
return movie
    }
    catch(error){
        throw error
    }
    
}

app.get("/movies/:title",async(req,res)=>{
    try{
        const movie = await readMovieByTitle(req.params.title)
        if(movie){
            res.json(movie)
        }else{
           res.status(404).json({error:"Movie not found."})
        }

    } catch(error){
        res.status(500).json({error:"Failed to fetch movie."})
    }
})

//  Get all the movies in the database

async function readAllMovies() {
    try{
const allMovies = await Movie.find()
return allMovies
    } catch(error){
        console.log(error)
    }
}
app.get("/movies",async (req,res)=>{
    try{
        const movies = await readAllMovies()
        if(movies.length !==0){
            res.json(movies)
        }else{
            res.status(404).json({error:"No movies found."})
        }
    }catch(error){
res.status(500).json({error:"Failed to fetch movies."})
    }
})

// get all movies by director name

async function readMovieByDirectorName(directorName) {
    try{
        const movieByDirector = await Movie.find({director:directorName})
        return movieByDirector
    } catch(error){
        console.log(error)
    }
}

app.get("/movies/director/:directorName", async(req,res)=>{
    try{
        const movies = await readMovieByDirectorName(req.params.directorName)
if(movies.length !=0){
    res.json(movies)
}else{
    res.status(404).json({error:"No movies found."})
}
    }catch(error){
        res.status(500).json({error:"Failed to fetch movies."})
    }
})

// get all movies by Genre

async function readMoviebyGenre(genreName) {
    try{
        const movieByGenre = await Movie.find({genre:genreName})
        return movieByGenre
    }catch(error){
        console.log(error)
    }    
}

app.get("/movies/genres/:genreName", async(req,res)=>{
    try{
        const movies = await readMoviebyGenre(req.params.genreName)         
        if(movies.length !=0){
res.json(movies)
        }else{
            res.status(404).json({error:"No movies found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch movies."})
    }
})



const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
