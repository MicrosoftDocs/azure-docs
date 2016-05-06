<properties 
	pageTitle="Client quick start code samples to SQL Database | Microsoft Azure" 
	description="Provides code samples and drivers for Node.js on Linux, Python on Mac OS, Java and Windows, Enterprise Library, and many more all for Azure SQL Database clients."
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/10/2016" 
	ms.author="genemi"/>


# Client quick-start code samples to SQL Database


This topic provides links to quick-start code samples you can use to connect to Azure SQL Database:


- Short samples connect and query.
- Retry samples connect and query, but automatically retry if an encountered error is classified as a [*transient fault*](sql-database-develop-error-messages.md#bkmk_connection_errors) (such as a connection timeout).


The samples cover:


- A variety of programming languages.
- Windows, Linux, and Mac OS as the operating systems that your client program can run on.
- Links for downloads to any necessary connection drivers.
- Short quick start code samples.
- Longer samples that contain transient fault handling in the form of automated retry logic.
- Code samples that convert relational result sets into an object  oriented format.


> [AZURE.NOTE] Code samples for more languages are being prepared, and links to them will be added to this topic.


## Clients on Linux


This section provides links to code sample topics for client programs that run on Linux.


| Language | Short sample | Retry sample | Relational to object |
| :-- | :-- | :-- | :-- |
| Node.js | [Tedious](sql-database-develop-nodejs-simple-linux.md) | . | . |
| Python | [FreeTDS, pymssql](sql-database-develop-python-simple-ubuntu-linux.md) | . | . |
| Ruby | [FreeTDS, TinyTDS](sql-database-develop-ruby-simple-linux.md) | . | . |


## Clients on Mac OS


This section provides links to code sample topics for client programs that run on Mac OS.


| Language | Short sample | Retry sample | Relational to object |
| :-- | :-- | :-- | :-- |
| Python | [pymssql](sql-database-develop-python-simple-mac-osx.md) | . | . |
| Ruby | [Homebrew<br/>FreeTDS, TinyTDS](sql-database-develop-ruby-simple-mac-osx.md) | . | . |


## Clients on Windows


This section provides links to code sample topics for client programs that run on Windows.


| Language | Short sample | Retry sample | Relational to object |
| :-- | :-- | :-- | :-- |
| C# | [ADO.NET](sql-database-develop-dotnet-simple.md) | [ADO.NET custom](sql-database-develop-csharp-retry-windows.md)<br/><br/>[Enterprise Library](sql-database-develop-entlib-csharp-retry-windows.md) | (Entity Framework) |
| C++ | [ODBC driver](http://msdn.microsoft.com/library/azure/hh974312.aspx) | . | . |
| Java | [Java. JDBC, JDK. Insert, Transaction, Select.](sql-database-develop-java-simple-windows.md) | . | . |
| Node.js | [msnodesql](sql-database-develop-nodejs-simple-windows.md) | . | . |
| PHP | [ODBC](sql-database-develop-php-simple-windows.md) | [ODBC custom](sql-database-develop-php-retry-windows.md) | . |
| Python | [pymssql](sql-database-develop-python-simple-windows.md) | . | . |


## See also


- [Downloads for SDKs and tools, for numerous languages and platforms](https://azure.microsoft.com/downloads/#cmd-line-tools)
- [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md)
- [List of numeric codes for transient errors](sql-database-develop-error-messages.md#bkmk_connection_errors)<br/>&nbsp;
- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)
- [Connecting to SQL Database: Links, Best Practices and Design Guidelines](sql-database-connect-central-recommendations.md)
- [Create your first Azure SQL Database](sql-database-get-started.md)
- [Entity Framework 6 here, EF 7 on GitHub](http://entityframework.codeplex.com/)

