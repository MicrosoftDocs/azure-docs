---
title: "Multi-tenant apps with RLS and elastic database tools | Microsoft Docs"
description: Use elastic database tools with row-level security to build an application with a highly scalable data tier.
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: tmullaney
ms.author: thmullan
ms.reviewer:
manager: craigg
ms.date: 04/01/2018
---
# Multi-tenant applications with elastic database tools and row-level security

[Elastic database tools](sql-database-elastic-scale-get-started.md) and [row-level security (RLS)][rls] cooperate to enable scaling the data tier of a multi-tenant application with Azure SQL Database. Together these technologies help you build an application that has a highly scalable data tier. The data tier supports multi-tenant shards, and uses **ADO.NET SqlClient** or **Entity Framework**. For more information, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](saas-tenancy-app-design-patterns.md).

- **Elastic database tools** enable developers to scale out the data tier with standard sharding practices, by using .NET libraries and Azure service templates. Managing shards by using the [Elastic Database Client Library][s-d-elastic-database-client-library] helps automate and streamline many of the infrastructural tasks typically associated with sharding.
- **Row-level security** enables developers to safely store data for multiple tenants in the same database. RLS security policies filter out rows that do not belong to the tenant executing a query. Centralizing the filter logic inside the database simplifies maintenance and reduces the risk of a security error. The alternative of relying on all client code to enfore security is risky.

By using these features together, an application can store data for multiple tenants in the same shard database. It costs less per tenant when the tenants share a database. Yet the same application can also offer its premium tenants the option of paying for their own dedicated single-tenant shard. One benefit of single-tenant isolation is firmer performance guarantees. In a single-tenant database, there is no other tenant competing for resources.

The goal is to use the elastic database client library [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md) APIs to automatically connect each given tenant to the correct shard database. Only one shard contains particular TenantId value for the given tenant. The TenantId is the *sharding key*. After the connection is established, an RLS security policy within the database ensures that the given tenant can access only those data rows that contain its TenantId.

> [!NOTE]
> The tenant identifier might consist of more than one column. For convenience is this discussion, we informally assume a single-column TenantId.

![Blogging app architecture][1]

## Download the sample project

### Prerequisites

