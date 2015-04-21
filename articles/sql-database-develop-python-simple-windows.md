<properties 
	pageTitle="Connect to SQL Database by using Python on Windows" 
	description="Presents a Python code sample you can use to connect to Azure SQL Database from a Windows client. The sample uses the pyodbc driver."
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="04/18/2015" 
	ms.author="genemi"/>


# Connect to SQL Database by using Python on Windows


<!--
2015-04-18
Original content written by Meet Bhagdev, then edited by GeneMi.
-->


This topic presents a code sample written in Python. The sample runs on a Windows computer. The sample and connects to Azure SQL Database by using the **pyodbc** driver.


## Requirements


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/)


### Install the required modules


Navigate to the directory **C:\Python27\Scripts**, and then run the following command.


	pip install --allow-external pyodbc --allow-unverified pyodbc pyodbc


### Create a database and retrieve your connection string


See the [Get Started topic](sql-database-get-started.md) to learn how to create a sample database and retrieve your connection string. It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. 


## Connect to your SQL Database


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourservername.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor())


<!--
TODO: Again, Does Python allow you to somehow split a very long line of code into multiple lines, for better display?
-->


## Execute an SQL SELECT


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


## Insert a row, pass parameters, and retrieve the generated primary key


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


## Transactions


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute("BEGIN TRANSACTION")
	cursor.execute("DELETE FROM test WHERE value = 1;")
	cnxn.rollback()


<!--
TODO: Hmm, could we just as easily issue another cursor.execute('ROLLBACK TRNASACTION;')?
If so, perhaps we should at least include a sentence explaining that the option is viable?
-->


## Stored procedures


We are using the **pyodbc** driver to connect to SQL Database. As of April 2015 this driver has the limitation of not supporting output parameters from a stored procedure. Therefore we execute a stored procedure that returns information in the form of a results set of rows. In the Transact-SQL source code for the stored procedure, near the end there is an SQL SELECT statement to generate and emit the results set.



<!--
TODO: I commented out these next sentences because they seem false. For example, I would expect that the Python program could issue a Transact-SQL string for a CREATE PROCEDURE statement, just as the Python program can issue an INSERT statement. Right?
.
Additionally you will have to use a database management tool such as SSMS to create your stored procedure. There is no way to create a stored procedure using pyodbc.
-->


<!--
TODO: Does AdventureWorks db have any stored procedure that returns a results set?
Or can we use a regular system stored procedure that is a native part of SQL Database, maybe like sys.sp_helptext !
-->


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute("execute sys.sp_helptext 'SalesLT.vGetAllCategories';")

