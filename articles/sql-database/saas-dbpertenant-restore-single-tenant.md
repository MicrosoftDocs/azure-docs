---
title: Restore an Azure SQL database in a multi-tenant SaaS app  | Microsoft Docs
description: "Learn how to restore a single tenants SQL database after accidentally deleting data"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: craigg
editor: ''

ms.assetid:
ms.service: sql-database
ms.custom: scale out apps
ms.workload: "Inactive"
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: billgib;sstein

---
# Restore a single tenant with a database per tenant SaaS application

One of the benefits of the database per tenant model is that it is easy to restore a single tenant to a prior point in time in isolation, without impacting other tenants.

In this tutorial you learn two data recovery patterns:

> [!div class="checklist"]

> * Restore a database into a parallel database (side-by-side)
> * Restore a database in place


|||
|:--|:--|
| **Restore into a parallel database** | This pattern can be used for review, auditing, compliance, etc. to allow a tenant to inspect their data from an earlier point.  The tenant's current database remains online and unchanged. |
| **Restore in-place** | This pattern is typically used to recover a tenant to a earlier point, after a tenant accidentally deletes or corrupts data. The original database is taken offline, and replaced with the restored database. |
|||

To complete this tutorial, make sure the following prerequisites are completed:

* The Wingtip SaaS app is deployed. To deploy in less than five minutes, see [Deploy and explore the Wingtip SaaS application](saas-dbpertenant-get-started-deploy.md)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)

## Introduction to the SaaS tenant restore patterns

There are two simple patterns for restoring an individual tenant's data. Because tenant databases are isolated from each other, restoring one tenant has no impact on any other tenant's data.  The SQL Database point-in-time-restore (PITR) feature is used in both patterns.  PITR always creates a new database.   

In the first pattern, **restore in parallel**, a new parallel database is created alongside the tenant's current database. The tenant is then given access to this database. This pattern allows a tenant admin to review the restored data and potentially use it to selectively overwrite current data values. It's up to the SaaS app designer to determine how the tenant gets to access the restored database and just how sophisticated the data recovery options should be. Simply being able to review data as it was at a given point in time may be all that is required in some scenarios. 

The second pattern, **restore in place**, assumes that the tenant has suffered a loss or corruption of data.  The tenant’s database is replaced by a copy of the database, restored to a prior point in time. In this pattern, the tenant is taken offline for a brief time while the database is restored and brought back online. The original database is deleted, but the backup remains and can still be restored from if you need to go back to an even earlier point in time. A variation of this pattern could rename the tenant's database instead of deleting it, although renaming the database offers no additional advantage in terms of data security.

If the database uses [geo-replication](sql-database-geo-replication-overview.md) and restoring in parallel, we recommend copying any required data from the restored copy into the original database. If you replace the original database with the restored database, you need to reconfigure and resynchronize geo-replication.

## Get the Wingtip Tickets SaaS Database Per Tenant application scripts

