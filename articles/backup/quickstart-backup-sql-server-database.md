---
title: Quickstart - Back up SQL Server databases in Azure VMs using stream-based backups
description: In this quickstart, learn how to configure stream-based backups for SQL Server databases in Azure VMs by using Azure Backup in the Azure portal.
ms.topic: quickstart
ms.date: 10/08/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
---
# Quickstart: Back up SQL Server databases in Azure VMs using stream-based backups

In this quickstart, you use Azure Backup to discover SQL Server databases on an Azure VM and configure stream-based backup to a Recovery Services vault.

## Prerequisites

- A SQL Server instance running on an Azure VM.
- A Recovery Services vault in the same region and subscription as the VM.
- The VM meets the [SQL Server backup prerequisites](backup-sql-server-database-azure-vms.md#prerequisites) and has the required network connectivity.

For supported configurations and limitations, see the [SQL Server backup support matrix](sql-support-matrix.md).

## Configure stream-based backup

1. In the [Azure portal](https://portal.azure.com), go to **Resiliency**, and select **+ Configure protection**.

1. On the **Configure protection** pane, set **Datasource type** to **SQL in Azure VM**, and select **Continue**.

1. Under **Vault**, select **Select vault**, choose your Recovery Services vault, and select **Continue**.

1. Under **Discover DBs in VMs**, select **Start Discovery**. Select the VM that hosts SQL Server, and select **Discover DBs**.

1. After discovery completes, select **Configure Backup**.

1. Select **Add Resources**, expand the SQL Server instance or availability group, select the databases to protect, and select **OK**.

1. Select a backup policy. You can use the default **HourlyLogBackup** policy, select an existing policy, or create a policy. Select **Enable Backup**.

1. Check **Notifications** in the Azure portal to confirm that backup configuration completed.

For detailed configuration steps and additional scenarios, see [Back up multiple SQL Server VMs from the Recovery Services vault](backup-sql-server-database-azure-vms.md).

## Next steps

* [Configure simultaneous backups](manage-monitor-sql-database-backup.md#configure-simultaneous-backups).
* [Back up SQL Server databases running on an Azure VM](backup-sql-server-database-azure-vms.md).
* [Back up SQL Server instance snapshot in Azure VM using Azure portal](back-up-sql-server-instance-snapshot.md).
* [Restore backed up SQL Server databases](restore-sql-database-azure-vm.md).
* [Manage and monitor SQL Server database and instance snapshot backups](manage-monitor-sql-database-backup.md).

## Related content

- [Back up SQL server databases in Azure VMs using Azure Backup via REST API](backup-azure-sql-vm-rest-api.md).
- [Restore SQL Server databases in Azure VMs with REST API](restore-azure-sql-vm-rest-api.md).
- [Manage SQL server databases in Azure VMs with REST API](manage-azure-sql-vm-rest-api.md).
