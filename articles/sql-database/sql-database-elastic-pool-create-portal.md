<properties
	pageTitle="Create scalable elastic database pools | Microsoft Azure"
	description="How to add a scalable elastic database pool to your SQL database configuration for easier administration and resource sharing across many databases."
	keywords="scalable database,database configuration"
	services="sql-database"
	documentationCenter=""
	authors="sidneyh"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="04/13/2016"
	ms.author="sidneyh"
	ms.workload="data-management"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="NA"/>


# Create a new elastic pool with the Azure portal

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-create-portal.md)
- [PowerShell](sql-database-elastic-pool-create-powershell.md)
- [C#](sql-database-elastic-pool-create-csharp.md)

There are two ways to create a [pool](sql-database-elastic-pool.md). 

1. Create it with no help, especially if you know the pool setup you want.
2. Start with a recommendation from the SQL Database service. The service uses telemetry to examine your past usage. Then it recommends a cost-efficient configuration for your databases.

You can add multiple pools to a server, but you can't add databases from different servers into the same pool. To create a pool, you need at least one database in a V12 server. If you don't have a v12 server, see [Create your first Azure SQL database](sql-database-get-started.md). You can create a pool with only one database, but pools are only cost-efficient with multiple databases. See [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).

Pools are only available with SQL Database V12 servers. If you have databases on a V11 server, you can [use a PowerShell script to identify them as candidates for a pool](sql-database-elastic-pool-database-assessment-powershell.md) on a V12 server, and then [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-powershell.md) in one step.

## Create a new pool

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

    If the databases you're working with have enough historical usage telemetry, the **Estimated eDTU and GB usage** graph and the **Actual eDTU usage** bar chart update to help you make configuration decisions. 

    ![dynamic recommendations](./media/sql-database-elastic-pool-create-portal/dynamic-recommendation.png)

6. Use the controls on the **Configure pool** page to explore settings and configure your pool. See [Elastic pools limits](sql-database-elastic-pool.md#edtu-and-storage-limits-for-elastic-pools-and-elastic-databases) for more detail about limits for each service tier, and see [Price and performance considerations for elastic database pools](sql-database-elastic-pool-guidance.md) for detailed guidance on right-sizing a pool.
7. Click **Select** when you finish, and then click **OK** to create the pool.

## Understand pool recommendations

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
- [Manage a SQL Database elastic pool with C#](sql-database-elastic-pool-manage-csharp.md)
