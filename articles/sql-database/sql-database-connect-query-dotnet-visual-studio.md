---
title: Use Visual Studio and .NET to query Azure SQL Database | Microsoft Docs
description: Use Visual Studio to create an app that connects to an Azure SQL Database and queries it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: dotnet
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer: 
manager: craigg
ms.date: 12/11/2018
---
# Quickstart: Use .NET (C#) with Visual Studio to connect and query an Azure SQL database

This quickstart demonstrates how to use the [.NET framework](https://www.microsoft.com/net/) to create a C# app with Visual Studio, connect to an Azure SQL database, and use Transact-SQL statements to query data.

## Prerequisites

To complete this quickstart, make sure you have the following:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you use for this quickstart.

- An installation of [Visual Studio 2017](https://www.visualstudio.com/downloads/), Community, Professional, or Enterprise edition.

## Get SQL server connection information

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

If you need to use ADO.NET to connect to your database:

1. On the database **Overview** page, select **Show database connection strings**. Or, in the left menu, select **Connection strings**.  
   
1. On the **Connection strings** page, copy the appropriate connection string from the **ADO.NET** tab. 

   ![ADO.NET connection string](./media/sql-database-connect-query-dotnet/adonet-connection-string.png)

> [!IMPORTANT]
> You must have a firewall rule in place for the public IP address of the computer on which you perform this tutorial. If you are on a different computer or have a different public IP address, create a [server-level firewall rule using the Azure portal](sql-database-get-started-portal-firewall.md). 
>
  
> [!TIP]
> You can also connect an Azure SQL database to Visual Studio by selecting **Connect with** > **Visual Studio** on the portal database page, and then selecting **Open in Visual Studio**. 
  
## Create a new Visual Studio project

1. In Visual Studio, select **File** > **New** > **Project**. 
2. In the **New Project** dialog, select **Visual C#**, and then select **Console App (.NET Framework)**.
4. Enter *sqltest* for the project name, and then select **OK**. The new project opens in **Solution Explorer**.
4. In **Solution Explorer**, right-click **sqltest** and select **Manage NuGet Packages**. 
5. On the NuGet page, select the **Browse** tab, then search for and select **System.Data.SqlClient**.
6. On the **System.Data.SqlClient** page, select **Install**. If prompted, select **OK** to continue with the installation. 
7. When the install completes, you can close the NuGet window. If a **License Acceptance** window appears, select **I Accept**.

## Create code to query the Azure SQL database

Replace the contents of **Program.cs** with the following code. Substitute the appropriate values for your \<server>, \<username>, \<password>, and \<database>.

>[!IMPORTANT]
>The code in this example uses the sample AdventureWorksLT data, which you can choose as source when creating your database. If your database has different data, use tables from your own database in the SELECT query. 

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
                builder.DataSource = "<server>.database.windows.net"; 
                builder.UserID = "<username>";            
                builder.Password = "<password>";     
                builder.InitialCatalog = "<database>";

                using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                {
                    Console.WriteLine("\nQuery data example:");
                    Console.WriteLine("=========================================\n");
                    
                    connection.Open();       
                    StringBuilder sb = new StringBuilder();
                    sb.Append("SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName ");
                    sb.Append("FROM [SalesLT].[ProductCategory] pc ");
                    sb.Append("JOIN [SalesLT].[Product] p ");
                    sb.Append("ON pc.productcategoryid = p.productcategoryid;");
                    String sql = sb.ToString();

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
            Console.ReadLine();
        }
    }
}
```

## Run the code

1. Select **Debug** > **Start Debugging**, or select **Start** on the toolbar, or press **F5** to run the app.
2. Verify that the top 20 Category/Product rows from your database are returned, and then close the app window.

## Next steps

- Learn how to [connect and query an Azure SQL database using .NET core](sql-database-connect-query-dotnet-core.md) on Windows/Linux/macOS.  
- Learn about [Getting started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli).
- Learn how to [Design your first Azure SQL database using SSMS](sql-database-design-first-database.md) or [Design your first Azure SQL database using .NET](sql-database-design-first-database-csharp.md).
- For more information about .NET, see [.NET documentation](https://docs.microsoft.com/dotnet/).
- Retry logic example: [Connect resiliently to SQL with ADO.NET][step-4-connect-resiliently-to-sql-with-ado-net-a78n]


<!-- Link references. -->

[step-4-connect-resiliently-to-sql-with-ado-net-a78n]: https://docs.microsoft.com/sql/connect/ado-net/step-4-connect-resiliently-to-sql-with-ado-net

