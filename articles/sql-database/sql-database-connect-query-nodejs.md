---
title: Use Node.js to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use node.js core to create a program that connects to an Azure SQL Database and query it using Transact-SQL.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 53f70e37-5eb4-400d-972e-dd7ea0caacd4
ms.service: sql-database
ms.custom: mvc,develop apps
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 07/05/2017
ms.author: carlrab

---
# Azure SQL Database: Use Node.js to connect and query an Azure SQL database

This quick start tutorial emonstrates how to use [Node.js](https://nodejs.org/en/) to create a program to connect to an Azure SQL database and query data using Transact-SQL statements to query data.

## Prerequisites

To complete this quick start tutorial, make sure you have the following:

- An Azure SQL database. This quick start uses the resources created in one of these quick starts: 

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)
   - [Create DB - PowerShell](sql-database-get-started-powershell.md)

- A [server-level firewall rule](sql-database-get-started-portal.md#create-a-server-level-firewall-rule) for the public IP address of the computer you use for this quick start tutorial.
- You have installed Node.js and related software for your operating system.
    - **MacOS**: Install Homebrew and Node.js, and then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/mac/)
    - **Ubuntu**: Install Node.js, and then install the ODBC driver and SQLCMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/ubuntu/) 
    - **Windows**: Install Chocolatey and Node.js, and then install the ODBC driver and SQL CMD. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/node/windows/)

## SQL server connection information

Get the connection information needed to connect to the Azure SQL database. You will need the fully qualified server name, database name, and login information in the next procedures.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. On the **Overview** page for your database, review the fully qualified server name as shown in the following image. You can hover over the server name to bring up the **Click to copy** option. 

   ![server-name](./media/sql-database-connect-query-dotnet/server-name.png) 

4. If you have forgotten the login information for your Azure SQL Database server, navigate to the SQL Database server page to view the server admin name and, if necessary, reset the password.

> [!IMPORTANT]
> You must have a firewall rule in place for the public IP address of the computer on which you perform this tutorial. If you are on a different computer or have a different public IP address, create a [server-level firewall rule using the Azure portal](sql-database-get-started-portal.md#create-a-server-level-firewall-rule). 

## Create a Node.js project

Open a command prompt and create a folder named *sqltest*. Navigate to the folder you created and run the following command:

    ```js
    npm init -y
    npm install tedious
    npm install async
    ```

## Insert code to query SQL database

1. In your development environment or favorite text editor, create a new file, **sqltest.js**.

2. Replace the contents with the following code and add the appropriate values for your server, database, user, and password.

```js
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = {
  userName: 'your_username', // update me
  password: 'your_password', // update me
  server: 'your_server.database.windows.net', // update me
  options: {
      database: 'your_database' //update me
      , encrypt: true
  }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
    if (err) {
        console.log(err)
    }
    else{
        queryDatabase()
    }
});

function queryDatabase(){
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid",
        function(err, rowCount, rows) {
            console.log(rowCount + ' row(s) returned');
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

## Run the code

1. At the command prompt, run the following commands:

   ```js
   node sqltest.js
   ```

2. Verify that the top 20 rows are returned and then close the application window.

## Next Steps
- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Microsoft Node.js Driver for SQL Server](https://docs.microsoft.com/sql/connect/node-js/node-js-driver-for-sql-server/)
- [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- [Connect and query with Visual Studio Code](sql-database-connect-query-vscode.md).


