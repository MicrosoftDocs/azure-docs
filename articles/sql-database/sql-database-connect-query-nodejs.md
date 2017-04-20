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
ms.date: 04/17/2017
ms.author: lbosq

---
# Azure SQL Database: Use Node.js to connect and query data

This quick start demonstrates how to connect to an Azure SQL database using [Node.js](https://nodejs.org/en/) and then use Transact-SQL statements to query, insert, update, and delete data in the database from Windows, Ubuntu Linux, and Mac platforms.

This quick start uses as its starting point the resources created in any of these guides:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

## Install Node.js 

The steps in this section assume that you are familar with developing using Node.js and are new to working with Azure SQL Database. If you are new to developing with Node.js, go the [Build an app using SQL Server](https://www.microsoft.com/en-us/sql-server/developer-get-started/) and select **Node.js** and then select your operating system.

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


## Install the Tedious SQL Server driver for Node.js
The recommended driver for Node.js is **[tedious](https://github.com/tediousjs/tedious)**. Tedious is an open-source initiative that Microsoft is contributing to for Node.js applications on any platform. For this tutorial you need an empty directory to contain your code and the `npm` dependencies that we'll install.

To install the **tedious** driver run the following command inside your directory:

```cmd
npm install tedious
```

## Get connection information

Get the connection information needed to connect to the Azure SQL database. You will need the fully qualified server name, database name, and login information in the next procedures.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. On the **Overview** page for your database, review the fully qualified server name as shown in the image below. You can hover over the server name to bring up the **Click to copy** option. 

   ![server-name](./media/sql-database-connect-query-dotnet/server-name.png) 

4. If you have forgotten the login information for your Azure SQL Database server, navigate to the SQL Database server page to view the server admin name and, if necessary, reset the password.
    
## Select data

Use the following code to query your Azure SQL database for the top 20 products by category. First import the driver Connect and Request classes from the tedious driver library. Afterwards create the configuration object and replace the **username**, **password**, **server** and **database** variables with the values that you specified when you created the database with the AdventureWorksLT sample data. Create a `Connection` object using the specified `config` object. After that, define callback for the `connect` event of the `connection` object to execute the `queryDatabase()` function.

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
Use the following code to insert a new product into the SalesLT.Product table using in the `insertIntoDatabase()` function and the [INSERT](https://docs.microsoft.com/sql/t-sql/statements/insert-transact-sql) Transact-SQL statement. Replace the **username**, **password**, **server** and **database** variables with the values that you specified when you created the database with the AdventureWorksLT sample data. 

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
Use the following code to delete the new product that you previously added using the `updateInDatabase()` function and the [UPDATE](https://docs.microsoft.com/sql/t-sql/queries/update-transact-sql) Transact-SQL statement. Replace the **username**, **password**, **server** and **database** variables with the values that you specified when you created the database with the AdventureWorksLT sample data. This sample uses the Product name inserted in the previous example.

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
Use the following code to delete data from the database. Replace the **username**, **password**, **server** and **database** variables with the values that you specified when you created the database with the AdventureWorksLT sample data. This time, use an **DELETE statement** in the `deleteFromDatabase()` function. This sample also uses the Product name inserted in the previous example.

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

- More information on the [Microsoft Node.js Driver for SQL Server](https://docs.microsoft.com/sql/connect/node-js/node-js-driver-for-sql-server/)
- To connect and query using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- To connect and query using Visual Studio, see [Connect and query with Visual Studio Code](sql-database-connect-query-vscode.md).
- To connect and query using .NET, see [Connect and query with .NET](sql-database-connect-query-dotnet.md).
- To connect and query using PHP, see [Connect and query with PHP](sql-database-connect-query-php.md).
- To connect and query using Java, see [Connect and query with Java](sql-database-connect-query-java.md).
- To connect and query using Python, see [Connect and query with Python](sql-database-connect-query-python.md).
- To connect and query using Ruby, see [Connect and query with Ruby](sql-database-connect-query-ruby.md).

