<properties 
	pageTitle="Connect to SQL Database by using Ruby with TinyTDS on Windows" 
	description="Give a Ruby code sample you can run on Windows to connect to Azure SQL Database."
	services="sql-database" 
	documentationCenter="" 
	authors="meet-bhagdev" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ruby" 
	ms.topic="article" 
	ms.date="08/04/2015" 
	ms.author="mebha"/>


# Connect to SQL Database by using Ruby on Windows

[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]

This topic presents a Ruby code sample that runs on a Windows computer running Windows 8.1 to connect to an Azure SQL Database database.

## Install the required modules

Open your terminal and install the following:

**1) Ruby:** If your machine does not have Ruby please install it. For new ruby users, we recommend you use Ruby 2.1.X installers. These provide a stable language and a extensive list of packages (gems) that are compatible and updated. [Go the Ruby download page](http://rubyinstaller.org/downloads/) and download the appropriate 2.1.x installer. For example if you are on a 64 bit machine, download the **Ruby 2.1.6 (x64)** installer.
<br/><br/>Once the installer is downloaded, do the following: 


- Double-click the file to start the installer.

- Select your language, and agree to the terms.

- On the install settings screen, select the check boxes next to both *Add Ruby executables to your PATH* and *Associate .rb and .rbw files with this Ruby installation*.


**2) DevKit:** Download DevKit from the [RubyInstaller page](http://rubyinstaller.org/downloads/)

After the download is finished, do the following:


- Double-click the file. You will be asked where to extract the files.

- Click the "..." button, and select "C:\DevKit". You will probably need to create this folder first by clicking "Make New Folder".

- Click "OK", and then "Extract", to extract the files.


Now open the Command Prompt and enter the following commands:

	> chdir C:\DevKit
	> ruby dk.rb init
	> ruby dk.rb install

You now have a fully functional Ruby and RubyGems!


**3) TinyTDS:** Navigate to C:\DevKit and run the following command from your terminal. This will install TinyTDS on your machine. 

	gem inst tiny_tds --pre

## Create a database, retrieve your connection string

The Ruby sample relies on the `AdventureWorks` sample database. If you do not already have `AdventureWorks`, you can see how to create it by visiting [Create your first Azure SQL Database](sql-database-get-started.md).

The topic also explains how to retrieve the database connection string.

## Connect to your SQL Database

The [TinyTDS::Client](https://github.com/rails-sqlserver/tiny_tds) function is used to connect to SQL Database.

    require 'tiny_tds' 
    client = TinyTds::Client.new username: 'yourusername@yourserver', password: 'yourpassword', 
    host: 'yourserver.database.windows.net', port: 1433, 
    database: 'AdventureWorks', azure:true 

## Execute a SELECT statement and retrieve the result set

Copy and paste the following code in an empty file. Call it test.rb. Then execute it by entering the following command from your command prompt:

	ruby test.rb

In the code sample, the [TinyTds::Result](https://github.com/rails-sqlserver/tiny_tds) function is used to retrieve a result set from a query against SQL Database. This function accepts a query and returns a result set. The results set is iterated over by using [result.each do |row|](https://github.com/rails-sqlserver/tiny_tds).

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
