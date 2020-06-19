---
title: Ports beyond 1433
description: Client connections from ADO.NET to Azure SQL Database can bypass the proxy and interact directly with the database using ports other than 1433.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: genemi
ms.date: 06/11/2020
---
# Ports beyond 1433 for ADO.NET 4.5
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This topic describes the Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version.

> [!IMPORTANT]
> For information about connectivity architecture, see [Azure SQL Database connectivity architecture](connectivity-architecture.md).
>

## Outside vs inside

For connections to Azure SQL Database, we must first ask whether your client program runs *outside* or *inside* the Azure cloud boundary. The subsections discuss two common scenarios.

### *Outside:* Client runs on your desktop computer

Port 1433 is the only port that must be open on your desktop computer that hosts your SQL Database client application.

### *Inside:* Client runs on Azure

When your client runs inside the Azure cloud boundary, it uses what we can call a *direct route* to interact with SQL Database. After a connection is established, further interactions between the client and database involve no Azure SQL Database Gateway.

The sequence is as follows:

1. ADO.NET 4.5 (or later) initiates a brief interaction with the Azure cloud, and receives a dynamically identified port number.

   * The dynamically identified port number is in the range of 11000-11999.
2. ADO.NET then connects to SQL Database directly, with no middleware in between.
3. Queries are sent directly to the database, and results are returned directly to the client.

Ensure that the port ranges of 11000-11999 on your Azure client machine are left available for ADO.NET 4.5 client interactions with SQL Database.

* In particular, ports in the range must be free of any other outbound blockers.
* On your Azure VM, the **Windows Firewall with Advanced Security** controls the port settings.
  
  * You can use the [firewall's user interface](/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access) to add a rule for which you specify the **TCP** protocol along with a port range with the syntax like **11000-11999**.

## Version clarifications

This section clarifies the monikers that refer to product versions. It also lists some pairings of versions between products.

### ADO.NET

* ADO.NET 4.0 supports the TDS 7.3 protocol, but not 7.4.
* ADO.NET 4.5 and later supports the TDS 7.4 protocol.

### ODBC

* Microsoft SQL Server ODBC 11 or above

### JDBC

* Microsoft SQL Server JDBC 4.2 or above (JDBC 4.0 actually supports TDS 7.4 but does not implement “redirection”)

## Related links

* ADO.NET 4.6 was released on July 20, 2015. A blog announcement from the .NET team is available [here](https://devblogs.microsoft.com/dotnet/announcing-net-framework-4-6/).
* ADO.NET 4.5 was released on August 15, 2012. A blog announcement from the .NET team is available [here](https://devblogs.microsoft.com/dotnet/announcing-the-release-of-net-framework-4-5-rtm-product-and-source-code/).
  * A blog post about ADO.NET 4.5.1 is available [here](https://devblogs.microsoft.com/dotnet/announcing-the-net-framework-4-5-1-preview/).

* Microsoft® ODBC Driver 17 for SQL Server® - Windows, Linux, & macOS
https://www.microsoft.com/download/details.aspx?id=56567

* Connect to Azure SQL Database V12 via Redirection
https://techcommunity.microsoft.com/t5/DataCAT/Connect-to-Azure-SQL-Database-V12-via-Redirection/ba-p/305362

* [TDS protocol version list](https://www.freetds.org/)
* [SQL Database Development Overview](develop-overview.md)
* [Azure SQL Database firewall](firewall-configure.md)
