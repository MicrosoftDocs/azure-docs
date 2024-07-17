---
title: Manage storage account resources with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Learn how to manage storage account resources with the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 07/12/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Manage storage account resources with .NET

This article shows you how to manage storage account resources by using the Azure Storage management library for .NET.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your environment

This section walks you through preparing a project to work with the Azure Storage management library for .NET.

From your project directory, install packages for the Azure Storage Resource Manager and Azure Identity client libraries using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```console
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
```

Add these `using` directives to the top of your code file:

```csharp
using Azure.Identity;
using Azure.ResourceManager;
```

#### Create an ArmClient object

To connect an application and manage storage account resources, create an [ArmClient](/dotnet/api/azure.resourcemanager.armclient) object. This client object is the entry point for all ARM clients. Since all management APIs go through the same endpoint, you only need to create one top-level `ArmClient` to interact with resources.

```csharp
ArmClient armClient = new ArmClient(new DefaultAzureCredential());
```

#### Authorization

Azure provides built-in roles that grant permissions to call management operations. Azure Storage also provides built-in roles specifically for use with the Azure Storage resource provider. To learn more, see [Built-in roles for management operations](authorization-resource-provider.md).

## Create a storage account

Each storage account name must be unique within Azure. To check for the availability of a storage account name, you can use the following method:

- [CheckStorageAccountNameAvailability]()

The following code example checks the availability of a storage account name:

```csharp
// Check if the account name is available
bool? nameAvailable = subscription
    .CheckStorageAccountNameAvailability(new StorageAccountNameAvailabilityContent(storageAccountName)).Value.IsNameAvailable;
```

You can create a storage account using the following method:

- [CreateOrUpdateAsync]()

You can set or update the properties of a storage account by setting the parameters on a [StorageAccountCreateOrUpdateContent]() instance.

The following code example creates a storage account with the specified name, resource group, and location:

```csharp
public static async Task<StorageAccountResource> CreateStorageAccount(
    ResourceGroupResource resourceGroup,
    string storageAccountName)
{
    // Define the settings for the storage account
    StorageAccountCreateOrUpdateContent parameters = GetStorageAccountParameters();

    // Create a storage account with defined account name and settings
    StorageAccountCollection accountCollection = resourceGroup.GetStorageAccounts();
    ArmOperation<StorageAccountResource> acccountCreateOperation = 
        await accountCollection.CreateOrUpdateAsync(WaitUntil.Completed, storageAccountName, parameters);
    StorageAccountResource storageAccount = acccountCreateOperation.Value;

    return storageAccount;
}

public static StorageAccountCreateOrUpdateContent GetStorageAccountParameters()
{
    // Define the settings for the storage account
    AzureLocation location = AzureLocation.EastUS;
    StorageSku sku = new(StorageSkuName.StandardLrs);
    StorageKind kind = StorageKind.StorageV2;

    // Set other properties as needed
    StorageAccountCreateOrUpdateContent parameters = new(sku, kind, location)
    {
        AccessTier = StorageAccountAccessTier.Cool,
        AllowSharedKeyAccess = false,
    };

    return parameters;
}
```

## List storage accounts

You can list storage accounts in a subscription or a resource group. The following code example takes a [SubscriptionResource]() instance and lists storage accounts in the subscription:

```csharp
public static async Task ListStorageAccountsForSubscription(SubscriptionResource subscription)
{
    await foreach (StorageAccountResource storageAcctSub in subscription.GetStorageAccountsAsync())
    {
        Console.WriteLine($"\t{storageAcctSub.Id.Name}");
    }
}
```

The following code example takes a [ResourceGroupResource]() instance and lists storage accounts in the resource group:

```csharp
public static async Task ListStorageAccountsInResourceGroup(ResourceGroupResource resourceGroup)
{
    await foreach (StorageAccountResource storageAcct in resourceGroup.GetStorageAccounts())
    {
        Console.WriteLine($"\t{storageAcct.Id.Name}");
    }
}
```

## Manage storage account keys

You can get storage account keys using the following method:

- [GetKeysAsync](): Returns an iterable collection of [StorageAccountKey]() instances.

The following code example gets the keys for a storage account and writes the name and value to the console for example purposes:

```csharp
public static async Task GetStorageAccountKeysAsync(StorageAccountResource storageAccount)
   {
    AsyncPageable<StorageAccountKey> acctKeys = storageAccount.GetKeysAsync();
    await foreach (StorageAccountKey key in acctKeys)
    {
        Console.WriteLine($"\tKey name: {key.KeyName}");
        Console.WriteLine($"\tKey value: {key.Value}");
    }
}
```

You can regenerate a storage account key using the following method:

- [RegenerateKeyAsync](): Regenerates a storage account key and returns the new key value.

The following code example regenerates a storage account key:

```csharp
public static async Task RegenerateStorageAccountKey(StorageAccountResource storageAccount)
{
    StorageAccountRegenerateKeyContent regenKeyContent = new("key1");
    AsyncPageable<StorageAccountKey> regenAcctKeys = storageAccount.RegenerateKeyAsync(regenKeyContent);
    await foreach (StorageAccountKey key in regenAcctKeys)
    {
        Console.WriteLine($"\tKey name: {key.KeyName}");
        Console.WriteLine($"\tKey value: {key.Value}");
    }
}
```

## Update the storage account SKU

You can update existing storage account settings by passing updated parameters to the following method:

- [CreateOrUpdateAsync]()

The following code example updates the storage account SKU from `Standard_LRS` to `Standard_GRS`:

```csharp
public static async Task UpdateStorageAccountSkuAsync(
    StorageAccountResource storageAccount,
    StorageAccountCollection accountCollection)
{
    // Update storage account SKU
    var currentSku = storageAccount.Data.Sku.Name;  // capture the current Sku value before updating
    var kind = storageAccount.Data.Kind ?? StorageKind.StorageV2;
    var location = storageAccount.Data.Location;
    StorageSku updatedSku = new(StorageSkuName.StandardGrs);
    StorageAccountCreateOrUpdateContent updatedParams = new(updatedSku, kind, location);
    await accountCollection.CreateOrUpdateAsync(WaitUntil.Completed, storageAccount.Data.Name, updatedParams);
    Console.WriteLine($"SKU on storage account updated from {currentSku} to {storageAccount.Get().Value.Data.Sku.Name}");
}
```

## Delete a storage account

You can delete a storage account using the following method:

- [DeleteAsync]()

The following code example deletes a storage account:

```csharp
public static async Task DeleteStorageAccountAsync(StorageAccountResource storageAccount)
{
    await storageAccount.DeleteAsync(WaitUntil.Completed);
}
```

## Configure ArmClient options

You can configure the `ArmClient` object to use a custom retry policy or set other options. The following code example shows how to configure the `ArmClient` object:

```csharp
// Provide configuration options for the ArmClient
ArmClientOptions armClientOptions = new()
{
    Retry = {
        Delay = TimeSpan.FromSeconds(2),
        MaxRetries = 5,
        Mode = RetryMode.Exponential,
        MaxDelay = TimeSpan.FromSeconds(10),
        NetworkTimeout = TimeSpan.FromSeconds(100)
    },
};

// Authenticate to Azure and create the top-level ArmClient
ArmClient armClient = new(new DefaultAzureCredential(), subscriptionId, armClientOptions);
```

## Resources

To learn more about resource management using the Azure management library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Storage resource provider REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The management library methods for managing storage account resources use REST API operations described in the following article:

- [Storage Accounts operation overview](/rest/api/storagerp/storage-accounts) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs)
