---
title: Connect Azure SQL Database by using Ruby | Microsoft Docs
description: Presents a Ruby code sample you can use to connect to and query Azure SQL Database.
services: sql-database
documentationcenter: ''
author: ajlam
manager: jhubbard
editor: ''

ms.assetid: 94fec528-58ba-4352-ba0d-25ae4b273e90
ms.service: sql-database
ms.custom: mvc,develop apps
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: ruby
ms.topic: hero-article
ms.date: 05/24/2017
ms.author: andrela

---

# Azure SQL Database: Use Ruby to connect and query data

This quick start demonstrates how to use [Ruby](https://Ruby.org) to connect to an Azure SQL database; then use Transact-SQL statements to  query, insert, update, and delete data in the database from Mac OS and Ubuntu Linux platforms.

## Prerequisites

This quick start uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)
- [Create DB - PowerShell](sql-database-get-started-powershell.md)

## Install Ruby and database communication libraries

The steps in this section assume that you are familiar with developing using Ruby and are new to working with Azure SQL Database. If you are new to developing with Ruby, go the [Build an app using SQL Server](https://www.microsoft.com/en-us/sql-server/developer-get-started/) and select **Ruby** and then select your operating system.

### **Mac OS**
Open your terminal and navigate to a directory where you plan on creating your Ruby script. Enter the following commands to install **brew**, **FreeTDS**, and **TinyTDS**.

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew tap microsoft/msodbcsql https://github.com/Microsoft/homebrew-msodbcsql-preview
brew update
brew install FreeTDS
gem install tiny_tds
```

### **Linux (Ubuntu)**
Open your terminal and navigate to a directory where you plan on creating your Ruby script. Enter the following commands to install the **FreeTDS** and **TinyTDS**.

```bash
wget ftp://ftp.freetds.org/pub/freetds/stable/freetds-1.00.27.tar.gz
tar -xzf freetds-1.00.27.tar.gz
cd freetds-1.00.27
./configure --prefix=/usr/local --with-tdsver=7.3
make
make install
gem install tiny_tds
```

## Get connection information

Get the connection information needed to connect to the Azure SQL database. You will need the fully qualified server name, database name, and login information in the next procedures.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. On the **Overview** page for your database, review the fully qualified server name as shown in the image below. You can hover over the server name to bring up the **Click to copy** option. 

   ![server-name](./media/sql-database-connect-query-dotnet/server-name.png) 

4. If you forget your server login information, navigate to the SQL Database server page to view the server admin name and, if necessary, reset the password.
    

## Select data
Use the following code to query for the top 20 products by category using the [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function with a [SELECT](https://docs.microsoft.com/sql/t-sql/queries/select-transact-sql) Transact-SQL statement. The TinyTDS::Client function accepts a query and returns a result set. The results set is iterated over by using [result.each do |row|](https://github.com/rails-sqlserver/tiny_tds). Replace the server, database, username, and password parameters with the values that you specified when you created the database with the AdventureWorksLT sample data.

```ruby
require 'tiny_tds'
server = 'your_server.database.windows.net'
database = 'your_database'
username = 'your_username'
password = 'your_password'
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

## Insert data
Use the following code to insert a new product into the SalesLT.Product table using the [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function with an [INSERT](https://docs.microsoft.com/sql/t-sql/statements/insert-transact-sql) Transact-SQL statement. Replace the server, database, username, and password parameters with the values that you specified when you created the database with the AdventureWorksLT sample data.

This example demonstrates how to execute an INSERT statement safely, pass parameters which protect your application from [SQL injection](https://technet.microsoft.com/library/ms161953(v=sql.105).aspx) vulnerability, and retrieve the auto-generated [Primary Key](https://docs.microsoft.com/sql/relational-databases/tables/primary-and-foreign-key-constraints) value.    
  
To use TinyTDS with Azure, it is recommended that you execute several `SET` statements to change how the current session handles specific information. Recommended `SET` statements are provided in the code sample. For example, `SET ANSI_NULL_DFLT_ON` will allow new columns created to allow null values even if the nullability status of the column is not explicitly stated.  
  
To align with the Microsoft SQL Server [datetime](https://docs.microsoft.com/sql/t-sql/data-types/datetime-transact-sql) format, use the [strftime](http://ruby-doc.org/core-2.2.0/Time.html#method-i-strftime) function to cast to the corresponding datetime format.

```ruby
require 'tiny_tds'
server = 'your_server.database.windows.net'
database = 'your_database'
username = 'your_username'
password = 'your_password'
client = TinyTds::Client.new username: username, password: password, 
    host: server, port: 1433, database: database, azure: true

# settings for Azure
result = client.execute("SET ANSI_NULLS ON")
result = client.execute("SET CURSOR_CLOSE_ON_COMMIT OFF")
result = client.execute("SET ANSI_NULL_DFLT_ON ON")
result = client.execute("SET IMPLICIT_TRANSACTIONS OFF")
result = client.execute("SET ANSI_PADDING ON")
result = client.execute("SET QUOTED_IDENTIFIER ON")
result = client.execute("SET ANSI_WARNINGS ON")
result = client.execute("SET CONCAT_NULL_YIELDS_NULL ON")

def insert(name, productnumber, color, standardcost, listprice, sellstartdate)
    tsql = "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) 
        VALUES (N'#{name}', N'#{productnumber}',N'#{color}',N'#{standardcost}',N'#{listprice}',N'#{sellstartdate}')"
    result = client.execute(tsql)
    result.each
    puts "#{result.affected_rows} row(s) affected"
end
insert('BrandNewProduct', '200989', 'Blue', 75, 80, '7/1/2016')
```

## Update data
Use the following code to update the new product that you previously added using the [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function with a [UPDATE](https://docs.microsoft.com/sql/t-sql/queries/update-transact-sql) Transact-SQL statement. Replace the server, database, username, and password parameters with the values that you specified when you created the database with the AdventureWorksLT sample data.

```ruby
require 'tiny_tds'
server = 'your_server.database.windows.net'
database = 'your_database'
username = 'your_username'
password = 'your_password'
client = TinyTds::Client.new username: username, password: password, 
    host: server, port: 1433, database: database, azure: true
    
def update(name, listPrice, client)
    tsql = "UPDATE SalesLT.Product SET ListPrice = N'#{listPrice}' WHERE Name =N'#{name}'";
    result = client.execute(tsql)
    result.each
    puts "#{result.affected_rows} row(s) affected"
end
update('BrandNewProduct', 500, client)
```

## Delete data
Use the following code to delete the new product that you previously added using the [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function with a [DELETE](https://docs.microsoft.com/sql/t-sql/statements/delete-transact-sql) Transact-SQL statement. Replace the server, database, username, and password parameters with the values that you specified when you created the database with the AdventureWorksLT sample data.

```ruby
require 'tiny_tds'
server = 'your_server.database.windows.net'
database = 'your_database'
username = 'your_username'
password = 'your_password'
client = TinyTds::Client.new username: username, password: password, 
    host: server, port: 1433, database: database, azure: true

# settings for Azure
result = client.execute("SET ANSI_NULLS ON")
result = client.execute("SET CURSOR_CLOSE_ON_COMMIT OFF")
result = client.execute("SET ANSI_NULL_DFLT_ON ON")
result = client.execute("SET IMPLICIT_TRANSACTIONS OFF")
result = client.execute("SET ANSI_PADDING ON")
result = client.execute("SET QUOTED_IDENTIFIER ON")
result = client.execute("SET ANSI_WARNINGS ON")
result = client.execute("SET CONCAT_NULL_YIELDS_NULL ON")

def delete(name, client)
    tsql = "DELETE FROM SalesLT.Product WHERE Name = N'#{name}'"
    result = client.execute(tsql)
    result.each
    puts "#{result.affected_rows} row(s) affected"
end
delete('BrandNewProduct', client)
```

## Next Steps
- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [GitHub repository for TinyTDS](https://github.com/rails-sqlserver/tiny_tds)
- [Report issues/ask questions](https://github.com/rails-sqlserver/tiny_tds/issues)
- [Ruby Drivers for SQL Server](https://docs.microsoft.com/sql/connect/ruby/ruby-driver-for-sql-server/)

