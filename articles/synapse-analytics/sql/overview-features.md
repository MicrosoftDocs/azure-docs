---
title: T-SQL feature differences in Synapse SQL
description: List of Transact-SQL features that are available in Synapse SQL.
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 04/15/2020
ms.author: jovanpop
ms.reviewer: jrasnick
---

# Transact-SQL features supported in Azure Synapse SQL

Azure Synapse SQL is a big data analytic service that enables you to query and analyze your data using the T-SQL language. You can use standard ANSI-compliant dialect of SQL language used on SQL Server and Azure SQL Database for data analysis. 

Transact-SQL language is used in serverless SQL pool and dedicated model can reference different objects and has some differences in the set of supported features. In this page, you can find high-level Transact-SQL language differences between consumption models of Synapse SQL.

## Database objects

Consumption models in Synapse SQL enables you to use different database objects. The comparison of supported object types is shown in the following table:

|   | Dedicated | Serverless |
| --- | --- | --- |
| **Tables** | [Yes](/sql/t-sql/statements/create-table-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) | No, serverless model can query only external data placed on [Azure Storage](#storage-options) |
| **Views** | [Yes](/sql/t-sql/statements/create-view-transact-sql?view=azure-sqldw-latest&preserve-view=true). Views can use [query language elements](#query-language) that are available in dedicated model. | [Yes](/sql/t-sql/statements/create-view-transact-sql?view=azure-sqldw-latest&preserve-view=true). Views can use [query language elements](#query-language) that are available in serverless model. |
| **Schemas** | [Yes](/sql/t-sql/statements/create-schema-transact-sql?view=azure-sqldw-latest&preserve-view=true) | [Yes](/sql/t-sql/statements/create-schema-transact-sql?view=azure-sqldw-latest&preserve-view=true) |
| **Temporary tables** | [Yes](../sql-data-warehouse/sql-data-warehouse-tables-temporary.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) | No |
| **Procedures** | [Yes](/sql/t-sql/statements/create-procedure-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes |
| **Functions** | [Yes](/sql/t-sql/statements/create-function-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) | Yes, only inline table-valued functions. |
| **Triggers** | No | No |
| **External tables** | [Yes](/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest&preserve-view=true). See supported [data formats](#data-formats). | [Yes](/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest&preserve-view=true). See supported [data formats](#data-formats). |
| **Caching queries** | Yes, multiple forms (SSD-based caching, in-memory, resultset caching). In addition, Materialized View are supported | No |
| **Table variables** | [No](/sql/t-sql/data-types/table-transact-sql?view=azure-sqldw-latest&preserve-view=true), use temporary tables | No |
| **[Table distribution](../sql-data-warehouse/sql-data-warehouse-tables-distribute.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)**               | Yes | No |
| **[Table indexes](../sql-data-warehouse/sql-data-warehouse-tables-index.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)**                           | Yes | No |
| **[Table partitions](../sql-data-warehouse/sql-data-warehouse-tables-partition.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)**                     | Yes | No |
| **[Statistics](develop-tables-statistics.md)**            | Yes | Yes |
| **[Workload management, resource classes, and concurrency control](../sql-data-warehouse/resource-classes-for-workload-management.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)** | Yes    | No |
| **Cost control** | Yes, using scale-up and scale-down actions. | Yes, using [the Azure portal or T-SQL procedure](./data-processed.md#cost-control). |

## Query language

Query languages used in Synapse SQL can have different supported features depending on consumption model. The following table outlines the most important query language differences in Transact-SQL dialects:

|   | Dedicated | Serverless |
| --- | --- | --- |
| **SELECT statement** | Yes. Transact-SQL query clauses [FOR XML/FOR JSON](/sql/t-sql/queries/select-for-clause-transact-sql?view=azure-sqldw-latest&preserve-view=true), [MATCH](/sql/t-sql/queries/match-sql-graph?view=azure-sqldw-latest&preserve-view=true), OFFSET/FETCH  are not supported. | Yes. Transact-SQL query clauses [FOR XML](/sql/t-sql/queries/select-for-clause-transact-sql?view=azure-sqldw-latest&preserve-view=true), [MATCH](/sql/t-sql/queries/match-sql-graph?view=azure-sqldw-latest&preserve-view=true), [PREDICT](/sql/t-sql/queries/predict-transact-sql?view=azure-sqldw-latest&preserve-view=true), GROUPNG SETS, and query hints are not supported. |
| **INSERT statement** | Yes | No |
| **UPDATE statement** | Yes | No |
| **DELETE statement** | Yes | No |
| **MERGE statement** | Yes ([preview](/sql/t-sql/statements/merge-transact-sql?view=azure-sqldw-latest&preserve-view=true)) | No |
| **[Transactions](develop-transactions.md)** | Yes | Yes, applicable on meta-data objects. |
| **[Labels](develop-label.md)** | Yes | No |
| **Data load** | Yes. Preferred utility is [COPY](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) statement, but the system supports both BULK load (BCP) and [CETAS](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=azure-sqldw-latest&preserve-view=true) for data loading. | No |
| **Data export** | Yes. Using [CETAS](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=azure-sqldw-latest&preserve-view=true). | Yes. Using [CETAS](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=azure-sqldw-latest&preserve-view=true). |
| **Types** | Yes, all Transact-SQL types except [cursor](/sql/t-sql/data-types/cursor-transact-sql?view=azure-sqldw-latest&preserve-view=true), [hierarchyid](/sql/t-sql/data-types/hierarchyid-data-type-method-reference?view=azure-sqldw-latest&preserve-view=true), [ntext, text, and image](/sql/t-sql/data-types/ntext-text-and-image-transact-sql?view=azure-sqldw-latest&preserve-view=true), [rowversion](/sql/t-sql/data-types/rowversion-transact-sql?view=azure-sqldw-latest&preserve-view=true), [Spatial Types](/sql/t-sql/spatial-geometry/spatial-types-geometry-transact-sql?view=azure-sqldw-latest&preserve-view=true), [sql\_variant](/sql/t-sql/data-types/sql-variant-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [xml](/sql/t-sql/xml/xml-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes, all Transact-SQL types except [cursor](/sql/t-sql/data-types/cursor-transact-sql?view=azure-sqldw-latest&preserve-view=true), [hierarchyid](/sql/t-sql/data-types/hierarchyid-data-type-method-reference?view=azure-sqldw-latest&preserve-view=true), [ntext, text, and image](/sql/t-sql/data-types/ntext-text-and-image-transact-sql?view=azure-sqldw-latest&preserve-view=true), [rowversion](/sql/t-sql/data-types/rowversion-transact-sql?view=azure-sqldw-latest&preserve-view=true), [Spatial Types](/sql/t-sql/spatial-geometry/spatial-types-geometry-transact-sql?view=azure-sqldw-latest&preserve-view=true), [sql\_variant](/sql/t-sql/data-types/sql-variant-transact-sql?view=azure-sqldw-latest&preserve-view=true), [xml](/sql/t-sql/xml/xml-transact-sql?view=azure-sqldw-latest&preserve-view=true), and Table type |
| **Cross-database queries** | No | Yes, including [USE](/sql/t-sql/language-elements/use-transact-sql?view=azure-sqldw-latest&preserve-view=true) statement. |
| **Built-in functions (analysis)** | Yes, all Transact-SQL [Analytic](/sql/t-sql/functions/analytic-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), Conversion, [Date and Time](/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), Logical, [Mathematical](/sql/t-sql/functions/mathematical-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true) functions, except [CHOOSE](/sql/t-sql/functions/logical-functions-choose-transact-sql?view=azure-sqldw-latest&preserve-view=true), [IIF](/sql/t-sql/functions/logical-functions-iif-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [PARSE](/sql/t-sql/functions/parse-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes, all Transact-SQL [Analytic](/sql/t-sql/functions/analytic-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), Conversion, [Date and Time](/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), Logical, [Mathematical](/sql/t-sql/functions/mathematical-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true) functions. |
| **Built-in functions (text)** | Yes. All Transact-SQL [String](/sql/t-sql/functions/string-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), [JSON](/sql/t-sql/functions/json-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), and Collation functions, except [STRING_ESCAPE](/sql/t-sql/functions/string-escape-transact-sql?view=azure-sqldw-latest&preserve-view=true) and [TRANSLATE](/sql/t-sql/functions/translate-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes. All Transact-SQL [String](/sql/t-sql/functions/string-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), [JSON](/sql/t-sql/functions/json-functions-transact-sql?view=azure-sqldw-latest&preserve-view=true), and Collation functions. |
| **Built-in table-value functions** | Yes, [Transact-SQL Rowset functions](/sql/t-sql/functions/functions?view=azure-sqldw-latest&preserve-view=true#rowset-functions), except [OPENXML](/sql/t-sql/functions/openxml-transact-sql?view=azure-sqldw-latest&preserve-view=true), [OPENDATASOURCE](/sql/t-sql/functions/opendatasource-transact-sql?view=azure-sqldw-latest&preserve-view=true), [OPENQUERY](/sql/t-sql/functions/openquery-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes, [Transact-SQL Rowset functions](/sql/t-sql/functions/functions?view=azure-sqldw-latest&preserve-view=true#rowset-functions), except [OPENXML](/sql/t-sql/functions/openxml-transact-sql?view=azure-sqldw-latest&preserve-view=true), [OPENDATASOURCE](/sql/t-sql/functions/opendatasource-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [OPENQUERY](/sql/t-sql/functions/openquery-transact-sql?view=azure-sqldw-latest&preserve-view=true)  |
| **Aggregates** |  Transact-SQL built-in aggregates except, except [CHECKSUM_AGG](/sql/t-sql/functions/checksum-agg-transact-sql?view=azure-sqldw-latest&preserve-view=true) and [GROUPING_ID](/sql/t-sql/functions/grouping-id-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Transact-SQL built-in aggregates. |
| **Operators** | Yes, all [Transact-SQL operators](/sql/t-sql/language-elements/operators-transact-sql?view=azure-sqldw-latest&preserve-view=true) except [!>](/sql/t-sql/language-elements/not-greater-than-transact-sql?view=azure-sqldw-latest&preserve-view=true) and [!<](/sql/t-sql/language-elements/not-less-than-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes, all [Transact-SQL operators](/sql/t-sql/language-elements/operators-transact-sql?view=azure-sqldw-latest&preserve-view=true)  |
| **Control of flow** | Yes. All [Transact-SQL Control-of-flow statement](/sql/t-sql/language-elements/control-of-flow?view=azure-sqldw-latest&preserve-view=true) except [CONTINUE](/sql/t-sql/language-elements/continue-transact-sql?view=azure-sqldw-latest&preserve-view=true), [GOTO](/sql/t-sql/language-elements/goto-transact-sql?view=azure-sqldw-latest&preserve-view=true), [RETURN](/sql/t-sql/language-elements/return-transact-sql?view=azure-sqldw-latest&preserve-view=true), [USE](/sql/t-sql/language-elements/use-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [WAITFOR](/sql/t-sql/language-elements/waitfor-transact-sql?view=azure-sqldw-latest&preserve-view=true) | Yes. All [Transact-SQL Control-of-flow statement](/sql/t-sql/language-elements/control-of-flow?view=azure-sqldw-latest&preserve-view=true) SELECT query in `WHILE (...)` condition |
| **DDL statements (CREATE, ALTER, DROP)** | Yes. All Transact-SQL DDL statement applicable to the supported object types | Yes. All Transact-SQL DDL statement applicable to the supported object types |

## Security

Synapse SQL enable you to use built-in security features to secure your data and control access. The following table compares high-level differences between Synapse SQL consumption models.

|   | Dedicated | Serverless |
| --- | --- | --- |
| **Logins** | N/A (only contained users are supported in databases) | Yes |
| **Users** |  N/A (only contained users are supported in databases) | Yes |
| **[Contained users](/sql/relational-databases/security/contained-database-users-making-your-database-portable?view=azure-sqldw-latest&preserve-view=true)** | Yes. **Note:** only one Azure AD user can be unrestricted admin | No |
| **SQL username/password authentication**| Yes | Yes |
| **Azure Active Directory (Azure AD) authentication**| Yes, Azure AD users | Yes, Azure AD logins and users |
| **Storage Azure Active Directory (Azure AD) passthrough authentication** | Yes | Yes |
| **Storage SAS token authentication** | No | Yes, using [DATABASE SCOPED CREDENTIAL](/sql/t-sql/statements/create-database-scoped-credential-transact-sql?view=azure-sqldw-latest&preserve-view=true) in [EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true) or instance-level [CREDENTIAL](/sql/t-sql/statements/create-credential-transact-sql?view=azure-sqldw-latest&preserve-view=true). |
| **Storage Access Key authentication** | Yes, using [DATABASE SCOPED CREDENTIAL](/sql/t-sql/statements/create-database-scoped-credential-transact-sql?view=azure-sqldw-latest&preserve-view=true) in [EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true) | No |
| **Storage [Managed Identity](../security/synapse-workspace-managed-identity.md) authentication** | Yes, using [Managed Service Identity Credential](../../azure-sql/database/vnet-service-endpoint-rule-overview.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&preserve-view=true&toc=%2fazure%2fsynapse-analytics%2ftoc.json&view=azure-sqldw-latest&preserve-view=true) | Yes, using `Managed Identity` credential. |
| **Storage Application identity authentication** | [Yes](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true) | No |
| **Permissions - Object-level** | Yes, including ability to GRANT, DENY, and REVOKE permissions to users | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the system objects that are supported |
| **Permissions - Schema-level** | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the schema | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the schema |
| **Permissions - [Database-level](/sql/relational-databases/security/authentication-access/database-level-roles?view=azure-sqldw-latest&preserve-view=true)** | Yes | Yes |
| **Permissions - [Server-level](/sql/relational-databases/security/authentication-access/server-level-roles)** | No | Yes, sysadmin and other server-roles are supported |
| **Permissions - [Column-level security](../sql-data-warehouse/column-level-security.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json)** | Yes | Yes |
| **Roles/groups** | Yes (database scoped) | Yes (both server and database scoped) |
| **Security &amp; identity functions** | Some Transact-SQL security functions and operators:  `CURRENT_USER`, `HAS_DBACCESS`, `IS_MEMBER`, `IS_ROLEMEMBER`, `SESSION_USER`, `SUSER_NAME`, `SUSER_SNAME`, `SYSTEM_USER`, `USER`, `USER_NAME`, `EXECUTE AS`, `OPEN/CLOSE MASTER KEY` | Some Transact-SQL security functions and operators:  `CURRENT_USER`, `HAS_DBACCESS`, `HAS_PERMS_BY_NAME`, `IS_MEMBER', 'IS_ROLEMEMBER`, `IS_SRVROLEMEMBER`, `SESSION_USER`, `SESSION_CONTEXT`, `SUSER_NAME`, `SUSER_SNAME`, `SYSTEM_USER`, `USER`, `USER_NAME`, `EXECUTE AS`, and `REVERT`. Security functions cannot be used to query external data (store the result in variable that can be used in the query).  |
| **DATABASE SCOPED CREDENTIAL** | Yes | Yes |
| **SERVER SCOPED CREDENTIAL** | No | Yes |
| **Row-level security** | [Yes](/sql/relational-databases/security/row-level-security?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) | No |
| **Transparent Data Encryption (TDE)** | [Yes](../../azure-sql/database/transparent-data-encryption-tde-overview.md) | No | 
| **Data Discovery & Classification** | [Yes](../../azure-sql/database/data-discovery-and-classification-overview.md) | No |
| **Vulnerability Assessment** | [Yes](../../azure-sql/database/sql-vulnerability-assessment.md) | No |
| **Advanced Threat Protection** | [Yes](../../azure-sql/database/threat-detection-overview.md)
| **Auditing** | [Yes](../../azure-sql/database/auditing-overview.md) | No |
| **[Firewall rules](../security/synapse-workspace-ip-firewall.md)**| Yes | Yes |
| **[Private endpoint](../security/synapse-workspace-managed-private-endpoints.md)**| Yes | Yes |

Dedicated SQL pool and serverless SQL pool use standard Transact-SQL language to query data. For detailed differences, look at the [Transact-SQL language reference](/sql/t-sql/language-reference).

## Tools

You can use various tools to connect to Synapse SQL to query data.

|   | Dedicated | Serverless |
| --- | --- | --- |
| **Synapse Studio** | Yes, SQL scripts | Yes, SQL scripts |
| **Power BI** | Yes | [Yes](tutorial-connect-power-bi-desktop.md) |
| **Azure Analysis Service** | Yes | Yes |
| **Azure Data Studio** | Yes | Yes, version 1.18.0 or higher. SQL scripts and SQL Notebooks are supported. |
| **SQL Server Management Studio** | Yes | Yes, version 18.5 or higher |

> [!NOTE]
> You can use SSMS to connect to serverless SQL pool and query. It is partially supported starting from version 18.5, you can use it to connect and query only.

Most of the applications use standard Transact-SQL language can query both dedicated and serverless consumption models of Synapse SQL.

## Storage options

Data that is analyzed can be stored on various storage types. The following table lists all available storage options:

|   | Dedicated | Serverless |
| --- | --- | --- |
| **Internal storage** | Yes | No |
| **Azure Data Lake v2** | Yes | Yes |
| **Azure Blob Storage** | Yes | Yes |
| **Azure SQL (remote)** | No | No |
| **Azure CosmosDB transactional storage** | No | No |
| **Azure CosmosDB analytical storage** | No | Yes, using [Synapse Link(preview)](../../cosmos-db/synapse-link.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json) ([public preview](../../cosmos-db/synapse-link.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json#limitations)) |
| **Apache Spark tables (in workspace)** | No | PARQUET tables only using [metadata synchronization](develop-storage-files-spark-tables.md) |
| **Apache Spark tables (remote)** | No | No |
| **Databricks tables (remote)** | No | No |

## Data formats

Data that is analyzed can be stored in various storage formats. The following table lists all available data formats that can be analyzed:

|   | Dedicated | Serverless |
| --- | --- | --- |
| **Delimited** | [Yes](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true) | [Yes](query-single-csv-file.md) |
| **CSV** | Yes (multi-character delimiters not supported) | [Yes](query-single-csv-file.md) |
| **Parquet** | [Yes](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true) | [Yes](query-parquet-files.md), including files with [nested types](query-parquet-nested-types.md) |
| **Hive ORC** | [Yes](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true) | No |
| **Hive RC** | [Yes](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true) | No |
| **JSON** | Yes | [Yes](query-json-files.md) |
| **Avro** | No | No |
| **[Delta-lake](https://delta.io/)** | No | No |
| **[CDM](/common-data-model/)** | No | No |

## Next steps
Additional information on best practices for dedicated SQL pool and serverless SQL pool can be found in the following articles:

- [Best Practices for dedicated SQL pool](best-practices-dedicated-sql-pool.md)
- [Best practices for serverless SQL pool](best-practices-serverless-sql-pool.md)
