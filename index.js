
const express=require("express");
const fs=require("fs");
const { parse } = require("path");


const app =express();


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=>{
    res.end("App Working")
})

const PORT=process.env.PORT || 8080;

app.get("/votes/voters",(req,res)=>{
    res.setHeader("content-type","application/json");
    fs.readFile("./db.json","utf-8",(err,data)=>{
        res.end(data);
    });
});

app.get("/votes/party/:party",(req,res)=>{
    const {party}=req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
          parsed.list=parsed.list.filter((el)=> el.party === party);
           return res.send(parsed.list);
     });
});


app.post("/user/create",(req,res)=>{
    const {id}=req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
        parsed.list=[...parsed.list,req.body];
        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.status(201).send(`user created ${req.body.id}`);
        });
    });
});


app.post("/user/login",(req,res)=>{
    const {username}=req.params;
    const {password}=req.params;
    const {token}=req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
        if(!parsed.list.find((el)=>el.username===username) && (el.password===password)){
            return res.status(401).send("Invalid Credentials");
        }
        parsed.list=[...parsed.list,req.body];
        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.status(200).send(`Login Successful ${req.body.token}`);
        });
    });
});



app.delete("/user/logout",(req,res)=>{
    const {token}=req.params;
    fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
        const parsed=JSON.parse(data);
        if(!parsed.product.find((el)=>el.token===token)){
            return res.status(401).send(`Cannot find the product to delete token ${token}`);
        }
        parsed.product=parsed.product.filter((el)=> el.token !== token);
        fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.end("user logged out successfully");
        });
      });
    });

    app.put("/votes/count/:user",(req,res)=>{
        const {user}=req.params;
        const {votes}=req.params;
     fs.readFile("./db.json",{encoding:"utf-8"},(err,data)=>{
         const parsed=JSON.parse(data);
         parsed.list=[...parsed.list,req.body];
         parsed.list=parsed.list.filter((el)=>el.votes===votes+1);
     fs.writeFile("./db.json",JSON.stringify(parsed),{encoding:"utf-8"},()=>{
         res.end("x");
      });
    });
 });


app.listen(PORT,()=>{
    console.log("server is started http://localhost:8080/");
});