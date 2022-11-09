---
title: Restore SAP HANA database instances on Azure VMs
description: In this article, discover how to restore SAP HANA database instances that on Azure Virtual Machines.
ms.topic: conceptual
ms.date: 10/05/2022
author: v-amallick
ms.service: backup
ms.custom: ignite-2022
ms.author: v-amallick
---

# Restore SAP HANA databases' instance snapshots in Azure VMs (preview)

This article describes how to restore a backed-up SAP HANA database instance to another target VM via snapshots.

>[!Note]
>If you want to do an in-place restore (overwrite the backed-up VM by detaching the existing disks and attaching new disks), detach the existing disks and see the following sections for restore.

You can restore the HANA snapshot + storage snapshot as disks by selecting Attach and mount to the target machine. However, Azure Backup won't automatically restore HANA system to the required point.

Here are the two workflows:

- [Restore entire HANA system (system database and all tenant databases) to a single snapshot based restore point](#restore-entire-system-to-snapshot-restore-point).
- [Restore system database and all tenant database to a different log point-in-time over snapshot](#restore-database-to-a-different-log-point-in-time-over-snapshot).

>[!Note]
>SAP HANA recommends recovering the entire system during snapshot restore. This means that you must also restore the system database. If system database is restored, the users/access information is now also overwritten or updated, and subsequent attempts of recovery of tenant databases might fail after system database recovery. The two options to resolve this issue are:
>
>- Both backed-up VM and the target VM have the same backup key (including username and password). This means that HANA backup service can connect with the same credentials and continue to recover tenant databases.
>- If the backed-up VM and the target VM have different keys then the pre-registration script has to be run after system database recovery. This will update credentials on the target VM and then the tenant databases could be recovered.

## Prerequisites

#### Permissions required for snapshot restore

During restore, Azure Backup uses target VM’s Managed Identity to read disk snapshots from a user-specified resource group, create disks in a target resource group, and attach them to the target VM. 

The following table lists the resource, permissions, and scope.

>[!Note]
>Once restore is completed, you can revoke these permissions.

Entity | Built-in role | Scope of permission | Description
--- | --- | --- | ---
Target VM | Virtual Machine Contributor | Backup admin who configures/runs HANA snapshot restore and Target VM’s MSI. | Restores from disk snapshots to create new managed disks and attach/mount to target VM/OS.
Source snapshot resource group | Disk Snapshot Contributor | Target | Restores from disk snapshots.
Target disk resource group (where all existing disks of target VM are present, for revert). <br><br> Target disk resource group (where all new disks will be created during restore). | Disk Restore Operator | Target VM’s MSI | Restores from disk snapshots to create new managed disks and attach/mount to target VM/OS.

>[!Note]
>
>- The credentials used should have permissions to grant roles to other resources and should be Owner or User Access Administrator [as mentioned here](../role-based-access-control/role-assignments-steps.md#step-4-check-your-prerequisites).
>- You can use Azure portal to assign all above permissions during restore.

## Restore entire system to snapshot restore point

In the following sections, you'll learn how to restore the system to snapshot restore point.

### Select and mount the snapshot

Follow these steps:

1. In the Azure portal, go to Recovery Services vault.

1. In the left pane, select **Backup items**.

1. Select **Primary Region** and select **SAP HANA in Azure VM**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-vm-in-primary-region.png" alt-text="Screenshot showing to select the primary region option for VM selection.":::

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA snapshot instance.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-view-details.png" alt-text="Screenshot showing to select view details of HANA database snapshot.":::
 
1. Select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-hana-snapshot.png" alt-text="Screenshot showing to select the Restore option for HANA database snapshot.":::

1. On the **Restore** page, select the target VM to which the disks should be attached, the required HANA instance, and the resource group.

1. In **Restore Point**, choose **Select**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-system-database-restore-point.png" alt-text="Screenshot showing to select HANA snapshot recovery point.":::

1. In the **Select restore point** pane, select a recovery point and select **OK**.

1. Select the corresponding resource group and the *managed identity* to which all permissions are assigned for restore.

1. Select *Validate* to check if all the permissions are assigned to the managed identity for the relevant scopes.

1. If the permissions aren't assigned, select **Assign missing roles/identity**.

   After the roles are assigned, the Azure portal automatically re-validates the permission updates shows successful.

1. Select **Attach and mount snapshot** to attach the disks to the VM.

1. Select **OK** to create disks from snapshots, attach them to the target VM and mount them.

### Restore System DB

Recover System database from data snapshot using HANA Studio. See [this SAP documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/9fd053d58cb94ac69655b4ebc41d7b05.html).

>[!Note]
>After restoring System DB, you need to run the pre-registration script on the target VM to update the user credentials.

### Restore Tenant databases

Once done, recover all Tenant databases from a data snapshot using HANA Studio. See [this HANA documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/b2c283094b9041e7bdc0830c06b77bf8.html).

## Restore database to a different log point-in-time over snapshot

Perform the following actions.

### Select and mount the nearest snapshot

First, decide the nearest snapshot to the required log point-in-time. Then [attach and mount that snapshot](#select-and-mount-the-snapshot) to the target VM.

### Restore system database

To select and restore the required point-in-time for System DB, follow these steps:

1. Go to Recovery Services vault and select **Backup items** from the left pane.

1. Select **Primary Region** and select **SAP HANA in Azure VM**.

1. On the **Backup Items** page, select **View details** corresponding to the related system database instance.

   :::image type="content" source="./media/sap-hana-database-instances-restore/system-database-view-details.png" alt-text="Screenshot showing to view details of system database instance.":::

1. On the system database items page, select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/open-system-database-restore-blade.png" alt-text="Screenshot showing to open the restore page of system database instance.":::

1. On the **Restore** page, select **Restore logs over snapshot**.

1. Select the required VM and resource group.

1. On **Restore Point**, choose **Select**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-logs-over-snapshot-restore-point.png" alt-text="Screenshot showing how to select log restore points of system database instance for restore.":::

1. On the **Select restore point** pane, select the restore point and select **OK**.

   >[!Note]
   >The logs appears after the snapshot point that you previously restored.

1. Select **OK**.


### Restore tenant database

Follow these steps:

1. In the Azure portal, go to Recovery Services vault.

1. In the left pane, select **Backup items**.

1. Select **Primary Region** -> **SAP HANA in Azure VM**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-vm-in-primary-region.png" alt-text="Screenshot showing to select the primary region option to back up tenant DB.":::

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA tenant database.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-view-details-of-tenant-database.png" alt-text="Screenshot showing to select view details of HANA tenant database.":::
 
1. Select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-hana-snapshot.png" alt-text="Screenshot showing to select the Restore option for HANA tenant database.":::

1. On the **Restore** page, select the target VM to which the disks should be attached, the required HANA instance, and the resource group.

   :::image type="content" source="./media/sap-hana-database-instances-restore/log-over-snapshots-for-tenant-database-restore-point.png" alt-text="Screenshot showing how to select restore point of log over snapshots for tenant database.":::

   Ensure that the target VM and target disk resource group have relevant permissions using the PowerShell/CLI script.

1. In **Restore Point**, choose **Select**.

1. On the **Select restore point** pane, select the restore point and select **OK**.

   >[!Note]
   >The logs appear after the snapshot point that you previously restored.

1. Select **OK**.

>[!Note]
>Ensure that you restore all tenant databases as per SAP HANA guidelines.

## Cross region restore

The Managed Disk snapshots don't get transferred to Recovery Services vault. So, cross-region [restore is only possible via Backint stream backups](sap-hana-db-restore.md#cross-region-restore).

## Next steps

- [About SAP HANA database backup in Azure VMs](sap-hana-db-about.md).
- [Manage SAP HANA database instances in Azure VMs (preview)](sap-hana-database-manage.md).
