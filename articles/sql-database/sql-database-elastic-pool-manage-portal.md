---
title: 'Azure portal: Create & manage a SQL Database elastic pool | Microsoft Docs'
description: Learn how to use the Azure portal and SQL Database's built-in intelligence to manage, monitor, and right-size a scalable elastic pool to optimize database performance and manage cost.
keywords: ''
services: sql-database
documentationcenter: ''
author: ninarn
manager: jhubbard
editor: cgronlun

ms.assetid: 3dc9b7a3-4b10-423a-8e44-9174aca5cf3d
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: NA
ms.date: 06/06/2016
ms.author: ninarn
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Create and manage an elastic pool with the Azure portal
This topic shows you how to create and manage scalable [elastic pools](sql-database-elastic-pool.md) with the Azure portal. You can also create and manage an Azure elastic pool with [PowerShell](sql-database-elastic-pool-manage-powershell.md), the REST API, or [C#](sql-database-elastic-pool-manage-csharp.md). You can also create and move databases into and out of elastic pools using [Transact-SQL](sql-database-elastic-pool-manage-tsql.md).

## Create an elastic pool 

There are two ways you can create an elastic pool. You can do it from scratch if you know the pool setup you want, or start with a recommendation from the service. SQL Database has built-in intelligence that recommends an elastic pool setup if it's more cost-efficient for you based on the past usage telemetry for your databases.

You can create multiple pools on a server, but you can't add databases from different servers into the same pool. 

> [!NOTE]
> Elastic pools are generally available (GA) in all Azure regions except West India where it is currently in preview.  GA of elastic pools in this region will occur as soon as possible.
>

### Step 1: Create an elastic pool

Creating an elastic pool from an existing **server** blade in the portal is the easiest way to move existing databases into an elastic pool.

> [!NOTE]
> You can also create an elastic pool by searching **SQL elastic pool** in the **Marketplace** or clicking **+Add** in the **SQL elastic pools** browse blade. You are able to specify a new or existing server through this pool provisioning workflow.
>
>

1. In the [Azure portal](http://portal.azure.com/), click **More services** **>** **SQL servers**, and then click the server that contains the databases you want to add to an elastic pool.
2. Click **New pool**.

    ![Add pool to a server](./media/sql-database-elastic-pool-create-portal/new-pool.png)

    **-OR-**

    You may see a message saying there are recommended elastic pools for the server. Click the message to see the recommended pools based on historical database usage telemetry, and then click the tier to see more details and customize the pool. See [Understand pool recommendations](#understand-elastic-pool-recommendations) later in this topic for how the recommendation is made.

    ![recommended pool](./media/sql-database-elastic-pool-create-portal/recommended-pool.png)

3. The **elastic pool** blade appears, which is where you specify the settings for your pool. If you clicked **New pool** in the previous step, the pricing tier is **Standard** by default and no databases is selected. You can create an empty pool, or specify a set of existing databases from that server to move into the pool. If you are creating a recommended pool, the recommended pricing tier, performance settings, and list of databases are prepopulated, but you can still change them.

    ![Configure elastic pool](./media/sql-database-elastic-pool-create-portal/configure-elastic-pool.png)

4. Specify a name for the elastic pool, or leave it as the default.

### Step 2: Choose a pricing tier

The pool's pricing tier determines the features available to the elastics in the pool, and the maximum number of eDTUs (eDTU MAX), and storage (GBs) available to each database. For details, see Service Tiers.

To change the pricing tier for the pool, click **Pricing tier**, click the pricing tier you want, and then click **Select**.

> [!IMPORTANT]
> After you choose the pricing tier and commit your changes by clicking **OK** in the last step, you won't be able to change the pricing tier of the pool. To change the pricing tier for an existing elastic pool, create an elastic pool in the desired pricing tier and migrate the databases to this new pool.
>

![Select a pricing tier](./media/sql-database-elastic-pool-create-portal/pricing-tier.png)

### Step 3: Configure the pool

After setting the pricing tier, click Configure pool where you add databases, set pool eDTUs and storage (pool GBs), and where you set the min and max eDTUs for the elastics in the pool.

1. Click **Configure pool**
2. Select the databases you want to add to the pool. This step is optional while creating the pool. Databases can be added after the pool has been created.
    To add databases, click **Add database**, click the databases that you want to add, and then click the **Select** button.

    ![Add databases](./media/sql-database-elastic-pool-create-portal/add-databases.png)

    If the databases you're working with have enough historical usage telemetry, the **Estimated eDTU and GB usage** graph and the **Actual eDTU usage** bar chart update to help you make configuration decisions. Also, the service may give you a recommendation message to help you right-size the pool. See [Dynamic Recommendations](#understand-elastic-pool recommendations).

3. Use the controls on the **Configure pool** page to explore settings and configure your pool. See [Elastic pools limits](sql-database-elastic-pool.md#edtu-and-storage-limits-for-elastic-pools) for more detail about limits for each service tier, and see [Price and performance considerations for elastic pools](sql-database-elastic-pool.md) for detailed guidance on right-sizing an elastic pool. For more information about pool settings, see [Elastic pool properties](sql-database-elastic-pool.md#database-properties-for-pooled-databases).

	![Configure Elastic Pool](./media/sql-database-elastic-pool-create-portal/configure-performance.png)

4. Click **Select** in the **Configure Pool** blade after changing settings.
5. Click **OK** to create the pool.

## Understand elastic pool recommendations

The SQL Database service evaluates usage history and recommends one or more pools when it is more cost-effective than using single databases. Each recommendation is configured with a unique subset of the server's databases that best fit the pool.

![recommended pool](./media/sql-database-elastic-pool-create-portal/recommended-pool.png)  

The pool recommendation comprises:

- A pricing tier for the pool (Basic, Standard, Premium, or Premium RS)
- Appropriate **POOL eDTUs** (also called Max eDTUs per pool)
- The **eDTU MAX** and **eDTU Min** per database
- The list of recommended databases for the pool

> [!IMPORTANT]
> The service takes the last 30 days of telemetry into account when recommending pools. For a database to be considered as a candidate for an elastic pool, it must exist for at least 7 days. Databases that are already in an elastic pool are not considered as candidates for elastic pool recommendations.
>

The service evaluates resource needs and cost effectiveness of moving the single databases in each service tier into pools of the same tier. For example, all Standard databases on a server are assessed for their fit into a Standard Elastic Pool. This means the service does not make cross-tier recommendations such as moving a Standard database into a Premium pool.

After adding databases to the pool, recommendations are dynamically generated based on the historical usage of the databases you have selected. These recommendations are shown in the eDTU and GB usage chart and in a recommendation banner at the top of the **Configure pool** blade. These recommendations are intended to assist you in creating an elastic pool optimized for your specific databases.

![dynamic recommendations](./media/sql-database-elastic-pool-create-portal/dynamic-recommendation.png)

## Manage and monitor an elastic pool

You can use the Azure portal to monitor and manage an elastic pool and the databases in the pool. From the portal, you can monitor the utilization of an elastic pool and the databases within that pool. You can also make a set of changes to your elastic pool and submit all changes at the same time. These changes include adding or removing databases, changing your elastic pool settings, or changing your database settings.

The following graphic shows an example elastic pool. The view includes:

*  Charts for monitoring resource usage of both the elastic pool and the databases contained in the pool.
*  The **Configure** pool button to make changes to the elastic pool.
*  The **Create database** button that creates a database and adds it to the current elastic pool.
*  Elastic jobs that help you manage large numbers of databases by running Transact SQL scripts against all databases in a list.

![Pool view][2]

You can go to a particular pool to see its resource utilization. By default, the pool is configured to show storage and eDTU usage for the last hour. The chart can be configured to show different metrics over various time windows.

1. Select an elastic pool to work with.
2. Under **Elastic Pool Monitoring** is a chart labeled **Resource utilization**. Click the chart.

	![Elastic pool monitoring][3]

	The **Metric** blade opens, showing a detailed view of the specified metrics over the specified time window.   

	![Metric blade][9]

### To customize the chart display

You can edit the chart and the metric blade to display other metrics such as CPU percentage, data IO percentage, and log IO percentage used.

1. On the metric blade, click **Edit**.

	![Click edit][6]

2. In the **Edit Chart** blade, select a time range (past hour, today, or past week), or click **custom** to select any date range in the last two weeks. Select the chart type (bar or line), then select the resources to monitor.

   > [!Note]
   > Only metrics with the same unit of measure can be displayed in the chart at the same time. For example, if you select "eDTU percentage" then you can only select other metrics with percentage as the unit of measure.
   >

	![Click edit](./media/sql-database-elastic-pool-manage-portal/edit-chart.png)

3. Then click **OK**.

## Manage and monitor databases in an elastic pool

Individual databases can also be monitored for potential trouble.

1. Under **Elastic Database Monitoring**, there is a chart that displays metrics for five databases. By default, the chart displays the top 5 databases in the pool by average eDTU usage in the past hour. Click the chart.

	![Elastic pool monitoring][4]

2. The **Database Resource Utilization** blade appears. This provides a detailed view of the database usage in the pool. Using the grid in the lower part of the blade, you can select any databases in the pool to display its usage in the chart (up to 5 databases). You can also customize the metrics and time window displayed in the chart by clicking **Edit chart**.

	![Database resource utilization blade][8]

### To customize the view

1. In the **Database resource utilization** blade, click **Edit chart**.

	![Click Edit chart](./media/sql-database-elastic-pool-manage-portal/db-utilization-blade.png)

2. In the **Edit** chart blade, select a time range (past hour or past 24 hours), or click **custom** to select a different day in the past 2 weeks to display.

	![Click Custom](./media/sql-database-elastic-pool-manage-portal/editchart-date-time.png)

3. Click the **Compare databases by** dropdown to select a different metric to use when comparing databases.

	![Edit the chart](./media/sql-database-elastic-pool-manage-portal/edit-comparison-metric.png)

### To select databases to monitor

In the database list in the **Database Resource Utilization** blade, you can find particular databases by looking through the pages in the list or by typing in the name of a database. Use the checkbox to select the database.

![Search for databases to monitor][7]


## Add an alert to an elastic pool resource

You can add rules to an elastic pool that send email to people or alert strings to URL endpoints when the elastic pool hits a utilization threshold that you set up.

**To add an alert to any resource:**

1. Click the **Resource utilization** chart to open the **Metric** blade, click **Add alert**, and then fill out the information in the **Add an alert rule** blade (**Resource** is automatically set up to be the pool you're working with).
2. Type a **Name** and **Description** that identifies the alert to you and the recipients.
3. Choose a **Metric** that you want to alert from the list.

    The chart dynamically shows resource utilization for that metric to help you choose a threshold.

4. Choose a **Condition** (greater than, less than, etc.) and a **Threshold**.
5. Choose a **Period** of time that the metric rule must be satisfied before the alert triggers.
6. Click **OK**.

For more information, see [create SQL Database alerts in Azure portal](sql-database-insights-alerts-portal.md).

## Move a database into an elastic pool

You can add or remove databases from an existing pool. The databases can be in other pools. However, you can only add databases that are on the same logical server.

1. In the blade for the pool, under **Elastic databases** click **Configure pool**.

    ![Click Configure pool][1]

2. In the **Configure pool** blade, click **Add to pool**.

	![Click Add to pool](./media/sql-database-elastic-pool-manage-portal/add-to-pool.png)


3. In the **Add databases** blade, select the database or databases to add to the pool. Then click **Select**.

	![Select databases to add](./media/sql-database-elastic-pool-manage-portal/add-databases-pool.png)

    The **Configure pool** blade now lists the database you selected to be added, with its status set to **Pending**.

    ![Pending pool additions](./media/sql-database-elastic-pool-manage-portal/pending-additions.png)

3. In the **Configure pool blade**, click **Save**.

    ![Click Save](./media/sql-database-elastic-pool-manage-portal/click-save.png)

## Move a database out of an elastic pool

1. In the **Configure pool** blade, select the database or databases to remove.

    ![databases listing](./media/sql-database-elastic-pool-manage-portal/select-pools-removal.png)

2. Click **Remove from pool**.

    ![databases listing](./media/sql-database-elastic-pool-manage-portal/click-remove.png)

    The **Configure pool** blade now lists the database you selected to be removed with its status set to **Pending**.

    ![preview database addition and removal](./media/sql-database-elastic-pool-manage-portal/pending-removal.png)

3. In the **Configure pool blade**, click **Save**.

    ![Click Save](./media/sql-database-elastic-pool-manage-portal/click-save.png)

## Change performance settings of an elastic pool

As you monitor the resource utilization of an elastic pool, you may discover that some adjustments are needed. Maybe the pool needs a change in the performance or storage limits. Possibly you want to change the database settings in the pool. You can change the setup of the pool at any time to get the best balance of performance and cost. See [When should an elastic pool be used?](sql-database-elastic-pool.md) for more information.

To change the eDTUs or storage limits per pool, and eDTUs per database:

1. Open the **Configure pool** blade.

    Under **elastic pool settings**, use either slider to change the pool settings.

    ![Elastic pool resource utilization](./media/sql-database-elastic-pool-manage-portal/resize-pool.png)

2. When the setting changes, the display shows the estimated monthly cost of the change.

    ![Updating an elastic pool and new monthly cost](./media/sql-database-elastic-pool-manage-portal/pool-change-edtu.png)

## Latency of elastic pool operations
* Changing the min eDTUs per database or max eDTUs per database typically completes in 5 minutes or less.
* Changing the eDTUs per pool depends on the total amount of space used by all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.

## Next steps

- To understand what an elastic pool is, see [SQL Database elastic pool](sql-database-elastic-pool.md).
- For guidance on using elastic pools, see [Price and performance considerations for elastic pools](sql-database-elastic-pool.md).
- To use elastic jobs to run Transact-SQL scripts against any number of databases in the pool, see [Elastic jobs overview](sql-database-elastic-jobs-overview.md).
- To query across any number of databases in the pool, see [Elastic query overview](sql-database-elastic-query-overview.md).
- For transactions any number of databases in the pool, see [Elastic transactions](sql-database-elastic-transactions-overview.md).


<!--Image references-->
[1]: ./media/sql-database-elastic-pool-manage-portal/configure-pool.png
[2]: ./media/sql-database-elastic-pool-manage-portal/basic.png
[3]: ./media/sql-database-elastic-pool-manage-portal/basic-2.png
[4]: ./media/sql-database-elastic-pool-manage-portal/basic-3.png
[5]: ./media/sql-database-elastic-pool-manage-portal/elastic-jobs.png
[6]: ./media/sql-database-elastic-pool-manage-portal/edit-metric.png
[7]: ./media/sql-database-elastic-pool-manage-portal/select-dbs.png
[8]: ./media/sql-database-elastic-pool-manage-portal/db-utilization.png
[9]: ./media/sql-database-elastic-pool-manage-portal/metric.png
