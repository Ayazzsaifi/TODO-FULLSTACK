require('dotenv').config()
const bcrypt = require("bcrypt")
const express = require("express");
const app = express();
const { userModel, todoModel } = require("./db");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const JWT_SECRET = process.env.JWT_SECRET
app.use(express.json());
// will add a zod library in this 
const {z}=require("zod");
const cors=require("cors")

mongoose.connect(process.env.MONGO_URI)

app.use(cors());

app.post("/signup", async function (req, res) {

    //input validation

    const requireBody=z.object({
        email: z.string().min(3).max(30).email(),
        password: z.string().min(3).max(20).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
        name: z.string().min(3).max(20)
    })

    const parsedDataWithSuccess = requireBody.safeParse(req.body);


    if(!parsedDataWithSuccess.success){
        res.json({
            message:"wrong format",
            error:parsedDataWithSuccess.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // hasing password

    try {
        const hassedPassword = await bcrypt.hash(password, 5);
        console.log(hassedPassword);

        await userModel.create({
            email: email,
            password: hassedPassword,
            name: name
        })
    }
    catch(e){
        res.json({
            message:"Email already Exists"
        })
    }


    res.json({
        message: "youre Sign up "
    })

});

app.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email
    });

    if (!user) {
        res.status(404).json({
            message: "this user is not in our DataBase"
        })
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token
        });
    }

    else {
        res.status(403).json({
            error: "incorrect credintaials"
        })
    }
});

app.post("/todo", auth, async function (req, res) {
    const userId = req.userId;
    const title = req.body.title;

    const newTodo = await todoModel.create({
        title,
        userId
    })

    res.json({
        message: "Todo Added"
    })

});

app.get("/todos", auth,async function (req, res) {
    const userId = req.userId; 

    const todos = await todoModel.find({
        userId: userId
    })

    res.json({
        todos
    })

});


function auth(req, res, next) {
    try {
        const token = req.headers.token
        const decodedData = jwt.verify(token, JWT_SECRET);
        if (decodedData) {
            req.userId = decodedData.id;
            next();
        }
    } catch(e) {
        res.status(403).json({
            err: "incorrect credentials"
        })
    }
}

app.listen(3000);