The Wingtip Tickets SaaS Multi-tenant Database scripts and application source code are available in the [WingtipTicketsSaaS-DbPerTenant](https://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant) GitHub repo. Check out the [general guidance](saas-tenancy-wingtip-app-guidance-tips.md) for steps to download and unblock the Wingtip Tickets SaaS scripts.

## Before you start

Before you can restore a database its initial full backup must have been taken.  When a database is first created it can take 10-15 minutes before this backup is available.  If you have only just installed the application the first backups of the tenant databases may not be available, so now would be a good time to get a beverage!

## Simulate a tenant accidentally deleting data

To demonstrate these recovery scenarios, we need to *'accidentally'* delete some data in one of the tenant databases. 

### Open the Events app to review the current events

1. Open the *Events Hub* (http://events.wtp.&lt;user&gt;.trafficmanager.net) and click **Contoso Concert Hall**:

   ![events hub](media/saas-dbpertenant-restore-single-tenant/events-hub.png)

1. Scroll the list of events and make a note of the last event in the list:

   ![last event](media/saas-dbpertenant-restore-single-tenant/last-event.png)


### 'Accidentally' delete the last event

1. Open ...\\Learning Modules\\Business Continuity and Disaster Recovery\\RestoreTenant\\*Demo-RestoreTenant.ps1* in the *PowerShell ISE*, and set the following value:
   * **$DemoScenario** = **1**, Delete last event (with no ticket sales).
1. Press **F5** to run the script and delete the last event. You should see a confirmation message similar to the following:

   ```Console
   Deleting last unsold event from Contoso Concert Hall ...
   Deleted event 'Seriously Strauss' from Contoso Concert Hall venue.
   ```

1. The Contoso events page opens. Scroll down and verify the event is gone. If the event is still in the list, click refresh and verify it is gone.

   ![last event](media/saas-dbpertenant-restore-single-tenant/last-event-deleted.png)


## Restore a tenant database in parallel with the production database

This exercise restores the Contoso Concert Hall database to a point in time before the event was deleted. In this scenario is is assumed that you only want to review the deleted data in a parallel database.

 The *Restore-TenantInParallel.ps1* script creates a parallel tenant database, and a parallel catalog entry both named *ContosoConcertHall\_old*. This pattern of restore is best suited for recovering from a minor data loss or for compliance and auditing recovery scenarios. It is also the recommended approach when you are using [geo-replication](sql-database-geo-replication-overview.md).

1. Complete the [simulate a tenant accidentally deleting data](#simulate-a-tenant-accidentally-deleting-data) section.
1. In the *PowerShell ISE*, open ...\\Learning Modules\\Business Continuity and Disaster Recovery\\RestoreTenant\\_Demo-RestoreTenant.ps1_.
1. Set **$DemoScenario** = **2**, *Restore tenant in parallel*.
1. Press **F5** to run the script.

The script restores the tenant database (into a parallel database) to a point in time before you deleted the event in the previous section. It creates a second database, removes the prior catalog metadata that exists in this database, and adds the database to the catalog under the *ContosoConcertHall\_old* entry.

The demo script opens the events page for this new tenant database in your browser. Note from the URL: ```http://events.wingtip-dpt.&lt;user&gt;.trafficmanager.net/contosoconcerthall_old``` that this is showing data from the restored database where *_old* is added to the name.

Scroll the events listed in the browser to confirm that the event deleted in the previous section has been restored.

Note that exposing the restored tenant as an additional tenant, with its own Events app to browse tickets, is unlikely to be how you would provide a tenant access to restored data, but serves to easily illustrate the restore pattern.

In reality, you would probably only retain this restored database for a defined period. You can delete the restored tenant entry once you are finished by calling the *Remove-RestoredTenant.ps1* script.

1. Set **$DemoScenario** = **4**, *Remove restored tenant*
1. **Execute** **using** **F5**
1. The *ContosoConcertHall\_old* entry is now deleted from the catalog. Go ahead and close the events page for this tenant in your browser.


## Restore a tenant in place, replacing the existing tenant database

This exercise restores the Contoso Concert Hall tenant to a point in time before the event was deleted. The *Restore-TenantInPlace* script restores the current tenant database to a new database pointing to a previous point in time, and deletes the original database.  This pattern of restore is best suited for recovering from serious data corruption as there may be significant data loss that the tenant would have to accommodate.

1. Open **Demo-RestoreTenant.ps1** file in PowerShell ISE
1. Set **$DemoScenario** = **5**, *Restore tenant in place*.
1. Execute using **F5**.

The script restores the tenant database to a point before the event was deleted. It first takes the Contoso Concert Hall tenant offline so there are no further updates to its data. Then, a parallel database is created by restoring from the restore point.  The restored database is named with a timestamp to ensure the database name does not conflict with the existing tenant database name. Next, the old tenant database is deleted, and the restored database is renamed to the original database name. Finally, Contoso Concert Hall is brought online to allow the app access to the restored database.

You successfully restored the database to a point in time before the event was deleted. The Events page opens, so confirm the last event has been restored.

Note that once you restore the database it will take a further 10-15 minutes before the first full back is be available for restoring. 

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]

> * Restore a database into a parallel database (side-by-side)
> * Restore a database in place

[Manage tenant database schema](saas-tenancy-schema-management.md)

## Additional resources

* [Additional tutorials that build upon the Wingtip SaaS application](saas-dbpertenant-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials)
* [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md)
* [Learn about SQL Database backups](sql-database-automated-backups.md)
