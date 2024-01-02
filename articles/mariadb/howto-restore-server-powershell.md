---
title: Backup and restore - Azure PowerShell - Azure Database for MariaDB
description: Learn how to backup and restore a server in Azure Database for MariaDB by using Azure PowerShell.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurepowershell
ms.topic: how-to
ms.date: 06/24/2022
ms.custom: devx-track-azurepowershell
---
# How to back up and restore an Azure Database for MariaDB server using PowerShell

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Azure Database for MariaDB servers is backed up periodically to enable restore features. Using this
feature you may restore the server and all its databases to an earlier point-in-time, on a new
server.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MariaDb PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MariaDb -AllowPrerelease`.
> Once the Az.MariaDb PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Set backup configuration

At server creation, you make the choice between configuring your server for either locally redundant
or geographically redundant backups.

> [!NOTE]
> After a server is created, the kind of redundancy it has, geographically redundant vs locally
> redundant, can't be changed.

While creating a server via the `New-AzMariaDbServer` command, the **GeoRedundantBackup**
parameter decides your backup redundancy option. If **Enabled**, geo redundant backups are taken. Or
if **Disabled**, locally redundant backups are taken.

The backup retention period is set by the **BackupRetentionDay** parameter.

For more information about setting these values during server creation, see
[Create an Azure Database for MariaDB server using PowerShell](quickstart-create-mariadb-server-database-using-azure-powershell.md).

The backup retention period of a server can be changed as follows:

```azurepowershell-interactive
Update-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup -BackupRetentionDay 10
```

The preceding example changes the backup retention period of mydemoserver to 10 days.

The backup retention period governs how far back a point-in-time restore can be retrieved, since
it's based on available backups. Point-in-time restore is described further in the next section.

## Server point-in-time restore

You can restore the server to a previous point-in-time. The restored data is copied to a new server,
and the existing server is left unchanged. For example, if a table is accidentally dropped, you can
restore to the time just the drop occurred. Then, you can retrieve the missing table and data from
the restored copy of the server.

To restore the server, use the `Restore-AzMariaDbServer` PowerShell cmdlet.

### Run the restore command

To restore the server, run the following example from PowerShell.

```azurepowershell-interactive
$restorePointInTime = (Get-Date).AddMinutes(-10)
Get-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Restore-AzMariaDbServer -Name mydemoserver-restored -ResourceGroupName myresourcegroup -RestorePointInTime $restorePointInTime -UsePointInTimeRestore
```

The **PointInTimeRestore** parameter set of the `Restore-AzMariaDbServer` cmdlet requires the
following parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
| ResourceGroupName |  myresourcegroup |  The resource group where the source server exists.  |
| Name | mydemoserver-restored | The name of the new server that is created by the restore command. |
| RestorePointInTime | 2020-03-13T13:59:00Z | Select a point in time to restore. This date and time must be within the source server's backup retention period. Use the ISO8601 date and time format. For example, you can use your own local time zone, such as **2020-03-13T05:59:00-08:00**. You can also use the UTC Zulu format, for example, **2018-03-13T13:59:00Z**. |
| UsePointInTimeRestore | `<SwitchParameter>` | Use point-in-time mode to restore. |

When you restore a server to an earlier point-in-time, a new server is created. The original server
and its databases from the specified point-in-time are copied to the new server.

The location and pricing tier values for the restored server remain the same as the original server.

After the restore process finishes, locate the new server and verify that the data is restored as
expected. The new server has the same server admin login name and password that was valid for the
existing server at the time the restore was started. The password can be changed from the new
server's **Overview** page.

The new server created during a restore does not have the VNet service endpoints that existed on the
original server. These rules must be set up separately for the new server. Firewall rules from the
original server are restored.

## Geo restore

If you configured your server for geographically redundant backups, a new server can be created from
the backup of the existing server. This new server can be created in any region that Azure Database
for MariaDB is available.

To create a server using a geo redundant backup, use the `Restore-AzMariaDbServer` command with the
**UseGeoRestore** parameter.

> [!NOTE]
> When a server is first created it may not be immediately available for geo restore. It may take a
> few hours for the necessary metadata to be populated.

To geo restore the server, run the following example from PowerShell:

```azurepowershell-interactive
Get-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Restore-AzMariaDbServer -Name mydemoserver-georestored -ResourceGroupName myresourcegroup -Location eastus -Sku GP_Gen5_8 -UseGeoRestore
```

This example creates a new server called **mydemoserver-georestored** in the East US region that
belongs to **myresourcegroup**. It is a General Purpose, Gen 5 server with 8 vCores. The server is
created from the geo-redundant backup of **mydemoserver**, also in the resource group
**myresourcegroup**.

To create the new server in a different resource group from the existing server, specify the new
resource group name using the **ResourceGroupName** parameter as shown in the following example:

```azurepowershell-interactive
Get-AzMariaDbServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Restore-AzMariaDbServer -Name mydemoserver-georestored -ResourceGroupName newresourcegroup -Location eastus -Sku GP_Gen5_8 -UseGeoRestore
```

The **GeoRestore** parameter set of the `Restore-AzMariaDbServer` cmdlet requires the following
parameters:

| Setting | Suggested value | Description  |
| --- | --- | --- |
|ResourceGroupName | myresourcegroup | The name of the resource group the new server belongs to.|
|Name | mydemoserver-georestored | The name of the new server. |
|Location | eastus | The location of the new server. |
|UseGeoRestore | `<SwitchParameter>` | Use geo mode to restore. |

When creating a new server using geo restore, it inherits the same storage size and pricing tier as
the source server unless the **Sku** parameter is specified.

After the restore process finishes, locate the new server and verify that the data is restored as
expected. The new server has the same server admin login name and password that was valid for the
existing server at the time the restore was started. The password can be changed from the new
server's **Overview** page.

The new server created during a restore does not have the VNet service endpoints that existed on the
original server. These rules must be set up separately for this new server. Firewall rules from the
original server are restored.

## Next steps

> [!div class="nextstepaction"]
> [How to generate an Azure Database for MariaDB connection string with PowerShell](howto-connection-string-powershell.md)
