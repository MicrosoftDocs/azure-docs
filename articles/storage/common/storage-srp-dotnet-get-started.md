---
title: Get started with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Get started developing a .NET application to manage a storage account by using the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/01/2024
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Get started with the Azure Storage management library for .NET

This article shows you how to connect to Azure Storage resources using the Azure Storage management library for .NET. Once connected, you can create, update, and delete storage accounts, and manage storage account settings. To learn about the differences between resource management and data access using Azure Storage client libraries, see [Overview of the Azure Storage client libraries](storage-srp-overview.md).

[API reference](/dotnet/api/azure.resourcemanager.storage) | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Storage/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.ResourceManager.Storage) | [Give feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Latest [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system. Be sure to get the SDK and not the runtime.

## Set up your project

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

Management library information:

- [Azure.ResourceManager.Storage](/dotnet/api/azure.resourcemanager.storage): Contains the primary classes representing the collections, resources, and data for managing storage accounts.

## Authorize access and create a client

To connect an application and manage storage account resources, create an [ArmClient](/dotnet/api/azure.resourcemanager.armclient) object. This client object is the entry point for all Azure Resource Manager (ARM) clients. Since all management APIs go through the same endpoint, you only need to create one top-level `ArmClient` to interact with resources.

#### Assign management permissions with Azure RBAC

Azure provides built-in roles that grant permissions to call management operations. Azure Storage also provides built-in roles specifically for use with the Azure Storage resource provider. To learn more, see [Built-in roles for management operations](authorization-resource-provider.md).

#### Authorize access using DefaultAzureCredential

You can authorize an `ArmClient` object by using a Microsoft Entra authorization token. In the code example in this article, we use `DefaultAzureCredential` to authorize the client object. The `DefaultAzureCredential` class provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure. To learn more, see [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential).

To authorize with Microsoft Entra ID, you need to use a security principal. The type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

An easy and secure way to authorize access and connect to storage account resources is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create an [ArmClient](/dotnet/api/azure.resourcemanager.armclient) object.

The following example creates an `ArmClient` object authorized using `DefaultAzureCredential`, then gets the subscription resource for the specified subscription ID:

```csharp
ArmClient armClient = new ArmClient(new DefaultAzureCredential());

// Create a resource identifier, then get the subscription resource
ResourceIdentifier resourceIdentifier = new($"/subscriptions/{subscriptionId}");
SubscriptionResource subscription = armClient.GetSubscriptionResource(resourceIdentifier);
```

If you know exactly which credential type you use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

To learn more about authorizing management operations, see [Assign management permissions with Azure RBAC](authorization-resource-provider.md#assign-management-permissions-with-azure-role-based-access-control-azure-rbac).

## Register the Storage resource provider with a subscription

A resource provider must be registered with your Azure subscription before you can work with it. This step only needs to be done once per subscription, and only applies if the resource provider **Microsoft.Storage** isn't currently registered with your subscription.

You can register the Storage resource provider, or check the registration status, using [Azure portal](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal), [Azure CLI](/azure/azure-resource-manager/management/resource-providers-and-types#azure-cli), or [Azure PowerShell](/azure/azure-resource-manager/management/resource-providers-and-types#azure-powershell).

You can also use the Azure management libraries to check the registration status and register the Storage resource provider, as shown in the following example:

:::code language="csharp" source="~/storage-mgmt-devguide-dotnet/StorageAccountManagement/ManagementTasks.cs" id="Snippet_RegisterSRP":::

> [!NOTE]
> To perform the register operation, you need permissions for the following Azure RBAC action: **Microsoft.Storage/register/action**. This permission is included in the **Contributor** and **Owner** built-in roles.

## Create a client for managing storage account resources

After creating an `ArmClient` object and registering the Storage resource provider, you can create client objects at the resource group and storage account levels. The following code example shows how to create client objects for a given resource group and storage account:

```csharp
// Get a resource group
ResourceGroupResource resourceGroup = await subscription.GetResourceGroupAsync(rgName);

// Get a collection of storage account resources
StorageAccountCollection accountCollection = resourceGroup.GetStorageAccounts();

// Get a specific storage account resource
StorageAccountResource storageAccount = await accountCollection.GetAsync(storageAccountName);
```

## Understand client resource hierarchy

To reduce both the number of clients needed to perform common tasks, and the number of redundant parameters that each of those clients take, the management SDK provides an object hierarchy that reflects the object hierarchy in Azure. Each resource client in the SDK has methods to access the resource clients of its children that are already scoped to the proper subscription and resource group.

There are three standard levels of hierarchy for each resource type. For storage account resources, the hierarchy is as follows:

- [StorageAccountCollection](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection): Represents the operations you can perform on a collection of storage accounts belonging to a specific parent resource, such as a resource group.
- [StorageAccountResource](/dotnet/api/azure.resourcemanager.storage.storageaccountresource): Represents a full storage account client object and contains a **Data** property exposing the details as a `StorageAccountData` type. A class instance has access to all operations on that resource without needing to pass in scope parameters such as subscription ID or resource name.
- [StorageAccountData](/dotnet/api/azure.resourcemanager.storage.storageaccountdata): Represents the model that makes up a given resource. Typically, this class is the response data from a service call and provides details about the resource.

## Build your application

The following guide shows you how to manage resources and perform specific actions using the Azure Storage management library for .NET:

| Guide | Description |
| --- | --- |
| [Manage a storage account](storage-srp-manage-account-dotnet.md) | Learn how to create and manage a storage account, manage storage account keys, and configure client options to create a custom retry policy. |
