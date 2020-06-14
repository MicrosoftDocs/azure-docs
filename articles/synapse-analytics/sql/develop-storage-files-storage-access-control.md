---
title: Control storage account access for SQL on-demand (preview)
description: Describes how SQL on-demand (preview) accesses Azure Storage and how you can control storage access for SQL on-demand in Azure Synapse Analytics.
services: synapse-analytics 
author: filippopovic
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: 
ms.date: 06/11/2020
ms.author: fipopovi
ms.reviewer: jrasnick, carlrab
---

# Control storage account access for SQL on-demand (preview)

A SQL on-demand query reads files directly from Azure Storage. Permissions to access the files on Azure storage are controlled at two levels:
- **Storage level** - User should have permission to access underlying storage files. Your storage administrator should allow Azure AD principal to read/write files, or generate SAS key that will be used to access storage.
- **SQL service level** - User should have `SELECT` permission to read data from [external table](develop-tables-external-tables.md) or `ADMINISTER BULK ADMIN` permission to execute `OPENROWSET` and also permission to use credentials that will be used to access storage.

This article describes the types of credentials you can use and how credential lookup is enacted for SQL and Azure AD users.

## Supported storage authorization types

A user that has logged into a SQL on-demand resource must be authorized to access and query the files in Azure Storage if the files are not publicly available. You can use three authorization types to access non-public storage - [User Identity](?tabs=user-identity), [Shared access signature](?tabs=shared-access-signature), and [Managed Identity](?tabs=managed-identity).

> [!NOTE]
> **Azure AD pass-through** is the default behavior when you create a workspace.

### [User Identity](#tab/user-identity)

**User Identity**, also known as "Azure AD pass-through", is an authorization type where the identity of the Azure AD user that logged into
SQL on-demand is used to authorize data access. Before accessing the data, the Azure Storage administrator must grant permissions to the Azure AD user. As indicated in the table below, it's not supported for the SQL user type.

> [!IMPORTANT]
> You need to have a Storage Blob Data Owner/Contributor/Reader role to use your identity to access the data.
> Even if you are an Owner of a Storage Account, you still need to add yourself into one of the Storage Blob Data roles.
>
> To learn more about access control in Azure Data Lake Store Gen2, review the [Access control in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-access-control.md) article.
>

### [Shared access signature](#tab/shared-access-signature)

**Shared access signature (SAS)** provides delegated access to resources in a storage account. With SAS, a customer can grant clients access to resources in a storage account without sharing account keys. SAS gives you granular control
over the type of access you grant to clients who have an SAS, including validity interval, granted permissions, acceptable IP address range, and the acceptable protocol (https/http).

You can get an SAS token by navigating to the **Azure portal -> Storage Account -> Shared access signature -> Configure permissions -> Generate SAS and connection string.**

> [!IMPORTANT]
> When an SAS token is generated, it includes a question mark ('?') at the beginning of the token. To use the token in SQL on-demand, you must remove the question mark ('?') when creating a credential. For example:
>
> SAS token: ?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D

You need to create database-scoped or server-scoped credential to enable access using SAS token.

### [Managed Identity](#tab/managed-identity)

**Managed Identity** is also known as MSI. It's a feature of Azure Active Directory (Azure AD) that provides Azure services for SQL on-demand. Also, it deploys an automatically managed identity in Azure AD. This identity can be used to authorize the request for data access in Azure Storage.

Before accessing the data, the Azure Storage administrator must grant permissions to Managed Identity for accessing the data. Granting permissions to Managed Identity is done the same way as granting permission to any other Azure AD user.

### [Anonymous access](#tab/public-access)

You can access publicly available files placed on Azure storage accounts that [allow anonymous access](/azure/storage/blobs/storage-manage-access-to-resources).

---

### Supported authorization types for databases users

In the table below you can find the available authorization types:

| Authorization type                    | *SQL user*    | *Azure AD user*     |
| ------------------------------------- | ------------- | -----------    |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)       | Not supported | Supported      |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)       | Supported     | Supported      |
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Not supported | Supported      |

### Supported storages and authorization types

You can use the following combinations of authorization and Azure Storage types:

