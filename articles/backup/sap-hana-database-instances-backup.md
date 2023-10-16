---
title: Back up SAP HANA database instances on Azure VMs
description: In this article, you'll learn how to back up SAP HANA database instances that are running on Azure virtual machines.
ms.topic: conceptual
ms.date: 10/05/2022
ms.service: backup
ms.custom: ignite-2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up SAP HANA database instance snapshots on Azure VMs

Azure Backup now performs an SAP HANA storage snapshot-based backup of an entire database instance. Backup combines an Azure managed disk full or incremental snapshot with HANA snapshot commands to provide instant HANA backup and restore.

This article describes how to back up SAP HANA database instances that are running on Azure VMs to an Azure Backup Recovery Services vault.

In this article, you'll learn how to:

>[!div class="checklist"]
>- Create and configure a Recovery Services vault.
>- Create a policy.
>- Discover database instances.
>- Configure backups.
>- Track a backup job.

For more information about the supported configurations and scenarios, see [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md). 

## Before you start

### Policy

According to SAP, it's mandatory to run a weekly full backup of all databases within an instance. Currently, logs are also mandatory for a database when you're creating a policy. With snapshots happening daily, we don’t see a need for incremental or differential backups in the database policy. Therefore, all databases in the database instance, which is required to be protected by a snapshot, should have a database policy of only *weekly fulls + logs ONLY*, along with daily snapshots at an instance level.

>[!Important]
>- As per SAP advisory, we recommend you to configure *Database via Backint* with *weekly fulls + log backup only* policy before configuring *DB Instance via Snapshot* backup. If *weekly fulls + logs backup only using Backint based backup* isn't enabled, snapshot backup configuration will fail.
>
>- Because the policy doesn’t call for differential or incremental backups, we do *not* recommend that you trigger on-demand differential backups from any client.

To summarize the backup policy:

- Always protect all databases within an instance with a database policy before you apply daily snapshots to the database instance.
- Make sure that all database policies have only *Weekly fulls + logs* and no differential/incremental backups.
- Do *not* trigger on-demand Backint-based streaming differential or incremental backups for these databases.

### Permissions required for backup

You must assign the required permissions to the Azure Backup service, which resides on a HANA virtual machine (VM), to take snapshots of the managed disks and place them in a user-specified resource group that's mentioned in the policy. To do so, you can use the system-assigned managed identity of the source VM.

The following table lists the resource, permissions, and scope.

Entity | Built-in role | Scope of permission | Description
--- | --- | --- | ---
Source VM | Virtual Machine Contributor | The backup admin who configures and runs the HANA snapshot backup | Configures the HANA instance
Source disk resource group (where all disks are present for backup) | Disk Backup Reader | The source VM system-assigned managed identity | Creates disk snapshots
Source snapshot resource group | Disk Snapshot Contributor | The source VM system-assigned managed identity | Creates disk snapshots and stores them in the source snapshot resource group
Source snapshot resource group | Disk Snapshot Contributor | Backup Management Service | Deletes old snapshots in the source snapshot resource group.

When you're assigning permissions, consider the following:

- The credentials that are used should have permissions to grant roles to other resources and should be either Owner or User Access Administrator, as mentioned in the [steps for assigning user roles](../role-based-access-control/role-assignments-steps.md#step-4-check-your-prerequisites).

- During backup configuration, you can use the Azure portal to assign the previously mentioned permissions, except Disk Snapshot Contributor to the Backup Management Service principal for the snapshot resource group. You need to manually assign this permission.

- We recommend that you *not* change the resource groups after they're given or assigned to Azure Backup, because it makes it easier to handle the permissions.

Learn about the [permissions required for snapshot restore](sap-hana-database-instances-restore.md#permissions-required-for-the-snapshot-restore).

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

## Create a policy

To create a policy for the SAP HANA database instance backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), select a Recovery Services vault.

1. Under **Backup**, select **Backup Policies**.

1. Select **Add**.

1. On the **Select policy type** pane, select **SAP HANA in Azure VM (DB Instance via snapshot)**.

   :::image type="content" source="./media/sap-hana-database-instances-backup/select-sap-hana-instance-policy-type.png" alt-text="Screenshot that shows a list of policy types.":::

1. On the **Create policy** pane, do the following:

   :::image type="content" source="./media/sap-hana-database-instances-backup/create-policy.png" alt-text="Screenshot that shows the 'Create policy' pane for configuring backup and restore.":::

   1. **Policy name**: Enter a unique policy name.  
   1. **Snapshot Backup**: Set the **Time** and **Timezone** for backup in the dropdown lists. The default settings are *10:30 PM* and *(UTC) Coordinated Universal Time*.

      >[!Note]
      >Azure Backup currently supports **Daily** backup only.

   1. **Instant Restore**: Set the retention of recovery snapshots from *1* to *35* days. The default value is *2*.  
   1. **Resource group**: Select the appropriate resource group in the drop-down list.  
   1. **Managed Identity**: Select a managed identity in the dropdown list to assign permissions for taking snapshots of the managed disks and place them in the resource group that you've selected in the policy.
   
      You can also create a new managed identity for snapshot backup and restore. To create a managed identity, follow these steps:

      1. Select **+ Create**.
      
         :::image type="content" source="./media/sap-hana-database-instances-backup/start-create-managed-identity.png" alt-text="Screenshot that shows how to create managed identity.":::
      
      1. On the **Create User Assigned Managed Identity** page, choose the required *Subscription*, *Resource group*, *Instance region*, and add an *Instance name*.
      1. Select **Review + create**.
      
         :::image type="content" source="./media/sap-hana-database-instances-backup/configure-new-managed-identity.png" alt-text="Screenshot that shows how to configure a new managed identity.":::


   You need to manually assign the permissions for the Azure Backup service to delete the snapshots as per the policy. Other [permissions are assigned in the Azure portal](#configure-snapshot-backup).
   
   To assign the Disk Snapshot Contributor role to the Backup Management Service manually in the snapshot resource group, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current).

1. Select **Create**.

You'll also need to [create a policy for SAP HANA database backup](backup-azure-sap-hana-database.md#create-a-backup-policy).

## Discover the database instance

To discover the database instance where the snapshot is present, see the [Back up SAP HANA databases in Azure VMs](backup-azure-sap-hana-database.md#discover-the-databases).


[!INCLUDE [How to configure backup for SAP HANA instance snapshot, run an on-demand backup, and monitor the backup job.](../../includes/backup-azure-configure-sap-hana-database-instance-backup.md)]

## Next steps

Learn how to:

- [Restore SAP HANA database instance snapshots on Azure VMs](sap-hana-database-instances-restore.md)
- [Manage SAP HANA databases on Azure VMs](sap-hana-database-manage.md)
