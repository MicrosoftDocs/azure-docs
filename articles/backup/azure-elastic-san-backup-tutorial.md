---
title: Tutorial - Back up and restore Azure Elastic SAN using the Azure portal
description: Learn how to configure backup and restore Azure Elastic SAN volumes using Azure Backup in the Azure portal.
ms.topic: tutorial
ms.date: 08/20/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to configure backup and restore Azure Elastic SAN volumes, so that I can protect and recover storage resources."
---

# Tutorial: Back up and restore Azure Elastic SAN using the Azure portal

This tutorial shows you how to protect Azure Elastic SAN volumes with Azure Backup and restore a recovery point to a new Elastic SAN volume.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Verify prerequisites for Elastic SAN backup.
> - Create a backup policy.
> - Configure backup for Elastic SAN volumes.
> - Run an on-demand backup.
> - Restore a recovery point to a new volume.
> - Monitor backup and restore jobs.

## Prerequisites

Before you start, ensure that:

- You have an existing Elastic SAN volume, or you [create an Elastic SAN instance and volume](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- The Elastic SAN volume is in a [supported region](azure-elastic-san-backup-support-matrix.md#supported-regions).
- You have a Backup vault in the same subscription. You can use an existing vault, or [create a Backup vault](create-manage-backup-vault.md#create-backup-vault).

For supported scenarios and limitations, see the [support matrix](azure-elastic-san-backup-support-matrix.md).

## Create a backup policy

Create a backup policy to define the backup schedule and retention duration for recovery points.

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency** > **Protection policies**.
1. Select **+ Create Policy** > **Create Backup Policy**.
1. Enter a policy name, and then select **Elastic SAN** as the datasource type.
1. Configure the backup schedule and retention duration.
1. Review and create the policy.

For the detailed procedure, see [Configure Azure Elastic SAN backup using the Azure portal](azure-elastic-san-backup-configure.md).

## Configure backup

Configure protection for the Elastic SAN volumes that you want to back up.

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**, and then select **+ Configure protection**.
1. Select **Azure** as the resource management type, **Elastic SAN volumes** as the datasource type, and **Azure Backup** as the solution.
1. Select the Backup vault and backup policy.
1. Add the Elastic SAN instance and volumes that you want to protect.
1. Validate the configuration and assign missing roles, if required.
1. Review the settings, and then configure backup.

For the detailed procedure, see [Configure Azure Elastic SAN backup using the Azure portal](azure-elastic-san-backup-configure.md).

## Run an on-demand backup

After backup is configured, you can trigger an on-demand backup to create a recovery point immediately.

1. Go to **Resiliency** > **Protection Inventory** > **Protected items**.
1. Filter the datasource type by **Elastic SAN volumes**.
1. Select the Elastic SAN instance, and then select the protected item.
1. Select **Backup Now**.

For the detailed procedure, see [Run an on-demand backup](azure-elastic-san-backup-manage.md#run-an-on-demand-backup).

## Restore a recovery point

Restore an Elastic SAN backup to a new volume in an existing Elastic SAN instance.

1. In the [Azure portal](https://portal.azure.com/), go to **Resiliency**, and then select **Recover**.
1. Select **Elastic SAN volumes** as the datasource type.
1. Select the protected item and restore point.
1. Specify the target subscription, resource group, Elastic SAN instance, and volume group.
1. Enter the new volume name.
1. Validate permissions, assign missing roles if required, and then start the restore.

For the detailed procedure, see [Restore Azure Elastic SAN backup using the Azure portal](azure-elastic-san-backup-restore.md).

## Monitor jobs

To monitor backup and restore jobs, go to **Resiliency** > **Monitoring + Reporting** > **Jobs**, and then filter the datasource type by **Elastic SAN volumes**.

For more information, see [Manage Azure Elastic SAN backups using the Azure portal](azure-elastic-san-backup-manage.md).

## Next steps

- [Manage Azure Elastic SAN backups using the Azure portal](azure-elastic-san-backup-manage.md)
- [Support matrix for Azure Elastic SAN backup](azure-elastic-san-backup-support-matrix.md)
