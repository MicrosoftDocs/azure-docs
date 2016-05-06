<properties
	pageTitle="Create scalable elastic database pools | Microsoft Azure"
	description="How to add a scalable elastic database pool to your SQL database configuration for easier administration and resource sharing across many databases."
	keywords="scalable database,database configuration"
	services="sql-database"
	documentationCenter=""
	authors="jeffgoll"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="03/24/2016"
	ms.author="jeffreyg"
	ms.workload="data-management"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="NA"/>


# Create a scalable elastic database pool for SQL databases with the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-create-portal.md)
- [PowerShell](sql-database-elastic-pool-create-powershell.md)
- [C#](sql-database-elastic-pool-create-csharp.md)

This article shows you how to create a scalable [elastic database pool](sql-database-elastic-pool.md) with the [Azure portal](https://portal.azure.com/). There are two ways you can create a pool. You can do it from scratch if you know the pool setup you want, or start with a recommendation from the service. SQL Database has built-in intelligence that recommends a pool setup if it's more cost-efficient for you based on the past usage telemetry for your databases.

You can add multiple pools to a server, but you can't add databases from different servers into the same pool. To create a pool, you need at least one database in a V12 server. If you don't have one, see [Create your first Azure SQL database](sql-database-get-started.md). You can create a pool with only one database, but pools are only cost-efficient with multiple databases. See [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).

> [AZURE.NOTE] Pools are only available with SQL Database V12 servers. If you have databases on a V11 server, you can [use a PowerShell script to identify them as candidates for a pool](sql-database-elastic-pool-database-assessment-powershell.md) on a V12 server, and then [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-powershell.md) in one step.

##Create a new pool
1. In the [Azure portal](http://portal.azure.com/) click **SQL servers**, and then click the server that contains the databases you want to add to a pool.
2. Click **New pool**.

    ![Add pool to a server](./media/sql-database-elastic-pool-create-portal/new-pool.png)

    **-OR-**

    Click the message to see the recommended pools based on historical database usage telemetry, and then click the tier to see more details and customize the pool. See [Understand pool recommendations](#understand-pool-recommendations) later in this topic for how the recommendation is made.

    ![recommended pool](./media/sql-database-elastic-pool-create-portal/recommended-pool.png)

    The **Elastic database pool** blade appears, which is where you'll set up your pool. If you clicked **New pool** in the previous step, the portal chooses a **Standard pool** under **Pricing tier**, a unique **Name** for the pool, and a default configuration for the pool. If you chose a recommended pool, the recommended tier and configuration of the pool are already chosen, but you can still change them.

    ![Configure elastic pool](./media/sql-database-elastic-pool-create-portal/configure-elastic-pool.png)

3. To change the pricing tier for the pool, click **Pricing tier**, click the pricing tier your want, and then click **Select**.

    > [AZURE.IMPORTANT] After you choose the pricing tier and commit your changes by clicking **OK** in the last step, you won't be able to change the pricing tier of the pool.

4. Click **Configure pool**, where you can add databases and choose resource settings for the pool.
5. To add databases, click **Add database**, click the databases that you want to add, and then click the **Select** button.

    ![Add databases](./media/sql-database-elastic-pool-create-portal/add-databases.png)

    If the databases you're working with have enough historical usage telemetry, the **Estimated eDTU and GB usage** graph and the **Actual eDTU usage** bar chart update to help you make configuration decisions. Also, the service may give you a recommendation message to help you right-size the pool. See [Understand pool recommendations](#understand-pool-recommendations).

    ![dynamic recommendations](./media/sql-database-elastic-pool-create-portal/dynamic-recommendation.png)

6. Use the controls on the **Configure pool** page to explore settings and configure your pool according to the following guidelines:

    ![Configure Elastic Pool](./media/sql-database-elastic-pool-create-portal/configure-performance.png)

    | Performance setting | Description |
    | :--- | :--- |
    | **POOL eDTU** and **Pool GB** (per pool setting)| The Max eDTUs available to and shared by all databases in the pool. The max eDTUs available in a pool depend on the pricing tier (service tier). The **Pool eDTU** correlates to the storage available for the pool. For every eDTU that you allocate to the pool, you get a fixed amount of database storage, and vice versa. |
    | **eDTU MIN** (per database setting)| The minimum number of eDTUs from the pool that all databases in the pool are guaranteed at any time. The **eDTU MIN** is usually set to anywhere between 0 and the average historical eDTU utilization per database. This is a global setting that applies to all databases in the pool. |
    | **eDTU MAX** (per database setting) | The maximum number of eDTUs that any single database in the pool may use. You can set this cap up to the **POOL eDTU**. Set **eDTU MAX** per database high enough to handle max bursts or spikes to the database's peak utilization. Some degree of overcommitting the group is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking. **Example:** Suppose the peak utilization per database is 50 DTUs and only 20% of the 100 databases in the group simultaneously spike to the peak. If the eDTU cap per database is set to 50 eDTUs, then it is reasonable to overcommit the pool by 5 times, and set the **POOL eDTU** to 1,000. The **eDTU MAX** is not a resource guarantee for a database, it is an eDTU ceiling that can be hit if available. This is a global setting that applies to all databases in the pool. |

    See the [Elastic database pool reference](sql-database-elastic-pool-reference.md#edtu-and-storage-limits-for-elastic-pools-and-elastic-databases) for more detail about limits for each service tier, and see [Price and performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md) for detailed guidance on right-sizing a pool.

7. Click **Select** when you finish, and then click **OK** to create the pool.

##Understand pool recommendations
The SQL Database service evaluates usage history and recommends one or more pools when it is more cost-effective than using single databases. Each recommendation is configured with a unique subset of the server's databases that best fit the pool. The pool recommendation comprises:

- A pricing tier for the pool (Basic, Standard, or Premium)
- Appropriate **POOL eDTUs** (also called Max eDTUs per pool)
- The **eDTU MAX** and **eDTU Min** per database
- The list of recommended databases for the pool

The service takes the last 30 days of telemetry into account when recommending pools. For a database to be considered as a candidate for an elastic database pool it must exist for at least 7 days. Databases that are already in an elastic database pool are not considered as candidates for elastic database pool recommendations.

The service evaluates resource needs and cost effectiveness of moving the single databases in each service tier into pools of the same tier. For example, all Standard databases on a server are assessed for their fit into a Standard Elastic Pool. This means the service does not make cross-tier recommendations such as moving a Standard database into a Premium pool.

## Additional resources

- [Manage a SQL Database elastic pool with the portal](sql-database-elastic-pool-manage-portal.md)
- [Manage a SQL Database elastic pool with PowerShell](sql-database-elastic-pool-manage-powershell.md)
- [Manage a SQL Database elastic pool with C#](sql-database-client-library.md)
- [Elastic database reference](sql-database-elastic-pool-reference.md)
