<properties 
	pageTitle="Connection libraries for clients of SQL Database" 
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
	ms.date="04/06/2015" 
	ms.author="genemi"/>


#Connection libraries for clients of SQL Database


<!--
GeneMi , 2015-April-06 Monday 13:23pm
Original content from PM PehTeh.
-->


This topic lists the minimum version number for each driver that client programs can use when connecting to Azure SQL Database or to Microsoft SQL Server.


This topic displays information only about drivers that Microsoft has released. However, at the end of this topic a link is provided for version information about drivers that are released and maintained by the community rather than by Microsoft.


##Table of drivers


The following table displays libraries that are released by Microsoft. The **Libraries** column provides links you can use to download each driver. The **Version** column lists the minimum version that works well for interacting with our database offerings.


| Platform | Oper sys | Libraries | Version | Description |
| :--- | :--- | :--- | :--- | :--- |
| .NET | Cross-platform (.NET) | [ADO.NET, System .Data .SqlClient](http://www.microsoft.com/download/details.aspx?id=30653) | 4.5+ | SQL Server Provider for .NET Framework |
| PHP | Windows | [PHP for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=20098) | 2.0+ | PHP Driver for SQL |
| Java | Windows | [JDBC for SQL Server](https://www.microsoft.com/en-us/download/details.aspx?id=11774) | 2.0+ |  Type 4 JDBC driver that provides database connectivity through the standard JDBC API |
| ODBC | Windows | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=36434) | 11.0+ | Microsoft ODBC Driver for SQL Server |
| ODBC | Suse Linux | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server |
| ODBC | Redhat Linux | [ODBC for SQL Server](http://www.microsoft.com/en-us/download/details.aspx?id=34687) | 11.0+ | Microsoft ODBC Driver for SQL Server |


##Third party libraries


The following table displays libraries that are release by third parties such as other companies or by the community, rather than by Microsoft.


On wikipedia.org there is a topic that lists links and version information for several non-Microsoft drivers. The title of the wikipedia.org topic is **Microsoft SQL Server Libraries/Drivers**. Check the link to our wikipedia.org topic for the information maintained by the community about these libraries.


> [AZURE.NOTE]
> The new wikipedia.org topic will not be live and available until perhaps April 17 2015. A link will be activated here when the topic goes live on wikipedia.org.


| Platform | Libraries | Links |
| :-- | :-- | :-- |
| Python | pymssql | wikipedia.org (soon). |
| Node.js | Tedious | wikipedia.org (soon). |
| Python | Mode-MSSQL | wikipedia.org (soon). |
| Python | Edge.js | wikipedia.org (soon). |


<!--
https://en.wikipedia.org/wiki/Draft:Microsoft_SQL_Server_Libraries/Drivers
-->


