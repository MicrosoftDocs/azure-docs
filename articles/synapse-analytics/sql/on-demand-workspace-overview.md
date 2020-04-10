---
title: SQL on-demand (preview)
description: Learn about Synapse SQL on-demand in Azure Synapse Analytics.
services: sql-datawarehouse
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.date: 10/24/2019
ms.author: vvasic
ms.reviewer: jrasnick
---
# SQL on-demand (preview) in Azure Synapse Analytics

Every Azure Synapse Analytics workspace (preview) comes with SQL on-demand (preview) endpoints that you can use to query data in the lake.

SQL on-demand is a query service over the data in your data lake. It enables you to democratize access to all your data by providing a familiar T-SQL syntax to query data in place, without a need to copy or load data into a specialized store. In addition, the T-SQL interface enables seamless connectivity from the widest range of business intelligence and ad-hoc querying tools, as well as the most popular drivers.  

SQL on-demand is a distributed data processing system, built for large scale of data and compute, enabling you to analyze your Big Data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving vert large data sets.

SQL on-demand is serverless, hence there is no infrastructure to setup or clusters to maintain. A default endpoint for this service is provided within every Azure Synapse workspace, so you can start querying data as soon as the workspace is created. There is no charge for resources reserved, you are only being charged for the data scanned by queries you run, hence this model is a true pay-per-use model.  

If you use Spark in your data pipeline, for data preparation, cleansing or enrichment, you can [query any Spark tables](develop-storage-files-spark-tables.md) you've created in the process, directly from SQL on-demand. Use Private Link to bring SQL on-demand endpoint into your private virtual network by mapping it to a private IP address. Keep your data secured using familiar SQL-based security mechanisms.  

## Who is SQL on-demand for

If you need to explore data in the data lake, gain insights from it or optimize your existing data transformation pipeline, you can benefit from using SQL on-demand. It is suitable for the following scenarios:

- Basic discovery and exploration - Quickly reason about the data in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to extract insights from it.
- Logical data warehouse – Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing always up-to-date view of your data.
- Data transformation - Simple, scalable, and performant way to transform data in the lake using T-SQL, so it can fed to BI and other tools, or loaded into a relational data store (Synapse SQL databases, Azure SQL Database, etc.).

Different professional roles can benefit from SQL on-demand:

- Data Engineers can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines. For more information, check this tutorial
- Data Scientists can quickly reason about the contents and structure of the data in the lake, thanks to features such as OPENROWSET and automatic schema inference
- Data Analysts can [explore data and Spark tables](develop-storage-files-spark-tables.md) created by Data Scientists or Data Engineers using familiar T-SQL language or their favorite tools that can connect to SQL on-demand
- BI Professionals can quickly [create Power BI reports on top of data in the lake](tutorial-connect-power-bi-desktop.md) and Spark tables

## What do I need to do to start using it?

SQL on-demand endpoint is provided within every Azure Synapse workspace. You can create a workspace and start querying data instantly using tools you are familiar with.

## Client tools

SQL on-demand enables existing SQL ad-hoc querying and business intelligence tools to tap into the data lake. As it provides familiar T-SQL syntax, any tool capable to establish TDS connection SQL offerings can [connect to and query Synapse SQL](connect-overview.md) on-demand. You can connect with Azure Data Studio and run ad-hoc queries or connect with Power BI to gain insights in a matter of minutes.

At this moment, latest version of Azure Data Studio is fully supported. Latest version of SSMS can be used to connect and query but is not supported yet. It will be fully supported until GA. Please make sure you use latest versions of tools.

## Is full T-SQL supported?

SQL on-demand offers T-SQL querying surface area, which is slightly enhanced/extended in some aspects to accommodate for experiences around querying semi-structured and unstructured data. Furthermore, some aspects of T-SQL language are not supported due to the design of SQL on-demand, as an example, DML functionality is currently not supported.

- Workload can be organized using familiar concepts:
- Databases - SQL on-demand endpoint can have multiple databases.
- Schemas - Within a database, there can be one or many object ownership groups called schemas.
- Views
- External resources – data sources, file formats, and tables

