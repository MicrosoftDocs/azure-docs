---
title: T-SQL statements
description: Links to the documentation for T-SQL statements supported in SQL Analytics.
services: sql-analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice:
ms.date: 02/26/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---


# T-SQL statements supported in SQL Analytics
Links to the documentation for T-SQL statements supported in SQL Analytics.

## Data Definition Language (DDL) statements

| DDL statement | SQL pool | SQL on-demand |
| ---- | ---- | ---- |
| [ALTER DATABASE](https://msdn.microsoft.com/library/mt204042.aspx) | Yes      | Yes           |
| [ALTER INDEX](https://msdn.microsoft.com/library/ms188388.aspx) | Yes      | No          |
| [ALTER MATERIALIZED VIEW](/sql/t-sql/statements/alter-materialized-view-transact-sql?view=azure-sqldw-latest) (Preview)  | Yes      | No          |
| [ALTER PROCEDURE](https://msdn.microsoft.com/library/ms189762.aspx) | Yes      | No          |
| [ALTER SCHEMA](https://msdn.microsoft.com/library/ms173423.aspx) | Yes      | Yes           |
| [ALTER TABLE](https://msdn.microsoft.com/library/ms190273.aspx) | Yes      | No          |
| [CREATE COLUMNSTORE INDEX](https://msdn.microsoft.com/library/gg492153.aspx) | Yes      | No          |
| [CREATE DATABASE](https://msdn.microsoft.com/library/mt204021.aspx) | Yes      | Yes           |
| [CREATE DATABASE SCOPED CREDENTIAL](https://msdn.microsoft.com/library/mt270260.aspx) | Yes      | No          |
| [CREATE EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/dn935022.aspx) | Yes      | Yes           |
| [CREATE EXTERNAL FILE FORMAT](https://msdn.microsoft.com/library/dn935026.aspx) | Yes      | Yes           |
| [CREATE EXTERNAL TABLE](https://msdn.microsoft.com/library/dn935021.aspx) | Yes      | Yes           |
| [CREATE EXTERNAL TABLE AS SELECT](../synapse-analytics/sql-analytics/development-tables-cetas.md) | No | Yes |
| [CREATE FUNCTION](https://msdn.microsoft.com/library/mt203952.aspx) | Yes      | No          |
| [CREATE INDEX](https://msdn.microsoft.com/library/ms188783.aspx) | Yes      | Yes (on temp tables only) |
| [CREATE MATERIALIZED VIEW AS SELECT](/sql/t-sql/statements/create-materialized-view-as-select-transact-sql?view=azure-sqldw-latest) (Preview)  | Yes      | No          |
| [CREATE PROCEDURE](https://msdn.microsoft.com/library/ms187926.aspx) | Yes      | No          |
| [CREATE SCHEMA](https://msdn.microsoft.com/library/ms189462.aspx) | Yes      | Yes           |
| [CREATE STATISTICS](https://msdn.microsoft.com/library/ms188038.aspx) | Yes      | Yes           |
| [CREATE TABLE](https://msdn.microsoft.com/library/mt203953.aspx) | Yes      | Yes (temp tables only) |
| [CREATE TABLE AS SELECT](https://msdn.microsoft.com/library/mt204041.aspx) | Yes      | No          |
| [CREATE VIEW](https://msdn.microsoft.com/library/ms187956.aspx) | Yes      | Yes           |
| [CREATE WORKLOAD CLASSIFIER](/sql/t-sql/statements/create-workload-classifier-transact-sql) | Yes      | No          |
| [DROP EXTERNAL DATA SOURCE](https://msdn.microsoft.com/library/mt146367.aspx) | Yes      | Yes           |
| [DROP EXTERNAL FILE FORMAT](https://msdn.microsoft.com/library/mt146379.aspx) | Yes      | Yes           |
| [DROP EXTERNAL TABLE](https://msdn.microsoft.com/library/mt130698.aspx) | Yes      | Yes           |
| [DROP INDEX](https://msdn.microsoft.com/library/ms176118.aspx) | Yes      | Yes           |
| [DROP PROCEDURE](https://msdn.microsoft.com/library/ms174969.aspx) | Yes      | No          |
| [DROP STATISTICS](https://msdn.microsoft.com/library/ms175075.aspx) | Yes      | Yes           |
| [DROP TABLE](https://msdn.microsoft.com/library/ms173790.aspx) | Yes      | Yes           |
| [DROP SCHEMA](https://msdn.microsoft.com/library/ms186751.aspx) | Yes      | Yes           |
| [DROP VIEW](https://msdn.microsoft.com/library/ms173492.aspx) | Yes      | Yes           |
| [DROP WORKLOAD CLASSIFIER](/sql/t-sql/statements/drop-workload-classifier-transact-sql) | Yes      | No          |
| [RENAME](https://msdn.microsoft.com/library/mt631611.aspx) | Yes      | No          |
| [SET RESULT_SET_CACHING](/sql/t-sql/statements/set-result-set-caching-transact-sql)  | Yes      | No          |
| [TRUNCATE TABLE](https://msdn.microsoft.com/library/ms177570.aspx) | Yes      | Yes           |
| [UPDATE STATISTICS](https://msdn.microsoft.com/library/ms187348.aspx) | Yes      | No          |



## Data Manipulation Language (DML) statements

| DML statement                                              | SQL pool | SQL on-demand          |
| ---------------------------------------------------------- | -------- | ---------------------- |
| [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) | Yes      | Yes (only temp tables) |
| [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) | Yes      | Yes (only temp tables) |
| [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) | Yes      | Yes (only temp tables) |



## Database Console Commands

| Command                                                      | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [DBCC DROPCLEANBUFFERS](https://msdn.microsoft.com/library/ms187762.aspx) | Yes      | Yes           |
| [DBCC DROPRESULTSETCACHE](/sql/t-sql/database-console-commands/dbcc-dropresultsetcache-transact-sql?view=azure-sqldw-latest) (Preview) | Yes      | No            |
| [DBCC FREEPROCCACHE](https://msdn.microsoft.com/library/mt204018.aspx) | Yes      | Yes           |
| [DBCC SHRINKLOG](https://msdn.microsoft.com/library/mt204020.aspx) | Yes      | No            |
| [DBCC PDW_SHOWEXECUTIONPLAN](https://msdn.microsoft.com/library/mt204017.aspx) | Yes      | No            |
| [DBCC PDW_SHOWMATERIALIZEDVIEWOVERHEAD](/sql/t-sql/database-console-commands/dbcc-pdw-showmaterializedviewoverhead-transact-sql?view=azure-sqldw-latest) | Yes      | No            |
| [DBCC SHOWRESULTCACHESPACEUSED](/sql/t-sql/database-console-commands/dbcc-showresultcachespaceused-transact-sql) (Preview) | Yes      | No            |
| [DBCC PDW_SHOWPARTITIONSTATS](https://msdn.microsoft.com/library/mt204013.aspx) | Yes      | No            |
| [DBCC PDW_SHOWSPACEUSED](https://msdn.microsoft.com/library/mt204028.aspx) | Yes      | No            |
| [DBCC SHOW_STATISTICS](https://msdn.microsoft.com/library/mt204043.aspx) | Yes      | Yes           |



## Query statements

| Statement                                                    | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| [SELECT](https://msdn.microsoft.com/library/ms189499.aspx)   | Yes      | Yes           |
| [WITH common_table_expression](https://msdn.microsoft.com/library/ms175972.aspx) | Yes      | Yes           |
| [EXCEPT and INTERSECT](https://msdn.microsoft.com/library/ms188055.aspx) | Yes      | Yes           |
| [EXPLAIN](https://msdn.microsoft.com/library/mt631615.aspx)  | Yes      | No            |
| [FROM](https://msdn.microsoft.com/library/ms177634.aspx)     | Yes      | Yes           |
| [Using PIVOT and UNPIVOT](https://msdn.microsoft.com/library/ms177410.aspx) | Yes      | No            |
| [GROUP BY](https://msdn.microsoft.com/library/ms177673.aspx) | Yes      | Yes           |
| [HAVING](https://msdn.microsoft.com/library/ms180199.aspx)   | Yes      | Yes           |
| [ORDER BY](https://msdn.microsoft.com/library/ms188385.aspx) | Yes      | Yes           |
| [OPENROWSET](../synapse-analytics/sql-analytics/development-openrowset.md) | No       | Yes           |
| [OPTION](https://msdn.microsoft.com/library/ms190322.aspx)   | Yes      | No            |
| [UNION](https://msdn.microsoft.com/library/ms180026.aspx)    | Yes      | Yes           |
| [WHERE](https://msdn.microsoft.com/library/ms188047.aspx)    | Yes      | Yes           |
| [TOP](https://msdn.microsoft.com/library/ms189463.aspx)      | Yes      | Yes           |
| [Aliasing](https://msdn.microsoft.com/library/mt631614.aspx) | Yes      | Yes           |
| [Search condition](https://msdn.microsoft.com/library/ms173545.aspx) | Yes      | Yes           |
| [Subqueries](https://msdn.microsoft.com/library/mt631613.aspx) | Yes      | Yes           |



## Security statements

| Statement                                                    | SQL pool | SQL on-demand |
| ------------------------------------------------------------ | -------- | ------------- |
| Permissions: [GRANT](https://msdn.microsoft.com/library/ms187965.aspx), [DENY](https://msdn.microsoft.com/library/ms188338.aspx), [REVOKE](https://msdn.microsoft.com/library/ms187728.aspx) | Yes      | Yes           |
| [ALTER AUTHORIZATION](https://msdn.microsoft.com/library/ms187359.aspx) | Yes      | No            |
| [ALTER CERTIFICATE](https://msdn.microsoft.com/library/ms189511.aspx) | Yes      | No            |
| [ALTER DATABASE ENCRYPTION KEY](https://msdn.microsoft.com/library/bb630389.aspx) | Yes      | No            |
| [ALTER LOGIN](https://msdn.microsoft.com/library/ms189828.aspx) | Yes      | Yes           |
| [ALTER MASTER KEY](https://msdn.microsoft.com/library/ms186937.aspx) | Yes      | No            |
| [ALTER ROLE](https://msdn.microsoft.com/library/ms189775.aspx) | Yes      | Yes           |
| [ALTER USER](https://msdn.microsoft.com/library/ms176060.aspx) | Yes      | Yes           |
| [BACKUP CERTIFICATE](https://msdn.microsoft.com/library/ms178578.aspx) | Yes      | No            |
| [CLOSE MASTER KEY](https://msdn.microsoft.com/library/ms188387.aspx) | Yes      | No            |
| [CREATE CERTIFICATE](https://msdn.microsoft.com/library/ms187798.aspx) | Yes      | No            |
| [CREATE DATABASE ENCRYPTION KEY](https://msdn.microsoft.com/library/bb677241.aspx) | Yes      | No            |
| [CREATE LOGIN](https://msdn.microsoft.com/library/ms189751.aspx) | Yes      | Yes           |
| [CREATE MASTER KEY](https://msdn.microsoft.com/library/ms174382.aspx) | Yes      | No            |
| [CREATE ROLE](https://msdn.microsoft.com/library/ms187936.aspx) | Yes      | Yes           |
| [CREATE USER](https://msdn.microsoft.com/library/ms173463.aspx) | Yes      | Yes           |
| [DROP CERTIFICATE](https://msdn.microsoft.com/library/ms179906.aspx) | Yes      | No            |
| [DROP DATABASE ENCRYPTION KEY](https://msdn.microsoft.com/library/bb630256.aspx) | Yes      | No            |
| [DROP LOGIN](https://msdn.microsoft.com/library/ms188012.aspx) | Yes      | Yes           |
| [DROP MASTER KEY](https://msdn.microsoft.com/library/ms180071.aspx) | Yes      | No            |
| [DROP ROLE](https://msdn.microsoft.com/library/ms174988.aspx) | Yes      | Yes           |
| [DROP USER](https://msdn.microsoft.com/library/ms189438.aspx) | Yes      | Yes           |
| [OPEN MASTER KEY](https://msdn.microsoft.com/library/ms174433.aspx) | Yes      | No            |



## Next steps
For more reference information, see [T-SQL language elements in SQL Analytics](sql-data-warehouse-reference-tsql-language-elements.md), and [System views in SQL Analytics](sql-data-warehouse-reference-tsql-system-views.md).
