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
- Cross Region Restore incurs additional charges. Learn more about [pricing](https://azure.microsoft.com/pricing/details/backup/).
- Once you enable Cross Region Restore, it might take up to **48 hours** for the backup items to be available in secondary regions.
- Review the [permissions required to use Cross Region Restore](backup-rbac-rs-vault.md#minimum-role-requirements-for-azure-vm-backup). 

>[!Note]
>A vault created with **Geo-redundant storage** option enabled allows you to configure the **Cross Region Restore** feature. The Cross Region Restore feature allows you to restore data in a secondary [Azure paired region](/azure/availability-zones/cross-region-replication-azure) even when no outage occurs in the primary region; thus, enabling you to perform drills to assess regional resiliency. 

## Enable Immutability in Backup vault

Immutability in Azure Backup vault is a feature designed to protect your backup data by preventing any operations that could lead to the loss of recovery points. This feature ensures that once data is written to the vault, it can't be modified or deleted, even by administrators.

To enable immutability in the Backup vault,follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/)
2.	[Create a new Backup vault](create-manage-backup-vault.md#create-backup-vault) or choose an existing Backup vault.
3.	[Enable vault immutability](backup-azure-immutable-vault-how-to-manage.md?tabs=backup-vault#enable-immutable-vault).

## Enable Cross Region Restore in Backup vault

Cross Region Restore allows you to restore data in a secondary Azure paired region. 

To configure Cross Region Restore for the backup vault, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to the **Backup vault** you created,select **Manage** > **Properties**.
3. Under **Vault Settings**, select **Update** corresponding to **Cross Region Restore**.
4. Under **Cross Region Restore**, select **Enable**.

## View backup instances in secondary region

If Cross Region Restore is enabled, you can view the backup instances in the secondary region.

To vire the backup instances, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to your **Backup vault**.
2. Under **Manage**, select **Backup instances**.
3. Select **Instance Region == Secondary Region** on the filters.

## Restore the database server to the secondary region

Once the backup is complete in the primary region, it can take up to **12 hours** for the recovery point in the primary region to get replicated to the secondary region.

To restore the database server to the secondary region, follow these steps:

1.	To check the availability of recovery point in the secondary region, go to the Backup center > Backup Instances.
2.	Select Restore to secondary region.
 
You can also trigger restores from the respective backup instance.
3.	Select Restore to secondary region to review the target region selected, and then select the appropriate recovery point and restore parameters.
4.	Once the restore starts, you can monitor the completion of the restore operation under Backup Jobs of the Backup vault by filtering Jobs workload type to Azure Database for PostgreSQL – flexible servers and Instance Region to Secondary Region.




