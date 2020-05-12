---
title: Auto grow storage - Azure PowerShell - Azure Database for MySQL
description: This article describes how you can enable auto grow storage using PowerShell in Azure Database for MySQL.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 4/28/2020
---
# Auto grow storage in Azure Database for MySQL server using PowerShell

This article describes how you can configure an Azure Database for MySQL server storage to grow
without impacting the workload.

Storage auto grow prevents your server from
[reaching the storage limit](/azure/mysql/concepts-pricing-tiers#reaching-the-storage-limit) and
becoming read-only. For servers with 100 GB or less of provisioned storage, the size is increased by
5 GB when the free space is below 10%. For servers with more than 100 GB of provisioned storage, the
size is increased by 5% when the free space is below 10 GB. Maximum storage limits apply as
specified in the storage section of the
[Azure Database for MySQL pricing tiers](/azure/mysql/concepts-pricing-tiers#storage).

> [!IMPORTANT]
> Remember that storage can only be scaled up, not down.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-az-ps) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MySql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MySql -AllowPrerelease`.
> Once the Az.MySql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet.

## Enable MySQL server storage auto grow

Enable server auto grow storage on an existing server with the following command:

```azurepowershell-interactive
Update-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -StorageAutogrow Enabled
```

Enable server auto grow storage while creating a new server with the following command:

```azurepowershell-interactive
$Password = Read-Host -Prompt 'Please enter your password' -AsSecureString
New-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -Sku GP_Gen5_2 -StorageAutogrow Enabled -Location westus -AdministratorUsername myadmin -AdministratorLoginPassword $Password
```

## Next steps

> [!div class="nextstepaction"]
> [How to create and manage read replicas in Azure Database for MySQL using PowerShell](howto-read-replicas-powershell.md).
