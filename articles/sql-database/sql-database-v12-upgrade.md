<properties 
	pageTitle="Upgrade to SQL Database V12" 
	description="Explains how to upgrade to Azure SQL Database V12, from an earlier version of Azure SQL Database." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-management" 
	ms.date="09/30/2015" 
	ms.author="sstein"/>


# Upgrade to SQL Database V12 server


> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-v12-upgrade.md)
- [PowerShell](sql-database-upgrade-server.md)


SQL Database V12 is the latest version of SQL Database and it has [many advantages over the previous V2 version](sql-database-v12-whats-new.md). This article shows how to upgrade V2 servers to V12 using the Azure preview portal. 



1. In the [Azure Preview Portal](http://portal.azure.com/) browse to the server you want to upgrade by selecting **BROWSE ALL** > **SQL servers**, and selecting the desired server.
2. Select **Latest SQL database update**, then select **Upgrade this server**.

      ![upgrade server][1]

## Upgrade your Web and Business databases

2. Upgrade all Web and Business databases. If your server has any Web or Business databases you must upgrade them. To assist you with upgrading, the SQL Database service recommends an appropriate service tier and performance level (pricing tier) for each database. By analyzing the historical usage for each database, the service recommends a tier that is best suited for running your existing database’s workload. 
    
    Select each database to review and select the recommended pricing tier to upgrade to. You can always browse the available pricing tiers and select the one that suits your environment best. 

     ![databases][2]



7. After clicking the database you will be presented with the **Recommended pricing tiers** blade where you can click the suggested tier and then click the **Select** button to change to that tier. Select a new tier for each Web or Business database

    ![recommendations][6]


3. When all the databases on the server are eligible for upgrade (after resolving all issues) you need to **TYPE THE SERVER NAME** to verify that you want to perform the upgrade, and then click **OK**. 

    ![verify upgrade][3]


4. The upgrade starts and displays the in progress notification. The upgrade process is initiated. Upgrade can take up to 24 hours. During this time all databases on this server will remain online but server and database management actions will be restricted.

    ![upgrade in progress][4]

    At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for a very small duration (typically measured in seconds). If an application has transient fault handling (retry logic) for connection terminations then it is sufficient to protect against dropped connections at the end of the upgrade. 

5. After the upgrade operation completes the SQL Datase V12 server features are enabled.

    ![V12 enabled][5]  


## Related Links

- [What's new in SQL Database V12](sql-database-v12-whats-new.md)
- [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md)


<!--Image references-->
[1]: ./media/sql-database-v12-upgrade/latest-sql-database-update.png
[2]: ./media/sql-database-v12-upgrade/upgrade-server2.png
[3]: ./media/sql-database-v12-upgrade/upgrade-server3.png
[4]: ./media/sql-database-v12-upgrade/online-during-upgrade.png
[5]: ./media/sql-database-v12-upgrade/enabled.png
[6]: ./media/sql-database-v12-upgrade/recommendations.png




