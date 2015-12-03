<properties
	pageTitle="Connect to SQL Database by using Python with pymssql on Ubuntu"
	description="Presents a Python code sample you can use to connect to Azure SQL Database. The sample runs on an Ubuntu Linux client computer."
	services="sql-database"
	documentationCenter=""
	authors="meet-bhagdev"
	manager="jeffreyg"
	editor="genemi"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="11/23/2015"
	ms.author="meetb"/>


# Connect to SQL Database by using Python on Ubuntu Linux


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a Python code sample that run on an Ubuntu Linux client computer, to connect to an Azure SQL Database database.


## Prerequisites


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/).


### Install the required modules


Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **FreeTDS** and **pymssql**. pymssql uses FreeTDS to connect to SQL Databases.

	sudo apt-get --assume-yes update
	sudo apt-get --assume-yes install freetds-dev freetds-bin
	sudo apt-get --assume-yes install python-dev python-pip
	sudo pip install pymssql


### A SQL database

See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**.

## Step 1: Get Connection Details

[AZURE.INCLUDE [sql-database-include-connection-string-details-20-portalshots](../../includes/sql-database-include-connection-string-details-20-portalshots.md)]


## Step 2:  Connect

!!!!!sql-database-include-connection-string-details-20-portalshots.md

The [pymssql.connect](http://pymssql.org/en/latest/ref/pymssql.html) function is used to connect to SQL Database.

	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')


## Step 3: Execute a query

The [cursor.execute](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.execute) function can be used to retrieve a result set from a query against SQL Database. This function essentially accepts any query and returns a result set which can be iterated over with the use of [cursor.fetchone()](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.fetchone).


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


## Step 4:  Insert a row

In this example you will see how to execute an [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) statement safely, pass parameters which protect your application from [SQL injection](https://technet.microsoft.com/library/ms161953(v=sql.105).aspx) vulnerability, and retrieve the auto-generated [Primary Key](https://msdn.microsoft.com/library/ms179610.aspx) value.  


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


## Step 5:  Rollback a transaction


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

## Further reading

For more information, see the [Python Developer Center](/develop/python/).
