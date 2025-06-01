---
title: Azure Synapse connectivity settings
description: Learn to configure connectivity settings in Azure Synapse Analytics.
author: danzhang-msft
ms.author: danzhang

ms.date: 03/18/2025
ms.service: azure-synapse-analytics
ms.subservice: security
ms.topic: conceptual
---

# Azure Synapse Analytics connectivity settings

This article explains connectivity settings in Azure Synapse Analytics and how to configure them where applicable.

For connection strings to Azure Synapse Analytics pools, see [Connect to Synapse SQL](../sql/connect-overview.md).

The capabilities and Azure portal appearance of configuring a dedicated SQL pool depend on whether it is in a logical SQL server or an Azure Synapse Analytics workspace.

### [Dedicated SQL pools in a workspace](#tab/workspace)

## Public network access

> [!NOTE]
> These settings apply to dedicated SQL pools (formerly SQL DW) in an Azure Synapse analytics workspace. These instructions do not apply dedicated SQL pools (formerly SQL DW) associated with the logical SQL server.

You can use the public network access feature to allow incoming public network connectivity to your Azure Synapse workspace. 

- When public network access is **disabled**, you can connect to your workspace only using [private endpoints](synapse-workspace-managed-private-endpoints.md). 
- When public network access is **enabled**, you can connect to your workspace also from public networks. You can manage this feature both during and after your workspace creation. 

> [!IMPORTANT]
> This feature is only available to Azure Synapse workspaces associated with [Azure Synapse Analytics Managed Virtual Network](synapse-workspace-managed-vnet.md). However, you can still open your Synapse workspaces to the public network regardless of its association with managed VNet.
> 
> When the public network access is disabled, access to GIT mode in Synapse Studio and commit changes won't be blocked as long as the user has enough permission to access the integrated Git repo or the corresponding Git branch. However, the publish button won't work because the access to Live mode is blocked by the firewall settings.
> When the public network access is disabled, the self-hosted integration runtime can still communicate with Synapse. We do not currently support establishing a private link between a self-hosted integration runtime and Synapse control plane.

Selecting the **Disable** option will not apply any firewall rules that you might configure. Additionally, your firewall rules will appear grayed out in the Network setting in Synapse portal. Your firewall configurations are reapplied when you enable public network access again. 

> [!TIP]
> When you revert to enable, allow some time before editing the firewall rules.

### Configure public network access when you create your workspace

