---
title: Overview of the Azure Storage client libraries
titleSuffix: Azure Storage
description: Overview of the Azure Storage client libraries. Learn about the management and data plane libraries, and when to use each set of libraries as you build your application.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: overview
ms.date: 08/01/2024
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python, devguide-go
---

# Overview of the Azure Storage client libraries

The Azure SDKs are collections of libraries built to make it easier to use Azure services from different languages. The SDKs are designed to simplify interactions between your application and Azure resources. As your code interacts with Azure Storage resources, you can use client libraries to manage resources and work with data.

The Azure SDK provides two sets of libraries for working with Azure Storage resources. One set of libraries builds on the Azure Storage REST API, and is designed to handle data access operations for blobs, queues, and files. These libraries are sometimes referred to as the data plane. Another set of libraries builds on top of the Azure Storage resource provider REST API, and is designed to handle resource management operations. These libraries are sometimes referred to as the management plane.

In this article, you learn about the management and data plane libraries, and when to use each set of libraries as you build your application.

> [!IMPORTANT]
> This article covers the latest Azure Storage client libraries. These libraries are updated regularly to drive consistent experiences and strengthen your security posture. Older libraries no longer receive official support or updates from Microsoft. It's recommended that you transition to the new Azure SDK libraries to take advantage of the new capabilities and critical security updates.

## Libraries for data access

Data plane libraries build on the Azure Storage REST API, allowing you to interact with blob, file, and queue data. These client libraries provide a set of classes that represent the resources you interact with, such as blob containers and blobs. These classes provide operations to work with Azure Storage resources. For example, you can use the Blob Storage client libraries to upload and download blobs, list containers, and delete blobs.

## [.NET](#tab/dotnet)

The following table shows the Azure Storage client libraries for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **Azure.Storage.Blobs** | [Reference](/dotnet/api/azure.storage.blobs) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Blobs/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Blobs) |
| **Azure.Storage.Blobs.Batch** | [Reference](/dotnet/api/azure.storage.blobs.batch) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Blobs.Batch/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Blobs.Batch) |
| **Azure.Storage.Common** | [Reference](/dotnet/api/azure.storage) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Common/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Common) |
| **Azure.Storage.Files.DataLake** | [Reference](/dotnet/api/azure.storage.files.datalake) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Files.DataLake) |
| **Azure.Storage.Files.Shares** | [Reference](/dotnet/api/azure.storage.files.shares) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Files.Shares/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Files.Shares) |
| **Azure.Storage.Queues** | [Reference](/dotnet/api/azure.storage.queues) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Queues/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Queues) |

To learn more about using the Blob Storage client library for specific data access scenarios, see the [Blob Storage developer guide for .NET](../blobs/storage-blob-dotnet-get-started.md).

## [Java](#tab/java)

The following table shows the Azure Storage client libraries for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-storage-blob** | [Reference](/java/api/overview/azure/storage-blob-readme) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-storage-blob) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage/azure-storage-blob) |
| **azure-storage-file-datalake** | [Reference](/java/api/overview/azure/storage-file-datalake-readme) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-storage-file-datalake) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage/azure-storage-file-datalake) |
| **azure-storage-file-share** | [Reference](/java/api/overview/azure/storage-file-share-readme) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-storage-file-share) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage/azure-storage-file-share) |
| **azure-storage-queue** | [Reference](/java/api/overview/azure/storage-queue-readme) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-storage-queue) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage/azure-storage-queue) |

To learn more about using the Blob Storage client library for specific data access scenarios, see the [Blob Storage developer guide for Java](../blobs/storage-blob-java-get-started.md).

## [JavaScript](#tab/javascript)

