---
title: Control storage account access for SQL Analytics on-demand
description: Describes how SQL Analytics on-demand accesses Azure Storage and how you can control storage access for SQL Analytics on-demand.
services: synapse-analytics 
author: filippopovic
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: 
ms.date: 10/17/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---


# Control storage account access for SQL Analytics on-demand

SQL Analytics on-demand query reads files directly from Azure Storage. As storage account is external object to SQL Analytics on-demand, appropriate credentials are required. User needs appropriate permissions granted to use credential. This document describes types of credentials you can use and how credential lookup is done depending for SQL and AAD logins.



## Supported storage authorization types

User that logged into SQL Analytics on-demand must be authorized to access and query the files in Azure Storage. Three authorization types are supported:

- [Shared access signature](#shared-access-signature)
- [Managed Identity](#managed-identity)
- [User Identity](#user-identity)

> [!NOTE]
> [AAD pass-through](#force-aad-pass-through) is default behavior when you create workspace. You can [disable this behavior](#disable-forcing-aad-pass-through).

Depending on the user type, different authorization types are supported (or will be supported soon).

| Authorization type                    | *SQL user*    | *AAD user*  |
| ------------------------------------- | ------------- | ----------- |
| [SAS](#shared-access-signature) | Supported     | Supported   |
| [Managed Identity](#managed-identity) | Coming soon   | Coming soon |
| [User Identity](#user-identity)       | Not supported | Supported   |

### Shared access signature

**SAS** provides delegated access to resources in storage account. With a SAS, customer can grant clients access to resources in storage account, without sharing account keys. A SAS gives you granular control
over the type of access you grant to clients who have the SAS: validity interval, granted permissions, acceptable IP address range, acceptable protocol (https/http).

> **Note**
>
> You can get a SAS token by navigating to Azure Portal -> Storage Account -> Shared access signature -> Configure permissions -> Generate SAS and connection string. **Note that when SAS token is generated it includes the '?' in the beginning of the token. To use the token in SQL Analytics on-demand, you must remove the '?' when creating a credential.**
>
> Example: 
> SAS token: ?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D
>

### User Identity

**User Identity** (also known as “pass-through”) is authorization type where the identity of the AAD user that logged into
SQL Analytics on-demand is used to authorize the access to data. Before accessing the data, Azure Storage administrator must grant permissions to AAD user for accessing the data. This authorization type uses AAD user that logged into SQL Analytics on-demand, therefore it’s not supported for SQL user type.

>**Note**
> 
>To be able to user your identity to access the data you need to have Storage Blob Data Owner/Contributor/Reader role.
> Even if you are an Owner of a Storage Account, you will still need to add yourself into one of the Storage Blob Data roles.
> [Click here to read more about access control in Azure Data Lake Store Gen2.](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control)
> 

### Managed Identity

**Managed Identity** (also known as MSI) is feature of Azure Active Directory (Azure AD) that provides Azure services, in this case AQL Analytics on-demand, with an automatically managed identity in Azure AD. This identity can be used to authorize the request to access the data in Azure Storage. Before accessing the data, Azure Storage administrator must grant permissions to Managed Identity for accessing the data. Granting permissions to Managed Identity is done the same way as granting permission to any other AAD user.

## Creating credentials

In order to be able to query a file residing in Azure Storage, your SQL Analytics on-demand endpoint needs a server-level CREDENTIAL that contains the authentication information. Credential can be added by running [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql?view=sql-server-2017) statement and providing CREDENTIAL NAME argument that must match part of the path or whole path to data in Storage (see below). Please note that FOR CRYPTOGRAPHIC PROVIDER argument is not supported.

For all supported authorization types, credential can point to account, container, any directory (non-root), or a single file. 

CREDENTIAL NAME must match full path to container, folder, or file, in following format: `<prefix>://<storage_account_path>/<storage_path>` .

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | https  | <storage_account>.blob.core.windows.net             |
| Azure Data Lake Store Gen1 | https  | <storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Store Gen2 | https  | <storage_account>.dfs.core.windows.net              |

 `'<storage_path>'` is path within your storage that points to folder or file you want to read.

> [!NOTE]
> There is special CREDENTIAL NAME  `UserIdentity`  that [forces AAD pass-through](#force-aad-pass-through). Please read about effect it has on [credential lookup](#credential-lookup) while execution queries.

Optionally, to allow user to create or drop credential, admin can GRANT/DENY ALTER ANY CREDENTIAL permission to user:

```sql
GRANT ALTER ANY CREDENTIAL TO [user_name]
```

### Supported storages and authorization types

You can use following combinations of authorization types and Azure Storage types:

|                     | Blob Storage | ADLS Gen1      | ADLS Gen2   |
| ------------------- | ------------ | -------------- | ----------- |
| *SAS*               | Supported    | Not  supported | Supported   |
| *Managed  Identity* | Coming soon  | Coming soon    | Coming soon |
| *User  Identity*    | Supported    | Supported      | Supported   |

### Examples


Depending on desired [authorization type](#supported-storage-authorization-types), you can create credential using syntax below.

T-SQL syntax for **Shared Access Signature and Blob Storage** (change <mystorageaccountname> with your actual storage account name, and <mystorageaccountcontainername> with actual container name:
>
> ```mssql
> CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
> WITH IDENTITY='SHARED ACCESS SIGNATURE' 
> , SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D' 
> GO
> ```

T-SQL syntax for **User Identity and Azure Data Lake Store Gen1** (change <mystorageaccountname> with your actual storage account name, and <mystorageaccountcontainername> with actual container name:

>```mssql
>CREATE CREDENTIAL [https://<mystorageaccountname>.azuredatalakestore.net/webhdfs/v1/<mystorageaccountcontainername>]
>WITH IDENTITY='User Identity' 
>GO
>```

T-SQL syntax for **User Identity and Azure Data Lake Store Gen2** (change <mystorageaccountname> with your actual storage account name, and <mystorageaccountcontainername> with actual container name:

>```mssql
>CREATE CREDENTIAL [https://<mystorageaccountname>.dfs.core.windows.net/<mystorageaccountcontainername>]
>WITH IDENTITY='User Identity' 
>GO
>```

## Force AAD pass-through

Forcing AAD pass-through is default behavior. To achieve this, special CREDENTIAL NAME `UserIdentity` is created automatically during Azure Synapse workspace provisioning. It forces usage of AAD pass-through for each query of every AAD login regardless of existence of other credentials. 

> [!NOTE]
> AAD pass-through is default behavior.

In case you [disabled forcing AAD pass-through for each query](#disable-forcing-AAD-pass-through) and want to enable it again, execute:

```sql
CREATE CREDENTIAL [UserIdentity]
WITH IDENTITY = 'User Identity'
```

To enable forcing AAD pass-through for specific user, you can grant REFERENCE permission on credential `UserIdentity` to particular user. Following example enables forcing AAD pass-through for user user_name:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO USER [user_name]
```

For more information on how SQL Analytics on-demand finds credential to use, see [credential lookup](#credential-lookup).

## Disable forcing AAD pass-through

You can disable [forcing AAD pass-through for each query](#force-aad-pass-through). To disable it, drop `Userdentity` credential using:

```sql
DROP CREDENTIAL [UserIdentity]
```

In case you want to enable it again, check [force AAD pass-through](#force-aad-pass-through). 

To disable forcing AAD pass-through for specific user, you can deny REFERENCE permission on credential `UserIdentity` to particular user. Following example disables forcing AAD pass-through for user user_name:

```sql
DENY REFERENCES ON CREDENTIAL::[UserIdentity] TO USER [user_name]
```

For more information on how SQL Analytics on-demand finds credential to use, see [credential lookup](#credential-lookup).

## Grant permissions to use credential

To use the credential, user must have REFERENCES permission on a specific credential. To grant REFERENCES permission ON storage_credential credential to user specific_user, execute:

`GRANT REFERENCES ON CREDENTIAL::[storage_credential] TO [specific_user]`

To ensure a smooth AAD pass-through experience, all users will by default have a right to use `UserIdentity` credential. This is achieved by automatic execution of following statement upon provisioning of Azure Synapse workspace:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO [public]
```

## Credential lookup

When authorizing queries, lookup of credential to be used to access storage account will be based on following rules:

1. If user is logged in as AAD login

   - if UserIdentity credential exists and user has reference permissions on it, AAD pass-through will be used, otherwise [lookup credential by path](#lookup-credential-by-path)

2. If user is logged in as SQL login

   - [lookup credential by path](#lookup-credential-by-path)

### Lookup credential by path

If forcing AAD pass-through is disabled, lookup of credential to be used will be based on storage path (depth first) and existence of REFERENCES permission on particular credential. In case, there are multiple credentials that can be used to access the same file, SQL Analytics on-demand will use the most specific one.  As an example, for query over following file path: 

As an example, for query over following file path: 
> "account.dfs.core.windows.net/filesystem/folder1/.../folderN/fileX.ext" 


Credential lookup will be done in this order:

> 1. "account.dfs.core.windows.net/filesystem/folder1/.../folderN/fileX"
> 2. "account.dfs.core.windows.net/filesystem/folder1/.../folderN"
> 3. "account.dfs.core.windows.net/filesystem/folder1"
> 4. "account.dfs.core.windows.net/filesystem"
> 5. "account.dfs.core.windows.net"

If user has no REFERENCES permission on credential number 5, SQL Analytics on-demand will check if user has REFERENCES permission on credential one level higher until it find credentials user has REFERENCES permission on. If no such permission is found, error message will be returned.

### Credential and path level

Depending on the desired path shape, in order to be able to run queries, following requirements are in place: 

* In case query is targeting multiple files (folder, with or without wild cards), user needs to have access to a credential on at least root directory level (container level). This is needed as listing files is relative from root directory  (Azure Storage limitations)

* In case query is targeting a single file, user needs to have access to a credential on any level as SQL Analytics on-demand will be accessing the file directly (i.e. without listing folders)

|                  | *Account* | *Root directory* | *Any other directory* | *File*        |
| ---------------- | --------- | ---------------- | --------------------- | ------------- |
| *Single file*    | Supported | Supported        | Supported             | Supported     |
| *Multiple files* | Supported | Supported        | Not supported         | Not supported |


