---
title: Control storage account access for SQL on-demand (preview)
description: Describes how SQL on-demand (preview) accesses Azure Storage and how you can control storage access for SQL on-demand in Azure Synapse Analytics.
services: synapse-analytics 
author: filippopovic
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: 
ms.date: 03/20/2020
ms.author: fipopovi
ms.reviewer: jrasnick, carlrab
---


# Control storage account access for SQL on-demand (preview) in Azure Synapse Analytics

A SQL on-demand (preview) query reads files directly from Azure Storage. Since the storage account is an object that is external to the SQL on-demand resource, appropriate credentials are required. A user needs the applicable permissions granted to use the requisite credential. This article describes the types of credentials you can use and how credential lookup is enacted for SQL and Azure AD users.

## Supported storage authorization types

A user that has logged into a SQL on-demand resource must be authorized to access and query the files in Azure Storage. Three authorization types are supported:

- [Shared access signature](#shared-access-signature)
- [Managed Identity](#managed-identity)
- [User Identity](#user-identity)

> [!NOTE]
> [Azure AD pass-through](#force-azure-ad-pass-through) is the default behavior when you create a workspace. If you use it, you don't need to create credentials for each storage account accessed using AD logins. You can [disable this behavior](#disable-forcing-azure-ad-pass-through).

In the table below you'll find the different authorization types that are either supported or will be supported soon.

| Authorization type                    | *SQL user*    | *Azure AD user*     |
| ------------------------------------- | ------------- | -----------    |
| [SAS](#shared-access-signature)       | Supported     | Supported      |
| [Managed Identity](#managed-identity) | Not supported | Not supported  |
| [User Identity](#user-identity)       | Not supported | Supported      |

### Shared access signature

**Shared access signature (SAS)** provides delegated access to resources in a storage account. With SAS, a customer can grant clients access to resources in a storage account without sharing account keys. SAS gives you granular control
over the type of access you grant to clients who have an SAS, including validity interval, granted permissions, acceptable IP address range, and the acceptable protocol (https/http).

You can get an SAS token by navigating to the **Azure portal -> Storage Account -> Shared access signature -> Configure permissions -> Generate SAS and connection string.**

> [!IMPORTANT]
> When an SAS token is generated, it includes a question mark ('?') at the beginning of the token. To use the token in SQL on-demand, you must remove the question mark ('?') when creating a credential. For example:
>
> SAS token: ?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D

### User Identity

**User Identity**, also known as "pass-through", is an authorization type where the identity of the Azure AD user that logged into
SQL on-demand is used to authorize data access. Before accessing the data, the Azure Storage administrator must grant permissions to the Azure AD user. As indicated in the table above, it's not supported for the SQL user type.

> [!NOTE]
> If you use [Azure AD pass-through](#force-azure-ad-pass-through) you don't need to create credentials for each storage account accessed using AD logins.

> [!IMPORTANT]
> You need to have a Storage Blob Data Owner/Contributor/Reader role to use your identity to access the data.
> Even if you are an Owner of a Storage Account, you still need to add yourself into one of the Storage Blob Data roles.
>
> To learn more about access control in Azure Data Lake Store Gen2, review the [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control) article.
>

### Managed Identity

**Managed Identity** is also known as MSI. It's a feature of Azure Active Directory (Azure AD) that provides Azure services for SQL on-demand. Also, it deploys an automatically managed identity in Azure AD. This identity can be used to authorize the request for data access in Azure Storage.

Before accessing the data, the Azure Storage administrator must grant permissions to Managed Identity for accessing the data. Granting permissions to Managed Identity is done the same way as granting permission to any other Azure AD user.

## Create credentials

To query a file located in Azure Storage, your SQL on-demand end point needs a server-level CREDENTIAL that contains the authentication information. A credential is added by running [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql?view=sql-server-2017). You'll need to provide a CREDENTIAL NAME argument. It must match either part of the path or the whole path to data in Storage (see below).

> [!NOTE]
> The FOR CRYPTOGRAPHIC PROVIDER argument is not supported.

For all supported authorization types, credentials can point to an account, a container, any directory (non-root), or a single file.

CREDENTIAL NAME must match the full path to the container, folder, or file, in the following format: `<prefix>://<storage_account_path>/<storage_path>`

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | https  | <storage_account>.blob.core.windows.net             |
| Azure Data Lake Storage Gen1 | https  | <storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Storage Gen2 | https  | <storage_account>.dfs.core.windows.net              |

 '<storage_path>' is a path within your storage that points to the folder or file you want to read.

> [!NOTE]
> There is special CREDENTIAL NAME  `UserIdentity`  that [forces Azure AD pass-through](#force-azure-ad-pass-through). Please read about the effect it has on [credential lookup](#credential-lookup) while executing queries.

Optionally, to allow a user to create or drop a credential, admin can GRANT/DENY ALTER ANY CREDENTIAL permission to a user:

```sql
GRANT ALTER ANY CREDENTIAL TO [user_name];
```

### Supported storages and authorization types

You can use the following combinations of authorization and Azure Storage types:

|                     | Blob Storage   | ADLS Gen1        | ADLS Gen2     |
| ------------------- | ------------   | --------------   | -----------   |
| *SAS*               | Supported      | Not  supported   | Supported     |
| *Managed  Identity* | Not supported  | Not supported    | Not supported |
| *User  Identity*    | Supported      | Supported        | Supported     |

### Examples

Depending on the [authorization type](#supported-storage-authorization-types), you can create credentials using the T-SQL syntax below.

**Shared Access Signature and Blob Storage**

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='SHARED ACCESS SIGNATURE'
, SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
```

**User Identity and Azure Data Lake Storage Gen1**

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.azuredatalakestore.net/webhdfs/v1/<mystorageaccountcontainername>]
WITH IDENTITY='User Identity';
GO
```

**User Identity and Azure Data Lake Storage Gen2** 

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.dfs.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='User Identity';
GO
```

## Force Azure AD pass-through

Forcing an Azure AD pass-through is a default behavior achieved by a special CREDENTIAL NAME, `UserIdentity`, that is created automatically during Azure Synapse workspace provisioning. It forces the usage of an Azure AD pass-through for each query of every Azure AD login, which will occur despite the existence of other credentials.

> [!NOTE]
> Azure AD pass-through is a default behavior. You don't need to create credentials for each storage account accessed by AD logins.

In case you [disabled forcing Azure AD pass-through for each query](#disable-forcing-azure-ad-pass-through), and want to enable it again, execute:

```sql
CREATE CREDENTIAL [UserIdentity]
WITH IDENTITY = 'User Identity';
```

To enable forcing an Azure AD pass-through for a specific user, you can grant REFERENCE permission on credential `UserIdentity` to that particular user. The following example enables forcing an Azure AD pass-through for a user_name:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO USER [user_name];
```

For more information on how SQL on-demand finds credential to use, see [credential lookup](#credential-lookup).

## Disable forcing Azure AD pass-through

You can disable [forcing Azure AD pass-through for each query](#force-azure-ad-pass-through). To disable it, drop the `Userdentity` credential using:

```sql
DROP CREDENTIAL [UserIdentity];
```

If you want to re-enable it again, refer to the [force Azure AD pass-through](#force-azure-ad-pass-through) section.

To disable forcing Azure AD pass-through for a specific user, you can deny a REFERENCE permission on credential `UserIdentity` for a particular user. The following example disables a forcing Azure AD pass-through for a user_name:

```sql
DENY REFERENCES ON CREDENTIAL::[UserIdentity] TO USER [user_name];
```

For more information on how SQL on-demand finds credentials to use, see [credential lookup](#credential-lookup).

## Grant permissions to use credential

To use the credential, a user must have REFERENCES permission on a specific credential. To grant a REFERENCES permission ON a storage_credential for a specific_user, execute:

```sql
GRANT REFERENCES ON CREDENTIAL::[storage_credential] TO [specific_user];
```

To ensure a smooth Azure AD pass-through experience, all users will, by default, have a right to use the `UserIdentity` credential. This is achieved by an automatic execution of the following statement upon Azure Synapse workspace provisioning:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO [public];
```

## Credential lookup

When authorizing queries, credential lookup is used to access a storage account and is based on following rules:

- User is logged in as an Azure AD login

  - If a UserIdentity credential exists, and the user has reference permissions on it, Azure AD pass-through will be used, otherwise [lookup credential by path](#lookup-credential-by-path)

- User is logged in as a SQL login

  - Use [lookup credential by path](#lookup-credential-by-path)

### Lookup credential by path

If forcing Azure AD pass-through is disabled, credential lookup will be based on the storage path (depth first) and the existence of a REFERENCES permission on that particular credential. When there are multiple credentials that can be used to access the same file, SQL on-demand will use the most specific one.  

Below is an example of a query over the following file path: *account.dfs.core.windows.net/filesystem/folder1/.../folderN/fileX.ext*

Credential lookup will be completed in this order:

```
account.dfs.core.windows.net/filesystem/folder1/.../folderN/fileX
account.dfs.core.windows.net/filesystem/folder1/.../folderN
account.dfs.core.windows.net/filesystem/folder1
account.dfs.core.windows.net/filesystem
account.dfs.core.windows.net
```

If a user has no REFERENCES permission on credential number 5, SQL on-demand will check that the user has REFERENCES permission on a credential that is one level higher until it locates the credentials the user has REFERENCES permission on. If no such permission is found, an error message will be returned.

### Credential and path level

Depending on the path shape you want, the following requirements are in place for running queries:

- If the query is targeting multiple files (folders, with or without wild cards), a user needs to have access to a credential on at least the root directory level (container level). This access level is needed since listing files are relative from the root directory  (Azure Storage limitations)
- If the query is targeting a single file, a user needs to have access to a credential on any level as SQL on-demand accesses the file directly, that is, without listing folders.

|                  | *Account* | *Root directory* | *Any other directory* | *File*        |
| ---------------- | --------- | ---------------- | --------------------- | ------------- |
| *Single file*    | Supported | Supported        | Supported             | Supported     |
| *Multiple files* | Supported | Supported        | Not supported         | Not supported |

## Next steps

The articles listed below will help you learn how query different folder types, file types, and create and use views:

- [Query single CSV file](query-single-csv-file.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Query specific files](query-specific-files.md)
- [Query Parquet files](query-parquet-files.md)
- [Create and use views](../sql-analytics/create-use-views.md)
- [Query JSON files](query-json-files.md)
- [Query Parquet nested types](query-parquet-nested-types.md)
