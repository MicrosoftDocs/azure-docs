---
title: Back up SAP HANA database instances on Azure VMs
description: In this article, discover how to back up SAP HANA database instances that are running on Azure Virtual Machines.
ms.topic: conceptual
ms.date: 10/05/2022
author: v-amallick
ms.service: backup
ms.custom: ignite-2022
ms.author: v-amallick
---

# Back up SAP HANA databases' instance snapshots in Azure VMs (preview)

Azure Backup now performs SAP HANA Storage Snapshot based backup of the entire database instance. It combines Azure Managed disk’s full/incremental snapshot with HANA snapshot commands to provide instant HANA backup and restore.

This article describes how to back up SAP HANA databases instances that are running on Azure VMs to an Azure Backup Recovery Services vault.

In this article, you'll learn how to:

>[!div class="checklist"]
>- Create and configure a Recovery Services vault
>- Create a policy
>- Discover databases instances
>- Configure backups
>- Track a a backup job

>[!Note]
>See [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md) for more information about the supported configurations and scenarios.

## Before you start

### Policy

As per SAP recommendation, it's mandatory to have weekly full backup for all the databases within an Instance, which is protected by snapshot. Currently, logs are also mandatory for a database when creating a policy. With snapshots happening daily, we don’t see a need to have incremental/differential backup in the database policy. Therefore, all databases under the database Instance (which is required to be protected by snapshots) should have a database policy that has only *weekly fulls + logs ONLY* along with daily snapshots at an Instance level.

>[!Warning]
>As the policy doesn’t have differentials/incrementals, we do NOT recommend to trigger on-demand differential backups from any client.

**Summary**:

- Always protect all the databases within an Instance with a database policy before applying daily snapshots to the database Instance.
- Make sure that all database policies have only *Weekly fulls + logs*. No differential/incremental backups.
- Do NOT trigger on-demand Backint based streaming differential/incremental backups for these databases.

### Permissions required for backup

You must assign the required permissions to the Azure Backup service (residing within the HANA VM) to take snapshots of the Managed Disks and place them in a User-specified Resource Group mentioned in the policy. To do so, you can use System-assigned Managed Identity (MSI) of the source VM.

The following table lists the resource, permissions, and scope.

Entity | Built-in role | Scope of permission | Description
--- | --- | --- | ---
Source VM | Virtual Machine Contributor | Backup admin who configures/runs HANA snapshot backup | Configures HANA instance.
Source disk resource Group (where all disks are present for backup) | Disk Backup Reader | Source VM’s MSI | Creates disk snapshots.
Source snapshot resource Group | Disk Snapshot Contributor | Source VM’s MSI | Creates disk snapshots and store on source snapshot resource group.
Source snapshot resource Group | Disk Snapshot Contributor | Backup Management Service | Deletes old snapshots on source snapshot resource group.

