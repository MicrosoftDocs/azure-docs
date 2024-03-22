---
title: Restore - Azure Cosmos DB for PostgreSQL - Azure portal
description: See how to perform restore operations in the same or another region in Azure Cosmos DB for PostgreSQL through the Azure portal.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: references_regions
ms.topic: how-to
ms.date: 01/28/2024
---

# Backup and point-in-time restore of a cluster in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This article provides step-by-step procedures to select backup type, to check type of backup enabled on a cluster, and to perform [point-in-time
recoveries](concepts-backup.md#restore) for a
cluster using backups. You can restore either to the earliest backup or to
a custom restore point within your retention period.

> [!NOTE]
> While cluster backups are always stored for 35 days, you might need to 
> open a support request to restore the cluster to a point that is earlier
> than the latest failover time. Maintenance and compute / storage scaling operations use
> failovers to minimize downtime during these operations.

## Select type of cluster backup
Enabling geo-redundant backup is possible during cluster creation on the **Scale** screen that can be accessed on the **Basics** tab. Click the **Save** button to apply your selection. 

> [!NOTE]
> Geo-redundant backup can be enabled only during cluster creation or cluster restore. 
> You can't disable geo-redundant backup once cluster is created. 

## Confirm type of backup
To check what type of backup is enabled on a cluster, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), select an existing Azure Cosmos DB for PostgreSQL cluster.
1. On the **Overview** page, check **Backup** field in the **Essentials** section.

The **Backup** field values can be **Locally redundant** or **Zone redundant** for the same region cluster backup or **Geo-redundant** for the backup stored in another Azure region.

## Restore to the earliest restore point

Follow these steps to restore your cluster to its
earliest existing backup.

1. In the [Azure portal](https://portal.azure.com/), from the **Overview** page of the cluster you want to restore, select **Restore**.

1. On the **Restore** page, select the **Earliest** restore point, which is shown.

1. Provide a new cluster name in the **Restore to new cluster** field. The subscription and resource group fields aren't editable.

1. If cluster has geo-redundant backup enabled, select remote or same region for restore in the **Location** field. On clusters with zone-redundant and locally redundant backup, location field isn't editable.

1. Set **Geo-redundant backup** checkbox for geo-redundant backup *for the restored cluster* to be stored [in another Azure region](./resources-regions.md). 

1. Select **Next**. 

1. (optional) Make data encryption selection for restored cluster on the **Encryption** tab.

1. Select **Create**. A notification shows that the restore operation is initiated.

1. When the restore completes, follow the [post-restore tasks](#post-restore-tasks).

## Restore to a custom restore point

Follow these steps to restore your cluster to a date
and time of your choosing.

1. In the [Azure portal](https://portal.azure.com/), from the **Overview** page of the cluster you want to restore, select **Restore**.

1. On the **Restore** page, choose **Custom restore point**.

1. Select a date and provide a time in the date and time fields, and enter a cluster name in the **Restore to new cluster** field. The subscription and resource group fields aren't editable.

1. If cluster has geo-redundant backup enabled, select remote or same region for restore in the **Location** field. On clusters with zone-redundant and locally redundant backup, location field isn't editable.

1. Set **Geo-redundant backup** checkbox for geo-redundant backup *for the restored cluster* to be stored [in another Azure region](./resources-regions.md). 

1. Select **Next**. 

1. (optional) Make data encryption selection for restored cluster on the **Encryption** tab.

1. Select **Create**. A notification shows that the restore operation is initiated.

1. When the restore completes, follow the [post-restore tasks](#post-restore-tasks).

## Post-restore tasks

After a restore, you should do the following to get your users and applications
back up and running:

* If the new cluster is meant to replace the original cluster, redirect clients
  and client applications to the new cluster.
* Ensure appropriate [networking settings for private or public access](./concepts-security-overview.md#network-security) are in place for
  users to connect. These settings aren't copied from the original cluster.
* Ensure appropriate [logins](./how-to-configure-authentication.md#configure-native-postgresql-authentication) and database level permissions are in place.
* Configure [alerts](./howto-alert-on-metric.md#suggested-alerts), as appropriate.

## Next steps

* Learn more about [backup and restore](concepts-backup.md) in
  Azure Cosmos DB for PostgreSQL.
* See [the list of Azure regions where geo-redundant backup is supported](./resources-regions.md)
* See [backup and restore limits and limitations](./reference-limits.md#backup-and-restore).
* Set [suggested alerts](./howto-alert-on-metric.md#suggested-alerts) on clusters.
