---
title: Directing Azure traffic to Azure SQL Database and SQL Data Warehouse | Microsoft Docs
description: This document explains the Azure SQL Database and SQL Data Warehouse connectivity architecture from within Azure or from outside of Azure.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: carlrab
manager: craigg
ms.date: 03/12/2019
---
# Azure SQL Connectivity Architecture

This article explains the Azure SQL Database and SQL Data Warehouse connectivity architecture as well as how the different components function to direct traffic to your instance of Azure SQL. These connectivity components function to direct network traffic to the Azure SQL Database or SQL Data Warehouse with clients connecting from within Azure and with clients connecting from outside of Azure. This article also provides script samples to change how connectivity occurs, and the considerations related to changing the default connectivity settings.

> [!IMPORTANT]
> **[Upcoming change] For service endpoint connections to Azure SQL servers, a `Default` connectivity behavior changes to `Redirect`.**
> Customers are advised to create new servers and set existing ones with connection type explicitly set to Redirect (preferable) or Proxy depending on their connectivity architecture.
>
> To prevent connectivity through a service endpoint from breaking in existing environments as a result of this change, we use telemetry do the following:
>
> - For servers that we detect that were accessed through service endpoints before the change, we switch the connection type to `Proxy`.
> - For all other servers, we switch the connection type will be switched to `Redirect`.
>
> Service endpoint users might still be affected in the following scenarios:
>
> - Application connects to an existing server infrequently so our telemetry didn't capture the information about those applications
> - Automated deployment logic creates a SQL Database server assuming that the default behavior for service endpoint connections is `Proxy`
>
> If service endpoint connections could not be established to Azure SQL server, and you are suspecting that you are affected by this change, please verify that connection type is explicitly set to `Redirect`. If this is the case, you have to open VM firewall rules and Network Security Groups (NSG) to all Azure IP addresses in the region that belong to Sql [service tag](../virtual-network/security-overview.md#service-tags) for ports 11000-12000. If this is not an option for you, switch server explicitly to `Proxy`.
> [!NOTE]
> This topic applies to Azure SQL Database servers hosting single databases and elastic pools and SQL Data Warehouse databases. For simplicity, SQL Database is used when referring to both SQL Database and SQL Data Warehouse.

## Connectivity architecture

The following diagram provides a high-level overview of the Azure SQL Database connectivity architecture.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-overview.png)

The following steps describe how a connection is established to an Azure SQL database:

- Clients connect to the gateway, that has a public IP address and listens on port 1433.
- The gateway, depending on the effective connection policy, redirects or proxies the traffic to the right database cluster.
- Inside the database cluster traffic is forwarded to the appropriate Azure SQL database.

## Connection policy

Azure SQL Database supports the following three options for the connection policy setting of a SQL Database server:

- **Redirect (recommended):** Clients establish connections directly to the node hosting the database. To enable connectivity, the clients must allow outbound firewall rules to all Azure IP addresses in the region using Network Security Groups (NSG) with [service tags](../virtual-network/security-overview.md#service-tags)) for ports 11000-12000, not just the Azure SQL Database gateway IP addresses on port 1433. Because packets go directly to the database, latency and throughput have improved performance.
- **Proxy:** In this mode, all connections are proxied via the Azure SQL Database gateways. To enable connectivity, the client must have outbound firewall rules that allow only the Azure SQL Database gateway IP addresses (usually two IP addresses per region). Choosing this mode can result in higher latency and lower throughput, depending on nature of the workload. We highly recommend the `Redirect` connection policy over the `Proxy` connection policy for the lowest latency and highest throughput.
- **Default:** This is the connection policy in effect on all servers after creation unless you explicitly alter the connection policy to either `Proxy` or `Redirect`. The effective policy depends on whether connections originate from within Azure (`Redirect`) or outside of Azure (`Proxy`).

## Connectivity from within Azure

If you are connecting from within Azure your connections have a connection policy of `Redirect` by default. A policy of `Redirect` means that after the TCP session is established to the Azure SQL database, the client session is then redirected to the right database cluster with a change to the destination virtual IP from that of the Azure SQL Database gateway to that of the cluster. Thereafter, all subsequent packets flow directly to the cluster, bypassing the Azure SQL Database gateway. The following diagram illustrates this traffic flow.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-azure.png)

## Connectivity from outside of Azure

If you are connecting from outside Azure, your connections have a connection policy of `Proxy` by default. A policy of `Proxy` means that the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway. The following diagram illustrates this traffic flow.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-onprem.png)

## Azure SQL Database gateway IP addresses

