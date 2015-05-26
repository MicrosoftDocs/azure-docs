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


###Security-enabled access

For the [Auditing](http://azure.microsoft.com/en-us/documentation/articles/sql-database-auditing-get-started/)  and [Dynamic Data Masking](http://azure.microsoft.com/en-us/documentation/articles/sql-database-dynamic-data-masking-get-started/) Services of SQL Database, clients traffic is redirected into "Security Enabled Access".

SQL Clients which are using TDS version 7.4 and above are redirected "behind the scene". (In the short term, there is a need to configure **SECURITY ENABLED ACCESS** to **REQUIRED**. This configuration is expected to be eliminated, first for v12 databases and a few weeks later also for v11 databases). In addition to supporting TDS 7.4 and above, the client also needs to correctly support TDS redirection,



For "Downlevel clients" which are using TDS version 7.3 and below there is a need to configure a security enabled connection string:

	Traditional connection string format: <*server name*>.database.windows.net

	Security-enabled connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes: 

- .NET 4.0 and below,
- ODBC 10.0 and below.
- JDBC 4.0 and below (while JDBC 4.0 does support TDS 7.4, the TDS redirection feature is not fully supported)

