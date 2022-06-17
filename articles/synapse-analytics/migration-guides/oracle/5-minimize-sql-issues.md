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

This article is part five of a seven part series that provides guidance on how to migrate from Oracle to Azure Synapse Analytics. This article provides best practices for minimizing SQL issues.

## Minimizing SQL issues for Oracle migrations

This article looks at SQL syntax migration with a goal of equivalent or better performance of your migrated Oracle data warehouse and data marts on Azure Synapse. This article applies specifically to migrations from an existing Oracle environment.

#### Characteristics of Oracle environments

Oracle pioneered the 'data warehouse appliance' concept in the early 2000's

The initial Oracle database product was released in 1979 and was designed as a commercial implementation of a SQL relational database that could handle on-line transaction processing (OLTP) applications (of course, the typical transaction rates required were much lower then). Since that initial release the product has evolved to become the complex environment of today, encompassing features such as client-server architectures, distributed databases, parallel processing, data analytics, high availability, data warehousing, data in memory techniques and support for cloud-based instances.

Given the cost and complexity of maintaining and upgrading legacy on-premises Oracle environments, many existing users of Oracle data warehouse systems are now looking to take advantage of the innovations provided by newer environments (e.g. cloud, IaaS, PaaS) and to delegate tasks such as infrastructure maintenance and platform development to the cloud provider.

Most existing Oracle installations are on-premises, and therefore many users are considering migrating some or all of their Oracle data to Azure Synapse to gain the benefits of a move to a modern cloud environment.

Many existing Oracle installation are data warehouses using a dimensional data model

Oracle technology has often been used to implement a data warehouse, supporting complex analytic queries on large data volumes using SQL. Dimensional data models (star or snowflake schemas) are common, as is the implementation of 'data marts' for individual departments.

This combination of SQL and dimensional data models simplifies migration to Azure Synapse as the basic concepts and SQL skills are transferable. The recommended approach is to migrate the existing data model 'as-is' to reduce risk and time taken. Even if the eventual intention is to make changes to the data model (e.g. moving to a Data Vault model) it makes sense to initially perform an 'as-is' migration and then make changes within the Azure cloud environment, leveraging the performance, elastic scalability and cost advantages there.

While the SQL language has been standardized, individual vendors have in some cases implemented proprietary extensions -- this document is intended to highlight potential SQL differences which may be encountered during migration from a legacy Oracle environment and to provide workarounds to those.

#### Use Azure facilities to implement a metadata-driven migration

Automate the migration process by using Azure Data Factory capabilities

It makes sense to automate and orchestrate the migration process by making use of the capabilities in the Azure environment. This approach also minimizes the impact on the existing Oracle environment (which may already running close to full capacity).

Azure Data Factory is a cloud-based data integration service that allows creation of data-driven workflows in the cloud for orchestrating and automating data movement and data transformation. Using Azure Data Factory, you can create and schedule data-driven workflows (called pipelines) that can ingest data from disparate data stores. It can process and transform the data by using compute services such as Azure HDInsight Hadoop, Spark, Azure Data Lake Analytics, and Azure Machine Learning.

Azure also includes Database Migration Services to help in planning and executing a migration from environments such as Oracle, and SQL Server Migration Assistant for Oracle can automate migration of Oracle databases and some cases functions and procedural code.

By creating metadata to list the data tables to be migrated and their location, it is possible to use these Azure facilities to manage and automate some or all of the migration process.

### SQL DDL differences between Oracle and Azure Synapse

#### SQL Data Definition Language (DDL)

SQL DDL commands CREATE TABLE and CREATE VIEW have standard core elements but are also used to define implementation-specific options

The ANSI SQL standard defines the basic syntax for DDL commands such as CREATE TABLE and CREATE VIEW which are used within both Oracle and Azure Synapse, but these commands have also been extended to allow definition of implementation-specific features such as indexing, table distribution and partitioning options.

The following sections discuss the Oracle-specific options which need to be considered during migration to Azure Synapse.

#### Table/view considerations

Use existing indexes to give an indication of candidates for indexing in the migrated warehouse

When migrating SQL tables between different technologies it is generally only the raw data (and the metadata that describes it) that gets physically moved between the 2 environments. Other database elements from the source system (e.g. indexes, log files) are not directly migrated as these may not be needed, or may be implemented differently within the new target environment. For example, the TEMPORARY option within Oracle's CREATE TABLE syntax is equivalent to prefixing the table name with a '#' character in Azure Synapse.

