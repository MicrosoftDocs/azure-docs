---
title: What is a server in Azure SQL Database and Azure Synapse Analytics? 
titleSuffix: ""
description: Learn about logical SQL servers used by Azure SQL Database and Azure Synapse Analytics, and how to manage them. 
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/12/2019
---
# What is a logical SQL server in Azure SQL Database and Azure Synapse?
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

In Azure SQL Database and Azure Synapse Analytics, a server is a logical construct that acts as a central administrative point for a collection of databases. At the server level, you can administer [logins](logins-create-manage.md), [firewall rules](firewall-configure.md), [auditing rules](../../azure-sql/database/auditing-overview.md), [threat detection policies](threat-detection-configure.md), and [auto-failover groups](auto-failover-group-overview.md). A server can be in a different region than its resource group. The server must exist before you can create a database in Azure SQL Database or a data warehouse database in Azure Synapse Analytics. All databases managed by a single server are created within the same region as the server.

This server is distinct from a SQL Server instance that you may be familiar with in the on-premises world. Specifically, there are no guarantees regarding location of the databases or data warehouse database in relation to the server that manages them. Furthermore, neither Azure SQL Database nor Azure Synapse expose any instance-level access or features. In contrast, the instance databases in a managed instance are all physically co-located - in the same way that you are familiar with SQL Server in the on-premises or virtual machine world.

When you create a server, you provide a server login account and password that has administrative rights to the master database on that server and all databases created on that server. This initial account is a SQL login account. Azure SQL Database and Synapse Analytics support SQL authentication and Azure Active Directory Authentication for authentication. For information about logins and authentication, see [Managing Databases and Logins in Azure SQL Database](logins-create-manage.md). Windows Authentication is not supported.

A server in SQL Database and Azure Synapse:

- Is created within an Azure subscription, but can be moved with its contained resources to another subscription
- Is the parent resource for databases, elastic pools, and data warehouses
- Provides a namespace for databases, elastic pools, and data warehouse database
- Is a logical container with strong lifetime semantics - delete a server and it deletes its databases, elastic pools, and SQK pools
- Participates in [Azure role-based access control (RBAC)](/azure/role-based-access-control/overview) - databases, elastic pools, and data warehouse database within a server inherit access rights from the server
- Is a high-order element of the identity of databases, elastic pools, and data warehouse database for Azure resource management purposes (see the URL scheme for databases and pools)
- Collocates resources in a region
- Provides a connection endpoint for database access (`<serverName>`.database.windows.net)
- Provides access to metadata regarding contained resources via DMVs by connecting to a master database
- Provides the scope for management policies that apply to its databases - logins, firewall, audit, threat detection, and such
- Is restricted by a quota within the parent subscription (six servers per subscription by default - [see Subscription limits here](../../azure-resource-manager/management/azure-subscription-service-limits.md))
- Provides the scope for database quota and DTU or vCore quota for the resources it contains (such as 45,000 DTU)
- Is the versioning scope for capabilities enabled on contained resources
- Server-level principal logins can manage all databases on a server
- Can contain logins similar to those in instances of SQL Server in your on-premises environment that are granted access to one or more databases on the server, and can be granted limited administrative rights. For more information, see [Logins](logins-create-manage.md).
- The default collation for all databases created on a server is `SQL_LATIN1_GENERAL_CP1_CI_AS`, where `LATIN1_GENERAL` is English (United States), `CP1` is code page 1252, `CI` is case-insensitive, and `AS` is accent-sensitive.

## Manage servers, databases, and firewalls using the Azure portal

You can create the resource group for a server ahead of time or while creating the server itself. There are multiple methods for getting to a new SQL server form, either by creating a new SQL server or as part of creating a new database.

### Create a blank server

