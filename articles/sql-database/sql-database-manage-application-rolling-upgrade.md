<properties
   pageTitle="Cloud disaster recovery solutions - SQL Database Active Geo-Replication | Microsoft Azure"
   description="Learn how to use Azure SQL Database geo-replication to support online upgrades of your cloud application."
   keywords="online application upgrade,cloud disaster recovery,disaster recovery solutions,app data backup,geo-replication,business continuity planning"
   services="sql-database"
   documentationCenter=""
   authors="anosov1960"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="05/09/2016"
   ms.author="sashan"/>

# Managing rolling upgrades of cloud applications using Active Geo-Replication in SQL Database


> [AZURE.NOTE] [Active Geo-Replication](sql-database-geo-replication-overview.md) is now available for all databases in all tiers.


Learn how to use [geo-replication](sql-database-geo-replication-overview.md) in SQL Database to enable rolling upgrades of your cloud application. Because upgrade is a disruptive operation, it should be part of your business continuity planning and design. In this article we look at two different options of managing the upgrade process, and discuss the benefits and trade-offs of each option.

For the purposes of this article we will use a simple application that consist of a web site connected to a single database as its data tier. Our goal is to upgrade version 1 of the application to version 2 without any significant impact of the end user experience. Further in the article we will use the term <i>application</i> to refer to all components it consists of, such as web site and the database. 

When evaluating the specific upgrade pattern you should consider the following factors:

+ Impact on application availability during upgrade. How long the application function may be limited or degraded.
+ Vulnerability of the application during upgrade if an unrelated failure occurs 
+ Ability to roll back in case of any errors during upgrade.
+ Total dollar cost.  This includes additional redundancy and incremental cost and incremental costs for temporary deployments used by the upgrade process. 


## Upgrade pattern 1: Upgrading applications that rely on database backups for disaster recovery 

If your application relies on automatic database backups and geo-restore for disaster recovery, it is usually deployed to a single Azure region. In this case the upgrade process involves creating a backup deployment of all application components involved in the upgrade. To minimize the end-user disruption you will leverage Azure Traffic Manager (WATM) with the failover profile.  The following diagram illustrates the operational environment prior to the upgrade process. The endpoint <i>contoso-1.azurewebsites.net</i> represents the active application web site, which will be upgraded. To enable the ability to rollback the upgrade, a fully synchronized copy of it needs to be created. The following steps are required to prepare the application for the upgrade:

1.  Create a secondary database (1) and deploy a standby copy of the web site in the primary region. Monitor the secondary to see if the seeding process is completed.
3.  Create a failover profile in WATM with <i>contoso-1.azurewebsites.net</i> as online endpoint and <i>contoso-2.azurewebsites.net</i> as offline. 

> [AZURE.NOTE] Note the preparation steps will not impact the normal function of the web site <i>contoso-1.azurewebsites.net</i> and it can continue to operate with full access enabled.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-1.png)

Once the preparation steps are completed the application is ready for the actual upgrade. The following diagram illustrates the steps involved in the upgrade process. Those steps are:

1. Set the primary database to read-only mode (3). This will guarantee that the V1 copy of the application will remain read-only during the upgrade thus preventing the data divergence between the V1 and V2 database versions.  
2. Set the main active endpoint <i>contoso-1.azurewebsites.net</i> to offline in the WATM profile (4). At this point the end users will only be able to perform read-only operations on the web site <i>contoso-2.azurewebsites.net</i>.
2. Disconnect the secondary database using the planned termination mode (5). It will create a fully synchronized independent copy of the primary database. You will use this copy in case the upgrade fails.
3. Turn the primary database back to read-write mode and run the upgrade script against the primary web site (7).     

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-2.png)

If the upgrade completed successfully you are now ready to switch the end users to the newly upgraded instance of the application. This involves a few more steps as illustrated on the following diagram.

1. Switch the online endpoint in the WATM profile back to <i>contoso-1.azurewebsites.net</i>, which now points to the V2 version of the web site (8). At this point user traffic will switch to the V2 functionality.  
2. You no longer need the V1 application components so you can safely remove them (9).   

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-3.png)

If the upgrade process is unsuccessful, for example due to an error in the upgrade script, the primary web site <i>contoso-1.azurewebsites.net</i> should be considered compromised. To rollback the application to the pre-upgrade state you simply switch your backup application deployment to the full read-write mode. The steps involved are shown on the next diagram.    

1. Set the database copy to read-write mode (10). This will re-enable read-write access to the database and will make the full functionality of the web site available to the end user.
2. Perform the root cause analysis and remove the compromised copy of the application from the production environment (11). 

At this point the application is fully functional and the upgrade steps could be repeated now using <i>contoso-2.azurewebsites.net</i> as the active web site.

> [AZURE.NOTE] The rollback does not require changes in WATM profile as it already points to <i>contoso-2.azurewebsites.net</i> as the online endpoint.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option1-4.png)

The key **advantage** of this option is that you can upgrade a application in a single region using a set of simple steps. The dollar cost of the upgrade is relatively low. The main **tradeoff** is that if a catastrophic failure occurs during the upgrade the recovery to the pre-upgrade state will involve re-deployment of the application in a different region and restoring the database from backup using geo-restore. This process will result in significant downtime.   

## Upgrade pattern 2: Upgrading applications that rely on database geo-replication and failover for disaster recovery

If your application leverages geo-replication for business continuity, it is deployed  to at least two different regions with an active deployment Primary region and a standby deployment in backup region. In addition to the factors mentioned earlier, the upgrade process must guarantee that:

+ The applications remains protected from catastrophic failures at all times during the upgrade process
+ The standby application deployment is upgraded in parallel with the active deployment 