- Use Visual Studio (2012 or higher) 
- Create three Azure SQL databases 
- Download sample project: [Elastic DB Tools for Azure SQL - Multi-Tenant Shards](http://go.microsoft.com/?linkid=9888163)
  - Fill in the information for your databases at the beginning of **Program.cs** 

This project extends the one described in [Elastic DB Tools for Azure SQL - Entity Framework Integration](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) by adding support for multi-tenant shard databases. The project builds a simple console application for creating blogs and posts. The project includes four tenants, plus two multi-tenant shard databases. This configuration is illustrated in the preceding diagram. 

Build and run the application. This run bootstraps the elastic database tools’ shard map manager, and performs the following tests: 

1. Using Entity Framework and LINQ, create a new blog and then display all blogs for each tenant
2. Using ADO.NET SqlClient, display all blogs for a tenant
3. Try to insert a blog for the wrong tenant to verify that an error is thrown  

Notice that because RLS has not yet been enabled in the shard databases, each of these tests reveals a problem: tenants are able to see blogs that do not belong to them, and the application is not prevented from inserting a blog for the wrong tenant. The remainder of this article describes how to resolve these problems by enforcing tenant isolation with RLS. There are two steps: 

1. **Application tier**: Modify the application code to always set the current TenantId in the SESSION\_CONTEXT after opening a connection. The sample project already sets the TenantId this way. 
2. **Data tier**: Create an RLS security policy in each shard database to filter rows based on the TenantId stored in SESSION\_CONTEXT. Create a policy for each of your shard databases, otherwise rows in multi-tenant shards are not be filtered. 

## 1. Application tier: Set TenantId in the SESSION\_CONTEXT

First you connect to a shard database by using the data-dependent routing APIs of the elastic database client library. The application still must tell the database which TenantId is using the connection. The TenantId tells the RLS security policy which rows must be filtered out as belonging to other tenants. Store the current TenantId in the [SESSION\_CONTEXT](https://docs.microsoft.com/sql/t-sql/functions/session-context-transact-sql) of the connection.

An alternative to SESSION\_CONTEXT is to use [CONTEXT\_INFO](https://docs.microsoft.com/sql/t-sql/functions/context-info-transact-sql). But SESSION\_CONTEXT is a better option. SESSION\_CONTEXT is easier to use, it returns NULL by default, and it supports key-value pairs.

### Entity Framework

For applications using Entity Framework, the easiest approach is to set the SESSION\_CONTEXT within the ElasticScaleContext override described in [Data-dependent routing using EF DbContext](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md#data-dependent-routing-using-ef-dbcontext). Create and execute a SqlCommand that sets TenantId in the SESSION\_CONTEXT to the shardingKey specified for the connection. Then return the connection brokered through data-dependent routing. This way, you only need to write code once to set the SESSION\_CONTEXT. 

```csharp
// ElasticScaleContext.cs 
// Constructor for data-dependent routing.
// This call opens a validated connection that is routed to the
// proper shard by the shard map manager.
// Note that the base class constructor call fails for an open connection 
// if migrations need to be done and SQL credentials are used.
// This is the reason for the separation of constructors.
// ...
public ElasticScaleContext(ShardMap shardMap, T shardingKey, string connectionStr)
    : base(
        OpenDDRConnection(shardMap, shardingKey, connectionStr),
        true)  // contextOwnsConnection
{
}

public static SqlConnection OpenDDRConnection(
    ShardMap shardMap,
    T shardingKey,
    string connectionStr)
{
    // No initialization.
    Database.SetInitializer<ElasticScaleContext<T>>(null);

    // Ask shard map to broker a validated connection for the given key.
    SqlConnection conn = null;
    try
    {
        conn = shardMap.OpenConnectionForKey(
            shardingKey,
            connectionStr,
            ConnectionOptions.Validate);

        // Set TenantId in SESSION_CONTEXT to shardingKey
        // to enable Row-Level Security filtering.
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText =
            @"exec sp_set_session_context
                @key=N'TenantId', @value=@shardingKey";
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

Now the SESSION\_CONTEXT is automatically set with the specified TenantId whenever ElasticScaleContext is invoked: 

```csharp
// Program.cs 
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
{   
    using (var db = new ElasticScaleContext<int>(
        sharding.ShardMap, tenantId, connStrBldr.ConnectionString))   
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

For applications using ADO.NET SqlClient, create a wrapper function around method ShardMap.OpenConnectionForKey. Have the wrapper automatically set TenantId in the SESSION\_CONTEXT to the current TenantId before returning a connection. To ensure that SESSION\_CONTEXT is always set, you should only open connections using this wrapper function.

```csharp
// Program.cs
// Wrapper function for ShardMap.OpenConnectionForKey() that
// automatically sets SESSION_CONTEXT with the correct
// tenantId before returning a connection.
// As a best practice, you should only open connections using this method
// to ensure that SESSION_CONTEXT is always set before executing a query.
// ...
public static SqlConnection OpenConnectionForTenant(
    ShardMap shardMap, int tenantId, string connectionStr)
{
    SqlConnection conn = null;
    try
    {
        // Ask shard map to broker a validated connection for the given key.
        conn = shardMap.OpenConnectionForKey(
            tenantId, connectionStr, ConnectionOptions.Validate);

        // Set TenantId in SESSION_CONTEXT to shardingKey
        // to enable Row-Level Security filtering.
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText =
            @"exec sp_set_session_context
                @key=N'TenantId', @value=@shardingKey";
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

// Example query via ADO.NET SqlClient.
// If row-level security is enabled, only Tenant 4's blogs are listed.
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() =>
{
    using (SqlConnection conn = OpenConnectionForTenant(
        sharding.ShardMap, tenantId4, connStrBldr.ConnectionString))
    {
        SqlCommand cmd = conn.CreateCommand();
        cmd.CommandText = @"SELECT * FROM Blogs";

        Console.WriteLine(@"--
All blogs for TenantId {0} (using ADO.NET SqlClient):", tenantId4);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine("{0}", reader["Name"]);
        }
    }
});

```

## 2. Data tier: Create row-level security policy

### Create a security policy to filter the rows each tenant can access

Now that the application is setting SESSION\_CONTEXT with the current TenantId before querying, an RLS security policy can filter queries and exclude rows that have a different TenantId.  

RLS is implemented in Transact-SQL. A user-defined function defines the access logic, and a security policy binds this function to any number of tables. For this project:

1. The function verifies that the application is connected to the database, and that the TenantId stored in the SESSION\_CONTEXT matches the TenantId of a given row.
    - The application is connected, rather than some other SQL user.

2. A FILTER predicate allows rows that meet the TenantId filter to pass through for SELECT, UPDATE, and DELETE queries.
    - A BLOCK predicate prevents rows that fail the filter from being INSERTed or UPDATEd.
    - If SESSION\_CONTEXT has not been set, the function returns NULL, and no rows are visible or able to be inserted. 

To enable RLS on all shards, execute the following T-SQL by using either Visual Studio (SSDT), SSMS, or the PowerShell script included in the project. Or if you are using [Elastic Database Jobs](sql-database-elastic-jobs-overview.md), you can automate execution of this T-SQL on all shards.

```sql
CREATE SCHEMA rls; -- Separate schema to organize RLS objects.
GO

CREATE FUNCTION rls.fn_tenantAccessPredicate(@TenantId int)     
    RETURNS TABLE     
    WITH SCHEMABINDING
AS
    RETURN SELECT 1 AS fn_accessResult
        -- Use the user in your application’s connection string.
        -- Here we use 'dbo' only for demo purposes!
        WHERE DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('dbo')
        AND CAST(SESSION_CONTEXT(N'TenantId') AS int) = @TenantId;
GO

CREATE SECURITY POLICY rls.tenantAccessPolicy
    ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Blogs,
    ADD BLOCK  PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Blogs,
    ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Posts,
    ADD BLOCK  PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.Posts;
GO 
```

> [!TIP]
> In a complex project you might need to add the predicate on hundreds of tables, which could be tedious. There is a helper stored procedure that automatically generates a security policy, and adds a predicate on all tables in a schema. For more information, see the blog post at [Apply Row-Level Security to all tables - helper script (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/03/31/apply-row-level-security-to-all-tables-helper-script).

Now if you run the sample application again, tenants see only rows that belong to them. In addition, the application cannot insert rows that belong to tenants other than the one currently connected to the shard database. Also, the app cannot update the TenantId in any rows it can see. If the app attempts to do either, a DbUpdateException is raised.

If you add a new table later, ALTER the security policy to add FILTER and BLOCK predicates on the new table.

```sql
ALTER SECURITY POLICY rls.tenantAccessPolicy     
    ADD FILTER PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.MyNewTable,
    ADD BLOCK  PREDICATE rls.fn_tenantAccessPredicate(TenantId) ON dbo.MyNewTable;
GO 
```

### Add default constraints to automatically populate TenantId for INSERTs

You can put a default constraint on each table to automatically populate the TenantId with the value currently stored in SESSION\_CONTEXT when inserting rows. An example follows. 

```sql
-- Create default constraints to auto-populate TenantId with the
-- value of SESSION_CONTEXT for inserts.
ALTER TABLE Blogs     
    ADD CONSTRAINT df_TenantId_Blogs      
    DEFAULT CAST(SESSION_CONTEXT(N'TenantId') AS int) FOR TenantId;
GO

ALTER TABLE Posts     
    ADD CONSTRAINT df_TenantId_Posts      
    DEFAULT CAST(SESSION_CONTEXT(N'TenantId') AS int) FOR TenantId;
GO 
```

Now the application does not need to specify a TenantId when inserting rows: 

```csharp
SqlDatabaseUtils.SqlRetryPolicy.ExecuteAction(() => 
{   
    using (var db = new ElasticScaleContext<int>(
        sharding.ShardMap, tenantId, connStrBldr.ConnectionString))
    {
        // The default constraint sets TenantId automatically!
        var blog = new Blog { Name = name };
        db.Blogs.Add(blog);     
        db.SaveChanges();   
    } 
}); 
```

> [!NOTE]
> If you use default constraints for an Entity Framework project, it is recommended that you *NOT* include the TenantId column in your EF data model. This recommendation is because Entity Framework queries automatically supply default values that override the default constraints created in T-SQL that use SESSION\_CONTEXT.
> To use default constraints in the sample project, for instance, you should remove TenantId from DataClasses.cs (and run Add-Migration in the Package Manager Console) and use T-SQL to ensure that the field only exists in the database tables. This way, EF does automatically supply incorrect default values when inserting data.

### (Optional) Enable a *superuser* to access all rows

Some applications may want to create a *superuser* who can access all rows. A superuser could enable reporting across all tenants on all shards. Or a superuser could perform split-merge operations on shards that involve moving tenant rows between databases.

To enable a superuser, create a new SQL user (`superuser` in this example) in each shard database. Then alter the security policy with a new predicate function that allows this user to access all rows. Such a function is given next.

```sql
-- New predicate function that adds superuser logic.
CREATE FUNCTION rls.fn_tenantAccessPredicateWithSuperUser(@TenantId int)
    RETURNS TABLE
    WITH SCHEMABINDING
AS
    RETURN SELECT 1 AS fn_accessResult 
        WHERE 
        (
            DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('dbo') -- Replace 'dbo'.
            AND CAST(SESSION_CONTEXT(N'TenantId') AS int) = @TenantId
        ) 
        OR
        (
            DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('superuser')
        );
GO

-- Atomically swap in the new predicate function on each table.
ALTER SECURITY POLICY rls.tenantAccessPolicy
    ALTER FILTER PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Blogs,
    ALTER BLOCK  PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Blogs,
    ALTER FILTER PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Posts,
    ALTER BLOCK  PREDICATE rls.fn_tenantAccessPredicateWithSuperUser(TenantId) ON dbo.Posts;
GO
```


### Maintenance

- **Adding new shards**: Execute the T-SQL script to enable RLS on any new shards, otherwise queries on these shards are not be filtered.
- **Adding new tables**: Add a FILTER and BLOCK predicate to the security policy on all shards whenever a new table is created. Otherwise queries on the new table are not be filtered. This addition can be automated by using a DDL trigger, as described in [Apply Row-Level Security automatically to newly created tables (blog)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/05/22/apply-row-level-security-automatically-to-newly-created-tables.aspx).

## Summary

Elastic database tools and row-level security can be used together to scale out an application’s data tier with support for both multi-tenant and single-tenant shards. Multi-tenant shards can be used to store data more efficiently. This efficiency is pronounced where a large number of tenants have only a few rows of data. Single-tenant shards can support premium tenants which have stricter performance and isolation requirements.  For more information, see [Row-Level Security reference][rls].

## Additional resources

- [What is an Azure elastic pool?](sql-database-elastic-pool.md)
- [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md)
- [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](saas-tenancy-app-design-patterns.md)
- [Authentication in multitenant apps, using Azure AD and OpenID Connect](../guidance/guidance-multitenant-identity-authenticate.md)
- [Tailspin Surveys application](../guidance/guidance-multitenant-identity-tailspin.md)

## Questions and Feature Requests

For questions, contact us on the [SQL Database forum](http://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted). And add any feature requests to the [SQL Database feedback forum](https://feedback.azure.com/forums/217321-sql-database/).


<!--Image references-->
[1]: ./media/saas-tenancy-elastic-tools-multi-tenant-row-level-security/blogging-app.png
<!--anchors-->
[rls]: https://docs.microsoft.com/sql/relational-databases/security/row-level-security
[s-d-elastic-database-client-library]: sql-database-elastic-database-client-library.md

