---
title: Auto grow storage in Azure Database for PostgreSQL using PowerShell
description: Learn how to auto grow storage using PowerShell in Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal 
ms.date: 06/24/2022
ms.custom: kr2b-contr-experiment
---

# Auto grow Azure Database for PostgreSQL storage using PowerShell

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This article describes how you can use PowerShell to configure Azure Database for PostgreSQL server storage to scale up automatically without impacting the workload.

Storage auto grow prevents your server from [reaching the storage limit](./concepts-pricing-tiers.md#reaching-the-storage-limit) and
becoming read-only. For servers with 100 GB or less of provisioned storage, the size increases by 5 GB when the free space is below 10%. For servers with more than 100 GB of provisioned storage, the size increases by 5% when the free space is below 10 GB. Maximum storage limits apply as
specified in the storage section of the [Azure Database for PostgreSQL pricing tiers](./concepts-pricing-tiers.md#storage).

> [!IMPORTANT]
> Remember that storage can only be scaled up, not down.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-az-ps) installed locally or [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for PostgreSQL server](quickstart-create-postgresql-server-database-using-azure-powershell.md)

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Enable PostgreSQL server storage auto grow

Enable auto grow storage on an existing server with the following command:

```azurepowershell-interactive
Update-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -StorageAutogrow Enabled
```

Enable auto grow storage while creating a new server with the following command:

```azurepowershell-interactive
$Password = Read-Host -Prompt 'Please enter your password' -AsSecureString
New-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -Sku GP_Gen5_2 -StorageAutogrow Enabled -Location westus -AdministratorUsername myadmin -AdministratorLoginPassword $Password
```

## Next steps

> [!div class="nextstepaction"]
> [How to create and manage read replicas in Azure Database for PostgreSQL using PowerShell](how-to-read-replicas-powershell.md).
