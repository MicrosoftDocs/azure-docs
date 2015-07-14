<properties
	pageTitle="Connection Libraries for SQL Database and SQL Server"
	description="Lists the minimum version number for each driver that client programs can use to connect to Azure SQL Database or to Microsoft SQL Server. A link is provided for version information about drivers that are released by the community rather than by Microsoft."
	services="sql-database"
	documentationCenter=""
	authors="pehteh"
	manager="jeffreyg"
	editor="genemi"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management" 
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/24/2015"
	ms.author="pehteh"/>


# Connection Libraries for SQL Database and SQL Server


This topic lists the minimum version number for each library/driver that client programs can use when connecting to Azure SQL Database or to Microsoft SQL Server.


This topic is split into two sections:


- *Table of driver libraries released by Microsoft* - covers libraries that Microsoft has released. Microsoft maintains the information that is in this section.
- *Third party libraries* - lists libraries that are released and maintained by third parties rather than by Microsoft. **Only the public community of developers maintains this section. Microsoft will not maintain this section.**


## Table of driver libraries released by Microsoft


The following table displays libraries that are released by Microsoft. The **Libraries** column provides links you can use to download each library. The **Version** column lists the minimum version that is recommended for interacting with Azure SQL Database and Microsoft SQL Server.


| Platform | Oper Sys | Libraries<br/>for Download | Version<br/>of Driver | Description<br/>of Driver | More<br/>Info |
| :--- | :--- | :--- | :--- | :--- | :-- |
| .NET | Cross-platform (.NET) | [ADO.NET, System .Data .SqlClient](http://www.microsoft.com/download/details.aspx?id=30653) | 4.5+ | SQL Server Provider for .NET Framework | . |
| PHP | Windows | [PHP for SQL Server](http://www.microsoft.com/download/details.aspx?id=20098) | 2.0+ | PHP Driver for SQL Server | [Link](http://msdn.microsoft.com/library/dn865013.aspx) |
| Java | Windows | [JDBC for SQL Server](https://www.microsoft.com/download/details.aspx?id=11774) | 2.0+ |  Type 4 JDBC driver that provides database connectivity through the standard JDBC API | [Link](http://msdn.microsoft.com/library/dn425070.aspx) |
| ODBC | Windows | [ODBC for SQL Server](http://www.microsoft.com/download/details.aspx?id=36434) | 11.0+ | Microsoft ODBC Driver for SQL Server | [Link](http://msdn.microsoft.com/library/jj730308.aspx) |
| ODBC | Suse Linux | [ODBC for SQL Server](http://www.microsoft.com/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server | . |
| ODBC | Redhat Linux | [ODBC for SQL Server](http://www.microsoft.com/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server | . |


### OLEDB for DB2 and SQL Server, for DRDA design


The Microsoft OLE DB Provider for DB2 Version 5.0 (Data Provider) lets you create distributed applications targeting IBM DB2 databases. The Data Provider takes advantage of Microsoft SQL Server data access architecture together with a Microsoft network client for DB2 that functions as a Distributed Relational Database Architecture (DRDA) application requester. The Data Provider converts Microsoft Component Object Model (COM) OLE DB commands and data types to DRDA protocol code points and data formats.


For more information, see:


- [Microsoft OLE DB Provider for DB2 Version 5.0](http://msdn.microsoft.com/library/dn745875.aspx)
- [Microsoft OLEDB Provider for DB2 v4.0 for Microsoft SQL Server 2012](http://www.microsoft.com/download/details.aspx?id=29100)


## Third party libraries


> [AZURE.IMPORTANT] The following table displays libraries that are released by third parties under third party license terms. You are responsible for verifying and complying with the relevant third party licenses in order to use these libraries. You bear the risk of using these libraries. Microsoft makes no warranties, express or implied, with respect to the information provided here and has merely provided the information as a matter of convenience to the users. Nothing herein implies any kind of endorsement by Microsoft.
<br/><br/>It is up to the public community of developers to update and maintain the information that is in this "Third party libraries" section, by using the [azure-content](http://github.com/Azure/azure-content/) repository owned by **Azure** on GitHub.com. Microsoft encourages developers to update this section. Microsoft personnel do *not* intend to maintain the information that is in this section, partly because other people are more expert with each particular third party library than we are.  Thank you.


The following table displays libraries that are released by third parties such as other companies or by the community. Libraries released by Microsoft are restricted to the earlier section in this topic.


| Platform | Libraries |
| :-- | :-- |
| Python | [pymssql *(org, stable)*](http://pymssql.org/en/stable/)<br/><br/>[pymssql *(org)*](http://pymssql.org/) |
| Node.js | [Tedious *(npmjs)*](http://www.npmjs.com/package/tedious) |
| Node.js | [Node-MSSQL *(github, patriksimek)*](https://github.com/patriksimek/node-mssql)<br/><br/>[Node-MSSQL *(npmjs)*](https://www.npmjs.com/package/node-mssql)<br/><br/>[Node-MSSQL-Connector *(npmjs)*](https://www.npmjs.com/package/node-mssql-connector) |
| Node.js | [Edge.js *(github com, tjanczuk)*](https://github.com/tjanczuk/edge)<br/><br/>[Edge.js *(tjanczuk, github io)*](http://tjanczuk.github.io/edge/) |
| . | [FreeTDS *(org)*](http://www.freetds.org/) |


<!--
https://en.wikipedia.org/wiki/Draft:Microsoft_SQL_Server_Libraries/Drivers
-->
 