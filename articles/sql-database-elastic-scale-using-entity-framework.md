<properties title="Using Elastic Scale with Entity Framework" pageTitle="Using Elastic Scale with Entity Framework" description="Using Elastic Scale with Entity Framework, Entity Framework and Elastic Scale, elastic scale" metaKeywords="Using Elastic Scale with Entity Framework, Azure SQL Database sharding, elastic scale, Entity Framework and Elastic Scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Using Elastic Scale with Entity Framework 
 
This document targets developers that rely on Microsoft’s Entity Framework (EF)  to build applications, but also want to embrace Azure SQL Database Elastic Scale (preview) in order to elastically grow and shrink capacity through sharding and scale-out for their applications’ data tier. This document illustrates the changes in an Entity Framework application that are necessary to integrate with the current Elastic Scale capabilities. Our focus is on composing Elastic Scale shard management and data dependent routing with the Entity Framework Code First approach. The Code First – New Database tutorial for EF serves as our running example throughout this document. The sample code accompanying this document is part of the Elastic Scale samples in the Visual Studio Code Samples.  
## Downloading and Running the Sample Code
To download the code for this article:

* Visual Studio 2012 or later is required. 
* Start Visual Studio. 
* In Visual Studio, select File -> New Project. 
* In the ‘New Project’ dialog, navigate to the **Online Samples** for **Visual C#** and type "elastic scale" into the search box in the upper right.
    
    ![Entity Framework and elastic scale sample app][1] 

    Select the sample called **Elastic Scale with Azure SQL Database – Integrating with Entity Framework**. After accepting the license, the sample loads. 

To run the sample, you need to create three empty databases in Azure SQL Database:

* Shard Map Manager database
* Shard 1 database
* Shard 2 database

Once you have created these databases, fill in the place holders in **Program.cs** with your Azure SQL DB server name, the database names and your credentials to connect to the databases. Build the solution in Visual Studio. Visual Studio will download the required NuGet packages for Elastic Scale, Entity Framework, and transient fault handling as part of the build process. Make sure that restoring NuGet packages is enabled for your solution. You can enable this setting by right-clicking on the solution file in the Visual Studio Solution Explorer. 

For a sample app that shows how to create Elastic Scale databases, see [Getting Started with Azure Elastic Scale](./elastic-scale-get-started.md)


##Challenges & Requirements 

###Entity Framework Workflows 

Entity Framework developers rely on one of the following four workflows to build applications and to ensure persistence for application objects: 

* **Code First (New Database)**: The EF developer creates the model in the application code and then EF generates the database from it. 
* **Code First (Existing Database)**: The developer lets EF generate the application code for the model from an existing database.
* **Model First**: The developer creates the model in the EF designer and then EF creates the database from the model.
* **Database First**: The developer uses EF tooling to infer the model from an existing database. 

All these approaches rely on the DbContext class to transparently manage database connections and database schema for an application. As we will discuss in more detail later in the document, different constructors on the DbContext base class allow for different levels of control over connection creation, database bootstrapping and schema creation. Challenges arise primarily from the fact that the database connection management provided by EF intersects with the connection management capabilities of the data dependent routing interfaces provided by Azure Database Elastic Scale. 

###Elastic Scale Assumptions 

With Azure Database Elastic Scale, you define partitions of your application data called shardlets4.  Shardlets are identified by a sharding key and are mapped to specific databases. An application may have as many databases as needed and distribute the shardlets to provide enough capacity or performance given current business requirements. The mapping of sharding key values to the databases is stored by a shard map provided by the Elastic Scale APIs. We call this capability Shard Map Management, or SMM for short. The shard map also serves as the broker of database connections for requests that carry a sharding key. We refer to this capability as data dependent routing, or DDR for short. 
 
