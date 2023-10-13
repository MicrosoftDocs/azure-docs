---
title: Restore SAP HANA database instances on Azure VMs
description: In this article, you'll learn how to restore SAP HANA database instances on Azure virtual machines.
ms.topic: conceptual
ms.date: 10/05/2022
ms.service: backup
ms.custom: ignite-2022
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore SAP HANA database instance snapshots on Azure VMs

This article describes how to restore a backed-up SAP HANA database instance to another target virtual machine (VM) via snapshots.

> [!Note]
> If you want to do an in-place restore (that is, overwrite the backed-up VM by detaching the existing disks and attaching new disks), detach the existing disks and see the following sections.

You can restore the HANA snapshot and storage snapshot as disks by selecting **Attach** and then mount them to the target machine. However, Azure Backup won't automatically restore the HANA system to the required point.

Here are the two workflows:

- [Restore the entire HANA system (the system database and all tenant databases) to a single snapshot-based restore point](#restore-the-entire-system-to-a-snapshot-restore-point).
- [Restore the system database and all tenant databases to a different log point in time over a snapshot](#restore-the-database-to-a-different-log-point-in-time-over-a-snapshot).

>[!Note]
>SAP HANA recommends that you recover the entire system during the snapshot restore. This means that you would also restore the system database. If the system database is restored, the users/access information is also overwritten or updated, and subsequent attempts at recovery of tenant databases might fail after the system database recovery. The two options to resolve this issue are:
>
>- Both the backed-up VM and the target VM have the same backup key (including username and password). This means that the HANA backup service can connect with the same credentials and continue to recover tenant databases.
>- If the backed-up VM and the target VM have different keys, the preregistration script must be run after the system database recovery. This action updates the credentials on the target VM, and then the tenant databases can be recovered.

## Prerequisites

#### Permissions required for the snapshot restore

During the restore, Azure Backup uses the target VM’s managed identity to read disk snapshots from a user-specified resource group, create disks in a target resource group, and attach them to the target VM. 

The resource, permissions, and scope are listed in the following table:

Entity | Built-in role | Scope of permission | Description
--- | --- | --- | ---
Target VM | Virtual Machine Contributor | The backup admin who configures and runs the HANA snapshot restore and the target VM’s managed service identity. | Restores from disk snapshots to create new managed disks and attach or mount to the target VM or operating system.
Source snapshot resource group | Disk Snapshot Contributor | The target. | Restores from disk snapshots.
The target disk resource group (where all existing disks of target VM are present, for revert). <br><br> The target disk resource group (where all new disks will be created during restore). | Disk Restore Operator | The target VM’s managed service identity. | Restores from disk snapshots to create new managed disks and attach or mount to the target VM or operating system.

After the restore is completed, you can revoke these permissions.

>[!Note]
>- The credentials that are used should have permissions to grant roles to other resources. The roles should be Owner or User Access Administrator, as mentioned in [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md#step-4-check-your-prerequisites).
>- You can use the Azure portal to assign all the preceding permissions during the restore.

## Restore the entire system to a snapshot restore point

In the following sections, you'll learn how to restore the system to the snapshot restore point.

### Select and mount the snapshot

To select and mount the snapshot, do the following:

1. In the Azure portal, go to the Recovery Services vault.

1. On the left pane, select **Backup items**.

1. Select **Primary Region**, and then select **SAP HANA in Azure VM**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-vm-in-primary-region.png" alt-text="Screenshot that shows where to select the primary region option for VM selection.":::

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA snapshot instance.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-view-details.png" alt-text="Screenshot that shows where to view the details of the HANA database snapshot.":::
 
1. Select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-hana-snapshot.png" alt-text="Screenshot that shows the 'Restore' option for the HANA database snapshot.":::

1. On the **Restore** pane, select the target VM to which the disks should be attached, the required HANA instance, and the resource group.

1. On the **Restore Point** pane, choose **Select**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-system-database-restore-point.png" alt-text="Screenshot showing to select HANA snapshot recovery point.":::

1. On the **Select restore point** pane, select a recovery point, and then select **OK**.

1. Select the corresponding resource group and the *managed identity* to which all permissions are assigned for restore.

1. Select **Validate** to check to ensure that all the permissions are assigned to the managed identity for the relevant scopes.

1. If the permissions aren't assigned, select **Assign missing roles/identity**.

   After the roles are assigned, the Azure portal automatically re-validates the permission updates.

1. Select **Attach and mount snapshot** to attach the disks to the VM.

1. Select **OK** to create disks from snapshots, attach them to the target VM, and mount them.

### Restore the system database

Recover the system database from the data snapshot by using HANA Studio. For more information, see the [SAP documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/9fd053d58cb94ac69655b4ebc41d7b05.html).

>[!Note]
>After you've restored the system database, you need to run the preregistration script on the target VM to update the user credentials.

### Restore tenant databases

When the system database is restored, recover all tenant databases from a data snapshot by using HANA Studio. For more information, see the [HANA documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/b2c283094b9041e7bdc0830c06b77bf8.html).

## Restore the database to a different log point in time over a snapshot

To restore the database to a different log point in time, do the following.

### Select and mount the nearest snapshot

First, identify the snapshot that's nearest to the required log point in time. Then [attach and mount that snapshot](#select-and-mount-the-snapshot) to the target VM.

### Restore system database

To select and restore the required point in time for the system database, follow these steps:

1. In the Recovery Services vault, on the left pane, select **Backup items**.

1. Select **Primary Region**, and then select **SAP HANA in Azure VM**.

1. On the **Backup Items** pane, select the **View details** link for the system database instance.

   :::image type="content" source="./media/sap-hana-database-instances-restore/system-database-view-details.png" alt-text="Screenshot that shows where to view details of the system database instance.":::

1. On the **systemdb** items pane, select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/open-system-database-restore-blade.png" alt-text="Screenshot that shows how to open the 'Restore' page of the system database instance.":::

1. On the **Restore** pane, select **Restore logs over snapshot**.

1. Select the required VM and resource group.

1. Below the **Restore Point** box, select the **Select** link.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-logs-over-snapshot-restore-point.png" alt-text="Screenshot that shows how to select the log restore points of the system database instance for restore.":::

1. On the **Select restore point** pane, select the restore point, and then select **OK**.

   >[!Note]
   >The logs appear after the snapshot point that you previously restored.

1. Select **OK**.


### Restore the tenant database

To restore the tenant database, do the following:

1. In the Azure portal, go to the Recovery Services vault.

1. On the left pane, select **Backup items**.

1. Select **Primary Region**, and then select **SAP HANA in Azure VM**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-vm-in-primary-region.png" alt-text="Screenshot that shows where to select the primary region option to back up the tenant database.":::

1. On the **Backup Items** pane, select the **View details** link for the SAP HANA tenant database.

   :::image type="content" source="./media/sap-hana-database-instances-restore/select-view-details-of-tenant-database.png" alt-text="Screenshot that shows the 'View details' link for the HANA tenant database.":::
 
1. Select **Restore**.

   :::image type="content" source="./media/sap-hana-database-instances-restore/restore-hana-snapshot.png" alt-text="Screenshot that shows where to select the 'Restore' option for the HANA tenant database.":::

1. On the **Restore** pane, select the target VM to which the disks should be attached, the required HANA instance, and the resource group.

   :::image type="content" source="./media/sap-hana-database-instances-restore/log-over-snapshots-for-tenant-database-restore-point.png" alt-text="Screenshot that shows where to select the restore point of the log over snapshots for the tenant database.":::

   Ensure that the target VM and target disk resource group have relevant permissions by using the PowerShell or CLI script.

1. In **Restore Point**, choose **Select**.

1. On the **Select restore point** pane, select the restore point, and then select **OK**.

   > [!Note]
   > The logs appear after the snapshot point that you previously restored.

1. Select **OK**.

> [!Note]
> Ensure that you've restored all the tenant databases according to SAP HANA guidelines.

## Cross region restore

The managed disk snapshots don't get transferred to the Recovery Services vault. So, [cross-region restore is the only possible option via Backint stream backups](sap-hana-db-restore.md#cross-region-restore).

## Next steps

- [About SAP HANA database backup on Azure VMs](sap-hana-db-about.md).
- [Manage SAP HANA database instances on Azure VMs](sap-hana-database-manage.md).
