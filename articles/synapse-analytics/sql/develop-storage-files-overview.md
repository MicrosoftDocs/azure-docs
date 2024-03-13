---
title: Access files on storage in serverless SQL pool
description: Describes querying storage files using serverless SQL pool in Azure Synapse Analytics.
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 04/19/2020
ms.author: stefanazaric
ms.reviewer: sngun 
---
# Access external storage using serverless SQL pool in Azure Synapse Analytics

This article describes how users can read data from the files stored on Azure Storage in serverless SQL pool. Users have the following options to access storage:

- [OPENROWSET](develop-openrowset.md) function that enables ad-hoc queries over the files in Azure Storage.
- [External table](develop-tables-external-tables.md) that is a predefined data structure built on top of set of external files.

User can use [different authentication methods](develop-storage-files-storage-access-control.md) such as Microsoft Entra passthrough authentication (default for Microsoft Entra principals) and SAS authentication (default for SQL principals).

## Query files using OPENROWSET

OPENROWSET enables users to query external files on Azure storage if they have access to the storage. A user who is connected to serverless SQL pool should use the following query to read the content of the files on Azure storage:

```sql
SELECT * FROM
 OPENROWSET(BULK 'https://<storage_account>.dfs.core.windows.net/<container>/<path>/*.parquet', format= 'parquet') as rows
```

User can access storage using the following access rules:

- Microsoft Entra user - `OPENROWSET` will use Microsoft Entra identity of caller to access Azure Storage or access storage with anonymous access.
- SQL user – `OPENROWSET` will access storage with anonymous access or can be impersonated using SAS token or Managed identity of workspace.

### [Impersonation](#tab/impersonation)

SQL principals can also use OPENROWSET to directly query files protected with SAS tokens or Managed Identity of the workspace. If a SQL user executes this function, a power user with `ALTER ANY CREDENTIAL` permission must create a server-scoped credential that matches URL in the function (using storage name and container) and granted REFERENCES permission for this credential to the caller of OPENROWSET function:

```sql
EXECUTE AS somepoweruser

CREATE CREDENTIAL [https://<storage_account>.dfs.core.windows.net/<container>]
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = 'sas token';

GRANT REFERENCES ON CREDENTIAL::[https://<storage_account>.dfs.core.windows.net/<container>] TO sqluser
```

If there's no server-level CREDENTIAL that matches the URL, or the SQL user doesn't have references permission for this credential, the error will be returned. SQL principals can't impersonate using some Microsoft Entra identity.

### [Direct access](#tab/direct-access)

