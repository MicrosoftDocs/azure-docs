<properties 
	pageTitle="Connect to SQL Database by using Python with pymssql on Ubuntu" 
	description="Presents a Python code sample you can use to connect to Azure SQL Database. The sample runs on an Unbutu Linux client computer."
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
	ms.date="04/18/2015" 
	ms.author="genemi"/>


# Connect to SQL Database by using Python on Unbutu Linux


<!--
Original author of content is Meet Bhagdev. GeneMi edited and first published.
-->


This topic presents a Python code sample that run on an Unbutu Linux client computer, to connect to an Azure SQL Database database.


## Requirements


- [Python 2.7.6](https://www.python.org/download/releases/2.7.6/).


### Install the required modules


Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **FreeTDS** and **pymssql**.

	sudo apt-get --assume-yes update
	sudo apt-get --assume-yes install freetds-dev freetds-bin
	sudo apt-get --assume-yes install python-dev python-pip
	sudo pip install pymssql


### Create a database and retrieve your connection string


See the [Get Started topic](sql-database-get-started.md) to learn how to create a sample database and retrieve your connection string. It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. 


## Connect to your SQL Database


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')


## Execute an SQL SELECT statement


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


## Insert a row, pass parameters, and retrieve the generated primary key


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


<!--
TODO: The code sample must leave the schema and data in the same state as they were before the sample started. The above INSERT has no matching SQL DELETE.
-->


## Transactions


This code example demonstrates the use of transactions in which you:


- Begin a transaction.
- Insert a row of data.
- Rollback your transaction to undo the insert.


		import pymssql
		conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
		cursor = conn.cursor()
		cursor.execute("BEGIN TRANSACTION")
		cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express New', 'SQLEXPRESS New', 0, 0, CURRENT_TIMESTAMP)")
		cnxn.rollback()


## Stored procedures


<!--
TODO, FIX PROBLEM:
.
This program is not re-runnable. The program needs to clean up after itself, and leave the schema and data in the same state it was before the program started.
.
Can you DROP the stored procedure after it runs?
-->


	with pymssql.connect("yourserver", "yourusername", "yourpassword", "yourdatabase") as conn:
    with conn.cursor(as_dict=True) as cursor:
        cursor.execute("""
        CREATE PROCEDURE FindProductNameName
            @name VARCHAR(100)
        AS BEGIN
            SELECT * FROM Product WHERE Name = @name
        END
        """)
        cursor.callproc('FindPerson', ('Bike'))
        for row in cursor:
            print str(row[0]) + " " + str(row[1]) + " " + str(row[2])