|                     | Blob Storage   | ADLS Gen1        | ADLS Gen2     |
| ------------------- | ------------   | --------------   | -----------   |
| *SAS*               | Supported      | Not  supported   | Supported     |
| *Managed  Identity* | Supported      | Supported        | Supported     |
| *User  Identity*    | Supported      | Supported        | Supported     |

## Credentials

To query a file located in Azure Storage, your SQL on-demand end point needs a credential that contains the authentication information. Two types of credentials are used:
- Server-level CREDENTIAL is used for ad-hoc queries executed using `OPENROWSET` function. Credential name must match the storage URL.
- DATABASE SCOPED CREDENTIAL is used for external tables. External table references `DATA SOURCE` with the credential that should be used to access storage.

To allow a user to create or drop a credential, admin can GRANT/DENY ALTER ANY CREDENTIAL permission to a user:

```sql
GRANT ALTER ANY CREDENTIAL TO [user_name];
```

Database users who access external storage must have permission to use credentials.

### Grant permissions to use credential

To use the credential, a user must have `REFERENCES` permission on a specific credential. To grant a `REFERENCES` permission ON a storage_credential for a specific_user, execute:

```sql
GRANT REFERENCES ON CREDENTIAL::[storage_credential] TO [specific_user];
```

To ensure a smooth Azure AD pass-through experience, all users will, by default, have a right to use the `UserIdentity` credential. This is achieved by an automatic execution of the following statement upon Azure Synapse workspace provisioning:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO [public];
```

## Server-scoped credential

Server-scoped credentials are used when SQL login calls `OPENROWSET` function without `DATA_SOURCE` to read files on some storage account. The name of server-scoped credential **must** match the URL of Azure storage. A credential is added by running [CREATE CREDENTIAL](/sql/t-sql/statements/create-credential-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest). You'll need to provide a CREDENTIAL NAME argument. It must match either part of the path or the whole path to data in Storage (see below).

> [!NOTE]
> The `FOR CRYPTOGRAPHIC PROVIDER` argument is not supported.

Server-level CREDENTIAL name must match the full path to the storage account (and optionally container) in the following format: `<prefix>://<storage_account_path>/<storage_path>`. Storage account paths are described in the following table:

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | https  | <storage_account>.blob.core.windows.net             |
| Azure Data Lake Storage Gen1 | https  | <storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Storage Gen2 | https  | <storage_account>.dfs.core.windows.net              |

Server-scoped credentials enable access to Azure storage using the following authentication types:

### [User Identity](#tab/user-identity)

Azure AD users can access any file on Azure storage if they have `Storage Blob Data Owner`, `Storage Blob Data Contributor`, or `Storage Blob Data Reader` role. Azure AD users don't need credentials to access storage. 

SQL users cannot use Azure AD authentication to access storage.

### [Shared access signature](#tab/shared-access-signature)

The following script creates a server-level credential that can be used by `OPENROWSET` function to access any file on Azure storage using SAS token. Create this credential to enable SQL principal that executes `OPENROWSET` function to read files protected 
with SAS key on the Azure storage that matches URL in credential name.

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='SHARED ACCESS SIGNATURE'
, SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
```

### [Managed Identity](#tab/managed-identity)

The following script creates a server-level credential that can be used by `OPENROWSET` function to access any file on Azure storage using workspace managed identity.

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='Managed Identity'
```

### [Public access](#tab/public-access)

