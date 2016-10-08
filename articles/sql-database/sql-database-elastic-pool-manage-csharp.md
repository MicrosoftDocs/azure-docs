<properties
    pageTitle="Monitor and manage an elastic database pool with C# | Microsoft Azure"
    description="Use C# database development techniques to manage an Azure SQL Database elastic database pool."
    services="sql-database"
    documentationCenter=""
    authors="stevestein"
    manager="jhubbard"
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="csharp"
    ms.workload="data-management"
    ms.date="10/04/2016"
    ms.author="sstein"/>

# Monitor and manage an elastic database pool with C&#x23; 

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-manage-portal.md)
- [PowerShell](sql-database-elastic-pool-manage-powershell.md)
- [C#](sql-database-elastic-pool-manage-csharp.md)
- [T-SQL](sql-database-elastic-pool-manage-tsql.md)


Learn how to manage an [elastic database pool](sql-database-elastic-pool.md) using C&#x23;. 

>[AZURE.NOTE] Many new features of SQL Database are only supported when you are using the [Azure Resource Manager deployment model](../resource-group-overview.md), so you should always use the latest **Azure SQL Database Management Library for .NET ([docs](https://msdn.microsoft.com/library/azure/mt349017.aspx) | [NuGet Package](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql))**. The older [classic deployment model-based libraries](https://www.nuget.org/packages/Microsoft.WindowsAzure.Management.Sql) are supported for backward compatibility only, so we recommend you use the newer Resource Manager based libraries.

To complete the steps in this article, you need the following items:

- An elastic pool (the pool you want to manage). To create a pool, see [Create an elastic database pool with C#](sql-database-elastic-pool-create-csharp.md).
- Visual Studio. For a free copy of Visual Studio, see the [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) page.


## Move a database into an elastic pool

You can move a stand-alone database in or out of a pool.  

    // Retrieve current database properties.

    currentDatabase = sqlClient.Databases.Get("resourcegroup-name", "server-name", "Database1").Database;

    // Configure create or update parameters with existing property values, override those to be changed.
    DatabaseCreateOrUpdateParameters updatePooledDbParameters = new DatabaseCreateOrUpdateParameters()
    {
        Location = currentDatabase.Location,
        Properties = new DatabaseCreateOrUpdateProperties()
        {
            Edition = "Standard",
            RequestedServiceObjectiveName = "ElasticPool",
            ElasticPoolName = "ElasticPool1",
            MaxSizeBytes = currentDatabase.Properties.MaxSizeBytes,
            Collation = currentDatabase.Properties.Collation,
        }
    };

    // Update the database.
    var dbUpdateResponse = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", updatePooledDbParameters);

## List databases in an elastic pool

To retrieve all databases in a pool, call the [ListDatabases](https://msdn.microsoft.com/library/microsoft.azure.management.sql.elasticpooloperationsextensions.listdatabases) method.

    //List databases in the elastic pool
    DatabaseListResponse dbListInPool = sqlClient.ElasticPools.ListDatabases("resourcegroup-name", "server-name", "ElasticPool1");
    Console.WriteLine("Databases in Elastic Pool {0}", "server-name.ElasticPool1");
    foreach (Database db in dbListInPool)
    {
        Console.WriteLine("  Database {0}", db.Name);
    }

## Change performance settings of a pool

Retrieve existing the pool properties. Modify the values and execute the CreateOrUpdate method.

    var currentPool = sqlClient.ElasticPools.Get("resourcegroup-name", "server-name", "ElasticPool1").ElasticPool;

    // Configure create or update parameters with existing property values, override those to be changed.
    ElasticPoolCreateOrUpdateParameters updatePoolParameters = new ElasticPoolCreateOrUpdateParameters()
    {
        Location = currentPool.Location,
        Properties = new ElasticPoolCreateOrUpdateProperties()
        {
            Edition = currentPool.Properties.Edition,
            DatabaseDtuMax = 50, /* Setting DatabaseDtuMax to 50 limits the eDTUs that any one database can consume */
            DatabaseDtuMin = 10, /* Setting DatabaseDtuMin above 0 limits the number of databases that can be stored in the pool */
            Dtu = (int)currentPool.Properties.Dtu,
            StorageMB = currentPool.Properties.StorageMB,  /* For a Standard pool there is 1 GB of storage per eDTU. */
        }
    };

    newPoolResponse = sqlClient.ElasticPools.CreateOrUpdate("resourcegroup-name", "server-name", "ElasticPool1", newPoolParameters);


## Latency of elastic pool operations

- Changing the min eDTUs per database or max eDTUs per database typically completes in five minutes or less.
- Time to change the pool size (eDTUs) depends on the combined size of all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space of all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.




## Additional Resources

- [SQL error codes for SQL Database client applications: Database connection error and other issues](sql-database-develop-error-messages.md).
- [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)
- [Azure Resource Management APIs](https://msdn.microsoft.com/library/azure/dn948464.aspx)
- [Create a new elastic database pool with C#](sql-database-elastic-pool-create-csharp.md)
- [When should an elastic database pool be used?](sql-database-elastic-pool-guidance.md)
- See [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md): use elastic database tools to scale-out, move data, query, or create transactions.

