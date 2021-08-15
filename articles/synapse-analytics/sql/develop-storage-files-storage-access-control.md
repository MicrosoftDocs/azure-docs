---
title: Control storage account access for serverless SQL pool
description: Describes how serverless SQL pool accesses Azure Storage and how you can control storage access for serverless SQL pool in Azure Synapse Analytics.
services: synapse-analytics 
author: filippopovic
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: sql
ms.date: 06/11/2020
ms.author: fipopovi
ms.reviewer: jrasnick  
ms.custom: devx-track-azurepowershell
---

# Control storage account access for serverless SQL pool in Azure Synapse Analytics

A serverless SQL pool query reads files directly from Azure Storage. Permissions to access the files on Azure storage are controlled at two levels:
- **Storage level** - User should have permission to access underlying storage files. Your storage administrator should allow Azure AD principal to read/write files, or generate SAS key that will be used to access storage.
- **SQL service level** - User should have granted permission to read data using [external table](develop-tables-external-tables.md) or to execute the `OPENROWSET` function. Read more about [the required permissions in this section](develop-storage-files-overview.md#permissions).

This article describes the types of credentials you can use and how credential lookup is enacted for SQL and Azure AD users.

## Storage permissions

A serverless SQL pool in Synapse Analytics workspace can read the content of files stored in Azure Data Lake storage. You need to configure permissions on storage to enable a user who executes a SQL query to read the files. There are three methods for enabling the access to the files:
- **[Role based access control (RBAC)](../../role-based-access-control/overview.md)** enables you to assign a role to some Azure AD user in the tenant where your storage is placed. A reader must have `Storage Blob Data Reader`, `Storage Blob Data Contributor`, or `Storage Blob Data Owner` RBAC role on storage account. A user who writes data in the Azure storage must have `Storage Blob Data Writer` or `Storage Blob Data Owner` role. Note that `Storage Owner` role does not imply that a user is also `Storage Data Owner`.
- **Access Control Lists (ACL)** enable you to define a fine grained [Read(R), Write(W), and Execute(X) permissions](../../storage/blobs/data-lake-storage-access-control.md#levels-of-permission) on the files and directories in Azure storage. ACL can be assigned to Azure AD users. If readers want to read a file on a path in Azure Storage, they must have Execute(X) ACL on every folder in the file path, and Read(R) ACL on the file. [Learn more how to set ACL permissions in storage layer](../../storage/blobs/data-lake-storage-access-control.md#how-to-set-acls).
- **Shared access signature (SAS)** enables a reader to access the files on the Azure Data Lake storage using the time-limited token. The reader doesn’t even need to be authenticated as Azure AD user. SAS token contains the permissions granted to the reader as well as the period when the token is valid. SAS token is good choice for time-constrained access to any user that doesn't even need to be in the same Azure AD tenant. SAS token can be defined on the storage account or on specific directories. Learn more about [granting limited access to Azure Storage resources using shared access signatures](../../storage/common/storage-sas-overview.md).

As an alternative, you can make your files publicly available by allowing anonymous access. This approach should NOT be used if you have non-public data. 

## Supported storage authorization types

A user that has logged into a serverless SQL pool must be authorized to access and query the files in Azure Storage if the files aren't publicly available. You can use three authorization types to access non-public storage - [User Identity](?tabs=user-identity), [Shared access signature](?tabs=shared-access-signature), and [Managed Identity](?tabs=managed-identity).

> [!NOTE]
> **Azure AD pass-through** is the default behavior when you create a workspace.

### [User Identity](#tab/user-identity)

**User Identity**, also known as "Azure AD pass-through", is an authorization type where the identity of the Azure AD user that logged into
serverless SQL pool is used to authorize data access. Before accessing the data, the Azure Storage administrator must grant permissions to the Azure AD user. As indicated in the table below, it's not supported for the SQL user type.

> [!IMPORTANT]
> AAD authentication token might be cached by the client applications. For example PowerBI caches AAD token and reuses the same token for an hour. The long runing queries might fail if the token expires in the middle of the query execution. If you are experiencing query failures caused by the AAD access token that expires in the middle of the query, consider switching to [Managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity#supported-storage-authorization-types) or [Shared access signature](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#supported-storage-authorization-types).

You need to have a Storage Blob Data Owner/Contributor/Reader role to use your identity to access the data. As an alternative, you can specify fine-grained ACL rules to access files and folders. Even if you are an Owner of a Storage Account, you still need to add yourself into one of the Storage Blob Data roles.
To learn more about access control in Azure Data Lake Store Gen2, review the [Access control in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-access-control.md) article.


### [Shared access signature](#tab/shared-access-signature)

**Shared access signature (SAS)** provides delegated access to resources in a storage account. With SAS, a customer can grant clients access to resources in a storage account without sharing account keys. SAS gives you granular control
over the type of access you grant to clients who have an SAS, including validity interval, granted permissions, acceptable IP address range, and the acceptable protocol (https/http).

You can get an SAS token by navigating to the **Azure portal -> Storage Account -> Shared access signature -> Configure permissions -> Generate SAS and connection string.**

> [!IMPORTANT]
> When an SAS token is generated, it includes a question mark ('?') at the beginning of the token. To use the token in serverless SQL pool, you must remove the question mark ('?') when creating a credential. For example:
>
> SAS token: ?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D

To enable access using an SAS token, you need to create a database-scoped or server-scoped credential 


> [!IMPORTANT]
> You cannnot access private storage accounts with the SAS token. Consider switching to [Managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity#supported-storage-authorization-types) or [Azure AD pass-through](develop-storage-files-storage-access-control.md?tabs=user-identity#supported-storage-authorization-types) authentication to access protected storage.

### [Managed Identity](#tab/managed-identity)

**Managed Identity** is also known as MSI. It's a feature of Azure Active Directory (Azure AD) that provides Azure services for serverless SQL pool. Also, it deploys an automatically managed identity in Azure AD. This identity can be used to authorize the request for data access in Azure Storage.

Before accessing the data, the Azure Storage administrator must grant permissions to Managed Identity for accessing the data. Granting permissions to Managed Identity is done the same way as granting permission to any other Azure AD user.

### [Anonymous access](#tab/public-access)

You can access publicly available files placed on Azure storage accounts that [allow anonymous access](../../storage/blobs/anonymous-read-access-configure.md).

---

### Supported authorization types for databases users

In the table below you can find the available authorization types:

| Authorization type                    | *SQL user*    | *Azure AD user*     |
| ------------------------------------- | ------------- | -----------    |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)       | Not supported | Supported      |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)       | Supported     | Supported      |
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Supported | Supported      |

### Supported storages and authorization types

You can use the following combinations of authorization and Azure Storage types:

| Authorization type  | Blob Storage   | ADLS Gen1        | ADLS Gen2     |
| ------------------- | ------------   | --------------   | -----------   |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)    | Supported      | Not  supported   | Supported     |
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Supported      | Supported        | Supported     |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)    | Supported      | Supported        | Supported     |

