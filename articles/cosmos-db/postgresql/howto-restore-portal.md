---
title: Restore - Azure Cosmos DB for PostgreSQL - Azure portal
description: This article describes how to perform restore operations in Azure Cosmos DB for PostgreSQL through the Azure portal.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 07/09/2021
---

# Point-in-time restore of a cluster

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This article provides step-by-step procedures to perform [point-in-time
recoveries](concepts-backup.md#restore) for a
cluster using backups. You can restore either to the earliest backup or to
a custom restore point within your retention period.

## Restoring to the earliest restore point

Follow these steps to restore your cluster to its
earliest existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose the cluster
	that you want to restore.

2.  Click **Overview** from the left panel and click **Restore**.

	> [!IMPORTANT]
	> If the **Restore** button is not yet present for your cluster,
	> please open an Azure support request to restore your cluster.

3.  The restore page will ask you to choose between the **Earliest** and a
	**Custom** restore point, and will display the earliest date.

4.  Select **Earliest restore point**.

5.  Provide a new cluster name in the **Restore to new server** field. The
	other fields (subscription, resource group, and location) are displayed but
	not editable.

6.  Click **OK**.

7.  A notification will be shown that the restore operation has been initiated.

Finally, follow the [post-restore tasks](#post-restore-tasks).

## Restoring to a custom restore point

Follow these steps to restore your cluster to a date
and time of your choosing.

1.  In the [Azure portal](https://portal.azure.com/), choose the cluster
	that you want to restore.

2.  Click **Overview** from the left panel and click **Restore**

	> [!IMPORTANT]
	> If the **Restore** button is not yet present for your cluster,
	> please open an Azure support request to restore your cluster.

3.  The restore page will ask you to choose between the **Earliest** and a
	**Custom** restore point, and will display the earliest date.

4.  Choose **Custom restore point**.

5.  Select date and time for **Restore point (UTC)**, and provide a new cluster
	name in the **Restore to new server** field. The other fields
	(subscription, resource group, and location) are displayed but not editable.
 
6.  Click **OK**.

7.  A notification will be shown that the restore operation has been
    initiated.

Finally, follow the [post-restore tasks](#post-restore-tasks).

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
  Hyperscale (Citus).
* Set [suggested
  alerts](./howto-alert-on-metric.md#suggested-alerts) on clusters.