No additional setup is needed to enable Microsoft Entra users to access the files using their identities.
Any user can access Azure storage that allows anonymous access (additional setup isn't needed).

---

> [!NOTE]
> This version of OPENROWSET is designed for quick-and-easy data exploration using default authentication. To leverage impersonation or Managed Identity, use OPENROWSET with DATA_SOURCE described in the next section.

## Query data sources using OPENROWSET

OPENROWSET enables user to query the files placed on some external data source:

```sql
SELECT * FROM
 OPENROWSET(BULK 'file/path/*.parquet',
 DATA_SOURCE = MyAzureInvoices,
 FORMAT= 'parquet') as rows
```

The user that executes this query must be able to access the files. The users must be impersonated using [SAS token](develop-storage-files-storage-access-control.md?tabs=shared-access-signature) or [Managed Identity of workspace](develop-storage-files-storage-access-control.md?tabs=managed-identity) if they can't directly access the files using their [Microsoft Entra identity](develop-storage-files-storage-access-control.md?tabs=user-identity) or [anonymous access](develop-storage-files-storage-access-control.md?tabs=public-access).

### [Impersonation](#tab/impersonation)

`DATABASE SCOPED CREDENTIAL` specifies how to access files on the referenced data source (currently SAS and Managed Identity). Power user with `CONTROL DATABASE` permission would need to create `DATABASE SCOPED CREDENTIAL` that will be used to access storage and `EXTERNAL DATA SOURCE` that specifies URL of data source and credential that should be used:

```sql
EXECUTE AS somepoweruser;

-- Create MASTER KEY if it doesn't exists in database
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'some very strong password';

CREATE DATABASE SCOPED CREDENTIAL AccessAzureInvoices
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
 SECRET = '******srt=sco&amp;sp=rwac&amp;se=2017-02-01T00:55:34Z&amp;st=201********' ;

CREATE EXTERNAL DATA SOURCE MyAzureInvoices
 WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>/' ,
 CREDENTIAL = AccessAzureInvoices) ;
```

Caller must have one of the following permissions to execute OPENROWSET function:

- One of the permissions to execute OPENROWSET:
  - `ADMINISTER BULK OPERATIONS` enables login to execute OPENROWSET function.
  - `ADMINISTER DATABASE BULK OPERATIONS` enables database scoped user to execute OPENROWSET function.
- `REFERENCES DATABASE SCOPED CREDENTIAL` to the credential that is referenced in `EXTERNAL DATA SOURCE`.

### [Direct access](#tab/direct-access)

User can create EXTERNAL DATA SOURCE without CREDENTIAL that will reference public access storage OR use Microsoft Entra passthrough authentication:

```sql
CREATE EXTERNAL DATA SOURCE MyAzureInvoices
 WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>') ;
```
---
## EXTERNAL TABLE

User with the permissions to read table can access external files using an EXTERNAL TABLE created on top of set of Azure Storage folders and files.

User that has [permissions to create external table](/sql/t-sql/statements/create-external-table-transact-sql?preserve-view=true&view=sql-server-ver15#permissions) (for example CREATE TABLE and ALTER ANY CREDENTIAL or REFERENCES DATABASE SCOPED CREDENTIAL) can use the following script to create a table on top of Azure Storage data source:

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

User that reads data from this table must be able to access the files. The users must be impersonated using [SAS token](develop-storage-files-storage-access-control.md?tabs=shared-access-signature) or [Managed Identity of workspace](develop-storage-files-storage-access-control.md?tabs=managed-identity) if they cannot directly access the files using their [Microsoft Entra identity](develop-storage-files-storage-access-control.md?tabs=user-identity) or [anonymous access](develop-storage-files-storage-access-control.md?tabs=public-access).

### [Impersonation](#tab/impersonation)

DATABASE SCOPED CREDENTIAL specifies how to access files on the referenced data source. User with CONTROL DATABASE permission would need to create DATABASE SCOPED CREDENTIAL that will be used to access storage and EXTERNAL DATA SOURCE that specifies URL of data source and credential that should be used:

```sql
EXECUTE AS somepoweruser;

-- Create MASTER KEY if it doesn't exists in database
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'some very strong password';

CREATE DATABASE SCOPED CREDENTIAL cred
 WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
 SECRET = '******srt=sco&sp=rwac&se=2017-02-01T00:55:34Z&st=201********' ;

CREATE EXTERNAL DATA SOURCE AzureDataLakeStore
 WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>' ,
 CREDENTIAL = cred
 ) ;
```

### [Direct access](#tab/direct-access)

User can create EXTERNAL DATA SOURCE without CREDENTIAL that will reference public access storage OR use Microsoft Entra passthrough authentication:

```sql
CREATE EXTERNAL DATA SOURCE MyAzureInvoices
 WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>') ;
```
---

### Read external files with EXTERNAL TABLE

EXTERNAL TABLE enables you to read data from the files that are referenced via data source using standard SQL SELECT statement:

```sql
SELECT *
FROM dbo.DimProductsExternal
```

Caller must have the following permissions to read data:
- `SELECT` permission ON external table
- `REFERENCES DATABASE SCOPED CREDENTIAL` permission if `DATA SOURCE` has `CREDENTIAL`

## Permissions

The following table lists required permissions for the operations listed above.

| Query | Required permissions|
| --- | --- |
| OPENROWSET(BULK) without datasource | `ADMINISTER BULK OPERATIONS`, `ADMINISTER DATABASE BULK OPERATIONS`, or SQL login must have REFERENCES CREDENTIAL::\<URL> for SAS-protected storage |
| OPENROWSET(BULK) with datasource without credential | `ADMINISTER BULK OPERATIONS` or `ADMINISTER DATABASE BULK OPERATIONS`, |
| OPENROWSET(BULK) with datasource with credential | `REFERENCES DATABASE SCOPED CREDENTIAL` and one of `ADMINISTER BULK OPERATIONS` or `ADMINISTER DATABASE BULK OPERATIONS` |
| CREATE EXTERNAL DATA SOURCE | `ALTER ANY EXTERNAL DATA SOURCE` and `REFERENCES DATABASE SCOPED CREDENTIAL` |
| CREATE EXTERNAL TABLE | `CREATE TABLE`, `ALTER ANY SCHEMA`, `ALTER ANY EXTERNAL FILE FORMAT`, and `ALTER ANY EXTERNAL DATA SOURCE` |
| SELECT FROM EXTERNAL TABLE | `SELECT TABLE` and `REFERENCES DATABASE SCOPED CREDENTIAL` |
| CETAS | To create table - `CREATE TABLE`, `ALTER ANY SCHEMA`, `ALTER ANY DATA SOURCE`, and `ALTER ANY EXTERNAL FILE FORMAT`. To read data: `ADMINISTER BULK OPERATIONS` or `REFERENCES CREDENTIAL` or `SELECT TABLE` per each table/view/function in query + R/W permission on storage |

## Next steps

You're now ready to continue on with the following How To articles:

- [Query data on storage](query-data-storage.md)

- [Query CSV file](query-single-csv-file.md)

- [Query Parquet files](query-parquet-files.md)

- [Query JSON files](query-json-files.md)

- [Query folders and multiple files](query-folders-multiple-csv-files.md)

- [Use partitioning and metadata functions](query-specific-files.md)

- [Query nested types](query-parquet-nested-types.md)

- [Creating and using views](create-use-views.md)
