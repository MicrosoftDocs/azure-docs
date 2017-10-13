---
title: Ports beyond 1433 for SQL Database | Microsoft Docs
description: Client connections from ADO.NET to Azure SQL Database sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important.
services: sql-database
documentationcenter: ''
author: MightyPen
manager: jhubbard
editor: ''

ms.assetid: 3f17106a-92fd-4aa4-b6a9-1daa29421f64
ms.service: sql-database
ms.custom: develop apps
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/17/2016
ms.author: sstein

---
# Ports beyond 1433 for ADO.NET 4.5
This topic describes the Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version. 

> [!IMPORTANT]
> For information about connectivity architecture, see [Azure SQL Database connectivity architecture](sql-database-connectivity-architecture.md).
>

## Outside vs inside
For connections to Azure SQL Database, we must first ask whether your client program runs *outside* or *inside* the Azure cloud boundary. The subsections discuss two common scenarios.

#### *Outside:* Client runs on your desktop computer
Port 1433 is the only port that must be open on your desktop computer that hosts your SQL Database client application.

#### *Inside:* Client runs on Azure
When your client runs inside the Azure cloud boundary, it uses what we can call a *direct route* to interact with the SQL Database server. After a connection is established, further interactions between the client and database involve no middleware proxy.

The sequence is as follows:

1. ADO.NET 4.5 (or later) initiates a brief interaction with the Azure cloud, and receives a dynamically identified port number.
   
   * The dynamically identified port number is in the range of 11000-11999 or 14000-14999.
2. ADO.NET then connects to the SQL Database server directly, with no middleware in between.
3. Queries are sent directly to the database, and results are returned directly to the client.

Ensure that the port ranges of 11000-11999 and 14000-14999 on your Azure client machine are left available for ADO.NET 4.5 client interactions with SQL Database.

* In particular, ports in the range must be free of any other outbound blockers.
* On your Azure VM, the **Windows Firewall with Advanced Security** controls the port settings.
  
  * You can use the [firewall's user interface](http://msdn.microsoft.com/library/cc646023.aspx) to add a rule for which you specify the **TCP** protocol along with a port range with the syntax like **11000-11999**.

## Version clarifications
This section clarifies the monikers that refer to product versions. It also lists some pairings of versions between products.

#### ADO.NET
* ADO.NET 4.0 supports the TDS 7.3 protocol, but not 7.4.
* ADO.NET 4.5 and later supports the TDS 7.4 protocol.

## Related links
* ADO.NET 4.6 was released on July 20, 2015. A blog announcement from the .NET team is available [here](http://blogs.msdn.com/b/dotnet/archive/2015/07/20/announcing-net-framework-4-6.aspx).
* ADO.NET 4.5 was released on August 15, 2012. A blog announcement from the .NET team is available [here](http://blogs.msdn.com/b/dotnet/archive/2012/08/15/announcing-the-release-of-net-framework-4-5-rtm-product-and-source-code.aspx).
  
  * A blog post about ADO.NET 4.5.1 is available [here](http://blogs.msdn.com/b/dotnet/archive/2013/06/26/announcing-the-net-framework-4-5-1-preview.aspx).
* [TDS protocol version list](http://www.freetds.org/userguide/tdshistory.htm)
* [SQL Database Development Overview](sql-database-develop-overview.md)
* [Azure SQL Database firewall](sql-database-firewall-configure.md)
* [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md)

