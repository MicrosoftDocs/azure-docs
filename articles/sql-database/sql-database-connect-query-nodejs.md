---
title: Use Node.js to query Azure SQL Database | Microsoft Docs
description: How to use Node.js to create a program that connects to an Azure SQL database and query it using T-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.devlang: nodejs
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: v-masebo
manager: craigg
ms.date: 03/25/2019
---
# Quickstart: Use Node.js to query an Azure SQL database

This article demonstrates how to use [Node.js](https://nodejs.org) to connect to an Azure SQL database. You can then use T-SQL statements to query data.

## Prerequisites

To complete this sample, make sure you have the following prerequisites:

- An Azure SQL database. You can use one of these quickstarts to create and then configure a database in Azure SQL Database:

  || Single database | Managed instance |
  |:--- |:--- |:---|
  | Create| [Portal](sql-database-single-database-get-started.md) | [Portal](sql-database-managed-instance-get-started.md) |
  || [CLI](scripts/sql-database-create-and-configure-database-cli.md) | [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) |
  || [PowerShell](scripts/sql-database-create-and-configure-database-powershell.md) | [PowerShell](scripts/sql-database-create-configure-managed-instance-powershell.md) |
  | Configure | [Server-level IP firewall rule](sql-database-server-level-firewall-rule.md)| [Connectivity from a VM](sql-database-managed-instance-configure-vm.md)|
  |||[Connectivity from on-site](sql-database-managed-instance-configure-p2s.md)
  |Load data|Adventure Works loaded per quickstart|[Restore Wide World Importers](sql-database-managed-instance-get-started-restore.md)
  |||Restore or import Adventure Works from [BACPAC](sql-database-import.md) file from [GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)|
  |||

  > [!IMPORTANT]
  > The scripts in this article are written to use the Adventure Works database. With a managed instance, you must either import the Adventure Works database into an instance database or modify the scripts in this article to use the Wide World Importers database.


- Node.js-related software for your operating system:

  - **MacOS**, install Homebrew and Node.js, then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/mac/).
  
  - **Ubuntu**, install Node.js, then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu/).
  
  - **Windows**, install Chocolatey and Node.js, then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/windows/).

## Get SQL server connection information

Get the connection information you need to connect to the Azure SQL database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to the **SQL databases**  or **SQL managed instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a single database or the fully qualified server name next to **Host** for a managed instance. To copy the server name or host name, hover over it and select the **Copy** icon. 

## Create the project

Open a command prompt and create a folder named *sqltest*. Navigate to the folder you created and run the following command:

  ```bash
  npm init -y
  npm install tedious@5.0.3
  npm install async@2.6.2
  ```

## Add code to query database

1. In your favorite text editor, create a new file, *sqltest.js*.

1. Replace its contents with the following code. Then add the appropriate values for your server, database, user, and password.

    ```js
    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;

    // Create connection to database
    var config =
    {
        authentication: {
            options: {
                userName: 'userName', // update me
                password: 'password' // update me
            },
            type: 'default'
        },
        server: 'your_server.database.windows.net', // update me
        options:
        {
            database: 'your_database', //update me
            encrypt: true
        }
    }
    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err)
        {
            if (err)
            {
                console.log(err)
            }
            else
            {
                queryDatabase()
            }
        }
    );

    function queryDatabase()
    {
        console.log('Reading rows from the Table...');

        // Read all rows from table
        var request = new Request(
            "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc "
                + "JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
            function(err, rowCount, rows)
            {
                console.log(rowCount + ' row(s) returned');
                process.exit();
            }
        );

        request.on('row', function(columns) {
            columns.forEach(function(column) {
                console.log("%s\t%s", column.metadata.colName, column.value);
            });
        });
        connection.execSql(request);
    }
    ```

> [!NOTE]
> The code example uses the **AdventureWorksLT** sample database for Azure SQL.

## Run the code

1. At the command prompt, run the program.

    ```bash
    node sqltest.js
    ```

1. Verify the top 20 rows are returned and close the application window.

## Next steps

- [Microsoft Node.js Driver for SQL Server](/sql/connect/node-js/node-js-driver-for-sql-server)

- Connect and query on Windows/Linux/macOS with [.NET core](sql-database-connect-query-dotnet-core.md), [Visual Studio Code](sql-database-connect-query-vscode.md), or [SSMS](sql-database-connect-query-ssms.md) (Windows only)

- [Get started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli)

- Design your first Azure SQL database using [.NET](sql-database-design-first-database-csharp.md) or [SSMS](sql-database-design-first-database.md)
