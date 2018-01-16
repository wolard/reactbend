let express = require("express");
let bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.json({extended:true}));

let shoppingList = [];
let id = 0;
let registeredUsers = [];
let loggedUsers = [];

app.use("/api", function(req,res,next) {
	let token = req.headers.token;
	for(let i=0;i<loggedUsers.length;i++) {
		if(token === loggedUsers[i].token) {
			return next();
		}
	}
	res.status(403).json({"message":"forbidden"});
});

app.post("/register", function(req,res) {
	let user = {
		"username":req.body.uname,
		"password":req.body.pword
	}
	if (user.username.length === 0) {
		return res.status(409).json({"message":"Enter username"});
	}
	for (let j=0;j<registeredUsers.length;j++) {
		if(user.username === registeredUsers[j].username) {
			return res.status(409).json({"message":"username already in use"});
		}
	};
	registeredUsers.push(user);
	console.log(registeredUsers);
	res.status(200).json({"message":"success"});
});

app.post("/login",function(req,res) {
	let user = {
		"username":req.body.uname,
		"password":req.body.pword
	}
	for (let k=0;k<registeredUsers.length;k++) {
		console.log("!");
		if(user.username === registeredUsers[k].username) {
			console.log("!!");
			if(user.password === registeredUsers[k].password) {
				console.log("!!!");
				let bits = ['a','b','c','d','e','f','A','B','C','D','E','F'];
				let token = "";
				for (let s=0;s<50;s++) {
					let temp = Math.floor(Math.random()*12);
					token = token+bits[temp];

				}
console.log(token);
				let tempUser= {
					"username":user.username,
					"token":token
				}
				loggedUsers.push(tempUser);
				return res.status(200).json({
					"message":"success",
					"token":token

					})
			}
		}
	}
	res.status(403).json({"message":"wrong username or password"});
});
app.post("/logout",function(req,res){
let token=req.body.token;
if(token) {
	for(let t=0;t<loggedUsers.length;t++){
if(token === loggedUsers[t].token) {
	loggedUsers.splice[t,1];
	break;
}

	}
}
	res.status(200).json({"message":"success"});
})
app.get("/api/item", function(req,res) {
	res.status(200).json(shoppingList);
});

app.post("/api/item", function(req,res) {
	id++;
	let tempItem = {
		"id":id,
		"item": req.body.item,
		"price": req.body.price,
		"count": req.body.count
	}
	shoppingList.push(tempItem);
	res.status(200).json({"message":"success"});
});

app.delete("/api/item/:id", function(req,res) {
	for (let i=0; i<shoppingList.length; i++) {
		if (shoppingList[i].id == req.params.id) {
				shoppingList.splice(i,1);
				return res.status(200).json({"message":"success"});
		}
	}
	res.status(200).json({"message":"not found"});
});

app.post("/api/item/:id", function(req,res){
	for (let i=0; i<shoppingList.length; i++) {
		if (shoppingList[i].id == req.params.id) {
				let tempItem = {
					"id":req.params.id,
					"item": req.body.item,
					"price": req.body.price,
					"count": req.body.count
				}
				shoppingList.splice(i,1,tempItem);
				return res.status(200).json({"message":"success"});
		}
	}
	res.status(200).json({"message":"not found"});



});

app.listen(3001);
console.log("Running at port 3001");
