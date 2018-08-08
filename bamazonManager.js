var mysql = require("mysql");
var inquirer = require("inquirer");
var selection = "";
var amount = 0;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("active connection to my data base" + connection.threadId);
    runApp();

    //connection.end();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for sale",
                "View low inventory",
                "Add to inventory",
                "Add new product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for sale":
                    saleProducts();
                    break;

                case "View low inventory":
                    lowInventory();
                    break;

                case "Add to inventory":
                    addInventory();
                    break;

                case "Add new product":
                    newProduct();
                    break;
            }

        });
}

function saleProducts() {
    connection.query("Select * from products", function (err, res) {
        if (err) throw err;
        console.log("======= GUACAMOLE STORE FOR THE MANAGER =======");

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" +
                res[i].price + " | " + res[i].stock_quantity + " | ")
        }
        runApp();
    }

    )
};

function lowInventory() {
    connection.query("Select * from products GROUP BY product_name HAVING stock_quantity < 5 ", function (err, res) {
        if (err) throw err;
        console.log("======= LOW INVENTORY =======");

        for (let i = 0; i < res.length; i++) {
            console.log("Low on " + res[i].product_name)
        }
        runApp();

    }
    )
};

//Trying to make the prompt options firts... then I wil try to make it work
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("============= ADD MORE STOCK ==========");


        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Type the ID you want to add to the inventory",

        }, {
            name: "quantity_inventory",
            type: "input",
            message: "Insert the quantity you want to add to the inventory",

        }]).then(function (answer){
            var addID = answer.id;
            var addStock = answer.quantity_inventory;

            //addingStock();
            console.log("You selected: " + answer.id + " and you want to add " + answer.quantity_inventory + " to the inventory.")
            connection.query("UPDATE products SET stock_quantity = " + addStock + " WHERE id = '" + addID + "'", function (err, res){
                if(err) throw err;
                runApp();
            }
            

        )})
        
    })
};

// function addingQuantity() {
//     inquirer
//         .prompt({
//             name: "amount",
//             type: "input",
//             message: "How many " + selection.id + "s would you like to add?",
//         })
//         .then(function (answer) {
//             //console.log(all);
//             amount = answer.amount
//             if (amount + selection.stock_quantity){
//                 console.log("You picked " + amount + " " + selection.product_name + "(s)");
//                 addingStock();  
                
//             }
          
                           
//         })
// };

// function addingStock() {
//     var val = selection.stock_quantity + amount
//     connection.query("Update products set stock_quantity = " + val + " where product_name = '" + selection.product_name + "'", function (err, res) {
//         if(err){
//             throw err
//             console.log("============= ALMOST ==========");

//         }else{
//         console.log("Stock Quantity for " + selection.product_name + " changed to " + val + " successfully!")
//         runApp()
//         }
//     })
// };



