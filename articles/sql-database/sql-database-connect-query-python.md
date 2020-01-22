---
title: 'Quickstart: Use Python to query an Azure SQL database'
description: This topic shows you how to use Python to create a program that connects to an Azure SQL database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: seo-python-october2019
ms.devlang: python
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/25/2019
---
# Quickstart: Use Python to query an Azure SQL database

This article demonstrates how to use Python to connect to an Azure SQL database and use Transact-SQL statements to query data.

## Prerequisites

To complete this sample, make sure you have the following:

- Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

- Azure SQL database - [create and configure a database](sql-database-single-database-get-started.md)

  > [!NOTE]
  > To use managed instances, create an instance using the Azure [Portal](sql-database-managed-instance-get-started.md), [PowerShell](scripts/sql-database-create-configure-managed-instance-powershell.md), or [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44), and configure connectivity using a [VM](sql-database-managed-instance-configure-vm.md) or [on-site](sql-database-managed-instance-configure-p2s.md).
  >
  > To load data, see [restore Wide World Importers](sql-database-managed-instance-get-started-restore.md) or [restore with BACPAC](sql-database-import.md) using the [Adventure Works](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works) file.
  
- [Python](https://python.org) and related software

  # [macOS](#tab/macos)

  Install Homebrew and Python, the ODBC driver and SQLCMD, and the Python driver for SQL Server using steps **1.2**, **1.3**, and **2.1** in [create Python apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/python/mac/).

  # [Ubuntu](#tab/ubuntu)
  Install Python and other required packages with `sudo apt-get install python python-pip gcc g++ build-essential`.

  Install the ODBC driver, SQLCMD, and the Python driver for SQL Server, see [configure a development environment for pyodbc Python development](/sql/connect/python/pyodbc/step-1-configure-development-environment-for-pyodbc-python-development#linux).
  # [Windows](#tab/windows)
  Install Python, the ODBC driver and SQLCMD, and the Python driver for SQL Server, see [configure a development environment for pyodbc Python development](/sql/connect/python/pyodbc/step-1-configure-development-environment-for-pyodbc-python-development#windows).
  ---

  For further information, see [Microsoft ODBC Driver](/sql/connect/odbc/microsoft-odbc-driver-for-sql-server) or [Microsoft ODBC Driver on Linux and macOS](/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server).

  For SDK details, see the [reference documentation](/python/api/overview/azure/sql), the [pyodbc repository](https://github.com/mkleehammer/pyodbc/wiki/), and a [pyodbc sample](https://github.com/mkleehammer/pyodbc/wiki/Getting-started).

> [!IMPORTANT]
> The scripts in this article are written to use the **Adventure Works** database.

## Get SQL server connection information

Get the connection information you need to connect to the Azure SQL database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Go to the **SQL databases**  or **SQL managed instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a single database or the fully qualified server name next to **Host** for a managed instance. To copy the server name or host name, hover over it and select the **Copy** icon.

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

