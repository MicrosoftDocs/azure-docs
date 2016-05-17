The Database Transaction Unit (DTU) is the unit of measure in SQL Database that represents the relative power of databases based on a real-world measure: the database transaction. We took a set of operations that are typical for an online transaction processing (OLTP) request, and then measured how many transactions could be completed per second under fully loaded conditions (that’s the short version, you can read the gory details in the [Benchmark overview](../articles/sql-database/sql-database-benchmark-overview.md)). 

For example, a Premium P11 database with 1750 DTUs provides 350x more DTU compute power than a Basic database with 5 DTUs. 

![Intro to SQL Database: Single database DTUs by tier and level.](./media/sql-database-understanding-dtus/single_db_dtus.png)

>[AZURE.NOTE] If you are migrating an existing SQL Server database, you can use a third-party tool, [the Azure SQL Database DTU Calculator](http://dtucalculator.azurewebsites.net/), to get an estimate of the performance level and service tier your database might require in Azure SQL Database.

### DTU vs. eDTU

The DTU for single databases translates directly to the eDTU for elastic databases. For example, a database in a Basic elastic database pool offers up to 5 eDTUs. That’s the same performance as a single Basic database. The difference is that the elastic database won’t consume any eDTUs from the pool until it has to. 

![Intro to SQL Database: Elastic pools by tier.](./media/sql-database-understanding-dtus/sqldb_elastic_pools.png)

A simple example helps. Take a Basic elastic database pool with 1000 DTUs and drop 800 databases in it. As long as only 200 of the 800 databases are being used at any point in time (5 DTU X 200 = 1000), you won’t hit capacity of the pool, and database performance won’t degrade. This example is simplified for clarity. The real math is a bit more involved. The portal does the math for you, and makes a recommendation based on historical database usage. See [Price and performance considerations for an elastic database pool](../articles/sql-database/sql-database-elastic-pool-guidance.md) to learn how the recommendations work, or to do the math yourself. 
