---
title: Using elastic database client library with Dapper | Microsoft Docs
description: Using elastic database client library with Dapper.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-scale
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 04/01/2018
---
# Using elastic database client library with Dapper
This document is for developers that rely on Dapper to build applications, but also want to embrace [elastic database tooling](sql-database-elastic-scale-introduction.md) to create applications that implement sharding to scale out their data tier.  This document illustrates the changes in Dapper-based applications that are necessary to integrate with elastic database tools. Our focus is on composing the elastic database shard management and data-dependent routing with Dapper. 

**Sample Code**: [Elastic database tools for Azure SQL Database - Dapper integration](https://code.msdn.microsoft.com/Elastic-Scale-with-Azure-e19fc77f).

Integrating **Dapper** and **DapperExtensions** with the elastic database client library for Azure SQL Database is easy. Your applications can use data-dependent routing by changing the creation and opening of new [SqlConnection](http://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.aspx) objects to use the [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) call from the [client library](http://msdn.microsoft.com/library/azure/dn765902.aspx). This limits changes in your application to only where new connections are created and opened. 

## Dapper overview
**Dapper** is an object-relational mapper. It maps .NET objects from your application to a relational database (and vice versa). The first part of the sample code illustrates how you can integrate the elastic database client library with Dapper-based applications. The second part of the sample code illustrates how to integrate when using both Dapper and DapperExtensions.  

The mapper functionality in Dapper provides extension methods on database connections that simplify submitting T-SQL statements for execution or querying the database. For instance, Dapper makes it easy to map between your .NET objects and the parameters of SQL statements for **Execute** calls, or to consume the results of your SQL queries into .NET objects using **Query** calls from Dapper. 

When using DapperExtensions, you no longer need to provide the SQL statements. Extensions methods such as **GetList** or **Insert** over the database connection create the SQL statements behind the scenes.

Another benefit of Dapper and also DapperExtensions is that the application controls the creation of the database connection. This helps interact with the elastic database client library which brokers database connections based on the mapping of shardlets to databases.

To get the Dapper assemblies, see [Dapper dot net](http://www.nuget.org/packages/Dapper/). For the Dapper extensions, see [DapperExtensions](http://www.nuget.org/packages/DapperExtensions).

## A quick Look at the elastic database client library
With the elastic database client library, you define partitions of your application data called *shardlets*, map them to databases, and identify them by *sharding keys*. You can have as many databases as you need and distribute your shardlets across these databases. The mapping of sharding key values to the databases is stored by a shard map provided by the library’s APIs. This capability is called **shard map management**. The shard map also serves as the broker of database connections for requests that carry a sharding key. This capability is referred to as **data-dependent routing**.

![Shard maps and data-dependent routing][1]

The shard map manager protects users from inconsistent views into shardlet data that can occur when concurrent shardlet management operations are happening on the databases. To do so, the shard maps broker the database connections for an application built with the library. When shard management operations could impact the shardlet, this allows the shard map functionality to automatically kill a database connection. 

Instead of using the traditional way to create connections for Dapper, you need to use the [OpenConnectionForKey method](http://msdn.microsoft.com/library/azure/dn824099.aspx). This ensures that all the validation takes place and connections are managed properly when any data moves between shards.

### Requirements for Dapper integration
When working with both the elastic database client library and the Dapper APIs, you want to retain the following properties:

* **Scale out**: We want to add or remove databases from the data tier of the sharded application as necessary for the capacity demands of the application. 
* **Consistency**: Since the application is scaled out using sharding, you need to perform data-dependent routing. We want to use the data-dependent routing capabilities of the library to do so. In particular, you want to retain the validation and consistency guarantees provided by connections that are brokered through the shard map manager in order to avoid corruption or wrong query results. This ensures that connections to a given shardlet are rejected or stopped if (for instance) the shardlet is currently moved to a different shard using Split/Merge APIs.
* **Object Mapping**: We want to retain the convenience of the mappings provided by Dapper to translate between classes in the application and the underlying database structures. 

The following section provides guidance for these requirements for applications based on **Dapper** and **DapperExtensions**.

## Technical Guidance
### Data-dependent routing with Dapper
With Dapper, the application is typically responsible for creating and opening the connections to the underlying database. Given a type T by the application, Dapper returns query results as .NET collections of type T. Dapper performs the mapping from the T-SQL result rows to the objects of type T. Similarly, Dapper maps .NET objects into SQL values or parameters for data manipulation language (DML) statements. Dapper offers this functionality via extension methods on the regular [SqlConnection](http://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.aspx) object from the ADO .NET SQL Client libraries. The SQL connection returned by the Elastic Scale APIs for DDR are also regular [SqlConnection](http://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.aspx) objects. This allows us to directly use Dapper extensions over the type returned by the client library’s DDR API, as it is also a simple SQL Client connection.

These observations make it straightforward to use connections brokered by the elastic database client library for Dapper.

This code example (from the accompanying sample) illustrates the approach where the sharding key is provided by the application to the library to broker the connection to the right shard.   

    using (SqlConnection sqlconn = shardingLayer.ShardMap.OpenConnectionForKey(
                     key: tenantId1, 
                     connectionString: connStrBldr.ConnectionString, 
                     options: ConnectionOptions.Validate))
    {
        var blog = new Blog { Name = name };
        sqlconn.Execute(@"
                      INSERT INTO
                            Blog (Name)
                            VALUES (@name)", new { name = blog.Name }
                        );
    }

The call to the [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) API replaces the default creation and opening of a SQL Client connection. The [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) call takes the arguments that are required for data-dependent routing: 

* The shard map to access the data-dependent routing interfaces
* The sharding key to identify the shardlet
* The credentials (user name and password) to connect to the shard

The shard map object creates a connection to the shard that holds the shardlet for the given sharding key. The elastic database client APIs also tag the connection to implement its consistency guarantees. Since the call to [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) returns a regular SQL Client connection object, the subsequent call to the **Execute** extension method from Dapper follows the standard Dapper practice.

Queries work very much the same way - you first open the connection using [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) from the client API. Then you use the regular Dapper extension methods to map the results of your SQL query into .NET objects:

    using (SqlConnection sqlconn = shardingLayer.ShardMap.OpenConnectionForKey(
                    key: tenantId1, 
                    connectionString: connStrBldr.ConnectionString, 
                    options: ConnectionOptions.Validate ))
    {    
           // Display all Blogs for tenant 1
           IEnumerable<Blog> result = sqlconn.Query<Blog>(@"
                                SELECT * 
                                FROM Blog
                                ORDER BY Name");

           Console.WriteLine("All blogs for tenant id {0}:", tenantId1);
           foreach (var item in result)
           {
                Console.WriteLine(item.Name);
            }
    }

Note that the **using** block with the DDR connection scopes all database operations within the block to the one shard where tenantId1 is kept. The query only returns blogs stored on the current shard, but not the ones stored on any other shards. 

## Data-dependent routing with Dapper and DapperExtensions
Dapper comes with an ecosystem of additional extensions that can provide further convenience and abstraction from the database when developing database applications. DapperExtensions is an example. 

Using DapperExtensions in your application does not change how database connections are created and managed. It is still the application’s responsibility to open connections, and regular SQL Client connection objects are expected by the extension methods. We can rely on the [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) as outlined above. As the following code samples show, the only change is that you no longer have to write the T-SQL statements:

    using (SqlConnection sqlconn = shardingLayer.ShardMap.OpenConnectionForKey(
                    key: tenantId2, 
                    connectionString: connStrBldr.ConnectionString, 
                    options: ConnectionOptions.Validate))
    {
           var blog = new Blog { Name = name2 };
           sqlconn.Insert(blog);
    }

And here is the code sample for the query: 

    using (SqlConnection sqlconn = shardingLayer.ShardMap.OpenConnectionForKey(
                    key: tenantId2, 
                    connectionString: connStrBldr.ConnectionString, 
                    options: ConnectionOptions.Validate))
    {
           // Display all Blogs for tenant 2
           IEnumerable<Blog> result = sqlconn.GetList<Blog>();
           Console.WriteLine("All blogs for tenant id {0}:", tenantId2);
           foreach (var item in result)
           {
               Console.WriteLine(item.Name);
           }
    }

### Handling transient faults
The Microsoft Patterns & Practices team published the [Transient Fault Handling Application Block](http://msdn.microsoft.com/library/hh680934.aspx) to help application developers mitigate common transient fault conditions encountered when running in the cloud. For more information, see [Perseverance, Secret of All Triumphs: Using the Transient Fault Handling Application Block](http://msdn.microsoft.com/library/dn440719.aspx).

The code sample relies on the transient fault library to protect against transient faults. 

    SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() =>
    {
       using (SqlConnection sqlconn = 
          shardingLayer.ShardMap.OpenConnectionForKey(tenantId2, connStrBldr.ConnectionString, ConnectionOptions.Validate))
          {
              var blog = new Blog { Name = name2 };
              sqlconn.Insert(blog);
          }
    });

**SqlDatabaseUtils.SqlRetryPolicy** in the code above is defined as a **SqlDatabaseTransientErrorDetectionStrategy** with a retry count of 10, and 5 seconds wait time between retries. If you are using transactions, make sure that your retry scope goes back to the beginning of the transaction in the case of a transient fault.

## Limitations
The approaches outlined in this document entail a couple of limitations:

* The sample code for this document does not demonstrate how to manage schema across shards.
* Given a request, we assume that all its database processing is contained within a single shard as identified by the sharding key provided by the request. However, this assumption does not always hold, for example, when it is not possible to make a sharding key available. To address this, the elastic database client library includes the [MultiShardQuery class](http://msdn.microsoft.com/library/azure/microsoft.azure.sqldatabase.elasticscale.query.multishardexception.aspx). The class implements a connection abstraction for querying over several shards. Using MultiShardQuery in combination with Dapper is beyond the scope of this document.

## Conclusion
Applications using Dapper and DapperExtensions can easily benefit from elastic database tools for Azure SQL Database. Through the steps outlined in this document, those applications can use the tool's capability for data-dependent routing by changing the creation and opening of new [SqlConnection](http://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.aspx) objects to use the [OpenConnectionForKey](http://msdn.microsoft.com/library/azure/dn807226.aspx) call of the elastic database client library. This limits the application changes required to those places where new connections are created and opened. 

[!INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-working-with-dapper/dapperimage1.png
