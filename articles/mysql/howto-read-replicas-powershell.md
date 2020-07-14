---
title: Manage read replicas - Azure PowerShell - Azure Database for MySQL
description: Learn how to set up and manage read replicas in Azure Database for MySQL using PowerShell.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 6/10/2020
---

# How to create and manage read replicas in Azure Database for MySQL using PowerShell

In this article, you learn how to create and manage read replicas in the Azure Database for MySQL
service using PowerShell. To learn more about read replicas, see the
[overview](concepts-read-replicas.md).

## Azure PowerShell

You can create and manage read replicas using PowerShell.

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

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General
> Purpose or Memory Optimized pricing tiers. Ensure the master server is in one of these pricing
> tiers.

### Create a read replica

> [!IMPORTANT]
> When you create a replica for a master that has no existing replicas, the master will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following command:

```azurepowershell-interactive
Get-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  New-AzMySqlServerReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

The `New-AzMySqlServerReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server is created.  |
| Name | mydemoreplicaserver | The name of the new replica server that is created. |

To create a cross region read replica, use the **Location** parameter. The following example creates
a replica in the **West US** region.

```azurepowershell-interactive
Get-AzMySqlServer -Name mrdemoserver -ResourceGroupName myresourcegroup |
  New-AzMySqlServerReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup -Location westus
```

To learn more about which regions you can create a replica in, visit the
[read replica concepts article](concepts-read-replicas.md).

By default, read replicas are created with the same server configuration as the master unless the
**Sku** parameter is specified.

> [!NOTE]
> It is recommended that the replica server's configuration should be kept at equal or greater
> values than the master to ensure the replica is able to keep up with the master.

### List replicas for a master server

To view all replicas for a given master server, run the following command:

```azurepowershell-interactive
Get-AzMySqlReplica -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

The `Get-AzMySqlReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server will be created to.  |
| ServerName | mydemoserver | The name or ID of the master server. |

### Delete a replica server

Deleting a read replica server can be done by running the `Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

### Delete a master server

> [!IMPORTANT]
> Deleting a master server stops replication to all replica servers and deletes the master server
> itself. Replica servers become standalone servers that now support both read and writes.

To delete a master server, you can run the `Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Restart Azure Database for MySQL server using PowerShell](howto-restart-server-powershell.md)
