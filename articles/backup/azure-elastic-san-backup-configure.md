---
title: Configure Azure Elastic SAN backup using Azure portal (preview)
description: Learn how to configure Azure Elastic SAN backup (preview) using Azure portal.
ms.topic: how-to
ms.date: 06/20/2025
author: jyothisuri
ms.author: jsuri
---

# Configure Azure Elastic SAN backup using Azure portal (preview)

This article describes how to configure Azure Elastic SAN backup (preview) using the Azure portal.

## Prerequisites

Before you configure Elastic SAN backup, ensure the following prerequisites are met:

- Check for an existing Elastic SAN volume, or [create a  new volume and instance](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- The Elastic SAN volume must be in a [supported region](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions).

For more information about the supported scenarios, limitations, and availability, see the [support matrix](azure-elastic-storage-area-network-backup-support-matrix.md).

## Create a Backup vault

To back up Elastic SAN, ensure you have a Backup vault in the same subscription. You can use an existing vault, or [create a new one](create-manage-backup-vault.md#create-backup-vault).

## Create a backup policy for Elastic SAN (preview)

A backup policy defines the schedule and frequency for backing up Elastic SAN volumes. You can either create a backup policy from the Backup vault or create it on the go during the backup configuration.

To create a backup policy for Elastic SAN from Azure Business Continuity Center, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Azure Business Continuity Center** > **Protection policies**, and then select **+ Create Policy** > **Create Backup Policy**.
1. On the **Create Backup Policy** pane, on the **Basics** tab, provide a name for the new policy under **Policy name**, and then select **Datasource type** as **Elastic SAN (Preview)**.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/create-policy.png" alt-text="Screenshot shows how to start creating a backup policy." lightbox="./media/azure-elastic-storage-area-network-backup-configure/create-policy.png":::

1. On the **Schedule + retention** tab, under the **Backup schedule** section, set the schedule for creating recovery points for backups.

   >[!Note]
   >Azure Backup currently supports **Daily** backup frequency only, which is selected by default.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/set-backup-schedule.png" alt-text="Screenshot shows how to configure the backup schedule." lightbox="./media/azure-elastic-storage-area-network-backup-configure/set-backup-schedule.png":::

1. Under the **Retention rules** section, edit the default retention rule or add a new rule to specify the retention of recovery points.

   >[!Note]
   >- The default retention duration for the recovery points is **7 days**.
   >- Maximum of **450** recovery points are retained at any point in time across your retention rules.

1. Select **Review + create**.
1. After the review succeeds, select **Create**.


## Configure Elastic SAN backup (preview)

To configure backup for your Elastic SAN, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Business Continuity Center**, and then select **+ Configure protection**. 
1. On the **Configure protection** pane, select **Resource managed by** as **Azure**, **Datasource type** as **Elastic SAN volumes (Preview)**, **Solution** as **Azure Backup**, and then select **Continue**.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/start-protection-configuration.png" alt-text="Screenshot shows how to start configuring backup." lightbox="./media/azure-elastic-storage-area-network-backup-configure/start-protection-configuration.png":::

1. On the **Configure Backup** pane, on the **Basics** tab, ensure that the **Datasource type** is selected as **Elastic SAN volumes (Preview)**.
1. Under **Vault**, click **Select vault** to choose the Backup vault you created.

   If you don't have a Backup vault, [create a new one](#create-a-backup-vault).

   >[!Note]
   >A Backup vault uses a System Assigned Managed Identity to create and manage snapshots.

1. On the **Backup policy** tab, under **Backup policy**, select the policy you want to use for data retention, and then select **Next**.
   If you want to create a new backup policy, select **Create new**. Learn how to [create a backup policy](#create-a-backup-policy-for-elastic-san-preview).

   >[!Note]
   >- The default retention duration for the recovery points is **7 days**.
   >- Maximum of **450** recovery points are retained at any point in time across your retention rules.
 
1. On the **Datasources** tab, select**Add** to choose the Elastic SAN instance for backup. 

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/add-resource-for-backup.png" alt-text="Screenshot shows how to add resources for backup." lightbox="./media/azure-elastic-storage-area-network-backup-configure/add-resource-for-backup.png":::

1. On the **Select resources to backup** pane, select an Elastic SAN instance from the dropdown list, and then select **Add**.

   >[!Note]
   >Only instances that share the same subscription and region as the vault appear.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-configure/specify-backup-instance-name.png" alt-text="Screenshot shows how to select an instance for backup." lightbox="./media/azure-elastic-storage-area-network-backup-configure/specify-backup-instance-name.png":::

1. On the **Add backup instance** pane, filter by **Volume group**, select a volume from the list, and then select **Add**.

   >[!Note]
   >- You can select multiple volumes within a single backup request.
   >- A Backup Instance is a pair of one Elastic SAN volume and a backup policy.
   >- You can use the auto-filled backup instance name or customize it as needed.
   >- The Elastic SAN instance’s resource group is auto-assigned to the restore point (Managed Disk incremental snapshots). You can choose a different resource group to store snapshots.

   After you add the backup instances, backup readiness validation starts on the **Configure Backup** pane, under **Datasources** tab. If the required roles are assigned, the  validation succeeds with the **Success** message.

   Validation errors appear if the selected Backup vault's Managed-system Identity (MSI) doesn't have the **Elastic SAN Snapshot Exporter** and **Disk snapshot Contributor** roles  assigned.

1. To assign the required roles, on the **Configure Backup** pane, on the **Datasources** tab, select **Assign missing roles**.

   >[!Note]
   >If you don't have the **Role-Based Access Control Administrator** permissions, the **Assign Missing Roles** option is disabled.

1. On the **Grant missing permissions** pane, select the scope (resource, resource group, or subscription) at which the access permissions must be granted, and then select **Next**.

   After the process starts, the missing access permissions on the Elastic SAN are granted to the backup vault. 

1. When the role assignment is complete, on the **Configure Backup** pane, on the **Datasources** tab, select **Revalidate**.

   When the validation succeeds, the **Success** message appears.

1. On the **Review + configure** tab, review the configuration details, and then select **Configure Backup**.

You can [track the progress of the backup configuration](azure-elastic-storage-area-network-backup-manage.md#view-the-elastic-san-backup-and-restore-jobs) under **Backup instances**. When configured, Azure Backup runs backups as per the policy schedule to create recovery points. You can also [trigger an on-demand backup](azure-elastic-storage-area-network-backup-manage.md#run-an-on-demand-backup) to create the first full backup.

## Next steps

- [Restore Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-restore.md).
- [Manage Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-manage.md).
 


