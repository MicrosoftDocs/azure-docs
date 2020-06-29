---
title: Access files on storage using SQL on-demand (preview) within Synapse SQL
description: Describes querying storage files using SQL on-demand (preview) resources within Synapse SQL.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 04/19/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---
# Accessing external storage in Synapse SQL

This document describes how can user read data from the files stored on Azure Storage in Synapse SQL (on-demand and pool). Users have the following options to access storage:

- [OPENROWSET](develop-openrowset.md) function that enables ad-hoc queries over the files in Azure Storage.
- [External table](develop-tables-external-tables.md) that is a predefined data structure built on top of set of external files.

User can use [different authentication methods](develop-storage-files-storage-access-control.md) such as Azure AD passthrough authentication (default for Azure AD principals) and SAS authentication (default for SQL principals).

## OPENROWSET

[OPENROWSET](develop-openrowset.md) function enables user to read the files from Azure storage.

### Query files using OPENROWSET

OPENROWSET enables users to query external files on Azure storage if they have access on storage. User who is connected to Synapse SQL on-demand endpoint should use the following query to read the content of the files on Azure storage:

```sql
SELECT * FROM
 OPENROWSET(BULK 'http://storage...com/container/file/path/*.csv', format= 'parquet') as rows
```

User can access storage using the following access rules:

- Azure AD user - OPENROWSET will use Azure AD identity of caller to access Azure Storage or access storage with anonymous access.
- SQL user – OPENROWSET will access storage with anonymous access.

SQL principals can also use OPENROWSET to directly query files protected with SAS tokens or Managed Identity of the workspace. If a SQL user executes this function, a power user with ALTER ANY CREDENTIAL permission must create a server-scoped credential that matches URL in the function (using storage name and container) and granted REFERENCES permission for this credential to the caller of OPENROWSET function:

```sql
EXECUTE AS somepoweruser

CREATE CREDENTIAL [http://storage.dfs.com/container]
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = 'sas token';

GRANT REFERENCES CREDENTIAL::[http://storage.dfs.com/container] TO sqluser
```

If there is no server-level CREDENTIAL that matches URL or SQL user don't have references permission for this credential, the error will be returned. SQL principals cannot impersonate using some Azure AD identity.

> [!NOTE]
> This version of OPENROWSET is designed for quick-and-easy data exploration using default authentication. To leverage impersonation or Managed Identity, use OPENROWSET with DATASOURCE described in the next section.

### Querying data sources using OPENROWSET

OPENROWSET enables user to query the files placed on some external data source:

```sql
SELECT * FROM
 OPENROWSET(BULK 'file/path/*.csv',
 DATASOURCE = MyAzureInvoices,
 FORMAT= 'csv') as rows
```

Power user with CONTROL DATABASE permission would need to create DATABASE SCOPED CREDENTIAL that will be used to access storage and EXTERNAL DATA SOURCE that specifies URL of data source and credential that should be used:

```sql
CREATE DATABASE SCOPED CREDENTIAL AccessAzureInvoices
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
 SECRET = '******srt=sco&amp;sp=rwac&amp;se=2017-02-01T00:55:34Z&amp;st=201********' ;

CREATE EXTERNAL DATA SOURCE MyAzureInvoices
 WITH ( LOCATION = 'https://newinvoices.blob.core.windows.net/week3' ,
 CREDENTIAL = AccessAzureInvoices) ;
```

DATABASE SCOPED CREDENTIAL specifies how to access files on the referenced data source (currently SAS and Managed Identity).

Caller must have one of the following permissions to execute OPENROWSET function:

- One of the permissions to execute OPENROWSET:
  - ADMINISTER BULK OPERATION enables login to execute OPENROWSET function.
  - ADMINISTER DATABASE BULK OPERATION enables database scoped user to execute OPENROWSET function.
- REFERENCES DATABASE SCOPED CREDENTIAL to the credential that is referenced in EXTERNAL DATA SOURCE

#### Accessing anonymous data sources

User can create EXTERNAL DATA SOURCE without CREDENTIAL that will reference public access storage OR use Azure AD passthrough authentication:

```sql
CREATE EXTERNAL DATA SOURCE MyAzureInvoices
 WITH ( LOCATION = 'https://newinvoices.blob.core.windows.net/week3') ;
```

## EXTERNAL TABLE

User with the permissions to read table can access external files using an EXTERNAL TABLE created on top of set of Azure Storage folders and files.

User that has [permissions to create external table](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-transact-sql?view=sql-server-ver15#permissions) (for example CREATE TABLE and ALTER ANY CREDENTIAL or REFERENCES DATABASE SCOPED CREDENTIAL) can use the following script to create a table on top of Azure Storage data source:

```sql
CREATE EXTERNAL TABLE [dbo].[DimProductexternal]
( ProductKey int, ProductLabel nvarchar, ProductName nvarchar )
WITH
(
LOCATION='/DimProduct/year=*/month=*' ,
DATA_SOURCE = AzureDataLakeStore ,
FILE_FORMAT = TextFileFormat
) ;
```

User with CONTROL DATABASE permission would need to create DATABASE SCOPED CREDENTIAL that will be used to access storage and EXTERNAL DATA SOURCE that specifies URL of data source and credential that should be used:

```sql
CREATE DATABASE SCOPED CREDENTIAL cred
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
 SECRET = '******srt=sco&sp=rwac&se=2017-02-01T00:55:34Z&st=201********' ;

CREATE EXTERNAL DATA SOURCE AzureDataLakeStore
 WITH ( LOCATION = 'https://samples.blob.core.windows.net/products' ,
 CREDENTIAL = cred
 ) ;
```

DATABASE SCOPED CREDENTIAL specifies how to access files on the referenced data source.

### Reading external files with EXTERNAL TABLE

EXTERNAL TABLE enables you to read data from the files that are referenced via data source using standard SQL SELECT statement:

```sql
SELECT *
FROM dbo.DimProductsExternal
```

Caller must have the following permissions to read data:
- SELECT permission ON external table
- REFERENCES DATABASE SCOPED CREDENTIAL permission if DATA SOURCE has CREDENTIAL

## Permissions

The following table lists required permissions for the operations listed above.

| Query | Required permissions|
| --- | --- |
| OPENROWSET(BULK) without datasource | ADMINISTER BULK ADMIN SQL login must have REFERENCES CREDENTIAL::\<URL> for SAS-protected storage |
| OPENROWSET(BULK) with datasource without credential | ADMINISTER BULK ADMIN |
| OPENROWSET(BULK) with datasource with credential | ADMINISTER BULK ADMIN REFERENCES DATABASE SCOPED CREDENTIAL |
| CREATE EXTERNAL DATA SOURCE | ALTER ANY EXTERNAL DATA SOURCE REFERENCES DATABASE SCOPED CREDENTIAL |
| CREATE EXTERNAL TABLE | CREATE TABLE, ALTER ANY SCHEMA, ALTER ANY EXTERNAL FILE FORMAT, ALTER ANY EXTERNAL DATA SOURCE |
| SELECT FROM EXTERNAL TABLE | SELECT TABLE |
| CETAS | To create table - CREATE TABLE ALTER ANY SCHEMA ALTER ANY DATA SOURCE+ALTER ANY EXTERNAL FILE FORMAT. To read data: ADMIN BULK OPERATIONS+REFERENCES CREDENTIAL or SELECT TABLE per each table/view/function in query + R/W permission on storage |

## Next steps

You're now ready to continue on with the following How To articles:

- [Query data on storage](query-data-storage.md)

- [Query CSV file](query-single-csv-file.md)

- [Query folders and multiple files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Creating and using views](create-use-views.md)
