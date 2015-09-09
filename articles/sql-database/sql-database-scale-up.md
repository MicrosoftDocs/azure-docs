<properties
	pageTitle="Change the pricing tier of an Azure SQL database"
	description="Change the pricing tier of an Azure SQL database shows how to scale up or down."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="09/05/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Change the pricing tier of a SQL database (scale up)

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-scale-up.md)
- [PowerShell](sql-database-scale-up-powershell.md)

This article shows how to change the pricing tier (scale up or down) of your SQL database with the [Azure preview portal](https://portal.azure.com). 


> [AZURE.IMPORTANT] Changing the pricing tier of a SQL database is an online operation. The database will remain online and available during the entire scaling operation.

- To downgrade a database, the database should be smaller than the maximum allowed size of the target service tier. 

- When upgrading a database with [Standard Geo-Replication](https://msdn.microsoft.com/library/azure/dn758204.aspx) or [Active Geo-Replication](https://msdn.microsoft.com/library/azure/dn741339.aspx) enabled, you must first upgrade its secondary databases to the desired performance tier before upgrading the primary database.

- When downgrading from a Premium service tier, you must first terminate all Geo-Replication relationships. You can follow the steps described in the [Terminate a Continuous Copy Relationship](https://msdn.microsoft.com/library/azure/dn741323.aspx) topic to stop the replication process between the primary and the active secondary databases.

- The restore service offerings are different for the various service tiers. If you are downgrading you may lose the ability to restore to a point in time, or have a lower backup retention period. For more information, see [Azure SQL Database Backup and Restore](https://msdn.microsoft.com/library/azure/jj650016.aspx).

- You can make up to four individual database changes (service tier or performance levels) within a 24 hour period.

- The new properties for the database are not applied until the changes are complete.


To complete this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).


## Change the pricing tier of your database




Open the SQL Database blade for the database you want to scale up or down:

1.	Go to the [Azure Preview Portal](https//:portal.azure.com).
2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you want to change.
3.	In the SQL Database blade click the **Pricing tier** tile:

    ![pricing tile][1]

1.  Select a new tier and click **Select**:

    ![select pricing tier][2]

3.	In the left ribbon click **Notifications**:
    
    Selecting a new tier in the previous step submits a scale request to change the database tier. Depending on the size of your database the scale operation can take some time to complete. Click the notification for details and status of the scale operation.    

    ![notifications][3]

## Verify the database is at the selected pricing tier

   After the scaling operation is complete inspect and confirm the database is at the correct pricing tier

2.	Click **BROWSE ALL**.
3.	Click **SQL databases**.
2.	Click the database you scaled up or down.
3.	Check the **Pricing tier** tile and confirm it is set to the correct tier.

    ![new price][4]	


## Next steps

- [Import an Azure SQL database](sql-database-import.md)



## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


<!--Image references-->
[1]: ./media/sql-database-scale-up/pricing-tile.png
[2]: ./media/sql-database-scale-up/choose-tier.png
[3]: ./media/sql-database-scale-up/scale-notification.png
[4]: ./media/sql-database-scale-up/new-tier.png
