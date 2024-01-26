---
title: Quickstart - Restore a PostgreSQL database across regions using Azure Backup 
description: Learn how to restore a PostgreSQL database across regions by using Azure Backup.
ms.topic: quickstart
ms.date: 12/18/2023
ms.service: backup
ms.author: v-abhmallick
---

# Quickstart: Restore a PostgreSQL database across regions using Azure Backup

This quickstart describes how to enable Cross Region Restore on your Backup vault to restore the data to an alternate region when the primary region is down. 

The Cross Region Restore option allows you to restore data in a secondary [Azure paired region](/azure/availability-zones/cross-region-replication-azure) even when no outage occurs in the primary region; thus, enabling you to perform drills drills when there's an audit or compliance requirement.

> [!NOTE]
>- Currently, Geo-redundant Storage (GRS) vaults with Cross Region Restore enabled can't be reverted to ZRS or LRS after the protection starts for the first time.
>- Cross Regional Restore (CRR) with CSR is currently not supported. 

## Prerequisites

To begin with the Cross Region Restore restore, ensure that you have the following: 

- A Backup vault with Cross Region Restore configured. [Create one](./create-manage-backup-vault.md#create-a-backup-vault) in case you don’t a Backup vault. 
- PostgreSQL database is protected by using Azure Backup, and one full backup is run. To protect and back up a database, see this [article](backup-azure-database-postgresql.md). 

## Restore the database using Azure portal  

To restore the database to the secondary region using the Azure portal, follow these steps:

1. Sign in to [Azure portal](https://portal.azure.com/).
1. To check the available recovery point in the secondary region, go to the **Backup center** > **Backup Instances**.
1. Filter to **Azure Database for PostgreSQL servers**, then filter **Instance Region** as *Secondary Region*
1. Select the required Backup instance. 
1. The recovery points available in the secondary region are now listed.  Choose **Restore to secondary region**. 
 You can also trigger restores from the respective backup instance. 
1. Select **Restore to secondary region** to review the target region selected, and then select the appropriate recovery point and restore parameters. 
    :::image type="content" source="./media/create-manage-backup-vault/restore-to-secondary-region.png" alt-text="Screenshot showing how to restore to secondary region." lightbox="./media/create-manage-backup-vault/restore-to-secondary-region.png":::
1. Once the restore starts, you can monitor the completion of the restore operation under **Backup Jobs** of the Backup vault by filtering **Datasource type** to *Azure Database for PostgreSQL servers*  and **Instance Region** to *Secondary Region*. 
 
## Next steps

- Continue to [learn about the Cross Region Restore](./tutorial-cross-region-restore.md) feature.