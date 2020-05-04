---
title: Control storage account access for SQL on-demand (preview)
description: Describes how SQL on-demand (preview) accesses Azure Storage and how you can control storage access for SQL on-demand in Azure Synapse Analytics.
services: synapse-analytics 
author: filippopovic
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: 
ms.date: 04/15/2020
ms.author: fipopovi
ms.reviewer: jrasnick, carlrab
---

# Control storage account access for SQL on-demand (preview)

A SQL on-demand query reads files directly from Azure Storage. Permissions to access the files on Azure storage are controlled at two levels:
- **Storage level** - User should have permission to access underlying storage files. Your storage administrator should allow AAD principal to read/write files, or generate SAS key that will be used to to access storage.
- **SQL service level** - User should have `ADMINISTER BULK ADMIN` permission to execute `OPENROWSET` and also permission to use credentials that will be used to access storage.

This article describes the types of credentials you can use and how credential lookup is enacted for SQL and Azure AD users.

## Supported storage authorization types

A user that has logged into a SQL on-demand resource must be authorized to access and query the files in Azure Storage. Three authorization types are supported:

- [Shared access signature](#shared-access-signature)
- [Managed Identity](#managed-identity)
- [User Identity](#user-identity)

> [!NOTE]
> [Azure AD pass-through](#force-azure-ad-pass-through) is the default behavior when you create a workspace. If you use it, you don't need to create credentials for each storage account accessed using AAD logins. You can [disable this behavior](#disable-forcing-azure-ad-pass-through).

In the table below you'll find the different authorization types that are either supported or will be supported soon.

| Authorization type                    | *SQL user*    | *Azure AD user*     |
| ------------------------------------- | ------------- | -----------    |
| [SAS](#shared-access-signature)       | Supported     | Supported      |
| [Managed Identity](#managed-identity) | Not supported | Supported      |
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

> [!IMPORTANT]
> You need to have a Storage Blob Data Owner/Contributor/Reader role to use your identity to access the data.
> Even if you are an Owner of a Storage Account, you still need to add yourself into one of the Storage Blob Data roles.
>
> To learn more about access control in Azure Data Lake Store Gen2, review the [Access control in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-access-control.md) article.
>

Currently, you need to configure AAD pass-through authentication for AAd users. This is current issue that will be removed in future.

#### Force Azure AD pass-through

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

#### Disable forcing Azure AD pass-through

You can disable [forcing Azure AD pass-through for each query](#force-azure-ad-pass-through). To disable it, drop the `Userdentity` credential using:

```sql
DROP CREDENTIAL [UserIdentity];
```

If you want to re-enable it again, refer to the [force Azure AD pass-through](#force-azure-ad-pass-through) section.

### Managed Identity

**Managed Identity** is also known as MSI. It's a feature of Azure Active Directory (Azure AD) that provides Azure services for SQL on-demand. Also, it deploys an automatically managed identity in Azure AD. This identity can be used to authorize the request for data access in Azure Storage.

Before accessing the data, the Azure Storage administrator must grant permissions to Managed Identity for accessing the data. Granting permissions to Managed Identity is done the same way as granting permission to any other Azure AD user.

## Credentials

To query a file located in Azure Storage, your SQL on-demand end point needs a credential that contains the authentication information. Two types of credentials are used:
- Server-level CREDENTIAL is used for ad-hoc queries executed using `OPENROWSET` function. Credential name must match the storage URL.
- DATABASE SCOPED CREDENTIAL is used for external tables. External table references `DATA SOURCE` with the credential that should be used to access storage.

A credential is added by running [CREATE CREDENTIAL](/sql/t-sql/statements/create-credential-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest). You'll need to provide a CREDENTIAL NAME argument. It must match either part of the path or the whole path to data in Storage (see below).

> [!NOTE]
> The FOR CRYPTOGRAPHIC PROVIDER argument is not supported.

For all supported authorization types, credentials can point to an account or a container.

Server-level CREDENTIAL name must match the full path to the storage account (and optionally container) in the following format: `<prefix>://<storage_account_path>/<storage_path>`

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | https  | <storage_account>.blob.core.windows.net             |
| Azure Data Lake Storage Gen1 | https  | <storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Storage Gen2 | https  | <storage_account>.dfs.core.windows.net              |


> [!NOTE]
> There is special server-level CREDENTIAL `UserIdentity` that [forces Azure AD pass-through](#force-azure-ad-pass-through).

Optionally, to allow a user to create or drop a credential, admin can GRANT/DENY ALTER ANY CREDENTIAL permission to a user:

```sql
GRANT ALTER ANY CREDENTIAL TO [user_name];
```

### Supported storages and authorization types

You can use the following combinations of authorization and Azure Storage types:

|                     | Blob Storage   | ADLS Gen1        | ADLS Gen2     |
| ------------------- | ------------   | --------------   | -----------   |
| *SAS*               | Supported      | Not  supported   | Supported     |
| *Managed  Identity* | Supported      | Supported        | Supported     |
| *User  Identity*    | Supported      | Supported        | Supported     |


### Grant permissions to use credential

To use the credential, a user must have REFERENCES permission on a specific credential. To grant a REFERENCES permission ON a storage_credential for a specific_user, execute:

```sql
GRANT REFERENCES ON CREDENTIAL::[storage_credential] TO [specific_user];
```

To ensure a smooth Azure AD pass-through experience, all users will, by default, have a right to use the `UserIdentity` credential. This is achieved by an automatic execution of the following statement upon Azure Synapse workspace provisioning:

```sql
GRANT REFERENCES ON CREDENTIAL::[UserIdentity] TO [public];
```

### Examples

Depending on the [authorization type](#supported-storage-authorization-types), you can create credentials using the T-SQL syntax below.

**Server-level 
with Shared Access Signature for Blob Storage**

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.blob.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='SHARED ACCESS SIGNATURE'
, SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
```

**Database scoped credential with Managed Identity**

Database scoped credential don't need to match the name of storage account because it will be explicitly used in DATA SOURCE with some location of storage.

```sql
CREATE DATABASE SCOPED CREDENTIAL [SynapseIdentity]
WITH IDENTITY = 'Managed Identity';
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
