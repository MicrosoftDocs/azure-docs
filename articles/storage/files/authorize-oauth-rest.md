---
title: Enable Access to Azure File Shares Using OAuth Over REST
description: Authorize admin-level read and write access to Azure file shares and directories via the OAuth authentication protocol over REST APIs using Microsoft Entra ID. Assign Azure RBAC roles for access rights. Access file data with a Microsoft Entra account.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 02/27/2026
ms.author: kendownie
ms.custom:
  - devx-track-azurepowershell
  - build-2025
  - sfi-ropc-nochange
# Customer intent: As a cloud administrator, I want to configure OAuth authentication for accessing Azure file shares over REST APIs, so that I can streamline access management and enhance security by eliminating the need for storage account keys while leveraging role-based permissions.
---

# Access Azure file shares using Microsoft Entra ID with Azure Files OAuth over REST

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider (preview)

By using Azure Files OAuth over REST, users and applications can get admin-level read and write access to Azure file shares through the [OAuth](https://oauth.net/) authentication protocol. This access method uses Entra ID for REST API based access. Users, groups, first-party services such as Azure portal, and third-party services and applications using REST interfaces can now use OAuth authentication and authorization with a Microsoft Entra account to access data in Azure Files. PowerShell cmdlets and Azure CLI commands that call REST APIs can also use OAuth to access Azure Files. You must call the REST API using an explicit header to indicate your intent to use the additional privilege. This requirement also applies to Azure PowerShell and Azure CLI access.

> [!IMPORTANT]
> This article explains how to enable admin-level access to Azure file shares for specific [customer use cases](#customer-use-cases). For a more general article on identity-based authentication for end users, see [Overview of Azure Files identity-based authentication](storage-files-active-directory-overview.md).

## Limitations

Authorizing file data operations by using Microsoft Entra ID is supported only for REST API versions 2022-11-02 and later.  

Azure Files OAuth over REST support for Azure Files REST data plane APIs that manage FileService and FileShare resources is available with REST API versions 2024-11-04 and later.

See [Versioning for Azure Storage](/rest/api/storageservices/versioning-for-the-azure-storage-services).

## Customer use cases

OAuth authentication and authorization with Azure Files over the REST API interface can benefit customers in the following scenarios.

### Application development and service integration

OAuth authentication and authorization enable developers to build applications that access Azure Storage REST APIs using user or application identities from Microsoft Entra ID.  

Customers and partners can also enable first-party and third-party services to configure necessary access securely and transparently to a customer storage account.  

DevOps tools such as the Azure portal, PowerShell, CLI, AzCopy, and Storage Explorer can manage data by using the user's identity, eliminating the need to manage or distribute storage access keys.

### Managed identities  

Customers with applications and managed identities that require access to file share data for backup, restore, or auditing purposes can benefit from OAuth authentication and authorization. Enforcing file- and directory-level permissions for each identity adds complexity and might not be compatible with certain workloads. For instance, customers might want to authorize a backup solution service to access Azure file shares with read-only access to all files with no regard to file-specific permissions.

### Storage account key replacement

Microsoft Entra ID provides superior security and ease of use over shared key access. Replace storage account key access by using OAuth authentication and authorization to access Azure file shares with read-all/write-all privileges. This approach also offers better auditing and tracking specific user access.

## Privileged access and access permissions for data operations  

To use the Azure Files OAuth over REST feature, include extra permissions in the RBAC role that you assign to the user, group, or service principal. This feature introduces two new data actions:

`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action`

`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`

Users, groups, or service principals who call the REST API by using OAuth must have either the `readFileBackupSemantics` or `writeFileBackupSemantics` action assigned to the role that grants data access. This is a requirement to use this feature. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

This feature provides two built-in roles that include these actions.

| **Role** | **Data actions** |
|----------|------------------|
| [Storage File Data Privileged Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-privileged-reader) | `Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action` |
| [Storage File Data Privileged Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-privileged-contributor) | `Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write`<br>`Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete`<br>`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`<br>`Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action` |

These roles are similar to the [Storage File Data SMB Share Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader) and [Storage File Data SMB Share Elevated Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor) built-in roles, but there are some differences:

- The new roles contain the extra data actions that OAuth access requires.

- When the user, group, or service principal assigned **Storage File Data Privileged Reader** or **Storage File Data Privileged Contributor** roles calls the FilesREST Data API by using OAuth, the user, group, or the service principal has:
  - **Storage File Data Privileged Reader:** Full read access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.
  - **Storage File Data Privileged Contributor:** Full read, write, modify ACLs, delete access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.

- By using these special permissions and roles, the system bypasses any file or directory level permissions and grants access to file share data.

By using the new roles and data actions, this feature provides storage account-wide privileges that supersede all permissions on files and folders under all file shares in the storage account. However, the new roles only contain permissions to access data services. They don't include any permissions to access file share management services (actions on file shares). To use this feature, make sure you have permissions to access:

- The storage account
- File share management services
- Data services (the data in the file share)

Many [built-in roles](../../role-based-access-control/built-in-roles.md) provide access to management services. You can also [create custom roles](../../role-based-access-control/custom-roles.md) with the appropriate permissions. To learn more about role-based access control, see [Azure RBAC](../../role-based-access-control/overview.md). For more information about how built-in roles are defined, see [Understand role definitions](../../role-based-access-control/role-definitions.md).

For the file share resource type, the corresponding RBAC scope uses `shares` in the control plane (management operations), but uses `fileshares` in the data plane (data operations). If you try to use a file share resource ID that contains `shares` in RBAC scope or data action strings, it doesn't work. You must use `fileshares` in the scope of RBAC assignments, for example:

- `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/fileServices/default/fileshares/<share-name>`

> [!IMPORTANT]
> Any wildcard use cases defined for the path `Microsoft.Storage/storageAccounts/fileServices/*` or higher scope automatically inherit the extra access and permissions granted through this new data action. To prevent unintended or over-privileged access to Azure Files, the system implements extra checks that require users and applications to explicitly indicate their intent to use the extra privilege. Furthermore, you should review your user RBAC role assignments and replace any wildcard usage with explicit permissions to ensure proper data access management.

## Authorize access to file data in application code

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Entra ID via the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, JavaScript, and Go integrate with the Azure Identity libraries for each of those languages to provide a simple and secure means to acquire an access token for authorization of requests from the Azure Files service.

An advantage of the Azure Identity client library is that it enables you to use the same code to acquire the access token whether your application is running in the development environment or in Azure. The Azure Identity client library returns an access token for a security principal. When your code is running in Azure, the security principal can be a managed identity for Azure resources, a service principal, or a user or group. In the development environment, the client library provides an access token for either a user or a service principal for testing purposes.

The Azure Identity client library encapsulates the access token in a token credential. Use the token credential to get a service client object for performing authorized operations against the Azure Files service.  

The following code example shows how to authorize a client object by using Entra ID and perform operations at the directory and file level. This example assumes that the file share already exists.

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
            string entraEndpoint = "";
            string accountUri = "https://<storage-account-name>.file.core.windows.net/";
            string shareName = "test-share";
            string directoryName = "test-directory";
            string fileName = "test-file";  

            TokenCredential tokenCredential = new ClientSecretCredential(
                tenantId,
                appId,
                appSecret,
                new TokenCredentialOptions()
                {
                    AuthorityHost = new Uri(entraEndpoint)
                });

            // Set client options
            ShareClientOptions clientOptions = new ShareClientOptions();
            clientOptions.AllowTrailingDot = true;
            clientOptions.AllowSourceTrailingDot = true;

            // x-ms-file-intent=backup will automatically be applied to all APIs
            // where it is required in derived clients
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
        }
    }
}
```

## Authorize access by using FileREST data plane API

You can also authorize access to file data by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/portal)

The [Azure portal](https://portal.azure.com?azure-portal=true) can use either your Entra account or the storage account access key to access file data in an Azure storage account. Which authorization method the Azure portal uses depends on the Azure roles that are assigned to you.

When you attempt to access file data, the Azure portal first checks whether you have an Azure role with `Microsoft.Storage/storageAccounts/listkeys/action`. If you have a role with this action, the Azure portal uses the storage account key for accessing file data via shared key authorization. If you don't have a role with this action, the Azure portal attempts to access data by using your Entra account.

To access file data from the Azure portal by using your Entra account, you need permissions to access file data, and you also need permissions to navigate through the storage account resources in the Azure portal. The built-in roles provided by Azure grant access to file resources, but they don't grant permissions to storage account resources. For this reason, access to the portal also requires assigning an Azure Resource Manager (ARM) role such as the **Reader** role, scoped to the level of the storage account or higher. The **Reader** role grants the most restrictive permissions, but any ARM role that grants access to storage account management resources is acceptable.

When you navigate to a container, the Azure portal indicates which authorization scheme is in use. For more information about data access in the portal, see [Choose how to authorize access to file data in the Azure portal](authorize-data-operations-portal.md).

# [Azure PowerShell](#tab/powershell)

Azure provides extensions for PowerShell that enable you to sign in and call PowerShell cmdlets by using Entra credentials. When you sign in to PowerShell by using Entra credentials, you receive an OAuth 2.0 access token. PowerShell automatically uses that token to authorize subsequent data operations against file storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

You can assign permissions to file data to a Microsoft Entra security principal via Azure RBAC.

## Supported operations

The extensions only support operations on file data. Which operations you can call depends on the permissions granted to the Entra security principal with which you signed into PowerShell.

The storage context with OAuth works only if you call it with the `-EnableFileBackupRequestIntent` parameter. This parameter specifies the explicit intent to use the additional permissions that this feature provides.

The storage context with OAuth works only for operations on files and directories, and Get/Set permissions on Azure file shares. For all other operations on storage account and file shares, you must use the storage account key or SAS token.

## Prerequisites

You need an Azure resource group and a storage account within that resource group. The storage account must be assigned a role that grants explicit permissions to perform data operations against file shares. Make sure that you have the required roles and permissions to access both the management services and data services. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

You also need to install the latest [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage/) module:

```azurepowershell-interactive
Install-Module Az.Storage -Repository PsGallery
```

## Authorize access to file data

To authorize access to file data by using Azure PowerShell, follow these steps.

1. Sign in to your Azure account by using the `Connect-AzAccount` cmdlet.

1. Get the storage account context by using the storage account key. Call the `Get-AzStorageAccount` cmdlet (management service). Replace `<ResourceGroupName>` and `<StorageAccountName>` with your values.
   
   ```azurepowershell-interactive
   $ctxkey = (Get-AzStorageAccount -ResourceGroupName <ResourceGroupName> -Name <StorageAccountName>).Context
   ```
   
1. Create a file share by calling `New-AzStorageShare`. Because you use the storage account context from step 2, you create the file share by using your storage account key.
   
   ```azurepowershell-interactive
   $fileshareName = "sample-share"
   New-AzStorageShare -Name $fileshareName -Context $ctxkey
   ```
   
1. Get the storage account context by using OAuth for performing data operations on the file share (data service). Replace `<StorageAccountName>` with your storage account name.
   
   ```azurepowershell-interactive
   $ctx = New-AzStorageContext -StorageAccountName <StorageAccountName> -EnableFileBackupRequestIntent
   ```
   
   To get the storage account context by using OAuth, you must explicitly pass the `-EnableFileBackupRequestIntent` parameter to the `New-AzStorageContext` cmdlet. If you don't pass the intent parameter, subsequent file share data operation requests by using the context fail.
   
1. Create a test directory and file in the file share by using `New-AzStorageDirectory` and `Set-AzStorageFileContent` cmdlets. Remember to specify a local source file path.
   
   ```azurepowershell-interactive
   $dir = New-AzStorageDirectory -ShareName $fileshareName -Path "dir1" -Context $ctx
   $file = Set-AzStorageFileContent -ShareName $fileshareName -Path "test2" -Source "<local source file path>" -Context $ctx  
   ```
   
   Because you call the cmdlets by using the storage account context from step 4, you create the file and directory by using Entra credentials.

# [Azure CLI](#tab/cli)

Core Azure CLI commands that ship as part of CLI support Files OAuth over REST interface, and you can use them to authenticate and authorize file data operations by using Entra credentials.

## Supported operations

The commands support operations only on file data. Which operations you can call depends on the permissions granted to the Entra security principal that you use to sign into Azure CLI.

OAuth authentication and authorization work only if you call the CLI command by using the `--backup-intent` option or the `--enable-file-backup-request-intent` option. By using these options, you specify the explicit intent to use the additional permissions that this feature provides.

All commands under the `az storage file` and `az storage directory` command groups, as well as the `az storage share list-handle` and `az storage share close-handle` commands, support OAuth authentication and authorization. For all other operations on storage accounts and file shares, you must use the storage account key or SAS token.

## Prerequisites

You need an Azure resource group and a storage account within that resource group. The storage account must be assigned a role that grants explicit permissions to perform data operations against file shares. Make sure that you have the required roles and permissions to access both the management services and data services. For details on the permissions required to call specific File service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

If you haven't already done so, [install the latest version of Azure CLI](/cli/azure/install-azure-cli).

## Authorize access to file data

Follow these steps to authorize access to file data by using Azure CLI.

1. Sign in to your Azure account.
   
   ```azurecli
   az login
   ```
   
1. Create a file share by calling `az storage share create`. Because you're using the connection string, the file share is created using your storage account key.
   
   ```azurecli
   az storage share create --name testshare1 --connection-string <connection-string>
   ```

1. Create a test directory and upload a file into the file share by using `az storage directory create` and `az storage file upload`. Specify the `--auth-mode` as `login` and pass the `--backup-intent` parameter.
   
   ```azurecli
   az storage directory create --name testdir1 --account-name filesoauthsa --share-name testshare1 --auth-mode login --backup-intent
   az storage file upload  --account-name filesoauthsa --share-name testshare1 --auth-mode login --backup-intent --source <source file path>
   ```
   
   Because the CLI commands use authentication type as `login` (`--auth-mode login` with the `--backup-intent` parameter), the file and directory are created by using Entra credentials.

For more information, refer to the documentation for supported commands:

- [az storage file](/cli/azure/storage/file)
- [az storage directory](/cli/azure/storage/directory)
- [az storage share list-handle](/cli/azure/storage/share#az-storage-share-list-handle)
- [az storage share close-handle](/cli/azure/storage/share#az-storage-share-close-handle)
---

## See also

- [Choose how to authorize access to file data in the Azure portal](authorize-data-operations-portal.md)
