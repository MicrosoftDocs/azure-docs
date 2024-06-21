---
title: Get started with the Azure Storage management library for .NET
titleSuffix: Azure Storage
description: Get started developing a .NET application to manage a storage account by using the Azure Storage management library for .NET.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/12/2024
ms.devlang: csharp
ms.custom: template-how-to, devguide-csharp, devx-track-dotnet
---

# Get started with Azure Storage management library for .NET

This article shows you how to manage storage account resources by using the Azure Storage management library for .NET.

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

To connect an application and manage storage account resources, create an [ArmClient](/dotnet/api/azure.resourcemanager.armclient) object. This client object is the entry point for all ARM clients. Since all management APIs go through the same endpoint, you only need to create one top-level `ArmClient` to interact with resources. You can use it to operate on storage account resources.

You can authorize an `ArmClient` object by using a Microsoft Entra authorization token. In the code example in this article, we use `DefaultAzureCredential` to authorize the client object. The `DefaultAzureCredential` class provides a default `TokenCredential` authentication flow for applications that will be deployed to Azure. To learn more, see [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential).

#### Authorize access using DefaultAzureCredential

To authorize with Microsoft Entra ID, you need to use a security principal. The type of security principal you need depends on where your application runs. Use the following table as a guide:

| Where the application runs | Security principal | Guidance |
| --- | --- | --- |
| Local machine (developing and testing) | Service principal | To learn how to register the app, set up a Microsoft Entra group, assign roles, and configure environment variables, see [Authorize access using developer service principals](/dotnet/azure/sdk/authentication-local-development-service-principal?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) | 
| Local machine (developing and testing) | User identity | To learn how to set up a Microsoft Entra group, assign roles, and sign in to Azure, see [Authorize access using developer credentials](/dotnet/azure/sdk/authentication-local-development-dev-accounts?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted in Azure | Managed identity | To learn how to enable managed identity and assign roles, see [Authorize access from Azure-hosted apps using a managed identity](/dotnet/azure/sdk/authentication-azure-hosted-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |
| Hosted outside of Azure (for example, on-premises apps) | Service principal | To learn how to register the app, assign roles, and configure environment variables, see [Authorize access from on-premises apps using an application service principal](/dotnet/azure/sdk/authentication-on-premises-apps?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json) |

An easy and secure way to authorize access and connect to Blob Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create an [ArmClient](/dotnet/api/azure.resourcemanager.armclient) object.

The following example creates an `ArmClient` object authorized using `DefaultAzureCredential`:

```csharp
ArmClient armClient = new ArmClient(new DefaultAzureCredential());
```

If you know exactly which credential type you'll use to authenticate users, you can obtain an OAuth token by using other classes in the [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These classes derive from the [TokenCredential](/dotnet/api/azure.core.tokencredential) class.

To learn more about authorizing management operations, see [Assign management permissions with Azure RBAC](authorization-resource-provider.md#assign-management-permissions-with-azure-role-based-access-control-azure-rbac).

## Build your application

As you build applications to manage resources in Azure Storage, your code primarily interacts with three resource types: storage accounts, containers, and blobs. To learn more about these resource types, how they relate to one another, and how apps interact with resources, see [Understand how apps interact with Blob Storage data resources](storage-blob-object-model.md).

The following guides show you how to manage resources and perform specific actions using the Azure Storage management library for .NET:

| Guide | Description |
| --- | --- |
| [Create a storage account](storage-srp-account-create.md) | Create a storage account. |
