import mongoose from "mongoose"

const connectToDataBase = async () =>{
    try {
        const connection = await mongoose.connect("mongodb+srv://faroukmessai221:0000@todolist.7fnt0ed.mongodb.net/todolist-app?retryWrites=true&w=majority&appName=ToDoList")
        if(connection){
            console.log("Connected to MongoDB")
        }
    } catch (error) {
        console.log("Error In Connection DataBase",error)
        throw error
    }
}

export default connectToDataBase