---
title: Configure minimal TLS version - managed instance
description: "Learn how to configure minimal TLS version for managed instance"
services: sql-database
ms.service: sql-managed-instance
ms.subservice: security
ms.custom: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: 
ms.date: 05/25/2020
---
# Configure minimal TLS version in Azure SQL Managed Instance
The Minimal [Transport Layer Security (TLS)](https://support.microsoft.com/help/3135244/tls-1-2-support-for-microsoft-sql-server) Version setting allows customers to control the version of TLS used by their Azure SQL Managed Instance.

At present we support TLS 1.0, 1.1 and 1.2. Setting a Minimal TLS Version ensures that subsequent, newer TLS versions are supported. For example,  e.g.,  choosing  a TLS version greater than 1.1. means only connections with TLS 1.1 and 1.2 are accepted and TLS 1.0 is rejected. After testing to confirm your applications supports the it, we recommend setting minimal TLS version to 1.2 since it includes fixes for vulnerabilities found in previous versions and is the highest version of TLS supported in Azure SQL Managed Instance.

For customers with applications that rely on older versions of TLS, we recommend setting the Minimal TLS Version per the requirements of your applications. For customers that rely on applications to connect using an unencrypted connection, we recommend not setting any Minimal TLS Version. 

For more information, see [TLS considerations for SQL Database connectivity](../database/connect-query-content-reference-guide.md#tls-considerations-for-database-connectivity).

After setting the Minimal TLS Version, login attempts from clients that are using a TLS version lower than the Minimal TLS Version of the server will fail with following error:

```output
Error 47072
Login failed with invalid TLS version
```

## Set minimal TLS version via PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](https://docs.microsoft.com/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to `Get` and `Set` the **Minimal TLS Version** property at the instance level:

```powershell
#Get the Minimal TLS Version property
(Get-AzSqlInstance -Name sql-instance-name -ResourceGroupName resource-group).MinimalTlsVersion

# Update Minimal TLS Version Property
Set-AzSqlInstance -Name sql-instance-name -ResourceGroupName resource-group -MinimalTlsVersion "1.2"
```

## Set Minimal TLS Version via Azure CLI

> [!IMPORTANT]
> All scripts in this section requires [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the **Minimal TLS Version** setting in a bash shell:

```azurecli-interactive
# Get current setting for Minimal TLS Version
az sql mi show -n sql-instance-name -g resource-group --query "minimalTlsVersion"

# Update setting for Minimal TLS Version
az sql mi update -n sql-instance-name -g resource-group --set minimalTlsVersion="1.2"
```
