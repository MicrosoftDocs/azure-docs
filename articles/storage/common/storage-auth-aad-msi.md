---
title: Authenticate access to blob and queue data with Azure Active Directory managed identities for Azure resources - Azure Storage | Microsoft Docs
description: Azure Blob and Queue storage support Azure Active Directory authentication with managed identities for Azure resources. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/12/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate access to blob and queue data with managed identities for Azure Resources

Azure Blob and Queue storage support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to blob and queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

This article shows how to authorize access to blob or queue data with a managed identity from an Azure VM.  

## Enable managed identities on a VM

Before you can use managed identities for Azure Resources to authorize access to blobs and queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager Template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure SDKs](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

## Assign an RBAC role to an Azure AD managed identity

To authorize a request from a managed identity in your Azure Storage application, first configure role-based access control (RBAC) settings for that managed identity. Azure Storage defines RBAC roles that encompass permissions for blob and queue data. When the RBAC role is assigned to a managed identity, the managed identity is granted those permissions to blob or queue data at the appropriate scope. For more information about assigning RBAC roles, see [Manage access rights to Azure Blob and Queue data with RBAC](storage-auth-aad-rbac.md).

## Authorize with a managed identity access token

To authorize requests against Blob and Queue storage with a managed identity, your application or script must acquire an OAuth token. The [Microsoft Azure App Authentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) client library for .NET (preview) simplifies the process of acquiring and renewing a token from your code.

The App Authentication client library manages authentication automatically. The library uses the developer's credentials to authenticate during local development. Using developer credentials during local development is more secure because you do not need to create Azure AD credentials or share credentials between developers. When the solution is later deployed to Azure, the library automatically switches to using application credentials.

To use the App Authentication library in an Azure Storage application, install the latest preview package from [Nuget]((https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication)), as well as the latest version of the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/). Add the following **using** statements to your code:

```csharp
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Auth;
```

The App Authentication library provides the **AzureServiceTokenProvider** class. An instance of this class can be passed to a callback that gets a token and then renews the token before it expires.

The following example gets a token and uses it to create a new blob, then uses the same token to read the blob.

```csharp
const string blobName = "https://storagesamples.blob.core.windows.net/sample-container/blob1.txt";

// Get the initial access token and the interval at which to refresh it.
AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
var tokenAndFrequency = TokenRenewerAsync(azureServiceTokenProvider, 
                                            CancellationToken.None).GetAwaiter().GetResult();

// Create storage credentials using the initial token, and connect the callback function 
// to renew the token just before it expires
TokenCredential tokenCredential = new TokenCredential(tokenAndFrequency.Token, 
                                                        TokenRenewerAsync,
                                                        azureServiceTokenProvider, 
                                                        tokenAndFrequency.Frequency.Value);

StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

// Create a blob using the storage credentials.
CloudBlockBlob blob = new CloudBlockBlob(new Uri(blobName), 
                                            storageCredentials);

// Upload text to the blob.
blob.UploadTextAsync(string.Format("This is a blob named {0}", blob.Name));

// Continue to make requests against Azure Storage. 
// The token is automatically refreshed as needed in the background.
do
{
    // Read blob contents
    Console.WriteLine("Time accessed: {0} Blob Content: {1}", 
                        DateTimeOffset.UtcNow, 
                        blob.DownloadTextAsync().Result);

    // Sleep for ten seconds, then read the contents of the blob again.
    Thread.Sleep(TimeSpan.FromSeconds(10));
} while (true);
```

The callback method checks the expiration time of the token and renews it as needed:

```csharp
private static async Task<NewTokenAndFrequency> TokenRenewerAsync(Object state, CancellationToken cancellationToken)
{
    // Specify the resource ID for requesting Azure AD tokens for Azure Storage.
    const string StorageResource = "https://storage.azure.com/";  

    // Use the same token provider to request a new token.
    var authResult = await ((AzureServiceTokenProvider)state).GetAuthenticationResultAsync(StorageResource);

    // Renew the token 5 minutes before it expires.
    var next = (authResult.ExpiresOn - DateTimeOffset.UtcNow) - TimeSpan.FromMinutes(5);
    if (next.Ticks < 0)
    {
        next = default(TimeSpan);
        Console.WriteLine("Renewing token...");
    }

    // Return the new token and the next refresh time.
    return new NewTokenAndFrequency(authResult.AccessToken, next);
}
```

For more information about the App Authentication library, see [Service-to-service authentication to Azure Key Vault using .NET](../../key-vault/service-to-service-authentication.md). 

To learn more about how to acquire an access token, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

> [!NOTE]
> To authorize requests against blob or queue data with Azure AD, you must use HTTPS for those requests.

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- To learn how to sign in to Azure CLI and PowerShell with an Azure AD identity, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell](storage-auth-aad-script.md).