<properties 
	pageTitle="Multi-tenant applications with elastic database tools and row-level security" 
	description="Learn how to use elastic database tools together with row-level security to build an application with a highly scalable data tier on Azure SQL Database that supports multi-tenant shards." 
	metaKeywords="azure sql database elastic tools multi tenant row level security rls" 
	services="sql-database" 
    documentationCenter=""  
	manager="jhubbard" 
	authors="tmullaney"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/27/2016" 
	ms.author="thmullan;torsteng" />

# Multi-tenant applications with elastic database tools and row-level security 

[Elastic database tools](sql-database-elastic-scale-get-started.md) and [row-level security (RLS)](https://msdn.microsoft.com/library/dn765131) offer a powerful set of capabilities for flexibly and efficiently scaling the data tier of a multi-tenant application with Azure SQL Database. See [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md) for more information. 

This article illustrates how to use these technologies together to build an application with a highly scalable data tier that supports multi-tenant shards, using **ADO.NET SqlClient** and/or **Entity Framework**.  

* **Elastic database tools** enables developers to scale out the data tier of an application via industry-standard sharding practices using a set of .NET libraries and Azure service templates. Managing shards with using the Elastic Database Client Library helps automate and streamline many of the infrastructural tasks typically associated with sharding. 

* **Row-level security** enables developers to store data for multiple tenants in the same database using security policies to filter out rows that do not belong to the tenant executing a query. Centralizing access logic with RLS inside the database, rather than in the application, simplifies maintenance and reduces the risk of error as an application’s codebase grows. RLS requires the latest [Azure SQL Database update (V12)](sql-database-v12-whats-new.md). 

Using these features together, an application can benefit from cost savings and efficiency gains by storing data for multiple tenants in the same shard database. At the same time, an application still has the flexibility to offer isolated, single-tenant shards for “premium” tenants who require stricter performance guarantees since multi-tenant shards do not guarantee equal resource distribution among tenants.  

In short, the elastic database client library’s [data dependent routing](sql-database-elastic-scale-data-dependent-routing.md) APIs automatically connect tenants to the correct shard database containing their sharding key (generally a “TenantId”). Once connected, an RLS security policy within the database ensures that tenants can only access rows that contain their TenantId. It is assumed that all tables contain a TenantId column to indicate which rows belong to each tenant. 

![Blogging app architecture][1]

## Download the sample project

### Prerequisites
* Use Visual Studio (2012 or higher) 
* Create three Azure SQL Databases 
* Download sample project: [Elastic DB Tools for Azure SQL - Multi-Tenant Shards](http://go.microsoft.com/?linkid=9888163)
  * Fill in the information for your databases at the beginning of **Program.cs** 

This project extends the one described in [Elastic DB Tools for Azure SQL - Entity Framework Integration](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) by adding support for multi-tenant shard databases. It builds a simple console application for creating blogs and posts, with four tenants and two multi-tenant shard databases as illustrated in the above diagram. 

Build and run the application. This will bootstrap the elastic database tools’ shard map manager and run the following tests: 

1. Using Entity Framework and LINQ, create a new blog and then display all blogs for each tenant
2. Using ADO.NET SqlClient, display all blogs for a tenant
3. Try to insert a blog for the wrong tenant to verify that an error is thrown  

Notice that because RLS has not yet been enabled in the shard databases, each of these tests reveals a problem: tenants are able to see blogs that do not belong to them, and the application is not prevented from inserting a blog for the wrong tenant. The remainder of this article describes how to resolve these problems by enforcing tenant isolation with RLS. There are two steps: 

1. **Application tier**: Modify the application code to always set the current TenantId in the SESSION_CONTEXT after opening a connection. The sample project has already done this. 
2. **Data tier**: Create an RLS security policy in each shard database to filter rows based on the TenantId stored in SESSION_CONTEXT. You will need to do this for each of your shard databases, otherwise rows in multi-tenant shards will not be filtered. 


## Step 1) Application tier: Set TenantId in the SESSION_CONTEXT

After connecting to a shard database using the elastic database client library’s data dependent routing APIs, the application still needs to tell the database which TenantId is using that connection so that an RLS security policy can filter out rows belonging to other tenants. The recommended way to pass this information is to store the current TenantId for that connection in the [SESSION_CONTEXT](https://msdn.microsoft.com/library/mt590806.aspx). (Note: You could alternatively use [CONTEXT_INFO](https://msdn.microsoft.com/library/ms180125.aspx), but SESSION_CONTEXT is a better option because it is easier to use, returns NULL by default, and supports key-value pairs.)

### Entity Framework

For applications using Entity Framework, the easiest approach is to set the SESSION_CONTEXT within the ElasticScaleContext override described in [Data Dependent Routing using EF DbContext](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md#data-dependent-routing-using-ef-dbcontext). Before returning the connection brokered through data dependent routing, simply create and execute a SqlCommand that sets 'TenantId' in the SESSION_CONTEXT to the shardingKey specified for that connection. This way, you only need to write code once to set the SESSION_CONTEXT. 

```
// ElasticScaleContext.cs 
// ... 
// C'tor for data dependent routing. This call will open a validated connection routed to the proper 
// shard by the shard map manager. Note that the base class c'tor call will fail for an open connection 
// if migrations need to be done and SQL credentials are used. This is the reason for the  
// separation of c'tors into the DDR case (this c'tor) and the internal c'tor for new shards. 
public ElasticScaleContext(ShardMap shardMap, T shardingKey, string connectionStr)
    : base(OpenDDRConnection(shardMap, shardingKey, connectionStr), true /* contextOwnsConnection */)
{
}

public static SqlConnection OpenDDRConnection(ShardMap shardMap, T shardingKey, string connectionStr)
{
    // No initialization
    Database.SetInitializer<ElasticScaleContext<T>>(null);

    // Ask shard map to broker a validated connection for the given key
    SqlConnection conn = null;
    try
    {
        conn = shardMap.OpenConnectionForKey(shardingKey, connectionStr, ConnectionOptions.Validate);

        // Set TenantId in SESSION_CONTEXT to shardingKey to enable Row-Level Security filtering
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText = @"exec sp_set_session_context @key=N'TenantId', @value=@shardingKey";
        cmd.Parameters.AddWithValue("@shardingKey", shardingKey);
        cmd.ExecuteNonQuery();

        return conn;
    }
    catch (Exception)
    {
        if (conn != null)
        {
            conn.Dispose();
        }

        throw;
    }
} 
// ... 
```

Now the SESSION_CONTEXT is automatically set with the specified TenantId whenever ElasticScaleContext is invoked: 

```
// Program.cs 
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
{   
	using (var db = new ElasticScaleContext<int>(sharding.ShardMap, tenantId, connStrBldr.ConnectionString))   
	{     
		var query = from b in db.Blogs
	                orderby b.Name
	                select b;
		
		Console.WriteLine("All blogs for TenantId {0}:", tenantId);     
		foreach (var item in query)     
		{       
			Console.WriteLine(item.Name);     
		}   
	} 
}); 
```

### ADO.NET SqlClient 

For applications using ADO.NET SqlClient, the recommended approach is to create a wrapper function around ShardMap.OpenConnectionForKey() that automatically sets 'TenantId' in the SESSION_CONTEXT to the correct TenantId before returning a connection. To ensure that SESSION_CONTEXT is always set, you should only open connections using this wrapper function.

```
// Program.cs
// ...

// Wrapper function for ShardMap.OpenConnectionForKey() that automatically sets SESSION_CONTEXT with the correct
// tenantId before returning a connection. As a best practice, you should only open connections using this 
// method to ensure that SESSION_CONTEXT is always set before executing a query.
public static SqlConnection OpenConnectionForTenant(ShardMap shardMap, int tenantId, string connectionStr)
{
    SqlConnection conn = null;
    try
    {
        // Ask shard map to broker a validated connection for the given key
        conn = shardMap.OpenConnectionForKey(tenantId, connectionStr, ConnectionOptions.Validate);

        // Set TenantId in SESSION_CONTEXT to shardingKey to enable Row-Level Security filtering
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText = @"exec sp_set_session_context @key=N'TenantId', @value=@shardingKey";
        cmd.Parameters.AddWithValue("@shardingKey", tenantId);
        cmd.ExecuteNonQuery();

        return conn;
    }
    catch (Exception)
    {
        if (conn != null)
        {
            conn.Dispose();
        }

        throw;
    }
}

// ...

// Example query via ADO.NET SqlClient
// If row-level security is enabled, only Tenant 4's blogs will be listed
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() =>
{
    using (SqlConnection conn = OpenConnectionForTenant(sharding.ShardMap, tenantId4, connStrBldr.ConnectionString))
    {
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText = @"SELECT * FROM Blogs";

        Console.WriteLine("--\nAll blogs for TenantId {0} (using ADO.NET SqlClient):", tenantId4);
        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine("{0}", reader["Name"]);
        }
    }
});

```

## Step 2) Data tier: Create row-level security policy

### Create a security policy to filter the rows each tenant can access

Now that the application is setting SESSION_CONTEXT with the current TenantId before querying, an RLS security policy can filter queries and exclude rows that have a different TenantId.  

RLS is implemented in T-SQL: a user-defined function defines the access logic, and a security policy binds this function to any number of tables. For this project, the function will simply verify that the application (rather than some other SQL user) is connected to the database, and that the 'TenantId' stored in the SESSION_CONTEXT matches the TenantId of a given row. A filter predicate will allow rows that meet these conditions to pass through the filter for SELECT, UPDATE, and DELETE queries; and a block predicate will prevent rows that violate these conditions from being INSERTed or UPDATEd. If SESSION_CONTEXT has not been set, it will return NULL and no rows will be visible or able to be inserted. 

To enable RLS, execute the following T-SQL on all shards using either Visual Studio (SSDT), SSMS, or the PowerShell script included in the project (or if you are using [Elastic Database Jobs](sql-database-elastic-jobs-overview.md), you can use it to automate execution of this T-SQL on all shards): 

```
CREATE SCHEMA rls -- separate schema to organize RLS objects 
GO

CREATE FUNCTION rls.fn_tenantAccessPredicate(@TenantId int)     
	RETURNS TABLE     
	WITH SCHEMABINDING
AS
	RETURN SELECT 1 AS fn_accessResult          
		WHERE DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('dbo') -- the user in your application’s connection string (dbo is only for demo purposes!)         
		AND CAST(SESSION_CONTEXT(N'TenantId') AS int) = @TenantId
GO

CREATE SECURITY POLICY rls.tenantAccessPolicy
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Blogs,
	ADD BLOCK PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Blogs,
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Posts,
	ADD BLOCK PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Posts
GO 
```

> [AZURE.TIP] For more complex projects that need to add the predicate on hundreds of tables, you can use a helper stored procedure that automatically generates a security policy adding a predicate on all tables in a schema. See [Apply Row-Level Security to all tables – helper script (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/03/31/apply-row-level-security-to-all-tables-helper-script).  

Now if you run the sample application again, tenants will able to see only rows that belong to them. In addition, the application cannot insert rows that belong to tenants other than the one currently connected to the shard database, and it cannot update visible rows to have a different TenantId. If the application attempts to do either, a DbUpdateException will be raised.

If you add a new table later on, simply ALTER the security policy and add filter and block predicates on the new table: 

```
ALTER SECURITY POLICY rls.tenantAccessPolicy     
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.MyNewTable,
	ADD BLOCK PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.MyNewTable
GO 
```

### Add default constraints to automatically populate TenantId for INSERTs 

You can put a default constraint on each table to automatically populate the TenantId with the value currently stored in SESSION_CONTEXT when inserting rows. For example: 

```
-- Create default constraints to auto-populate TenantId with the value of SESSION_CONTEXT for inserts 
ALTER TABLE Blogs     
	ADD CONSTRAINT df_TenantId_Blogs      
	DEFAULT CAST(SESSION_CONTEXT(N'TenantId') AS int) FOR TenantId 
GO

ALTER TABLE Posts     
	ADD CONSTRAINT df_TenantId_Posts      
	DEFAULT CAST(SESSION_CONTEXT(N'TenantId') AS int) FOR TenantId 
GO 
```

Now the application does not need to specify a TenantId when inserting rows: 

```
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
{   
	using (var db = new ElasticScaleContext<int>(sharding.ShardMap, tenantId, connStrBldr.ConnectionString))
	{
		var blog = new Blog { Name = name }; // default constraint sets TenantId automatically     
		db.Blogs.Add(blog);     
		db.SaveChanges();   
	} 
}); 
```

> [AZURE.NOTE] If you use default constraints for an Entity Framework project, it is recommended that you do NOT include the TenantId column in your EF data model. This is because Entity Framework queries automatically supply default values which will override the default constraints created in T-SQL that use SESSION_CONTEXT. To use default constraints in the sample project, for instance, you should remove TenantId from DataClasses.cs (and run Add-Migration in the Package Manager Console) and use T-SQL to ensure that the field only exists in the database tables. This way, EF will not automatically supply incorrect default values when inserting data. 

### (Optional) Enable a "superuser" to access all rows
Some applications may want to create a "superuser" who can access all rows, for instance, in order to enable reporting across all tenants on all shards, or to perform Split/Merge operations on shards that involve moving tenant rows between databases. To enable this, you should create a new SQL user ("superuser" in this example) in each shard database. Then alter the security policy with a new predicate function that allows this user to access all rows:

```
-- New predicate function that adds superuser logic
CREATE FUNCTION rls.fn_tenantAccessPredicateWithSuperUser(@TenantId int)
    RETURNS TABLE
    WITH SCHEMABINDING
AS
    RETURN SELECT 1 AS fn_accessResult 
        WHERE 
        (
            DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('dbo') -- note, should not be dbo!
            AND CAST(SESSION_CONTEXT(N'TenantId') AS int) = @TenantId
        ) 
        OR
        (
            DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('superuser')
        )
GO

-- Atomically swap in the new predicate function on each table
ALTER SECURITY POLICY rls.tenantAccessPolicy
    ALTER FILTER PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Blogs,
    ALTER BLOCK PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Blogs,
    ALTER FILTER PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Posts,
    ALTER BLOCK PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Posts
GO
```


### Maintenance 

* **Adding new shards**: You must execute the T-SQL script to enable RLS on any new shards, otherwise queries on these shards will not be filtered.

* **Adding new tables**: You must add a filter and block predicate to the security policy on all shards whenever a new table is created, otherwise queries on the new table will not be filtered. This can be automated using a DDL trigger, as described in [Apply Row-Level Security automatically to newly created tables (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/05/22/apply-row-level-security-automatically-to-newly-created-tables.aspx).


## Summary 

Elastic database tools and row-level security can be used together to scale out an application’s data tier with support for both multi-tenant and single-tenant shards. Multi-tenant shards can be used to store data more efficiently (particularly in cases where a large number of tenants have only a few rows of data), while single-tenant shards can be used to support premium tenants with stricter performance and isolation requirements.  For more information, see [Row-Level Security reference](https://msdn.microsoft.com/library/dn765131). 

## Additional resources

- [What is an Azure elastic database pool?](sql-database-elastic-pool.md)
- [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md)
- [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md)
- [Authentication in multitenant apps, using Azure AD and OpenID Connect](../guidance/guidance-multitenant-identity-authenticate.md)
- [Tailspin Surveys application](../guidance/guidance-multitenant-identity-tailspin.md)

## Questions and Feature Requests

For questions, please reach out to us on the [SQL Database forum](http://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted) and for feature requests, please add them to the [SQL Database feedback forum](https://feedback.azure.com/forums/217321-sql-database/).


<!--Image references-->
[1]: ./media/sql-database-elastic-tools-multi-tenant-row-level-security/blogging-app.png
<!--anchors-->

 
