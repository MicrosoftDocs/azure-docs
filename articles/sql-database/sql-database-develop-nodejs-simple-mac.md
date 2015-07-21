<properties 
	pageTitle="Connect to SQL Database by using Node.js with Tedious on Mac OS X" 
	description="Presents a Node.js code sample you can use to connect to Azure SQL Database. The sample uses the Tedious driver to connect."
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
	ms.date="07/20/2015" 
	ms.author="mebha"/>


# Connect to SQL Database by using Node.js with Tedious on Mac OS X


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a Node.js code sample that runs on Mac OS X. The sample connects to Azure SQL Database by using the Tedious driver.


## Required software items


Install **node**, unless it is already installed on your machine.


To install node.js on OSX 10.10 Yosemite  you can download a pre-compiled binary package which makes a nice and easy installation. [Head over to nodejs.org](http://nodejs.org/) and click the install button to download the latest package.

Install the package from the .dmg by following along the install wizard which will install both **node** and **npm**, npm is Node Package Manager which facilitates installs of additional packages for node.js.


After your machine is configured with **node** and **npm**, navigate to a directory where you plan to create your Node.js project, and enter the following commands.


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
	var Request = require('tedious').Request;
	var TYPES = require('tedious').TYPES;
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
	var Request = require('tedious').Request
	var TYPES = require('tedious').TYPES;
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
