---
title: T-SQL feature differences - Azure Synapse Analytics
description: List of Transact-SQL features that are available in SQL Pool and SQL On-Demand.
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 01/15/2020
ms.author: jovanpop
ms.reviewer: jrasnick
---

# Transact-SQL features supported in Synapse

Azure Synapse Analytic is a big data analytic service that enables you to query and analyze your data using the powerful query languages. You can use the following languages for data analysis:

- Transact-SQL language - standard ANSI-compliant dialect of SQL language used on SQL Server and Azure SQL Database. This language is available in SQL Pool and SQL On-Demand capability.
- Spark SQL, PySpark(Python), Scala(Java), and .NET Spark (C#) languages that are used on Apache Spark. These languages are available on Spark Pool capability.

Transact-SQL language is used in SQL Pools and SQL On-Demand can reference different objects and has some differences in the set of supported features. In this page, you can find high-level Transact-SQL language differences between SQL Pools and SQL On-Demand Capabilities.

## Database objects

SQL Pools and SQL On-Demand capabilities enable you to use different database objects. The comparison of supported object types is shown in the following table:

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| Tables | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-table-azure-sql-data-warehouse) | No, SQL On-Demand capability can query only external data placed on [Azure Storage](#storage-options) |
| Views | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-view-transact-sql). Views can use [query language elements](#query-language) that are available in SQL Pool. | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-view-transact-sql). Views can use [query language elements](#query-language) that are available in SQL On-Demand. |
| Schemas | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-schema-transact-sql) | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-schema-transact-sql) |
| Temporary tables | [Yes](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-temporary) | [Yes](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-temporary) |
| Procedures | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-procedure-transact-sql) | No |
| Functions | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-function-sql-data-warehouse) | No |
| Triggers | No | No |
| External tables | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest). See supported [data formats](#data-formats). | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest). See supported [data formats](#data-formats). |
| Caching queries | Yes, multiple forms (SSD-based caching, in-memory, resultset caching). In addition, Materialized View are supported | No |
| Table variables | [No](https://docs.microsoft.com/sql/t-sql/data-types/table-transact-sql), use temporary tables | [No](https://docs.microsoft.com/sql/t-sql/data-types/table-transact-sql), use temporary tables |

## Query language

Query languages used in SQL Pools and SQL On-Demand can have different supported features. The following table outlines the most important query language differences in Transact-SQL dialects used in SQL On-Demand and SQL Pools.

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| SELECT statement | Yes. Transact-SQL query clauses [FOR XML/FOR JSON](https://docs.microsoft.com/sql/t-sql/queries/select-for-clause-transact-sql) and [MATCH](https://docs.microsoft.com/sql/t-sql/queries/match-sql-graph) are not supported. | Yes. Transact-SQL query clauses [FOR XML/FOR JSON](https://docs.microsoft.com/sql/t-sql/queries/select-for-clause-transact-sql), [MATCH](https://docs.microsoft.com/sql/t-sql/queries/match-sql-graph), [OFFSET/FETCH](https://docs.microsoft.com/sql/t-sql/queries/select-order-by-clause-transact-sql?view=sql-server-ver15#using-offset-and-fetch-to-limit-the-rows-returned), [PIVOT/UNPIVOT](https://docs.microsoft.com/sql/t-sql/queries/from-using-pivot-and-unpivot), and query hints are not supported. |
| INSERT statement | Yes | Limited (temp tables only) |
| UPDATE statement | Yes | Limited (temp tables only) |
| DELETE statement | Yes | Limited (temp tables only) |
| MERGE statement | Yes | Limited (temp tables only) |
| Data load | Yes. Preferred utility is [COPY](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) statement, but the system supports both BULK load (BCP) and [CETAS](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=aps-pdw-2016-au7) for data loading. | No |
| Data export | Yes. Using [CETAS](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=aps-pdw-2016-au7). | Yes. Using [CETAS](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=aps-pdw-2016-au7). |
| Types | Yes, all Transact-SQL types except [cursor](https://msdn.microsoft.com/library/ms190498.aspx), [hierarchyid](https://msdn.microsoft.com/library/bb677290.aspx), [ntext, text, and image](https://msdn.microsoft.com/library/ms187993.aspx), [rowversion](https://msdn.microsoft.com/library/ms182776.aspx), [Spatial Types](https://msdn.microsoft.com/library/ff848797.aspx), [sql\_variant](https://msdn.microsoft.com/library/ms173829.aspx), and [xml](https://msdn.microsoft.com/library/ms187339.aspx) | Yes, all Transact-SQL types except [cursor](https://msdn.microsoft.com/library/ms190498.aspx), [hierarchyid](https://msdn.microsoft.com/library/bb677290.aspx), [ntext, text, and image](https://msdn.microsoft.com/library/ms187993.aspx), [rowversion](https://msdn.microsoft.com/library/ms182776.aspx), [Spatial Types](https://msdn.microsoft.com/library/ff848797.aspx), [sql\_variant](https://msdn.microsoft.com/library/ms173829.aspx), [xml](https://msdn.microsoft.com/library/ms187339.aspx), and Table type |
| Cross-database queries | No | Yes, including [USE](https://docs.microsoft.com/sql/t-sql/language-elements/use-transact-sql) statement. |
| Built-in functions (analysis) | Yes, all Transact-SQL [Analytic](https://docs.microsoft.com/sql/t-sql/functions/analytic-functions-transact-sql?view=sql-server-ver15), Conversion, [Date and Time](https://docs.microsoft.com/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=sql-server-ver15), Logical, [Mathematical](https://docs.microsoft.com/sql/t-sql/functions/mathematical-functions-transact-sql?view=sql-server-ver15) functions, except [CHOOSE](https://docs.microsoft.com/sql/t-sql/functions/logical-functions-choose-transact-sql), [IIF](https://docs.microsoft.com/sql/t-sql/functions/logical-functions-iif-transact-sql), and [PARSE](https://docs.microsoft.com/sql/t-sql/functions/parse-transact-sql) | Yes, all Transact-SQL [Analytic](https://docs.microsoft.com/sql/t-sql/functions/analytic-functions-transact-sql?view=sql-server-ver15), Conversion, [Date and Time](https://docs.microsoft.com/sql/t-sql/functions/date-and-time-data-types-and-functions-transact-sql?view=sql-server-ver15), Logical, [Mathematical](https://docs.microsoft.com/sql/t-sql/functions/mathematical-functions-transact-sql?view=sql-server-ver15) functions, except [COMPRESS](https://docs.microsoft.com/sql/t-sql/functions/compress-transact-sql) and [DECOMPRESS](https://docs.microsoft.com/sql/t-sql/functions/decompress-transact-sql) |
| Built-in functions (text) | Yes. All Transact-SQL [String](https://docs.microsoft.com/sql/t-sql/functions/string-functions-transact-sql?view=sql-server-ver15), [JSON](https://docs.microsoft.com/sql/t-sql/functions/json-functions-transact-sql?view=sql-server-ver15), and Collation functions, except [STRING_ESCAPE](https://docs.microsoft.com/sql/t-sql/functions/string-escape-transact-sql?view=sql-server-ver15) and [TRANSLATE](https://docs.microsoft.com/sql/t-sql/functions/translate-transact-sql) | Yes. All Transact-SQL [string](https://docs.microsoft.com/sql/t-sql/functions/string-functions-transact-sql?view=sql-server-ver15), [JSON](https://docs.microsoft.com/sql/t-sql/functions/json-functions-transact-sql?view=sql-server-ver15), and collation functions, except [STRING_ESCAPE](https://docs.microsoft.com/sql/t-sql/functions/string-escape-transact-sql?view=sql-server-ver15) |
| Built-in table-value functions | Yes, [Transact-SQL Rowset functions](https://docs.microsoft.com/sql/t-sql/functions/functions?view=sql-server-ver15#rowset-functions), except [OPENXML](https://docs.microsoft.com/sql/t-sql/functions/openxml-transact-sql?view=sql-server-ver15), [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql), [OPENQUERY](https://docs.microsoft.com/sql/t-sql/functions/openquery-transact-sql), and [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql) | Yes, [Transact-SQL Rowset functions](https://docs.microsoft.com/sql/t-sql/functions/functions?view=sql-server-ver15#rowset-functions), except [OPENXML](https://docs.microsoft.com/sql/t-sql/functions/openxml-transact-sql?view=sql-server-ver15), [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql), and [OPENQUERY](https://docs.microsoft.com/sql/t-sql/functions/openquery-transact-sql)  |
| Aggregates |  Transact-SQL built-in aggregates except, except [CHECKSUM_AGG](https://docs.microsoft.com/sql/t-sql/functions/checksum-agg-transact-sql) and [GROUPING_ID](https://docs.microsoft.com/sql/t-sql/functions/grouping-id-transact-sql) | Transact-SQL built-in aggregates except [STRING\_AGG](https://docs.microsoft.com/sql/t-sql/functions/string-agg-transact-sql) |
| Operators | Yes, all [Transact-SQL operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql) except [!>](https://docs.microsoft.com/sql/t-sql/language-elements/not-greater-than-transact-sql) and [!<](https://docs.microsoft.com/sql/t-sql/language-elements/not-less-than-transact-sql) | Yes, all [Transact-SQL operators](https://docs.microsoft.com/sql/t-sql/language-elements/operators-transact-sql)  |
| Control of flow | Yes. All [Transact-SQL Control-of-flow statement](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow?view=sql-server-ver15) except [CONTINUE](https://docs.microsoft.com/sql/t-sql/language-elements/continue-transact-sql), [GOTO](https://docs.microsoft.com/sql/t-sql/language-elements/goto-transact-sql), [RETURN](https://docs.microsoft.com/sql/t-sql/language-elements/return-transact-sql), [USE](https://docs.microsoft.com/sql/t-sql/language-elements/use-transact-sql), and [WAITFOR](https://docs.microsoft.com/sql/t-sql/language-elements/waitfor-transact-sql) | Yes. All [Transact-SQL Control-of-flow statement](https://docs.microsoft.com/sql/t-sql/language-elements/control-of-flow?view=sql-server-ver15) except [RETURN](https://docs.microsoft.com/sql/t-sql/language-elements/return-transact-sql) and SELECT query in `WHILE (...)` condition |
| DDL statements (CREATE, ALTER, DROP) | Yes. All Transact-SQL DDL statement applicable to the supported object types | Yes. All Transact-SQL DDL statement applicable to the supported object types |

## Security

SQL Pools and SQL On-Demand enable you to use built-in security features to secure your data and control access. The following table compares high-level differences between capabilities.

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| Logins | N/A (only contained users are supported in DW databases) | Yes |
| Users | Yes. **Note:** only one AAD user can be unrestricted admin | Yes |
| Azure Active Directory (AAD) authentication | Yes, AAD users | Yes, AAD logins and users |
| Permissions - Object-level | Yes, including ability to GRANT, DENY, and REVOKE permissions to users | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the system objects that are supported |
| Permissions - Schema-level | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the schema | Yes, including ability to GRANT, DENY, and REVOKE permissions to users/logins on the schema |
| Roles/groups | Yes (database scoped) | Yes (both server and database scoped) |
| Storage AAD passthrough authentication | Yes | Yes |
| Security &amp; identity functions | Some Transact-SQL security functions and operators:  `CURRENT_USER`, `HAS_DBACCESS`, `IS_MEMBER`, `IS_ROLEMEMBER`, `SESSION_USER`, `SUSER_NAME`, `SUSER_SNAME`, `SYSTEM_USER`, `USER`, `USER_NAME`, `EXECUTE AS`, `OPEN/CLOSE MASTER KEY` | Some Transact-SQL security functions and operators:  `CURRENT_USER`, `HAS_DBACCESS`, `HAS_PERMS_BY_NAME`, `IS_MEMBER', 'IS_ROLEMEMBER`, `IS_SRVROLEMEMBER`, `SESSION_USER`, `SUSER_NAME`, `SUSER_SNAME`, `SYSTEM_USER`, `USER`, `USER_NAME`, `EXECUTE AS`, and `REVERT`  |

SQL Pool and SQL On-Demand use standard Transact-SQL language to query data. For detailed differences, look at the [Transact-SQL language reference](https://docs.microsoft.com/sql/t-sql/language-reference).

## Tools

You can use various tools to connect to synapse capabilities and query data.

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| Synapse Studio | Yes, SQL scripts | Yes, SQL scripts |
| Power BI | Yes | [Yes](tutorial-connect-power-bi-desktop.md) |
| Azure Analysis Service | Yes | Yes |
| Azure Data Studio | Yes | Yes, version 1.14 or higher |
| SQL Server Management Studio | Yes | Yes, version 18.4 or higher |

Most of the applications that query the services using Transact-SQL language can query SQL Pools and SQL On-demand.

## Storage options

Data that is analyzed can be stored on various storage types. The following table lists all available storage options:

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| Internal storage | Yes | No |
| Azure Data Lake v2 | Yes | Yes |
| Azure Blob Storage | Yes | Yes |

## Data formats

Data that is analyzed can be stored in various storage formats. The following table lists all available data formats that can be analyzed:

|   | SQL Pool | SQL On-demand |
| --- | --- | --- |
| Delimited | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql) | Yes |
| CSV | Yes (multi-character delimiters not supported) | Yes |
| Parquet | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql) | Yes |
| Hive ORC | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql) | No |
| Hive RC | [Yes](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql) | No |
| JSON | Yes | Yes |
| [Delta-lake](https://delta.io/) | No | No |
| [CDM](https://docs.microsoft.com/common-data-model/) | No | No |
