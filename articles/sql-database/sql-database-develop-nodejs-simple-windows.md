<properties 
	pageTitle="Connect to SQL Database by using Node.js on Windows" 
	description="Presents a Node.js code sample you can use to connect to Azure SQL Database. The sample runs on a Windows client computer."
	services="sql-database" 
	documentationCenter="" 
	authors="meet-bhagdev" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="11/19/2015"
	ms.author="meetb"/>


# Connect to SQL Database by using Node.js on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a Node.js code sample that you can use to connect to Azure SQL Database. The Node.js program runs on a Windows client computer. To manage the connection, the msnodesql driver is used.


## Requirements


The following software items must exist on your client development computer.


-  [Node.js] (https://nodejs.org/en/download/) - Click on the windows installer and download the appropriate msi installer. Once downloaded run the msi to install Node.js 


### Install the required modules

After your machine is configured with **node**, open cmd.exe and navigate to a directory where you plan to create your Node.js project, and enter the following commands.


	npm init
	npm install tedious


**npm init** creates a node project. To retain the defaults during your project creation, press enter until the project is created. Now you see a **package.json** file in your project directory.


### Create an AdventureWorks database


The code sample in this topic expects an **AdventureWorks** test database. If you do not already have one, see [Get started with SQL Database](sql-database-get-started.md). It is important that you follow the guide to create an **AdventureWorks database template**. The examples shown below work only with the **AdventureWorks schema**. 


## Connect to your SQL Database

The [new Connection](http://pekim.github.io/tedious/api-connection.html) function is used to connect to SQL Database.

	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you are on Microsoft Azure, you need this:
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
	// If no error, then good to proceed.
		console.log("Connected");
	});


## Execute an SQL SELECT


All SQL statements are executed using the [new Request()](http://pekim.github.io/tedious/api-request.html) function. If the statement returns rows, such as a select statement, you can retreive them using the [request.on()](http://pekim.github.io/tedious/api-request.html) function. If there are no rows, [request.on()](http://pekim.github.io/tedious/api-request.html) function returns empty lists.


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// When you connect to Azure SQL Database, you need these next options.
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
		// If no error, then good to proceed.
		console.log("Connected");
		executeStatement();
	});
	
	var Request = require('tedious').Request;
	var TYPES = require('tedious').TYPES;
	
	function executeStatement() {
		request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {
	  	if (err) {
	   		console.log(err);} 
		});
		var result = "";
		request.on('row', function(columns) {
		    columns.forEach(function(column) {
		      if (column.value === null) {
		        console.log('NULL');
		      } else {
		        result+= column.value + " ";
		      }
		    });
		    console.log(result);
		    result ="";
		});
	
		request.on('done', function(rowCount, more) {
		console.log(rowCount + ' rows returned');
		});
		connection.execSql(request);
	}


## Insert a row, apply parameters, and retrieve the generated primary key


In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. In this example you will see how to execute an insert-statement, safely pass parameters which protects from SQL injection, and retrieve the auto-generated primary key value.


The code sample in this section applies parameters to an SQL INSERT statement. The primary key value that is generated is retrieved by the program.


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you are on Azure SQL Database, you need these next options.
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
		// If no error, then good to proceed.
		console.log("Connected");
		executeStatement1();
	});
	
	var Request = require('tedious').Request
	var TYPES = require('tedious').TYPES;
	
	function executeStatement1() {
		request = new Request("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {
		 if (err) {
		 	console.log(err);} 
		});
		request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');
		request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');
		request.addParameter('Cost', TYPES.Int, 11);
		request.addParameter('Price', TYPES.Int,11);
		request.on('row', function(columns) {
		    columns.forEach(function(column) {
		      if (column.value === null) {
		        console.log('NULL');
		      } else {
		        console.log("Product id of inserted item is " + column.value);
		      }
		    });
		});		
		connection.execSql(request);
	}

 
