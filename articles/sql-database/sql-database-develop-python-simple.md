<properties
	pageTitle="Connect to SQL Database by using Python | Microsoft Azure"
	description="Presents a Python code sample you can use to connect to Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="meet-bhagdev"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="drivers"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="10/05/2016"
	ms.author="meetb"/>


# Connect to SQL Database by using Python


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)] 


This topic shows how to connect and query an Azure SQL Database using Python. You can run this sample from Windows, Ubuntu Linux, or Mac platforms.


## Step 1: Create a SQL database

See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. Once you create your database make sure you enable access to your IP address by enabling the firewall rules as described in the [getting started page](sql-database-get-started.md)

## Step 2: Configure Development Environment

### **Mac OS**   
### Install the required modules
Open your terminal and install

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    brew install FreeTDS
    sudo -H pip install pymssql=2.1.1

### **Linux (Ubuntu)**

Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **FreeTDS** and **pymssql**. pymssql uses FreeTDS to connect to SQL Databases.

	sudo apt-get --assume-yes update
	sudo apt-get --assume-yes install freetds-dev freetds-bin
	sudo apt-get --assume-yes install python-dev python-pip
	sudo pip install pymssql=2.1.1
	
### **Windows**

Install pymssql from [**here**](http://www.lfd.uci.edu/~gohlke/pythonlibs/#pymssql). 

Make sure you choose the correct whl file. For example: If you are using Python 2.7 on a 64 bit machine choose : pymssql‑2.1.1‑cp27‑none‑win_amd64.whl. Once you download the .whl file place it in the C:/Python27 folder.

Now install the pymssql driver using pip from command line. cd into C:/Python27 and run the following
	
	pip install pymssql‑2.1.1‑cp27‑none‑win_amd64.whl

Instructions to enable the use pip can be found [here](http://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows)

## Step 3: Run sample code

Create a file called **sql_sample.py** and paste the following code inside it. You can run this from the command line using:
	
	python sql_sample.py

### Connect to your SQL Database

The [pymssql.connect](http://pymssql.org/en/latest/ref/pymssql.html) function is used to connect to SQL Database.

	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')


### Execute an SQL SELECT statement

The [cursor.execute](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.execute) function can be used to retrieve a result set from a query against SQL Database. This function essentially accepts any query and returns a result set that can be iterated over with the use of [cursor.fetchone()](http://pymssql.org/en/latest/ref/pymssql.html#pymssql.Cursor.fetchone).


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute('SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;')
	row = cursor.fetchone()
	while row:
	    print str(row[0]) + " " + str(row[1]) + " " + str(row[2]) 	
	    row = cursor.fetchone()


### Insert a row, pass parameters, and retrieve the generated primary key

In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. 


	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express', 'SQLEXPRESS', 0, 0, CURRENT_TIMESTAMP)")
	row = cursor.fetchone()
	while row:
	    print "Inserted Product ID : " +str(row[0])
	    row = cursor.fetchone()


### Transactions


This code example demonstrates the use of transactions in which you:

* Begin a transaction
* Insert a row of data
* Rollback your transaction to undo the insert 

Paste the following code inside sql_sample.py.
	
	import pymssql
	conn = pymssql.connect(server='yourserver.database.windows.net', user='yourusername@yourserver', password='yourpassword', database='AdventureWorks')
	cursor = conn.cursor()
	cursor.execute("BEGIN TRANSACTION")
	cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express New', 'SQLEXPRESS New', 0, 0, CURRENT_TIMESTAMP)")
	cnxn.rollback()

## Next steps

* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft Python Driver for SQL Server](https://msdn.microsoft.com/library/mt652092.aspx)
* Visit the [Python Developer Center](/develop/python/).

## Additional resources 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)
