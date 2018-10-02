---
title: Use Python to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use Python to create a program that connects to an Azure SQL Database and query it using Transact-SQL statements.
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
ms.date: 07/02/2018
---
# Use Python to query an Azure SQL database

 This quickstart demonstrates how to use [Python](https://python.org) to connect to an Azure SQL database and use Transact-SQL statements to query data. For further sdk details, checkout our [reference](https://docs.microsoft.com/python/api/overview/azure/sql) documentation, a pyodbc [sample](https://github.com/mkleehammer/pyodbc/wiki/Getting-started), and the [pyodbc](https://github.com/mkleehammer/pyodbc/wiki/) GitHub repository.

## Prerequisites

To complete this quickstart, make sure you have the following:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you use for this quickstart.

- You have installed Python and related software for your operating system:

    - **MacOS**: Install Homebrew and Python, install the ODBC driver and SQLCMD, and then install the Python Driver for SQL Server. See [Steps 1.2, 1.3, and 2.1](https://www.microsoft.com/sql-server/developer-get-started/python/mac/).
    - **Ubuntu**:  Install Python and other required packages, and then install the Python Driver for SQL Server. See [Steps 1.2, 1.3, and 2.1](https://www.microsoft.com/sql-server/developer-get-started/python/ubuntu/).
    - **Windows**: Install the newest version of Python (environment variable is now configured for you), install the ODBC driver and SQLCMD, and then install the Python Driver for SQL Server. See [Step 1.2, 1.3, and 2.1](https://www.microsoft.com/sql-server/developer-get-started/python/windows/). 

## SQL server connection information

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]
    
## Insert code to query SQL database 

1. In your favorite text editor, create a new file, **sqltest.py**.  

2. Replace the contents with the following code and add the appropriate values for your server, database, user, and password.

```Python
import pyodbc
server = 'your_server.database.windows.net'
database = 'your_database'
username = 'your_username'
password = 'your_password'
driver= '{ODBC Driver 13 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid")
row = cursor.fetchone()
while row:
    print (str(row[0]) + " " + str(row[1]))
    row = cursor.fetchone()
```

## Run the code

1. At the command prompt, run the following commands:

   ```Python
   python sqltest.py
   ```

2. Verify that the top 20 rows are returned and then close the application window.

## Next steps

- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Microsoft Python Drivers for SQL Server](https://docs.microsoft.com/sql/connect/python/python-driver-for-sql-server/)
- [Python Developer Center](https://azure.microsoft.com/develop/python/?v=17.23h)

