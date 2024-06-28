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

You can create a storage account using the following method:

- [CreateOrUpdateAsync]()

## List storage accounts

You can list storage accounts in a subscription or a resource group. The following code example lists storage accounts in a subscription:

```csharp
```

The following code example lists storage accounts in a resource group:

```csharp
```

## Manage storage account keys

## Update the storage account SKU

## Delete a storage account

## Configure ArmClient options



## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Storage resource provider REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The management library methods for managing storage account resources use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs)
