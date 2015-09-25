<properties
	pageTitle="Change the service tier and performance level of an Azure SQL database"
	description="Change the service tier and performance level of an Azure SQL database shows how to scale your SQL database up or down. Changing the pricing tier of an Azure SQL database."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="09/10/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Change the service tier and performance level (pricing tier) of a SQL database

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-scale-up.md)
- [PowerShell](sql-database-scale-up-powershell.md)

This article shows how to change the service tier and performance level of your SQL database with the [Azure preview portal](https://portal.azure.com). 

Use the information in [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md) and [Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md) to determine the appropriate service tier and performance level for your Azure SQL Database.

> [AZURE.IMPORTANT] Changing the service tier and performance level of a SQL database is an online operation. This means your database will remain online and available during the entire operation with no downtime.

- To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
- When upgrading a database with [Standard Geo-Replication](https://msdn.microsoft.com/library/azure/dn758204.aspx) or [Active Geo-Replication](https://msdn.microsoft.com/library/azure/dn741339.aspx) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.
- When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Terminate a Continuous Copy Relationship](https://msdn.microsoft.com/library/azure/dn741323.aspx) topic to stop the replication process between the primary and the active secondary databases.
- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](https://msdn.microsoft.com/library/azure/jj650016.aspx).
- You can make up to four individual database changes (service tier or performance levels) within a 24 hour period.
- The new properties for the database are not applied until the changes are complete.


**To complete this article you need the following:**

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).


## Change the service tier and performance level of your database


Open the SQL Database blade for the database you want to scale up or down:

1.	Go to the [Azure Preview Portal](https://portal.azure.com).
2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you want to change.
3.	In the SQL Database blade click the **Pricing tier** tile:

    ![pricing tile][1]

1.  Select a new tier and click **Select**:

    Clicking **Select** submits a scale request to change the database tier. Depending on the size of your database the scale operation can take some time to complete. Click the notification for details and status of the scale operation. 

    ![select pricing tier][2]

3.	In the left ribbon click **Notifications**:

    ![notifications][3]

## Verify the database is at the selected pricing tier

   After the scaling operation is complete inspect and confirm the database is at the desired tier:

2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you updated.
3.	Check the **Pricing tier** tile and confirm it is set to the correct tier.

    ![new price][4]	


## Next steps

- [Scale out and in](sql-database-elastic-scale-get-started.md)
- [Connect and query a SQL database with SSMS](sql-database-connect-query-ssms.md)
- [Export an Azure SQL database](sql-database-export.md)

## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


<!--Image references-->
[1]: ./media/sql-database-scale-up/pricing-tile.png
[2]: ./media/sql-database-scale-up/choose-tier.png
[3]: ./media/sql-database-scale-up/scale-notification.png
[4]: ./media/sql-database-scale-up/new-tier.png
