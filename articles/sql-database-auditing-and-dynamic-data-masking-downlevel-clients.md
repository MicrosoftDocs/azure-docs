<properties 
	pageTitle="SQL Database Downlevel Clients Support for Auditing and Dynamic Data Masking | Azure" 
	description="SQL Database Downlevel Clients Support for Auditing and Dynamic Data Masking" 
	services="sql-database" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="jeffreyg"/>
 
# SQL Database -  Downlevel Clients Support for Auditing and Dynamic Data Masking 


[Auditing](http://azure.microsoft.com/en-us/documentation/articles/sql-database-auditing-get-started/)  and [Dynamic Data Masking](http://azure.microsoft.com/en-us/documentation/articles/sql-database-dynamic-data-masking-get-started/) work with SQL clients that support TDS redirection. 

Any client which implements TDS 7.4 should also support redirection. Exceptions to this include JDBC 4.0 in which the redirection feature is not fully supported and Tedious for Node.JS in which redirection was not implemented.

For "Downlevel clients", i.e. which support TDS version 7.3 and below - the server FQDN in the connection string should be modified:

Original server FQDN in the connection string: <*server name*>.database.windows.net

Modified server FQDN in the connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes: 

- .NET 4.0 and below,
- ODBC 10.0 and below.
- JDBC 4.0 and below (while JDBC 4.0 does support TDS 7.4, the TDS redirection feature is not fully supported)
- Tedious (for Node.JS)

