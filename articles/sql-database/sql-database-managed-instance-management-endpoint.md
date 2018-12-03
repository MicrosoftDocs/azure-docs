---
title: Discover Azure SQL Database Managed Instance management endpoint | Microsoft Docs
description: Learn how to get Azure SQL Database Managed Instance management endpoint public IP address and verify its built-in firewall protection
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: howto
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: carlrab
manager: craigg
ms.date: 21/3/2018
---

# Discover Azure SQL Database Managed Instance management endpoint 

## Overview
Azure SQL Managed Instance [virtual cluster](sql-database-managed-instance-connectivity-architecture.md) contains management endpoint that Microsoft uses for managing the Instance.  

Management endpoint is protected with built-in firewall on network level and mutual certificate verification on application level. 

When connections are initiated from inside the Managed Instance (CLR, linked server, backup, audit log etc.) it appears that traffic originates from management endpoint public IP address. You could limit access to public services from Managed Instance by setting firewall rules to allow just this IP address.

> [!NOTE]
> This doesn’t apply to setting firewall rules for Azure services that are in the same region as Managed Instance as platform has optimization for the traffic that goes between the services that are collocated. 

This article explains how you could get the management endpoint public IP address as well as how to verify its built-in firewall protection.

## Finding management endpoint public IP address
Let’s assume that MI host is _mi-demo.xxxxxx.database.windows.net_. Run _nslookup_ using the host name.

![Resolving internal host name](./media/sql-database-managed-instance-management-endpoint/01_find_internal_host.png)

Now do another _nslookup_ for highlighted name with removed _.vnet._ segment. You’ll get the public IP address as a result of executing this command.

![Resolving public IP address](./media/sql-database-managed-instance-management-endpoint/02_find_public_ip.png)

## Verifying Managed Instance built-in firewall
Managed Instance [mandatory inbound security rules](sql-database-managed-instance-vnet-configuration.md#mandatory-inbound-security-rules) require management ports 9000, 9003, 1438, 1440, 1452 to be open from Any source on Network Security Group that protects the Managed Instance. Although these ports are open on NSG level they are protected on network level by built-in firewall.

To verify this, you could use any security scanner tool to test these ports. Screenshot below shows how to use one of these tools.

![Verifying built-in firewall](./media/sql-database-managed-instance-management-endpoint/03_verify_firewall.png)