Database scoped credential is not required to allow access to publicly available files. Create [data source without database scoped credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

---

## Database-scoped credential

Database-scoped credentials are used when any principal calls `OPENROWSET` function with `DATA_SOURCE` or selects data from [external table](develop-tables-external-tables.md) that don't access public files. The database scoped credential doesn't need to match the name of storage account because it will be explicitly used in DATA SOURCE that defines the location of storage.

Database-scoped credentials enable access to Azure storage using the following authentication types:

### [Azure AD Identity](#tab/user-identity)

Azure AD users can access any file on Azure storage if they have at least `Storage Blob Data Owner`, `Storage Blob Data Contributor`, or `Storage Blob Data Reader` role. Azure AD users don't need credentials to access storage.

SQL users cannot use Azure AD authentication to access storage.

### [Shared access signature](#tab/shared-access-signature)

The following script creates a credential that is used to access files on storage using SAS token specified in the credential.

```sql
CREATE DATABASE SCOPED CREDENTIAL [SasToken]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
     SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
```

### [Managed Identity](#tab/managed-identity)

The following script creates a database-scoped credential that can be used to impersonate current Azure AD user as Managed Identity of service. 

```sql
CREATE DATABASE SCOPED CREDENTIAL [SynapseIdentity]
WITH IDENTITY = 'Managed Identity';
GO
```

The database scoped credential doesn't need to match the name of storage account because it will be explicitly used in DATA SOURCE that defines the location of storage.

### [Public access](#tab/public-access)

Database scoped credential is not required to allow access to publicly available files. Create [data source without database scoped credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

---

Database scoped credentials are used in external data sources to specify what authentication method will be used to access this storage:

```sql
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://*******.blob.core.windows.net/samples',
          CREDENTIAL = <name of database scoped credential> 
)
```

## Examples

**Accessing publicly available data source**

Use the following script to create a table that accesses publicly available data source.

```sql
CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat]
       WITH ( FORMAT_TYPE = PARQUET)
GO
CREATE EXTERNAL DATA SOURCE publicData
WITH (    LOCATION   = 'https://****.blob.core.windows.net/public-access' )
GO

CREATE EXTERNAL TABLE dbo.userPublicData ( [id] int, [first_name] varchar(8000), [last_name] varchar(8000) )
WITH ( LOCATION = 'parquet/user-data/*.parquet',
       DATA_SOURCE = [publicData],
       FILE_FORMAT = [SynapseParquetFormat] )
```

Database user can read the content of the files from the data source using external table or [OPENROWSET](develop-openrowset.md) function that references the data source:

```sql
SELECT TOP 10 * FROM dbo.userPublicData;
GO
SELECT TOP 10 * FROM OPENROWSET(BULK 'parquet/user-data/*.parquet',
                                DATA_SOURCE = [mysample],
                                FORMAT=PARQUET) as rows;
GO
```

**Accessing data source using credential**

Modify the following script to create an external table that accesses Azure storage using SAS token, Azure AD identity of user, or managed identity of workspace.

```sql
-- Create master key in databases with some password (one-off per database)
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'Y*********0'
GO

-- Create databases scoped credential that use Managed Identity or SAS token. User needs to create only database-scoped credentials that should be used to access data source:

CREATE DATABASE SCOPED CREDENTIAL WorkspaceIdentity
WITH IDENTITY = 'Managed Identity'
GO
CREATE DATABASE SCOPED CREDENTIAL SasCredential
WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = 'sv=2019-10-1********ZVsTOL0ltEGhf54N8KhDCRfLRI%3D'

-- Create data source that one of the credentials above, external file format, and external tables that reference this data source and file format:

CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat] WITH ( FORMAT_TYPE = PARQUET)
GO

CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://*******.blob.core.windows.net/samples'
-- Uncomment one of these options depending on authentication method that you want to use to access data source:
--,CREDENTIAL = WorkspaceIdentity 
--,CREDENTIAL = SasCredential 
)

CREATE EXTERNAL TABLE dbo.userData ( [id] int, [first_name] varchar(8000), [last_name] varchar(8000) )
WITH ( LOCATION = 'parquet/user-data/*.parquet',
       DATA_SOURCE = [mysample],
       FILE_FORMAT = [SynapseParquetFormat] );

```

Database user can read the content of the files from the data source using [external table](develop-tables-external-tables.md) or [OPENROWSET](develop-openrowset.md)  function that references the data source:

```sql
SELECT TOP 10 * FROM dbo.userdata;
GO
SELECT TOP 10 * FROM OPENROWSET(BULK 'parquet/user-data/*.parquet', DATA_SOURCE = [mysample], FORMAT=PARQUET) as rows;
GO
```

## Next steps

The articles listed below will help you learn how query different folder types, file types, and create and use views:

- [Query single CSV file](query-single-csv-file.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Query specific files](query-specific-files.md)
- [Query Parquet files](query-parquet-files.md)
- [Create and use views](create-use-views.md)
- [Query JSON files](query-json-files.md)
- [Query Parquet nested types](query-parquet-nested-types.md)
