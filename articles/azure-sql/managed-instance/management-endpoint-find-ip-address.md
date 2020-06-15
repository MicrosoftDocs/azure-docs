---
title: Discover management endpoint IP address
titleSuffix: Azure SQL Managed Instance 
description: Learn how to get the Azure SQL Managed Instance management endpoint public IP address and verify its built-in firewall protection
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, carlrab
ms.date: 12/04/2018
---
# Determine the management endpoint IP address - Azure SQL Managed Instance 
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The Azure SQL Managed Instance virtual cluster contains a management endpoint that Azure uses for management operations. The management endpoint is protected with a built-in firewall on the network level and mutual certificate verification on the application level. You can determine the IP address of the management endpoint, but you can't access this endpoint.

To determine the management IP address, do a [DNS lookup](/windows-server/administration/windows-commands/nslookup) on your SQL Managed Instance FQDN: `mi-name.zone_id.database.windows.net`. This will return a DNS entry that's like `trx.region-a.worker.vnet.database.windows.net`. You can then do a DNS lookup on this FQDN with ".vnet" removed. This will return the management IP address. 

This PowerShell code will do it all for you if you replace \<MI FQDN\> with the DNS entry of SQL Managed Instance: `mi-name.zone_id.database.windows.net`:
  
``` powershell
  $MIFQDN = "<MI FQDN>"
  resolve-dnsname $MIFQDN | select -first 1  | %{ resolve-dnsname $_.NameHost.Replace(".vnet","")}
```

For more information about SQL Managed Instance and connectivity, see [Azure SQL Managed Instance connectivity architecture](connectivity-architecture-overview.md).
