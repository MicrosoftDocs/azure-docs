---
title: Use Ruby to query
description: This topic shows you how to use Ruby to create a program that connects to a database and query it using Transact-SQL statements.
titleSuffix: Azure SQL Database & SQL Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=2 
ms.devlang: ruby
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 05/29/2020
---
# Quickstart: Use Ruby to query a database in Azure SQL Database or Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This quickstart demonstrates how to use [Ruby](https://www.ruby-lang.org) to connect to a database and query data with Transact-SQL statements.

## Prerequisites

To complete this quickstart, you need the following prerequisites:

- A database. You can use one of these quickstarts to create and then configure the database:

  || SQL Database | SQL Managed Instance | SQL Server on Azure VM |
  |:--- |:--- |:---|:---|
  | Create| [Portal](single-database-create-quickstart.md) | [Portal](../managed-instance/instance-create-quickstart.md) | [Portal](../virtual-machines/windows/sql-vm-create-portal-quickstart.md)
  || [CLI](scripts/create-and-configure-database-cli.md) | [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) |
  || [PowerShell](scripts/create-and-configure-database-powershell.md) | [PowerShell](../managed-instance/scripts/create-configure-managed-instance-powershell.md) | [PowerShell](../virtual-machines/windows/sql-vm-create-powershell-quickstart.md)
  | Configure | [Server-level IP firewall rule](firewall-create-server-level-portal-quickstart.md)| [Connectivity from a VM](../managed-instance/connect-vm-instance-configure.md)|
  |||[Connectivity from on-premises](../managed-instance/point-to-site-p2s-configure.md) | [Connect to a SQL Server instance](../virtual-machines/windows/sql-vm-create-portal-quickstart.md)
  |Load data|Adventure Works loaded per quickstart|[Restore Wide World Importers](../managed-instance/restore-sample-database-quickstart.md) | [Restore Wide World Importers](../managed-instance/restore-sample-database-quickstart.md) |
  |||Restore or import Adventure Works from a [BACPAC](database-import.md) file from [GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)| Restore or import Adventure Works from a [BACPAC](database-import.md) file from [GitHub](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)|
  |||

  > [!IMPORTANT]
  > The scripts in this article are written to use the Adventure Works database. With a SQL Managed Instance, you must either import the Adventure Works database into an instance database or modify the scripts in this article to use the Wide World Importers database.
  
- Ruby and related software for your operating system:
  
  - **macOS**: Install Homebrew, rbenv and ruby-build, Ruby, FreeTDS, and TinyTDS. See Steps 1.2, 1.3, 1.4, 1.5, and 2.1 in [Create Ruby apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/ruby/mac/).
  
  - **Ubuntu**: Install prerequisites for Ruby, rbenv and ruby-build, Ruby, FreeTDS, and TinyTDS. See Steps 1.2, 1.3, 1.4, 1.5, and 2.1 in [Create Ruby apps using SQL Server on Ubuntu](https://www.microsoft.com/sql-server/developer-get-started/ruby/ubuntu/).
  
  - **Windows**: Install Ruby, Ruby Devkit, and TinyTDS. See [Configure development environment for Ruby development](/sql/connect/ruby/step-1-configure-development-environment-for-ruby-development).

## Get server connection information

Get the connection information you need to connect to a database in Azure SQL Database. You'll need the fully qualified server name or host name, database name, and login information for the upcoming procedures.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to the **SQL databases**  or **SQL Managed Instances** page.

3. On the **Overview** page, review the fully qualified server name next to **Server name** for a database in Azure SQL Database or the fully qualified server name (or IP address) next to **Host** for an Azure SQL Managed Instance or SQL Server on Azure VM. To copy the server name or host name, hover over it and select the **Copy** icon.

> [!NOTE]
> For connection information for SQL Server on Azure VM, see [Connect to a SQL Server instance](../virtual-machines/windows/sql-vm-create-portal-quickstart.md#connect-to-sql-server).

## Create code to query your database in Azure SQL Database

1. In a text or code editor, create a new file named *sqltest.rb*.

1. Add the following code. Substitute the values from your database in Azure SQL Database for `<server>`, `<database>`, `<username>`, and `<password>`.

   >[!IMPORTANT]
   >The code in this example uses the sample AdventureWorksLT data, which you can choose as source when creating your database. If your database has different data, use tables from your own database in the SELECT query. 

   ```ruby
   require 'tiny_tds'
   server = '<server>.database.windows.net'
   database = '<database>'
   username = '<username>'
   password = '<password>'
   client = TinyTds::Client.new username: username, password: password, 
       host: server, port: 1433, database: database, azure: true
   
   puts "Reading data from table"
   tsql = "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
           FROM [SalesLT].[ProductCategory] pc
           JOIN [SalesLT].[Product] p
           ON pc.productcategoryid = p.productcategoryid"
   result = client.execute(tsql)
   result.each do |row|
       puts row
   end
   ```

## Run the code

1. At a command prompt, run the following command:

   ```bash
   ruby sqltest.rb
   ```
   
1. Verify that the top 20 Category/Product rows from your database are returned. 

## Next steps
- [Design your first database in Azure SQL Database](design-first-database-tutorial.md)
- [GitHub repository for TinyTDS](https://github.com/rails-sqlserver/tiny_tds)
- [Report issues or ask questions about TinyTDS](https://github.com/rails-sqlserver/tiny_tds/issues)
- [Ruby driver for SQL Server](https://docs.microsoft.com/sql/connect/ruby/ruby-driver-for-sql-server/)
