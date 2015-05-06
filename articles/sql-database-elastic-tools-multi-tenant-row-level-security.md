<properties 
	title="Multi-tenant applications with elastic database tools and row-level security" 
	pageTitle="Multi-tenant applications with elastic database tools and row-level security" 
	description="Learn how to use elastic database tools together with row-level security to build an application with a highly scalable data tier on Azure SQL Database that supports multi-tenant shards." 
	metaKeywords="azure sql database elastic tools multi tenant row level security rls" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="tmullaney"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="thmullan;torsteng;sidneyh" />

# Multi-tenant applications with elastic database tools and row-level security 

[Elastic database tools](sql-database-elastic-scale-get-started.md) and [row-level security (RLS)](https://msdn.microsoft.com/library/dn765131) offer a powerful set of capabilities for flexibly and efficiently scaling the data tier of a multi-tenant application with Azure SQL Database. This article illustrates how to use these technologies together to build an application with a highly scalable data tier that supports multi-tenant shards, using **ADO.NET SqlClient** and/or **Entity Framework**. 

* **Elastic database tools** enables developers to scale out the data tier of an application via industry-standard sharding practices using a set of .NET libraries and Azure service templates. Managing shards with using the Elastic Database Client Library helps automate and streamline many of the infrastructural tasks typically associated with sharding. 

* **Row-level security (preview)** enables developers to store data for multiple tenants in the same database using security policies to filter out rows that do not belong to the tenant executing a query. Centralizing access logic with RLS inside the database, rather than in the application, simplifies maintenance and reduces the risk of error as an application’s codebase grows. RLS requires the latest [Azure SQL Database update (V12)](sql-database-preview-whats-new.md). 

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

1. **Application tier**: Modify the application code to set CONTEXT_INFO to the current TenantId after opening a connection. The sample project has already done this. 
2. **Data tier**: Create an RLS security policy in each shard database to filter rows based on the value of CONTEXT_INFO. You will need to do this for each of your shard databases, otherwise rows in multi-tenant shards will not be filtered. 


## Step 1) Application tier: Set CONTEXT_INFO to TenantId

After connecting to a shard database using the elastic database client library’s data dependent routing APIs, the application still needs to tell the database which TenantId is using that connection so that an RLS security policy can filter out rows belonging to other tenants. The recommended way to pass this information is to set [CONTEXT_INFO](https://msdn.microsoft.com/library/ms180125) to the current TenantId for that connection. 

### Entity Framework

For applications using Entity Framework, the easiest approach is to set CONTEXT_INFO within the ElasticScaleContext override described in [Data Dependent Routing using EF DbContext](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md/#data-dependent-routing-using-ef-dbcontext). Before returning the connection brokered through data dependent routing, simply create and execute a SqlCommand that sets CONTEXT_INFO to the shardingKey (TenantId) specified for that connection. This way, you only need to write code once to set CONTEXT_INFO. 

```
// ElasticScaleContext.cs 
// ... 
// C'tor for data dependent routing. This call will open a validated connection routed to the proper 
// shard by the shard map manager. Note that the base class c'tor call will fail for an open connection 
// if migrations need to be done and SQL credentials are used. This is the reason for the  
// separation of c'tors into the DDR case (this c'tor) and the internal c'tor for new shards. 
public ElasticScaleContext(ShardMap shardMap, T shardingKey, string connectionStr)
	: base(CreateDDRConnection(shardMap, shardingKey, connectionStr), true /* contextOwnsConnection */) 
{
} 

// Only static methods are allowed in calls into base class c'tors  
private static DbConnection CreateDDRConnection(ShardMap shardMap, T shardingKey, string connectionStr)  
{  
	// No initialization  
	Database.SetInitializer<ElasticScaleContext<T>>(null);    
	
	// Ask shard map to broker a validated connection for the given key    
	SqlConnection conn = shardMap.OpenConnectionForKey<T>(shardingKey, connectionStr, ConnectionOptions.Validate);
	
	// Set CONTEXT_INFO to shardingKey to enable RLS filtering   
	SqlCommand cmd = conn.CreateCommand();   
	cmd.CommandText = @"SET CONTEXT_INFO @shardingKey";   
	cmd.Parameters.AddWithValue("@shardingKey", shardingKey);   
	cmd.ExecuteNonQuery();  
	
	return conn;  
} 
// ... 
```

Now CONTEXT_INFO is automatically set to the specified TenantId whenever ElasticScaleContext is invoked: 

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

For applications using ADO.NET SqlClient, the easiest way to set CONTEXT_INFO is to prepend “SET CONTEXT_INFO @TenantId;” to every query. This approach has the added benefit of avoiding an extra round-trip query to set CONTEXT_INFO each time a new connection is opened.  

Note that CONTEXT_INFO is connection-scoped, so it only needs to be set once if you execute multiple queries on the same connection. 

```
// Program.cs 
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
{   
	using (SqlConnection conn = sharding.ShardMap.OpenConnectionForKey(tenantId4, connStrBldr.ConnectionString))   
	{     
		// Must explicitly set CONTEXT_INFO to the TenantId because the override in ElasticScaleContext.cs is not used     
		SqlCommand cmd = conn.CreateCommand();     
		cmd.CommandText = @"SET CONTEXT_INFO @TenantId;                         
							SELECT * FROM Blogs";     
		cmd.Parameters.AddWithValue("@TenantId", tenantId4); 
		
		Console.WriteLine("ADO.NET SqlClient: All blogs for TenantId {0}:", tenantId4);
		SqlDataReader reader = cmd.ExecuteReader();     
		while (reader.Read())     
		{       
			Console.WriteLine(String.Format("{0}", reader[1]));     
		}   
	} 
});
```

## Step 2) Data tier: Create row-level security policy and constraints 

### Create a security policy to filter SELECT, UPDATE, and DELETE queries 

Now that the application is setting CONTEXT_INFO to the current TenantId before querying, an RLS security policy can filter queries and exclude rows that have a different TenantId.  

RLS is implemented in T-SQL: a user-defined predicate function defines the filtering logic, and a security policy binds this function to any number of tables. For this project, the predicate function will simply verify that the application (rather than some other SQL user) is connected to the database, and that the value of CONTEXT_INFO matches the TenantId of a given row. Rows that meet these conditions will be allowed through the filter for SELECT, UPDATE, and DELETE queries. If CONTEXT_INFO has not been set, no rows will be returned. 

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
		AND CONVERT(int, CONVERT(varbinary(4), CONTEXT_INFO())) = @TenantId -- @TenantId (int) is 4 bytes 
GO

CREATE SECURITY POLICY rls.tenantAccessPolicy
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Blogs,
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Posts
GO 
```

> [AZURE.TIP] For more complex projects that need to add the predicate function on hundreds of tables, you can use a helper stored procedure that automatically generates a security policy adding a predicate on all tables in a schema. See [Apply Row-Level Security to all tables – helper script (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/03/31/apply-row-level-security-to-all-tables-helper-script).  

If you add a new table later on, simply ALTER the security policy and add a filter predicate on the new table: 

```
ALTER SECURITY POLICY rls.tenantAccessPolicy     
	ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.MyNewTable 
GO 
```

Now if you run the sample application again, tenants will not be able to see rows that do not belong to them. 

### Add check constraints to block wrong-tenant INSERTs and UPDATEs

At present, RLS security policies will not prevent the application from accidentally inserting rows for the wrong TenantId, or updating the TenantId of a visible row to be a new value. For some applications, such as read-only reporting apps, this is not a problem. However, since this application allows tenants to insert new blogs, it is worthwhile to create an additional safeguard that throws an error if the application code mistakenly tries to insert or update rows such that violate the filter predicate.  As described in [Row-Level Security: Blocking unauthorized INSERTs (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/03/23/row-level-security-blocking-unauthorized-inserts), the recommended solution is to create a check constraint on each table to enforce the same RLS filter predicate for insert and update operations. 

To add check constraints, execute the following T-SQL on all shards, using SSMS, SSDT, or the included PowerShell script (or Elastic Database Jobs) as described above: 

```
-- Create a scalar version of the predicate function for use in check constraints 
CREATE FUNCTION rls.fn_tenantAccessPredicateScalar(@TenantId int)     
	RETURNS bit 
AS     
	BEGIN     
		IF EXISTS( SELECT 1 FROM rls.fn_tenantAccessPredicate(@TenantId) )         
			RETURN 1     
		RETURN 0 
	END 
GO 

-- Add the function as a check constraint on all sharded tables 
ALTER TABLE Blogs     
	WITH NOCHECK -- don't check data already in table     
	ADD CONSTRAINT chk_blocking_Blogs -- needs a unique name     
	CHECK( rls.fn_tenantAccessPredicateScalar(TenantId) = 1 ) 
GO

ALTER TABLE Posts     
	WITH NOCHECK     
	ADD CONSTRAINT chk_blocking_Posts     
	CHECK( rls.fn_tenantAccessPredicateScalar(TenantId) = 1 ) 
GO 
```

Now the application cannot insert rows that belong to tenants other than the one currently connected to the shard database. Likewise the application cannot update visible rows to have a different TenantId. If the application attempts to do either, a DbUpdateException will be raised. 


### Add default constraints to automatically populate TenantId for INSERTs 

In addition to using check constraints to block wrong-tenant inserts, you can put a default constraint on each table to automatically populate the TenantId with the current value of CONTEXT_INFO when inserting rows. For example: 

```
-- Create default constraints to auto-populate TenantId with the value of CONTEXT_INFO for inserts 
ALTER TABLE Blogs     
	ADD CONSTRAINT df_TenantId_Blogs      
	DEFAULT CONVERT(int, CONVERT(varbinary(4), CONTEXT_INFO())) FOR TenantId 
GO

ALTER TABLE Posts     
	ADD CONSTRAINT df_TenantId_Posts      
	DEFAULT CONVERT(int, CONVERT(varbinary(4), CONTEXT_INFO())) FOR TenantId 
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

> [AZURE.NOTE] If you use default constraints for an Entity Framework project, it is recommended that you do NOT include the TenantId column in your EF data model. This is because Entity Framework queries automatically supply default values that will override the default constraints created in T-SQL that use CONTEXT_INFO. To use default constraints in the sample project, for instance, you should remove TenantId from DataClasses.cs (and run Add-Migration in the Package Manager Console) and use T-SQL to ensure that the field only exists in the database tables. This way, EF will not automatically supply incorrect default values when inserting data. 

### Maintenance 

* **Adding new shards**: You must execute the T-SQL script to enable RLS (and add check constraints) on any new shards, otherwise queries on these shards will not be filtered.

* **Adding new tables**: You must execute a T-SQL script on all shards to add a filter predicate on new tables, otherwise queries on these tables will not be filtered.


## Summary 

Elastic database tools and row-level security can be used together to scale out an application’s data tier with support for both multi-tenant and single-tenant shards. Multi-tenant shards can be used to store data more efficiently (particularly in cases where a large number of tenants have only a few rows of data), while single-tenant shards can be used to support premium tenants with stricter performance and isolation requirements.  For more information, see the [Elastic Database Tools Documentation Map](sql-database-elastic-scale-documentation-map.md) or the [Row-Level Security reference](https://msdn.microsoft.com/library/dn765131) on MSDN. 


[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-tools-multi-tenant-row-level-security/blogging-app.png
<!--anchors-->

