---
title: Use Ruby to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use Ruby to create a program that connects to an Azure SQL Database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: ruby
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 12/20/2018
---
# Quickstart: Use Ruby to query an Azure SQL database

This quickstart demonstrates how to use [Ruby](https://www.ruby-lang.org) to connect to an Azure SQL database and query data with Transact-SQL statements.

## Prerequisites

To complete this quickstart, you need the following prerequisites:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]
  
- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you use for this quickstart.
  
- Ruby and related software for your operating system:
  
  - **MacOS**: Install Homebrew, rbenv and ruby-build, Ruby, FreeTDS, and TinyTDS. See Steps 1.2, 1.3, 1.4, 1.5, and 2.1 in [Create Ruby apps using SQL Server on macOS](https://www.microsoft.com/sql-server/developer-get-started/ruby/mac/).
  
  - **Ubuntu**: Install prerequisites for Ruby, rbenv and ruby-build, Ruby, FreeTDS, and TinyTDS. See Steps 1.2, 1.3, 1.4, 1.5, and 2.1 in [Create Ruby apps using SQL Server on Ubuntu](https://www.microsoft.com/sql-server/developer-get-started/ruby/ubuntu/).
  
  - **Windows**: Install Ruby, Ruby Devkit, and TinyTDS. See [Configure development environment for Ruby development](/sql/connect/ruby/step-1-configure-development-environment-for-ruby-development).

## Get SQL server connection information

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

## Create code to query your SQL database

1. In a text or code editor, create a new file named *sqltest.rb*.
   
1. Add the following code. Substitute the values from your Azure SQL database for `<server>`, `<database>`, `<username>`, and `<password>`.
   
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
- [Design your first Azure SQL database](sql-database-design-first-database.md).
- [GitHub repository for TinyTDS](https://github.com/rails-sqlserver/tiny_tds).
- [Report issues or ask questions about TinyTDS](https://github.com/rails-sqlserver/tiny_tds/issues).
- [Ruby driver for SQL Server](https://docs.microsoft.com/sql/connect/ruby/ruby-driver-for-sql-server/).