However, it is important to understand where performance optimizations such as indexes have been used in the source environment as this information can give useful indication of where performance optimization might be added in the new target environment. For example, if bit-mapped indexes has been created within the source Oracle environment, it may indicate that a non-clustered index should be created within the migrated Azure Synapse -- but also be aware that other native performance optimization techniques (such as table replication or materialized views) may be more applicable than a straight 'like for like' creation of indexes.

A SQL view definition contains SQL data manipulation language (DML) statements which define the view (typically one or more SELECT statements), and so migration of the CREATE VIEW statement will need to take account of any differences in DML between Oracle and Azure Synapse (e.g. differences in built-in functions such as DATEDIFF). These are discussed in more detail in the sections below.

#### Unsupported Oracle database object types

Oracle-specific features can be replaced by Azure Synapse features

Oracle implements some database objects that are not directly supported in Azure Synapse, but there are generally methods to achieve the same functionality within the new environment:

- Various indexing options -- In Oracle there are several indexing options which have no direct equivalent in Azure Synapse. For example, bit-mapped indexes, function-based indexes and domain indexes.

Azure Synapse does not specifically include these index types, but similar results (i.e. reduction of disk I/O to improve performance when running queries) can be achieved by using other (user-defined) index types and/or partitioning. It is possible to find out which columns are indexed and the index type by querying system catalog tables and views such as ALL_INDEXES, DBA_INDEXES and USER_INDEXES. It is also possible to find which indexes are actually used by querying the v\$object_usage view if monitoring has been enabled. It is not unusual for a data warehouse migrated to Synapse to need fewer indexes than the original Oracle data warehouse due to implementation features such as parallel query processing, result set caching which can provide excellent performance without the need for indexes.

- Clustered tables -- In Oracle tables can be organized so that rows of tables that are frequently accessed together (based on a common value) are physically stored together, reducing disk I/O when this data is retrieved. There is also a hash-cluster option for individual tables, where a hash value is applied to the cluster key and rows with the same hash value are stored physically close together.

In Azure Synapse a similar effect can be achieved by use of partitioning and/or use of other indexes.

- Materialized views -- Oracle supports materialized views and recommends that 1 (or more) of these is created over large tables that have many columns where only a few of those columns are regularly used in queries. Materialized views are automatically maintained by the system when data in the base table is updates.

As of May 2019, Microsoft has announced that Azure Synapse will support materialized views which have the same functionality as Oracle -- this feature is now available in preview.

- In-database triggers -- A trigger in Oracle is executed automatically when a triggering event takes place. The event can be any of the following:

- A data manipulation language (DML) statement executed against a table e.g., INSERT, UPDATE, or DELETE. For example, if you define a trigger that fires before an INSERT statement on the customers table, the trigger will fire once before a new row is inserted into the customers table.

- A data definition language (DDL) statement executes e.g., CREATE or ALTER statement. These triggers are often used for auditing purposes to record changes of the schema.

- A system event such as startup or shutdown of the Oracle Database.

- A user event such as login or logout.

Azure Synapse does not currently support this functionality within the database -- however equivalent functionality can be incorporated using Azure Data Factory though this will require refactoring of processes that use triggers.

- Synonyms -- Oracle allows the definition of synonyms which are alternative names for a table, view, sequence, procedure, stored function, package, materialized view, Java class schema object, user-defined object type, or another synonym.

Azure Synapse does not currently support this feature -- if the synonym refers to a table or view, then a view can be defined to provide an alternative name. If the synonym refers to a function or stored procedure then another function or procedure which calls the target can replace the synonym.

- User-defined types -- Oracle allows the definition of user-defined objects which can contain a series of individual fields, each with their own definition and default values. These user-defined objects can then be referenced within a table definition in the same way as built-in data types (e.g. NUMBER or VARCHAR).

Azure Synapse does not currently support this feature -- if the data to be migrated includes user-defined data types, they must be either 'flattened' into a conventional table definition, or normalized to a separate table in the case of arrays of data.

#### Oracle data type mapping

Assess the impact of unsupported data types as part of the preparation phase

Most Oracle data types have a direct equivalent in the Azure Synapse -- below is a table which shows these data types together with the recommended approach for mapping these.

&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- Oracle Data Type Azure Synapse Data Type &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;- &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; BFILE Not supported in Azure Synapse Analytics but can map to VARBINARY (MAX)