## Firewall protected storage

You can configure storage accounts to allow access to specific serverless SQL pool by creating a [resource instance rule](../../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-from-azure-resource-instances-preview).
When accessing storage that is protected with the firewall, you can use **User Identity** or **Managed Identity**.

> [!NOTE]
> The firewall feature on Storage is in public preview and is available in all public cloud regions. 


### [User Identity](#tab/user-identity)

To access storage that is protected with the firewall via User Identity, you can use Azure portal UI or PowerShell module Az.Storage.
### Configuration via Azure portal

1. Search for your Storage Account in Azure portal.
1. Go to Networking under section Settings.
1. In Section "Resource instances" add an exception for your Synapse workspace.
1. Select Microsoft.Synapse/workspaces as a Resource type.
1. Select name of your workspace as an Instance name.
1. Click Save.

### Configuration via PowerShell

Follow these steps to configure your storage account firewall and add an exception for Synapse workspace.

1. Open PowerShell or [install PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows)
2. Install the Az.Storage 3.4.0 module and Az.Synapse 0.7.0: 
    ```powershell
    Install-Module -Name Az.Storage -RequiredVersion 3.4.0
    Install-Module -Name Az.Synapse -RequiredVersion 0.7.0
    ```
    > [!IMPORTANT]
    > Make sure that you use **version 3.4.0**. You can check your Az.Storage version by running this command:  
    > ```powershell 
    > Get-Module -ListAvailable -Name  Az.Storage | select Version
    > ```
    > 

