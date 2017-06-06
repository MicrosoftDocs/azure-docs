---
title: Connect Azure SQL Database by using Node.js | Microsoft Docs
description: Presents a Node.js code sample you can use to connect to and query Azure SQL Database.
services: sql-database
documentationcenter: ''
author: LuisBosquez
manager: jhubbard
editor: ''

ms.assetid: 53f70e37-5eb4-400d-972e-dd7ea0caacd4
ms.service: sql-database
ms.custom: quick start connect
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 04/05/2017
ms.author: lbosq

---
# Azure SQL Database: Use Node.js to connect and query data

[!INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]

Use [Node.js](https://nodejs.org/en/) to connect to and query an Azure SQL database. This guide will describe how to connect to an Azure SQL database using Node.js and then execute query, insert, update, and delete statements from Windows, Ubuntu Linux, or Mac platforms.

This quick start uses as its starting point the resources created in any of these guides:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

## Configure Development Environment
In this section we will install the runtime environment for **Node.js** on your platform of choice. If you already have Node.js installed on your environment please proceed to the next section titled **Install the Tedious SQL Server database driver for Node.js**. Follow the installation instructions for any of the platforms below.

### **Mac OS**
Enter the following commands to install **brew**, an easy-to-use package manager for Mac OS X and **Node.js**.

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

### **Linux (Ubuntu)**
Enter the following commands to install **Node.js** and **npm** the package manager for Node.js.

```bash
sudo apt-get install -y nodejs npm
```

### **Windows**
Visit the [Node.js downloads page](https://nodejs.org/en/download/) and select your desired Windows installer option.


## Set up the project and install the Tedious SQL Server driver for Node.js
The recommended driver for Node.js is **[tedious](https://github.com/tediousjs/tedious)**. Tedious is an open-source initiative that Microsoft is contributing to for Node.js applications on any platform. For this tutorial you need an empty directory to contain your code and the `npm` dependencies that we'll install.

To install the **tedious** driver run the following command inside your directory:

```cmd
npm install tedious
```

## Get connection information

Get the connection string in the Azure portal. You use the connection string to connect to the Azure SQL database.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane for your database, review the fully qualified server name. 

    <img src="./media/sql-database-connect-query-dotnet/server-name.png" alt="connection strings" style="width: 780px;" />

3. Make sure to import the **AdventureWorksLT** database since this example will make use of it.

## Read from the database
First import the driver Connect and Request classes from the tedious driver library. Afterwards create the configuration object and replace your **username**, **password**, **server** and **database** variables with your connection parameters obtained above. Create a `Connection` object using the specified `config` object. After that, define callback for the `connect` event of the `connection` object to execute the `queryDatabase()` function.

```js
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


// Create connection to database
var config = {
  userName: 'your_username', // update me
  password: 'your_password', // update me
  server: 'your_server.database.windows.net', // update me
  options: {
      database: 'your_database' //update me
  }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err)
    }
    else{
        queryDatabase()
    }
});

function queryDatabase(){
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT TOP 1 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) returned');
        }
    );
    
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);
}
```

## Insert data into the database
Similar steps as the **Read from the Database** example above. Make sure to replace your **username**, **password**, **server** and **database** variables with your connection parameters obtained above. This time, use an **INSERT statement** in the `insertIntoDatabase()` function.

```js
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


// Create connection to database
var config = {
  userName: 'your_username', // update me
  password: 'your_password', // update me
  server: 'your_server.database.windows.net', // update me
  options: {
      database: 'your_database' //update me
  }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err)
    }
    else{
        insertIntoDatabase()
    }
});

function insertIntoDatabase(){
    console.log("Inserting a brand new product into database...");
    request = new Request(
        "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('BrandNewProduct', '200989', 'Blue', 75, 80, '7/1/2016')",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) inserted');
        }
    );
    connection.execSql(request);
}
```

## Update data in the database
Similar steps as the **Read from the Database** example above. Make sure to replace your **username**, **password**, **server** and **database** variables with your connection parameters obtained above. This time, use an **UPDATE statement** in the `updateInDatabase()` function. This sample uses the Product name inserted in the previous example.

```js
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


// Create connection to database
var config = {
  userName: 'your_username', // update me
  password: 'your_password', // update me
  server: 'your_server.database.windows.net', // update me
  options: {
      database: 'your_database' //update me
  }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err)
    }
    else{
        updateInDatabase()
    }
});

function updateInDatabase(){
    console.log("Updating the price of the brand new product in database...");
    request = new Request(
        "UPDATE SalesLT.Product SET ListPrice = 50 WHERE Name = 'BrandNewProduct'",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) updated');
        }
    );
    connection.execSql(request);
}
```

## Delete data from the database
Similar steps as the **Read from the Database** example above. Make sure to replace your **username**, **password**, **server** and **database** variables with your connection parameters obtained above. This time, use an **INSERT statement** in the `deleteFromDatabase()` function. This sample also uses the Product name inserted in the previous example.

```js
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


// Create connection to database
var config = {
  userName: 'your_username', // update me
  password: 'your_password', // update me
  server: 'your_server.database.windows.net', // update me
  options: {
      database: 'your_database' //update me
  }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err)
    }
    else{
        deleteFromDatabase()
    }
});

function deleteFromDatabase(){
    console.log("Deleting the brand new product in database...");
    request = new Request(
        "DELETE FROM SalesLT.Product WHERE Name = 'BrandNewProduct'",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) returned');
        }
    );
    connection.execSql(request);
}
```


## Next Steps
* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft Node.js Driver for SQL Server](https://docs.microsoft.com/sql/connect/node-js/node-js-driver-for-sql-server/)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)

