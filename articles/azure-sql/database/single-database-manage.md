---
title: Create & manage servers and single databases
description: Learn about creating and managing servers and single databases in Azure SQL Database using the Azure portal, PowerShell, the Azure CLI, Transact-SQL (T-SQL), and Rest-API.  
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: sqldbrb=1, devx-track-azurecli
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/12/2019
---
# Create and manage servers and single databases in Azure SQL Database

You can create and manage servers and single databases in Azure SQL Database using the Azure portal, PowerShell, the Azure CLI, REST API, and Transact-SQL.

## The Azure portal

You can create the resource group for Azure SQL Database ahead of time or while creating the server itself.

### Create a server

To create a server using the [Azure portal](https://portal.azure.com), create a new [server](logical-servers.md) resource from Azure Marketplace. Alternatively, you can create the server when you deploy an Azure SQL Database.

  ![create server](./media/single-database-manage/create-logical-sql-server.png)

### Create a blank or sample database

To create a single Azure SQL Database using the [Azure portal](https://portal.azure.com), choose the Azure SQL Database resource in Azure Marketplace. You can create the resource group and server ahead of time or while creating the single database itself. You can create a blank database or create a sample database based on Adventure Works LT.

  ![create database-1](./media/single-database-manage/create-database-1.png)

> [!IMPORTANT]
> For information on selecting the pricing tier for your database, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).

## Manage an existing server

To manage an existing server, navigate to the server using a number of methods - such as from a specific database page, the **SQL servers** page, or the **All resources** page.

To manage an existing database, navigate to the **SQL databases** page and select the database you wish to manage. The following screenshot shows how to begin setting a server-level firewall for a database from the **Overview** page for a database.

   ![server firewall rule](./media/single-database-manage/server-firewall-rule.png)

> [!IMPORTANT]
> To configure performance properties for a database, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).
> [!TIP]
> For an Azure portal quickstart, see [Create a database in SQL Database in the Azure portal](single-database-create-quickstart.md).

## PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

To create and manage servers, single and pooled databases, and server-level firewalls with Azure PowerShell, use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

> [!TIP]
> For PowerShell example scripts, see [Use PowerShell to create a database in SQL Database and configure a server-level firewall rule](scripts/create-and-configure-database-powershell.md) and [Monitor and scale a database in SQL Database using PowerShell](scripts/monitor-and-scale-database-powershell.md).

| Cmdlet | Description |
| --- | --- |
|[New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase)|Creates a database |
|[Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase)|Gets one or more databases|
|[Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase)|Sets properties for a database, or moves an existing database into an elastic pool|
|[Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase)|Removes a database|
|[New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)|Creates a resource group|
|[New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver)|Creates a  server|
|[Get-AzSqlServer](/powershell/module/az.sql/get-azsqlserver)|Returns information about servers|
|[Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver)|Modifies properties of a server|
|[Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver)|Removes a server|
|[New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule)|Creates a server-level firewall rule |
|[Get-AzSqlServerFirewallRule](/powershell/module/az.sql/get-azsqlserverfirewallrule)|Gets firewall rules for a server|
|[Set-AzSqlServerFirewallRule](/powershell/module/az.sql/set-azsqlserverfirewallrule)|Modifies a firewall rule in a server|
|[Remove-AzSqlServerFirewallRule](/powershell/module/az.sql/remove-azsqlserverfirewallrule)|Deletes a firewall rule from a server.|
| New-AzSqlServerVirtualNetworkRule | Creates a [*virtual network rule*](vnet-service-endpoint-rule-overview.md), based on a subnet that is a Virtual Network service endpoint. |

## The Azure CLI

To create and manage the servers, databases, and firewalls with [the Azure CLI](/cli/azure), use the following [Azure CLI](/cli/azure/sql/db) commands. Use the [Cloud Shell](../../cloud-shell/overview.md) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows. For creating and managing elastic pools, see [Elastic pools](elastic-pool-overview.md).