The shard map manager in Elastic Scale protects users from inconsistent views into shardlet data that can occur when concurrent shardlet management operations (such as relocating data from one shard to another) are happening on the databases. To do so, the shard maps in Elastic Scale broker the database connections for an Elastic Scale application. This allows the shard map functionality to automatically kill a database connection when shard management operations could impact the shardlet that the connection has been created for. This approach is in conflict with some of EF’s functionality, such as creating new connections from an existing one to check for database existence. In general, our observation has been that the standard DbContext constructors only work reliably for closed database connections that can safely be cloned for EF work. This is in conflict with the design principle of Elastic Scale to only broker opened connections. One might think that closing a connection brokered by Elastic Scale before handing it over to the EF DbContext may solve this issue. However, by closing the connection and relying on EF to re-open it, one foregoes the validation and consistency checks performed by Elastic Scale. The migrations functionality in EF, however, uses these connections to manage the underlying database schema in a way that is transparent to the application. Ideally, we would like to retain and combine all these capabilities from both Elastic Scale and EF in the same application. The following sub-section discusses these properties and requirements in more detail. 


###Requirements 

When working with both Elastic Scale and Entity Framework APIs, we want to retain the following properties: 

* **Scaleout**: We want to add or remove databases from the data tier of the sharded application as necessary for the capacity demands of the application. To do so, we want to control the creation and deletion of databases and use the Elastic Scale SMM APIs to manage databases and mappings of shardlets to them. 

* **Consistency**: Since our application is scaled out using sharding, we need to perform data dependent routing. We want to use the DDR capabilities of Elastic Scale to do so. In particular, we want to retain the validation and consistency guarantees provided by connections that are brokered through the Elastic Scale shard map manager in order to avoid corruption or wrong query results.
* 
* **Code First**: WWe want to retain the convenience of EF’s code first paradigm where classes in the application are mapped transparently to the underlying database structures and the application code interacts with DbSets that mask most aspects involved in the underlying database processing.
* 
* **Schema**: Entity Framework takes care of the initial database schema creation and any subsequent incremental schema evolutions through migrations. We would like to retain these capabilities and not be involved in manual schema creation or schema evolution for the databases in the sharded application. 

The following section will provide guidance on how to satisfy these requirements for Code First applications using Azure Database Elastic Scale. 

##Technical Guidance 

###Data Dependent Routing using EF DbContext 

Database connections with Entity Framework are typically managed through sub-classes of **DbContext**. Typically, you create these sub-classes by deriving from **DbContext**. This is where you define your **DbSets** that implement the database-backed collections of CLR objects for your application. In the context of data dependent routing, we can identify several helpful properties that do not necessarily hold for other EF code first application scenarios: 

* The database already exists and has been registered in the Elastic Scale shard map. 
* The schema of the application has already been deployed to the database. (We will explain in just a bit how this can be achieved by actually using EF.) 
* DDR connections to the database are brokered by the Elastic Scale shard map. 

