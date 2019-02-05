---
title: Rolling application upgrades - Azure SQL Database | Microsoft Docs
description: Learn how to use Azure SQL Database geo-replication to support online upgrades of your cloud application.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
manager: craigg
ms.date: 01/29/2019
---
# Managing rolling upgrades of cloud applications using SQL Database active geo-replication

Learn how to use [active geo-replication](sql-database-auto-failover-group.md) in SQL Database to enable rolling upgrades of your cloud application. Because upgrade is a disruptive operation, it should be part of your business continuity planning and design. In this article we look at two different methods of orchestrating the upgrade process, and discuss the benefits and trade-offs of each option. For the purposes of this article, we will use an application that consists of a web site connected to a single database as its data tier. Our goal is to upgrade version 1 of the application to version 2 without any significant impact on the end-user experience.

When evaluating the upgrade options, you should consider the following factors:

* Impact on application availability during upgrades. How long the application function may be limited or degraded.
* Ability to rollback if upgrade fails.
* Vulnerability of the application if an unrelated catastrophic failure occurs during the upgrade.
* Total dollar cost.  This includes additional redundancy and incremental costs of the temporary components  used by the upgrade process.

## Upgrading applications that rely on database backups for disaster recovery

If your application relies on automatic database backups and uses geo-restore for disaster recovery, it is deployed to a single Azure region. To minimize the end-user disruption, you will create a staging environment in that region with all the application components involved in the upgrade. The following diagram illustrates the operational environment prior to the upgrade process. The endpoint `contoso.azurewebsites.net` represents a production slot of the web application. To enable the ability to rollback the upgrade, you need create a staging slot with a fully synchronized copy of the database. The following steps will create a staging environment for the upgrade:

1. Create a secondary database in the same Azure region. Monitor the secondary to see if the seeding process is completed (1).
2. Create a new deployment slot for your web application called 'Staging'. It will be registered in DNS with URL  `contoso-staging.azurewebsites.net` (2).

> [!NOTE]
> Note the preparation steps will not impact the production slot and it can function in full access mode.
>  

![SQL Database Go-Replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-1.png)

Once the preparation steps are completed, the application is ready for the actual upgrade. The following diagram illustrates the steps involved in the upgrade process.

1. Set the primary database to read-only mode (3). This mode will guarantee that the production slot of the web application (V1) will remain read-only during the upgrade thus preventing the data divergence between the V1 and V2 database instances.  
2. Disconnect the secondary database using the planned termination mode (4). It will create a fully synchronized independent copy of the primary database. This database will be upgraded.
3. Turn the primary database to read-write mode and run the upgrade script (5).

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-2.png)

If the upgrade completed successfully, you are now ready to switch the end users to the upgraded copy the application. It will now become a  production slot.  The switching involves a few more steps as illustrated on the following diagram.

1. Activate a swap operation between production and staging slots of the web application (6). It will switch the URLs of the two slots. Now `contoso.azurewebsites.net` will point to V2 version of the web site and the database (production environment).  
2. If you no longer need the V1 version, which became a staging copy after the swap,  you can decommission the staging environment (7).

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-3.png)

If the upgrade process is unsuccessful, for example due to an error in the upgrade script, the stage slot should be considered compromised. To rollback the application to the pre-upgrade state, you revert the application in the production slot to full access. The steps involved are shown on the next diagram.

1. Set the database copy to read-write mode (8). It will restore the full V1 functionally of the production copy.
2. Perform the root cause analysis and decommission the staging environment (9).

At this point the application is fully functional and the upgrade steps can be repeated.

> [!NOTE]
> The rollback does not require DNS changes as you did not yet perform a swap operation.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-4.png)

The key **advantage** of this option is that you can upgrade an application in a single region using a set of simple steps. The dollar cost of the upgrade is relatively low. The main **tradeoff** is that if a catastrophic failure occurs during the upgrade the recovery to the pre-upgrade state will involve redeployment of the application in a different region and restoring the database from backup using geo-restore. This process will result in significant downtime.

## Upgrading applications that rely on database geo-replication for disaster recovery

If your application leverages Active geo-replication or Failover groups for business continuity, it is deployed  to at least two different regions with an active primary database in Primary region and a read-only secondary database in Backup region. In addition to the factors mentioned earlier, the upgrade process must guarantee that:

* The application remains protected from catastrophic failures at all times during the upgrade process
* The geo-redundant components of the application are upgraded in parallel with the active components

