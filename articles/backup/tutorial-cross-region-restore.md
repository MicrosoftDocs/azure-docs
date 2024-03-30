---
title: Tutorial - Configure and run Cross Region Restore for Azure database for PostgreSQL
description: Learn how to configure and run Cross Region Restore for Azure database for PostgreSQL using Azure Backup.
ms.topic: tutorial
ms.date: 02/01/2024
ms.service: backup
ms.author: v-abhmallick
---

# Tutorial: Configure and run Cross Region Restore for Azure database for PostgreSQL by using Azure Backup

This tutorial describes how you can enable and run Cross Region Restore to restore SQL databases hosted on Azure VMs in a secondary region.

The Cross Region Restore option allows you to restore data in a secondary [Azure paired region](/azure/availability-zones/cross-region-replication-azure) even when no outage occurs in the primary region; thus, enabling you to perform drills to assess regional resiliency.  

> [!NOTE]
>- Currently, Geo-redundant Storage (GRS) vault with Cross Region Restore enabled can't be changed to Zone-redundant Storage (ZRS) or Locally-redundant Storage (LRS) after the protection starts for the first time.  
>- Secondary region Recovery Point Objective (RPO) is currently *36 hours*. This is because the RPO in the primary region is 24 hours and can take up to 12 hours to replicate the backup data from the primary to the secondary region.  

## Considerations

Before you begin Cross Region Restore for PostgreSQL server, see the following information:  

- Cross Region Restore is supported only for a Backup vault that uses Storage Redundancy = Geo-redundant.
- PostgreSQL databases hosted on Azure VMs are supported. You can restore databases or their files. 
- Review the [support matrix](./backup-support-matrix.md) for a list of supported managed types and regions.
- Cross Region Restore option incurs additional charges. [Learn more about pricing](https://azure.microsoft.com/pricing/details/backup/).
- Once you enable Cross Region Restore, it might take up to 48 hours for the backup items to be available in secondary regions.
- Review the [permissions required to use Cross Region Restore](backup-rbac-rs-vault.md#minimum-role-requirements-for-azure-vm-backup).  

A vault created with GRS redundancy includes the option to configure the Cross Region Restore feature. Every GRS vault has a banner that links to the documentation.  

## Enable Cross Region Restore on a Backup vault 

The Cross Region Restore option allows you to restore data in a secondary Azure paired region. 

To configure Cross Region Restore for the backup vault, follow these steps:  

1. Sign in to [Azure portal](https://portal.azure.com/).
1. [Create a new Backup vault](create-manage-backup-vault.md#create-backup-vault) or choose an existing Backup vault.
1. Enable Cross Region Restore:
    1. Select **Properties** (under Manage).  
    1. Under **Vault Settings**, select **Update** for Cross Region Restore.
    1. Under **Cross Region Restore**, select **Enable**.

     :::image type="content" source="./media/tutorial-cross-region-restore/update-for-cross-region-restore.png" alt-text="Screenshot showing the selection of update for cross region restore.":::

     :::image type="content" source="./media/tutorial-cross-region-restore/enable-cross-region-restore.png" alt-text="Screenshot shows the Enable cross region restore option.":::

## View backup instances in secondary region 

If CRR is enabled, you can view the backup instances in the secondary region. 

Follow these steps:

1. From the [Azure portal](https://portal.azure.com/), go to your Backup vault.
1. Select **Backup instances** under **Manage**. 
1. Select **Instance Region** == *Secondary Region* on the filters. 

     :::image type="content" source="./media/tutorial-cross-region-restore/backup-instances-secondary-region.png" alt-text="Screenshot showing the secondary region filter." lightbox="./media/tutorial-cross-region-restore/backup-instances-secondary-region.png":::


## Restore the database to the secondary region 

To restore the database to the secondary region, follow these steps:

1. Go to the Backup vault’s **Overview** pane, and then configure a backup for PostgreSQL database. 
    > [!Note]
    > Once the backup is complete in the primary region, it can take up to 12 hours for the recovery point in the primary region to get replicated to the secondary region. 
1. To check the availability of recovery point in the secondary region, go to the **Backup center** > **Backup Instances**.
1. Filter to **Azure Database for PostgreSQL servers**, then filter Instance region as **Secondary Region**, and then select the required Backup Instance. 
     :::image type="content" source="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png" alt-text="Screenshot showing how to view jobs in secondary region." lightbox="./media/create-manage-backup-vault/view-jobs-in-secondary-region.png":::

   The recovery points available in the secondary region are now listed. 

1. Select **Restore to secondary region**. 

    You can also trigger restores from the respective backup instance. 
1. Select Restore to secondary region to review the target region selected, and then select the appropriate recovery point and restore parameters. 
1. Once the restore starts, you can monitor the completion of the restore operation under Backup Jobs of the Backup vault by filtering Jobs workload type to Azure Database for PostgreSQL servers and Instance Region to Secondary Region. 


## Next steps

For more information about backup and restore with Cross Region Restore, see:

- [Cross Region Restore for PostGreSQL Servers](create-manage-backup-vault.md#perform-cross-region-restore-using-azure-portal).
- [Restore Azure Database for PostgreSQL backups](./restore-azure-database-postgresql.md).