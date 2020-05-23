---
title: Verify port security in built-in firewall 
description: Learn how to verify built-in firewall protection in Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: sstein, carlrab
ms.date: 12/04/2018
---
# Verify the Azure SQL Managed Instance built-in firewall
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

The Azure SQL Managed Instance [mandatory inbound security rules](connectivity-architecture-overview.md#mandatory-inbound-security-rules) require management ports 9000, 9003, 1438, 1440, 1452 to be open from **Any source** on the Network Security Group (NSG) that protects the SQL Managed Instance. Although these ports are open at the NSG level, they are protected at the network level by the built-in firewall.

## Verify firewall

To verify these ports, use any security scanner tool to test these ports. The following screenshot shows how to use one of these tools.

![Verifying built-in firewall](./media/management-endpoint-verify-built-in-firewall/03_verify_firewall.png)

## Next steps

For more information about SQL Managed Instances and connectivity, see [Azure SQL Managed Instance Connectivity Architecture](connectivity-architecture-overview.md).