> [!TIP]
> For an Azure CLI quickstart, see [Create a single Azure SQL Database using the Azure CLI](az-cli-script-samples-content-guide.md). For Azure CLI example scripts, see [Use CLI to create a database in Azure SQL Database and configure a SQL Database firewall rule](scripts/create-and-configure-database-cli.md) and [Use CLI to monitor and scale a database in Azure SQL Database](scripts/monitor-and-scale-database-cli.md).
>

| Cmdlet | Description |
| --- | --- |
|[az sql db create](/cli/azure/sql/db#az_sql_db_create) |Creates a database|
|[az sql db list](/cli/azure/sql/db#az_sql_db_list)|Lists all databases and data warehouses in a server, or all databases in an elastic pool|
|[az sql db list-editions](/cli/azure/sql/db#az_sql_db_list_editions)|Lists available service objectives and storage limits|
|[az sql db list-usages](/cli/azure/sql/db#az_sql_db_list_usages)|Returns database usages|
|[az sql db show](/cli/azure/sql/db#az_sql_db_show)|Gets a database or data warehouse|
|[az sql db update](/cli/azure/sql/db#az_sql_db_update)|Updates a database|
|[az sql db delete](/cli/azure/sql/db#az_sql_db_delete)|Removes a database|
|[az group create](/cli/azure/group#az_group_create)|Creates a resource group|
|[az sql server create](/cli/azure/sql/server#az_sql_server_create)|Creates a server|
|[az sql server list](/cli/azure/sql/server#az_sql_server_list)|Lists servers|
|[az sql server list-usages](/cli/azure/sql/server#az_sql_server_list-usages)|Returns  server usages|
|[az sql server show](/cli/azure/sql/server#az_sql_server_show)|Gets a server|
|[az sql server update](/cli/azure/sql/server#az_sql_server_update)|Updates a server|
|[az sql server delete](/cli/azure/sql/server#az_sql_server_delete)|Deletes a server|
|[az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule#az_sql_server_firewall_rule_create)|Creates a server firewall rule|
|[az sql server firewall-rule list](/cli/azure/sql/server/firewall-rule#az_sql_server_firewall_rule_list)|Lists the firewall rules on a server|
|[az sql server firewall-rule show](/cli/azure/sql/server/firewall-rule#az_sql_server_firewall_rule_show)|Shows the detail of a firewall rule|
|[az sql server firewall-rule update](/cli/azure/sql/server/firewall-rule##az_sql_server_firewall_rule_update)|Updates a firewall rule|
|[az sql server firewall-rule delete](/cli/azure/sql/server/firewall-rule#az_sql_server_firewall_rule_delete)|Deletes a firewall rule|

## Transact-SQL (T-SQL)

To create and manage the servers, databases, and firewalls with Transact-SQL, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to a server in SQL Database and pass Transact-SQL commands. For managing elastic pools, see [Elastic pools](elastic-pool-overview.md).

> [!TIP]
> For a quickstart using SQL Server Management Studio on Microsoft Windows, see [Azure SQL Database: Use SQL Server Management Studio to connect and query data](connect-query-ssms.md). For a quickstart using Visual Studio Code on the macOS, Linux, or Windows, see [Azure SQL Database: Use Visual Studio Code to connect and query data](connect-query-vscode.md).
> [!IMPORTANT]
> You cannot create or delete a server using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current&preserve-view=true)|Creates a new single database. You must be connected to the master database to create a new database.|
| [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current&preserve-view=true) |Modifies a database or elastic pool. |
|[DROP DATABASE](/sql/t-sql/statements/drop-database-transact-sql)|Deletes a database.|
|[sys.database_service_objectives](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database)|Returns the edition (service tier), service objective (pricing tier), and elastic pool name, if any, for Azure SQL Database or a dedicated SQL pool in Azure Synapse Analytics. If logged on to the master database in a server in SQL Database, returns information on all databases. For Azure Synapse Analytics, you must be connected to the master database.|
|[sys.dm_db_resource_stats](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database)| Returns CPU, IO, and memory consumption for a database in Azure SQL Database. One row exists for every 15 seconds, even if there's no activity in the database.|
|[sys.resource_stats](/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database)|Returns CPU usage and storage data for a database in Azure SQL Database. The data is collected and aggregated within five-minute intervals.|
|[sys.database_connection_stats](/sql/relational-databases/system-catalog-views/sys-database-connection-stats-azure-sql-database)|Contains statistics for SQL Database connectivity events, providing an overview of database connection successes and failures. |
|[sys.event_log](/sql/relational-databases/system-catalog-views/sys-event-log-azure-sql-database)|Returns successful Azure SQL Database connections, connection failures, and deadlocks. You can use this information to track or troubleshoot your database activity with SQL Database.|
|[sp_set_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-set-firewall-rule-azure-sql-database)|Creates or updates the server-level firewall settings for your server. This stored procedure is only available in the master database to the server-level principal login. A server-level firewall rule can only be created using Transact-SQL after the first server-level firewall rule has been created by a user with Azure-level permissions|
|[sys.firewall_rules](/sql/relational-databases/system-catalog-views/sys-firewall-rules-azure-sql-database)|Returns information about the server-level firewall settings associated with your database in Azure SQL Database.|
|[sp_delete_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-delete-firewall-rule-azure-sql-database)|Removes server-level firewall settings from your server. This stored procedure is only available in the master database to the server-level principal login.|
|[sp_set_database_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database)|Creates or updates the database-level firewall rules for your database in Azure SQL Database. Database firewall rules can be configured for the master database, and for user databases on SQL Database. Database firewall rules are useful when using contained database users. |
|[sys.database_firewall_rules](/sql/relational-databases/system-catalog-views/sys-database-firewall-rules-azure-sql-database)|Returns information about the database-level firewall settings associated with your database in Azure SQL Database. |
|[sp_delete_database_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-delete-database-firewall-rule-azure-sql-database)|Removes database-level firewall setting from a database. |

## REST API

To create and manage the servers, databases, and firewalls, use these REST API requests.

| Command | Description |
| --- | --- |
|[Servers - Create or update](/rest/api/sql/servers/createorupdate)|Creates or updates a new server.|
|[Servers - Delete](/rest/api/sql/servers/delete)|Deletes a SQL server.|
|[Servers - Get](/rest/api/sql/servers/get)|Gets a server.|
|[Servers - List](/rest/api/sql/servers/list)|Returns a list of servers in a subscription.|
|[Servers - List by resource group](/rest/api/sql/servers/listbyresourcegroup)|Returns a list of servers in a resource group.|
|[Servers - Update](/rest/api/sql/servers/update)|Updates an existing server.|
|[Databases - Create or update](/rest/api/sql/databases/createorupdate)|Creates a new database or updates an existing database.|
|[Databases - Delete](/rest/api/sql/databases/delete)|Deletes a database.|
|[Databases - Get](/rest/api/sql/databases/get)|Gets a database.|
|[Databases - List by elastic pool](/rest/api/sql/databases/listbyelasticpool)|Returns a list of databases in an elastic pool.|
|[Databases - List by server](/rest/api/sql/databases/listbyserver)|Returns a list of databases in a server.|
|[Databases - Update](/rest/api/sql/databases/update)|Updates an existing database.|
|[Firewall rules - Create or update](/rest/api/sql/firewallrules/createorupdate)|Creates or updates a firewall rule.|
|[Firewall rules - Delete](/rest/api/sql/firewallrules/delete)|Deletes a firewall rule.|
|[Firewall rules - Get](/rest/api/sql/firewallrules/get)|Gets a firewall rule.|
|[Firewall rules - List by server](/rest/api/sql/firewallrules/listbyserver)|Returns a list of firewall rules.|

## Next steps

- To learn about migrating a SQL Server database to Azure, see [Migrate to Azure SQL Database](migrate-to-database-from-sql-server.md).
- For information about supported features, see [Features](features-comparison.md).
