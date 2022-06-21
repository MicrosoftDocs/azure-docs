---
title: "Minimize SQL issues for Oracle migrations"
description: Learn how to minimize the risk of SQL issues when migrating from Oracle to Azure Synapse Analytics. 
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 06/30/2022
---

# Minimize SQL issues for Oracle migrations

This article is part five of a seven-part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. The focus of this article is best practices for minimizing SQL issues.

## Overview

### Characteristics of Oracle environments

Oracle's initial database product, released in 1979, was a commercial SQL relational database for on-line transaction processing (OLTP) applications&mdash;with much lower transaction rates than today. Since that initial release, the Oracle environment has evolved to become far more complex and encompasses numerous features. The features include: client-server architectures, distributed databases, parallel processing, data analytics, high availability, data warehousing, data in memory techniques, and support for cloud-based instances.

>[!TIP]
>Oracle pioneered the "data warehouse appliance" concept in the early 2000's.

Due to the cost and complexity of maintaining and upgrading legacy on-premises Oracle environments, many existing Oracle users want to take advantage of the innovations provided by cloud environments. Modern cloud environments, such as cloud, IaaS, and PaaS, let you delegate tasks like infrastructure maintenance and platform development to the cloud provider.

Many data warehouses that support complex analytic SQL queries on large data volumes use Oracle technologies. These data warehouses commonly have a dimensional data model, such as star or snowflake schemas, and use data marts for individual departments.

>[!TIP]
>Many existing Oracle installations are data warehouses that use a dimensional data model.

The combination of SQL and dimensional data models in Oracle simplifies migration to Azure Synapse because the SQL and basic data model concepts are transferable. Microsoft recommends moving your existing data model as-is to Azure to reduce risk, effort, and migration time. Although your migration plan might include a change in the underlying data model, such as a move from an Inmon model to a data vault, it makes sense to initially perform an as-is migration. After the initial migration, you can then make changes within the Azure cloud environment to take advantage of the built-in features, performance, elastic scalability, and cost benefits.