Now, to integrate **DbContexts** with DDR for scaleout to deliver the consistency requirements outlined above, we need to (1) create physical database connections through the Elastic Scale interfaces of the shard map manager, then (2) wrap the connection with the **DbContext** sub-class, and finally (3) pass the connection down into the DbContext base classes to ensure all the processing on the EF-side happens as well. The following code example illustrates this multi-step approach. You can also find this code in the accompanying Visual Studio project:

    public class ElasticScaleContext<T> : DbContext
    {
    public DbSet<Blog> Blogs { get; set; }
    …

        // C'tor for data dependent routing. This call will open a validated connection 
        // routed to the proper shard by the shard map manager. 
        // Note that the base class c'tor call will fail for an open connection
        // if migrations need to be done and SQL credentials are used. This is the reason for the 
        // separation of c'tors into the DDR case (this c'tor) and the internal c'tor for new shards.
        public ElasticScaleContext(ShardMap shardMap, T shardingKey, string connectionStr)
            : base(CreateDDRConnection(shardMap, shardingKey, connectionStr), 
            true /* contextOwnsConnection */)
        {
        }

        // Only static methods are allowed in calls into base class c'tors
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


As the code sample shows, a new constructor replaces the default constructor in the DbContext sub-class that you create for your Code First application. The new constructor you need to introduce instead takes the arguments that are required for data dependent routing through Elastic Scale: the shard map to access the DDR interfaces, the sharding key to identify the shardlet, plus a connection string with the credentials for the DDR connection to the shard. Now note the call to the base class constructor that first takes a detour into a static method that performs all the steps necessary for DDR. In particular, it uses the OpenConnectionForKey call of the Elastic Scale interfaces on the shard map provided in order to establish an open connection. The shard map creates a connection to the shard that holds the shardlet for the given sharding key. This open connection is passed back into the base class constructor of DbContext to indicate that this connection is to be used by EF instead of letting EF create a new connection automatically. This way the connection has been tagged by Elastic Scale so that it can guarantee consistency under shard map management operations.  
  
With the new constructor for your DbContext sub-class in place, you can now use it instead of the default constructor in your code. Here is an example: 

    // Create and save a new Blog  

    Console.Write("Enter a name for a new Blog: "); 
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

With the code change shown in the example, the new constructor now opens the connection to the shard that holds the data for the shardlet identified by the value of m_tenantid1. The code in the using block then stays unchanged to access the DbSet for Blogs using EF on the shard for m_tenantid1. This changes semantics for the code in the using block such that all database operations are now scoped to the one shard where m_tenantid1 is kept. For instance, a LINQ query over the Blogs DbSet would only return blogs stored on the current shard, but not the ones stored on other shards.  

Another important consideration is how to protect the application and its database connections against transient faults at the data tier. The Microsoft Patterns & Practices team has published the Transient Fault Handling Libraries for that purpose – which in turn have found widespread adoption among cloud application developers. We can also adopt it for the use of Elastic Scale win combination with EF. However, we need to make sure that any transient exception brings us back to a place where we can again ensure that our new constructor is being used to establish the new connection for a retry after a transient fault. Otherwise, we would not be guaranteed to get a connection to the correct shard and we would not be sure that the connection is maintained as changes to the shard map are happening. The following code sample illustrates how a SQL retry policy can be used around the new DbContext subclass constructors: 

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

SqlDatabaseUtils.SqlRetryPolicy in the code sample above is defined as a SqlDatabaseTransientErrorDetectionStrategy with a retry count of 10 and 5 seconds wait time 

between retries. Note how the approach chosen here matches the guidance for EF and user initiated transactions (see http://msdn.microsoft.com/en-us/data/dn307226): Both situations require that the application program can control the scope to which the transient exception returns to either re-open the transaction, or – as in our case – re-create the context from the proper constructor.  

The code examples illustrate the default constructor re-writes required for your application in order to use Elastic Scale data dependent routing and Entity Framework in combination. The following table now generalizes this approach to other constructors5. 


Current Constructor  | Rewritten Constructor for DDR | Base Constructor | Notes
---------- | ----------- | ------------|----------
MyContext() |ElasticScaleContext(ShardMap, TKey) |DbContext(DbConnection, bool) |The connection needs to be a function of the shard map and the DDR key. You need to by-pass automatic connection creation by EF and instead use the shard map to broker the connection. 
MyContext(string)|ElasticScaleContext(ShardMap, TKey) |DbContext(DbConnection, bool) |The connection is a function of the shard map and the DDR key. A fixed database name or connection string will not work as they by-pass validation by the shard map. 
MyContext(DbCompiledModel) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel) |DbContext(DbConnection, DbCompiledModel, bool) |The connection will get created for the given shard map and sharding key with the model provided. The compiled model will be passed on to the base c’tor.
MyContext(DbConnection, bool) |ElasticScaleContext(ShardMap, TKey, bool) |DbContext(DbConnection, bool) |The connection needs to be inferred from the shard map and the key. It cannot be provided as an input (unless that input was already using the shard map and the key). The Boolean will be passed on. 
MyContext(string, DbCompiledModel) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel) |DbContext(DbConnection, DbCompiledModel, bool) |The connection needs to be inferred from the shard map and the key. It cannot be provided as an input (unless that input was using the shard map and the key). The compiled model will be passed on. 
MyContext(ObjectContext, bool) |ElasticScaleContext(ShardMap, TKey, ObjectContext, bool) |DbContext(ObjectContext, bool) |The new constructor needs to ensure that any connection in the ObjectContext passed as an input is re-routed to a connection managed by Elastic Scale. A detailed discussion of ObjectContexts is beyond the scope of this document.
MyContext(DbConnection, DbCompiledModel,bool) |ElasticScaleContext(ShardMap, TKey, DbCompiledModel, bool)| DbContext(DbConnection, DbCompiledModel, bool); |The connection needs to be inferred from the shard map and the key. The connection cannot be provided as an input (unless that input was already using the shard map and the key). Model and Boolean are passed on to the base class constructor. 

