---
title: Create a shared access signature (SAS) on a blob container with .NET - Azure Storage
description: Learn how to create a shared access signature (SAS) to delegate access to a blob container in Azure Storage using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/16/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Create a shared access signature (SAS) on a blob container with .NET

A shared access signature (SAS) enables you to grant limited access to containers and blobs to other clients, without compromising your account keys. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to create a SAS for Blob storage with the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## About shared access signatures

types etc.

## Create a service SAS


## Create an account SAS


## Create a user delegation SAS

### Define a callback method to acquire and renew the token

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

### Get a user delegation SAS

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



## Test a container SAS


