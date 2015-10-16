<properties 
	pageTitle="Connect to SQL Database by using Ruby with TinyTDS on Ubuntu" 
	description="Give a Ruby code sample you can run as a client on Ubuntu Linux to connect to Azure SQL Database."
	services="sql-database" 
	documentationCenter="" 
	authors="ajlam" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ruby" 
	ms.topic="article" 
	ms.date="07/20/2015" 
	ms.author="andrela"/>


# Connect to SQL Database by using Ruby on Ubuntu Linux

[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]

This topic presents a Ruby code sample that runs on an Ubuntu Linux client computer to connect to an Azure SQL Database database.

## Install the required modules

Open your terminal and install FreeTDS if you do not have it on your machine.
	
    sudo apt-get --assume-yes update 
    sudo apt-get --assume-yes install freetds-dev freetds-bin

After your machine is configured with FreeTDS, install Ruby if you do not already have it on your machine.
    
    sudo apt-get install libgdbm-dev libncurses5-dev automake libtool bison libffi-dev 
    curl -L https://get.rvm.io | bash -s stable

If you have any issues with signatures, run the following command.

    command curl -sSL https://rvm.io/mpapis.asc | gph --import - 

If there are no issues with signatures, run the following commands.  

    source ~/.rvm/scripts/rvm 
    rvm install 2.1.2 
    rvm use 2.1.2 --default 
    ruby -v 

Ensure that you are running version 2.1.2 or the Ruby VM.

Next, install TinyTDS.

    gem install tiny_tds

## Create a database, retrieve your connection string

The Ruby sample relies on the AdventureWorks sample database. If you do not already have AdventureWorks, you can see how to create it at the following topic: [Create your first Azure SQL Database](sql-database-get-started.md)

The topic also explains how to retrieve the database connection string.

## Connect to your SQL Database

The [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function is used to connect to SQL Database.

    require 'tiny_tds' 
    client = TinyTds::Client.new username: 'yourusername@yourserver', password: 'yourpassword', 
    host: 'yourserver.database.windows.net', port: 1433, 
    database: 'AdventureWorks', azure:true 

## Execute a SELECT statement and retrieve the result set

The [TinyTds::Result](https://github.com/rails-sqlserver/tiny_tds) function is used to retrieve a result set from a query against SQL Database. This function accepts a query and returns a result set. The results set is iterated over by using [result.each do |row|](https://github.com/rails-sqlserver/tiny_tds).

    require 'tiny_tds'  
    print 'test'     
    client = TinyTds::Client.new username: 'yourusername@yourserver', password: 'yourpassword', 
    host: 'yourserver.database.windows.net', port: 1433, 
    database: 'AdventureWorks', azure:true 
    results = client.execute("select * from SalesLT.Product") 
    results.each do |row| 
    puts row 
    end 

## Inserting a row, passing parameters, and retrieving the generated primary key value

The code sample:

- Passes parameters for values to be inserted in a row.
- Inserts the row.
- Retrieves the value that was generated for the primary key.

In SQL Database, the [IDENTITY](http://msdn.microsoft.com/library/ms186775.aspx) property and the [SEQUENCE](http://msdn.microsoft.com/library/ff878058.aspx) object can be used to auto-generate [primary key values](http://msdn.microsoft.com/library/ms179610.aspx). 

To use TinyTDS with Azure, it is recommended that you execute several `SET` statements to change how the current session handles specific information. Recommended `SET` statements are provided in the code sample. For example, `SET ANSI_NULL_DFLT_ON` will allow new columns created to allow null values even if the nullability status of the column is not explicitly stated.

To align with the Microsoft SQL Server [datetime](http://msdn.microsoft.com/library/ms187819.aspx) format, use the [strftime](http://ruby-doc.org/core-2.2.0/Time.html#method-i-strftime) function to cast to the corresponding datetime format. 

    require 'tiny_tds' 
    client = TinyTds::Client.new username: 'yourusername@yourserver', password: 'yourpassword', 
    host: 'yourserver.database.windows.net', port: 1433, 
    database: 'AdventureWorks', azure:true 
    results = client.execute("SET ANSI_NULLS ON")
    results = client.execute("SET CURSOR_CLOSE_ON_COMMIT OFF")
    results = client.execute("SET ANSI_NULL_DFLT_ON ON")
    results = client.execute("SET IMPLICIT_TRANSACTIONS OFF")
    results = client.execute("SET ANSI_PADDING ON")
    results = client.execute("SET QUOTED_IDENTIFIER ON")
    results = client.execute("SET ANSI_WARNINGS ON")
    results = client.execute("SET CONCAT_NULL_YIELDS_NULL ON")
    require 'date'
    t = Time.now
    curr_date = t.strftime("%Y-%m-%d %H:%M:%S.%L") 
    results = client.execute("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) 
    OUTPUT INSERTED.ProductID VALUES ('SQL Server Express New', 'SQLEXPRESS New', 0, 0, '#{curr_date}' )")
    results.each do |row| 
    puts row
    end 

