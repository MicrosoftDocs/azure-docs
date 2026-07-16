---
title: What is a logical server in Azure Synapse Analytics?
description: Learn about logical servers used by Azure Synapse Analytics and how to manage them.
author: joannapea 
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 05/28/2026
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: concept-article
---

# What is a logical server in Azure Synapse Analytics?

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

This article describes the logical server in Azure used in Azure Synapse Analytics. A logical server can host both Azure SQL databases and standalone dedicated SQL pools not in an Azure Synapse Analytics workspace.

For information about logical servers in Azure SQL Database, see [What is a logical server in Azure SQL Database?](/azure/azure-sql/database/logical-servers?view=azuresql-db&preserve-view=true)

## Overview 

In Azure, a logical SQL server is a logical construct that acts as a central administrative point for a collection of databases. At the logical server level, you can [set up access control](../security/how-to-set-up-access-control.md), [connectivity settings](../security/connectivity-settings.md), [firewall rules](../security/synapse-workspace-ip-firewall.md), and other [security features and threat detection](../guidance/security-white-paper-threat-protection.md).

The logical server must exist before you can create a database in a standalone dedicated SQL pool in Azure Synapse Analytics. Dedicated SQL pools in Azure Synapse Analytics workspaces do not use logical SQL servers.

A logical server in Azure Synapse Analytics:

- Is created within an Azure subscription, but can be moved with its contained resources to another subscription.
- Is the parent resource for dedicated SQL pools.
- Provides a namespace for dedicated SQL pools.
- Is a logical container with strong lifetime semantics - delete a server and it deletes its databases and SQL pools.
- Participates in [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) - dedicated SQL pools within a server inherit access rights from the server.
- Is a high-order element of the identity of dedicated SQL pools for Azure resource management purposes.
- Collocates resources in a region.
- Provides a connection endpoint for database access (`<server-name>.sql.azuresynapse.net`).
- Provides access to metadata regarding contained resources via DMVs by connecting to a `master` database.
- Provides the scope for management policies that apply to its databases - logins, firewall, audit, threat detection, and such.
- Is restricted by a quota within the parent subscription. For more information, see to [subscription limits](/azure/azure-resource-manager/management/azure-subscription-service-limits)).
- Provides the scope for the resources it contains.
- Is the versioning scope for capabilities enabled on contained resources.

This logical server is distinct from a SQL Server instance that you may be familiar with in the on-premises world. Specifically, there are no guarantees regarding location of the dedicated SQL pool in relation to the server that manages them. Azure Synapse doesn't expose any instance-level access or features.

- Creating, altering, or dropping user objects such as tables, views, or stored procedures in the `master` database on a logical server is not supported.
- A logical server can be in a different region than its resource group. All databases managed by a single logical server are created within the same region as the logical server.

The `master` database of a logical server contains logins similar to those in instances of SQL Server that are granted access to one or more databases on the server, and can be granted limited administrative rights. For more information, see [logins](../security/how-to-set-up-access-control.md).

- When you create a logical server, you provide a server login account and password that has administrative rights to the `master` database on that server and all databases created on that server. This initial account is a SQL login account. 
- Azure Synapse Analytics dedicated SQL pools support both SQL authentication and Microsoft Entra authentication. Windows Authentication is not supported.


## Get started

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

- [Quickstart: Create a dedicated SQL pool with Azure CLI](../sql-data-warehouse/create-data-warehouse-azure-cli.md)
- [Quickstart: Create a dedicated SQL pool with Bicep](../sql-data-warehouse/quickstart-bicep.md)
- [Quickstart: Create a dedicated SQL pool with an ARM template](../sql-data-warehouse/quickstart-arm-template.md)    

## Manage servers, databases, and firewalls

You can manage logical servers, dedicated SQL pools, and firewalls by using the Azure portal, Azure PowerShell, the Azure CLI, Transact-SQL (T-SQL) and REST API. 

### [Portal](#tab/portal)

You can create the resource group for a logical server ahead of time or while creating the server itself.

- [Quickstart: Create and query a dedicated SQL pool in the Azure portal](../sql-data-warehouse/create-data-warehouse-portal.md)
- [Quickstart: Create a dedicated SQL pool using Synapse Studio](../quickstart-create-sql-pool-studio.md)

### [PowerShell](#tab/powershell)

You can configure your dedicated SQL pool and logical server using Azure PowerShell. For more information, see [Quickstart: Create a dedicated SQL pool with Azure PowerShell](../sql-data-warehouse/create-data-warehouse-powershell.md).