BINARY_FLOAT Not supported in Azure Synapse Analytics but can map to FLOAT

BINARY_DOUBLE Not supported in Azure Synapse Analytics but can map to DOUBLE

BLOB BLOB data type isn\'t directly supported but can be replaced with VARBINARY(MAX)

CHAR CHAR

CLOB CBLOB data type isn\'t directly supported but can be replaced with VARCHAR(MAX)

DATE DATE in Oracle an contain time information as well. Therefore depending on usage it can map to DATE or TIMESTAMP

DECIMAL DECIMAL

DOUBLE PRECISION DOUBLE

FLOAT FLOAT

INTEGER INT

INTERVAL YEAR TO MONTH INTERVAL data types aren\'t supported in Azure Synapse Analytics. but date calculations can be done with the date comparison functions (e.g. DATEDIFF and DATEADD)

INTERVAL DAY TO SECOND INTERVAL data types aren\'t supported in Azure Synapse Analytics. but date calculations can be done with the date comparison functions (e.g. DATEDIFF and DATEADD)

LONG  Not supported in Azure Synapse Analytics but can map to VARCHAR(MAX)

LONG RAW Not supported in Azure Synapse Analytics but can map to VARBINARY(MAX)

NCHAR NCHAR

NVARCHAR2 NVARCHAR

NUMBER  NUMBER

NCLOB NCLOB data type isn\'t directly supported but can be replaced with NVARCHAR(MAX)

NUMERIC NUMERIC

ORD media data types Not supported in Azure Synapse Analytics

RAW Not supported in Azure Synapse Analytics but could map to VARBINARY

REAL REAL

ROWID Not supported in Azure Synapse Analytics but may map to GUID as this is similar

SDO Geospatial data types Not supported in Azure Synapse Analytics

SMALLINT SMALLINT

TIMESTAMP DATETIME2 and CURRENT_TIMESTAMP function

TIMESTAMP WITH LOCAL TIME TIME WITH LOCAL TIME ZONE is not supported ZONE in Azure Synapse Analytics but can map to DATETIMEOFFSET

TIMESTAMP WITH TIME ZONE TIME WITH TIME ZONE isn\'t supported because TIME is stored using \"wall clock\" time only without a time zone offset

URIType URIType is not supported but a URI can be stored in a VARCHAR

UROWID Not supported in Azure Synapse Analytics but may map to GUID as this is similar

VARCHAR VARCHAR

VARCHAR2  VARCHAR

XMLType XMLType is not supported in Azure Synapse Analytics but XML data could be accommodated in a VARCHAR &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--

#### Data Definition Language (DDL) generation

Use existing Oracle metadata to automate the generation of CREATE TABLE and CREATE VIEW DDL for Azure Synapse

It is possible to edit existing Oracle CREATE TABLE and CREATE VIEW scripts to create the equivalent definitions (with modified data types as described above if necessary) -- typically this involves removing or modifying any extra Oracle-specific clauses (e.g. TABLESPACE definition).

However, all the information that specifies the current definitions of tables and views within the existing Oracle environment is maintained within system catalog tables. This is the best source of this information as it is bound to be up to date and complete. Be aware that user-maintained documentation may not be in sync with the current table definitions.

This information can be accessed via utilities such as SQL Developer and can be used to generate the CREATE TABLE DDL statements which can then be edited for the equivalent tables in Azure Synapse. See screenshot below:

:::image type="content" source="../media/5-minimize-sql-issues/oracle-sql-developer-ddl.png" border="true" alt-text="Screenshot showing the create table statement generated by Oracle SQL Developer.":::

This generated the following CREATE TABLE statement:

:::image type="content" source="../media/5-minimize-sql-issues/notepad-create-table-statement.png" border="true" alt-text="Screenshot showing the Quick DDL menu option in Oracle SQL Developer.":::

This contains Oracle-specific clauses that need to be removed before running on Azure Synapse, and it also may be required to perform some data type mapping before creating the table. Therefore another approach is to generate CREATE TABLE statements form the information in the Oracle catalog tables which performs this automatically. The automated approach also means that this process can be done quickly and consistently for many tables. This can be achieved via SQL queries, or migration tools from Microsoft (Azure Database Migration Services or SSMA) or third parties.

Third party tools and services can automate data mapping tasks