###Shard Schema Deployment through EF Migrations 

Automatic schema management is a convenience provided by the Entity Framework. We would like to rely on this compelling capability to automatically provision the schema to newly created shards when databases are added to the scaled-out, sharded application. The primary use case for this is to increase capacity at the data tier for the application. Relying on EF’s capabilities for schema management will help reduce the database administration effort with a sharded application built on EF. 

Based on our observations, schema deployment through EF migrations works best on un-opened connections. This is in contrast to the scenario for data dependent routing where we had to rely on the opened connection provided by Elastic Scale. Another difference is the consistency requirement: While we want to ensure consistency for all DDR connections to protect us against concurrent shard map manipulation, this is not a concern with initial schema deployment to a new database that has not yet been registered in the shard map and not yet been allocated to hold shardlets. We can therefore rely on regular database connections for this scenarios, as opposed to DDR.  

This leads us to an approach where schema deployment through EF migrations is tightly coupled with the registration of the new database as a shard in the application’s shard map. This allows us to rely on the following properties: 

* The database has already been created. 
* The database is empty – it holds no user schema and no user data.
* The database cannot yet be accessed through the Elastic Scale APIs for DDR. 

With these properties, we can create a regular un-opened **SqlConnection** to kick off EF migrations for schema deployment. The following code sample illustrates this approach. 

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
            // After this step, DDR on the shard map can be used 

            this.ShardMap.CreatePointMapping(key, shard); 
        } 
 

This sample shows the method **RegisterNewShard** that registers the shard in the Elastic Scale shard map, deploys the schema through EF migrations, and stores a mapping of a sharding key to the shard. It relies on a constructor of the **DbContext** sub-class (**ElasticScaleContext** in the sample) that takes a SQL connection string as input. The code of this constructor is straight-forward, as the following example shows: 


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
 
We could have used the version inherited from the base class. But, we do want to make sure that the default initializer for EF is used when we connect. Hence the short detour into the static method before calling into the base class constructor with the connection string. Note that the registration of shards should run in a different app domain or process to ensure that the initializer settings for EF do not conflict. 


##Limitations 

The approaches outlined in this document entail a couple of limitations: 

* EF applications that use **LocalDb** first need to migrate to a regular SQL Server database before using Elastic Scale. Scaling out an application through sharding with Elastic Scale is not possible with **LocalDb**. 

* Any changes to the application that imply database schema changes need to go through EF migrations on all shards. The sample code for this document does not demonstrate how to do this. But, it is an extension of the registration of new shards.  

* Given a request, we assumed that all its database processing is contained within a single shard as identified by the sharding key provided by the request. However, this assumption does not always hold, e.g., when it is not possible to make a sharding key available. To address this, the Elastic Scale libraries provide the **MultiShardQuery** class that implements a connection abstraction for querying over several shards. How to use **MultiShardQuery** in combination with EF is beyond the scope of this document



##Conclusions 

Entity Framework applications can easily benefit from Azure Database Elastic Scale. Through the steps outlined in this document, EF applications can use Elastic Scale’s capability for data dependent routing by refactoring constructors of the DbContext sub-classes used in the EF application. This limits the application changes required to those places where DbContexts already exist. In addition, EF applications can continue to benefit from automatic schema deployment by combining the steps that invoke the necessary EF migrations with the registration of new shards and their respective mappings in the Elastic Scale shard map. 


<!--Image references-->
[1]: ./media/sql-database-elastic-scale-using-entity-framework/sample.png