To create and manage servers, databases, and firewalls with Azure PowerShell, you use the following PowerShell cmdlets. If you need to install or upgrade PowerShell, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). 

> [!IMPORTANT]
> Do not include any personal, sensitive, or confidential information in the server admin login name field.

| Cmdlet | Description |
| --- | --- |
|[New-AzSynapseFirewallRule](/powershell/module/az.synapse/new-azsynapsefirewallrule) | Creates a Synapse Analytics Firewall Rule.|
|[New-AzSynapseSqlDatabase (preview)](/powershell/module/az.synapse/new-azsynapsesqldatabase) | This feature is in a limited preview, initially accessible only to certain subscriptions. Creates a Synapse Analytics SQL database. |
|[New-AzSynapseSqlPool](/powershell/module/az.synapse/new-azsynapsesqlpool) | Creates a Synapse Analytics SQL pool. |

### [Azure CLI](#tab/azure-cli)

To create and manage servers, databases, and firewalls with the [Azure CLI](/cli/azure), use the following [Azure CLI SQL Database](/cli/azure/sql/db) commands. Use the [Cloud Shell](/azure/cloud-shell/overview) to run the CLI in your browser, or [install](/cli/azure/install-azure-cli) it on macOS, Linux, or Windows.

> [!IMPORTANT]
> Do not include any personal, sensitive, or confidential information in the server admin login name field. Data entered in this field is not considered *customer data*.

| Cmdlet | Description |
| --- | --- |
| [az synapse sql](/cli/azure/synapse/sql?view=azure-cli-latest&preserve-view=true)| Manage SQL pools.|
| [az synapse workspace firewall-rule](/cli/azure/synapse/workspace/firewall-rule?view=azure-cli-latest&preserve-view=true)| Manage a workspace's firewall rules. |

### [Transact-SQL](#tab/t-sql)

To create and manage servers, databases, and firewalls with Transact-SQL, use the following T-SQL commands. You can issue these commands using the Azure portal, [SQL Server Management Studio](/sql/ssms/use-sql-server-management-studio), [Visual Studio Code](https://code.visualstudio.com/docs), or any other program that can connect to a server and pass Transact-SQL commands. 

> [!IMPORTANT]
> You cannot create or delete a server using Transact-SQL.

| Command | Description |
| --- | --- |
|[CREATE DATABASE (Azure Synapse)](/sql/t-sql/statements/create-database-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Creates a new dedicated SQL pool in Azure Synapse. You must be connected to the `master` database to create a new database.|
|[ALTER DATABASE (Azure Synapse Analytics)](/sql/t-sql/statements/alter-database-transact-sql?view=azure-sqldw-latest&preserve-view=true&tabs=sqlpool)|Modifies a dedicated SQL pool in Azure Synapse.|
|[sys.database_service_objectives](/sql/relational-databases/system-catalog-views/sys-database-service-objectives-azure-sql-database)|Returns the edition (service tier), service objective (pricing tier). For Azure Synapse, you must be connected to the `master` database. If logged on to the `master` database for a server, returns information on all databases.|
|[sp_set_firewall_rule ](/sql/relational-databases/system-stored-procedures/sp-set-firewall-rule-azure-sql-database)|Creates or updates the server-level firewall settings for your server. This stored procedure is only available in the `master` database to the server-level principal login. A server-level firewall rule can only be created using Transact-SQL after the first server-level firewall rule has been created by a user with Azure-level permissions|
|[sp_delete_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-delete-firewall-rule-azure-sql-database)|Removes server-level firewall settings from a server. This stored procedure is only available in the `master` database to the server-level principal login.|

### [REST API](#tab/rest-api)

To create and manage servers, databases, and firewalls, use these REST API requests.

| Command | Description |
| --- | --- |
|[Sql Pools](/rest/api/synapse/resourcemanager/sql-pools) | Synapse SQL pool management. |
|[Ip Firewall Rules](/rest/api/synapse/resourcemanager/ip-firewall-rules) | Synapse Ip firewall rule management. |

---

## Next step

> [!div class="nextstepaction"]
> [Get Started with Azure Synapse Analytics](../get-started.md)

## Related content

- [Difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics workspaces](overview-difference-between-formerly-sql-dw-workspace.md)
- [Connection strings for SQL pools in Azure Synapse](../sql-data-warehouse/sql-data-warehouse-connection-strings.md)
- [Azure Synapse Analytics connectivity settings](../security/connectivity-settings.md)
- [Data Warehouse Units (DWUs) for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../sql-data-warehouse/what-is-a-data-warehouse-unit-dwu-cdwu.md)
- [Azure Synapse IP firewall rules](firewall-configure.md)