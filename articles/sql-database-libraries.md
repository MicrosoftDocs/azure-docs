<properties 
	pageTitle="Connection Libraries for SQL Database and SQL Server" 
	description="Lists the minimum version number for each driver that client programs can use to connect to Azure SQL Database or to Microsoft SQL Server. A link is provided for version information about drivers that are released by the community rather than by Microsoft."
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="genemi"/>


#Connection Libraries for SQL Database and SQL Server


<!--
GeneMi , 2015-April-13 Monday 11:33am
Original content from PM PehTeh. Updated by TT. Fixing broken table at bottom by removing trailing spaces.
-->


This topic lists the minimum version number for each library/driver that client programs can use when connecting to Azure SQL Database or to Microsoft SQL Server.


This topic is split into two parts; the first part covers library that Microsoft has released, the second part of this topic lists libraries that are released and maintained by a third party rather than by Microsoft.


##Table of drivers


The following table displays libraries that are released by Microsoft. The **Libraries** column provides links you can use to download each library. The **Version** column lists the minimum version that is recommended for interacting with Azure SQL Database and Microsoft SQL Server.


| Platform | Oper sys | Libraries | Version | Description |
| :--- | :--- | :--- | :--- | :--- |
| .NET | Cross-platform (.NET) | [ADO.NET, System .Data .SqlClient](http://www.microsoft.com/download/details.aspx?id=30653) | 4.5+ | SQL Server Provider for .NET Framework |
| PHP | Windows | [PHP for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=20098) | 2.0+ | PHP Driver for SQL Server |
| Java | Windows | [JDBC for SQL Server](https://www.microsoft.com/en-us/download/details.aspx?id=11774) | 2.0+ |  Type 4 JDBC driver that provides database connectivity through the standard JDBC API |
| ODBC | Windows | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=36434) | 11.0+ | Microsoft ODBC Driver for SQL Server |
| ODBC | Suse Linux | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server |
| ODBC | Redhat Linux | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server |


##Third party libraries
*The following table displays libraries that are released by third parties under third party license terms. You are responsible for verifying and complying with the relevant third party licenses in order to use these libraries. You bear the risk of using these libraries. Microsoft makes no warranties, express or implied, with respect to the information provided here and has merely provided the information as a matter of convenience to the users. Nothing herein implies any kind of endorsement by Microsoft.*

The following table displays libraries that are released by third parties such as other companies or by the community, rather than by Microsoft.


| Platform | Libraries |
| :-- | :-- |
| Python | pymssql |
| Node.js | Tedious |
| Node.js | Node-MSSQL |
| Node.js | Edge.js |


<!--
https://en.wikipedia.org/wiki/Draft:Microsoft_SQL_Server_Libraries/Drivers
-->


