---
title: Manage storage account resources with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Learn how to manage storage account resources with the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 07/18/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Manage storage account resources with .NET

This article shows you how to manage storage account resources by using the Azure Storage management library for .NET. You can create and update storage accounts, list storage accounts in a subscription or resource group, manage storage account keys, and delete storage accounts. You can also configure client options to use a custom retry policy or set other options.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your environment

If you don't have an existing project, this section walks you through preparing a project to work with the Azure Storage management library for .NET. To learn more about project setup, see [Get started with Azure Storage management library for .NET](storage-srp-dotnet-get-started.md).

#### Install packages

From your project directory, install packages for the Azure Storage Resource Manager and Azure Identity client libraries using the `dotnet add package` command. The Azure.Identity package is needed for passwordless connections to Azure services.

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
```

#### Add using directives

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

To learn about creating client object for a storage account resource, see [Create a client for managing storage account resources](storage-srp-dotnet-get-started.md#create-a-client-for-managing-storage-account-resources).

#### Authorization

Azure provides built-in roles that grant permissions to call management operations. Azure Storage also provides built-in roles specifically for use with the Azure Storage resource provider. To learn more, see [Built-in roles for management operations](authorization-resource-provider.md).

## Create a storage account

You can asynchronously create a storage account with specified parameters. If a storage account already exists and a subsequent create request is issued with the same parameters, the request succeeds. If the parameters are different, the storage account properties are updated. For an example of updating an existing storage account, see [Update the storage account SKU](#update-the-storage-account-sku).

Each storage account name must be unique within Azure. To check for the availability of a storage account name, you can use the following method:

- [CheckStorageAccountNameAvailability](/dotnet/api/azure.resourcemanager.storage.storageextensions.checkstorageaccountnameavailability)

The following code example shows how to check the availability of a storage account name:

```csharp
// Check if the account name is available
bool? nameAvailable = subscription
    .CheckStorageAccountNameAvailability(new StorageAccountNameAvailabilityContent(storageAccountName)).Value.IsNameAvailable;
```

You can create a storage account using the following method from the [StorageAccountCollection](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection) class:

- [CreateOrUpdateAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection.createorupdateasync)

When creating a storage account resource, you can set the properties for the storage account by including a[StorageAccountCreateOrUpdateContent]() instance in the `content` parameter.

The following code example creates a storage account and configures properties for SKU, kind, location, access tier, and shared key access:

```csharp
public static async Task<StorageAccountResource> CreateStorageAccount(
    ResourceGroupResource resourceGroup,
    string storageAccountName)
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

    // Create a storage account with defined account name and settings
    StorageAccountCollection accountCollection = resourceGroup.GetStorageAccounts();
    ArmOperation<StorageAccountResource> acccountCreateOperation = 
        await accountCollection.CreateOrUpdateAsync(WaitUntil.Completed, storageAccountName, parameters);
    StorageAccountResource storageAccount = acccountCreateOperation.Value;

    return storageAccount;
}
```

## List storage accounts

You can list storage accounts in a subscription or a resource group. The following code example takes a [SubscriptionResource](/dotnet/api/azure.resourcemanager.resources.subscriptionresource) instance and lists storage accounts in the subscription:

```csharp
public static async Task ListStorageAccountsForSubscription(SubscriptionResource subscription)
{
    await foreach (StorageAccountResource storageAccount in subscription.GetStorageAccountsAsync())
    {
        Console.WriteLine($"\t{storageAccount.Id.Name}");
    }
}
```

The following code example takes a [ResourceGroupResource]() instance and lists storage accounts in the resource group:

```csharp
public static async Task ListStorageAccountsInResourceGroup(ResourceGroupResource resourceGroup)
{
    await foreach (StorageAccountResource storageAccount in resourceGroup.GetStorageAccounts())
    {
        Console.WriteLine($"\t{storageAccount.Id.Name}");
    }
}
```

## Manage storage account keys

You can get storage account keys using the following method:

- [GetKeysAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.getkeysasync): Returns an iterable collection of [StorageAccountKey](/dotnet/api/azure.resourcemanager.storage.models.storageaccountkey) instances.

The following code example gets the keys for a storage account and writes the names and values to the console for example purposes:

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

- [RegenerateKeyAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.regeneratekeyasync): Regenerates a storage account key and returns the new key value.

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

- [CreateOrUpdateAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection.createorupdateasync)

The following code example updates the storage account SKU from `Standard_LRS` to `Standard_GRS`:

```csharp
public static async Task UpdateStorageAccountSkuAsync(
    StorageAccountResource storageAccount,
    StorageAccountCollection accountCollection)
{
    // Update storage account SKU
    var currentSku = storageAccount.Data.Sku.Name;  // capture the current SKU value before updating
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

- [DeleteAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.deleteasync)

The following code example shows how to delete a storage account:

```csharp
public static async Task DeleteStorageAccountAsync(StorageAccountResource storageAccount)
{
    await storageAccount.DeleteAsync(WaitUntil.Completed);
}
```

## Configure ArmClient options

You can pass an [ArmClientOptions](/dotnet/api/azure.resourcemanager.armclientoptions) instance when creating an `ArmClient` object. This class allows you to configure values for diagnostics, environment, transport, and retry options for a client object. 

The following code example shows how to configure the `ArmClient` object to change the default retry policy:

```csharp
// Provide configuration options for ArmClient
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
