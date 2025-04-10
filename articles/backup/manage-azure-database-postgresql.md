---
title: Manage an Azure Database for PostgreSQL Server by Using the Azure Portal
description: Learn about managing an Azure Database for PostgreSQL server.
ms.topic: how-to
ms.date: 09/11/2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Manage an Azure Database for PostgreSQL server by using the Azure portal

This article describes how to manage an Azure Database for PostgreSQL server that you back up by using the Azure Backup service.

## <a name = "change-policy"></a>Change a policy

You can change the policy that's associated with a backup instance.

Changing the backup policy does not affect existing recovery points and their retention duration. The updated retention settings apply only to new recovery points that you create after the policy change.

1. In the Azure portal, go to your backup instance, and then select **Change Policy**.

   :::image type="content" source="./media/manage-azure-database-postgresql/change-policy.png" alt-text="Screenshot that shows the Change Policy button.":::

1. Select the new policy that you want to apply to the database.

   :::image type="content" source="./media/manage-azure-database-postgresql/reassign-policy.png" alt-text="Screenshot that shows the Reassign Policy pane.":::

## <a name = "stop-protection"></a>Stop backup

There are three ways to stop backing up an Azure Database for PostgreSQL server:

- **Stop backup and retain data forever**: This option helps you stop all future backup jobs for your Azure Database for PostgreSQL server. However, the Azure Backup service retains the backed-up recovery points forever. You need to pay to keep the recovery points in the vault. (For details, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).) You can restore from these recovery points, if needed. To resume backup jobs, use the **Resume backup** option.

- **Stop backup and retain data according to a policy**: This option helps you stop all future backup jobs for your Azure Database for PostgreSQL server. The recovery points are retained according to a policy and are chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point is retained forever.

- **Stop backup and delete data**: This option helps you stop all future backup jobs for your Azure Database for PostgreSQL server and delete all the recovery points. You can't restore the database or use the **Resume backup** option.

### <a name = "stop-protection-and-retain-data"></a>Stop backup and retain data

1. In the Azure portal, go to **Backup center** and select **Azure Database for PostgreSQL server**.

1. In the list of server backup instances, select the instance that you want to retain.

1. Select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/select-postgresql-server-backup-instance-to-delete-inline.png" alt-text="Screenshot that shows the selection of the Azure Database for PostgreSQL server backup instance to be stopped." lightbox="./media/manage-azure-database-postgresql/select-postgresql-server-backup-instance-to-delete-expanded.png":::

1. Select one of the following options for data retention:

   - **Retain forever**
   - **Retain as per policy**

   :::image type="content" source="./media/manage-azure-database-postgresql/data-retention-options-inline.png" alt-text="Screenshot that shows the options for data retention." lightbox="./media/manage-azure-database-postgresql/data-retention-options-expanded.png":::

   You can also select the reason for stopping the backup in the **Reason** dropdown list.

1. Select **Stop Backup**.

1. Select **Confirm**.

   :::image type="content" source="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-inline.png" alt-text="Screenshot that shows the confirmation for stopping a backup." lightbox="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-expanded.png":::

### <a name = "stop-protection-and-delete-data"></a>Stop backup and delete data

1. In the Azure portal, go to **Backup center** and select **Azure Database for PostgreSQL server**.

1. In the list of server backup instances, select the instance that you want to delete.

1. Select **Stop Backup**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, the reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-database-postgresql/delete-backup-data-and-provide-details-inline.png" alt-text="Screenshot of the pane for entering details about deleting backup data." lightbox="./media/manage-azure-database-postgresql/delete-backup-data-and-provide-details-expanded.png":::

1. Select **Stop Backup**.

1. Select **Confirm**.

   :::image type="content" source="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-inline.png" alt-text="Screenshot of the confirmation for stopping a backup." lightbox="./media/manage-azure-database-postgresql/confirmation-to-stop-backup-expanded.png":::

## <a name = "resume-protection"></a>Resume backup

If you selected the option to stop backup and retain data, you can resume backing up your Azure Database for PostgreSQL server.

When you resume protecting a backup instance, the existing backup policy starts applying to new recovery points only. Recovery points that already expired based on their original retention duration, as defined by the backup policy in effect at the time of their creation, are cleaned up.

1. In the Azure portal, go to **Backup center** and select **Azure Database for PostgreSQL server**.

1. In the list of server backup instances, select the instance that you want to resume.

1. Select **Resume Backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-protection-inline.png" alt-text="Screenshot that shows details for a backup instance and the Resume Backup button." lightbox="./media/manage-azure-database-postgresql/resume-data-protection-expanded.png":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-database-postgresql/resume-data-backup-inline.png" alt-text="Screenshot that shows details for a resumed data backup." lightbox="./media/manage-azure-database-postgresql/resume-data-backup-expanded.png":::

## Related content

- [Backup vaults overview](backup-vault-overview.md)