To create a server (without a database, elastic pool, or data warehouse database) using the [Azure portal](https://portal.azure.com), navigate to a blank SQL server (logical SQL server) form.

### Create a blank or sample SQL database in Azure SQL Database

To create a database in SQL Database using the [Azure portal](https://portal.azure.com), navigate to a blank SQL Database form and provide the requested information. You can create the resource group and server ahead of time or while creating the database itself. You can create a blank database or create a sample database based on Adventure Works LT.

  ![create database-1](./media/logical-servers/create-database-1.png)

> [!IMPORTANT]
> For information on selecting the pricing tier for your database, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).

To create a managed instance, see [Create a managed instance](../managed-instance/instance-create-quickstart.md)

### Manage an existing server

To manage an existing server, navigate to the server using a number of methods - such as from specific database page, the **SQL servers** page, or the **All resources** page.

To manage an existing database, navigate to the **SQL databases** page and click the database you wish to manage. The following screenshot shows how to begin setting a server-level firewall for a database from the **Overview** page for a database.

   ![server firewall rule](./media/single-database-create-quickstart/server-firewall-rule.png)

> [!IMPORTANT]
> To configure performance properties for a database, see [DTU-based purchasing model](service-tiers-dtu.md) and [vCore-based purchasing model](service-tiers-vcore.md).
> [!TIP]
> For an Azure portal quickstart, see [Create a database in SQL Database in the Azure portal](single-database-create-quickstart.md).

## Manage servers, databases, and firewalls using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

To create and manage servers, databases, and firewalls with Azure PowerShell, use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). For creating and managing elastic pools, see [Elastic pools](elastic-pool-overview.md).