3. Connect to your Azure Tenant: 
    ```powershell
    Connect-AzAccount
    ```
4. Define variables in PowerShell: 
    - Resource group name - you can find this in Azure portal in overview of Storage account.
    - Account Name - name of storage account that is protected by firewall rules.
    - Tenant ID - you can find this in Azure portal in Azure Active Directory in tenant information.
    - Workspace Name - Name of the Synapse workspace.

    ```powershell
        $resourceGroupName = "<resource group name>"
        $accountName = "<storage account name>"
        $tenantId = "<tenant id>"
        $workspaceName = "<synapse workspace name>"
        
        $workspace = Get-AzSynapseWorkspace -Name $workspaceName
        $resourceId = $workspace.Id
        $index = $resourceId.IndexOf("/resourceGroups/", 0)
        # Replace G with g - /resourceGroups/ to /resourcegroups/
        $resourceId = $resourceId.Substring(0,$index) + "/resourcegroups/" + $resourceId.Substring($index + "/resourceGroups/".Length)
        $resourceId
    ```
    > [!IMPORTANT]
    > Make sure that resource id matches this template in the print of the resourceId variable.
    >
    > It's important to write **resourcegroups** in lower case.
    > Example of one resource id: 
    > ```
    > /subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Synapse/workspaces/{name-of-workspace}
    > ```
    > 
5. Add Storage Network rule: 
    ```powershell
        Add-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $accountName -TenantId $tenantId -ResourceId $resourceId
    ```
6. Verify that rule was applied in your storage account: 
    ```powershell
        $rule = Get-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName
        $rule.ResourceAccessRules | ForEach-Object { 
            if ($_.ResourceId -cmatch "\/subscriptions\/(\w\-*)+\/resourcegroups\/(.)+") { 
                Write-Host "Storage account network rule is successfully configured." -ForegroundColor Green
                $rule.ResourceAccessRules
            } else {
                Write-Host "Storage account network rule is not configured correctly. Remove this rule and follow the steps in detail." -ForegroundColor Red
                $rule.ResourceAccessRules
            }
        }
    ```

### [Shared access signature](#tab/shared-access-signature)

Shared access signatures cannot be used to access firewall-protected storage.

### [Managed Identity](#tab/managed-identity)

