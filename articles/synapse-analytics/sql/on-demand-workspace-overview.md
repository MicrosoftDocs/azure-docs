---
title: Serverless SQL pool
description: Learn about serverless SQL pool in Azure Synapse Analytics.
services: synapse analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.custom: ignite-2022
ms.date: 12/06/2022
ms.author: fipopovi
ms.reviewer: sngun
---
# Serverless SQL pool in Azure Synapse Analytics

Every Azure Synapse Analytics workspace comes with serverless SQL pool endpoints that you can use to query data in the [Azure Data Lake](query-data-storage.md) ([Parquet](query-data-storage.md#query-parquet-files), [Delta Lake](query-delta-lake-format.md), [delimited text](query-data-storage.md#query-csv-files) formats), [Azure Cosmos DB](query-cosmos-db-analytical-store.md?toc=%2Fazure%2Fsynapse-analytics%2Ftoc.json&bc=%2Fazure%2Fsynapse-analytics%2Fbreadcrumb%2Ftoc.json&tabs=openrowset-key), or Dataverse.

Serverless SQL pool is a query service over the data in your data lake. It enables you to access your data through the following functionalities:

- A familiar [T-SQL syntax](overview-features.md) to query data in place without the need to copy or load data into a specialized store. To learn more, see the [T-SQL support](#t-sql-support) section.
- Integrated connectivity via the T-SQL interface that offers a wide range of business intelligence and ad-hoc querying tools, including the most popular drivers. To learn more, see the [Client tools](#client-tools) section. You can learn more from the [Introduction into Synapse Serverless SQL Pools video](https://www.youtube.com/watch?v=rDl58M5PyVw).

Serverless SQL pool is a distributed data processing system, built for large-scale data and computational functions. Serverless SQL pool enables you to analyze your Big Data in seconds to minutes, depending on the workload. Thanks to built-in query execution fault-tolerance, the system provides high reliability and success rates even for long-running queries involving large data sets.

Serverless SQL pool is serverless, hence there's no infrastructure to setup or clusters to maintain. A default endpoint for this service is provided within every Azure Synapse workspace, so you can start querying data as soon as the workspace is created. 

There is no charge for resources reserved, you are only being charged for the data processed by queries you run, hence this model is a true pay-per-use model.  

If you use Apache Spark for Azure Synapse in your data pipeline, for data preparation, cleansing or enrichment, you can [query external Spark tables](develop-storage-files-spark-tables.md) you've created in the process, directly from serverless SQL pool. Use [Private Link](../security/how-to-connect-to-workspace-with-private-links.md) to bring your serverless SQL pool endpoint into your [managed workspace VNet](../security/synapse-workspace-managed-vnet.md).  

## Serverless SQL pool benefits

If you need to explore data in the data lake, gain insights from it or optimize your existing data transformation pipeline, you can benefit from using serverless SQL pool. It is suitable for the following scenarios:

- Basic discovery and exploration - Quickly reason about the data in various formats (Parquet, CSV, JSON) in your data lake, so you can plan how to extract insights from it.
- Logical data warehouse – Provide a relational abstraction on top of raw or disparate data without relocating and transforming data, allowing always up-to-date view of your data. Learn more about [creating logical data warehouse](tutorial-logical-data-warehouse.md).
- Data transformation - Simple, scalable, and performant way to transform data in the lake using T-SQL, so it can be fed to BI and other tools, or loaded into a relational data store (Synapse SQL databases, Azure SQL Database, etc.).

Different professional roles can benefit from serverless SQL pool:

- Data Engineers can explore the lake, transform and prepare data using this service, and simplify their data transformation pipelines. For more information, check this [tutorial](tutorial-data-analyst.md).
- Data Scientists can quickly reason about the contents and structure of the data in the lake, thanks to features such as OPENROWSET and automatic schema inference.
- Data Analysts can [explore data and Spark external tables](develop-storage-files-spark-tables.md) created by Data Scientists or Data Engineers using familiar T-SQL language or their favorite tools, which can connect to serverless SQL pool.
- BI Professionals can quickly [create Power BI reports on top of data in the lake](tutorial-connect-power-bi-desktop.md) and Spark tables.

## How to start using serverless SQL pool

Serverless SQL pool endpoint is provided within every Azure Synapse workspace. You can create a workspace and start querying data instantly using tools you are familiar with.

Make sure that you are applying [the best practices](best-practices-serverless-sql-pool.md) to get the best performance.

## Client tools

Serverless SQL pool enables existing SQL ad-hoc querying and business intelligence tools to tap into the data lake. As it provides familiar T-SQL syntax, any tool capable to establish TDS connection to SQL offerings can [connect to and query Synapse SQL](connect-overview.md). You can connect with Azure Data Studio and run ad-hoc queries or connect with Power BI to gain insights in a matter of minutes.

## T-SQL support

Serverless SQL pool offers T-SQL querying surface area, which is slightly enhanced/extended in some aspects to accommodate for experiences around querying semi-structured and unstructured data. Furthermore, some aspects of the T-SQL language aren't supported due to the design of serverless SQL pool, as an example, DML functionality is currently not supported.

- Workload can be organized using familiar concepts:
- Databases - serverless SQL pool endpoint can have multiple databases.
- Schemas - Within a database, there can be one or many object ownership groups called schemas.
- Views, stored procedures, inline table value functions
- External resources – data sources, file formats, and tables

Security can be enforced using:

- Logins and users
- Credentials to control access to storage accounts
- Grant, deny, and revoke permissions per object level
- Microsoft Entra integration

Supported T-SQL:

- Full [SELECT](/sql/t-sql/queries/select-transact-sql?view=azure-sqldw-latest&preserve-view=true) surface area is supported, including a majority of SQL functions
- CETAS - CREATE EXTERNAL TABLE AS SELECT
- DDL statements related to views and security only

Serverless SQL pool has no local storage, only metadata objects are stored in databases. Therefore, T-SQL related to the following concepts isn't supported:

- Tables
- Triggers
- Materialized views
- DDL statements other than ones related to views and security
- DML statements

> [!NOTE]
> Serverless SQL pool queries have a timeout. For more information on query timeout that may affect your workload, see [serverless SQL pool system constraints](resources-self-help-sql-on-demand.md#constraints). Currently you can't change the timeout.

### Extensions

In order to enable smooth experience for in place querying of data residing in files in data lake, serverless SQL pool extends the existing [OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql?view=azure-sqldw-latest&preserve-view=true) function by adding following capabilities:

[Query multiple files or folders](query-data-storage.md#query-multiple-files-or-folders)

[Query PARQUET file format](query-data-storage.md#query-parquet-files)

[Query DELTA format](query-delta-lake-format.md)

[Various delimited text formats (with custom field terminator, row terminator, escape char)](query-data-storage.md#query-csv-files)

[Azure Cosmos DB analytical store](query-cosmos-db-analytical-store.md?toc=%2Fazure%2Fsynapse-analytics%2Ftoc.json&bc=%2Fazure%2Fsynapse-analytics%2Fbreadcrumb%2Ftoc.json&tabs=openrowset-key)

[Read a chosen subset of columns](query-data-storage.md#read-a-chosen-subset-of-columns)

[Schema inference](query-data-storage.md#schema-inference)

[filename function](query-data-storage.md#filename-function)

[filepath function](query-data-storage.md#filepath-function)

[Work with complex types and nested or repeated data structures](query-data-storage.md#work-with-complex-types-and-nested-or-repeated-data-structures)

## Security

Serverless SQL pool offers mechanisms to secure access to your data.

<a name='azure-active-directory-integration-and-multi-factor-authentication'></a>

### Microsoft Entra integration and multi-factor authentication

Serverless SQL pool enables you to centrally manage identities of database user and other Microsoft services with [Microsoft Entra integration](/azure/azure-sql/database/authentication-aad-configure). This capability simplifies permission management and enhances security. Microsoft Entra ID supports [multi-factor authentication](/azure/azure-sql/database/authentication-mfa-ssms-configure) (MFA) to increase data and application security while supporting a single sign-on process.

#### Authentication

Serverless SQL pool authentication refers to how users prove their identity when connecting to the endpoint. Two types of authentication are supported:

- **SQL Authentication**

  This authentication method uses a username and password.

- **Microsoft Entra authentication**:

  This authentication method uses identities managed by Microsoft Entra ID. For Microsoft Entra users, multi-factor authentication can be enabled. Use Active Directory authentication (integrated security) [whenever possible](/sql/relational-databases/security/choose-an-authentication-mode?view=azure-sqldw-latest&preserve-view=true).

#### Authorization

Authorization refers to what a user can do within a serverless SQL pool database, and is controlled by your user account's database role memberships and object-level permissions.

If SQL Authentication is used, the SQL user exists only in serverless SQL pool and permissions are scoped to the objects in serverless SQL pool. Access to securable objects in other services (such as Azure Storage) can't be granted to SQL user directly since it only exists in scope of serverless SQL pool. The SQL user needs to use one of the [supported authorization types](develop-storage-files-storage-access-control.md#supported-storage-authorization-types) to access the files.

If Microsoft Entra authentication is used, a user can sign in to serverless SQL pool and other services, like Azure Storage, and can grant permissions to the Microsoft Entra user.

### Access to storage accounts

A user that is logged into the serverless SQL pool service must be authorized to access and query the files in Azure Storage. serverless SQL pool supports the following authorization types:

- **[Shared access signature (SAS)](develop-storage-files-storage-access-control.md?tabs=shared-access-signature)** provides delegated access to resources in storage account. With a SAS, you can grant clients access to resources in storage account, without sharing account keys. A SAS gives you granular control over the type of access you grant to clients who have the SAS: validity interval, granted permissions, acceptable IP address range, acceptable protocol (https/http).

- **[User Identity](develop-storage-files-storage-access-control.md?tabs=user-identity)** (also known as "pass-through") is an authorization type where the identity of the Microsoft Entra user that logged into serverless SQL pool is used to authorize  access to the data. Before accessing the data, Azure Storage administrator must grant permissions to Microsoft Entra user for accessing the data. This authorization type uses the Microsoft Entra user that logged into serverless SQL pool, therefore it's not supported for SQL user types.

- **[Workspace Identity](develop-storage-files-storage-access-control.md?tabs=managed-identity)** is an authorization type where the identity of the Synapse workspace  is used to authorize  access to the data. Before accessing the data, Azure Storage administrator must grant permissions to workspace identity for accessing the data.

### Access to Azure Cosmos DB

You need to create server-level or database-scoped credential with the Azure Cosmos DB account read-only key to [access the Azure Cosmos DB analytical store](query-cosmos-db-analytical-store.md?toc=%2Fazure%2Fsynapse-analytics%2Ftoc.json&bc=%2Fazure%2Fsynapse-analytics%2Fbreadcrumb%2Ftoc.json&tabs=openrowset-key).

## Next steps
Additional information on endpoint connection and querying files can be found in the following articles: 
- [Connect to your endpoint](connect-overview.md)
- [Query your files](develop-storage-files-overview.md)
