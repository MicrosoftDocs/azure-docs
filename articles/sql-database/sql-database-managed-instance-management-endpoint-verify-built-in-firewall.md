---
title: Discover Azure SQL Database Managed Instance built-in firewall | Microsoft Docs
description: Learn how to verify built-in firewall protection in Azure SQL Database Managed Instance.
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
# Verifying the Managed Instance built-in firewall

The Managed Instance [mandatory inbound security rules](sql-database-managed-instance-connectivity-architecture.md#mandatory-inbound-security-rules) require management ports 9000, 9003, 1438, 1440, 1452 to be open from **Any source** on the Network Security Group (NSG) that protects the Managed Instance. Although these ports are open at the NSG level, they are protected at the network level by the built-in firewall.

## Verify firewall

To verify these ports, use any security scanner tool to test these ports. The following screenshot shows how to use one of these tools.

![Verifying built-in firewall](./media/sql-database-managed-instance-management-endpoint/03_verify_firewall.png)

## Next steps

For more information about Managed Instances and connectivity, see [Azure SQL Database Managed Instance Connectivity Architecture](sql-database-managed-instance-connectivity-architecture.md).