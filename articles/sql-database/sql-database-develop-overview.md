<properties
	pageTitle="SQL Database Develop Overview | Microsoft Azure"
	description="Learn about available connectivity libraries and best practices for applications connecting to SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="annemill"
	manager="jhubbard"
	editor="genemi"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="annemill"/>

# SQL Database Development Overview
This article walks through the basic considerations that a developer should be aware of when writing code to connect to Azure SQL Database.

## Language and platform
There are code samples available for a variety of programming languages and platforms. You can find links to the code samples at: 

* More Information: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)

## Resource limitations
Azure SQL Database manages the resources available to a database using two different mechanisms: Resources Governance and Enforcement of Limits.

* More Information: [Azure SQL Database resource limits](sql-database-resource-limits.md)

## Security
Azure SQL Database provides resources for limiting access, protecting data, and monitoring activities on a SQL Database.

* More Information: [Securing your SQL Database](sql-database-security.md)

## Authentication
* Azure SQL Database supports both SQL Server authentication users and logins, as well as [Azure Active Directory authentication](sql-database-aad-authentication.md) users and logins.
* You will need to specify a particular database, instead of defaulting to the *master* database.
* You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database to switch to another database.
* More information: [SQL Database security: Manage database access and login security](sql-database-manage-logins.md)

## Resiliency
When a transient error occurs while connecting to SQL Database, your code should retry the call.  We recommend that retry logic use backoff logic, so that it does not unnecessarily overwhelm the SQL Database with multiple clients retrying simultaneously.

* Code samples:  For code samples that illustrate retry logic, see samples for the language of your choice at: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)
* More information: [Error messages for SQL Database client programs](sql-database-develop-error-messages.md)

## Managing Connections
* In your client connection logic, override the default timeout to be 30 seconds.  The default of 15 seconds is too short for connections that depend on the internet.
* If you are using a [connection pool](http://msdn.microsoft.com/library/8xx3tyca.aspx), be sure to close the connection the instant your program is not actively using it, and is not preparing to reuse it.

## Network Considerations
* On the computer that hosts your client program, ensure the firewall allows outgoing TCP communication on port 1433.  More information: [Configure an Azure SQL Database firewall](sql-database-configure-firewall-settings.md)
* If your client program connects to SQL Database V12 while your client runs on an Azure virtual machine (VM), you must open certain port ranges on the VM. More information: [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)
* Client connections to Azure SQL Database V12 sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important. More information:  [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)

## Data Sharding with Elastic Scale
Elastic Scale simplifies the process of scaling out (and in). 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
* [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)
* [Get Started with Azure SQL Database Elastic Scale Preview](sql-database-elastic-scale-get-started.md)

## Next steps

Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/).
