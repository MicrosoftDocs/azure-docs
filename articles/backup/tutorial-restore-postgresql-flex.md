---
title: Tutorial - Restore Azure Database for PostgreSQL - Flexible Server using Azure portal
description: Learn how to restore Azure Database for PostgreSQL - Flexible Server using Azure portal.
ms.topic: tutorial
ms.date: 03/04/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Tutorial: Restore Azure Database for PostgreSQL - Flexible Server using Azure portal

This tutorial describes how to restore Azure Database for PostgreSQL - Flexible Server using the Azure portal. 

## Prerequisites

Before you restore Azure Database for PostgreSQL - Flexible Server, ensure the following prerequisites are met:

- Cross Region Restore is supported only for a Backup vault that uses **Storage Redundancy** as **Geo-redundant**.
- Review the [support matrix](backup-azure-database-postgresql-flex-support-matrix.md) for a list of supported managed types and regions.
- Cross Region Restore incurs extra charges. Learn more about [pricing](https://azure.microsoft.com/pricing/details/backup/).
- Once you enable Cross Region Restore, it might take up to **48 hours** for the backup items to be available in secondary regions.
- Review the [permissions required to use Cross Region Restore](backup-rbac-rs-vault.md#minimum-role-requirements-for-azure-vm-backup). 

>[!Note]
>A vault created with **Geo-redundant storage** option enabled allows you to configure the **Cross Region Restore** feature. The Cross Region Restore feature allows you to restore data in a secondary [Azure paired region](/azure/availability-zones/cross-region-replication-azure) even when no outage occurs in the primary region; thus, enabling you to perform drills to assess regional resiliency. 

## Enable Immutability in Backup vault

Immutability in Azure Backup vault is a feature designed to protect your backup data by preventing any operations that could lead to the loss of recovery points. This feature ensures that once data is written to the vault, it can't be modified or deleted, even by administrators.

To enable immutability in the Backup vault, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/)
2.	[Create a new Backup vault](create-manage-backup-vault.md#create-backup-vault) or choose an existing Backup vault.
3.	[Enable vault immutability](backup-azure-immutable-vault-how-to-manage.md?tabs=backup-vault#enable-immutable-vault).

## Enable Cross Region Restore in Backup vault

Cross Region Restore allows you to restore data in a secondary Azure paired region. 

To configure Cross Region Restore for the backup vault, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to the **Backup vault** you created, and then select **Manage** > **Properties**.
3. Under **Vault Settings**, select **Update** corresponding to **Cross Region Restore**.
4. Under **Cross Region Restore**, select **Enable**.

   :::image type="content" source="./media/tutorial-restore-postgresql-flex/enable-cross-region-restore.png" alt-text="Screenshot shows how to enable Cross Region Restore in the Backup vault." lightbox="./media/tutorial-restore-postgresql-flex/enable-cross-region-restore.png":::

## View backup instances in secondary region

If Cross Region Restore is enabled, you can view the backup instances in the secondary region.

To view the backup instances, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **Backup vault**.
2. Under **Manage**, select **Backup instances**.
3. Select **Instance Region == Secondary Region** on the filters.

   :::image type="content" source="./media/tutorial-restore-postgresql-flex/view-database-backup-instance.png" alt-text="Screenshot shows how to view the protected instance of a database." lightbox="./media/tutorial-restore-postgresql-flex/view-database-backup-instance.png":::

## Restore the database server to the secondary region

Once the backup is complete in the primary region, it can take up to **12 hours** for the recovery point in the primary region to get replicated to the secondary region.


To restore recovery point in the secondary region, follow these steps:

1. Go to **Business Continuity Center**, and then select **Recover** on the top menu.
2. On the **Protected items** pane, under **Protected item**, select the **Select** option to choose the protected item that you want to restore.

   :::image type="content" source="./media/tutorial-restore-postgresql-flex/select-protected-items-for-restore.png" alt-text="Screenshot shows the selection of a recovery point for the database restore." lightbox="./media/tutorial-restore-postgresql-flex/select-protected-items-for-restore.png":::

3. To restore the backup to the paired region, on the **Restore** pane, on the **Basics** tab, select **Secondary Region**, and then select **Next: Restore point**.

   :::image type="content" source="./media/tutorial-restore-postgresql-flex/select-secondary-region-for-restore.png" alt-text="Screenshot shows the selection of the secondary region for restore.":::

4. On the **Restore point** tab, select the restore point that you want to use for the restore operation, and then select **Next: Restore parameter**.
5. On the **Restore parameters** tab, choose the target storage account and container, and then select **Validate** to check the restore parameters permissions before the final review and restore.
6. Once the validation is successful, select **Review + restore**.
7. On the **Review + restore** tab, select **Restore** to start the restore operation.

Once the restore starts, you can monitor the completion of the restore operation under **Jobs**.


## Next steps

[Manage backups of Azure Database for PostgreSQL - Flexible Server using Azure portal](backup-azure-database-postgresql-flex-manage.md).