You need to [Allow trusted Microsoft services... setting](../../storage/common/storage-network-security.md#trusted-microsoft-services) and explicitly [assign an Azure role](../../storage/blobs/authorize-access-azure-active-directory.md#assign-azure-roles-for-access-rights) to the [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for that resource instance. 
In this case, the scope of access for the instance corresponds to the Azure role assigned to the managed identity.

### [Anonymous access](#tab/public-access)

You cannot access firewall-protected storage using anonymous access.

---

## Credentials

To query a file located in Azure Storage, your serverless SQL pool end point needs a credential that contains the authentication information. Two types of credentials are used:
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

## Server-scoped credential

Server-scoped credentials are used when SQL login calls `OPENROWSET` function without `DATA_SOURCE` to read files on some storage account. The name of server-scoped credential **must** match the base URL of Azure storage (optionally followed by a container name). A credential is added by running [CREATE CREDENTIAL](/sql/t-sql/statements/create-credential-transact-sql?view=azure-sqldw-latest&preserve-view=true). You'll need to provide a CREDENTIAL NAME argument.

> [!NOTE]
> The `FOR CRYPTOGRAPHIC PROVIDER` argument is not supported.

Server-level CREDENTIAL name must match the full path to the storage account (and optionally container) in the following format: `<prefix>://<storage_account_path>[/<container_name>]`. Storage account paths are described in the following table:

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | https  | <storage_account>.blob.core.windows.net             |
| Azure Data Lake Storage Gen1 | https  | <storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Storage Gen2 | https  | <storage_account>.dfs.core.windows.net              |

Server-scoped credentials enable access to Azure storage using the following authentication types:

### [User Identity](#tab/user-identity)

Azure AD users can access any file on Azure storage if they have `Storage Blob Data Owner`, `Storage Blob Data Contributor`, or `Storage Blob Data Reader` role. Azure AD users don't need credentials to access storage. 

SQL users can't use Azure AD authentication to access storage.

### [Shared access signature](#tab/shared-access-signature)

The following script creates a server-level credential that can be used by `OPENROWSET` function to access any file on Azure storage using SAS token. Create this credential to enable SQL principal that executes `OPENROWSET` function to read files protected 
with SAS key on the Azure storage that matches URL in credential name.

Exchange <*mystorageaccountname*> with your actual storage account name, and <*mystorageaccountcontainername*> with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.dfs.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='SHARED ACCESS SIGNATURE'
, SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
```

Optionally, you can use just the base URL of the storage account, without container name.

### [Managed Identity](#tab/managed-identity)

The following script creates a server-level credential that can be used by `OPENROWSET` function to access any file on Azure storage using workspace-managed identity.

```sql
CREATE CREDENTIAL [https://<storage_account>.dfs.core.windows.net/<container>]
WITH IDENTITY='Managed Identity'
```

Optionally, you can use just the base URL of the storage account, without container name.

### [Public access](#tab/public-access)

Database scoped credential isn't required to allow access to publicly available files. Create [data source without database scoped credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

---

## Database-scoped credential

Database-scoped credentials are used when any principal calls `OPENROWSET` function with `DATA_SOURCE` or selects data from [external table](develop-tables-external-tables.md) that don't access public files. The database scoped credential doesn't need to match the name of storage account. It will be explicitly used in DATA SOURCE that defines the location of storage.

Database-scoped credentials enable access to Azure storage using the following authentication types:

### [Azure AD Identity](#tab/user-identity)

Azure AD users can access any file on Azure storage if they have at least `Storage Blob Data Owner`, `Storage Blob Data Contributor`, or `Storage Blob Data Reader` role. Azure AD users don't need credentials to access storage.

```sql
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>'
)
```

SQL users can't use Azure AD authentication to access storage.

### [Shared access signature](#tab/shared-access-signature)

The following script creates a credential that is used to access files on storage using SAS token specified in the credential. The script will create a sample external data source that uses this SAS token to access storage.

```sql
-- Optional: Create MASTER KEY if not exists in database:
-- CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Very Strong Password>'
GO
CREATE DATABASE SCOPED CREDENTIAL [SasToken]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
     SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>',
          CREDENTIAL = SasToken
)
```

### [Managed Identity](#tab/managed-identity)

The following script creates a database-scoped credential that can be used to impersonate current Azure AD user as Managed Identity of service. The script will create a sample external data source that uses workspace identity to access storage.

```sql
-- Optional: Create MASTER KEY if not exists in database:
-- CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Very Strong Password>
CREATE DATABASE SCOPED CREDENTIAL SynapseIdentity
WITH IDENTITY = 'Managed Identity';
GO
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>',
          CREDENTIAL = SynapseIdentity
)
```

The database scoped credential doesn't need to match the name of storage account because it will be explicitly used in DATA SOURCE that defines the location of storage.

### [Public access](#tab/public-access)

Database scoped credential isn't required to allow access to publicly available files. Create [data source without database scoped credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

```sql
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.blob.core.windows.net/<container>/<path>'
)
```
---

Database scoped credentials are used in external data sources to specify what authentication method will be used to access this storage:

```sql
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>',
          CREDENTIAL = <name of database scoped credential> 
)
```

## Examples

### **Access a publicly available data source**

Use the following script to create a table that accesses publicly available data source.

```sql
CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat]
       WITH ( FORMAT_TYPE = PARQUET)
GO
CREATE EXTERNAL DATA SOURCE publicData
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<public_container>/<path>' )
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
                                DATA_SOURCE = 'mysample',
                                FORMAT='PARQUET') as rows;
GO
```

### **Access a data source using credentials**

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
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>'
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
SELECT TOP 10 * FROM OPENROWSET(BULK 'parquet/user-data/*.parquet', DATA_SOURCE = 'mysample', FORMAT='PARQUET') as rows;
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