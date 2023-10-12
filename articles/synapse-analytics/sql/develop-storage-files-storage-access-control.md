---
title: Control storage account access for serverless SQL pool
description: Describes how serverless SQL pool accesses Azure Storage and how you can control storage access for serverless SQL pool in Azure Synapse Analytics.
author: filippopovic
ms.author: fipopovi
ms.reviewer: SQLStijn-MSFT, wiassaf
ms.date: 07/24/2023
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: overview
ms.custom: devx-track-azurepowershell
---

# Control storage account access for serverless SQL pool in Azure Synapse Analytics

A serverless SQL pool query reads files directly from Azure Storage. Permissions to access the files on Azure storage are controlled at two levels:
- **Storage level** - User should have permission to access underlying storage files. Your storage administrator should allow Microsoft Entra principal to read/write files, or generate shared access signature (SAS) key that will be used to access storage.
- **SQL service level** - User should have granted permission to read data using [external table](develop-tables-external-tables.md) or to execute the `OPENROWSET` function. Read more about [the required permissions in this section](develop-storage-files-overview.md#permissions).

This article describes the types of credentials you can use and how credential lookup is enacted for SQL and Microsoft Entra users.

## Storage permissions

A serverless SQL pool in Synapse Analytics workspace can read the content of files stored in Azure Data Lake storage. You need to configure permissions on storage to enable a user who executes a SQL query to read the files. There are three methods for enabling the access to the files:
- **[Role based access control (RBAC)](../../role-based-access-control/overview.md)** enables you to assign a role to some Microsoft Entra user in the tenant where your storage is placed. A reader must be a member of the Storage Blob Data Reader, Storage Blob Data Contributor, or Storage Blob Data Owner role on the storage account. A user who writes data in the Azure storage must be a member of the Storage Blob Data Contributor or Storage Blob Data Owner role. The Storage Owner role does not imply that a user is also Storage Data Owner.
- **Access Control Lists (ACL)** enable you to define a fine grained [Read(R), Write(W), and Execute(X) permissions](../../storage/blobs/data-lake-storage-access-control.md#levels-of-permission) on the files and directories in Azure storage. ACL can be assigned to Microsoft Entra users. If readers want to read a file on a path in Azure Storage, they must have Execute(X) ACL on every folder in the file path, and Read(R) ACL on the file. [Learn more how to set ACL permissions in storage layer](../../storage/blobs/data-lake-storage-access-control.md#how-to-set-acls).
- **Shared access signature (SAS)** enables a reader to access the files on the Azure Data Lake storage using the time-limited token. The reader doesn't even need to be authenticated as Microsoft Entra user. SAS token contains the permissions granted to the reader as well as the period when the token is valid. SAS token is good choice for time-constrained access to any user that doesn't even need to be in the same Microsoft Entra tenant. SAS token can be defined on the storage account or on specific directories. Learn more about [granting limited access to Azure Storage resources using shared access signatures](../../storage/common/storage-sas-overview.md).

As an alternative, you can make your files publicly available by allowing anonymous access. This approach should NOT be used if you have non-public data. 

## Supported storage authorization types

A user that has logged into a serverless SQL pool must be authorized to access and query the files in Azure Storage if the files aren't publicly available. You can use four authorization types to access non-public storage: [user identity](?tabs=user-identity), [shared access signature](?tabs=shared-access-signature), [service principal](?tab/service-principal), and [managed identity](?tabs=managed-identity).

> [!NOTE]
> **Microsoft Entra pass-through** is the default behavior when you create a workspace.

### [User identity](#tab/user-identity)

**User identity**, also known as "Microsoft Entra pass-through", is an authorization type where the identity of the Microsoft Entra user that logged into serverless SQL pool is used to authorize data access. Before accessing the data, the Azure Storage administrator must grant permissions to the Microsoft Entra user. As indicated in the [Supported authorization types for database users table](#supported-authorization-types-for-databases-users), it's not supported for the SQL user type.

> [!IMPORTANT]
> A Microsoft Entra authentication token might be cached by the client applications. For example, Power BI caches Microsoft Entra tokens and reuses the same token for an hour. Long-running queries might fail if the token expires in the middle of the query execution. If you are experiencing query failures caused by the Microsoft Entra access token that expires in the middle of the query, consider switching to a [service principal](develop-storage-files-storage-access-control.md?tabs=service-principal#supported-storage-authorization-types), [managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity#supported-storage-authorization-types) or [shared access signature](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#supported-storage-authorization-types).

You need to be a member of the Storage Blob Data Owner, Storage Blob Data Contributor, or Storage Blob Data Reader role to use your identity to access the data. As an alternative, you can specify fine-grained ACL rules to access files and folders. Even if you are an Owner of a Storage Account, you still need to add yourself into one of the Storage Blob Data roles.
To learn more about access control in Azure Data Lake Store Gen2, review the [Access control in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-access-control.md) article.


### [Shared access signature](#tab/shared-access-signature)

**Shared access signature (SAS)** provides delegated access to resources in a storage account. With SAS, a customer can grant clients access to resources in a storage account without sharing account keys. SAS gives you granular control over the type of access you grant to clients who have an SAS, including validity interval, granted permissions, acceptable IP address range, and the acceptable protocol (https/http).

You can get an SAS token by navigating to the **Azure portal -> Storage Account -> Shared access signature -> Configure permissions -> Generate SAS and connection string**.

> [!IMPORTANT]
> When a shared access signature (SAS) token is generated, it includes a question mark (`?`) at the beginning of the token. To use the token in serverless SQL pool, you must remove the question mark (`?`) when creating a credential. For example:
>
> SAS token: `?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHcEIq78%3D`

To enable access using an SAS token, you need to create a database-scoped or server-scoped credential 

> [!IMPORTANT]
> You cannot access private storage accounts with the SAS token. Consider switching to [Managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity#supported-storage-authorization-types) or [Microsoft Entra pass-through](develop-storage-files-storage-access-control.md?tabs=user-identity#supported-storage-authorization-types) authentication to access protected storage.

### [Service principal](#tab/service-principal)

A **service principal** is the local representation of a global application object in a particular Microsoft Entra tenant. This authentication method is appropriate in cases where storage access is to be authorized for a user application, service, or automation tool. For more information on service principals in Microsoft Entra ID, see [Application and service principal objects in Microsoft Entra ID](/azure/active-directory/develop/app-objects-and-service-principals).

The application needs to be registered in Microsoft Entra ID. For more information on the registration process, follow [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md). Once the application is registered, its service principal can be used for authorization. 

The service principal should be assigned to the Storage Blob Data Owner, Storage Blob Data Contributor, and Storage Blob Data Reader roles in order for the application to access the data. Even if the service principal is the Owner of a storage account, it still needs to be granted an appropriate Storage Blob Data role. As an alternative way of granting access to storage files and folders, fine-grained ACL rules for service principal can be defined. 

To learn more about access control in Azure Data Lake Store Gen2, review [Access control in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-access-control.md).

### [Managed service identity](#tab/managed-identity)

**Managed service identity** or managed identity is also known as an MSI. An MSI is a feature of Microsoft Entra ID that provides Azure services to an Azure service, in this case, for your serverless SQL pool. The MSI is created automatically in Microsoft Entra ID. This identity can be used to authorize the request for data access in Azure Storage.

Before accessing the data, the Azure Storage administrator must grant permissions to the managed service identity for accessing data. Granting permissions to MSI is done the same way as granting permission to any other Microsoft Entra user.

### [Anonymous access](#tab/public-access)

You can access publicly available files placed on Azure storage accounts that [allow anonymous access](../../storage/blobs/anonymous-read-access-configure.md).

---

#### Cross-tenant scenarios
In cases when Azure Storage is in a different tenant from the Synapse serverless SQL pool, authorization via **Service Principal** is the recommended method. **SAS** authorization is also possible, while **Managed Identity** is not supported.

| Authorization Type | *Firewall protected storage* | *non-Firewall protected storage* |
| -------- | -------- | -------- |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)| Supported   | Supported|
| [Service Principal](?tabs=service-principal#supported-storage-authorization-types)| Not Supported   | Supported|

> [!NOTE]
> If Azure Storage is protected by an [Azure Storage firewall](/azure/storage/common/storage-network-security), **Service Principal** will not be supported.

### Supported authorization types for databases users

The following table provides available Azure Storage authorization types for different sign-in methods into an Azure Synapse Analytics serverless SQL endpoint:

| Authorization type                    | *SQL user*    | *Microsoft Entra user*     | *Service principal* |
| ------------------------------------- | ------------- | -----------    | -------- |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)       |  Not Supported | Supported      | Supported|
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)       | Supported     | Supported      | Supported|
| [Service principal](?tabs=service-principal#supported-storage-authorization-types) | Supported | Supported      | Supported|
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Supported | Supported      | Supported|

### Supported storages and authorization types

You can use the following combinations of authorization types and Azure Storage types:

| Authorization type  | Blob Storage   | ADLS Gen1        | ADLS Gen2     |
| ------------------- | ------------   | --------------   | -----------   |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)    | Supported      | Not  supported   | Supported     |
| [Service principal](?tabs=managed-identity#supported-storage-authorization-types) | Supported   | Supported      | Supported  |
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Supported      | Supported        | Supported     |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)    | Supported      | Supported        | Supported     |

### Cross-tenant scenarios

In cases when Azure Storage is in a different tenant from the Azure Synapse Analytics serverless SQL pool, authorization via **service principal** is the recommended method. **Shared access signature** authorization is also possible. **Managed service identity** is not supported.

| Authorization Type | *Firewall protected storage* | *non-Firewall protected storage* |
| -------- | -------- | -------- |
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)| Supported   | Supported|
| [Service principal](?tabs=service-principal#supported-storage-authorization-types)| Not Supported   | Supported|

> [!NOTE]
> If Azure Storage is protected by an [Azure Storage firewall](/azure/storage/common/storage-network-security) and is in another tenant, **service principal** will not be supported. Instead, use a shared access signature (SAS). 

## Firewall protected storage

You can configure storage accounts to allow access to a specific serverless SQL pool by creating a [resource instance rule](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-from-azure-resource-instances). When accessing storage that is protected with the firewall, use **User Identity** or **Managed Identity**.

> [!NOTE]
> The firewall feature on Azure Storage is in public preview and is available in all public cloud regions. 

The following table provides available firewall-protected Azure Storage authorization types for different sign-in methods into an Azure Synapse Analytics serverless SQL endpoint:

| Authorization type                    | *SQL user*    | *Microsoft Entra user*     | *Service principal* |
| ------------------------------------- | ------------- | -----------    | -------- |
| [User Identity](?tabs=user-identity#supported-storage-authorization-types)       |  Not Supported | Supported      | Supported|
| [SAS](?tabs=shared-access-signature#supported-storage-authorization-types)       | Not Supported     | Not Supported      | Not Supported|
| [Service principal](?tabs=service-principal#supported-storage-authorization-types) | Not Supported | Not Supported      | Not Supported|
| [Managed Identity](?tabs=managed-identity#supported-storage-authorization-types) | Supported | Supported      | Supported|

### [User identity](#tab/user-identity)

To access storage that is protected with the firewall via a user identity, you can use the Azure portal or the Az.Storage PowerShell module.

### Azure Storage firewall configuration via Azure portal

1. Search for your Storage Account in Azure portal.
1. In the main navigation menu, go to **Networking** under **Settings**.
1. In the section **Resource instances**, add an exception for your Azure Synapse workspace.
1. Select `Microsoft.Synapse/workspaces` as a **Resource type**.
1. Select the name of your workspace as an **Instance name**.
1. Select **Save**.

### Azure Storage firewall configuration via PowerShell

Follow these steps to configure your storage account and add an exception for the Azure Synapse workspace.

1. Open PowerShell or [install PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows).
1. Install the latest versions of the Az.Storage module and Az.Synapse module, for example in the following script:

    ```powershell
    Install-Module -Name Az.Storage -RequiredVersion 3.4.0
    Install-Module -Name Az.Synapse -RequiredVersion 0.7.0
    ```
    
    > [!IMPORTANT]
    > Make sure that you use at least **version 3.4.0**. You can check your Az.Storage version by running this command:  
    > 
    > ```powershell 
    > Get-Module -ListAvailable -Name Az.Storage | Select Version
    > ```

1. Connect to your Azure Tenant: 

    ```powershell
    Connect-AzAccount
    ```

1. Define variables in PowerShell: 

    - Resource group name - you can find this in Azure portal in the **Overview** of your storage account.
    - Account Name - name of the storage account that is protected by firewall rules.
    - Tenant ID - you can find this in [Azure portal in Microsoft Entra ID](/azure/active-directory/fundamentals/how-to-find-tenant), under **Properties**, in **Tenant properties**.
    - Workspace Name - Name of the Azure Synapse workspace.
    
    ```powershell
        $resourceGroupName = "<resource group name>"
        $accountName = "<storage account name>"
        $tenantId = "<tenant id>"
        $workspaceName = "<Azure Synapse workspace name>"
        
        $workspace = Get-AzSynapseWorkspace -Name $workspaceName
        $resourceId = $workspace.Id
        $index = $resourceId.IndexOf("/resourceGroups/", 0)
        # Replace G with g - /resourceGroups/ to /resourcegroups/
        $resourceId = $resourceId.Substring(0,$index) + "/resourcegroups/" ` 
            + $resourceId.Substring($index + "/resourceGroups/".Length)

        $resourceId
    ```

    > [!IMPORTANT]
    > The value of the `$resourceid` returned by the PowerShell script should match this template:
    > `/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Synapse/workspaces/{name-of-workspace}`
    > It's important to write **resourcegroups** in lower case. 

1. Add an Azure storage account network rule: 

    ```powershell
        $parameters = @{
            ResourceGroupName = $resourceGroupName
            Name = $accountName
            TenantId = $tenantId 
            ResourceId = $resourceId
        }
        
        Add-AzStorageAccountNetworkRule @parameters
    ```

1. Verify that storage account network rule was applied in your storage account firewall. The following PowerShell script compares the `$resourceid` variable from previous steps to the output of the storage account network rule.

    ```powershell
        $parameters = @{
            ResourceGroupName = $resourceGroupName
            Name = $accountName
        }

        $rule = Get-AzStorageAccountNetworkRuleSet @parameters
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

### [Service principal](#tab/service-principal)

Service principal cannot be used to access firewall-protected storage. Use a managed service identity instead.

### [Managed service identity](#tab/managed-identity)

You need to enable the [Allow trusted Microsoft services setting](/azure/storage/common/storage-network-security#trusted-microsoft-services) and [assign an Azure role](../../storage/blobs/authorize-access-azure-active-directory.md#assign-azure-roles-for-access-rights) to the [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for that resource instance. 

In this case, the scope of access for the resource instance corresponds to the Azure role assigned to the managed identity.

### [Anonymous access](#tab/public-access)

You cannot access firewall-protected storage using anonymous access.

---

## Credentials

To query a file located in Azure Storage, your serverless SQL pool endpoint needs a credential that contains the authentication information. Two types of credentials are used:

- Server-level credential is used for ad-hoc queries executed using `OPENROWSET` function. The credential *name* must match the storage URL.
- A database-scoped credential is used for external tables. External table references `DATA SOURCE` with the credential that should be used to access storage.

### Grant permissions to manage credentials

To grant the ability manage credentials:

- To allow a user to create or drop a server-level credential, an administrator must grant the `ALTER ANY CREDENTIAL` permission to its login in the master database. For example:

    ```sql
    GRANT ALTER ANY CREDENTIAL TO [login_name];
    ```
    
- To allow a user to create or drop a database scoped credential, an administrator must grant the `CONTROL` permission on the database to the database user in the user database. For example:

    ```sql
    GRANT CONTROL ON DATABASE::[database_name] TO [user_name];
    ```

### Grant permissions to use credential

Database users who access external storage must have permission to use credentials. To use the credential, a user must have the `REFERENCES` permission on a specific credential. 

To grant the `REFERENCES` permission on a server-level credential for a login, use the following T-SQL query in the master database:

```sql
GRANT REFERENCES ON CREDENTIAL::[server-level_credential] TO [login_name];
```

To grant a `REFERENCES` permission on a database-scoped credential for a database user, use the following T-SQL query in the user database:

```sql
GRANT REFERENCES ON DATABASE SCOPED CREDENTIAL::[database-scoped_credential] TO [user_name];
```

## Server-level credential

Server-level credentials are used when a SQL login calls `OPENROWSET` function without a `DATA_SOURCE` to read files on a storage account. 

The name of server-level credential **must** match the base URL of Azure storage, optionally followed by a container name. A credential is added by running [CREATE CREDENTIAL](/sql/t-sql/statements/create-credential-transact-sql?view=azure-sqldw-latest&preserve-view=true). You must provide the `CREDENTIAL NAME` argument.

> [!NOTE]
> The `FOR CRYPTOGRAPHIC PROVIDER` argument is not supported.

Server-level CREDENTIAL name must match the following format: `<prefix>://<storage_account_path>[/<container_name>]`. Storage account paths are described in the following table:

| External Data Source       | Prefix | Storage account path                                |
| -------------------------- | ------ | --------------------------------------------------- |
| Azure Blob Storage         | `https`  | `<storage_account>.blob.core.windows.net`             |
| Azure Data Lake Storage Gen1 | `https`  | `<storage_account>.azuredatalakestore.net/webhdfs/v1` |
| Azure Data Lake Storage Gen2 | `https`  | `<storage_account>.dfs.core.windows.net`              |

Server-level credentials are then able to access Azure storage using the following authentication types:

### [User identity](#tab/user-identity)

Microsoft Entra users can access any file on Azure storage if they are members of the Storage Blob Data Owner, Storage Blob Data Contributor, or Storage Blob Data Reader role. Microsoft Entra users don't need credentials to access storage. 

SQL authenticated users can't use Microsoft Entra authentication to access storage. They can access storage through a database credential using Managed Identity, SAS Key, Service Principal or if there is public access to the storage.

### [Shared access signature](#tab/shared-access-signature)

The following script creates a server-level credential that can be used by the `OPENROWSET` function to access any file on Azure storage using SAS token. Create this credential to enable a SQL principal to use the `OPENROWSET` function to read files protected with a SAS key on the Azure storage. The credential name must match the URL.

In the following sample query, replace `<mystorageaccountname>` with your actual storage account name, and `<mystorageaccountcontainername>` with the actual container name:

```sql
CREATE CREDENTIAL [https://<mystorageaccountname>.dfs.core.windows.net/<mystorageaccountcontainername>]
WITH IDENTITY='SHARED ACCESS SIGNATURE'
, SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1BrIPBNJ3VYEIq78%3D';
GO
```

Optionally, you can use just the base URL of the storage account, without container name.

### [Service principal](#tab/service-principal)

The following script creates a server-level credential that can be used to access files in a storage using Service principal for authentication and authorization. **AppID** can be found by visiting App registrations in Azure portal and selecting the App requesting storage access. **Secret** is obtained during the App registration. **AuthorityUrl** is URL of Microsoft Entra ID Oauth2.0 authority.

```sql
CREATE CREDENTIAL [https://<storage_account>.dfs.core.windows.net/<container>]
WITH IDENTITY = '<AppID>@<AuthorityUrl>' 
, SECRET = '<Secret>'
```

### [Managed Identity](#tab/managed-identity)
 
The following script creates a server-level credential that can be used by `OPENROWSET` function to access any file on Azure storage using the Azure Synapse workspace managed identity, a special type of managed service identity.

```sql
CREATE CREDENTIAL [https://<storage_account>.dfs.core.windows.net/<container>]
WITH IDENTITY='Managed Identity'
```

Optionally, you can use just the base URL of the storage account, without container name.

### [Public access](#tab/public-access)

Server-level credential isn't required to allow access to publicly available files. Create [data source without credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

---

## Database-scoped credential

Database-scoped credentials are used when any principal calls `OPENROWSET` function with `DATA_SOURCE` or selects data from [external table](develop-tables-external-tables.md) that don't access public files. The database scoped credential doesn't need to match the name of storage account, it is referenced in DATA SOURCE that defines the location of storage.

Database-scoped credentials enable access to Azure storage using the following authentication types:

<a name='azure-ad-identity'></a>

### [Microsoft Entra identity](#tab/user-identity)

Microsoft Entra users can access any file on Azure storage if they are members of the Storage Blob Data Owner, Storage Blob Data Contributor, or Storage Blob Data Reader roles. Microsoft Entra users don't need credentials to access storage.

```sql
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>'
)
```

SQL authenticated users can't use Microsoft Entra authentication to access storage. They can access storage through a database credential using Managed Identity, SAS Key, Service Principal or if there is public access to the storage.


### [Shared access signature](#tab/shared-access-signature)

The following script creates a credential that is used to access files on storage using SAS token specified in the credential. The script creates a sample external data source that uses this SAS token to access storage.

```sql
-- Optional: Create MASTER KEY if not exists in database:
-- CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Very Strong Password>'
GO
CREATE DATABASE SCOPED CREDENTIAL [SasToken]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
     SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KEIq78%3D';
GO
CREATE EXTERNAL DATA SOURCE mysample
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>',
          CREDENTIAL = SasToken
)
```

### [Service principal](#tab/service-principal)
The following script creates a database-scoped credential that can be used to access files in a storage using service principal for authentication and authorization. **AppID** can be found by visiting App registrations in Azure portal and selecting the App requesting storage access. **Secret** is obtained during the App registration. **AuthorityUrl** is URL of Microsoft Entra ID Oauth2.0 authority.

```sql
-- Optional: Create MASTER KEY if not exists in database:
-- CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Very Strong Password>

CREATE DATABASE SCOPED CREDENTIAL [<CredentialName>] WITH
IDENTITY = '<AppID>@<AuthorityUrl>' 
, SECRET = '<Secret>'
GO
CREATE EXTERNAL DATA SOURCE MyDataSource
WITH (    LOCATION   = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>',
          CREDENTIAL = CredentialName
)
```

### [Managed Identity](#tab/managed-identity)

The following script creates a database-scoped credential that can be used to impersonate current Microsoft Entra user as Managed Identity of service. The script creates a sample external data source that uses workspace identity to access storage.

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

Database scoped credential isn't required to allow access to publicly available files. Create a [data source without credential](develop-tables-external-tables.md?tabs=sql-ondemand#example-for-create-external-data-source) to access publicly available files on Azure storage.

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

### Access a publicly available data source

Use the following script to create a table that accesses publicly available data source.

```sql
CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat]
       WITH ( FORMAT_TYPE = PARQUET)
GO
CREATE EXTERNAL DATA SOURCE publicData
WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<public_container>/<path>' )
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

### Access a data source using credentials

Modify the following script to create an external table that accesses Azure storage using SAS token, Microsoft Entra identity of user, or managed identity of workspace.

```sql
-- Create master key in databases with some password (one-off per database)
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong password>'
GO

-- Create databases scoped credential that use Managed Identity, SAS token or service principal. User needs to create only database-scoped credentials that should be used to access data source:

CREATE DATABASE SCOPED CREDENTIAL WorkspaceIdentity
WITH IDENTITY = 'Managed Identity'
GO
CREATE DATABASE SCOPED CREDENTIAL SasCredential
WITH IDENTITY = 'SHARED ACCESS SIGNATURE', SECRET = 'sv=2019-10-1********ZVsTOL0ltEGhf54N8KhDCRfLRI%3D'
GO
CREATE DATABASE SCOPED CREDENTIAL SPNCredential WITH
IDENTITY = '**44e*****8f6-ag44-1890-34u4-22r23r771098@https://login.microsoftonline.com/**do99dd-87f3-33da-33gf-3d3rh133ee33/oauth2/token' 
, SECRET = '.7OaaU_454azar9WWzLL.Ea9ePPZWzQee~'
GO
-- Create data source that one of the credentials above, external file format, and external tables that reference this data source and file format:

CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat] WITH ( FORMAT_TYPE = PARQUET)
GO

CREATE EXTERNAL DATA SOURCE mysample
WITH ( LOCATION = 'https://<storage_account>.dfs.core.windows.net/<container>/<path>'
-- Uncomment one of these options depending on authentication method that you want to use to access data source:
--,CREDENTIAL = WorkspaceIdentity 
--,CREDENTIAL = SasCredential 
--,CREDENTIAL = SPNCredential
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

These articles help you learn how query different folder types, file types, and create and use views:

- [Query single CSV file](query-single-csv-file.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Query specific files](query-specific-files.md)
- [Query Parquet files](query-parquet-files.md)
- [Create and use views](create-use-views.md)
- [Query JSON files](query-json-files.md)
- [Query Parquet nested types](query-parquet-nested-types.md)
