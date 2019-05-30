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

## Determine IP address

Let’s assume that Managed Instance host is `mi-demo.xxxxxx.database.windows.net`. Run `nslookup` using the host name.

![Resolving internal host name](./media/sql-database-managed-instance-management-endpoint/01_find_internal_host.png)

Now do another `nslookup` for highlighted name removing the `.vnet.` segment. You’ll get the public IP address when you execute this command.

![Resolving public IP address](./media/sql-database-managed-instance-management-endpoint/02_find_public_ip.png)

## Next steps

For more information about Managed Instances and connectivity, see [Azure SQL Database Managed Instance Connectivity Architecture](sql-database-managed-instance-connectivity-architecture.md).
