<properties 
	pageTitle="Connect to SQL Database by using Python on Windows" 
	description="Presents a Python code sample you can use to connect to Azure SQL Database from a Windows client. The sample uses the pyodbc driver."
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
	ms.date="04/27/2015" 
	ms.author="mebha"/>


# Connect to SQL Database by using Python on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a code sample written in Python. The sample runs on a Windows computer. The sample and connects to Azure SQL Database by using the **pyodbc** driver.


## Requirements


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/)


### Install the required modules


Navigate to the directory **C:\Python27\Scripts**, and then run the following command.


	pip install --allow-external pyodbc --allow-unverified pyodbc pyodbc


### Create a database and retrieve your connection string


See the [Get Started topic](sql-database-get-started.md) to learn how to create a sample database and retrieve your connection string. It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. 


## Connect to your SQL Database


The [pyodbc.connect function](https://code.google.com/p/pyodbc/wiki/Module#connect) is used to connect to SQL Database.  


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourservername.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor())


## Execute an SQL SELECT


All SQL statements are executed using the [cursor.execute](https://code.google.com/p/pyodbc/wiki/Cursor#execute) function. If the statement returns rows, such as a select statement, you can retreive them using the Cursor fetch functions ([fetchone](https://code.google.com/p/pyodbc/wiki/Cursor#fetchone), [fetchall](https://code.google.com/p/pyodbc/wiki/Cursor#fetchall), [fetchmany](https://code.google.com/p/pyodbc/wiki/Cursor#fetchmany)). If there are no rows, fetchone will return None; fetchall and fetchmany will both return empty lists.


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


## Insert a row, pass parameters, and retrieve the generated primary key


In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENECE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. In this example you will see how to execute an [insert-statement](https://msdn.microsoft.com/library/ms174335.aspx), safely pass parameters which protects from [SQL injection](https://msdn.microsoft.com/magazine/cc163917.aspx), and retrieve the auto-generated primary key value.  



	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


## Transactions


The [cnxn.rollback](https://code.google.com/p/pyodbc/wiki/Connection#rollback) and [cnxn.commit()](https://code.google.com/p/pyodbc/wiki/Connection#commit) functions are used to handle transactions.


	import pyodbc
	cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=tcp:yourserver.database.windows.net;DATABASE=AdventureWorks;UID=yourusername;PWD=yourpassword')
	cursor = cnxn.cursor()
	cursor.execute("BEGIN TRANSACTION")
	cursor.execute("DELETE FROM test WHERE value = 1;")
	cnxn.rollback()

