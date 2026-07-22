---
title: IP Firewall Rules
titleSuffix: Azure Synapse Analytics
description: Configure server-level IP firewall rules for a database in Azure Synapse Analytics firewall.
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 05/28/2026
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: how-to
---
# Azure Synapse IP firewall rules

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

When you create a new logical server in Azure Synapse Analytics named *mysqlserver*, for example, a server-level firewall blocks all access to the public endpoint for the [logical server](logical-servers.md). Azure Synapse supports server-level IP firewall rules. Dedicated SQL pools in Azure Synapse Analytics workspaces do not use logical SQL servers, and have a workspace-level firewall.

- For information about server and database IP firewall rules in Azure SQL Database, see [Azure SQL Database IP firewall rules](/azure/azure-sql/database/firewall-configure?view=azuresql-db&preserve-view=true)
- For information about network configuration for Azure SQL Managed Instance, see [Connect your application to Azure SQL Managed Instance](/azure/azure-sql/managed-instance/connect-application-instance?view=azuresql-mi&preserve-view=true).

## How the firewall works

Connection attempts from the internet and Azure must pass through the firewall before they reach your server or database

### Server-level IP firewall rules

These rules enable clients to access your entire server, that is, all the databases managed by the server. The rules are stored in the `master` database. The maximum number of server-level IP firewall rules is limited to 256 for a server. If you have the **Allow Azure Services and resources to access this server** setting enabled, this counts as a single firewall rule for the server.

You can configure server-level IP firewall rules by using the Azure portal, PowerShell, or Transact-SQL statements.

> [!NOTE]  
> The maximum number of server-level IP firewall rules is limited to 256 when configuring using the Azure portal.

- To use the portal or PowerShell, you must be the subscription owner or a subscription contributor.
- To use Transact-SQL, you must connect to the `master` database as the server-level principal login or as the Microsoft Entra administrator. (A server-level IP firewall rule must first be created by a user who has Azure-level permissions.)

> [!NOTE]  
> By default, during creation of a new logical SQL server from the Azure portal, the **Allow Azure Services and resources to access this server** setting is set to **No**.

### Recommendations for how to set firewall rules

Use server-level IP firewall rules for when you have many databases that have the same access requirements, and you don't want to configure each database individually.

### Connections from the internet

When a computer tries to connect to your server from the internet, the firewall first checks the originating IP address of the request.

- If the address is within a range that's in the server-level IP firewall rules, the connection is granted.
    - Server-level IP firewall rules apply to all databases managed by the server.
- If the address isn't within a range that's in any of the server-level IP firewall rules, the connection request fails.

## Permissions

To create and manage IP firewall rules, you need to have one of the following roles:

