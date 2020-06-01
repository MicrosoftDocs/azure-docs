---
title: Connectivity settings for Azure SQL Database and Data Warehouse
description: This document explains TLS version choice and Proxy vs. Redirect setting for Azure SQL Database and Azure Synapse Analytics
services: sql-database
ms.service: sql-database
titleSuffix: Azure SQL Database and SQL Data Warehouse
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: carlrab, vanto
ms.date: 03/09/2020
---

# Azure SQL Connectivity Settings
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

This article introduces settings that control connectivity to the server for Azure SQL Database and Azure Synapse Analytics. These settings apply to **all** SQL Database and Azure Synapse databases associated with the server.

> [!IMPORTANT]
> This article does *not* apply to **Azure SQL Managed Instance**

The connectivity settings are accessible from the **Firewalls and virtual networks** screen as shown in the following screenshot:

 ![Screenshot of connectivity settings][1]

> [!NOTE]
> Once these settings are applied, they **take effect immediately** and may result in connection loss for your clients if they do not meet the requirements for each setting.

## Deny public network access

In the Azure portal, when the **Deny public network access** setting is set to **Yes**, only connections via private endpoints are allowed. When this setting is set to **No**, clients can connect using the private or public endpoint.

Customers can connect to SQL Database using  public endpoints (IP-based firewall rules, VNET based firewall rules) or private endpoints (using Private Link) as outlined in the [network access overview](network-access-controls-overview.md). 

When **Deny public network access** setting is set to **Yes**, only connections via private endpoints are allowed and all connections via public endpoints are denied with an error message similar to:  

```output
Error 47073
An instance-specific error occurred while establishing a connection to SQL Server. 
The public network interface on this server is not accessible. 
To connect to this server, use the Private Endpoint from inside your virtual network.
```

## Change Public Network Access via PowerShell

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Public Network Access** property at the server level:

```powershell
#Get the Public Network Access property
(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).PublicNetworkAccess

# Update Public Network Access to Disabled
$SecureString = ConvertTo-SecureString "password" -AsPlainText -Force

Set-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group -SqlAdministratorPassword $SecureString -PublicNetworkAccess "Enabled"
```

## Change Public Network Access via CLI

> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the **Public Network Access** in a bash shell:

```azurecli-interactive

# Get current setting for Public Network Access
az sql server show -n sql-server-name -g sql-server-group --query "publicNetworkAccess"

# Update setting for Public Network Access
az sql server update -n sql-server-name -g sql-server-group --set publicNetworkAccess="Disabled"

```

## Minimal TLS Version 

The Minimal [Transport Layer Security (TLS)](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) Version setting allows customers to control the version of TLS used by their Azure SQL Database.

At present we support TLS 1.0, 1.1 and 1.2. Setting a Minimal TLS Version ensures that subsequent, newer TLS versions are supported. For example,  e.g.,  choosing  a TLS version greater than 1.1. means only connections with TLS 1.1 and 1.2 are accepted and TLS 1.0 is rejected. After testing to confirm your applications supports the it, we recommend setting minimal TLS version to 1.2 since it includes fixes for vulnerabilities found in previous versions and is the highest version of TLS supported in Azure SQL Database.

For customers with applications that rely on older versions of TLS, we recommend setting the Minimal TLS Version per the requirements of your applications. For customers that rely on applications to connect using an unencrypted connection, we recommend not setting any Minimal TLS Version. 

For more information, see [TLS considerations for SQL Database connectivity](connect-query-content-reference-guide.md#tls-considerations-for-database-connectivity).

After setting the Minimal TLS Version, login attempts from clients that are using a TLS version lower than the Minimal TLS Version of the server will fail with following error:

```output
Error 47072
Login failed with invalid TLS version
```

## Set minimal TLS version via PowerShell

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Minimal TLS Version** property at the logical server level:

```powershell
#Get the Minimal TLS Version property
(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).MinimalTlsVersion

# # Update Minimal TLS Version to 1.2
$SecureString = ConvertTo-SecureString "password" -AsPlainText -Force

Set-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group -SqlAdministratorPassword $SecureString  -MinimalTlsVersion "1.2"
```

## Set Minimal TLS Version via Azure CLI

> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the **Minimal TLS Version** setting in a bash shell:

```azurecli-interactive
# Get current setting for Minimal TLS Version
az sql server show -n sql-server-name -g sql-server-group --query "minimalTlsVersion"

# Update setting for Minimal TLS Version
az sql server update -n sql-server-name -g sql-server-group --set minimalTlsVersion="1.2"
```


## Change connection policy

[Connection policy](connectivity-architecture.md#connection-policy) determines how clients connect to Azure SQL Database.


## Change Connection policy via PowerShell

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to change the connection policy using PowerShell:

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

## Change Connection policy via Azure CLI

> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the connection policy in a bash shell:

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

The following CLI script shows how to change the connection policy from a Windows command prompt (with Azure CLI installed).

```azurecli
# Get SQL Server ID and set URI
FOR /F "tokens=*" %g IN ('az sql server show --resource-group myResourceGroup-571418053 --name server-538465606 --query "id" -o tsv') do (SET sqlserverid=%g/connectionPolicies/Default)

# Get current connection policy
az resource show --ids %sqlserverid%

# Update connection policy
az resource update --ids %sqlserverid% --set properties.connectionType=Proxy
```

## Next steps

- For an overview of how connectivity works in Azure SQL Database, refer to [Connectivity Architecture](connectivity-architecture.md)
- For information on how to change the connection policy for a server, see [conn-policy](https://docs.microsoft.com/cli/azure/sql/server/conn-policy).

<!--Image references-->
[1]: media/single-database-create-quickstart/manage-connectivity-settings.png