| Cmdlet | Description |
| --- | --- |
|[New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase)|Creates a database |
|[Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase)|Gets one or more databases|
|[Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase)|Sets properties for a database, or moves an existing database into an elastic pool|
|[Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase)|Removes a database|
|[New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)|Creates a resource group|
|[New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver)|Creates a  server|
|[Get-AzSqlServer](/powershell/module/az.sql/get-azsqlserver)|Returns information about servers|
|[Set-AzSqlServer](https://docs.microsoft.com/powershell/module/az.sql/set-azsqlserver)|Modifies properties of a server|
|[Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver)|Removes a server|
|[New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule)|Creates a server-level firewall rule |
|[Get-AzSqlServerFirewallRule](/powershell/module/az.sql/get-azsqlserverfirewallrule)|Gets firewall rules for a server|
|[Set-AzSqlServerFirewallRule](/powershell/module/az.sql/set-azsqlserverfirewallrule)|Modifies a firewall rule in a server|
|[Remove-AzSqlServerFirewallRule](/powershell/module/az.sql/remove-azsqlserverfirewallrule)|Deletes a firewall rule from a server.|
| New-AzSqlServerVirtualNetworkRule | Creates a [*virtual network rule*](vnet-service-endpoint-rule-overview.md), based on a subnet that is a Virtual Network service endpoint. |

> [!TIP]
> For a PowerShell quickstart, see [Create a database in Azure SQL Database using PowerShell](single-database-create-quickstart.md). For PowerShell example scripts, see [Use PowerShell to create a database in Azure SQL Database and configure a firewall rule](scripts/create-and-configure-database-powershell.md) and [Monitor and scale a database in Azure SQL Database using PowerShell](scripts/monitor-and-scale-database-powershell.md).
>

## Manage servers, databases, and firewalls using the Azure CLI

To create and manage servers, databases, and firewalls with the [Azure CLI](/cli/azure), use the following [Azure CLI SQL Database](/cli/azure/sql/db) commands. Use the [Cloud Shell](/azure/cloud-shell/overview) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows. For creating and managing elastic pools, see [Elastic pools](elastic-pool-overview.md).

| Cmdlet | Description |
| --- | --- |
|[az sql db create](/cli/azure/sql/db#az-sql-db-create) |Creates a database|
|[az sql db list](/cli/azure/sql/db#az-sql-db-list)|Lists all databases managed by a server, or all databases in an elastic pool|
|[az sql db list-editions](/cli/azure/sql/db#az-sql-db-list-editions)|Lists available service objectives and storage limits|
|[az sql db list-usages](/cli/azure/sql/db#az-sql-db-list-usages)|Returns database usages|
|[az sql db show](/cli/azure/sql/db#az-sql-db-show)|Gets a database
|[az sql db update](/cli/azure/sql/db#az-sql-db-update)|Updates a database|
|[az sql db delete](/cli/azure/sql/db#az-sql-db-delete)|Removes a database|
|[az group create](/cli/azure/group#az-group-create)|Creates a resource group|
|[az sql server create](/cli/azure/sql/server#az-sql-server-create)|Creates a server|
|[az sql server list](/cli/azure/sql/server#az-sql-server-list)|Lists servers|
|[az sql server list-usages](/cli/azure/sql/server#az-sql-server-list-usages)|Returns  server usages|
|[az sql server show](/cli/azure/sql/server#az-sql-server-show)|Gets a server|
|[az sql server update](/cli/azure/sql/server#az-sql-server-update)|Updates a server|
|[az sql server delete](/cli/azure/sql/server#az-sql-server-delete)|Deletes a server|
|[az sql server firewall-rule create](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-create)|Creates a server firewall rule|
|[az sql server firewall-rule list](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-list)|Lists the firewall rules on a server|
|[az sql server firewall-rule show](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-show)|Shows the detail of a firewall rule|
|[az sql server firewall-rule update](/cli/azure/sql/server/firewall-rule##az-sql-server-firewall-rule-update)|Updates a firewall rule|
|[az sql server firewall-rule delete](/cli/azure/sql/server/firewall-rule#az-sql-server-firewall-rule-delete)|Deletes a firewall rule|

> [!TIP]
> For an Azure CLI quickstart, see [Create a database in Azure SQL Database using the Azure CLI](az-cli-script-samples-content-guide.md). For Azure CLI example scripts, see [Use the CLI to create a database in Azure SQL Database and configure a firewall rule](scripts/create-and-configure-database-cli.md) and [Use the CLI to monitor and scale a database in Azure SQL Database](scripts/monitor-and-scale-database-cli.md).
>

## Manage servers, databases, and firewalls using Transact-SQL

To create and manage servers, databases, and firewalls with Transact-SQL, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to a server and pass Transact-SQL commands. For managing elastic pools, see [Elastic pools](elastic-pool-overview.md).

> [!IMPORTANT]
> You cannot create or delete a server using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE (Azure SQL Database)](/sql/t-sql/statements/create-database-transact-sql?view=azuresqldb-current) | Creates a new database in Azure SQL Database. You must be connected to the master database to create a new database.|
|[CREATE DATABASE (Azure Synapse)](/sql/t-sql/statements/create-database-transact-sql?view=azure-sqldw-latest) | Creates a new data warehouse database in Azure Synapse. You must be connected to the master database to create a new database.|
| [ALTER DATABASE (Azure SQL Database)](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-current) |Modifies database or elastic pool. |
|[ALTER DATABASE (Azure SQL Data Warehouse)](/t-sql/statements/alter-database-transact-sql?view=azure-sqldw-latest)|Modifies a data warehouse database in Azure Synapse.|
|[DROP DATABASE (Transact-SQL)](/sql/t-sql/statements/drop-database-transact-sql)|Deletes a database.|
|[sys.database_service_objectives (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database)|Returns the edition (service tier), service objective (pricing tier), and elastic pool name, if any, for a database. If logged on to the master database for a server, returns information on all databases. For Azure Synapse, you must be connected to the master database.|
|[sys.dm_db_resource_stats (Azure SQL Database)](/sql/relational-databases/system-dynamic-management-views/sys-dm-db-resource-stats-azure-sql-database)| Returns CPU, IO, and memory consumption for a database in Azure SQL Database. One row exists for every 15 seconds, even if there is no activity in the database.|
|[sys.resource_stats (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-resource-stats-azure-sql-database)|Returns CPU usage and storage data for a database in Azure SQL Database. The data is collected and aggregated within five-minute intervals.|
|[sys.database_connection_stats (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-database-connection-stats-azure-sql-database)|Contains statistics for database connectivity events for Azure SQL Database, providing an overview of database connection successes and failures. |
|[sys.event_log (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-event-log-azure-sql-database)|Returns successful Azure SQL Database database connections, connection failures, and deadlocks for Azure SQL Database. You can use this information to track or troubleshoot your database activity.|
|[sp_set_firewall_rule (Azure SQL Database)](/sql/relational-databases/system-stored-procedures/sp-set-firewall-rule-azure-sql-database)|Creates or updates the server-level firewall settings for your server. This stored procedure is only available in the master database to the server-level principal login. A server-level firewall rule can only be created using Transact-SQL after the first server-level firewall rule has been created by a user with Azure-level permissions|
|[sys.firewall_rules (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-firewall-rules-azure-sql-database)|Returns information about the server-level firewall settings associated with a server.|
|[sp_delete_firewall_rule (Azure SQL Database)](/sql/relational-databases/system-stored-procedures/sp-delete-firewall-rule-azure-sql-database)|Removes server-level firewall settings from a server. This stored procedure is only available in the master database to the server-level principal login.|
|[sp_set_database_firewall_rule (Azure SQL Database)](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database)|Creates or updates the database-level firewall rules for a database in Azure SQL Database. Database firewall rules can be configured for the master database, and for user databases in SQL Database. Database firewall rules are useful when using contained database users. Database firewall rules are not supported in Azure Synapse.|
|[sys.database_firewall_rules (Azure SQL Database)](/sql/relational-databases/system-catalog-views/sys-database-firewall-rules-azure-sql-database)|Returns information about the database-level firewall settings for a database in Azure SQL Database. |
|[sp_delete_database_firewall_rule (Azure SQL Database)](/sql/relational-databases/system-stored-procedures/sp-delete-database-firewall-rule-azure-sql-database)|Removes database-level firewall setting for a database of yours in Azure SQL Database. |

> [!TIP]
> For a quickstart using SQL Server Management Studio on Microsoft Windows, see [Azure SQL Database: Use SQL Server Management Studio to connect and query data](connect-query-ssms.md). For a quickstart using Visual Studio Code on the macOS, Linux, or Windows, see [Azure SQL Database: Use Visual Studio Code to connect and query data](connect-query-vscode.md).

## Manage servers, databases, and firewalls using the REST API

To create and manage servers, databases, and firewalls, use these REST API requests.

| Command | Description |
| --- | --- |
|[Servers - Create or update](https://docs.microsoft.com/rest/api/sql/servers/createorupdate)|Creates or updates a new server.|
|[Servers - Delete](https://docs.microsoft.com/rest/api/sql/servers/delete)|Deletes a server.|
|[Servers - Get](https://docs.microsoft.com/rest/api/sql/servers/get)|Gets a server.|
|[Servers - List](https://docs.microsoft.com/rest/api/sql/servers/list)|Returns a list of servers.|
|[Servers - List by resource group](https://docs.microsoft.com/rest/api/sql/servers/listbyresourcegroup)|Returns a list of servers in a resource group.|
|[Servers - Update](https://docs.microsoft.com/rest/api/sql/servers/update)|Updates an existing server.|
|[Databases - Create or update](https://docs.microsoft.com/rest/api/sql/databases/createorupdate)|Creates a new database or updates an existing database.|
|[Databases - Delete](https://docs.microsoft.com/rest/api/sql/databases/delete)|Deletes a database.|
|[Databases - Get](https://docs.microsoft.com/rest/api/sql/databases/get)|Gets a database.|
|[Databases - List by elastic pool](https://docs.microsoft.com/rest/api/sql/databases/listbyelasticpool)|Returns a list of databases in an elastic pool.|
|[Databases - List by server](https://docs.microsoft.com/rest/api/sql/databases/listbyserver)|Returns a list of databases in a server.|
|[Databases - Update](https://docs.microsoft.com/rest/api/sql/databases/update)|Updates an existing database.|
|[Firewall rules - Create or update](https://docs.microsoft.com/rest/api/sql/firewallrules/createorupdate)|Creates or updates a firewall rule.|
|[Firewall rules - Delete](https://docs.microsoft.com/rest/api/sql/firewallrules/delete)|Deletes a firewall rule.|
|[Firewall rules - Get](https://docs.microsoft.com/rest/api/sql/firewallrules/get)|Gets a firewall rule.|
|[Firewall rules - List by server](https://docs.microsoft.com/rest/api/sql/firewallrules/listbyserver)|Returns a list of firewall rules.|

## Next steps

- To learn about migrating a SQL Server database to Azure SQL Database, see [Migrate to Azure SQL Database](migrate-to-database-from-sql-server.md).
- For information about supported features, see [Features](features-comparison.md).