>[!Note]
>- The credentials used should have permissions to grant roles to other resources and should be Owner or User Access Administ.rator [as mentioned here](../role-based-access-control/role-assignments-steps.md#step-4-check-your-prerequisites).
>- During backup configuration, you can use the Azure portal to assign all above permissions, except *Disk snapshot contributor* to *Backup Management Service* principal for snapshot resource group. You need to manually assign this permission.
>- We recommend you not to change the resource groups once they are given/assigned to Azure Backup as it eases the permissions handling.

Learn about the [permissions required for snapshot restore](sap-hana-database-instances-restore.md#permissions-required-for-snapshot-restore).

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Create a policy

To create a policy for SAP HANA database instance backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), select a Recovery Services vault.

1. Under **Backup**, select **Backup Policies**.

1. Select **+Add**.

1. On **Select policy type**, select **SAP HANA in Azure VM (DB Instance via snapshot) [Preview]**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/select-sap-hana-instance-policy-type.png" alt-text="Screenshot showing to select the policy type.":::

1. On **Create policy**, perform the following actions:

   - **Policy name**: Enter a unique policy name.
   - **Snapshot Backup**: Set *Time* and *Timezone* for backup as from the drop-down list. The default selection is *10:30 PM* and *(UTC) Coordinated Universal Time* respectively.

     >[!Note]
     >Azure Backup currently supports Daily backup frequency only.

   - **Instant Restore**: Set the retention of recovery snapshot from *1* to *35* days. The default value is set to *2*.
   - **Resource group**: Select the appropriate resource group from the drop-down list.
   - **Managed Identity**: Select a managed identity from the drop-down to assign permissions to take snapshots of the managed disks and to place them in the Resource Group you select in the policy.
   >[!Note]
   >You need to manually assign the permission for Azure Backup service to delete the snapshots as per the policy. Other [permissions are assigned by the Azure portal](#configure-snapshot-backup).
   >
   >To assign *Disk snapshot contributor role* to *Backup Management Service* manually on snapshot resouce group, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current).

1. Select **Create**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/create-policy.png" alt-text="Screenshot showing how to create the policy.":::

Also, you need to [create a policy for SAP HANA database backup](backup-azure-sap-hana-database.md#create-a-backup-policy).

## Discover the databases instance

To discover the database instance where the snapshot is present, see the [process to discover a database instance](backup-azure-sap-hana-database.md#discover-the-databases).

## Configure snapshot backup

Before configuring backup for the snapshot, [configure backup for the database](backup-azure-sap-hana-database.md#configure-backup).

Once done, follow these steps:

1. Go to the **Recovery Services vault** and select **+Backup**.

1. Select **SAP HANA in Azure VM** as the data source type, select a **Recovery Services vault** to use for backup, and then select **Continue**.

1. In **Step 2**, select **DB Instance via snapshot (Preview)** > **Configure Backup**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/select-db-instance-via-snapshot.png" alt-text="Screenshot showing to select the DB Instance via snapshot option.":::

1. On **Configure Backup**, select the database instance policy from the **Backup policy** drop-down list, and then select **Add/Edit** to check the available database instances.

   :::image type="content" source="./media/sap-hana-database-instances-backup/add-database-instance-backup-policy.png" alt-text="Screenshot showing to select and add a database instance policy.":::

   To edit a DB instance selection, select the checkbox corresponding to the instance name and select **Add/Edit**.

1. On **Select items to backup**, select the database instances and select **OK**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/select-database-instance-for-backup.png" alt-text="Screenshot showing to select a database instance for backup.":::

   Once you select HANA instances for back-up, the Azure portal validates for missing permissions  in the Managed System Identity (MSI) that is assigned to the policy to perform snapshot backup.

1. If the permissions aren't present, you need to Select **Assign missing roles/identity** to assign all permissions.

   Azure portal then automatically re-validates and shows *Backup readiness* as successful.

1. Once the *backup readiness check* is successful, select **Enable backup**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/enable-hana-database-instance-backup.png" alt-text="Screenshot showing to enable HANA database instance backup.":::
 
## Run an on-demand backup

Follow these steps:

1. In the Azure portal, go to **Recovery Services vault**.

1. In the Recovery Services vault, select **Backup items** in the left pane.

1. By default **Primary Region** is selected. Select **SAP HANA in Azure VM**.

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA snapshot instance.

   :::image type="content" source="./media/sap-hana-database-instances-backup/hana-snapshot-view-details.png" alt-text="Screenshot showing to select View Details of HANA database snapshot instance.":::

1. Select **Backup now**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/start-backup-hana-snapshot.png" alt-text="Screenshot showing to start backup of HANA database snapshot instance.":::

1. On the **Backup Now** page, select **OK**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/trigger-backup-hana-snapshot.png" alt-text="Screenshot showing to trigger HANA database snapshot instance backup.":::

## Track a backup job

Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status, follow these steps:

1. In the Recovery Services vault, select **Backup Jobs** in the left pane.

   It shows the jobs dashboard with operation and status of the jobs triggered in *past 24 hours*. To modify the time range, select **Filter** and do required changes.

1. To review the job details of a job, select **View details** corresponding to the job.

## Next steps

- [Learn how restore SAP HANA databases' instance snapshots in Azure VMs (preview)](sap-hana-database-instances-restore.md).
- [Learn how manage SAP HANA databases on Azure VMs (preview)](sap-hana-database-manage.md).
