---
title: Use .NET core to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use .NET core to create a program that connects to an Azure SQL Database and query it using Transact-SQL.
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
ms.date: 07/03/2017
ms.author: carlrab

---
# Use .NET (C#) with Visual Studio to connect and query an Azure SQL database

This quick start tutorial demonstrates how to use [.NET core](https://www.microsoft.com/net/) on Windows/Linux/macOS to create a C# program with Visual Studio to connect to an Azure SQL database and query data using Transact-SQL statements to query data.

## Prerequisites

To complete this quick start tutorial, make sure you have the following:

- An Azure SQL database. This quick start uses the resources created in one of these quick starts: 

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)
   - [Create DB - PowerShell](sql-database-get-started-powershell.md)

- A [server-level firewall rule](sql-database-get-started-portal.md#create-a-server-level-firewall-rule) for the public IP address of the computer you use for this quick start tutorial.
- You have installed [.NET Core for your operating system](https://www.microsoft.com/net/core). 

## Get Azure SQL server connection information

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
  
## Create a new .NET project and add dependencies

1. Open a command prompt and create a folder named *sqltest*. Navigate to the folder you created and run the following command:

    ```
    dotnet new console
    ```

2. Open ***sqltest.csproj*** with your favorite text editor and add System.Data.SqlClient as a dependency using the following code:

    ```xml
    <ItemGroup>
        <PackageReference Include="System.Data.SqlClient" Version="4.3.0" />
    </ItemGroup>
    ```

## Insert code into the project to query Azure SQL database

1. In your development environment or favorite text editor open **Program.cs**

2. Replace the contents with the following code and add the appropriate values for your server, database, user, and password.

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

1. At the command prompt, run the following commands:

   ```
   dotnet restore
   dotnet run
   ```

2. Verify that the top 20 rows are returned and then close the application window.


## Next steps

- [Getting started with .NET Core on Windows/Linux/macOS using the command line](/dotnet/core/tutorials/using-with-xplat-cli.md).
- Learn how to [connect and query an Azure SQL database using the .NET framework and Visual Studio](sql-database-connect-query-dotnet-visual-studio.md).  
- Learn how to [Design your first Azure SQL database using SSMS](sql-database-design-first-database.md) or [Design your first Azure SQL database using .NET](sql-database-design-first-database-csharp.md).
- For more information about .NET, see [.NET documentation](https://docs.microsoft.com/dotnet/).