1. Select the **Networking** tab when you create your workspace in [Azure portal](https://aka.ms/azureportal).
1. Under Managed virtual network, select **Enable** to associate your workspace with managed virtual network and permit public network access. 
1. Under **Public network access**, select **Disable** to deny public access to your workspace. Select **Enable** if you want to allow public access to your workspace.

   :::image type="content" source="media/connectivity-settings/create-synapse-workspace-public-network-access.png" alt-text="Screenshot from the Azure portal. Create Synapse workspace, networking tab, public network access setting." lightbox="media/connectivity-settings/create-synapse-workspace-public-network-access.png":::

1. Complete the rest of the workspace creation flow.

### Configure public network access after you create your workspace

1. Select your Synapse workspace in [Azure portal](https://aka.ms/azureportal).
1. Select **Networking** from the left navigation.
1. Select **Disabled** to deny public access to your workspace. Select **Enabled** if you want to allow public access to your workspace.

   :::image type="content" source="media/connectivity-settings/synapse-workspace-networking-public-network-access.png" alt-text="Screenshot from the Azure portal. In an existing Synapse workspace, networking tab, public network access setting is enabled." lightbox="media/connectivity-settings/synapse-workspace-networking-public-network-access.png":::

1. When disabled, the **Firewall rules** gray out to indicate that firewall rules are not in effect. Firewall rule configurations will be retained. 
1. Select **Save** to save the change. A notification will confirm that the network setting was successfully saved.

## Minimal TLS version

The serverless SQL endpoint and development endpoint only accept TLS 1.2 and above.

Since December 2021, a minimum level of TLS 1.2 is required for workspace-managed dedicated SQL pools in new Synapse workspaces. You can raise or lower this requirement using the [minimal TLS REST API](/rest/api/synapse/sqlserver/workspace-managed-sql-server-dedicated-sql-minimal-tls-settings/update) for both new Synapse workspaces or existing workspaces, so users who cannot use a higher TLS client version in the workspaces can connect. Customers can also raise the minimum TLS version to meet their security needs. 

> [!IMPORTANT]
> Azure will begin to retire older TLS versions (TLS 1.0 and 1.1) starting in November 2024. Use TLS 1.2 or higher. After March 31, 2025, you will no longer be able to set the minimal TLS version for Azure Synapse Analytics client connections below TLS 1.2.  After this date, sign-in attempts from connections using a TLS version lower than 1.2 will fail. For more information, see [Announcement: Azure support for TLS 1.0 and TLS 1.1 will end](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/).

## Azure Policy

Azure policy to prevent modifications to the networking settings in Synapse Workspace is not currently available.


### [Dedicated SQL pools in a logical SQL server](#tab/logical-sql-server)

## Networking and connectivity

You can change these settings in your [logical server](/azure/azure-sql/database/logical-servers). A logical SQL server can host both Azure SQL databases and standalone dedicated SQL pools not in an Azure Synapse Analytics workspace.

> [!IMPORTANT]
> These settings apply to standalone dedicated SQL pools (formerly SQL DW) associated with the logical server, not in an Azure Synapse Analytics workspace. These instructions do not apply to dedicated SQL pools in an Azure Synapse analytics workspace. 

### Change public network access

It's possible to change the public network access for your standalone dedicated SQL pool via the Azure portal, Azure PowerShell, and the Azure CLI.

> [!NOTE]
> These settings take effect immediately after they're applied. Your customers might experience connection loss if they don't meet the requirements for each setting.

#### Configure public access in the Azure portal

To enable public network access for the logical server hosting your standalone dedicated SQL pool:

1. Go to the Azure portal, and go to the logical server in Azure.
1. Under **Security**, select the **Networking** page.
1. Choose the **Public access** tab, and then set the **Public network access** to **Select networks**.

From this page, you can add a virtual network rule, as well as configure firewall rules for your public endpoint.

Choose the **Private access** tab to configure a [private endpoint](/azure/azure-sql/database/private-endpoint-overview).

#### Configure public access in PowerShell

It's possible to change public network access by using Azure PowerShell.

> [!IMPORTANT]
> The `Az` module replaces `AzureRM`. All future development is for the `Az.Sql` module. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Public Network Access** property at the server level. Provide a strong password to replace `<strong password>` in the following PowerShell sample script.

```powershell
# Get the Public Network Access property
(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).PublicNetworkAccess

# Update Public Network Access to Disabled
$SecureString = ConvertTo-SecureString "<strong password>" -AsPlainText -Force

Set-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group -SqlAdministratorPassword $SecureString -PublicNetworkAccess "Disabled"
```

#### Configure public access in Azure CLI

It's possible to change the public network settings by using the [Azure CLI](/cli/azure/install-azure-cli). 

The following CLI script shows how to change the **Public Network Access** setting in a Bash shell:

```azurecli-interactive

# Get current setting for Public Network Access
az sql server show -n sql-server-name -g sql-server-group --query "publicNetworkAccess"

# Update setting for Public Network Access
az sql server update -n sql-server-name -g sql-server-group --set publicNetworkAccess="Disabled"
```

### Deny public network access

The default for the **Public network access** setting is **Disable**. Customers can choose to connect to a database by using either public endpoints (with IP-based server-level firewall rules or with virtual-network firewall rules), or [private endpoints](/azure/azure-sql/database/private-endpoint-overview) (by using Azure Private Link), as outlined in the [network access overview](/azure/azure-sql/database/network-access-controls-overview).

When **Public network access** is set to **Disable**, only connections from private endpoints are allowed. All connections from public endpoints will be denied with an error message similar to:  

```output
Error 47073
An instance-specific error occurred while establishing a connection to SQL Server. 
The public network interface on this server is not accessible. 
To connect to this server, use the Private Endpoint from inside your virtual network.
```

When **Public network access** is set to **Disable**, any attempts to add, remove, or edit any firewall rules will be denied with an error message similar to:

```output
Error 42101
Unable to create or modify firewall rules when public network interface for the server is disabled. 
To manage server or database level firewall rules, please enable the public network interface.
```

Ensure that **Public network access** is set to **Selected networks** to be able to add, remove, or edit any firewall rules for Azure Synapse Analytics.

## Minimum TLS version

The minimum [Transport Layer Security (TLS)](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) version setting allows customers to choose which version of TLS is in use. It's possible to change the minimum TLS version by using the Azure portal, Azure PowerShell, and the Azure CLI.

After you test to confirm that your applications support it, we recommend setting the minimal TLS version to 1.3. This version includes fixes for vulnerabilities in previous versions and is the highest supported version of TLS for standalone dedicated SQL pools.

### Upcoming retirement changes 

Azure has announced that support for older TLS versions (TLS 1.0, and 1.1) ends August 31, 2025. For more information, see [TLS 1.0 and 1.1 deprecation](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/).

Starting November 2024, you will no longer be able to set the minimal TLS version for Azure Synapse Analytics client connections below TLS 1.2. 

### Configure minimum TLS version 

You can configure the minimum TLS version for client connections by using the Azure portal, Azure PowerShell, or the Azure CLI.

> [!CAUTION]
> - The default for the minimal TLS version is to allow all versions. After you enforce a version of TLS, it's not possible to revert to the default.
> - Enforcing a minimum of TLS 1.3 might cause issues for connections from clients that don't support TLS 1.3 since not all [drivers](/sql/connect/driver-feature-matrix) and operating systems support TLS 1.3.

For customers with applications that rely on older versions of TLS, we recommend setting the minimal TLS version according to the requirements of your applications. If application requirements are unknown or workloads rely on older drivers that are no longer maintained, we recommend not setting any minimal TLS version.

For more information, see [TLS considerations for database connectivity](/azure/azure-sql/database/connect-query-content-reference-guide#tls-considerations-for-database-connectivity).

After you set the minimal TLS version, customers who are using a TLS version lower than the minimum TLS version of the server will fail to authenticate, with the following error:

```output
Error 47072
Login failed with invalid TLS version
```

> [!NOTE]
> The minimum TLS version is enforced at the application layer. Tools that attempt to determine TLS support at the protocol layer might return TLS versions in addition to the minimum required version when run directly against the endpoint.

#### Configure minimum TLS version in the Azure portal

1. Go to the Azure portal, and go to the logical server in Azure.
1. Under **Security**, select the **Networking** page.
1. Choose the **Connectivity** tab. Select the **Minimum TLS Version** desired for all databases associated with the server, and select **Save**.

#### Configure minimum TLS version in PowerShell

It's possible to change the minimum TLS version by using Azure PowerShell. 

> [!IMPORTANT]
> The `Az` module replaces `AzureRM`. All future development is for the `Az.Sql` module. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` the **Minimal TLS Version** property at the logical server level:

```powershell
$serverParams = @{
    ServerName = "sql-server-name"
    ResourceGroupName = "sql-server-group"
}

(Get-AzSqlServer @serverParams).MinimalTlsVersion
```

To `Set` the **Minimal TLS Version** property at the logical server level, substitute your Sql Administrator password for `<strong_password_here_password>`, and execute:

```powershell
$serverParams = @{
    ServerName = "sql-server-name"
    ResourceGroupName = "sql-server-group"
    SqlAdministratorPassword = (ConvertTo-SecureString "<strong_password_here_password>" -AsPlainText -Force)
    MinimalTlsVersion = "1.2"
}
Set-AzSqlServer @serverParams
```

#### Configure minimum TLS version in Azure CLI

It's possible to change the minimum TLS settings by using the Azure CLI. 

> [!IMPORTANT]
> All scripts in this section require the [Azure CLI](/cli/azure/install-azure-cli).


The following CLI script shows how to change the **Minimal TLS Version** setting in a Bash shell:

```azurecli-interactive
# Get current setting for Minimal TLS Version
az sql server show -n sql-server-name -g sql-server-group --query "minimalTlsVersion"

# Update setting for Minimal TLS Version
az sql server update -n sql-server-name -g sql-server-group --set minimalTlsVersion="1.2"
```

## Identify client connections 

You can use the Azure portal and SQL audit logs to identify clients that are connecting using TLS 1.0 and 1.0. 

In the Azure portal, go to **Metrics** under **Monitoring** for your database resource, and then filter by *Successful connections*, and *TLS versions* = `1.0` and `1.1`:
 
You can also query [sys.fn_get_audit_file](/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql) directly within your database to view the `client_tls_version_name` in the audit file.

---

## Connection policy

The connection policy for Synapse SQL in Azure Synapse Analytics is set to **Default**. You cannot change the connection policy for dedicated SQL pools in Azure Synapse Analytics. 

Logins for dedicated SQL pools in Azure Synapse Analytics can land on **any of the individual Gateway IP addresses or Gateway IP address subnets in a region**. For consistent connectivity, allow network traffic to and from **all the individual Gateway IP addresses and Gateway IP address subnets** in a region. Refer to the [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow.

- **Default:** This is the connection policy in effect on all servers after creation unless you explicitly alter the connection policy to either `Proxy` or `Redirect`.  The default policy is: 
   - `Redirect` for all client connections originating inside of Azure (for example, from an Azure Virtual Machine).
   - `Proxy` for all client connections originating outside (for example, connections from your local workstation).
- **Redirect:** Clients establish connections directly to the node hosting the database, leading to reduced latency and improved throughput. For connections to use this mode, clients need to:
  - Allow outbound communication from the client to all Azure SQL IP addresses in the region on ports in the range of 11000 to 11999. Use the Service Tags for SQL to make this easier to manage. If you are using Private Link, see [Use Redirect connection policy with private endpoints](/azure/azure-sql/database/private-endpoint-overview#use-redirect-connection-policy-with-private-endpoints) for the port ranges to allow.
  - Allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.
  - When using the Redirect connection policy, refer to the [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) for a list of your region's IP addresses to allow.
- **Proxy:** In this mode, all connections are proxied via the Azure SQL Database gateways, leading to increased latency and reduced throughput. For connections to use this mode, clients need to allow outbound communication from the client to Azure SQL Database gateway IP addresses on port 1433.
  - When using the Proxy connection policy, allow your region's IP addresses from the list of [Gateway IP addresses](gateway-ip-addresses.md).

## Related content

 - [Azure Synapse Analytics IP firewall rules](synapse-workspace-ip-firewall.md)
 - [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://aka.ms/dedicatedSQLpooldiff)
 - [What is a logical SQL server in Azure SQL Database and Azure Synapse?](/azure/azure-sql/database/logical-servers)