Although the SQL language is standardized, individual vendors sometimes implement proprietary extensions. As a result, you might find [SQL differences](#sql-dml-differences-between-oracle-and-azure-synapse) during your migration that require workarounds in Azure Synapse.

#### Use Azure facilities to implement a metadata-driven migration

You can automate and orchestrate the migration process by using the capabilities of the Azure environment. This approach minimizes the performance hit on the existing Oracle environment, which may already be running close to capacity.

Azure Data Factory is a cloud-based data integration service that supports creating data-driven workflows in the cloud to orchestrate and automate data movement and data transformation. You can use Data Factory to create and schedule data-driven workflows (pipelines) that ingest data from disparate data stores. Data Factory can process and transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

Azure also includes Migration Services to help you plan and perform a migration from environments like Oracle. [SQL Server Migration Assistant](/download/details.aspx?id=54258) (SSMA) for Oracle can automate migration of Oracle databases, including in some cases functions and procedural code.

>[!TIP]
>Automate the migration process by using Azure Data Factory capabilities.

When planning to use Azure facilities to manage the migration process, create metadata that lists all the data tables that need to be migrated and their location.

## SQL DDL differences between Oracle and Azure Synapse

### SQL Data Definition Language (DDL)

The ANSI SQL standard defines the basic syntax for DDL commands. Some DDL Commands common to both Oracle and Azure Synapse, like `CREATE TABLE` and `CREATE VIEW`, have been extended to provide implementation-specific features such as indexing, table distribution, and partitioning options.

>[!TIP]
>SQL DDL commands `CREATE TABLE` and `CREATE VIEW` have standard core elements but are also used to define implementation-specific options.

The following sections discuss the Oracle-specific options that need to be considered during a migration to Azure Synapse.

### Table/view considerations

When you migrate tables between different environments, typically only the raw data and the metadata that describes it physically migrates. Other database elements from the source system, such as indexes and log files, usually aren't migrated because they might be unnecessary or implemented differently in the new environment. For example, the `TEMPORARY` option within Oracle's `CREATE TABLE` syntax is equivalent to prefixing a table name with the `#` character in Azure Synapse.

Performance optimizations in the source environment, such as indexes, indicate where you might add performance optimization in the new target environment. For example, if bit-mapped indexes are frequently used in queries within the source Oracle environment, this information suggests that a non-clustered index should be created within Azure Synapse. Other native performance optimization techniques like table replication may be more applicable than straight like-for-like index creation. SSMA for Oracle can provide migration recommendations for table distribution and indexing.

>[!TIP]
>Existing indexes indicate candidates for indexing in the migrated warehouse.

SQL view definitions contain SQL data manipulation language (DML) statements that define the view, typically with one or more `SELECT` statements. When you migrate `CREATE VIEW` statements, take into account the DML differences between Oracle and Azure Synapse, which are discussed [later](#sql-dml-differences-between-oracle-and-azure-synapse) in this article.

### Unsupported Oracle database object types

Oracle-specific features can often be replaced by Azure Synapse features. However, some Oracle database objects aren't directly supported in Azure Synapse. The following list of unsupported Oracle database objects describes how you can achieve an equivalent functionality in Azure Synapse:

- **Indexing options**: in Oracle, several indexing options, such as bit-mapped indexes, function-based indexes, and domain indexes, have no direct equivalent in Azure Synapse. Although Azure Synapse doesn't support these index types, you can achieve a similar reduction in disk I/O and improve query performance by using user-defined index types and/or partitioning.

  You can find out which columns are indexed and the index type by querying system catalog tables and views, such as `ALL_INDEXES`, `DBA_INDEXES`, `USER_INDEXES`, and `DBA_IND_COL`. Or, you can query the `dba_index_usage` or `v$object_usage` views when monitoring is enabled.

  Azure Synapse features, such as parallel query processing and in-memory caching of data and results, make it likely that fewer indexes are required for data warehouse applications to achieve excellent performance goals.

- **Clustered tables**: Oracle tables can be organized so that table rows that are frequently accessed together (based on a common value) are physically stored together. This strategy reduces disk I/O when data is retrieved. Oracle also has a hash-cluster option for individual tables, which applies a hash value to the cluster key and physically stores rows with the same hash value together.

  In Azure Synapse, you can achieve a similar effect by partitioning and/or using other indexes.

- **Materialized views**: Oracle supports materialized views and recommends one or more of them for large tables with many columns where only a few columns are regularly used in queries. Materialized views are automatically refreshed by the system when data in the base table is updated.

  In 2019, Microsoft announced that Azure Synapse will support materialized views with the same functionality as in Oracle, and materialized views are now a preview feature in Azure Synapse.

- **In-database triggers**: In Oracle, a trigger can be configured to automatically run when a triggering event occurs. Triggering events can be:

  - A DML statement, such as `INSERT`, `UPDATE`, or `DELETE`, that runs on a table. If you defined a trigger that fires before an `INSERT` statement on a customer table, the trigger will fire once before a new row is inserted into the customer table.

  - A data definition language (DDL) statement, such as `CREATE` or `ALTER`, runs. This triggering event is often used for auditing purposes to record schema changes.

  - A system event such as startup or shutdown of the Oracle database.

  - A user event such as login or logout.

  Azure Synapse doesn't support Oracle database triggers. However, you can add equivalent functionality by using Data Factory, although doing so will require you to refactor the processes that use triggers.

- **Synonyms**: Oracle supports defining synonyms as alternative names for several database object types. Those types include tables, views, sequences, procedures, stored functions, packages, materialized views, Java class schema objects, user-defined objects, or another synonym.

  Azure Synapse doesn't currently support defining synonyms, although if a synonym in Oracle refers to a table or view, then you can define a view in Azure Synapse to match the alternative name. If a synonym in Oracle refers to a function or stored procedure, then you can replace the synonym in Azure Synapse by creating another function or stored procedure that calls the target.

- **User-defined types**: Oracle supports defining user-defined objects that can contain a series of individual fields, each with their own definition and default values. Those objects can then be referenced within a table definition in the same way as built-in data types like `NUMBER` or `VARCHAR`.

  Azure Synapse doesn't currently support this feature. If the data you need to migrate includes user-defined data types, either "flatten" them into a conventional table definition, or if arrays of data, normalize them in a separate table.

### Oracle data type mapping

Most Oracle data types have a direct equivalent in Azure Synapse. The following table shows the recommended approach for mapping Oracle data types to Azure Synapse.

| Oracle Data Type | Azure Synapse Data Type |
|-|-|
| BFILE | Not supported. Map to VARBINARY (MAX). |
| BINARY_FLOAT | Not supported. Map to FLOAT. |
| BINARY_DOUBLE | Not supported. Map to DOUBLE. |
| BLOB | Not directly supported. Replace with VARBINARY(MAX). |
| CHAR | CHAR |
| CLOB | Not directly supported. Replace with VARCHAR(MAX). |
| DATE | DATE in Oracle can also contain time information. Depending on usage map to DATE or TIMESTAMP. |
| DECIMAL | DECIMAL |
| DOUBLE | PRECISION DOUBLE |
| FLOAT | FLOAT |
| INTEGER | INT |
| INTERVAL YEAR TO MONTH | INTERVAL data types aren't supported. Use date comparison functions, such as DATEDIFF or DATEADD, for date calculations. |
| INTERVAL DAY TO SECOND | INTERVAL data types aren't supported. Use date comparison functions, such as DATEDIFF or DATEADD, for date calculations. |
| LONG | Not supported. Map to VARCHAR(MAX). |
| LONG RAW | Not supported. Map to VARBINARY(MAX). |
| NCHAR | NCHAR |
| NVARCHAR2 | NVARCHAR |
| NUMBER | NUMBER |
| NCLOB | Not directly supported. Replace with NVARCHAR(MAX). |
| NUMERIC | NUMERIC |
| ORD media data types | Not supported |
| RAW | Not supported. Map to VARBINARY. |
| REAL | REAL |
| ROWID | Not supported. Map to GUID, which is similar. |
| SDO Geospatial data types | Not supported |
| SMALLINT | SMALLINT |
| TIMESTAMP | DATETIME2 or the CURRENT_TIMESTAMP() function |
| TIMESTAMP WITH LOCAL TIME ZONE | Not supported. Map to DATETIMEOFFSET. |
| TIMESTAMP WITH TIME ZONE | Not supported because TIME is stored using wall-clock time without a time zone offset. |
| URIType | Not supported. Store in a VARCHAR. |
| UROWID | Not supported. Map to GUID, which is similar. |
| VARCHAR | VARCHAR |
| VARCHAR2 | VARCHAR |
| XMLType | Not supported. Store XML data in a VARCHAR. |

>[!TIP]
>Assess the number and type of unsupported data types during your preparation phase.

Third-party vendors offer tools and services to automate migration, including the mapping of data types. If a third-party ETL tool, such as Informatica or Talend, is already in use in the Oracle environment, use that tool to implement any required data transformations.

#### Data Definition Language (DDL) generation

>[!TIP]
>Use existing Oracle metadata to automate the generation of CREATE TABLE and CREATE VIEW DDL for Azure Synapse.

You can edit existing Oracle `CREATE TABLE` and `CREATE VIEW` scripts to achieve equivalent definitions in Azure Synapse. To do so, you might need to use [modified data types](#oracle-data-type-mapping) and remove or modify Oracle-specific clauses, such as `TABLESPACE`.

Within the Oracle environment, system catalog tables specify the current table and view definition. Unlike user-maintained documentation, system catalog information is always complete and in sync with the current table definitions. You can access system catalog information by using utilities such as Oracle SQL Developer. Oracle SQL Developer can generate `CREATE TABLE` DDL statements that you can edit to make them apply to equivalent tables in Azure Synapse, as shown in the next screenshot.

:::image type="content" source="../media/5-minimize-sql-issues/oracle-sql-developer-ddl.png" border="true" alt-text="Screenshot showing the create table statement generated by Oracle SQL Developer.":::

Oracle SQL Developer outputs the following `CREATE TABLE` statement, which contains Oracle-specific clauses:

:::image type="content" source="../media/5-minimize-sql-issues/notepad-create-table-statement.png" border="true" alt-text="Screenshot showing the Quick DDL menu option in Oracle SQL Developer.":::

Remove the Oracle-specific clauses and map any unsupported data types before running on Azure Synapse.

Alternatively, you can automate generating `CREATE TABLE` statements from the information within Oracle catalog tables by using SQL queries, SSMA, or third-party migration tools. This approach is the fastest and most consistent way to generate `CREATE TABLE` statements for many tables.

>[!TIP]
>Third-party tools and services can automate data mapping tasks.

Third-party vendors offer tools and services to automate migration, including the mapping of data types. If a third-party ETL tool, such as Informatica or Talend, is already in use in the Oracle environment, use that tool to implement any required data transformations.

## SQL DML differences between Oracle and Azure Synapse

### SQL Data Manipulation Language

The ANSI SQL standard defines the basic syntax for DML commands, such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Although Oracle and Azure Synapse both support DDL commands, in some cases they implement the same command differently.

>[!TIP]
>The standard SQL DML commands `SELECT`, `INSERT`, and `UPDATE` can have additional syntax options in different database environments.

The following sections discuss the Oracle-specific DML commands that need to be considered during a migration to Azure Synapse.

### SQL DML syntax differences

There are some SQL DML syntax differences between Oracle SQL and Azure Synapse T-SQL:

- `DUAL` table: Oracle has a system table named `DUAL` that consists of exactly one column named `dummy`, and one record with the value `X`. That system table is used when a query requires a table name for syntax reasons, but the table content isn't needed.

  An example Oracle query that uses the `dummy` table is `SELECT sysdate from dual;`. The Azure Synapse equivalent is `SELECT GETDATE();`. To simplify migration, you could create an equivalent `DUAL` table in Azure Synapse:

  ```sql
  CREATE TABLE DUAL
  (
    DUMMY VARCHAR(1)
  )
  GO
  INSERT INTO DUAL (DUMMY)
  VALUES ('X')
  GO
  ```

- `NULL` values: a `NULL` value in Oracle is an empty string, represented by a `CHAR` or `VARCHAR` string type of length `0`. In Azure Synapse and most other databases, [`NULL`](/sql/t-sql/language-elements/null-and-unknown-transact-sql) means something different. Be careful when migrating data, or processes that handle or store data, to ensure that `NULL` values are handled consistently.

- Oracle outer join syntax: although more recent versions of Oracle support ANSI outer join syntax, older Oracle systems use a proprietary syntax for outer joins that uses a plus sign (`+`) within the SQL statement. If you're migrating an older Oracle environment, you might encounter the older syntax. For example:

  ```SQL
  SELECT
      d.deptno, e.job
  FROM
      dept d,
      emp e
  WHERE
      d.deptno = e.deptno (+)
      AND e.job (+) = 'CLERK'
  GROUP BY
      d.deptno, e.job;
	```

  The equivalent ANSI standard syntax is:

  ```SQL
  SELECT
      d.deptno, e.job
  FROM
      dept d
      LEFT OUTER JOIN emp e ON d.deptno = e.deptno
      and e.job = 'CLERK'
  GROUP BY
      d.deptno,
      e.job
  ORDER BY
      d.deptno, e.job;
  ```

- `DATE` data: in Oracle, the `DATE` data type can store both date and time. Azure Synapse stores date and time in separate `DATE`, `TIME`, and `DATETIME` data types. When migrating Oracle `DATE` columns, check whether they store both date and time or just a date. If they only store a date, then map the column to `DATE`, otherwise to `DATETIME`.

- `DATE` arithmetic: Oracle supports subtracting one date from another, for example `SELECT date '2018-12-31' -- date '2018-1201' from dual;`. In Azure Synapse, you can subtract dates by using the `DATEDIFF()` function, for example `SELECT DATEDIFF(day, '2018-12-01', '2018-12-31');`.

  Oracle can subtract integers from dates, for example `SELECT hire_date, (hire_date-1) FROM employees;`. In Azure Synapse, you can add or subtract integers from dates by using the `DATEADD()` function.

- Updates via views: in Oracle you can run insert, update, and delete operations against a view to update the underlying table. In Azure Synapse, you run those operations against a base table&mdash;not a view. You might have to re-engineer ETL processing if an Oracle table is updated through a view.

- Built-in functions: the following table shows the differences in the syntax or usage of some built-in functions:

| Oracle Function | Description | Synapse equivalent |
|-|-|-|
| ADD_MONTHS | Add a specified number of months | DATEADD |
| CAST | Convert one built-in data type into another | CAST |
| DECODE | Evaluate a list of conditions | CASE expression |
| EMPTY_BLOB | Create an empty BLOB value | '0x' constant (empty binary string) |
| EMPTY_CLOB | Create an empty CLOB or NCLOB value | '' (empty string) |
| INITCAP | Capitalize the first letter of each word | User-defined function |
| INSTR | Find position of a substring in a string | CHARINDEX |
| LAST_DAY | Get the last date of month | EOMONTH |
| LENGTH | Get string length in characters | LEN |
| LPAD | Left-pad string to the specified length | Expression using REPLICATE, RIGHT and LEFT |
| MOD | Get the remainder of a division of one number by another | % operator |
| MONTHS_BETWEEN | Get the number of months between two dates | DATEDIFF |
| NVL | Replace NULL with expression  | ISNULL |
| SUBSTR | Return a substring from a string | SUBSTRING |
| TO_CHAR for datetime | Convert datetime to string | CONVERT |
| TO_DATE | Convert a string to datetime | CONVERT |
| TRANSLATE | One-to-one single character substitution | Expressions using REPLACE or a user-defined function |
| TRIM | Trim leading or trailing characters | LTRIM and RTRIM |
| TRUNC for datetime | Truncate datetime | Expressions using CONVERT |
| UNISTR | Convert Unicode code points to characters | Expressions using NCHAR |

### Functions, stored procedures, and sequences

If you migrate from a mature data warehouse environment like Oracle, you'll probably need to migrate elements other than simple tables and views, such as functions, stored procedures, and sequences. For those elements, check whether tools within the Azure environment can replace their functionality because it's usually more efficient to use built-in Azure facilities than recode the Oracle functions.

>[!TIP]
>Assess the number and type of unsupported data types during the preparation phase.

As part of your preparation phase, create an inventory of objects that need to be migrated, define a method for handling them, and allocate appropriate resources in your migration plan.

[Data integration partners](../../partner/data-integration.md) like Attunity and WhereScape offer tools and services that automate the migration of functions, stored procedures, and sequences.

Microsoft tools like SSMA for Oracle or [Azure Database Migration Services](/services/database-migration/), or [third-party](../../partner/data-integration.md) migration products and services like Attunity and WhereScape can automate the migration of functions, stored procedures, and sequences.

>[!TIP]
>Third-party products and services can automate migration of non-data elements.

The following sections further discuss the migration of functions, stored procedures, and sequences.

#### Functions

In common with most database products, Oracle supports system functions and also user-defined functions within the SQL implementation. When migrating to another database platform such as Azure Synapse common system functions are generally available and can be migrated without change. Some system functions may have slightly different syntax but the required changes can be automated in this case. For system functions where there's no equivalent, of for arbitrary user-defined functions these may need to be recoded using the language(s) available in the target environment. Oracle user-defined functions are coded in PL/SQL, Java or C languages whereas Azure Synapse uses the popular Transact-SQL language for implementation of user-defined functions.

#### Stored procedures

Most modern database products allow for procedures to be stored within the database -- in Oracle's case the PL/SQL language is provided for this purpose. A stored procedure typically contains SQL statements and some procedural logic and may return data or a status. Azure Synapse also supports stored procedures using T-SQL -- so if there are stored procedures to be migrated they must be recoded accordingly.

#### Sequences

In Oracle a sequence is a named database object created via CREATE SEQUENCE that can provide the unique value via the NEXT VALUE FOR method. These can be used to generate unique numbers that can be used as surrogate key values for primary key values. Within Azure Synapse there's no CREATE SEQUENCE so sequences are handled via use of IDENTITY columns or using SQL code to create the next sequence number in a series.

### Use EXPLAIN to validate legacy SQL

>[!TIP]
>Use real queries from the existing system query logs to find potential migration issues.

One way of testing legacy Oracle SQL for compatibility with Azure Synapse is to capture some representative SQL statements from the legacy system query history logs, then prefix those queries with 'EXPLAIN ' and then (assuming a 'like for like' migrated data model in Azure Synapse with the same table and column names) run those EXPLAIN statements in Azure Synapse. Any incompatible SQL will give an error -- and this information can be used to determine the scale of the recoding task. This approach doesn't require that data is loaded into the Azure environment, only that the relevant tables and views have been created.

## Summary

Typical existing legacy Oracle installations are implemented in a way that makes migration to Azure Synapse relatively easy -- i.e. they use SQL for analytical queries on large data volumes, and are generally in some form of dimensional data model. All of these factors make it a good candidate for migration to Azure Synapse.

Recommendations for minimizing the task of migrating the actual SQL code are as follows:

- Initial migration of the data warehouse should be 'as-is' to minimize risk and time taken (even if the eventual final environment will incorporate a different data model such as Data Vault)

- Understand the differences between Oracle SQL implementation and Azure Synapse

- Use metadata and query logs from the existing Oracle implementation to assess the impact of the differences and plan an approach to mitigate those

- Automate the process wherever possible to minimize errors, risk and time for the migration. Use Microsoft facilities such as Azure Database Migration Services and SSMA where possible to achieve this.

- Consider using specialist third-party tools and services to streamline the migration.

## Next steps

To learn about migrating to a dedicated SQL pool, see [Migrate a data warehouse to a dedicated SQL pool in Azure Synapse Analytics](../migrate-to-synapse-analytics-guide.md).