---
title: Use Python to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use Python to create a program that connects to an Azure SQL database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: python
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 12/10/2018
---
# Quickstart: Use Python to query an Azure SQL database

 This quickstart demonstrates how to use [Python](https://python.org) to connect to an Azure SQL database and use Transact-SQL statements to query data. For further SDK details, check out our [reference](https://docs.microsoft.com/python/api/overview/azure/sql) documentation, the [pyodbc GitHub repository](https://github.com/mkleehammer/pyodbc/wiki/), and a [pyodbc sample](https://github.com/mkleehammer/pyodbc/wiki/Getting-started).

## Prerequisites

To complete this quickstart, make sure you have the following:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]
  
- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you use for this quickstart.
  
- Python and related software for your operating system:
  
  - **MacOS**: Install Homebrew and Python, install the ODBC driver and SQLCMD, and then install the Python driver for SQL Server. See Steps 1.2, 1.3, and 2.1 in [Create Python apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/python/mac/). For more information, see [Install the Microsoft ODBC Driver on Linux and macOS](https://docs.microsoft.com/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server).
    
  - **Ubuntu**: Install Python and other required packages with `sudo apt-get install python python-pip gcc g++ build-essential`. Download and install the ODBC driver, SQLCMD, and the Python driver for SQL Server. For instructions, see [Configure a development environment for pyodbc Python development](/sql/connect/python/pyodbc/step-1-configure-development-environment-for-pyodbc-python-development#linux).
    
  - **Windows**: Install Python, the ODBC driver and SQLCMD, and the Python driver for SQL Server. For instructions, see [Configure a development environment for pyodbc Python development](/sql/connect/python/pyodbc/step-1-configure-development-environment-for-pyodbc-python-development#windows).

## Get SQL server connection information

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]
    
## Create code to query your SQL database 

1. In a text editor, create a new file named *sqltest.py*.  
   
1. Add the following code. Substitute your own values for \<server>, \<database>, \<username>, and \<password>.
   
   >[!IMPORTANT]
   >The code in this example uses the sample AdventureWorksLT data, which you can choose as source when creating your database. If your database has different data, use tables from your own database in the SELECT query. 
   
   ```python
   import pyodbc
   server = '<server>.database.windows.net'
   database = '<database>'
   username = '<username>'
   password = '<password>'
   driver= '{ODBC Driver 17 for SQL Server}'
   cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
   cursor = cnxn.cursor()
   cursor.execute("SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid")
   row = cursor.fetchone()
   while row:
       print (str(row[0]) + " " + str(row[1]))
       row = cursor.fetchone()
   ```
   

## Run the code

1. At a command prompt, run the following command:

   ```cmd
   python sqltest.py
   ```

1. Verify that the top 20 Category/Product rows are returned, then close the command window.

## Next steps

- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Microsoft Python drivers for SQL Server](https://docs.microsoft.com/sql/connect/python/python-driver-for-sql-server/)
- [Python developer center](https://azure.microsoft.com/develop/python/?v=17.23h)

