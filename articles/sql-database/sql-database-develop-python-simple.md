---
title: Connect to SQL Database by using Python | Microsoft Docs
description: Presents a Python code sample you can use to connect to Azure SQL Database.
services: sql-database
documentationcenter: ''
author: meet-bhagdev
manager: jhubbard
editor: ''

ms.assetid: 452ad236-7a15-4f19-8ea7-df528052a3ad
ms.service: sql-database
ms.custom: development
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 02/03/2017
ms.author: meetb

---
# Connect to SQL Database by using Python
[!INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]

This topic shows how to connect and query an Azure SQL Database using Python. You can run this sample from Windows, Ubuntu Linux, or Mac platforms.

## Step 1: Create a SQL database
See the [getting started page](sql-database-get-started.md) to learn how to create a sample database.  It is important you follow the guide to create an **AdventureWorks database template**. The samples shown below only work with the **AdventureWorks schema**. Once you create your database make sure you enable access to your IP address by enabling the firewall rules as described in the [getting started page](sql-database-get-started.md)

## Step 2: Configure Development Environment
### **Mac OS**
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **brew**, **Microsoft ODBC Driver for Mac** and **pyodbc**. pyodbc uses the Microsoft ODBC Driver on Linux to connect to SQL Databases.

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew tap microsoft/msodbcsql https://github.com/Microsoft/homebrew-msodbcsql
brew update
brew install msodbcsql 
#for silent install ACCEPT_EULA=y brew install msodbcsql
sudo pip install pyodbc==3.1.1
```

### **Linux (Ubuntu)**
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install the **Microsoft ODBC Driver for Linux** and **pyodbc**. pyodbc uses the Microsoft ODBC Driver on Linux to connect to SQL Databases.

```
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql.list
exit
sudo apt-get update
sudo apt-get install msodbcsql mssql-tools unixodbc-dev-utf16
sudo pip install pyodbc==3.1.1
```

### **Windows**
Install the [Microsoft ODBC Driver 13.1](https://www.microsoft.com/en-us/download/details.aspx?id=53339). pyodbc uses the Microsoft ODBC Driver on Linux to connect to SQL Databases. 

Then install pyodbc using pip

```
pip install pyodbc==3.1.1
```

Instructions to enable the use pip can be found [here](http://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows)

## Step 3: Run sample code
Create a file called **sql_sample.py** and paste the following code inside it. You can run this from the command line using:

```
python sql_sample.py
```

### Connect to your SQL Database
The [pyodbc.connect](https://mkleehammer.github.io/pyodbc/api-connection.html) function is used to connect to SQL Database.

```
import pyodbc
server = 'yourserver.database.windows.net'
database = 'yourdatabase'
username = 'yourusername'
password = 'yourpassword'
driver= '{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("select @@VERSION")
row = cursor.fetchone()
if row:
    print row
```

### Execute an SQL SELECT statement
The [cursor.execute](https://mkleehammer.github.io/pyodbc/api-cursor.html) function can be used to retrieve a result set from a query against SQL Database. This function essentially accepts any query and returns a result set that can be iterated over with the use of [cursor.fetchone()](https://mkleehammer.github.io/pyodbc/api-cursor.html).

```
import pyodbc
server = 'yourserver.database.windows.net'
database = 'yourdatabase'
username = 'yourusername'
password = 'yourpassword'
driver= '{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("select @@VERSION")
row = cursor.fetchone()
while row:
    print str(row[0]) + " " + str(row[1]) + " " + str(row[2])
    row = cursor.fetchone()
```

### Insert a row, pass parameters, and retrieve the generated primary key
In SQL Database the [IDENTITY](https://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](https://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key](https://msdn.microsoft.com/library/ms179610.aspx) values. 

```
import pyodbc
server = 'yourserver.database.windows.net'
database = 'yourdatabase'
username = 'yourusername'
password = 'yourpassword'
driver= '{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("select @@VERSION")
row = cursor.fetchone()
while row:
    print "Inserted Product ID : " +str(row[0])
    row = cursor.fetchone()
```

### Transactions
This code example demonstrates the use of transactions in which you:

* Begin a transaction
* Insert a row of data
* Rollback your transaction to undo the insert 

Paste the following code inside sql_sample.py.

```
import pyodbc
server = 'yourserver.database.windows.net'
database = 'yourdatabase'
username = 'yourusername'
password = 'yourpassword'
driver= '{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("BEGIN TRANSACTION")
cursor.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES ('SQL Server Express New', 'SQLEXPRESS New', 0, 0, CURRENT_TIMESTAMP)")
cnxn.rollback()
```

## Next steps
* Review the [SQL Database Development Overview](sql-database-develop-overview.md)
* More information on the [Microsoft Python Driver for SQL Server](https://docs.microsoft.com/sql/connect/python/python-driver-for-sql-server/)
* Visit the [Python Developer Center](/develop/python/).

## Additional resources
* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/)
