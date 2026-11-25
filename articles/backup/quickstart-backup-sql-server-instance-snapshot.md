---
title: Quickstart - Back up SQL Server instances in Azure VMs using snapshot-based backups
description: In this quickstart, learn how to configure snapshot-based backups for SQL Server instances in Azure VMs by using Azure Backup in the Azure portal.
ms.topic: quickstart
ms.date: 10/08/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
---
# Quickstart: Back up SQL Server instances in Azure VMs using snapshot-based backups

In this quickstart, you use Azure Backup to discover a SQL Server instance on an Azure VM and configure snapshot-based backup with transaction log backups for point-in-time recovery.

## Prerequisites

- A SQL Server instance running on an Azure VM and a Recovery Services vault in the same region and subscription.
- The VM meets the [SQL Server backup prerequisites](backup-sql-server-database-azure-vms.md#prerequisites) and has the required network connectivity.
- A user-assigned managed identity and a resource group for storing snapshots, or permission to create them during backup configuration.

For supported configurations and limitations, see the [snapshot backup scenarios in the SQL Server backup support matrix](sql-support-matrix.md#sql-server-instance-snapshot-backups-supported-scenarios).

## Configure snapshot-based backup

1. In the [Azure portal](https://portal.azure.com), open the Recovery Services vault, and select **+ Backup**.

1. On the **Backup Goal** pane, select **SQL Server in Azure VM (Snapshot backup)** as the workload, and start database discovery.

1. Select the VM that hosts the SQL Server instance, and select **Discover DBs**. Wait for discovery to complete.

1. Under **Step 2: Configure Backup**, select **Configure Backup**. Select an existing snapshot backup policy or create a new policy.

1. If you create a policy, configure the full snapshot and log backup schedules and retention. For **Snapshot identity**, specify the snapshot resource group and managed identity.

1. Under **SQL Instances or AlwaysOn AGs**, select **+ Add/Edit**, choose the instance and databases to protect, and select **OK**. You can select up to 12 databases per snapshot operation.

1. Review **Backup readiness**. If the portal reports missing role or identity assignments, select **Assign missing roles/identity** or ask an administrator to complete the assignments.

1. Select **Enable Backup**, and check **Notifications** to confirm that backup configuration completed.

For detailed prerequisites, policy settings, and backup steps, see [Back up SQL Server instance snapshots in Azure VMs using the Azure portal](back-up-sql-server-instance-snapshot.md).

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
