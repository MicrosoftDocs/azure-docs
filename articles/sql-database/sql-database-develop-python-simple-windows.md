<properties 
	pageTitle="Connect to SQL Database by using Python on Windows" 
	description="Presents a Python code sample you can use to connect to Azure SQL Database from a Windows client. The sample uses the pymssql driver."
	services="sql-database" 
	documentationCenter="" 
	authors="meet-bhagdev" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="07/20/2015" 
	ms.author="mebha"/>


# Connect to SQL Database by using Python on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a code sample written in Python. The sample runs on a Windows computer. The sample and connects to Azure SQL Database by using the **pymssql** driver.


## Requirements


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/)


### Install the required modules


Install [pymssql](http://www.lfd.uci.edu/~gohlke/pythonlibs/#pymssql). 

Make sure you choose the correct whl file.

For example : If you are using Python 2.7 on a 64 bit machine choose : pymssql‑2.1.1‑cp27‑none‑win_amd64.whl.
Once you download the .whl file place it in the the C:/Python27 folder.

Now install the pymssql driver using pip from command line. cd into C:/Python27 and run the following
	
	pip install pymssql‑2.1.1‑cp27‑none‑win_amd64.whl

Instructions to enable the use pip can be found [here](http://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows)


## Create a database and retrieve your connection string


See the [Getting Started Topic](sql-database-get-started.md) to learn how to create a sample database and retrieve your connection string. It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. 


## Connect to your SQL Database


The [pymssql.connect](http://pymssql.org/en/latest/ref/pymssql.html) function is used to connect to SQL Database.

	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')


## Execute an SQL SELECT statement

The [cursor.execute](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.execute) function can be used to retrieve a result set from a query against SQL Database. This function essentially accepts any query and returns a result set which can be iterated over with the use of [cursor.fetchone()](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.fetchone).


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


## Insert a row, pass parameters, and retrieve the generated primary key

In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. 


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


## Transactions


This code example demonstrates the use of transactions in which you:


-Begin a transaction

-Insert a row of data

-Rollback your transaction to undo the insert


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("BEGIN TRANSACTION")
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express New', 'SQLEXPRESS New', 0, 0, CURRENT_TIMESTAMP)")
	cnxn.rollback()

 
