---
title: Use Node.js to query a database
description: How to use Node.js to create a program that connects to an Azure SQL database and query it using T-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.devlang: nodejs
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: v-masebo
ms.date: 03/25/2019
ms.custom: seo-javascript-september2019, seo-javascript-october2019
---
# Quickstart: Use Node.js to query an Azure SQL database

In this quickstart, you use Node.js to connect to an Azure SQL database and use T-SQL statements to query data.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An [Azure SQL database](sql-database-single-database-get-started.md)
- [Node.js](https://nodejs.org)-related software

  # [macOS](#tab/macos)

  Install Homebrew and Node.js, then install the ODBC driver and SQLCMD using steps **1.2** and **1.3** in [Create Node.js apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/node/mac/).

  # [Ubuntu](#tab/ubuntu)

  Install Node.js, then install the ODBC driver and SQLCMD using steps **1.2** and **1.3** in [Create Node.js apps using SQL Server on Ubuntu](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu/).

  # [Windows](#tab/windows)

  Install Chocolatey and Node.js, then install the ODBC driver and SQLCMD using steps **1.2** and **1.3** in [Create Node.js apps using SQL Server on Windows](https://www.microsoft.com/sql-server/developer-get-started/node/windows/).

  ---

> [!IMPORTANT]
> The scripts in this article are written to use the **Adventure Works** database.

> [!NOTE]
> You can optionally choose to use an Azure SQL managed instance.
>
> To create and configure, use the [Azure Portal](sql-database-managed-instance-get-started.md), [PowerShell](scripts/sql-database-create-configure-managed-instance-powershell.md), or [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44), then setup [on-site](sql-database-managed-instance-configure-p2s.md) or [VM](sql-database-managed-instance-configure-vm.md) connectivity.
>
> To load data, see [restore with BACPAC](sql-database-import.md) with the [Adventure Works](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works) file, or see [restore the Wide World Importers database](sql-database-managed-instance-get-started-restore.md).

## Get SQL server connection information

Get the connection information you need to connect to the Azure SQL database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Go to the **SQL databases**  or **SQL managed instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a single database or the fully qualified server name next to **Host** for a managed instance. To copy the server name or host name, hover over it and select the **Copy** icon. 

## Create the project

Open a command prompt and create a folder named *sqltest*. Open the folder you created and run the following command:

  ```bash
  npm init -y
  npm install tedious
  ```

## Add code to query database

1. In your favorite text editor, create a new file, *sqltest.js*.

1. Replace its contents with the following code. Then add the appropriate values for your server, database, user, and password.

    ```js
    const { Connection, Request } = require("tedious");

    // Create connection to database
    const config = {
      authentication: {
        options: {
          userName: "username", // update me
          password: "password" // update me
        },
        type: "default"
      },
      server: "your_server.database.windows.net", // update me
      options: {
        database: "your_database", //update me
        encrypt: true
      }
    };

    const connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
      if (err) {
        console.error(err.message);
      } else {
        queryDatabase();
      }
    });

    function queryDatabase() {
      console.log("Reading rows from the Table...");

      // Read all rows from table
      const request = new Request(
        `SELECT TOP 20 pc.Name as CategoryName,
                       p.name as ProductName
         FROM [SalesLT].[ProductCategory] pc
         JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`,
        (err, rowCount) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`${rowCount} row(s) returned`);
          }
        }
      );

      request.on("row", columns => {
        columns.forEach(column => {
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
