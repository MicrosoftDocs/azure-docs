---
title: Use .NET Core to connect and query a database
description: This topic shows you how to use .NET Core to create a program that connects to a database in Azure SQL Database, or Azure SQL Managed Instance, and queries it using Transact-SQL statements.
titleSuffix: Azure SQL Database & SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: "sqldbrb=2, devx-track-csharp"
ms.devlang: dotnet
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 05/29/2020
---
# Quickstart: Use .NET Core (C#) to query a database
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi-asa.md)]

In this quickstart, you'll use [.NET Core](https://dotnet.microsoft.com) and C# code to connect to a database. You'll then run a Transact-SQL statement to query data.

> [!TIP]
> The following Microsoft Learn module helps you learn for free how to [Develop and configure an ASP.NET application that queries a database in Azure SQL Database](/learn/modules/develop-app-that-queries-azure-sql/)

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- [.NET Core SDK for your operating system](https://dotnet.microsoft.com/download) installed.
- A database where you can run your query. 

  [!INCLUDE[create-configure-database](../includes/create-configure-database.md)]
  
## Create a new .NET Core project

1. Open a command prompt and create a folder named **sqltest**. Navigate to this folder and run this command.

    ```cmd
    dotnet new console
    ```

    This command creates new app project files, including an initial C# code file (**Program.cs**), an XML configuration file (**sqltest.csproj**), and needed binaries.

2. In a text editor, open **sqltest.csproj** and paste the following XML between the `<Project>` tags. This XML adds `System.Data.SqlClient` as a dependency.

    ```xml
    <ItemGroup>
        <PackageReference Include="System.Data.SqlClient" Version="4.6.0" />
    </ItemGroup>
    ```

## Insert code to query the database in Azure SQL Database

1. In a text editor, open **Program.cs**.

2. Replace the contents with the following code and add the appropriate values for your server, database, username, and password.

> [!NOTE]
> To use an ADO.NET connection string, replace the 4 lines in the code
> setting the server, database, username, and password with the line below. In
> the string, set your username and password.
>
>    `builder.ConnectionString="<your_ado_net_connection_string>";`

```csharp
using System;
using System.Data.SqlClient;
using System.Text;

namespace sqltest
{
    class Program
    {
        static void Main(string[] args)
        {
            try 
            { 
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();

                builder.DataSource = "<your_server.database.windows.net>"; 
                builder.UserID = "<your_username>";            
                builder.Password = "<your_password>";     
                builder.InitialCatalog = "<your_database>";
         
                using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                {
                    Console.WriteLine("\nQuery data example:");
                    Console.WriteLine("=========================================\n");
                    
                    connection.Open();       

                    String sql = "SELECT name, collation_name FROM sys.databases";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Console.WriteLine("{0} {1}", reader.GetString(0), reader.GetString(1));
                            }
                        }
                    }                    
                }
            }
            catch (SqlException e)
            {
                Console.WriteLine(e.ToString());
            }
            Console.WriteLine("\nDone. Press enter.");
            Console.ReadLine(); 
        }
    }
}
```

## Run the code

1. At the prompt, run the following commands.

   ```cmd
   dotnet restore
   dotnet run
   ```

2. Verify that the rows are returned.

   ```text
   Query data example:
   =========================================

   master	SQL_Latin1_General_CP1_CI_AS
   tempdb	SQL_Latin1_General_CP1_CI_AS
   WideWorldImporters	Latin1_General_100_CI_AS

   Done. Press enter.
   ```

3. Choose **Enter** to close the application window.

## Next steps

- [Getting started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli).
- Learn how to [connect and query Azure SQL Database or Azure SQL Managed Instance, by using the .NET Framework and Visual Studio](connect-query-dotnet-visual-studio.md).  
- Learn how to [Design your first database with SSMS](design-first-database-tutorial.md) or [Design a database and connect with C# and ADO.NET](design-first-database-csharp-tutorial.md).
- For more information about .NET, see [.NET documentation](/dotnet/).
