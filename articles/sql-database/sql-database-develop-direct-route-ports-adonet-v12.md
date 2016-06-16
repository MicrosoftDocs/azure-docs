<properties 
	pageTitle="Ports beyond 1433 for SQL Database | Microsoft Azure"
	description="Client connections from ADO.NET to Azure SQL Database V12 sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jhubbard"
	editor="" />


<tags 
	ms.service="sql-database" 
	ms.workload="drivers"
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/25/2016" 
	ms.author="annemill"/>


# Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12


This topic describes the changes that Azure SQL Database V12 brings to the connection behavior of clients that use ADO.NET 4.5 or a later version.


## V11 of SQL Database: Port 1433


When your client program uses ADO.NET 4.5 to connect and query with SQL Database V11, the internal sequence is as follows:


1. ADO.NET attempts to connect to SQL Database.

2. ADO.NET uses port 1433 to call a middleware module, and the middleware connects to SQL Database.

3. SQL Database sends its response back to the middleware, which forwards the response to ADO.NET to port 1433.


**Terminology:** We describe the preceding sequence by saying that ADO.NET interacts with SQL Database by using the *proxy route*. If no middleware were involved we would say the *direct route* was used.


## V12 of SQL Database: Outside vs inside


For connections to V12 we must ask whether your client program runs *outside* or *inside* the Azure cloud boundary. The subsections discusses two common scenarios.


#### *Outside:* Client runs on your desktop computer


Port 1433 is the only port that must be open on your desktop computer that hosts your SQL Database client application.


#### *Inside:* Client runs on Azure


When your client runs inside the Azure cloud boundary, it uses what we can call a *direct route* to interact with the SQL Database server. After a connection is established, further interactions between the client and database involve no middleware proxy.


The sequence is as follows:


1. ADO.NET 4.5 (or later) initiates a brief interaction with the Azure cloud, and receives a dynamically identified port number.
 - The dynamically identified port number is in the range of 11000-11999 or 14000-14999.

2. ADO.NET then connects to the SQL Database server directly, with no middleware in between.

3. Queries are sent directly to the database, and results are returned directly to the client.


Ensure that the port ranges of 11000-11999 and 14000-14999 on your Azure client machine are left available for ADO.NET 4.5 client interactions with SQL Database V12.

- In particular, ports in the range must be free of any other outbound blockers.

- On your Azure VM, the **Windows Firewall with Advanced Security** controls the port settings.
 - You can use the [firewall's user interface](http://msdn.microsoft.com/library/cc646023.aspx) to add a rule for which you specify the **TCP** protocol along with a port range with the syntax like **11000-11999**.


## Version clarifications


This section clarifies the monikers that refer to product versions. It also lists some pairings of versions between products.


#### ADO.NET


- ADO.NET 4.0 supports the TDS 7.3 protocol, but not 7.4.
- ADO.NET 4.5 and later supports the TDS 7.4 protocol.


#### SQL Database V11 and V12


The client connection differences between SQL Database V11 and V12 are highlighted in this topic.


*Note:* The Transact-SQL statement `SELECT @@version;` returns a value that start with a number such as '11.' or '12.', and those match our version names of V11 and V12 for SQL Database.


## Related links


- ADO.NET 4.6 was released on July 20, 2015. A blog announcement from the .NET team is available [here](http://blogs.msdn.com/b/dotnet/archive/2015/07/20/announcing-net-framework-4-6.aspx).


- ADO.NET 4.5 was released on August 15, 2012. A blog announcement from the .NET team is available [here](http://blogs.msdn.com/b/dotnet/archive/2012/08/15/announcing-the-release-of-net-framework-4-5-rtm-product-and-source-code.aspx).
 - A blog post about ADO.NET 4.5.1 is available [here](http://blogs.msdn.com/b/dotnet/archive/2013/06/26/announcing-the-net-framework-4-5-1-preview.aspx).


- [TDS protocol version list](http://www.freetds.org/userguide/tdshistory.htm)


- [SQL Database Development Overview](sql-database-develop-overview.md)


- [Azure SQL Database firewall](sql-database-firewall-configure.md)


- [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md)

