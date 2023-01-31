---
title: Restore - Azure Cosmos DB for PostgreSQL - Azure portal
description: See how to perform restore operations in Azure Cosmos DB for PostgreSQL through the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/30/2023
---

# Point-in-time restore of a cluster in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This article provides step-by-step procedures to perform [point-in-time
recoveries](concepts-backup.md#restore) for a
cluster using backups. You can restore either to the earliest backup or to
a custom restore point within your retention period.

> [!IMPORTANT]
> If the **Restore** option isn't present for your cluster, open an Azure support request to restore your cluster.

## Restore to the earliest restore point

Follow these steps to restore your cluster to its
earliest existing backup.

1.  In the [Azure portal](https://portal.azure.com/), from the **Overview** page of the cluster you want to restore, select **Restore**.

1. On the **Restore** page, select the **Earliest** restore point, which is shown.

1. Provide a new cluster name in the **Restore to new cluster** field. The subscription, resource group, and location fields aren't editable.

1. Select **OK**. A notification shows that the restore operation is initiated.

1. When the restore completes, follow the [post-restore tasks](#post-restore-tasks).

## Restore to a custom restore point

Follow these steps to restore your cluster to a date
and time of your choosing.

1.  In the [Azure portal](https://portal.azure.com/), from the **Overview** page of the cluster you want to restore, select **Restore**.

1. On the **Restore** page, choose **Custom restore point**.

1. Select a date and provide a time in the date and time fields, and enter a cluster name in the **Restore to new cluster** field. The other fields aren't editable.
 
1. Select **OK**. A notification shows that the restore operation is initiated.

1. When the restore completes, follow the [post-restore tasks](#post-restore-tasks).

## Post-restore tasks

After a restore, you should do the following to get your users and applications
back up and running:

* If the new server is meant to replace the original server, redirect clients
  and client applications to the new server
* Ensure an appropriate server-level firewall is in place for
  users to connect. These rules aren't copied from the original cluster.
* Adjust PostgreSQL server parameters as needed. The parameters aren't copied
  from the original cluster.
* Ensure appropriate logins and database level permissions are in place.
* Configure alerts, as appropriate.

## Next steps

* Learn more about [backup and restore](concepts-backup.md) in
  Azure Cosmos DB for PostgreSQL.
* Set [suggested alerts](./howto-alert-on-metric.md#suggested-alerts) on clusters.
