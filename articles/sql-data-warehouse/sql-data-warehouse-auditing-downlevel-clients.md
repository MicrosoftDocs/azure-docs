---
title: SQL Data Warehouse downlevel clients support for data auditing | Microsoft Docs
description: Learn about SQL Data Warehouse downlevel clients support for data auditing
services: sql-data-warehouse
documentationcenter: ''
author: ronortloff
manager: jhubbard
editor: ''

ms.assetid: dfe29ff3-dfeb-4309-83c0-c1a300f4f44e
ms.service: sql-database
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: security
ms.date: 10/31/2016
ms.author: rortloff;barbkess

---
# SQL Data Warehouse -  Downlevel clients support for auditing and Dynamic Data Masking
[Auditing](sql-data-warehouse-auditing-overview.md) works with SQL clients that support TDS redirection.

Any client which implements TDS 7.4 should also support redirection. Exceptions to this include JDBC 4.0 in which the redirection feature is not fully supported and Tedious for Node.JS in which redirection was not implemented.

For "Downlevel clients", i.e. which support TDS version 7.3 and below - the server FQDN in the connection string should be modified:

Original server FQDN in the connection string: <*server name*>.database.windows.net

Modified server FQDN in the connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes:

* .NET 4.0 and below,
* ODBC 10.0 and below.
* JDBC (while JDBC does support TDS 7.4, the TDS redirection feature is not fully supported)
* Tedious (for Node.JS)

**Remark:** The above server FDQN modification may be useful also for applying a SQL Server Level Auditing policy without a need for a configuration step in each database (Temporary mitigation).     

