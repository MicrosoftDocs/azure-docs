---
title: Manage Azure Database for MariaDB read replicas
description: Learn how to set up and manage read replicas in Azure Database for MariaDB using PowerShell in the General Purpose or Memory Optimized pricing tiers.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/24/2022
ms.custom: kr2b-contr-experiment
---

# How to create and manage read replicas in Azure Database for MariaDB using PowerShell

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

In this article, you learn how to create and manage read replicas in the Azure Database for MariaDB service using PowerShell. To learn more about read replicas, see the [overview](concepts-read-replicas.md).

You can create and manage read replicas using PowerShell.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed
  locally or [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MariaDb PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MariaDb -AllowPrerelease`.
> Once the Az.MariaDb PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MariaDB servers in the General
> Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing
> tiers.

### Create a read replica

> [!IMPORTANT]
> When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following command:

```azurepowershell-interactive
Get-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  New-AzMariaDbServerReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

The `New-AzMariaDbServerReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server is created.  |
| Name | mydemoreplicaserver | The name of the new replica server that is created. |

To create a cross region read replica, use the **Location** parameter. The following example creates
a replica in the **West US** region.

```azurepowershell-interactive
Get-AzMariaDbServer -Name mrdemoserver -ResourceGroupName myresourcegroup |
  New-AzMariaDServerReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup -Location westus
```

To learn more about which regions you can create a replica in, visit the
[read replica concepts article](concepts-read-replicas.md).

By default, read replicas are created with the same server configuration as the source unless the
**Sku** parameter is specified.

> [!NOTE]
> It is recommended that the replica server's configuration should be kept at equal or greater
> values than the source to ensure the replica is able to keep up with the master.

### List replicas for a source server

To view all replicas for a given source server, run the following command:

```azurepowershell-interactive
Get-AzMariaDReplica -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

The `Get-AzMariaDReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server will be created to.  |
| ServerName | mydemoserver | The name or ID of the source server. |

### Delete a replica server

Deleting a read replica server can be done by running the `Remove-AzMariaDbServer` cmdlet.

```azurepowershell-interactive
Remove-AzMariaDbServer -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

### Delete a source server

> [!IMPORTANT]
> Deleting a source server stops replication to all replica servers and deletes the source server
> itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server, you can run the `Remove-AzMariaDbServer` cmdlet.

```azurepowershell-interactive
Remove-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Restart Azure Database for MariaDB server using PowerShell](howto-restart-server-powershell.md)
