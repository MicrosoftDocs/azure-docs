<properties
	pageTitle="Monitor, manage, and size an elastic database pool"
	description="Learn how to manage, monitor, and right-size a scalable elastic database pool to optimize database performance and manage cost."
	keywords="scalable database,database configuration"
	services="sql-database"
	documentationCenter=""
	authors="jeffgoll"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="03/08/2016"
	ms.author="jeffreyg"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Monitor, manage, and size an elastic database pool

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-portal.md)
- [C#](sql-database-elastic-pool-csharp.md)
- [PowerShell](sql-database-elastic-pool-powershell.md)


You can use the portal to monitor and manage an elastic pool and the databases in the pool. After you [create a pool](sql-database-elastic-pool-create-portal.md), click **Browse**, click **SQL elastic pools** and then click the pool you want to work with from the list.
<<Screen shot>>

##Monitor resource utilization of a pool
After you select a pool to work with, under **Elastic Pool Monitoring**, a chart and live tiles show you important utilization information for your pool. 

**To change the date range, the chart type (bar or line), and the resources depicted in the chart:**

- Click **Edit**, pick the settings that you want, and then click **Save** to update the chart.

**To change the live tiles that appear with the chart:**

- Click **Add tiles** and then select the tiles you want from the tile gallery that appears on the left.

##Add an alert to a resource
You can add rules to resources that will send emails to people when the resource hits a threshold that you choose. You can also send alerts to URL endpoints for processing by an application.
 
**To add an alert to any resource:**
1. Click the **Resource utilization** chart to open the **Metric** blade, click **Add alert**, and then fill out the information in the **Add an alert rule** blade. Note that **Resource** is automatically set up to be the pool.
2. Under **Resource**, the identifier of the pool you're working with is displayed.
3. Type a **Name** and description that will help you remember what the rule is for.
4. Choose a **Metric** that you want to alert from the list. The chart updates to show utilization and help you choose a threshold.
5. Choose a **Condition** (greater than, less than, etc.) and a **Threshold** f

![Monitor elastic pool][4]
![resource utilization][6]

 Percent of DTU utilization and percent of storage utilization are shown by default because they have the biggest impact on pool performance.


##Changing eDTU per pool and database eDTU
Monitoring may reveal that the pool has reached capacity in a resource configuration, or is over-provisioned. You can change the configuration of the pool at any time to optimize performance and cost. Click **Configure pool** to get started

To change the pool eDTU and eDTU per database, click **Configure pool**.
- Select **Create job** and manage the databases in the pool by creating elastic jobs. Elastic jobs let you run Transact-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).
- Select **Manage jobs** to administer existing elastic jobs.
- Click **Create database** to create a new database in the pool.
- Click the pool settings link to adjust pool eDTUs and GB per pool
- Click the databases link to add or remove databases to the pool.
- Click the database settings link to adjust the min and max eDTUs for the elastic databases in the pool. 

![edit chart][7]


## Add and remove databases to and from a pool

After the pool is created, you can add or remove existing databases in and out of the pool by adding or removing databases on the **Elastic databases** page (browse to your pool and click the **Elastic databases** link in **Essentials**).

- Click **Add databases** to open the list of databases you can add to the pool.

    -or-

- Select the databases you want to remove from the pool and click **Remove databases**.

![recommended pool](./media/sql-database-elastic-pool-portal/add-remove-databases.png)

## Create a new database in a pool

Create a new database in a pool by browsing to the desired pool and clicking **Create database**.

The SQL database is already configured for the correct server and pool so enter a name and select your database options, then click **OK** to create the new database:


   ![create elastic database](./media/sql-database-elastic-pool-portal/create-database.png)





## Next steps
After creating an elastic database pool, you can manage the databases in the pool by creating elastic jobs. Elastic jobs facilitate running Transact-SQL scripts against any number of databases in the pool. For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).



## Additional resources

- [SQL Database elastic pool](sql-database-elastic-pool.md)
- [Create a SQL Database elastic pool with PowerShell](sql-database-elastic-pool-powershell.md)
- [Create and manage SQL Database with C#](sql-database-client-library.md)
- [Elastic database reference](sql-database-elastic-pool-reference.md)


<!--Image references-->
[4]: ./media/sql-database-elastic-pool-portal/monitor-elastic-pool.png
[6]: ./media/sql-database-elastic-pool-portal/metric.png
[7]: ./media/sql-database-elastic-pool-portal/edit-chart.png
[10]: ./media/sql-database-elastic-pool-portal/star.png