There are third party vendors who offer tools and services to automate migration including the mapping of data types as described above. Also, if a third party ETL tool such as Informatica or Talend is already in use in the Oracle environment, these can implement any required data transformations.

### SQL DML differences between Oracle and Azure Synapse

#### SQL Data Manipulation Language (DML)

SQL DML commands SELECT, INSERT and UPDATE have standard core elements but may also implement different syntax options

The ANSI SQL standard defines the basic syntax for DML commands such as SELECT, INSERT, UPDATE and DELETE which are used within both Oracle and Azure Synapse, but in some cases there are implementation differences.

The following sections discuss the Oracle-specific DML commands which need to be considered during migration to Azure Synapse.

#### SQL DML syntax differences

There are some differences in SQL Data Manipulation Language (DML) syntax between Oracle SQL and Azure Synapse to be aware of when migrating:

- DUAL table -- in Oracle there is a system table which consists of exactly one column named 'dummy', and one record (with the value 'X'). It is used when a query requires a table name (for syntax reasons) but the actual contents of the table is not needed -- e.g.

SELECT sysdate from dual; The Azure Synapse equivalent of this is simply SELECT GETDATE(); During a migration it may be simpler to create an equivalent DUAL table in Azure Synapse -- this can be done as follows: CREATE TABLE DUAL\ (\ DUMMY VARCHAR(1)\ )\ GO\ INSERT INTO DUAL (DUMMY)\ VALUES (\'X\')\ GO

- NULL values -- in Oracle the empty string (i.e. a CHAR or VARCHAR string of length 0) is equivalent to a NULL value -- this is not the case in Azure Synapse (or indeed most other databases). Therefore care must be taken when migrating data and processes which store and handle these values to ensure consistency.

- Oracle outer join syntax -- While more recent versions of Oracle support ANSI outer join syntax, older Oracle systems used a proprietary syntax for outer joins which uses a plus sign ('+') within the SQL statement and if migrating an older Oracle environment these may still be in place. A simple example is shown below:

Old Oracle syntax:

SELECT d.deptno, e.job FROM dept d, emp e WHERE d.deptno = e.deptno (+) AND e.job (+) = \'CLERK\' GROUP BY d.deptno, e.job; ANSI standard syntax: SELECT d.deptno, e.job FROM dept d LEFT OUTER JOIN emp e ON d.deptno = e.deptno and e.job = \'CLERK\' GROUP BY d.deptno, e.job ORDER BY d.deptno, e.job;

- DATE data -- Oracle DATE data type can store date and time, whereas in Azure Synapse there are separate DATE, TIME and DATETIME data types. When migrating it is good practice to examine the usage of Oracle DATE columns to determine whether time data is being stored in there, or only the date. If no time data is being stored, map the column to DATE , otherwise to DATETIME.

- DATE arithmetic -- Oracle allows subtraction of one date from another date (for example, SELECT date '2018-12-31' -- date '2018-1201' from dual;). In Azure Synapse, to do this same type of date comparison, use the DATEDIFF function (for example, SELECT DATEDIFF(day, '2018-12-01', '2018-12-31')). Oracle can also subtract integers from dates, for example, SELECT hire_date, (hire_date-1) FROM employees. In Azure Synapse the DATEADD function is used to add or subtract units from dates.

- Updates via VIEWS -- Oracle allows inserts, updates, and deletes to be executed against a view, which will then update the underlying table. In Azure Synapse, you must execute inserts, updates, and deletes against a base table and not against a view. It may be necessary to re-engineer ETL processing if this feature is used.

- Built-in functions -- there are differences in the syntax or usage of some built-in functions -- see table below:

&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- **Oracle Function** **Description** **Synapse equivalent** &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;- &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;-- ADD_MONTHS Add specified number of DATEADD months 

CAST Convert one built-in CAST data type into another 

DECODE Evaluate a list of CASE Expression conditions 

EMPTY_BLOB Create an empty BLOB 0x Constant (Empty value binary string)

EMPTY_CLOB Create an empty CLOB or \'\' (Empty string) NCLOB value 

INITCAP Capitalize the first User-defined function letter of each word 

INSTR Find position of CHARINDEX substring in string 

LAST_DAY Get last date of month EOMONTH

LENGTH Get string length in LEN characters 

LPAD Left-pad string to the Expression using specified length REPLICATE, RIGHT and LEFT

MOD Get the remainder of \% Operator division of one number by another 

MONTHS_BETWEEN Get number of months DATEDIFF between two dates 

NVL Replace NULL with ISNULL expression 

SUBSTR Return a substring from SUBSTRING string 

TO_CHAR for Datetime Convert datetime to CONVERT string 

TO_DATE Convert string to CONVERT datetime 

TRANSLATE One-to-one single Expressions using character substitution REPLACE or User defined function

TRIM Trim leading or trailing LTRIM and RTRIM characters 

TRUNC for Datetime Truncate datetime Expressions using CONVERT

UNISTR Convert Unicode code Expressions using NCHAR points to characters &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;--

#### Functions, stored procedures and sequences

Assess the number and type of non-data objects to be migrated as part of the preparation phase

When migrating from a mature legacy data warehouse environment such as Oracle there are often elements other than simple tables and views which need to be migrated to the new target environment. Examples of this in Oracle are Functions, Stored Procedures, and Sequences.

As part of the preparation phase, an inventory of these objects which are to be migrated should be created and the method of handling them defined, with an appropriate allocation of resources assigned in the project plan.

It may be that there are facilities in the Azure environment that replace the functionality implemented as functions or stored procedures in the Oracle environment -- in which case it is generally more efficient to use the built-in Azure facilities rather than re-coding the Oracle functions.

third part products and services can automate migration of non-data elements

Microsoft tools such as Azure Database Migration Services or SSMA and some third party vendors offer tools and services that can automate the migration of these -- see for example see Attunity or WhereScape migration products.

See below for more information on each of these elements:

##### Functions

In common with most database products, Oracle supports system functions and also user-defined functions within the SQL implementation. When migrating to another database platform such as Azure Synapse common system functions are generally available and can be migrated without change. Some system functions may have slightly different syntax but the required changes can be automated in this case. For system functions where there is no equivalent, of for arbitrary user-defined functions these may need to be re-coded using the language(s) available in the target environment. Oracle user-defined functions are coded in PL/SQL, Java or C languages whereas Azure Synapse uses the popular Transact-SQL language for implementation of user-defined functions.

##### Stored procedures

Most modern database products allow for procedures to be stored within the database -- in Oracle's case the PL/SQL language is provided for this purpose. A stored procedure typically contains SQL statements and some procedural logic and may return data or a status. SQL Azure Data Warehouse also supports stored procedures using T-SQL -- so if there are stored procedures to be migrated they must be recoded accordingly.

##### Sequences

In Oracle a sequence is a named database object created via CREATE SEQUENCE that can provide the unique value via the NEXT VALUE FOR method. These can be used to generate unique numbers that can be used as surrogate key values for primary key values. Within Azure Synapse there is no CREATE SEQUENCE so sequences are handled via use of IDENTITY columns or using SQL code to create the next sequence number in a series.

#### Use EXPLAIN to validate legacy SQL

Use real queries from the existing system query logs to find potential migration issues

One way of testing legacy Oracle SQL for compatibility with Azure Synapse is to capture some representative SQL statements from the legacy system query history logs, then prefix those queries with 'EXPLAIN ' and then (assuming a 'like for like' migrated data model in Azure Synapse with the same table and column names) run those EXPLAIN statements in Azure Synapse. Any incompatible SQL will give an error -- and this information can be used to determine the scale of the re-coding task. This approach doesn't require that data is loaded into the Azure environment, only that the relevant tables and views have been created.

## Summary

Typical existing legacy Oracle installations are implemented in a way which makes migration to Azure Synapse relatively easy -- i.e. they use SQL for analytical queries on large data volumes, and are generally in some form of dimensional data model. All of these factors make it a good candidate for migration to Azure Synapse.

Recommendations for minimizing the task of migrating the actual SQL code are as follows:

- Initial migration of the data warehouse should be 'as-is' to minimize risk and time taken (even if the eventual final environment will incorporate a different data model such as Data Vault)

- Understand the differences between Oracle SQL implementation and Azure Synapse

- Use metadata and query logs from the existing Oracle implementation to assess the impact of the differences and plan an approach to mitigate those

- Automate the process wherever possible to minimize errors, risk and time for the migration. Use Microsoft facilities such as Azure Database Migration Services and SSMA where possible to achieve this.

- Consider using specialist third party tools and services to streamline the migration 

## Next steps

To learn about migrating to a dedicated SQL pool, see [Migrate a data warehouse to a dedicated SQL pool in Azure Synapse Analytics](../migrate-to-synapse-analytics-guide.md).