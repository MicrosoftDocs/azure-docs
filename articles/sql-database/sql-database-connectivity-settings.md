---
title: Connectivity Settings for Azure SQL Database and Data Warehouse
description: This document explains TLS version choice and Proxy vs. Redirect setting for Azure SQL 
services: sql-database
ms.service: sql-database
titleSuffix: Azure SQL Database and SQL Data Warehouse
ms.topic: conceptual
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: carlrab, vanto
ms.date: 02/11/2020
---

# Azure SQL Connectivity Settings
> [!NOTE]
> This article applies to Azure SQL server, and to both SQL Database and SQL Data Warehouse databases that are created on the Azure SQL server. For simplicity, SQL Database is used when referring to both SQL Database and SQL Data Warehouse.

> [!IMPORTANT]
> This article does *not* apply to **Azure SQL Database Managed Instance**

This article introduces settings that control connectivity to Azure SQL Database at the server level. These settings apply to **all** SQL Database and SQL Data Warehouse databases associated with the server.

> [!NOTE]
Once these settings are applied the take effect immediately and may result in connection loss for your clients if they do not meet the requirements for each setting.

The connectivity settings are accessible from the **Firewalls and virtual networks** tabs as shown in the screenshot below

 ![Screenshot of connectivity settings][1]


## Deny Public Network Access
In Portal, when this setting is set to **Yes**  only connections via private endpoints are allowed. When this setting is set to **No** clients can connect using private or public endpoint.

After setting Public Network Access, login attempts from clients using public endpoint shall fail with 

**Error 18456**
**Login failed due to client TLS version being less than minimum TLS version allowed by the server**


## Change Deny Public Network Access via PowerShell
[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to 
```powershell
# Get SQL Server ID
$sqlserverid=(Get-AzSqlServer -ServerName sql-server-name -ResourceGroupName sql-server-group).ResourceId

# Get current setting for Public Network Access
(Get-AzResource -ResourceId $sqlserverid).Properties.PublicNetworkAccess

# Update Public Network Access to Disabled
Set-AzResource -ResourceId $sqlserverid -Properties @{"PublicNetworkAccess" = "Disabled"} -f
```

## Change Deny Public Network Access via CLI
> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell
The following CLI script shows how to change the connection policy in a bash shell.

```azurecli-interactive
# Get SQL Server ID
sqlserverid=$(az sql server show -n sql-server-name -g sql-server-group --query 'id' -o tsv)

# Get current setting for Public Network Access
az resource show --ids $sqlserverid

# Update connection policy
az resource update --ids $ids --set properties.PublicNetworkAccess= Disabled
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

## Connection policy
[Connection policy](sql-database-connectivity-architecture.md#connection-policy) determines how clients connect to Azure SQL Server. 

## Change Connection policy via PowerShell
[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

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

## Change Connection policy via Azure CLI
> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell
The following CLI script shows how to change the connection policy in a bash shell.

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

## Minimal TLS Version 
Minimal TLS Version allows customer to control the version of  [Transport Layer Security](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) for their Azure SQL Server.

We recommend setting Minimal TLS version to 1.2. For customers with applications that rely on older version of TLS, we recommend setting the Minimal TLS version per requirements for your application. For customers that rely on applications being able to connect unencrypted, we reccomend not setting any Minimal TLS Version. For additional information, refer to [TLS considerations for SQL Database connectivity](sql-database-connect-query.md#tls-considerations-for-sql-database-connectivity)


After setting Minimal TLS version, login attempts from clients that using TLS version less than the Minimal TLS Version of the server shall fail with following error:
**Error 47072**
**Login failed due to client TLS version being less than minimum TLS version allowed by the server**


## Set Minimal TLS Version via PowerShell

## Set Minimal TLS Version via Azure CLI

## Next steps
- For overview of how connectivity work refer to  [Azure SQL Connectivity Architecture](sql-database-connectivity-architecture.md)
- For information on how to change the Azure SQL Database connection policy for an Azure SQL Database server, see [conn-policy](https://docs.microsoft.com/cli/azure/sql/server/conn-policy).

<!--Image references-->
[1]: ./media/sql-database-get-started-portal/manage-connectivity-settings.png