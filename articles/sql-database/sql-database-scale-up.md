<properties
	pageTitle="Change the service tier and performance level of an Azure SQL database"
	description="Change the service tier and performance level of an Azure SQL database shows how to scale your SQL database up or down. Changing the pricing tier of an Azure SQL database."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/19/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Change the service tier and performance level (pricing tier) of a SQL database


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-scale-up.md)
- [PowerShell](sql-database-scale-up-powershell.md)


Service tiers and performance levels describe the features and resources available for your SQL database and can be updated as the needs of your application change. For details, see [Service Tiers](sql-database-service-tiers.md).

Note that changing the service tier and/or performance level of a database creates a replica of the original database at the new performance level, and then switches connections over to the replica. No data is lost during this process but during the brief moment when we switch over to the replica, connections to the database are disabled, so some transactions in flight may be rolled back. This window varies, but is on average under 4 seconds, and in more than 99% of cases is less than 30 seconds. Very infrequently, especially if there are large numbers of transactions in flight at the moment connections are disabled, this window may be longer.  

The duration of the entire scale-up process depends on both the size and service tier of the database before and after the change. For example, a 250 GB database that is changing to, from, or within a Standard service tier, should complete within 6 hours. For a database of the same size that is changing performance levels within the Premium service tier, it should complete within 3 hours.


Use the information in [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-server-portal.md) and [Azure SQL Database Service Tiers and Performance Levels](sql-database-service-tiers.md) to determine the appropriate service tier and performance level for your Azure SQL Database.

- To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 
- When upgrading a database with [Geo-Replication](sql-database-geo-replication-overview.md) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.
- When downgrading a service tier, you must first terminate all Geo-Replication relationships. 
- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](sql-database-business-continuity.md).
- Changing your database pricing tier does not change the max database size. To change your database max size use [Transact-SQL (T-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) or [PowerShell](https://msdn.microsoft.com/library/mt619433.aspx).
- The new properties for the database are not applied until the changes are complete.



**To complete this article you need the following:**

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).


## Change the service tier and performance level of your database


Open the SQL Database blade for the database you want to scale up or down:

1.	Go to the [Azure portal](https://portal.azure.com).
2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you want to change.
3.	On the SQL Database blade click **All settings**, then click **Pricing tier (scale DTUs)**:

    ![pricing tier][1]


1.  Select a new tier and click **Select**:

    Clicking **Select** submits a scale request to change the database tier. Depending on the size of your database the scale operation can take some time to complete. Click the notification for details and status of the scale operation. 

    > [AZURE.NOTE] Changing your database pricing tier does not change the max database size. To change your database max size use [Transact-SQL (T-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) or [PowerShell](https://msdn.microsoft.com/library/mt619433.aspx).

    ![select pricing tier][2]

3.	In the left ribbon click **Notifications**:

    ![notifications][3]

## Verify the database is at the selected pricing tier

   After the scaling operation is complete inspect and confirm the database is at the desired tier:

2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you updated.
3.	Check the **Pricing tier** and confirm it is set to the correct tier.

    ![new price][4]	


## Next steps

- Change your database max size using [Transact-SQL (T-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) or [PowerShell](https://msdn.microsoft.com/library/mt619433.aspx).
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
