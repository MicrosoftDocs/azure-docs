---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with .NET - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/16/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with .NET

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Use Azure AD credentials to secure a SAS

When you create a user delegation SAS using your Azure AD credentials, the signature is derived from an OAuth 2.0 token. You can acquire the OAuth 2.0 token in one of the following ways:

- If your code is running in an Azure environment, such as an Azure virtual machine (VM), then you can use managed identities for Azure resources to acquire the OAuth token. For more information, see [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](../common/storage-auth-aad-msi.md).
- If your code is running in a native application or a web application, then you can use the OAuth 2.0 authorization code flow to acquire the OAuth token. In your code to acquire the token, specify the built-in `user_impersonation` scope, which indicates that the token is being requested on behalf of the user whose credentials are provided. For more information, see [Authenticate with Azure Active Directory from an application for access to blobs and queues](../common/storage-auth-aad-app.md).

This article shows how to use a managed identity to acquire the token that is used to get the user delegation key and create the SAS.

## Acquire the OAuth 2.0 token

[!INCLUDE [storage-app-auth-lib-include](../../../includes/storage-app-auth-lib-include.md)]

Next, create a callback method that acquires the token and renews it before it expires:

```csharp
private static async Task<NewTokenAndFrequency> TokenRenewerAsync(Object state, CancellationToken cancellationToken)
{
    // Specify the resource ID for requesting an OAuth 2.0 token for Azure Storage.
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

## Get the user delegation key

Every SAS is signed with a key. To create a user delegation SAS, you must first request a user delegation key, which is then used to sign the SAS. The user delegation key is analogous to the account key used to sign a service SAS or an account SAS, except that it relies on your Azure AD credentials.

After your code has acquired the OAuth 2.0 token, use the token to request the user delegation key. Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token does not need to be renewed so long as the key is still valid. You can specify that the key is valid for a period of up to 7 days.

Use one of the following methods to request the user delegation key:

- [GetUserDelegationKey](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkey)
- [GetUserDelegationKeyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkeyasync)

```csharp
private static async Task<UserDelegationKey> GetKeyUserDelegationSas(CloudBlobClient blobClient)
{
    UserDelegationKey key = null;

    try
    {
        // Get a user delegation key for the Blob service that's valid for one day.
        key = await blobClient.GetUserDelegationKeyAsync(
                                                            new DateTimeOffset(DateTime.UtcNow),
                                                            new DateTimeOffset(DateTime.UtcNow.AddDays(1)));

    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0} : {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
    }

    return key;
}
```

## Create a user delegation SAS

Use one of the following methods to create the SAS, depending on whether you are creating the SAS on a container or on a blob:

- [GetUserDelegationSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.getuserdelegationsharedaccesssignature) (**CloudBlobContainer** object)
- [GetUserDelegationSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblob.getuserdelegationsharedaccesssignature) (**CloudBlob** object)

## Example: Get a user delegation SAS for a container

The following example invokes the callback method to acquire and renew the token, then uses the token to get the user delegation key. The code passes the user delegation key to the [GetUserDelegationSharedAccessSignature](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.getuserdelegationsharedaccesssignature) method to get the SAS token.

```csharp
private static async Task<string> GetContainerSasWithToken()
{
    // Get the initial access token and the interval at which to refresh it.
    AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
    var tokenAndFrequency = TokenRenewerAsync(azureServiceTokenProvider,
                                                CancellationToken.None).GetAwaiter().GetResult();

    // Create storage credentials using the initial token, and connect the callback function
    // to renew the token just before it expires.
    TokenCredential tokenCredential = new TokenCredential(tokenAndFrequency.Token,
                                                            TokenRenewerAsync,
                                                            azureServiceTokenProvider,
                                                            tokenAndFrequency.Frequency.Value);

    // Create the Blob service client object using the token.
    StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);
    CloudBlobClient blobClient = new CloudBlobClient(
                                                    new Uri("https://storagesamples.blob.core.windows.net"),
                                                    storageCredentials);

    CloudBlobContainer container = blobClient.GetContainerReference("sample-container");
    string userDelegationSasToken = null;

    try
    {
        // Create the container if it does not already exist.
        await container.CreateIfNotExistsAsync();

        // Get a user delegation key for the Blob service that's valid for one day.
        UserDelegationKey key = await blobClient.GetUserDelegationKeyAsync(
                                                                            new DateTimeOffset(DateTime.UtcNow),
                                                                            new DateTimeOffset(DateTime.UtcNow.AddDays(1)));

        // Define the access policy for the SAS.
        SharedAccessBlobPolicy policy = new SharedAccessBlobPolicy()
        {
            Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.Write |
                          SharedAccessBlobPermissions.List | SharedAccessBlobPermissions.Create,
            SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-5),
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24)
        };

        // Provide the user delegation key to get the SAS.
        userDelegationSasToken = container.GetUserDelegationSharedAccessSignature(key, policy);

        Console.WriteLine("User delegation SAS token for blob container {0}: {1}", container.Name, userDelegationSasToken);
        Console.WriteLine();
    }
    catch (StorageException e)
    {
        Console.WriteLine("HTTP error code {0} : {1}",
                            e.RequestInformation.HttpStatusCode,
                            e.RequestInformation.ErrorCode);
        Console.WriteLine(e.Message);
    }

    if (userDelegationSasToken != null)
    {
        return container.Uri + userDelegationSasToken;
    }
    else
    {
        return null;
    }
}
```

### Example: Get a user delegation SAS for a blob

```csharp
code
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Delegating Access with a Shared Access Signature](/rest/api/storageservices/delegating-access-with-a-shared-access-signature)
