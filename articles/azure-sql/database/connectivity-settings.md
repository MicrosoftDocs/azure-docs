---
title: Connectivity settings for Azure SQL Database and Azure Synapse Analytics
description: This article explains the Transport Layer Security (TLS) version choice and the Proxy versus Redirect settings for Azure SQL Database and Azure Synapse Analytics.
services: sql-database
ms.service: sql-database
titleSuffix: Azure SQL Database and Azure Synapse Analytics
ms.topic: how-to
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: sstein, vanto
ms.date: 07/06/2020
---

# Azure SQL connectivity settings
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

This article introduces settings that control connectivity to the server for Azure SQL Database and [dedicated SQL pool (formerly SQL DW)](../../synapse-analytics\sql-data-warehouse\sql-data-warehouse-overview-what-is.md) in Azure Synapse Analytics. These settings apply to all SQL Database and dedicated SQL pool (formerly SQL DW) databases associated with the server.

> [!IMPORTANT]
> This article doesn't apply to Azure SQL Managed Instance.

The connectivity settings are accessible from the **Firewalls and virtual networks** screen as shown in the following screenshot:

 ![Screenshot of the connectivity settings window.][1]

> [!NOTE]
> These settings take effect immediately after they're applied. Your customers might experience connection loss if they don't meet the requirements for each setting.

## Deny public network access

When **Deny public network access** is set to **Yes**, only connections via private endpoints are allowed. When this setting is **No** (default), customers can connect by using either public endpoints (with IP-based firewall rules or with virtual-network-based firewall rules) or private endpoints (by using Azure Private Link), as outlined in the [network access overview](network-access-controls-overview.md).

 ![Diagram showing connectivity when Deny public network access is set to yes versus when Deny public network access is set to no.][2]

Any attempts to set **Deny public network access** to **Yes** without any existing private endpoints at the logical server will fail with an error message similar to:  

```output
Error 42102
Unable to set Deny Public Network Access to Yes since there is no private endpoint enabled to access the server.
Please set up private endpoints and retry the operation.
```

> [!NOTE]
> To define virtual network firewall rules on a logical server that has already been configured with private endpoints, set **Deny public network access** to **No**.

When **Deny public network access** is set to **Yes**, only connections via private endpoints are allowed. All connections via public endpoints will be denied with an error message similar to:  

```output
Error 47073
An instance-specific error occurred while establishing a connection to SQL Server. 
The public network interface on this server is not accessible. 
To connect to this server, use the Private Endpoint from inside your virtual network.
```

When **Deny public network access** is set to **Yes**, any attempts to add or update firewall rules will be denied with an error message similar to:

```output
Error 42101
Unable to create or modify firewall rules when public network interface for the server is disabled. 
To manage server or database level firewall rules, please enable the public network interface.
```

## Change public network access via PowerShell

> [!IMPORTANT]
> Azure SQL Database still supports the PowerShell Azure Resource Manager module, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Public Network Access** property at the server level:

```powershell
# Get the Public Network Access property
(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).PublicNetworkAccess

# Update Public Network Access to Disabled
$SecureString = ConvertTo-SecureString "password" -AsPlainText -Force

Set-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group -SqlAdministratorPassword $SecureString -PublicNetworkAccess "Disabled"
```

## Change public network access via CLI

> [!IMPORTANT]
> All scripts in this section require the [Azure CLI](/cli/azure/install-azure-cli).

### Azure CLI in a Bash shell

The following CLI script shows how to change the **Public Network Access** setting in a Bash shell:

```azurecli-interactive

# Get current setting for Public Network Access
az sql server show -n sql-server-name -g sql-server-group --query "publicNetworkAccess"

# Update setting for Public Network Access
az sql server update -n sql-server-name -g sql-server-group --set publicNetworkAccess="Disabled"
```

## Minimal TLS version 

The minimal [Transport Layer Security (TLS)](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) version setting allows customers to choose which version of TLS their SQL database uses.

Currently, we support TLS 1.0, 1.1, and 1.2. Setting a minimal TLS version ensures that newer TLS versions are supported. For example, choosing a TLS version 1.1 means only connections with TLS 1.1 and 1.2 are accepted, and connections with TLS 1.0 are rejected. After you test to confirm that your applications support it, we recommend setting the minimal TLS version to 1.2. This version includes fixes for vulnerabilities in previous versions and is the highest version of TLS that's supported in Azure SQL Database.

