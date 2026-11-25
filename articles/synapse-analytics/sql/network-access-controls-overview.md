---
title: Network Access Controls
titleSuffix: Azure Synapse Analytics
description: Understand network access controls for dedicated and serverless SQL pools in Azure Synapse Analytics.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Azure Synapse Analytics network access controls

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

Azure Synapse Analytics provides public and private network access controls for Synapse SQL. The available controls depend on whether the SQL pool is in a Synapse workspace or is a standalone dedicated SQL pool (formerly SQL DW).


When you create a new SQL server for Azure Synapse Analytics, you get a public endpoint in the format: `yourservername.database.windows.net`.
By default, the logical server denies all connections to ensure security. Use one or more of the following network access controls to selectively allow access to a database via the **public endpoint**:

- **IP based firewall rules**: Use this feature to explicitly allow connections from a specific IP address. For example, allow on-premises machines or a range of IP addresses by specifying the start and end IP address.

- **Allow Azure services and resources to access this server**: When enabled, other resources within the Azure boundary can access the server.


You can also allow **private access** to the database from [virtual networks](/azure/virtual-network/virtual-networks-overview) via:

- **Virtual network firewall rules**: Use this feature to allow traffic from a specific virtual network within the Azure boundary.

- **Private Link**: Use this feature to create a private endpoint for the SQL server within a specific virtual network.
## IP firewall rules

IP-based firewall rules are a feature of the logical server in Azure that prevents all access to your server until you explicitly add IP addresses of the client machines.


There are two types of firewall rules:
- **Server-level firewall rules**: These rules apply to all databases on the server. You can configure them through the Azure portal, PowerShell, or T-SQL commands like [sp_set_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-set-firewall-rule-azure-sql-database?view=azure-sqldw-latest&preserve-view=true).
- **Database-level firewall rules**: These rules apply to individual databases and can **only** be configured using T-SQL commands like [sp_set_database_firewall_rule](/sql/relational-databases/system-stored-procedures/sp-set-database-firewall-rule-azure-sql-database?view=azure-sqldw-latest&preserve-view=true).

The following constraints apply to naming firewall rules:

- The firewall rule name can't be empty.
- It can't contain the following characters: `<, >, *, %, &, :, \\, /, ?.`
- It can't end with a period (.).
- The firewall rule name can't exceed 128 characters.

If you try to create firewall rules that don't meet these constraints, you get an error message. It can take up to five minutes for modifications to existing IP-based firewall rules to take effect.

## SQL pools in a Synapse workspace

A Synapse workspace exposes dedicated SQL, serverless SQL, and development endpoints. Workspace-level network settings protect these endpoints together.

- **IP firewall rules** allow public connections from specific client IPv4 addresses or ranges. Workspace firewall rules apply to the dedicated SQL, serverless SQL, and development endpoints. Synapse workspaces support server-level rules only, not database-level firewall rules. For configuration steps, see [Azure Synapse Analytics IP firewall rules](../security/synapse-workspace-ip-firewall.md).
- **Allow Azure services and resources to access this workspace** permits connections from Azure resources outside your subscription. Enable it only when required, and use database authentication and authorization to restrict access.
- **Public network access** controls whether the workspace accepts traffic from public networks. When public network access is disabled, clients must use private endpoints. For more information, see [Azure Synapse Analytics connectivity settings](../security/connectivity-settings.md).
- **Private endpoints** assign private IP addresses in your virtual network to the workspace's dedicated SQL, serverless SQL, or development endpoint. For more information, see [Azure Private Link for Azure Synapse Analytics](private-endpoint-overview.md).
- **Managed private endpoints** provide outbound private connectivity from a managed workspace virtual network to approved Azure resources. For more information, see [Azure Synapse Analytics managed private endpoints](../security/synapse-workspace-managed-private-endpoints.md).

## Standalone dedicated SQL pools

A standalone dedicated SQL pool is hosted by a [logical server](logical-servers.md). The logical server denies public connections until you configure access.

- **IP firewall rules** allow selected public client addresses or ranges. For configuration steps, see [Azure Synapse IP firewall rules](firewall-configure.md).
- **Allow Azure services and resources to access this server** creates a server-level rule from `0.0.0.0` to `0.0.0.0`. This setting permits connections from Azure resources outside your subscription, so enable it only when required.
- **Virtual network rules** allow traffic from selected virtual network subnets through service endpoints. [Virtual network service endpoints and rules](vnet-service-endpoint-rule-overview.md) are easier alternatives to establish and manage access from a specific subnet that contains your VMs.
- **Private Link** exposes the logical server through a private endpoint in your virtual network. A [private endpoint](private-endpoint-overview.md) is a private IP address within a specific [virtual network](/azure/virtual-network/virtual-networks-overview) and subnet.
- **Public network access** can be disabled after private connectivity is configured. When disabled, firewall and virtual network rules don't permit public connections.


## Sql Service Tag

You can use [service tags](/azure/virtual-network/service-tags-overview) in security rules and routes from clients to a SQL database. You can use service tags in network security groups, Azure Firewall, and user-defined routes by specifying them in the source or destination field of a security rule.  
The `Sql` service tag consists of all IP addresses that Azure Synapse Analytics uses for a SQL database. The tag is segmented by region. For example, `Sql.WestUS` lists all the IP addresses in the West US Azure region.

The `Sql` service tag consists of IP addresses that are required to establish connectivity.

## Related content

- [Azure Private Link for Azure Synapse Analytics](private-endpoint-overview.md)
- [Connect to Synapse SQL](connect-overview.md)
- [Azure Synapse Analytics security white paper: Network security](../guidance/security-white-paper-network-security.md)