Security can be enforced using:

- Logins and users
- Credentials to control access to storage accounts
- Grant, deny, and revoke permissions per object level
- Azure Active Directory integration

Supported T-SQL:

- Full [SELECT](/sql/t-sql/queries/select-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) surface area is supported, including majority of SQL functions
- CETAS - CREATE EXTERNAL TABLE AS SELECT
- DDL statements related to views and security only

SQL on-demand has no local storage, only metadata objects are stored in databases. Therefore, T-SQL related to following concepts is not supported:

- Tables
- Triggers
- Materialized views
- DDL statements other than those related to views and security
- DML statements

### Extensions

In order to enable smooth experience for in place querying of data residing in files in data lake, SQL on-demand extends the existing [OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) function by adding following capabilities:

[Query multiple files or folders](develop-storage-files-overview.md#query-multiple-files-or-folders)

[PARQUET file format](develop-storage-files-overview.md#parquet-file-format)

[Additional options for working with delimited text (field terminator, row terminator, escape char)](develop-storage-files-overview.md#additional-options-for-working-with-delimited-text)

[Read a chosen subset of columns](develop-storage-files-overview.md#read-a-chosen-subset-of-columns)

[Schema inference](develop-storage-files-overview.md#schema-inference)

[filename function](develop-storage-files-overview.md#filename-function)

[filepath function](develop-storage-files-overview.md#filepath-function)

[Work with complex types and nested or repeated data structures](develop-storage-files-overview.md#work-with-complex-types-and-nested-or-repeated-data-structures)

## Security

SQL on-demand offers mechanisms to secure access to your data.

### Azure Active Directory integration and multi-factor authentication

SQL on-demand enables you to centrally manage identities of database user and other Microsoft services with [Azure Active Directory integration](../../sql-database/sql-database-aad-authentication.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json). This capability simplifies permission management and enhances security. Azure Active Directory (AAD) supports [multi-factor authentication](../../sql-database/sql-database-ssms-mfa-authentication-configure.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) (MFA) to increase data and application security while supporting a single sign-on process.

#### Authentication

SQL on-demand authentication refers to how users prove their identity when connecting to the endpoint. Two types of authentication are supported:

- **SQL Authentication**

  This authentication method uses a username and password.

- **Azure Active Directory Authentication**:

  This authentication method uses identities managed by Azure Active Directory. For AAD users, multi-factor authentication can be enabled. Use Active Directory authentication (integrated security) [whenever possible](/sql/relational-databases/security/choose-an-authentication-mode?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

#### Authorization

Authorization refers to what a user can do within a SQL on-demand database, and is controlled by your user account's database role memberships and object-level permissions.

If SQL Authentication is used, SQL user exists only in SQL on-demand and permissions are scoped to the objects in SQL on-demand. Access to securable objects in other services (such as Azure Storage) can't be granted to SQL user directly since it only exists in scope of SQL on-demand. The SQL user needs to use one of the [supported authorization types](develop-storage-files-storage-access-control.md#supported-storage-authorization-types) to access the files.

If AAD authentication is used, a user can log in into SQL on-demand and other services, like Azure Storage, can grant permissions to the AAD user.

### Access to storage accounts

A user that is logged into SQL on-demand service must be authorized to access and query the files in Azure Storage. SQL on-demand supports following authorization types:

- **Shared access signature (SAS)** provides delegated access to resources in storage account. With a SAS, you can grant clients access to resources in storage account, without sharing account keys. A SAS gives you granular control over the type of access you grant to clients who have the SAS: validity interval, granted permissions, acceptable IP address range, acceptable protocol (https/http).

- **User Identity** (also known as "pass-through") is authorization type where the identity of the AAD user that logged into SQL on-demand is used to authorize the access to data. Before accessing the data, Azure Storage administrator must grant permissions to AAD user for accessing the data. This authorization type uses AAD user that logged into SQL on-demand, therefore it's not supported for SQL user type.

## Next steps
Additional information on endpoint connection and querying files can be found in the following articles: 
- [Connect to your endpoint](connect-overview.md)
- [Query your files](develop-storage-files-overview.md)
