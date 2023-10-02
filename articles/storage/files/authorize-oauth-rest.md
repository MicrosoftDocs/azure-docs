---
title: Enable admin-level read and write access to Azure file shares using Azure Active Directory with Azure Files OAuth over REST
description: Authorize access to Azure file shares and directories via the OAuth authentication protocol over REST APIs using Azure Active Directory (Azure AD). Assign Azure roles for access rights. Access files with an Azure AD account.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 08/04/2023
ms.author: kendownie
ms.custom: devx-track-azurepowershell
---

# Access Azure file shares using Azure Active Directory with Azure Files OAuth over REST

Azure Files OAuth over REST enables admin-level read and write access to Azure file shares for users and applications via the [OAuth](https://oauth.net/) authentication protocol, using Azure Active Directory (Azure AD) for REST API based access. Users, groups, first-party services such as Azure portal, and third-party services and applications using REST interfaces can now use OAuth authentication and authorization with an Azure AD account to access data in Azure file shares. PowerShell cmdlets and Azure CLI commands that call REST APIs can also use OAuth to access Azure file shares.

> [!IMPORTANT]
> You must call the REST API using an explicit header to indicate your intent to use the additional privilege. This is also true for Azure PowerShell and Azure CLI access.

## Limitations

Azure Files OAuth over REST only supports the FileREST Data APIs that support operations on files and directories. OAuth isn't supported on FilesREST data plane APIs that manage FileService and FileShare resources. These management APIs are called using the Storage Account Key or SAS token, and are exposed through the data plane for legacy reasons. We recommend using the control plane APIs (the storage resource provider - Microsoft.Storage) that support OAuth for all management activities related to FileService and FileShare resources.

Authorizing file data operations with Azure AD is supported only for REST API versions 2022-11-02 and later. See [Versioning for Azure Storage](/rest/api/storageservices/versioning-for-the-azure-storage-services).

## Customer use cases

OAuth authentication and authorization with Azure Files over the REST API interface can benefit customers in the following scenarios.

### Application development and service integration

OAuth authentication and authorization enable developers to build applications that access Azure Storage REST APIs using user or application identities from Azure AD.  

Customers and partners can also enable first-party and third-party services to configure necessary access securely and transparently to a customer storage account.  

DevOps tools such as the Azure portal, PowerShell, and CLI, AzCopy, and Storage Explorer can manage data using the user's identity, eliminating the need to manage or distribute storage access keys.

### Managed identities  

Customers with applications and managed identities that require access to file share data for backup, restore, or auditing purposes can benefit from OAuth authentication and authorization. Enforcing file- and directory-level permissions for each identity adds complexity and might not be compatible with certain workloads. For instance, customers might want to authorize a backup solution service to access Azure file shares with read-only access to all files with no regard to file-specific permissions.

### Storage account key replacement

Azure AD provides superior security and ease of use over shared key access. You can replace storage account key access with OAuth authentication and authorization to access Azure File shares with read-all/write-all privileges. This approach also offers better auditing and tracking specific user access.

## Privileged access and access permissions for data operations  

To use the Azure Files OAuth over REST feature, there are additional permissions that are required to be included in the RBAC role assigned to the user, group, or service principal. Two new data actions are introduced as part of this feature:

`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action`

`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`

Users, groups, or service principals that call the REST API with OAuth must have either the `readFileBackupSemantics` or `writeFileBackupSemantics` action assigned to the role that allows data access. This is a requirement to use this feature. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

This feature provides two new built-in roles that include these new actions.  

| **Role** | **Data actions** |
|----------|------------------|
| Storage File Data Privileged Reader | `Microsoft.Storage/storageAccounts/fileServices/fileShares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action` |
| Storage File Data Privileged Contributor | `Microsoft.Storage/storageAccounts/fileServices/fileShares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/fileShares/files/write`<br>`Microsoft.Storage/storageAccounts/fileServices/fileShares/files/delete`<br>`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`<br>`Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action` |

These new roles are similar to the existing [Storage File Data SMB Share Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader) and [Storage File Data SMB Share Elevated Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor) built-in roles, but there are some differences:

- The new roles contain the additional data actions that are required for OAuth access.

- When the user, group, or service principal that's assigned **Storage File Data Privileged Reader** or **Storage File Data Privileged Contributor** roles calls the FilesREST Data API using OAuth, the user, group, or the service principal will have:
  - **Storage File Data Privileged Reader:** Full read access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.
  - **Storage File Data Privileged Contributor:** Full read, write, modify ACLs, delete access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.

- With these special permissions and roles, the system will bypass any file/directory level permissions and allow access to file share data.

With the new roles and data actions, this feature will provide storage account-wide privileges that supersede all permissions on files and folders under all file shares in the storage account. However, the new roles only contain permissions to access data services. They don't include any permissions to access file share management services (actions on file shares). To use this feature, make sure you have permissions to access:

- the storage account
- file share management services
- data services (the data in the file share)

There are many [built-in roles](../../role-based-access-control/built-in-roles.md) that provide access to management services. You can also [create custom roles](../../role-based-access-control/custom-roles.md) with the appropriate permissions. To learn more about role-based access control, see [Azure RBAC](../../role-based-access-control/overview.md). For more information about how built-in roles are defined, see [Understand role definitions](../../role-based-access-control/role-definitions.md).

> [!IMPORTANT]
> Any wildcard use cases defined for the path `Microsoft.Storage/storageAccounts/fileServices/*` or higher scope will automatically inherit the additional access and permissions granted through this new data action. To prevent unintended or over-privileged access to Azure Files, we've implemented additional checks that require users and applications to explicitly indicate their intent to use the additional privilege. Furthermore, we strongly recommend that customers review their user RBAC role assignments and replace any wildcard usage with explicit permissions to ensure proper data access management.

## Authorize access to file data in application code

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Azure AD via the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, JavaScript, and Go integrate with the Azure Identity libraries for each of those languages to provide a simple and secure means to acquire an access token for authorization of requests from the Azure file service.

An advantage of the Azure Identity client library is that it enables you to use the same code to acquire the access token whether your application is running in the development environment or in Azure. The Azure Identity client library returns an access token for a security principal. When your code is running in Azure, the security principal may be a managed identity for Azure resources, a service principal, or a user or group. In the development environment, the client library provides an access token for either a user or a service principal for testing purposes.

The access token returned by the Azure Identity client library is encapsulated in a token credential. You can then use the token credential to get a service client object to use in performing authorized operations against the Azure Files service.  

Here's some sample code:

```aspx-csharp
using Azure.Core;
using Azure.Identity;
using Azure.Storage.Files.Shares;
using Azure.Storage.Files.Shares.Models;

namespace FilesOAuthSample
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            string tenantId = "";
            string appId = "";
            string appSecret = "";
            string aadEndpoint = "";
            string accountUri = "";
            string connectionString = "";
            string shareName = "testShare";
            string directoryName = "testDirectory";
            string fileName = "testFile"; 

            ShareClient sharedKeyShareClient = new ShareClient(connectionString, shareName); 
            await sharedKeyShareClient.CreateIfNotExistsAsync(); 

            TokenCredential tokenCredential = new ClientSecretCredential(
                tenantId,
                appId,
                appSecret,
                new TokenCredentialOptions()
                {
                    AuthorityHost = new Uri(aadEndpoint)
                });

            ShareClientOptions clientOptions = new ShareClientOptions(ShareClientOptions.ServiceVersion.V2021_12_02);

            // Set Allow Trailing Dot and Source Allow Trailing Dot.
            clientOptions.AllowTrailingDot = true;
            clientOptions.SourceAllowTrailingDot = true;

            // x-ms-file-intent=backup will automatically be applied to all APIs
            // where it is required in derived clients.

            clientOptions.ShareTokenIntent = ShareTokenIntent.Backup;
            ShareServiceClient shareServiceClient = new ShareServiceClient(
                new Uri(accountUri),
                tokenCredential,
                clientOptions);

            ShareClient shareClient = shareServiceClient.GetShareClient(shareName);
            ShareDirectoryClient directoryClient = shareClient.GetDirectoryClient(directoryName);
            await directoryClient.CreateAsync();

            ShareFileClient fileClient = directoryClient.GetFileClient(fileName);
            await fileClient.CreateAsync(maxSize: 1024);
            await fileClient.GetPropertiesAsync();
            await sharedKeyShareClient.DeleteIfExistsAsync();
        }
    }
}
```

## Authorize access using FileREST data plane API

You can also authorize access to file data using the Azure portal or Azure PowerShell.

# [Azure portal](#tab/portal)

The [Azure portal](https://portal.azure.com?azure-portal=true) can use either your Azure AD account or the storage account access key to access file data in an Azure storage account. Which authorization scheme the Azure portal uses depends on the Azure roles that are assigned to you.

When you attempt to access file data, the Azure portal first checks whether you've been assigned an Azure role with `Microsoft.Storage/storageAccounts/listkeys/action`. If you've been assigned a role with this action, then the Azure portal uses the account key for accessing file data via shared key authorization. If you haven't been assigned a role with this action, then the Azure portal attempts to access data using your Azure AD account.

To access file data from the Azure portal using your Azure AD account, you need permissions to access file data, and you also need permissions to navigate through the storage account resources in the Azure portal. The built-in roles provided by Azure grant access to file resources, but they don't grant permissions to storage account resources. For this reason, access to the portal also requires assigning an Azure Resource Manager (ARM) role such as the **Reader** role, scoped to the level of the storage account or higher. The **Reader** role grants the most restrictive permissions, but any ARM role that grants access to storage account management resources is acceptable.

The Azure portal indicates which authorization scheme is in use when you navigate to a container. For more information about data access in the portal, see [Choose how to authorize access to file data in the Azure portal](authorize-data-operations-portal.md).

# [Azure PowerShell](#tab/powershell)

Azure provides extensions for PowerShell that enable you to sign in and call PowerShell cmdlets using Azure AD credentials. When you sign into PowerShell with Azure AD credentials, an OAuth 2.0 access token is returned. PowerShell automatically uses that token to authorize subsequent data operations against file storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

You can assign permissions to file data to an Azure AD security principal via Azure RBAC.

## Supported operations

The extensions only support operations on file data. Which operations you may call depends on the permissions granted to the Azure AD security principal with which you signed into PowerShell.

The storage context with OAuth will only work if it's called with the `-EnableFileBackupRequestIntent` parameter. This is to specify the explicit intent to use the additional permissions that this feature provides.

The storage context with OAuth will only work for operations on files and directories, and Get/Set permissions on Azure file shares. For all other operations on storage account and file shares, you must use the storage account key or SAS token.

## Prerequisites

You'll need an Azure resource group and a storage account within that resource group. The storage account must be assigned an appropriate role that grants explicit permissions to perform data operations against file shares. Make sure that you have the required roles and permissions to access both the management services and data services. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

## Install Az.Storage module

This feature is available in the latest Az.Storage module. Install the module using this command:

```azurepowershell-interactive
Install-Module Az.Storage -Repository PsGallery
```

## Authorize access to file data

To authorize access to file data, follow these steps.

1. Sign in to your Azure account using the `Connect-AzAccount` cmdlet.

2. Get the storage account context using the storage account key by calling the `Get-AzStorageAccount` cmdlet (management service). Replace `<ResourceGroupName>` and `<StorageAccountName>` with your values.
   
   ```azurepowershell-interactive
   $ctxkey = (Get-AzStorageAccount -ResourceGroupName <ResourceGroupName> -Name <StorageAccountName>).Context
   ```
   
3. Create a file share by calling `New-AzStorageShare`. Because you're using the storage account context from step 2, the file share is created using your storage account key.
   
   ```azurepowershell-interactive
   $fileshareName = "sample-share"
   New-AzStorageShare -Name $fileshareName -Context $ctxkey
   ```
   
4. Get the storage account context using OAuth for performing data operations on the file share (data service). Replace `<StorageAccountName>` with your storage account name.
   
   ```azurepowershell-interactive
   $ctx = New-AzStorageContext -StorageAccountName <StorageAccountName> -EnableFileBackupRequestIntent
   ```
   
   To get the storage account context with OAuth, you must explicitly pass the `-EnableFileBackupRequestIntent` parameter to the `New-AzStorageContext` cmdlet. If you don't pass the intent parameter, subsequent file share data operation requests using the context will fail.
   
5. Create a test directory and file in the file share using `New-AzStorageDirectory` and `Set-AzStorageFileContent` cmdlets. Remember to specify a local source file path.
   
   ```azurepowershell-interactive
   $dir = New-AzStorageDirectory -ShareName $fileshareName -Path "dir1" -Context $ctx
   $file = Set-AzStorageFileContent -ShareName $fileshareName -Path "test2" -Source "<local source file path>" -Context $ctx  
   ```
   
   Because the cmdlets are called using the storage account context from step 4, the file and directory will be created using Azure AD credentials.

# [Azure CLI](#tab/cli)

Core Azure CLI commands that ship as part of CLI support Files OAuth over REST interface, and you can use them to authenticate and authorize file data operations using Azure AD credentials.

## Supported operations

The commands only support operations on file data. Which operations you may call depends on the permissions granted to the Azure AD security principal with which you signed into Azure CLI.

OAuth authentication and authorization will only work if the CLI command is called with the `--backup-intent` option or `--enable-file-backup-request-intent` option. This is to specify the explicit intent to use the additional permissions that this feature provides.

All commands under `az storage file`, `az storage directory` command groups, and `az storage share list-handle` and `az storage share close-handle` support OAuth authentication and authorization. For all other operations on storage account and file shares, you must use the storage account key or SAS token.

## Prerequisites

You'll need an Azure resource group and a storage account within that resource group. The storage account must be assigned an appropriate role that grants explicit permissions to perform data operations against file shares. Make sure that you have the required roles and permissions to access both the management services and data services. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

## Installation and example commands

If you haven't already done so, [install the latest version of Azure CLI](/cli/azure/install-azure-cli).

### Authorize access to file data

1. Sign in to your Azure account.
   
   ```azurecli
   az login
   ```
   
1. Create a file share by calling `az storage share create cli`. Because you're using the connection string, the file share is created using your storage account key.
   
   ```azurecli
   az storage share create --name testshare1 --connection-string <connection-string>
   ```

1. Create a test directory and upload a file into the file share using `az storage directory create` and `az storage file upload cli`. Remember to specify the `--auth` mode as login and pass the `--backup-intent` parameter.
   
   ```azurecli
   az storage directory create --name testdir1 --account-name filesoauthsa --share-name testshare1 --auth-mode login --backup-intent
   az storage file upload  --account-name filesoauthsa --share-name testshare1 --auth-mode login --backup-intent --source <source file path>
   ```
   
   Because the cli commands are called using authentication type as login  (`--auth mode`login and `--backup-intent` parameter), the file and directory will be created using Azure AD credentials.

For more information refer to the latest CLI documentation for supported commands:

- [az storage file](/cli/azure/storage/file)
- [az storage directory](/cli/azure/storage/directory)
- [az storage share list-handle](/cli/azure/storage/share#az-storage-share-list-handle)
- [az storage share close-handle](/cli/azure/storage/share#az-storage-share-close-handle)
---

## See also

- [Choose how to authorize access to file data in the Azure portal](authorize-data-operations-portal.md)
