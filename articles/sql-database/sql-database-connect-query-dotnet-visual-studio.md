---
title: Use Visual Studio and .NET to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use Visual Studio to create a program that connects to an Azure SQL Database and query it using Transact-SQL.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: mvc,develop apps
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 07/05/2017
ms.author: carlrab

---
# Use .NET (C#) with Visual Studio to connect and query an Azure SQL database

This quick start tutorial demonstrates how to use the [.NET framework](https://www.microsoft.com/net/) to create a C# program with Visual Studio to connect to an Azure SQL database and query data using Transact-SQL statements to query data.

## Prerequisites

To complete this quick start tutorial, make sure you have the following:

- An Azure SQL database. This quick start uses the resources created in one of these quick starts: 

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)
   - [Create DB - PowerShell](sql-database-get-started-powershell.md)

- A [server-level firewall rule](sql-database-get-started-portal.md#create-a-server-level-firewall-rule) for the public IP address of the computer you use for this quick start tutorial.
- An installation of [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).

## SQL server connection information

Get the connection information needed to connect to the Azure SQL database. You will need the fully qualified server name, database name, and login information in the next procedures.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. On the **Overview** page for your database, review the fully qualified server name as shown in the following image. You can hover over the server name to bring up the **Click to copy** option. 

   ![server-name](./media/sql-database-connect-query-dotnet/server-name.png) 

4. If you forget your Azure SQL Database server login information, navigate to the SQL Database server page to view the server admin name. You can reset the password if necessary.

5. Click **Show database connection strings**.

6. Review the complete **ADO.NET** connection string.

    ![ADO.NET connection string](./media/sql-database-connect-query-dotnet/adonet-connection-string.png)

> [!IMPORTANT]
> You must have a firewall rule in place for the public IP address of the computer on which you perform this tutorial. If you are on a different computer or have a different public IP address, create a [server-level firewall rule using the Azure portal](sql-database-get-started-portal.md#create-a-server-level-firewall-rule). 
>
  
## Create a new Visual Studio project

1. In Visual Studio, choose **File**, **New**, **Project**. 
2. In the **New Project** dialog, and expand **Visual C#**.
3. Select **Console App** and enter *sqltest* for the project name.
4. Click **OK** to create and open the new project in Visual Studio
4. In Solution Explorer, right-click **sqltest** and click **Manage NuGet Packages**. 
5. On the **Browse**, search for ```System.Data.SqlClient``` and, when found, select it.
6. In the **System.Data.SqlClient** page, click **Install**.
7. When the install completes, review the changes and then click **OK** to close the **Preview** window. 
8. If a **License Acceptance** window appears, click **I Accept**.

## Insert code to query SQL database

1. Switch to (or open if necessary) **Program.cs**

2. Replace the contents of **Program.cs** with the following code and add the appropriate values for your server, database, user, and password.

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
                builder.DataSource = "your_server.database.windows.net"; 
                builder.UserID = "your_user";            
                builder.Password = "your_password";     
                builder.InitialCatalog = "your_database";

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

1. Press **F5** to run the application.
2. Verify that the top 20 rows are returned and then close the application window.

## Next steps

- Learn how to [connect and query an Azure SQL database using .NET core](sql-database-connect-query-dotnet-core.md) on Windows/Linux/macOS.  
- [Getting started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli.md).
- Learn how to [Design your first Azure SQL database using SSMS](sql-database-design-first-database.md) or [Design your first Azure SQL database using .NET](sql-database-design-first-database-csharp.md).
- For more information about .NET, see [.NET documentation](https://docs.microsoft.com/dotnet/).
