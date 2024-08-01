---
title: Manage storage account resources with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Learn how to manage storage account resources with the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 08/01/2024
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

The following example creates an `ArmClient` object authorized using `DefaultAzureCredential`, then gets the subscription resource for the specified subscription ID:

```csharp
ArmClient armClient = new ArmClient(new DefaultAzureCredential());

// Create a resource identifier, then get the subscription resource
ResourceIdentifier resourceIdentifier = new($"/subscriptions/{subscriptionId}");
SubscriptionResource subscription = armClient.GetSubscriptionResource(resourceIdentifier);
```

To learn about creating client object for a resource group or storage account resource, see [Create a client for managing storage account resources](storage-srp-dotnet-get-started.md#create-a-client-for-managing-storage-account-resources).

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

When creating a storage account resource, you can set the properties for the storage account by including a [StorageAccountCreateOrUpdateContent](/dotnet/api/azure.resourcemanager.storage.models.storageaccountcreateorupdatecontent) instance in the `content` parameter.

The following code example creates a storage account and configures properties for SKU, kind, location, access tier, and shared key access:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_CreateStorageAccount":::

## List storage accounts

You can list storage accounts in a subscription or a resource group. The following code example takes a [SubscriptionResource](/dotnet/api/azure.resourcemanager.resources.subscriptionresource) instance and lists storage accounts in the subscription:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_ListAccountsSubscription":::

The following code example takes a [ResourceGroupResource](/dotnet/api/azure.resourcemanager.resources.resourcegroupresource) instance and lists storage accounts in the resource group:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_ListAccountsResourceGroup":::

## Manage storage account keys

You can get storage account access keys using the following method:

- [GetKeysAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.getkeysasync)

This method returns an iterable collection of [StorageAccountKey](/dotnet/api/azure.resourcemanager.storage.models.storageaccountkey) instances.

The following code example gets the keys for a storage account and writes the names and values to the console for example purposes:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_GetAccountKeys":::

You can regenerate a storage account access key using the following method:

- [RegenerateKeyAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.regeneratekeyasync)

This method regenerates a storage account key and returns the new key value as part of an iterable collection of [StorageAccountKey](/dotnet/api/azure.resourcemanager.storage.models.storageaccountkey) instances.

The following code example regenerates a storage account key:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_RegenerateAccountKey":::

## Update the storage account SKU

You can update existing storage account settings by passing updated parameters to one of the following methods:

- [StorageAccountCollection.CreateOrUpdateAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection.createorupdateasync) (updated parameters passed as a [StorageAccountCreateOrUpdateContent](/dotnet/api/azure.resourcemanager.storage.models.storageaccountcreateorupdatecontent) instance)
- [StorageAccountResource.UpdateAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.updateasync) (updated parameters passed as a [StorageAccountPatch](/dotnet/api/azure.resourcemanager.storage.models.storageaccountpatch) instance)

The following code example updates the storage account SKU from `Standard_LRS` to `Standard_GRS`:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_UpdateAccountSKU":::

## Delete a storage account

You can delete a storage account using the following method:

- [DeleteAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountresource.deleteasync)

The following code example shows how to delete a storage account:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_DeleteStorageAccount":::

## Configure ArmClient options

You can pass an [ArmClientOptions](/dotnet/api/azure.resourcemanager.armclientoptions) instance when creating an `ArmClient` object. This class allows you to configure values for diagnostics, environment, transport, and retry options for a client object. 

The following code example shows how to configure the `ArmClient` object to change the default retry policy:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/Program.cs" id="Snippet_CreateArmClient":::

## Resources

To learn more about resource management using the Azure management library for .NET, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/storage-mgmt-devguide-dotnet/blob/main/StorageAccountManagement/ManagementTasks.cs)

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Storage resource provider REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The management library methods for managing storage account resources use REST API operations described in the following article:

- [Storage Accounts operation overview](/rest/api/storagerp/storage-accounts) (REST API)