To achieve these goals, in addition to using the Web App deployment slots, you will leverage Azure Traffic Manager (ATM) using a failover profile with one active and one backup endpoints.  The following diagram illustrates the operational environment prior to the upgrade process. The web sites `contoso-1.azurewebsites.net` and `contoso-dr.azurewebsites.net` represent a production environment of the application with full geographic redundancy. The production environment includes the following components:

1. Production slot of the web application `contoso-1.azurewebsites.net` in the primary region (1)
2. Primary database in the primary region (2) 
3. A stand-by instance of the web application in the backup region (3)
4. Geo-replicated secondary database in the backup region (4)
5. Azure traffic manager performance profile with online endpoint `contoso-1.azurewebsites.net` and offline endpoint `contoso-dr.azurewebsites.net`

To enable the ability to rollback the upgrade, you need create a staging environment with a fully synchronized copy of the application. Because you need to ensure that the application can quickly recover in case a catastrophic failure occurs during the upgrade process, the staging environment needs to be geo-redundant as well. The following steps are required to create a staging environment for the upgrade:

1. Deploy a staging slot of the web application in the primary region (6)
2. Create a secondary database in the primary Azure region (7). Configure the staging slot of the web application to connect to it. 
3. Create another geo-redundant secondary database in the backup region by replicating the secondary database in the primary region (this is called "chained geo-replication") (8).
3. Deploy a staging slot of the web application instance in the backup region (9) and configure it to connect the geo-secondary created in step (9).


> [!NOTE]
> Note the preparation steps will not impact the application in the production slot and it will remain fully functional in read-write mode.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-1.png)

Once the preparation steps are completed, the staging environment is ready for the upgrade. The following diagram illustrates the upgrade steps.

1. Set the primary database in the production slot to read-only mode (10). This mode will guarantee that the production database (V1) will not change during the upgrade thus preventing the data divergence between the V1 and V2 database instances.  
2. Disconnect the secondary database in the same region using the planned termination mode (11). It will create a independent but fully synchronized copy of the production database. This database will be upgraded.
3. Run the  upgrade script against `contoso-1-staging.azurewebsites.net`, `contoso-dr-staging.azurewebsites.net` and the staging primary database (12). The database changes will be automatically replicated to the staging secondary 

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-2.png)

If the upgrade completed successfully, you are now ready to switch the end users to the V2 version of the application. The following diagram illustrates the steps involved.

1. Activate a swap operation between production and staging slots of the web application in the primary region (13) and in the backup region (14). V2 of the application now becomes a production slot with a redundant copy in the backup region.
2. You can decommission the staging environment if you no longer need the V1 application (15 and 16).  

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-3.png)

If the upgrade process is unsuccessful, for example due to an error in the upgrade script, the staging environment be considered in inconsistent state. To rollback the application to the pre-upgrade state you revert to using V1 of the application in production environment. The required steps are shown on the next diagram.

1. Set the primary database copy in the production slot to read-write mode (17). It will restore the full V1 functionally in the production slot.
2. Perform the root cause analysis and repair or remove the staging environment (18 and 19).

At this point, the application is fully functional and the upgrade steps can be repeated.

> [!NOTE]
> The rollback does not require DNS changes because you did not perform a swap operation.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-4.png)

The key **advantage** of this option is that you can upgrade both the application and its geo-redundant copy in parallel without compromising your business continuity during the upgrade. The main **tradeoff** is that it requires double redundancy of each application component and therefore incurs higher dollar cost. It also involves a more complicated workflow.

## Summary

The two upgrade methods described in the article differ in complexity and the dollar cost but they both focus on minimizing the time when the end user is limited to read-only operations. That time is directly defined by the duration of the upgrade script. It does not depend on the database size, the service tier you chose, the web site configuration and other factors that you cannot easily control. All the preparation steps are decoupled from the upgrade steps and do not impact the production application. The efficiency of the upgrade script is a key factor that determines the end-user experience during upgrades. So the best way you can improve it is by focusing your efforts on making the upgrade script as efficient as possible.  

## Next steps

* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md).
* To learn about Azure SQL Database Active geo-replication, see [Create readable secondary databases using active geo-replication](sql-database-active-geo-replication.md).
* To learn about Azure SQL Database Failover groups, see [Use auto-failover groups to enable transparent and coordinated failover of multiple databases](sql-database-auto-failover-group.md).
* To learn about deployment slots and staging environment in Azure App Service, see [Set up staging environments in Azure App Service](../app-service/deploy-staging-slots.md).  
* To learn Azure traffic manager profiles, see [Manage an Azure Traffic Manager profile](../traffic-manager/traffic-manager-manage-profiles.md).  


