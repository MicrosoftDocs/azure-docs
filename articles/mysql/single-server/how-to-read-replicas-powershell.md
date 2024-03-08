---
title: Manage read replicas - Azure PowerShell - Azure Database for MySQL
description: Learn how to set up and manage read replicas in Azure Database for MySQL using PowerShell.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/20/2022
ms.custom: devx-track-azurepowershell
---

# How to create and manage read replicas in Azure Database for MySQL using PowerShell

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

In this article, you learn how to create and manage read replicas in the Azure Database for MySQL
service using PowerShell. To learn more about read replicas, see the
[overview](concepts-read-replicas.md).

## Azure PowerShell

You can create and manage read replicas using PowerShell.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MySql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MySql -AllowPrerelease`.
> Once the Az.MySql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General
> Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing
> tiers.
>
>If GTID is enabled on a primary server (`gtid_mode` = ON), newly created replicas will also have GTID enabled and use GTID based replication. To learn more refer to [Global transaction identifier (GTID)](concepts-read-replicas.md#global-transaction-identifier-gtid)

### Create a read replica

> [!IMPORTANT]
> If your source server has no existing replica servers, source server might need a restart to prepare itself for replication depending upon the storage used (v1/v2). Please consider server restart and perform this operation during off-peak hours. See [Source Server restart](./concepts-read-replicas.md#source-server-restart) for more details. 

A read replica server can be created using the following command:

```azurepowershell-interactive
Get-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  New-AzMySqlReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

The `New-AzMySqlReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server is created.  |
| Name | mydemoreplicaserver | The name of the new replica server that is created. |

To create a cross region read replica, use the **Location** parameter. The following example creates
a replica in the **West US** region.

```azurepowershell-interactive
Get-AzMySqlServer -Name mrdemoserver -ResourceGroupName myresourcegroup |
  New-AzMySqlReplica -Name mydemoreplicaserver -ResourceGroupName myresourcegroup -Location westus
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

By default, read replicas are created with the same server configuration as the source unless the
**Sku** parameter is specified.

> [!NOTE]
> It is recommended that the replica server's configuration should be kept at equal or greater
> values than the source to ensure the replica is able to keep up with the master.

### List replicas for a source server

To view all replicas for a given source server, run the following command:

```azurepowershell-interactive
Get-AzMySqlReplica -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

The `Get-AzMySqlReplica` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the replica server will be created to.  |
| ServerName | mydemoserver | The name or ID of the source server. |

### Delete a replica server

Deleting a read replica server can be done by running the `Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoreplicaserver -ResourceGroupName myresourcegroup
```

### Delete a source server

> [!IMPORTANT]
> Deleting a source server stops replication to all replica servers and deletes the source server
> itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server, you can run the `Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

### Known Issue

There are two generations of storage which the servers in General Purpose and Memory Optimized tier use, General purpose storage v1 (Supports up to 4-TB) & General purpose storage v2 (Supports up to 16-TB storage).
Source server and the replica server should have same storage type. As [General purpose storage v2](./concepts-pricing-tiers.md#general-purpose-storage-v2-supports-up-to-16-tb-storage) is not available in all regions, please make sure you choose the correct replica region while you use location with the PowerShell for read replica creation. On how to identify the storage type of your source server refer to link [How can I determine which storage type my server is running on](./concepts-pricing-tiers.md#how-can-i-determine-which-storage-type-my-server-is-running-on). 

If you choose a region where you cannot create a read replica for your source server, you will encounter the issue where the deployment will keep running as shown in the figure below and then will timeout with the error *“The resource provision operation did not complete within the allowed timeout period.”*

[ :::image type="content" source="media/how-to-read-replicas-powershell/replica-powershell-known-issue.png" alt-text="Read replica cli error":::](media/how-to-read-replicas-powershell/replica-powershell-known-issue.png#lightbox)


## Next steps

> [!div class="nextstepaction"]
> [Restart Azure Database for MySQL server using PowerShell](how-to-restart-server-powershell.md)
