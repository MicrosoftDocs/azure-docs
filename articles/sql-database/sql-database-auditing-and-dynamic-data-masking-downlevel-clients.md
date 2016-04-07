<properties 
	pageTitle="SQL Database downlevel clients support for Auditing| Microsoft Azure" 
	description="Learn about SQL Database downlevel clients support for Auditing." 
	services="sql-database" 
	documentationCenter="" 
	authors="nadavhelfman" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/12/2015" 
	ms.author="nadavh;ronitr"/>
 
# SQL Database -  Downlevel clients support for Auditing


[Auditing](sql-database-auditing-get-started.md) works automatically with SQL clients that support TDS redirection. 

Any client which implements TDS 7.4 should also support redirection. Exceptions to this include JDBC 4.0 in which the redirection feature is not fully supported and Tedious for Node.JS in which redirection was not implemented.

For "Downlevel clients", i.e. which support TDS version 7.3 and below - the server FQDN in the connection string should be modified:

Original server FQDN in the connection string: <*server name*>.database.windows.net

Modified server FQDN in the connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes: 

- .NET 4.0 and below,
- ODBC 10.0 and below.
- JDBC (while JDBC does support TDS 7.4, the TDS redirection feature is not fully supported)
- Tedious (for Node.JS)

**Remark:** The above server FDQN modification may be useful also for applying a SQL Server Level Auditing policy without a need for a configuration step in each database (Temporary mitigation).

