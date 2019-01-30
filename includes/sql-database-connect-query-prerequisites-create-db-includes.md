---
author: MightyPen
ms.service: sql-database
ms.topic: include
ms.date: 01/28/2019	
ms.author: genemi
---

<!-- sql-database-connect-query-prerequisites-create-db-includes.md -->

- An Azure SQL Database placed on [Logical server](https://docs.microsoft.com/azure/sql-database/sql-database-single-index) or [Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-index). You can use one of these techniques to create a database:

| Logical Server | Managed Instance |
| --- | --- |
| [Portal](../articles/sql-database/sql-database-get-started-portal.md) | [Portal](../articles/sql-database/sql-database-managed-instance-get-started.md) |
| [CLI](../articles/sql-database/sql-database-get-started-cli.md) | |
| [PowerShell](../articles/sql-database/sql-database-get-started-powershell.md) | |

- **Logical Server only** - a configured server-level firewall rule that enables you to connect to your logical server. For more information, see [Create server-level firewall rule](../articles/sql-database/sql-database-get-started-portal-firewall.md).
- **Managed Instance only** - configured connection from the computer that is accessing Managed Instance. You can use the following options:
  - [Azure Virtual Machine](../articles/sql-database/sql-database-managed-instance-configure-vm.md) in the same Azure VNet as Managed Instance that can access the instance.
  - [Point-to-site connection](../articles/sql-database/sql-database-managed-instance-configure-p2s.md) on your computer that will enable you to join your computer to the VNet where Managed Instance is placed and use Managed Instance as any other SQL Server in your network.
