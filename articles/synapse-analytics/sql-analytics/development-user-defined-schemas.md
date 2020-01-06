---
title: Using user-defined schemas
description: Tips for using T-SQL user-defined schemas in SQL Analytics for developing solutions.
services: synapse-analytics 
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 10/23/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---


# Using user-defined schemas in SQL Analytics
Tips for using T-SQL user-defined schemas in Azure SQL Analytics for developing solutions.

## Schemas for application boundaries in SQL Analytics pool

Traditional analytics often use separate databases to create application boundaries based on either workload, domain or security. For example, a traditional SQL Server Analytics might include a staging database, an analytics database, and some data mart databases. In this topology, each database operates as a workload and security boundary in the architecture.

By contrast, SQL Analytics runs the entire analytics workload within one database. Cross database joins are not permitted. Therefore SQL Analytics expects all tables used by the warehouse to be stored within the one database.

> [!NOTE]
> SQL Analytics pools do not support cross database queries of any kind. Consequently, analytics implementations that leverage this pattern will need to be revised. SQL Analytics on-demand supports cross database queries.
> 
> 

## Recommendations
These are recommendations for consolidating workloads, security, domain, and functional boundaries by using user-defined schemas:

- Use one SQL Analytics database to run your entire analytics workload.
- Consolidate your existing analytics environment to use one SQL Analytics database.
- Leverage **user-defined schemas** to provide the boundary previously implemented using databases.

If user-defined schemas have not been used previously, then you have a clean slate. Use the old database name as the basis for your user-defined schemas in the SQL analytics database.

If schemas have already been used, then you have a few options:

- Remove the legacy schema names and start fresh
- Retain the legacy schema names by pre-pending the legacy schema name to the table name
- Retain the legacy schema names by implementing views over the table in an extra schema to re-create the old schema structure.

> [!NOTE]
> On first inspection, option 3 may seem like the most appealing choice. Views are read only in SQL analytics. Any data or table modification would need to be performed against the base table. Option 3 also introduces a layer of views into your system. You might want to give this some additional thought if you are already using views in your architecture.
> 
> 

### Examples:
Implement user-defined schemas based on database names.

```sql
CREATE SCHEMA [stg]; -- stg previously database name for staging database
GO
CREATE SCHEMA [edw]; -- edw previously database name for the analytics
GO
CREATE TABLE [stg].[customer] -- create staging tables in the stg schema
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw].[customer] -- create analytics tables in the edw schema
(       CustKey BIGINT NOT NULL
,       ...
);
```

Retain legacy schema names by pre-pending them to the table name. Use schemas for the workload boundary.

```sql
CREATE SCHEMA [stg]; -- stg defines the staging boundary
GO
CREATE SCHEMA [edw]; -- edw defines the analytics boundary
GO
CREATE TABLE [stg].[dim_customer] --pre-pend the old schema name to the table and create in the staging boundary
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw].[dim_customer] --pre-pend the old schema name to the table and create in the analytics boundary
(       CustKey BIGINT NOT NULL
,       ...
);
```

Retain the legacy schema names using views.

```sql
CREATE SCHEMA [stg]; -- stg defines the staging boundary
GO
CREATE SCHEMA [edw]; -- stg defines the analytics boundary
GO
CREATE SCHEMA [dim]; -- edw defines the legacy schema name boundary
GO
CREATE TABLE [stg].[customer] -- create the base staging tables in the staging boundary
(       CustKey    BIGINT NOT NULL
,       ...
)
GO
CREATE TABLE [edw].[customer] -- create the base analytics tables in the analytics boundary
(       CustKey    BIGINT NOT NULL
,       ...
)
GO
CREATE VIEW [dim].[customer] -- create a view in the legacy schema name boundary for presentation consistency purposes only
AS
SELECT  CustKey
,       ...
FROM    [edw].customer
;
```

> [!NOTE]
> Any change in schema strategy needs a review of the security model for the database. In many cases, you might be able to simplify the security model by assigning permissions at the schema level. If more granular permissions are required, then you can use database roles.
> 
> 

## Next steps

For more development tips, see [SQL analytics development overview](development-overview.md).
