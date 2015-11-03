The Database Throughput Unit (DTU) is the unit of measure in SQL Database that represents the relative power of a database to process transactions given the constraints of the hardware driving the database.  DTU is a concept similar to horsepower in a car.  It describes the relative performance of one database to another.  Just like with horsepower in a car, the more DTU a database has, the more power it has.  Horsepower is a function of many different factors: weight, engine capacity, turbo, exhaust system.  Similarly, DTU is a function of the amount and type of memory, compute, and disk the database can consume.  You can read the details of how we determine DTU in the [Benchmark Overview](https://msdn.microsoft.com/library/azure/dn741327.aspx)). 

Example: A Basic database has 5 DTUs which means it has relatively much less capacity for transaction throughput than a Premium P11 database that has 1750 DTUs.

![Single database dtus by tier and level](./media/sql-database-understanding-dtus/single_db_dtus.png)

The DTU for single databases translates directly to the eDTU for elastic databases. For example, a database in a Basic elastic database pool offers up to 5 eDTUs. That’s the same performance as a single Basic database. The difference is that the elastic database won’t consume any eDTUs from the pool until it has to. 

![Elastic pools by tier](./media/sql-database-understanding-dtus/sqldb_elastic_pools.png)

A simple example helps. Take a Basic elastic database pool with 1000 DTUs and drop 800 databases in it. As long as only 200 of the 800 databases are being used at any point in time (5 DTU X 200 = 1000), you won’t hit capacity of the pool, and database performance won’t degrade. This example is simplified for clarity. The real math is a bit more involved. The portal does the math for you, and makes a recommendation based on historical database usage. See [Price and performance considerations for an elastic database pool](../articles/sql-database/sql-database-elastic-pool-guidance.md) to learn how the recommendations work, or to do the math yourself.
