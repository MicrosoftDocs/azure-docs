---
title: Restore Azure Elastic SAN backup using the Azure portal (preview)
description: Learn how to restore Elastic SAN backup using the Azure portal.
ms.topic: how-to
ms.date: 06/20/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to restore backups of Azure Elastic SAN using the portal, so that I can ensure data recovery and business continuity in case of data loss.
---

# Restore Azure Elastic SAN backup using the Azure portal (preview)

This article describes how to restore Elastic SAN backup (preview) using the Azure portal.

Learn about the [supported scenarios, limitations, and region availability for Elastic SAN backup/restore](azure-elastic-storage-area-network-backup-support-matrix.md).

## Restore the Elastic SAN backup (preview)

To  restore the Elastic SAN  backup, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to **Business Continuity Center**, and then select **Recover**.
1. On the **Recover** pane, select **Datasource type** as **Elastic SAN volumes (Preview)**,  and then under **Protected item**, click **Select**.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/select-protected-item.png" alt-text="Screenshot shows the selection of datasource type." lightbox="./media/azure-elastic-storage-area-network-backup-restore/select-protected-item.png":::

1. On the **Select protected item** pane, select the Elastic SAN instance that you want to restore, and then click **Select**.
1. On the **Recover** pane, select **Continue**.
1. On the **Restore** pane, on the **Restore point** tab, under **Restore point**, click **Select restore point**.

   By default, the latest restore point is selected.

1. On the **Select restore point** pane, select the required restore point from the list.
1. On the **Restore** pane, on the **Restore parameters** tab, click **Select** to specify the restore configuration parameters.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/set-restore-parameter.png" alt-text="Screenshot shows how to configure restore." lightbox="./media/azure-elastic-storage-area-network-backup-restore/set-restore-parameter.png":::

1. On the **Restore configuration** pane, select the **Target subscription**, **Resource group**, **Target Elastic SAN instance**, and **Target Elastic SAN volume group**, to restore.

   By default, the source Elastic SAN instance is selected.

1. Under **Target volume details**, select the volumes you want to restore.
1. Under **Volume name**, enter a name for the volume to be created, and then click **Select**.

   >[!Note]
   >- An Elastic SAN volume name, once assigned, can't be changed.
   >- You can't overwrite an existing volume. If a volume with the same name exists, the restore operation fails.


1. On the **Restore parameters** tab, select **Validate** to ensure that the required permissions to perform the restore are assigned to the backed-up Elastic SAN volume. 

   Validation errors appear if the selected Backup vault's Managed-system Identity (MSI) doesn't have the **Elastic SAN Volume Importer** and **Reader (on the snapshot resource group)** roles assigned.

1. To assign the required roles, select **Assign missing roles**.

   >[!Note]
   >If you don't have the **Role-Based Access Control Administrator** permissions, the **Assign Missing Roles** option is disabled.

   :::image type="content" source="./media/azure-elastic-storage-area-network-backup-restore/assign-missing-roles.png" alt-text="Screenshot shows how to assign missing roles for the restore operation." lightbox="./media/azure-elastic-storage-area-network-backup-restore/assign-missing-roles.png":::

1. On the **Grant missing permissions** pane, select the scope (Target Elastic SAN instance, Target resource group, or Target subscription) at which the access permissions must be granted, and then select **Next**.

1. When the role assignment is complete, on the **Restore** pane, on the **Restore parameter** tab, select **Validate**.

   When the validation succeeds, the **Success** message appears.

1. On the **Review + restore** tab, select **Restore** to start the restore operation.

You can [track the progress of restore](azure-elastic-san-backup-manage.md#view-the-elastic-san-backup-and-restore-jobs-preview) under **Backup Jobs**. 
 
## Next steps

[Manage Azure Elastic SAN backup using the Azure portal (preview)](azure-elastic-storage-area-network-backup-manage.md).