To connect to an Azure SQL database from on-premises resources, you need to allow outbound network traffic to the Azure SQL Database gateway for your Azure region. Your connections only go via the gateway when connecting in `Proxy` mode, which is the default when connecting from on-premises resources.

The following table lists the primary and secondary IPs of the Azure SQL Database gateway for all data regions. For some regions, there are two IP addresses. In these regions, the primary IP address is the current IP address of the gateway and the second IP address is a failover IP address. The failover address is the address to which we might move your server to keep the service availability high. For these regions, we recommend that you allow outbound to both the IP addresses. The second IP address is owned by Microsoft and does not listen in on any services until it is activated by Azure SQL Database to accept connections.

| Region Name | Primary IP address | Secondary IP address |
| --- | --- |--- |
| Australia East | 13.75.149.87 | 40.79.161.1 |
| Australia South East | 191.239.192.109 | 13.73.109.251 |
| Brazil South | 104.41.11.5 | |
| Canada Central | 40.85.224.249 | |
| Canada East | 40.86.226.166 | |
| Central US | 23.99.160.139 | 13.67.215.62 |
| China East 1 | 139.219.130.35 | |
| China East 2 | 40.73.82.1 | |
| China North 1 | 139.219.15.17 | |
| China North 2 | 40.73.50.0 | |
| East Asia | 191.234.2.139 | 52.175.33.150 |
| East US 1 | 191.238.6.43 | 40.121.158.30 |
| East US 2 | 191.239.224.107 | 40.79.84.180 * |
| France Central | 40.79.137.0 | 40.79.129.1 |
| Germany Central | 51.4.144.100 | |
| Germany North East | 51.5.144.179 | |
| India Central | 104.211.96.159 | |
| India South | 104.211.224.146 | |
| India West | 104.211.160.80 | |
| Japan East | 191.237.240.43 | 13.78.61.196 |
| Japan West | 191.238.68.11 | 104.214.148.156 |
| Korea Central | 52.231.32.42 | |
| Korea South | 52.231.200.86 |  |
| North Central US | 23.98.55.75 | 23.96.178.199 |
| North Europe | 191.235.193.75 | 40.113.93.91 |
| South Central US | 23.98.162.75 | 13.66.62.124 |
| South East Asia | 23.100.117.95 | 104.43.15.0 |
| UK South | 51.140.184.11 | |
| West Central US | 13.78.145.25 | |
| West Europe | 191.237.232.75 | 40.68.37.158 |
| West US 1 | 23.99.34.75 | 104.42.238.205 |
| West US 2 | 13.66.226.202 | |
||||

\* **NOTE:** *East US 2* has also a tertiary IP address of `52.167.104.0`.

## Change Azure SQL Database connection policy

To change the Azure SQL Database connection policy for an Azure SQL Database server, use the [conn-policy](https://docs.microsoft.com/cli/azure/sql/server/conn-policy) command.

- If your connection policy is set to `Proxy`, all network packets flow via the Azure SQL Database gateway. For this setting, you need to allow outbound to only the Azure SQL Database gateway IP. Using a setting of `Proxy` has more latency than a setting of `Redirect`.
- If your connection policy is setting `Redirect`, all network packets flow directly to the database cluster. For this setting, you need to allow outbound to multiple IPs.

## Script to change connection settings via PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

> [!IMPORTANT]
> This script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to change the connection policy.

```powershell
# Get SQL Server ID
$sqlserverid=(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).ResourceId

# Set URI
$id="$sqlserverid/connectionPolicies/Default"

# Get current connection policy
(Get-AzResource -ResourceId $id).Properties.connectionType

# Update connection policy
Set-AzResource -ResourceId $id -Properties @{"connectionType" = "Proxy"} -f
```

## Script to change connection settings via Azure CLI

> [!IMPORTANT]
> This script requires the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

The following CLI script shows how to change the connection policy.

```azurecli-interactive
# Get SQL Server ID
sqlserverid=$(az sql server show -n sql-server-name -g sql-server-group --query 'id' -o tsv)

# Set URI
id="$sqlserverid/connectionPolicies/Default"

# Get current connection policy
az resource show --ids $id

# Update connection policy
az resource update --ids $id --set properties.connectionType=Proxy
```

## Next steps

- For information on how to change the Azure SQL Database connection policy for an Azure SQL Database server, see [conn-policy](https://docs.microsoft.com/cli/azure/sql/server/conn-policy).
- For information about Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version, see [Ports beyond 1433 for ADO.NET 4.5](sql-database-develop-direct-route-ports-adonet-v12.md).
- For general application development overview information, see [SQL Database Application Development Overview](sql-database-develop-overview.md).
