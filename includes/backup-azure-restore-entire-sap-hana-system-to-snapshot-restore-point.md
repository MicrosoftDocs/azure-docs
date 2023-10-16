---
title: include file
description: include file
services: backup
ms.service: backup
ms.topic: include
ms.date: 02/17/2023
author: jyothisuri
ms.author: jsuri
---

In the following sections, you'll learn how to restore the system to the snapshot restore point.

### Select and mount the snapshot

To select and mount the snapshot, do the following:

1. In the Azure portal, go to the Recovery Services vault.

1. On the left pane, select **Backup items**.

1. Select **Primary Region**, and then select **SAP HANA in Azure VM**.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/select-vm-in-primary-region.png" alt-text="Screenshot that shows where to select the primary region option for VM selection.":::

1. On the **Backup Items** page, select **View details** corresponding to the SAP HANA snapshot instance.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/select-view-details.png" alt-text="Screenshot that shows where to view the details of the HANA database snapshot.":::
 
1. Select **Restore**.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/restore-hana-snapshot.png" alt-text="Screenshot that shows the 'Restore' option for the HANA database snapshot.":::

1. On the **Restore** pane, select the target VM to which the disks should be attached, the required HANA instance, and the resource group.

1. On the **Restore Point** pane, choose **Select**.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/restore-system-database-restore-point.png" alt-text="Screenshot showing to select HANA snapshot recovery point.":::

   >[!Note]
   >**Attach and mount only** option creates disks from the selected snapshot point and mounts to the targeted VM. After the restore is complete, use *HANA studio* to initiate the restore-from-snapshot process and complete the *system database* restore to the latest recovery point. Then run the *pre-registration script* on the target VM to reset the backup user credentials. Then proceed to complete the tenant DB restore process, to the same snapshot or logpoint-in-time via backing

1. On the **Select restore point** pane, select a recovery point, and then select **OK**.

1. Select the corresponding resource group and the *managed identity* to which all permissions are assigned for restore.

1. Select **Validate** to check to ensure that all the permissions are assigned to the managed identity for the relevant scopes.

1. If the permissions aren't assigned, select **Assign missing roles/identity**.

   After the roles are assigned, the Azure portal automatically re-validates the permission updates.

1. Select **OK** to create disks from snapshots, attach them to the target VM, and mount them.


### Restore the system database

To restore the system database using the Azure portal, follow these steps:

1. Go to the **Restore** pane, and then select **System Database (Including attach and mount)**.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/restore-system-database-and-attach-mount-disk.png" alt-text="Screenshot shows how to restore database including attach and mount disks to target VM.":::

   >[!Note]
   >This option creates disks from the selected snapshot restore point and attaches these disks to the specified target VM. It also restores the *system database* on the target VM.

1. On **VM**, select the target VM from the dropdown list.
1. Under **Snapshot Restore Point**, click **Select** and choose the restore point.
1. Select **Validate**.
1. After the validation is complete, select **OK** to restore.

To recover the system database from the data snapshot by using HANA Studio. For more information, see the [SAP documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/9fd053d58cb94ac69655b4ebc41d7b05.html).

>[!Note]
>After you've restored the system database, you need to run the preregistration script on the target VM to update the user credentials.

### Restore tenant databases

When the system database is restored, run the preregistration script on the target VM and  restore the tenant databases.

To restore the tenant databases using the Azure portal, follow these steps:

1. Go to the **Restore** pane, and then select **Tenant database(s)**.

   :::image type="content" source="../backup/media/sap-hana-database-instances-restore/restore-tenant-database.png" alt-text="Screenshot shows how to start restoring tenant database to target VM.":::

1. On **VM**, select the target VM from the dropdown list.
1. Under **Snapshot Restore Point**, click **Select** and choose the restore point.
1. Select **Validate**.
1. After the validation is complete, select **OK** to restore.

You can also use HANA Studio to recover all tenant databases from a data snapshot. For more information, see the [HANA documentation](https://help.sap.com/docs/SAP_HANA_COCKPIT/afa922439b204e9caf22c78b6b69e4f2/b2c283094b9041e7bdc0830c06b77bf8.html).