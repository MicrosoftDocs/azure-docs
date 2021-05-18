---
title: Use Visual Studio with .NET and C# to query
description: Use Visual Studio to create a C# app that connects to a database in Azure SQL Database or Azure SQL Managed Instance and runs queries.
titleSuffix: Azure SQL Database & SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: "devx-track-csharp, sqldbrb=2"
ms.devlang: dotnet
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 08/10/2020
---
# Quickstart: Use .NET and C# in Visual Studio to connect to and query a database
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi-asa.md)]

This quickstart shows how to use the [.NET Framework](https://dotnet.microsoft.com) and C# code in Visual Studio to query a database in Azure SQL or Synapse SQL with Transact-SQL statements.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- [Visual Studio 2019](https://www.visualstudio.com/downloads/) Community, Professional, or Enterprise edition.
- A database where you can run a query.

  [!INCLUDE[create-configure-database](../includes/create-configure-database.md)]

## Create code to query the database in Azure SQL Database

1. In Visual Studio, create a new project. 
   
1. In the **New Project** dialog, select the **Visual C#**, **Console App (.NET Framework)**.
   
1. Enter *sqltest* for the project name, and then select **OK**. The new project is created. 
   
1. Select **Project** > **Manage NuGet Packages**. 
   
1. In **NuGet Package Manager**, select the **Browse** tab, then search for and select **Microsoft.Data.SqlClient**.
   
1. On the **Microsoft.Data.SqlClient** page, select **Install**. 
   - If prompted, select **OK** to continue with the installation. 
   - If a **License Acceptance** window appears, select **I Accept**.
   
1. When the install completes, you can close **NuGet Package Manager**. 
   
1. In the code editor, replace the **Program.cs** contents with the following code. Replace your values for `<your_server>`, `<your_username>`, `<your_password>`, and `<your_database>`.
   
   ```csharp
   using System;
   using Microsoft.Data.SqlClient;
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
                   builder.DataSource = "<your_server>.database.windows.net"; 
                   builder.UserID = "<your_username>";            
                   builder.Password = "<your_password>";     
                   builder.InitialCatalog = "<your_database>";
   
                   using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                   {
                       Console.WriteLine("\nQuery data example:");
                       Console.WriteLine("=========================================\n");
                       
                       String sql = "SELECT name, collation_name FROM sys.databases";
   
                       using (SqlCommand command = new SqlCommand(sql, connection))
                       {
                           connection.Open();
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
               Console.ReadLine();
           }
       }
   }
   ```

## Run the code

1. To run the app, select **Debug** > **Start Debugging**, or select **Start** on the toolbar, or press **F5**.
1. Verify that the database names and collations are returned, and then close the app window.

## Next steps

- Learn how to [connect and query a database in Azure SQL Database by using .NET Core](connect-query-dotnet-core.md) on Windows/Linux/macOS.  
- Learn about [Getting started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli).
- Learn how to [Design your first database in Azure SQL Database by using SSMS](design-first-database-tutorial.md) or [Design your first database in Azure SQL Database by using .NET](design-first-database-csharp-tutorial.md).
- For more information about .NET, see [.NET documentation](/dotnet/).
- Retry logic example: [Connect resiliently to Azure SQL with ADO.NET][step-4-connect-resiliently-to-sql-with-ado-net-a78n].


<!-- Link references. -->

[step-4-connect-resiliently-to-sql-with-ado-net-a78n]: /sql/connect/ado-net/step-4-connect-resiliently-sql-ado-net