- in the [SQL Server Contributor](/azure/role-based-access-control/built-in-roles#sql-server-contributor) role
- in the [SQL Security Manager](/azure/role-based-access-control/built-in-roles#sql-security-manager) role
- the owner of the resource

## Create and manage IP firewall rules

You create the first server-level firewall setting by using the [Azure portal](https://portal.azure.com/) or programmatically by using [Azure PowerShell](/powershell/module/az.sql), [Azure CLI](/cli/azure/sql/server/firewall-rule), or an Azure [REST API](/rest/api/sql/firewall-rules/create-or-update). You create and manage additional server-level IP firewall rules by using these methods or Transact-SQL. Azure Synapse only supports server-level IP firewall rules. It doesn't support database-level IP firewall rules.

> [!TIP]  
> You can use [Auditing for Azure Synapse Analytics](/azure/azure-sql/database/auditing-overview?view=azure-sqldw-latest&preserve-view=true) to audit server-level and database-level firewall changes.

### Use the Azure portal to manage server-level IP firewall rules

To set a server-level IP firewall rule in the Azure portal, go to the **Overview** page of your logical server.

1. Go to the **Networking** page.

1. Add a rule in the **Firewall rules** section to add the IP address of the computer that you're using, and then select **Save**. A server-level IP firewall rule is created for your current IP address.

### Use Transact-SQL to manage IP firewall rules

| Catalog view or stored procedure | Level | Description |
| --- | --- | --- |
| [sp_set_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-set-firewall-rule-azure-sql-database?view=azure-sqldw-latest&preserve-view=true) | Server | Creates or updates server-level IP firewall rules |
| [sp_delete_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-delete-firewall-rule-azure-sql-database?view=azure-sqldw-latest&preserve-view=true) | Server | Removes server-level IP firewall rules |

To add a server-level IP firewall rule.

```sql
EXECUTE sp_set_firewall_rule @name = N'ContosoFirewallRule',
   @start_ip_address = '192.168.1.1', @end_ip_address = '192.168.1.10'
```

To delete a server-level IP firewall rule, execute the `sp_delete_firewall_rule` stored procedure. The following example deletes the rule `ContosoFirewallRule`:

```sql
EXECUTE sp_delete_firewall_rule @name = N'ContosoFirewallRule'
```

### Use PowerShell to manage server-level IP firewall rules

> [!NOTE]
> This article uses the Azure Az PowerShell module, which is the recommended PowerShell module for interacting with Azure. To get started with the Az PowerShell module, see [Install Azure PowerShell](/powershell/azure/install-az-ps). To learn how to migrate to the Az PowerShell module, see [Migrate Azure PowerShell from AzureRM to Az](/powershell/azure/migrate-from-azurerm-to-az).

> [!IMPORTANT]  
> The PowerShell Azure Resource Manager (AzureRM) module was deprecated on February 29, 2024. All future development should use the Az.Sql module. Users are advised to migrate from AzureRM to the Az PowerShell module to ensure continued support and updates. The AzureRM module is no longer maintained or supported. The arguments for the commands in the Az PowerShell module and in the AzureRM modules are substantially identical. For more about their compatibility, see [Introducing the new Az PowerShell module](/powershell/azure/new-azureps-module-az).

| Cmdlet | Level | Description |
| --- | --- | --- |
| [Get-AzSynapseFirewallRule](/powershell/module/az.synapse/get-AzSynapseFirewallRule) | Server | Returns Synapse Analytics firewall rules. |
| [New-AzSynapseFirewallRule](/powershell/module/az.synapse/new-azsynapsefirewallrule) | Server | Creates a Synapse Analytics firewall rule.|
| [Remove-AzSynapseFirewallRule](/powershell/module/az.synapse/remove-AzSynapseFirewallRule) | Server | Removes a Synapse Analytics firewall rule. |
| [Update-AzSynapseFirewallRule](/powershell/module/az.synapse/update-azsynapsefirewallrule) | Server | Updates a Synapse Analytics firewall rule.

### Use CLI to manage server-level IP firewall rules

| Cmdlet | Level | Description |
| --- | --- | --- |
| [az synapse sql](/cli/azure/synapse/sql?view=azure-cli-latest&preserve-view=true) | Manage SQL pools.|
| [az synapse workspace firewall-rule](/cli/azure/synapse/workspace/firewall-rule?view=azure-cli-latest&preserve-view=true) | Manage a workspace's firewall rules. |


For workspace-level firewall rules, see:

| Cmdlet | Level | Description |
| --- | --- | --- |
| [az synapse workspace firewall-rule create](/cli/azure/synapse/workspace/firewall-rule#az-synapse-workspace-firewall-rule-create) | Server | Create a firewall rule |
| [az synapse workspace firewall-rule delete](/cli/azure/synapse/workspace/firewall-rule#az-synapse-workspace-firewall-rule-delete) | Server | Delete a firewall rule |
| [az synapse workspace firewall-rule list](/cli/azure/synapse/workspace/firewall-rule#az-synapse-workspace-firewall-rule-list) | Server | List all firewall rules |
| [az synapse workspace firewall-rule show](/cli/azure/synapse/workspace/firewall-rule#az-synapse-workspace-firewall-rule-show) | Server | Get a firewall rule |
| [az synapse workspace firewall-rule update](/cli/azure/synapse/workspace/firewall-rule#az-synapse-workspace-firewall-rule-update) | Server | Update a firewall rule |
| [az synapse workspace firewall-rule wait](/cli/azure/synapse/workspace/firewall-rule##az-synapse-workspace-firewall-rule-wait) | Server | Place the CLI in a waiting state until a condition of a firewall rule is met |

The following example uses CLI to set a server-level IP firewall rule in Azure Synapse:

```azurecli-interactive
az synapse workspace firewall-rule create --name AllowAllWindowsAzureIps --workspace-name $workspacename --resource-group $resourcegroupname --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

### Use a REST API to manage server-level IP firewall rules

| Command | Description |
| --- | --- |
|[Sql Pools](/rest/api/synapse/resourcemanager/sql-pools) | Synapse SQL pool management. |
|[Ip Firewall Rules](/rest/api/synapse/resourcemanager/ip-firewall-rules) | Synapse Ip firewall rule management. |

## Understanding the latency of firewall updates

The server authentication model has a latency of 5 minutes for all changes to security settings, unless the database is contained and without a failover partner. Changes made to contained databases without a failover partner are instantaneous. For contained databases with a failover partner, each security update is instantaneous on the primary database, but the secondary database can take up to 5 minutes to reflect the changes. 

The following table describes the latency of security settings changes based on database type and failover configuration:

| Authentication model  | Failover configured | Latency for security settings changes | Latent instances |
|-----------------------|---------------------|--------------------------------------|------------------|
| Server authentication | Yes                 | 5 minutes                            | all databases     |
| Server authentication | No                  | 5 minutes                            | all databases     |
| Contained database    | Yes                 | 5 minutes                            | the secondary database |
| Contained database    | No                  | none                                 | none             |

## Manually refreshing firewall rules

If you need to see firewall rules updated more quickly than the 5 minute latency, you can manually refresh the firewall rules. Log in to the database instance that needs its rules updated, and run DBCC FLUSHAUTHCACHE.  This will cause the database instance to flush its local cache and refresh firewall rules.
```syntaxsql
DBCC FLUSHAUTHCACHE[;]
```

## Troubleshoot the firewall

Consider the following points when access doesn't behave as you expect.

- **Local firewall configuration:**

  Before your computer can access your dedicated SQL pool, you might need to create a firewall exception on your computer for TCP port 1433. To make connections inside the Azure cloud boundary, you might have to open additional ports.

- **Network address translation:**

  Because of network address translation (NAT), the IP address that's used by your computer to connect to Azure Synapse Analytics might be different than the IP address in your computer's IP configuration settings. To view the IP address that your computer is using to connect to Azure:

    1. Sign in to the portal.
    1. Go to the **Configure** tab on the server that hosts your database.
    1. The **Current Client IP Address** is displayed in the **Allowed IP Addresses** section. Select **Add** for **Allowed IP Addresses** to allow this computer to access the server.

- **Changes to the allow list haven't taken effect yet:**

  There might be up to a five-minute delay for changes to the Azure Synapse Analytics firewall configuration to take effect.

- **The login isn't authorized, or an incorrect password was used:**

  If a login doesn't have permissions on the server or the password is incorrect, the connection to the server is denied. Creating a firewall setting only gives clients an *opportunity* to try to connect to your server. The client must still provide the necessary security credentials. For more information, see [Azure Synapse Analytics connectivity settings](../security/connectivity-settings.md).

- **Dynamic IP address:**

  If you have an internet connection that uses dynamic IP addressing and you have trouble getting through the firewall, try one of the following solutions:

  - Ask your internet service provider for the IP address range that's assigned to your client computers that access the server. Add that IP address range as an IP firewall rule.
  - Get static IP addressing instead for your client computers. Add the IP addresses as IP firewall rules.

## Related content

- [Connection strings for SQL pools in Azure Synapse](../sql-data-warehouse/sql-data-warehouse-connection-strings.md)
- [Azure Synapse Analytics connectivity settings](../security/connectivity-settings.md)