> [!IMPORTANT]
> The default for the minimal TLS version is to allow all versions. After you enforce a version of TLS, it's not possible to revert to the default.

For customers with applications that rely on older versions of TLS, we recommend setting the minimal TLS version according to the requirements of your applications. For customers that rely on applications to connect by using an unencrypted connection, we recommend not setting any minimal TLS version.

For more information, see [TLS considerations for SQL Database connectivity](connect-query-content-reference-guide.md#tls-considerations-for-database-connectivity).

After you set the minimal TLS version, login attempts from customers who are using a TLS version lower than the minimal TLS version of the server will fail with the following error:

```output
Error 47072
Login failed with invalid TLS version
```

## Set the minimal TLS version via PowerShell

> [!IMPORTANT]
> Azure SQL Database still supports the PowerShell Azure Resource Manager module, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Minimal TLS Version** property at the logical server level:

```powershell
# Get the Minimal TLS Version property
(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).MinimalTlsVersion

# Update Minimal TLS Version to 1.2
$SecureString = ConvertTo-SecureString "password" -AsPlainText -Force

Set-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group -SqlAdministratorPassword $SecureString  -MinimalTlsVersion "1.2"
```

## Set the minimal TLS version via the Azure CLI

> [!IMPORTANT]
> All scripts in this section require the [Azure CLI](/cli/azure/install-azure-cli).

### Azure CLI in a Bash shell

The following CLI script shows how to change the **Minimal TLS Version** setting in a Bash shell:

```azurecli-interactive
# Get current setting for Minimal TLS Version
az sql server show -n sql-server-name -g sql-server-group --query "minimalTlsVersion"

# Update setting for Minimal TLS Version
az sql server update -n sql-server-name -g sql-server-group --set minimalTlsVersion="1.2"
```

## Change the connection policy

[Connection policy](connectivity-architecture.md#connection-policy) determines how customers connect to Azure SQL Database.

## Change the connection policy via PowerShell

> [!IMPORTANT]
> Azure SQL Database still supports the PowerShell Azure Resource Manager module, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to change the connection policy by using PowerShell:

```powershell
# Get SQL Server ID
$sqlserverid=(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).ResourceId

# Set URI
$id="$sqlserverid/connectionPolicies/Default"

# Get current connection policy
(Get-AzResource -ResourceId $id -ApiVersion 2014-04-01 -Verbose).Properties.ConnectionType

# Update connection policy
Set-AzResource -ResourceId $id -Properties @{"connectionType" = "Proxy"} -f
```

## Change the connection policy via the Azure CLI

> [!IMPORTANT]
> All scripts in this section require the [Azure CLI](/cli/azure/install-azure-cli).

### Azure CLI in a Bash shell

The following CLI script shows how to change the connection policy in a Bash shell:

```azurecli-interactive
# Get SQL Server ID
sqlserverid=$(az sql server show -n sql-server-name -g sql-server-group --query 'id' -o tsv)

# Set URI
ids="$sqlserverid/connectionPolicies/Default"

# Get current connection policy
az resource show --ids $ids

# Update connection policy
az resource update --ids $ids --set properties.connectionType=Proxy
```

### Azure CLI from a Windows command prompt

The following CLI script shows how to change the connection policy from a Windows command prompt (with the Azure CLI installed):

```azurecli
# Get SQL Server ID and set URI
FOR /F "tokens=*" %g IN ('az sql server show --resource-group myResourceGroup-571418053 --name server-538465606 --query "id" -o tsv') do (SET sqlserverid=%g/connectionPolicies/Default)

# Get current connection policy
az resource show --ids %sqlserverid%

# Update connection policy
az resource update --ids %sqlserverid% --set properties.connectionType=Proxy
```

## Next steps

- For an overview of how connectivity works in Azure SQL Database, refer to [Connectivity architecture](connectivity-architecture.md).
- For information on how to change the connection policy for a server, see [conn-policy](/cli/azure/sql/server/conn-policy).

<!--Image references-->
[1]: media/single-database-create-quickstart/manage-connectivity-settings.png
[2]: media/single-database-create-quickstart/manage-connectivity-flowchart.png
