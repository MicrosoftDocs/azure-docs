---
title: Discover Azure SQL Database Managed Instance management endpoint | Microsoft Docs
description: Learn how to get Azure SQL Database Managed Instance management endpoint public IP address and verify its built-in firewall protection
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, carlrab
manager: craigg
ms.date: 12/04/2018
---
# Determine the management endpoint IP address

The Azure SQL Database Managed Instance virtual cluster contains a management endpoint that Microsoft uses for management operations. The management endpoint is protected with a built-in firewall on the network level and mutual certificate verification on the application level. You can determine the IP address of the management endpoint, but you can't access this endpoint.

To determine the management ip address you do a DNS lookup on your managed instance FQDN i.e. `servername.ID.database.windows.net` this will return a reverse DNS entry that is like `trx.region-a.worker.vnet.database.windows.net`. You can then do a dns lookup on this fqdn with ".vnet" removed and this will return the management ip address. 

This ppwershell will do it all for you if you replace <MI FQDN> by the DNS entry for you managed instance
  
``` powershell
  $MIFQDN = "<MI FQDN>"
  resolve-dnsname $MIFQDN | select -first 1  | %{ resolve-dnsname $_.NameHost.Replace(".vnet","")}
```

For more information about Managed Instances and connectivity, see [Azure SQL Database Managed Instance Connectivity Architecture](sql-database-managed-instance-connectivity-architecture.md).