To achieve these goals you will leverage Azure Traffic Manager (WATM) using the failover profile with one active and three backup endpoints.  The following diagram illustrates the operational environment prior to the upgrade process. The web sites <i>contoso-1.azurewebsites.net</i> and <i>contoso-dr.azurewebsites.net</i> represent the normal application deployment with full geographic redundancy. To enable the ability to rollback the upgrade a  parallel geo-replicated and fully synchronized copy of the application V1 needs to be created. Such a copy would also  guarantee that the application can quickly recover should a catastrophic failure occur during the upgrade process. The following steps are required to prepare the application for the upgrade:

1.  Create a secondary database (1) and a standby copy of the web site in the primary region. Monitor the secondary to see if the seeding process is completed.
2.  Create a backup secondary database by geo-replicating the secondary database to the backup region ("chained geo-replication") (3). Create a backup standby copy of the web site in the backup region. Monitor the backup secondary to see if the seeding process is completed.  
3.  Add the additional endpoints <i>contoso-2.azurewebsites.net</i> and <i>contoso-3.azurewebsites.net</i> to the failover profile in WATM as offline endpoints. 

> [AZURE.NOTE] Note the preparation steps will not impact the normal function of the web site <i>contoso-1.azurewebsites.net</i> and it can continue to operate in full access mode.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-1.png)

Once the preparation steps are completed, the application is ready for the upgrade. The following diagram illustrates the steps involved in the actual upgrade process.

1. Set the primary database to read-only mode (6). This will make sure that the V1 copy of the application will remain read-only thus preventing the data divergence between the V1 and V2 database versions.  
2. Set the endpoint <i>contoso-1.azurewebsites.net</i> to offline and the endpoint <i>contoso-2.azurewebsites.net</i> to online in the WATM profile (7). At this point the end users will only be able to perform read-only operations on the web site.
2. Disconnect the secondary database primary region using the planned termination mode (8). It will create a fully synchronized independent copy of the primary database. You will use this copy in case the upgrade fails.
3. Turn the primary database back to read-write mode and run the upgrade script against the main application deployment (9). All the DML and DDL database operations will be automatically replicated to the secondary database in the backup region.    
4. Run the upgrade script against the web site V1 in the backup region (10).

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-2.png)

If the upgrade completed successfully you are now ready to switch the end users to the V2 version of the application. This involves a few more steps as illustrated on the following diagram.

1. Switch the online endpoint in the WATM profile back to <i>contoso-1.azurewebsites.net</i>, which now points to the V2 version of the web site (10). At this point the users will have access to the V2 functionality of the web site.  
2. You no longer need the backup application deployment so you can safely remove them from the backup region first (11) and then from the primary region (12). From now on your bill will be reduced to two application instances in two regions. 

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-3.png)

In case the upgrade encountered an error you should rollback the application to V1 and retry the upgrade later after the upgrade script was fixed. The rollback involves additional steps as shown on the following diagram.

1. Switch the V1 database copy in the primary region to read-write mode (14). This will restore the full V1 level functionality for the end users. In the meantime you should troubleshoot the upgrade error using the state of the partially upgraded application in the primary region. 
2. Once the troubleshooting is completed you can safely remove the partially upgraded application from the backup region first (15) and then from the primary region (16).  At this point you can restart the upgrade process using the same workflow.   


If the upgrade process is unsuccessful, for example due to an error in the upgrade script, the primary web should be considered compromised. To rollback the application to the pre-upgrade state you simply switch the your backup deployment to the full read-write mode. The steps involved are shown on the next diagram.    

1. Set the database copy to read-write mode (14). This will re-enable read-write access to the database and will make the full functionality of the web site available to the end user.
2. Perform the root cause analysis and remove the compromised deployment of the application from the production environment (15). 

At this point the application is fully functional and the upgrade steps can be can be repeated but now using <i>contoso-2.azurewebsites.net</i> as the active web site and <i>contoso-3.azurewebsites.net</i> as the standby web site.

> [AZURE.NOTE] The rollback does not require changes in WATM profile as it already points to <i>contoso-2.azurewebsites.net</i> as online endpoint.

![SQL Database geo-replication configuration. Cloud disaster recovery.](media/sql-database-manage-application-rolling-upgrade/option2-4.png)

The key **advantage** of this option is that you can upgrade a application and its standby copy in parallel without compromising your business continuity during the upgrade. The main **tradeoff** is that it requires additional redundancy of the application components and therefore incurs a higher dollar cost. It also involves a more complicated workflow. 


## Alternative upgrade options

The described upgrade work flows represent the optimistic upgrade strategy. They assume that the upgrade failures are rare. You should use your judgment and experience to validate that approach in your specific case. If it is more practical for your application to optimize for upgrade failures you should consider an approach where the upgrade script runs against the backup application instance and only if successful the end-user traffic would be switched to it.

## Additional resources
 The following pages will help you learn about the specific operations required to implement the upgrade workflow:

- [Add secondary database](https://msdn.microsoft.com/library/azure/mt603689.aspx) 
- [Failover database to secondary](https://msdn.microsoft.com/library/azure/mt619393.aspx)
- [Disconnect geo-replication secondary](https://msdn.microsoft.com/library/azure/mt603457.aspx)
- [Geo-restore database](https://msdn.microsoft.com/library/azure/mt693390.aspx) 
- [Drop database](https://msdn.microsoft.com/library/azure/mt619368.aspx)
- [Copy database](https://msdn.microsoft.com/library/azure/mt603644.aspx)
- [Set database to read-only or read-write mode](https://msdn.microsoft.com/library/bb522682.aspx)
