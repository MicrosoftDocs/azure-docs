---
title: Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources - Azure Storage
description: Azure Blob and Queue storage support authorizing access to resources with Azure Active Directory and managed identities for Azure resources. You can use managed identities for Azure resources to authorize access to blobs and queues from applications running in Azure virtual machines, function apps, virtual machine scale sets, and others.  
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources

Azure Blob and Queue storage support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to blob and queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

This article shows how to authorize access to blob or queue data with a managed identity from an Azure VM.

Use a managed identity to create a blob
Use a service principal to create a blob from dev env

## Enable managed identities on a VM

Before you can use managed identities for Azure Resources to authorize access to blobs and queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

## Grant permissions to an Azure AD managed identity

To authorize a request to the Blob or Queue service from a managed identity in your Azure Storage application, first configure role-based access control (RBAC) settings for that managed identity. Azure Storage defines RBAC roles that encompass permissions for blob and queue data. When the RBAC role is assigned to a managed identity, the managed identity is granted those permissions to blob or queue data at the appropriate scope.

For more information about assigning RBAC roles, see one of the following articles:

- [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md)
- [Grant access to Azure blob and queue data with RBAC using Azure CLI](storage-auth-aad-rbac-cli.md)
- [Grant access to Azure blob and queue data with RBAC using PowerShell](storage-auth-aad-rbac-powershell.md)

## Install the preview packages

The examples in this article use the latest preview version of the Azure Storage client library for Blob storage. To install the preview package, run the following command from the NuGet package manager console:

```
Install-Package Azure.Storage.Blobs -IncludePrerelease
```

The examples in this article also use the latest preview version of the [Azure Identity client library for .NET](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials. The Azure Identity client library authenticates a security principal. The authenticated security principal can then create the user delegation SAS. For more information about the Azure Identity client library, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity).

```
Install-Package Azure.Identity -IncludePrerelease
```

## Create a service principal

To authenticate with Azure AD credentials via the Azure Identity client library, use either a service principal or a managed identity as the security principal, depending on where your code is running. If your code is running in a development environment, use a service principal for testing purposes. If your code is running in Azure, use a managed identity. This article assumes that you are running code from the development environment, and shows how to use a service principal to create the user delegation SAS.

To create a service principal with Azure CLI and assign an RBAC role, call the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command. Provide an Azure Storage data access role to assign to the new service principal. For more information about the built-in roles provided for Azure Storage, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

Additionally, provide the scope for the role assignment. The service principal will create the user delegation key, which is an operation performed at the level of the storage account, so the role assignment should be scoped at the level of the storage account, resource group, or subscription. For more information about RBAC permissions for creating a user delegation SAS, see the **Assign permissions with RBAC** section in [Create a user delegation SAS (REST API)](/rest/api/storageservices/create-user-delegation-sas).

If you do not have sufficient permissions to assign a role to the service principal, you may need to ask the account owner or administrator to perform the role assignment.

The following example uses the Azure CLI to create a new service principal and assign the **Storage Blob Data Contributor** role to it with account scope

```azurecli-interactive
az ad sp create-for-rbac \
    --name <service-principal> \
    --role "Storage Blob Data Contributor" \
    --scopes /subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

The `az ad sp create-for-rbac` command returns a list of service principal properties in JSON format. Copy these values so that you can use them to create the necessary environment variables in the next step.

```json
{
    "appId": "generated-app-ID",
    "displayName": "service-principal-name",
    "name": "http://service-principal-uri",
    "password": "generated-password",
    "tenant": "tenant-ID"
}
```

> [!IMPORTANT]
> RBAC role assignments may take a few minutes to propagate.


## .NET code example: Create a block blob

The code example shows how to get an OAuth 2.0 token from Azure AD and use it to authorize a request to create a block blob. To get this example working, first follow the steps outlined in the preceding sections.

[!INCLUDE [storage-app-auth-lib-include](../../../includes/storage-app-auth-lib-include.md)]

### Add the callback method

The callback method checks the expiration time of the token and renews it as needed:

```csharp
private static async Task<NewTokenAndFrequency> TokenRenewerAsync(Object state, CancellationToken cancellationToken)
{
    // Specify the resource ID for requesting Azure AD tokens for Azure Storage.
    // Note that you can also specify the root URI for your storage account as the resource ID.
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

### Get a token and create a block blob

The App Authentication library provides the **AzureServiceTokenProvider** class. An instance of this class can be passed to a callback that gets a token and then renews the token before it expires.

The following example gets a token and uses it to create a new blob, then uses the same token to read the blob.

```csharp
const string blobName = "https://storagesamples.blob.core.windows.net/sample-container/blob1.txt";

// Get the initial access token and the interval at which to refresh it.
AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
var tokenAndFrequency = await TokenRenewerAsync(azureServiceTokenProvider,CancellationToken.None);

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
await blob.UploadTextAsync(string.Format("This is a blob named {0}", blob.Name));

// Continue to make requests against Azure Storage.
// The token is automatically refreshed as needed in the background.
do
{
    // Read blob contents
    Console.WriteLine("Time accessed: {0} Blob Content: {1}",
                        DateTimeOffset.UtcNow,
                        await blob.DownloadTextAsync());

    // Sleep for ten seconds, then read the contents of the blob again.
    Thread.Sleep(TimeSpan.FromSeconds(10));
} while (true);
```

For more information about the App Authentication library, see [Service-to-service authentication to Azure Key Vault using .NET](../../key-vault/service-to-service-authentication.md).

To learn more about how to acquire an access token, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

> [!NOTE]
> To authorize requests against blob or queue data with Azure AD, you must use HTTPS for those requests.

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- To learn how to run Azure CLI and PowerShell commands with Azure AD credentials, see [Run Azure CLI or PowerShell commands with Azure AD credentials to access blob or queue data](storage-auth-aad-script.md).