The following table shows the Azure Storage client libraries for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **@azure/storage-blob** | [Reference](/javascript/api/@azure/storage-blob) | [npm](https://www.npmjs.com/package/@azure/storage-blob) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) |
| **@azure/storage-file-datalake** | [Reference](/javascript/api/@azure/storage-file-datalake) | [npm](https://www.npmjs.com/package/@azure/storage-file-datalake) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-datalake) |
| **@azure/storage-file-share** | [Reference](/javascript/api/@azure/storage-file-share) | [npm](https://www.npmjs.com/package/@azure/storage-file-share) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-share) |
| **@azure/storage-queue** | [Reference](/javascript/api/@azure/storage-queue) | [npm](https://www.npmjs.com/package/@azure/storage-queue) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-queue) |

To learn more about using the Blob Storage client library for specific data access scenarios, see the [Blob Storage developer guide for JavaScript](../blobs/storage-blob-javascript-get-started.md).

## [Python](#tab/python)

The following table shows the Azure Storage client libraries for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-storage-blob** | [Reference](/python/api/overview/azure/storage-blob-readme) | [PyPi](https://pypi.org/project/azure-storage-blob/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-blob) |
| **azure-storage-file-datalake** (Preview) | [Reference](/python/api/overview/azure/storage-file-datalake-readme) | [PyPi](https://pypi.org/project/azure-storage-file-datalake/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-file-datalake/azure/storage/filedatalake) |
| **azure-storage-file-share** | [Reference](/python/api/overview/azure/storage-file-share-readme) | [PyPi](https://pypi.org/project/azure-storage-file-share/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-file-share/azure/storage/fileshare) |
| **azure-storage-queue** | [Reference](/python/api/overview/azure/storage-queue-readme) | [PyPi](https://pypi.org/project/azure-storage-queue/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-queue/azure/storage/queue) |

To learn more about using the Blob Storage client library for specific data access scenarios, see the [Blob Storage developer guide for Python](../blobs/storage-blob-python-get-started.md).

## [Go](#tab/go)

The following table shows the Azure Storage client libraries for data access:

| Module | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azblob** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob) |
| **azdatalake** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azdatalake#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azdatalake) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azdatalake) |
| **azfile** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azfile#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azfile) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azfile) |
| **azqueue** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azqueue) |

To learn more about using the Blob Storage client library for specific data access scenarios, see the [Blob Storage developer guide for Go](../blobs/storage-blob-go-get-started.md).

---

In most cases, you should use the data plane libraries to work with Azure Storage resources. However, for resource management operations, such as creating or deleting storage accounts, managing account keys, or configuring failover scenarios, you need to use the [management plane libraries](#libraries-for-resource-management).

## Libraries for resource management

Management plane libraries build on top of the Azure Storage resource provider REST API, allowing you to manage Azure Storage resources. The Azure Storage resource provider is a service that is based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview) and provides access to management resources for Azure Storage. You can use the management plane libraries to create, update, manage, and delete resources such as storage accounts, private endpoints, and account access keys.

## [.NET](#tab/dotnet)

The following table shows the Azure Storage client library for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **Azure.ResourceManager.Storage** | [Reference](/dotnet/api/azure.resourcemanager.storage) | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Storage/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.ResourceManager.Storage) |

To learn more about using the Azure Storage management library for specific resource management scenarios, see the [Azure Storage management library developer guide for .NET](../blobs/storage-blob-dotnet-get-started.md).

## [Java](#tab/java)

The following table shows the Azure Storage client libraries for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-resourcemanager-storage** | [Reference](/java/api/overview/azure/resourcemanager-storage-readme) | [Maven](https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-storage) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/resourcemanager/azure-resourcemanager-storage) |

## [JavaScript](#tab/javascript)

The following table shows the Azure Storage client libraries for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **@azure/arm-storage** | [Reference](/javascript/api/overview/azure/arm-storage-readme) | [NPM](https://www.npmjs.com/package/@azure/arm-storage) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/arm-storage) |

## [Python](#tab/python)

The following table shows the Azure Storage client libraries for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-mgmt-storage** | [Reference](/python/api/overview/azure/mgmt-storage-readme) | [PyPi](https://pypi.org/project/azure-mgmt-storage/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-mgmt-storage) |

## [Go](#tab/go)

The following table shows the Azure Storage client libraries for resource management:

| Module | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **resourcemanager/storage/armstorage** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/storage/armstorage) |

---

## Next steps

- To learn more about using the Blob Storage client library for specific data access scenarios, see the following data plane developer guide resources:
    - [.NET](../blobs/storage-blob-dotnet-get-started.md)
    - [Java](../blobs/storage-blob-java-get-started.md)
    - [JavaScript](../blobs/storage-blob-javascript-get-started.md)
    - [TypeScript](../blobs/storage-blob-typescript-get-started.md)
    - [Python](../blobs/storage-blob-python-get-started.md)
    - [Go](../blobs/storage-blob-go-get-started.md)
- To learn more about using the Azure Storage management library for specific resource management scenarios, see [Get started with Azure Storage management library for .NET](storage-srp-dotnet-get-started.md).