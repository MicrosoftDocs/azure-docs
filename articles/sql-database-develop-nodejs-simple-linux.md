<properties 
	pageTitle="Connect to SQL Database by using Python with pymssql on Ubuntu Linux" 
	description="Presents a code sample you can use to connect to Azure SQL Database."
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="04/17/2015" 
	ms.author="genemi"/>


# Connect to SQL Database by using NodeJS with pymssql on Ubuntu Linux


<!--
2015-04-17
sql-database-develop-nodejs-simple-linux.md
meet-bhagdev , mebha: is the original author. GeneMi is merely editing and publishing for first publish.
-->


This topic presents a NodeJS code sample that runs on Unbutu Linux. The sample connects to Azure SQL Database by using the pymssql driver.


## Required software items


Open your terminal and install **node** and **npm**, unless they are already installed on your machine.


	sudo apt-get install node
	sudo apt-get install npm


After your machine is configured with **node** and **npm**, navigate to a directory where you plan to create your nodejs project, and enter the following commands.


	sudo npm init
	sudp npm install tedious


<!--
TODO, ERROR MUST BE FIXED: Must fix the following paragraph near the words "press until".  Press what?
-->


**npm init** creates a node project. To retain the defaults during your project creation, press until the project is created. Now you see a **package.json** file in your project directory.


## Create an AdventureWorks database


The code sample in this topic expects a standard **AdventureWorks** test database. If you do not already have one, see [Get started with SQL Database](http://azure.microsoft.com/documentation/articles/sql-database-get-started.md). It is important that you follow the guide to create an **AdventureWorks database template**. The examples shown below work only with the **AdventureWorks schema**. 


## Connect to your SQL Database


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you're on Windows Azure, you will need this:
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
	// If no error, then good to proceed.
		console.log("Connected");
	});


<!--
TODO: Seems unfortunate that these same 13 lines of Connection code are repeated and repeated in every subsequent section.  Are these repetitions avoidable without much drawback?
-->


## Execute an SQL SELECT


<!--
TODO: Can the NodeJS language somehow split the very long SELECT string into a few shorter lines of code, to prevent the end of the string from being beyond the right edge of the display monitor?
-->


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


The code sample in this section applies parameters to an SQL INSERT statement. The primary key value that is generated is retrieved by the program.


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you are on Azure SQL Database, you will need these next options.
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


## Transactions


<!--
TODO: I do not see any Transaction related code in this section?
-->


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you're on Windows Azure, you will need this:
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
		// If no error, then good to proceed.
		console.log("Connected");
		executeStatement2();
	});
	
	var Request = require('tedious').Request;
	var TYPES = require('tedious').TYPES;
	
	function executeStatement2() {
	//TODO
	}


## Stored procedures


	var Connection = require('tedious').Connection;
	var config = {
		userName: 'yourusername',
		password: 'yourpassword',
		server: 'yourserver.database.windows.net',
		// If you're on Windows Azure, you will need this:
		options: {encrypt: true, database: 'AdventureWorks'}
	};
	var connection = new Connection(config);
	connection.on('connect', function(err) {
		// If no error, then good to proceed.
		console.log("Connected");
		executeStatement3();
	});
	
	var Request = require('tedious').Request;
	var TYPES = require('tedious').TYPES;
	
	function executeStatement3() {
	//TODO
	}

