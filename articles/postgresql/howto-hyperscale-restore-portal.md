---
title: Restore - Hyperscale (Citus) - Azure Database for PostgreSQL - Azure portal
description: This article describes how to perform restore operations in Azure Database for PostgreSQL - Hyperscale (Citus) through the Azure portal.
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 04/14/2021
---

# Point-in-time restore of a Hyperscale (Citus) server group

This article provides step-by-step procedures to perform [point-in-time
recoveries](concepts-hyperscale-backup.md#restore) for a Hyperscale (Citus)
server group using backups. You can restore either to the earliest backup or to
a custom restore point within your retention period.

## Restoring to the earliest restore point

Follow these steps to restore your Hyperscale (Citus) server group to its
earliest existing backup.

1.  In the [Azure portal](https://portal.azure.com/), choose the server group
	that you want to restore.

2.  Click **Overview** from the left panel and click **Restore**.

	> [!IMPORTANT]
	> If the **Restore** button is not yet present for your server group,
	> please open an Azure support request.

3.  The restore page will ask you to choose between the **Earliest** and a
	**Custom** restore point, and will display the earliest date.

4.  Select **Earliest restore point**.

5.  Provide a new server group name in the **Restore to new server** field. The
	other fields (subscription, resource group, and location) are displayed but
	not editable.

6.  Click **OK**.

7.  A notification will be shown that the restore operation has been initiated.

Finally, follow the [post-restore tasks](#post-restore-tasks).

## Restoring to a custom restore point

Follow these steps to restore your Hyperscale (Citus) server group to a date
and time of your choosing.

1.  In the [Azure portal](https://portal.azure.com/), choose the server group
	that you want to restore.

2.  Click **Overview** from the left panel and click **Restore**

	> [!IMPORTANT]
	> If the **Restore** button is not yet present for your server group,
	> please open an Azure support request.

3.  The restore page will ask you to choose between the **Earliest** and a
	**Custom** restore point, and will display the earliest date.

4.  Choose **Custom restore point**.

5.  Select date and time for **Restore point (UTC)**, and provide a new server
	group name in the **Restore to new server** field. The other fields
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
  users to connect. These rules aren't copied from the original server group.
* Adjust PostgreSQL server parameters as needed. The parameters aren't copied
  from the original server group.
* Ensure appropriate logins and database level permissions are in place.
* Configure alerts, as appropriate.

## Next steps

* Learn more about [backup and restore](concepts-hyperscale-backup.md) in
  Hyperscale (Citus).
* Set [suggested
  alerts](./howto-hyperscale-alert-on-metric.md#suggested-alerts) on Hyperscale
  (Citus) server groups.
