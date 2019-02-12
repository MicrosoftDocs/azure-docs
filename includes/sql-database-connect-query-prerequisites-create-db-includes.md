---
author: MightyPen
ms.service: sql-database
ms.topic: include
ms.date: 02/12/2019	
ms.author: genemi
---

<!-- sql-database-connect-query-prerequisites-create-db-includes.md -->

- An Azure SQL database. You can use one of these quickstarts to create a database:

|| Single database | Managed instance |
| --- | --- |
| Create| [Portal](../articles/sql-database/sql-database-get-started-portal.md) | [Portal](../articles/sql-database/sql-database-managed-instance-get-started.md) |
|| [CLI](../articles/sql-database/sql-database-get-started-cli.md) | [CLI](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) |
|| [PowerShell](../articles/sql-database/sql-database-get-started-powershell.md) | [PowerShell](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/) |
| Configure | [Server-level IP firewall rule](../articles/sql-database/sql-database-server-level-firewall-rule.md)| [Connectivity from a VM](../articles/sql-database/sql-database-managed-instance-configure-vm.md)|
|||[Connectivity from on-site](../articles/sql-database/sql-database-managed-instance-configure-p2s.md)
|Load data|Adventure Works loaded per quickstart|[Restore Wide World Importers](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-get-started-restore)
|||Restore or import Adventure Works from [BACPAC](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-import) file from [github](https://github.com/Microsoft/sql-server-samples/tree/master/samples/databases/adventure-works)|
|||

> [!IMPORTANT]
> The scripts in this article are written to use the Adventure Works database. With a managed instance, you must either import the Adventure Works database into an instance database or modify the scripts in this article to use the Wide World Importers database.