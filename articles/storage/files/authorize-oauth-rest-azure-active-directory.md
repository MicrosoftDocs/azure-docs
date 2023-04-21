---
title: Access Azure file shares using Azure Active Directory with Azure Files OAuth over REST Preview
description: Authorize access to Azure file shares and directories via the OAuth authentication protocol over REST APIs using Azure Active Directory (Azure AD). Assign Azure roles for access rights. Access files with an Azure AD account.
author: khdownie
ms.service: storage
ms.topic: conceptual
ms.date: 04/21/2023
ms.author: kendownie
ms.subservice: files
---

# Access Azure file shares using Azure Active Directory with Azure Files OAuth over REST Preview

Azure Files OAuth over REST Preview enables privileged read and write data access to Azure file shares via the OAuth authentication protocol using Azure Active Directory (Azure AD) for REST API based access. Users, groups, first-party services such as Azure portal, and third-party services and applications using REST interfaces can now use OAuth authentication and authorization with an Azure AD account to access Azure Files. PowerShell cmdlets and Azure CLI commands that call REST APIs can also use OAuth to access Azure file shares.

> [!IMPORTANT]
> You must call the REST API using an explicit header to indicate your intent to use the additional privilege. This is also true for PowerShell and CLI access. The only supported value for the intent header today is `backup`.

## Limitations

Azure Files OAuth over REST Preview only supports the FileREST Data APIs that support operations on files and directories. OAuth isn't supported on FilesREST data plane APIs that manage FileService and FileShare resources. These management APIs are exposed through the data plane for legacy reasons. We recommend using the control plane APIs (the storage resource provider - Microsoft.Storage) for all management activities related to FileService and FileShare resources.

## Customer use cases

OAuth authentication and authorization with Azure Files over the REST API interface can benefit customers in the following scenarios.

### Application development and service integration

OAuth authentication and authorization enable developers to build applications that access Azure Storage REST APIs using user or application identities from Azure AD.  

Customers and partners can also enable first-party and third-party services to configure necessary access securely and transparently to a customer storage account.  

DevOps tools such as the Azure portal, PowerShell, and CLI, AzCopy, and Storage Explorer can manage data using the user’s identity, eliminating the need to manage or distribute storage access keys.

### Managed identities  

Customers with applications and managed identities that require access to file share data for backup, restore, or auditing purposes can benefit from OAuth authentication and authorization. Enforcing file- and directory-level permissions for each identity adds complexity and might not be compatible with certain workloads. For instance, customers might want to authorize a backup solution service to access Azure file shares with read-only access to all files with no regard to file-specific permissions.

### Storage account key replacement

Azure AD provides superior security and ease of use over shared key access. You can replace storage account key access with OAuth authentication and authorization to access Azure File shares with read-all/write-all privileges. This approach also offers better auditing and tracking specific user access.

## Privileged access and access permissions for data operations  

To use the Azure Files OAuth over REST feature, there are certain additional permissions that are required to be included in the RBAC role assigned to the user, group, or service principal. Two new data actions are introduced as part of this feature:

`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action`

`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`

Users, groups, or service principals that call the REST API with OAuth need to have either the `readFileBackupSemantics` or `writeFileBackupSemantics` action assigned to the role that allows data access. This is a requirement to use this feature. For details on the permissions required to call specific File service operations, see Permissions for calling data operations.

As part of the preview release, there are two new built-in roles that are created that include these new actions.  

| **Role** | **Data actions** |
| Storage File Data Privileged Reader | `Microsoft.Storage/storageAccounts/fileServices/fileShares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action` |
| Storage File Data Privileged Contributor | `Microsoft.Storage/storageAccounts/fileServices/fileShares/files/read`<br>`Microsoft.Storage/storageAccounts/fileServices/fileShares/files/write`<br>`Microsoft.Storage/storageAccounts/fileServices/fileShares/files/delete`<br>`Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`<br>`Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action` |

These new roles are similar to the existing **Storage File Data SMB Share Reader** and **Storage File Data SMB Share Elevated Contributor** built-in roles, but there are some differences:

- The new roles contain the additional data actions that are required for OAuth access.

- When the user, group, or service principal that's assigned **Storage File Data Privileged Reader** or **Storage File Data Privileged Contributor** roles calls the FilesREST Data API using OAuth, the user, group, or the service principal will have:
  - **Storage File Data Privileged Reader:** Full read access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.
  - **Storage File Data Privileged Contributor:** Full read, write, modify ACLs, delete access on all the data in the shares for all the configured storage accounts regardless of the file/directory level NTFS permissions that are set.

- With these special permissions and roles, the system will bypass any file/directory level permissions and allow access to file share data.

With the new roles and data actions, this preview feature will provide storage account-wide privileges that supersede all permissions on files and folders under all file shares in the storage account. However, the new roles only contain permissions to access data services. They don't include any permissions to access file share management services (actions on file shares). To use this feature, make sure you have permissions to access:

- the storage account
- file share management services
- data services (the data in the file share)

There are many [built-in roles](../../role-based-access-control/built-in-roles.md) that provide access to management services. You can also [create custom roles](../../role-based-access-control/custom-roles.md) with the appropriate permissions. To learn more about role-based access control, see [Azure RBAC](../../role-based-access-control/overview.md). For more information about how built-in roles are defined, see [Understand role definitions](../../role-based-access-control/role-definitions.md).

> [!IMPORTANT]
> Any wildcard use cases defined for the path `Microsoft.Storage/storageAccounts/fileServices/*` or higher scope will automatically inherit the additional access and permissions granted through this new data action. To prevent unintended or over-privileged access to Azure Files, we've implemented additional checks that require users and applications to explicitly indicate their intent to use the additional privilege. Furthermore, we strongly recommend that customers review their user RBAC role assignments and replace any wildcard usage with explicit permissions to ensure proper data access management.

## Authorize access to file data in application code

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Azure AD via the Azure SDK. The latest versions of the Azure Storage client libraries for .NET, Java, Python, JavaScript, and Go integrate with the Azure Identity libraries for each of those languages to provide a simple and secure means to acquire an access token for authorization of requests from the Azure file service. During public preview, .NET is the only supported Azure SDK language.

An advantage of the Azure Identity client library is that it enables you to use the same code to acquire the access token whether your application is running in the development environment or in Azure. The Azure Identity client library returns an access token for a security principal. When your code is running in Azure, the security principal may be a managed identity for Azure resources, a service principal, or a user or group. In the development environment, the client library provides an access token for either a user or a service principal for testing purposes.

The access token returned by the Azure Identity client library is encapsulated in a token credential. You can then use the token credential to get a service client object to use in performing authorized operations against Azure Storage.  

Here's some sample code:

```aspx-csharp
using Azure.Core;
using Azure.Identity;
using Azure.Storage.Files.Shares;
using Azure.Storage.Files.Shares.Models;

namespace FilesOAuthSample
{
    internal class Program
    {
        static async Task Main(string[] args)
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

            ShareServiceClient shareServiceClient = new ShareServiceClient(
                new Uri(accountUri),
                tokenCredential,
                ShareFileRequestIntent.Backup,
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

## Next steps

- [Authorize access to Azure file share data in the Azure portal](authorize-data-operations-portal.md)
