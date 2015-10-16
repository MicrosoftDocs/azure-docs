<properties 
	pageTitle="Data dependent routing" 
	description="How to use the ShardMapManager for data-dependent routing, a feature of elastic databases for Azure SQL DB" 
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

#Data dependent routing

The **ShardMapManager** class provides ADO.NET applications the ability to easily direct database queries and commands to the appropriate physical database in a sharded environment. This is called **data-dependent routing** and it is a fundamental pattern when working with sharded databases. Each specific query or transaction in an application using data-dependent routing is restricted to accessing a single database per request.  

Using data-dependent routing, there is no need for the application to track the various connection strings or DB locations associated with different slices of data in the sharded environment. Rather, the [Shard Map Manager](sql-database-elastic-scale-shard-map-management.md) takes responsibility for handing out open connections to the correct database when needed, based on the data in the shard map and the value of the sharding key that is the target of the application’s request. (This key is typically the *customer_id*, *tenant_id*, *date_key*, or some other specific identifier that is a fundamental parameter of the database request). 

## Using a ShardMapManager in a data dependent routing application 

For applications using data-dependent routing, a **ShardMapManager** should be instantiated once per app domain, during initialization, using the factory call **GetSQLShardMapManager**.

    ShardMapManager smm = ShardMapManagerFactory.GetSqlShardMapManager(smmConnnectionString, 
                      ShardMapManagerLoadPolicy.Lazy);
    RangeShardMap<int> customerShardMap = smm.GetRangeShardMap<int>("customerMap"); 

In this example, both a **ShardMapManager** and a specific **ShardMap** that it contains are initialized. 

For an application that is not manipulating the shard map itself, the credentials used in the factory method to get the **ShardMapManager** (in the above example, *smmConnectionString*) should be credentials that have just read-only permissions on the **Global Shard Map** database referenced by the connection string. These credentials are typically different from credentials used to open connections to the shard map manager. See also [Using credentials in the elastic database client libraries](sql-database-elastic-scale-manage-credentials.md). 

## Invoking data dependent routing 

The method **ShardMap.OpenConnectionForKey(key, connectionString, connectionOptions)** returns an ADO.Net connection ready for issuing commands to the appropriate database based on the value of the **key** parameter. Shard information is cached in the application by the **ShardMapManager**, so these requests do not typically involve a database lookup against the **Global Shard Map** database. 

* The **key** parameter is used as a lookup key into the shard map to determine the appropriate database for the request. 

* The **connectionString** is used to pass only the user credentials for the desired connection. No database name or server name are included in this *connectionString* since the method will determine the database and server using the **ShardMap**. 

* The **connectionOptions** enum is used to indicate whether validation occurs or not when delivering the open connection. **ConnectionOptions.Validate** is recommended. In an environment where shard maps may be changing and rows may be moving to other databases as a result of split or merge operations, validation ensures that the cached lookup of the database based on a key value is still correct. Validation involves a brief query to the local shard map on the target database (not to the global shard map) before the connection is delivered to the application. 

If the validation against the local shard map fails (indicating that the cache is incorrect), the Shard Map Manager will query the global shard map to obtain the new correct value for the lookup, update the cache, and obtain and return the appropriate database connection. 

The only time that **ConnectionOptions.None** (do not validate) is acceptable occurs when shard mapping changes are not expected while an application is online. In that case, the cached values can be assumed to always be correct, and the extra round-trip validation call to the target database can be safely skipped. That may reduce transaction latencies and database traffic. The **connectionOptions** may also be set via a value in a configuration file to indicate whether sharding changes are expected or not during a period of time.  

This is an example of code that uses the Shard Map Manager to perform data-dependent routing based on the value of an integer key **CustomerID**, using a **ShardMap** object named **customerShardMap**.  

## Example: data dependent routing 

    int customerId = 12345; 
    int newPersonId = 4321; 

    // Connection to the shard for that customer ID
    using (SqlConnection conn = customerShardMap.OpenConnectionForKey(customerId, 
        Configuration.GetCredentialsConnectionString(), ConnectionOptions.Validate)) 
    { 
        // Execute a simple command 
        SqlCommand cmd = conn.CreateCommand(); 
        cmd.CommandText = @"UPDATE Sales.Customer 
                            SET PersonID = @newPersonID 
                            WHERE CustomerID = @customerID"; 

        cmd.Parameters.AddWithValue("@customerID", customerId); 
        cmd.Parameters.AddWithValue("@newPersonID", newPersonId); 
        cmd.ExecuteNonQuery(); 
    }  

Notice that rather than using a constructor for a **SqlConnection**, followed by an **Open()** call to the connection object, the **OpenConnectionForKey** method is used, and it delivers a new already-open connection to the correct database. Connections utilized in this way still take full advantage of ADO.Net connection pooling. As long as transactions and requests can be satisfied by one shard at a time, this should be the only modification necessary in an application already using ADO.Net. 

The method **OpenConnectionForKeyAsync** is also available if your application makes use asynchronous programming with ADO.Net.  Its behavior is the data-dependent routing equivalent of ADO.Net's **Connection.OpenAsync** method.

## Integrating with transient fault handling 

A best practice in developing data access applications in the cloud is to ensure that transient faults in connecting to or querying the database are caught by the app, and that the operations are retried several times before throwing an error. Transient fault handling for cloud applications is discussed at [Transient Fault Handling](http://msdn.microsoft.com/en-us/library/dn440719\(v=pandp.60\).aspx). 
 
Transient fault handling can coexist naturally with the Data Dependent Routing pattern. The key requirement is to retry the entire data access request including the **using** block that obtained the data-dependent routing connection. The example above could be rewritten as follows (note highlighted change). 

### Example – data dependent routing with transient fault handling 

<pre><code>int customerId = 12345; 
int newPersonId = 4321; 

<span style="background-color:  #FFFF00">Configuration.SqlRetryPolicy.ExecuteAction(() =&gt; </span> 
<span style="background-color:  #FFFF00">    { </span>
        // Connection to the shard for that customer ID 
        using (SqlConnection conn = customerShardMap.OpenConnectionForKey(customerId,  
        Configuration.GetCredentialsConnectionString(), ConnectionOptions.Validate)) 
        { 
            // Execute a simple command 
            SqlCommand cmd = conn.CreateCommand(); 

            cmd.CommandText = @&quot;UPDATE Sales.Customer 
                            SET PersonID = @newPersonID 
                            WHERE CustomerID = @customerID&quot;; 

            cmd.Parameters.AddWithValue(&quot;@customerID&quot;, customerId); 
            cmd.Parameters.AddWithValue(&quot;@newPersonID&quot;, newPersonId); 
            cmd.ExecuteNonQuery(); 

            Console.WriteLine(&quot;Update completed&quot;); 
        } 
<span style="background-color:  #FFFF00">    }); </span> 
</code></pre>


Packages necessary to implement transient fault handling are downloaded automatically when you build the elastic database sample application. Packages are also available separately at [Enterprise Library - Transient Fault Handling Application Block](http://www.nuget.org/packages/EnterpriseLibrary.TransientFaultHandling/). Use version 6.0 or later. 

## Transactional consistency 

Transactional properties are guaranteed for all operations local to a shard. For example, transactions submitted through data-dependent routing execute within the scope of the target shard for the connection. At this time, there are no capabilities provided for enlisting multiple connections into a transaction, and therefore there are no transactional guarantees for operations performed across shards.  

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]
 