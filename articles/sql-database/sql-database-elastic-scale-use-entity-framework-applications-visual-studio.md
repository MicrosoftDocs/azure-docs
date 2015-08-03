<properties 
	pageTitle="Using elastic database client library with Entity Framework" 
	description="Elastic database client makes it easy to scale, and Entity Framework is easy to use for coding databases" 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/24/2015" 
	ms.author="sidneyh"/>

# Elastic Database client library with Entity Framework 
 
You can use the elastic database client library with Microsoft’s Entity Framework (EF) to build applications that take advantage of database sharding, facilitating scaling-out your application's data tier. This document shows the changes in an Entity Framework application that are needed to integrate with the elastic database tools' capabilities. The focus is on composing [shard map management](sql-database-elastic-scale-shard-map-management.md) and [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md) with the Entity Framework **Code First** approach. The [Code First – New Database](http://msdn.microsoft.com/data/jj193542.aspx) tutorial for EF serves as our running example throughout this document. The sample code accompanying this document is part of elastic database tools' set of samples in the Visual Studio Code Samples.
  
## Downloading and Running the Sample Code
To download the code for this article:

* Visual Studio 2012 or later is required. 
* Start Visual Studio. 
* In Visual Studio, select File -> New Project. 
* In the ‘New Project’ dialog, navigate to the **Online Samples** for **Visual C#** and type "elastic db" into the search box in the upper right.
    
    ![Entity Framework and elastic database sample app][1] 

    Select the sample called **Elastic DB Tools for Azure SQL – Entity Framework Integration**. After accepting the license, the sample loads. 

To run the sample, you need to create three empty databases in Azure SQL Database:

* Shard Map Manager database
* Shard 1 database
* Shard 2 database

Once you have created these databases, fill in the place holders in **Program.cs** with your Azure SQL DB server name, the database names and your credentials to connect to the databases. Build the solution in Visual Studio. Visual Studio will download the required NuGet packages for the elastic database client library, Entity Framework, and Transient Fault handling as part of the build process. Make sure that restoring NuGet packages is enabled for your solution. You can enable this setting by right-clicking on the solution file in the Visual Studio Solution Explorer. 

## Entity Framework workflows 

Entity Framework developers rely on one of the following four workflows to build applications and to ensure persistence for application objects: 

* **Code First (New Database)**: The EF developer creates the model in the application code and then EF generates the database from it. 
* **Code First (Existing Database)**: The developer lets EF generate the application code for the model from an existing database.
* **Model First**: The developer creates the model in the EF designer and then EF creates the database from the model.
* **Database First**: The developer uses EF tooling to infer the model from an existing database. 

All these approaches rely on the DbContext class to transparently manage database connections and database schema for an application. As we will discuss in more detail later in the document, different constructors on the DbContext base class allow for different levels of control over connection creation, database bootstrapping and schema creation. Challenges arise primarily from the fact that the database connection management provided by EF intersects with the connection management capabilities of the data dependent routing interfaces provided by the elastic database client library. 

## Elastic database tools assumptions 

For term definitions, see [Elastic Database tools glossary](sql-database-elastic-scale-glossary.md).

With elastic database client library, you define partitions of your application data called shardlets. Shardlets are identified by a sharding key and are mapped to specific databases. An application may have as many databases as needed and distribute the shardlets to provide enough capacity or performance given current business requirements. The mapping of sharding key values to the databases is stored by a shard map provided by the elastic database client APIs. We call this capability **Shard Map Management**, or SMM for short. The shard map also serves as the broker of database connections for requests that carry a sharding key. We refer to this capability as **data-dependent routing**. 
 
The shard map manager protects users from inconsistent views into shardlet data that can occur when concurrent shardlet management operations (such as relocating data from one shard to another) are happening. To do so, the shard maps managed by the client library broker the database connections for an application. This allows the shard map functionality to automatically kill a database connection when shard management operations could impact the shardlet that the connection has been created for. This approach needs to integrate with some of EF’s functionality, such as creating new connections from an existing one to check for database existence. In general, our observation has been that the standard DbContext constructors only work reliably for closed database connections that can safely be cloned for EF work. The design principle of elastic database instead is to only broker opened connections. One might think that closing a connection brokered by the client library before handing it over to the EF DbContext may solve this issue. However, by closing the connection and relying on EF to re-open it, one foregoes the validation and consistency checks performed by the library. The migrations functionality in EF, however, uses these connections to manage the underlying database schema in a way that is transparent to the application. Ideally, we would like to retain and combine all these capabilities from both the elastic database client library and EF in the same application. The following section discusses these properties and requirements in more detail. 


## Requirements 

When working with both the elastic database client library and Entity Framework APIs, we want to retain the following properties: 

* **Scale-out**: To add or remove databases from the data tier of the sharded application as necessary for the capacity demands of the application. This means control over the the creation and deletion of databases and using the elastic database shard map manager APIs to manage databases, and mappings of shardlets. 

* **Consistency**: The application employs sharding, and uses the data dependent routing capabilities of the client library. To avoid corruption or wrong query results, connections are brokered through the shard map manager. This also retains validation and consistency.
 
* **Code First**: To retain the convenience of EF’s code first paradigm. In Code First, classes in the application are mapped transparently to the underlying database structures. The application code interacts with DbSets that mask most aspects involved in the underlying database processing.
 
* **Schema**: Entity Framework handles initial database schema creation and subsequent schema evolution through migrations. By retaining these capabilities, adapting your app is easy as the data evolves. 

The following guidance instructs how to satisfy these requirements for Code First applications using elastic database tools. 

## Data dependent routing using EF DbContext 

Database connections with Entity Framework are typically managed through subclasses of **DbContext**. Create these subclasses by deriving from **DbContext**. This is where you define your **DbSets** that implement the database-backed collections of CLR objects for your application. In the context of data dependent routing, we can identify several helpful properties that do not necessarily hold for other EF code first application scenarios: 

* The database already exists and has been registered in the elastic database shard map. 
* The schema of the application has already been deployed to the database (explained below). 
* Data-dependent routing connections to the database are brokered by the shard map. 

To integrate **DbContexts** with data-dependent routing for scale-out:

1. Create physical database connections through the elastic database client interfaces of the shard map manager, 
2. Wrap the connection with the **DbContext** subclass
3. Pass the connection down into the **DbContext** base classes to ensure all the processing on the EF side happens as well. 

The following code example illustrates this approach. (This code is also in the accompanying Visual Studio project)

    public class ElasticScaleContext<T> : DbContext
    {
    public DbSet<Blog> Blogs { get; set; }
    …

        // C'tor for data dependent routing. This call will open a validated connection 
        // routed to the proper shard by the shard map manager. 
        // Note that the base class c'tor call will fail for an open connection
        // if migrations need to be done and SQL credentials are used. This is the reason for the 
        // separation of c'tors into the data-dependent routing case (this c'tor) and the internal c'tor for new shards.
        public ElasticScaleContext(ShardMap shardMap, T shardingKey, string connectionStr)
            : base(CreateDDRConnection(shardMap, shardingKey, connectionStr), 
            true /* contextOwnsConnection */)
        {
        }

        // Only static methods are allowed in calls into base class c'tors.
        private static DbConnection CreateDDRConnection(
        ShardMap shardMap, 
        T shardingKey, 
        string connectionStr)
        {
            // No initialization
            Database.SetInitializer<ElasticScaleContext<T>>(null);

            // Ask shard map to broker a validated connection for the given key
            SqlConnection conn = shardMap.OpenConnectionForKey<T>
                                (shardingKey, connectionStr, ConnectionOptions.Validate);
            return conn;
        }    

## Main points
* A new constructor replaces the default constructor in the DbContext subclass 
* The new constructor takes the arguments that are required for data dependent routing through elastic database client library:
    * the shard map to access the data-dependent routing interfaces,
    * the sharding key to identify the shardlet,
    * a connection string with the credentials for the data-dependent routing connection to the shard. 
 
* The call to the base class constructor takes a detour into a static method that performs all the steps necessary for data-dependent routing. 
   * It uses the OpenConnectionForKey call of the elastic database client interfaces on the shard map to establish an open connection.
   * The shard map creates the open connection to the shard that holds the shardlet for the given sharding key.
   * This open connection is passed back to the base class constructor of DbContext to indicate that this connection is to be used by EF instead of letting EF create a new connection automatically. This way the connection has been tagged by the elastic database client API so that it can guarantee consistency under shard map management operations.
 
  
Use the new constructor for your DbContext subclass instead of the default constructor in your code. Here is an example: 

    // Create and save a new blog.

    Console.Write("Enter a name for a new blog: "); 
    var name = Console.ReadLine(); 

    using (var db = new ElasticScaleContext<int>( 
                            sharding.ShardMap,  
                            tenantId1,  
                            connStrBldr.ConnectionString)) 
    { 
        var blog = new Blog { Name = name }; 
        db.Blogs.Add(blog); 
        db.SaveChanges(); 

        // Display all Blogs for tenant 1 
        var query = from b in db.Blogs 
                    orderby b.Name 
                    select b; 
     … 
    }

The new constructor opens the connection to the shard that holds the data for the shardlet identified by the value of **tenantid1**. The code in the **using** block stays unchanged to access the **DbSet** for blogs using EF on the shard for **tenantid1**. This changes semantics for the code in the using block such that all database operations are now scoped to the one shard where **tenantid1** is kept. For instance, a LINQ query over the blogs **DbSet** would only return blogs stored on the current shard, but not the ones stored on other shards.  

#### Transient faults handling
The Microsoft Patterns & Practices team published the [The Transient Fault Handling Application Block](https://msdn.microsoft.com/library/dn440719.aspx). The library is used with elastic scale client library in combination with EF. However, ensure that any transient exception returns to a place where we can ensure that the new constructor is being used after a transient fault so that any new connection attempt is made using the constructors we have tweaked. Otherwise, a connection to the correct shard is not guaranteed, and there are no assurances the connection is maintained as changes to the shard map occur. 

The following code sample illustrates how a SQL retry policy can be used around the new **DbContext** subclass constructors: 

    SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
    { 
        using (var db = new ElasticScaleContext<int>( 
                                sharding.ShardMap,  
                                tenantId1,  
                                connStrBldr.ConnectionString)) 
            { 
                    var blog = new Blog { Name = name }; 
                    db.Blogs.Add(blog); 
                    db.SaveChanges(); 
            … 
            } 
        }); 

**SqlDatabaseUtils.SqlRetryPolicy** in the code above is defined as a **SqlDatabaseTransientErrorDetectionStrategy** with a retry count of 10, and 5 seconds wait time between retries. This approach is similar to the guidance for EF and user-initiated transactions (see [Limitations with Retrying Execution Strategies (EF6 onwards)](http://msdn.microsoft.com/data/dn307226). Both situations require that the application program controls the scope to which the transient exception returns: to either reopen the transaction, or (as shown) recreate the context from the proper constructor that uses the elastic database client library.

The need to control where transient exceptions take us back in scope also precludes the use of the built-in **SqlAzureExecutionStrategy** that comes with EF. **SqlAzureExecutionStrategy** would reopen a connection but not use **OpenConnectionForKey** and therefore bypass all the validation that is performed as part of the **OpenConnectionForKey** call. Instead, the code sample uses the built-in **DefaultExecutionStrategy** that also comes with EF. As opposed to **SqlAzureExecutionStrategy**, it works correctly in combination with the retry policy from Transient Fault Handling. The execution policy is set in the **ElasticScaleDbConfiguration** class. Note that we decided not to use **DefaultSqlExecutionStrategy** since it suggests to use **SqlAzureExecutionStrategy** if transient exceptions occur - which would lead to wrong behavior as discussed. For more information on the different retry policies and EF, see [Connection Resiliency in EF](http://msdn.microsoft.com/data/dn456835.aspx).     

#### Constructor rewrites
The code examples above illustrate the default constructor re-writes required for your application in order to use  data dependent routing with the Entity Framework. The following table generalizes this approach to other constructors. 


Current Constructor  | Rewritten Constructor for data | Base Constructor | Notes
---------- | ----------- | ------------|----------
MyContext() |ElasticScaleContext(ShardMap, TKey) |DbContext(DbConnection, bool) |The connection needs to be a function of the shard map and the data-dependent routing key. You need to by-pass automatic connection creation by EF and instead use the shard map to broker the connection. 
MyContext(string)|ElasticScaleContext(ShardMap, TKey) |DbContext(DbConnection, bool) |The connection is a function of the shard map and the data-dependent routing key. A fixed database name or connection string will not work as they by-pass validation by the shard map. 
MyContext(DbCompiledModel) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel) |DbContext(DbConnection, DbCompiledModel, bool) |The connection will get created for the given shard map and sharding key with the model provided. The compiled model will be passed on to the base c’tor.
MyContext(DbConnection, bool) |ElasticScaleContext(ShardMap, TKey, bool) |DbContext(DbConnection, bool) |The connection needs to be inferred from the shard map and the key. It cannot be provided as an input (unless that input was already using the shard map and the key). The Boolean will be passed on. 
MyContext(string, DbCompiledModel) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel) |DbContext(DbConnection, DbCompiledModel, bool) |The connection needs to be inferred from the shard map and the key. It cannot be provided as an input (unless that input was using the shard map and the key). The compiled model will be passed on. 
MyContext(ObjectContext, bool) |ElasticScaleContext(ShardMap, TKey, ObjectContext, bool) |DbContext(ObjectContext, bool) |The new constructor needs to ensure that any connection in the ObjectContext passed as an input is re-routed to a connection managed by Elastic Scale. A detailed discussion of ObjectContexts is beyond the scope of this document.
MyContext(DbConnection, DbCompiledModel,bool) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel, bool)| DbContext(DbConnection, DbCompiledModel, bool); |The connection needs to be inferred from the shard map and the key. The connection cannot be provided as an input (unless that input was already using the shard map and the key). Model and Boolean are passed on to the base class constructor. 

## Shard schema deployment through EF migrations 

Automatic schema management is a convenience provided by the Entity Framework. In the context of applications using elastic database tools, we want to retain this capability to automatically provision the schema to newly created shards when databases are added to the sharded application. The primary use case is to increase capacity at the data tier for sharded applications using EF. Relying on EF’s capabilities for schema management reduces the database administration effort with a sharded application built on EF. 

Schema deployment through EF migrations works best on **unopened connections**. This is in contrast to the scenario for data dependent routing that relies on the opened connection provided by the elastic database client API. Another difference is the consistency requirement: While desirable to ensure consistency for all data-dependent routing connections to protect against concurrent shard map manipulation, it is not a concern with initial schema deployment to a new database that has not yet been registered in the shard map, and not yet been allocated to hold shardlets. We can therefore rely on regular database connections for this scenarios, as opposed to data-dependent routing.  

This leads to an approach where schema deployment through EF migrations is tightly coupled with the registration of the new database as a shard in the application’s shard map. This relies on the following prerequisites: 

* The database has already been created. 
* The database is empty – it holds no user schema and no user data.
* The database cannot yet be accessed through the elastic database client APIs for data-dependent routing. 

With these prerequisites in place, we can create a regular un-opened **SqlConnection** to kick off EF migrations for schema deployment. The following code sample illustrates this approach. 

        // Enter a new shard - i.e. an empty database - to the shard map, allocate a first tenant to it  
        // and kick off EF intialization of the database to deploy schema 

        public void RegisterNewShard(string server, string database, string connStr, int key) 
        { 

            Shard shard = this.ShardMap.CreateShard(new ShardLocation(server, database)); 

            SqlConnectionStringBuilder connStrBldr = new SqlConnectionStringBuilder(connStr); 
            connStrBldr.DataSource = server; 
            connStrBldr.InitialCatalog = database; 

            // Go into a DbContext to trigger migrations and schema deployment for the new shard. 
            // This requires an un-opened connection. 
            using (var db = new ElasticScaleContext<int>(connStrBldr.ConnectionString)) 
            { 
                // Run a query to engage EF migrations 
                (from b in db.Blogs 
                    select b).Count(); 
            } 

            // Register the mapping of the tenant to the shard in the shard map. 
            // After this step, data-dependent routing on the shard map can be used 

            this.ShardMap.CreatePointMapping(key, shard); 
        } 
 

This sample shows the method **RegisterNewShard** that registers the shard in the shard map, deploys the schema through EF migrations, and stores a mapping of a sharding key to the shard. It relies on a constructor of the **DbContext** subclass (**ElasticScaleContext** in the sample) that takes a SQL connection string as input. The code of this constructor is straight-forward, as the following example shows: 


        // C'tor to deploy schema and migrations to a new shard 
        protected internal ElasticScaleContext(string connectionString) 
            : base(SetInitializerForConnection(connectionString)) 
        { 
        } 

        // Only static methods are allowed in calls into base class c'tors 
        private static string SetInitializerForConnection(string connnectionString) 
        { 
            // We want existence checks so that the schema can get deployed 
            Database.SetInitializer<ElasticScaleContext<T>>( 
        new CreateDatabaseIfNotExists<ElasticScaleContext<T>>()); 

            return connnectionString; 
        } 
 
One might have used the version of the constructor inherited from the base class. But the code needs to ensure that the default initializer for EF is used when connecting. Hence the short detour into the static method before calling into the base class constructor with the connection string. Note that the registration of shards should run in a different app domain or process to ensure that the initializer settings for EF do not conflict. 


## Limitations 

The approaches outlined in this document entail a couple of limitations: 

* EF applications that use **LocalDb** first need to migrate to a regular SQL Server database before using elastic database client library. Scaling out an application through sharding with Elastic Scale is not possible with **LocalDb**. Note that development can still use **LocalDb**. 

* Any changes to the application that imply database schema changes need to go through EF migrations on all shards. The sample code for this document does not demonstrate how to do this. Consider using Update-Database with a ConnectionString parameter to iterate over all shards; or extract the T-SQL script for the pending migration using Update-Database with the –Script option and apply the T-SQL script to your shards.  

* Given a request, it is assumed that all of its database processing is contained within a single shard as identified by the sharding key provided by the request. However, this assumption does not always hold true. For example, when it is not possible to make a sharding key available. To address this, the client library provides the **MultiShardQuery** class that implements a connection abstraction for querying over several shards. Learning to use the **MultiShardQuery** in combination with EF is beyond the scope of this document

## Conclusions 

Entity Framework applications can easily benefit from the elastic database tools in Azure SQL Database. Through the steps outlined in this document, EF applications can use the elastic database client library's capability for data dependent routing by refactoring constructors of the **DbContext** subclasses used in the EF application. This limits the  changes required to those places where **DbContext** classes already exist. In addition, EF applications can continue to benefit from automatic schema deployment by combining the steps that invoke the necessary EF migrations with the registration of new shards and mappings in the shard map. 


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-use-entity-framework-applications-visual-studio/sample.png
 