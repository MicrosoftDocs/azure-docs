---
title: Overview of application development with Azure Files
titleSuffix: Azure Storage
description: Learn how to develop applications and services that use Azure Files to store data.
author: pauljewellmsft
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 02/13/2025
ms.author: pauljewell
---

# Overview of application development with Azure Files

This article provides an overview of application development with Azure Files and helps you decide which approach is best based on the needs of your app.

## Approaches for accessing and working with Azure Files

Azure Files offers several approaches for developers to access data and manage resources in Azure file shares:

- **File system I/O libraries**: Mount a file share using SMB/NFS and leverage file system I/O libraries for a programming language or framework, such as .NET's `System.IO` namespace, or Python's `os` module.
- **FileREST API**: Call endpoints for various data access operations on file share resources. The Azure SDK provides libraries that build on the FileREST API, allowing you interact with FileREST API operations through familiar programming language paradigms. These libraries are sometimes referred to as the data plane.
- **Storage resource provider REST API**: Call endpoints for various resource management operations on a storage account or file share. These operations are sometimes referred to as the control plane (or management plane).

The following table summarizes the different approaches for accessing Azure Files, and gives an example use case:

| Approach | Description | Example use case |
| --- | --- | --- |
| [File system I/O libraries](#file-system-io-libraries) | Uses OS-level API calls through Azure file shares mounted using SMB or NFS. | You have line-of-business apps with existing code that uses standard file I/O. |
| [FileREST API](#filerest-api)| Directly calls HTTPS endpoints to interact with Azure Files. Provides programmatic control over file shares. | You're building value-added cloud services and apps for customers, or your app requires access across many file shares. |
| [Storage resource provider REST API](#storage-resource-provider-control-plane) | Uses Azure Resource Manager (ARM) to manage storage accounts and file shares. | You need to create, delete, or update storage accounts or file shares. |

### FileREST API (data plane)

The FileREST API is a REST API that provides programmatic access to Azure Files. It allows you to call HTTPS endpoints to perform operations on file shares, directories, and files. The API is designed for high scalability and advanced features that may not be available through native protocols.

Consider using the FileREST API if your application requires:

- **Advanced features:** Access operations and features that are not available through native protocols.
- **High scalability:** Manage large-scale operations such as creating or updating thousands of file shares.
- **Custom cloud integrations:** Build custom value-added services (e.g., backup, antivirus, or data management) that interact directly with Azure Files.
- **Performance optimization:** Benefit from performance advantages in high-scale scenarios using data plane operations.

### Storage resource provider (control plane)


## Azure SDK libraries for Azure Files

The Azure SDK provides two set of libraries for working with Azure Files resources. One set of libraries builds on the FileREST API, and is designed to handle data access operations at the *directory* or *file* level. These libraries are sometimes referred to as the [data plane](#libraries-for-data-access). Another set of libraries builds on top of the Azure Storage resource provider REST API, and is designed to handle resource management operations at the *file service* or *file share* level. These libraries are sometimes referred to as the [control plane](#libraries-for-resource-management) (or management plane).
  
### Libraries for data access

Data plane libraries are designed to handle data access operations at the *directory* or *file* level. The following section shows the File Shares client library for .NET, Java, Python, JavaScript, and Go.

### [.NET](#tab/dotnet)

The following table shows the File Shares client library for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **Azure.Storage.Files.Shares** | [Reference](/dotnet/api/azure.storage.files.shares) | [NuGet](https://www.nuget.org/packages/Azure.Storage.Files.Shares/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.Storage.Files.Shares) |

To learn more about using the File Shares client library for specific data access scenarios, see the [Develop for Azure Files with .NET](storage-dotnet-how-to-use-files.md).

### [Java](#tab/java)

The following table shows the File Shares client library for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-storage-file-share** | [Reference](/java/api/overview/azure/storage-file-share-readme) | [Maven](https://mvnrepository.com/artifact/com.azure/azure-storage-file-share) | [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/storage/azure-storage-file-share) |

To learn more about using the File Shares client library for specific data access scenarios, see the [Develop for Azure Files with Java](storage-java-how-to-use-file-storage.md).

### [JavaScript](#tab/javascript)

The following table shows the File Shares client library for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **@azure/storage-file-share** | [Reference](/javascript/api/@azure/storage-file-share) | [npm](https://www.npmjs.com/package/@azure/storage-file-share) | [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-file-share) |

### [Python](#tab/python)

The following table shows the File Shares client library for data access:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azure-storage-file-share** | [Reference](/python/api/overview/azure/storage-file-share-readme) | [PyPi](https://pypi.org/project/azure-storage-file-share/) | [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-file-share/azure/storage/fileshare) |

To learn more about using the File Shares client library for specific data access scenarios, see the [Develop for Azure Files with Python](storage-python-how-to-use-file-storage.md).

### [Go](#tab/go)

The following table shows the File Shares client library for data access:

| Module | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **azfile** | [Reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azfile#section_documentation) | [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azfile) | [GitHub](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azfile) |

---

### Libraries for resource management

Control plane libraries build on top of the Azure Storage resource provider REST API, allowing you to manage Azure Storage resources. The Azure Storage resource provider is a service that is based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview), and supports both declarative (templates) and imperative (direct API call) methods.

Resource management libraries are designed to handle resource management operations at the *file service* or *file share* level. The following section shows the Azure Storage management libraries for .NET, Java, Python, JavaScript, and Go.

## [.NET](#tab/dotnet)

The following table shows the Azure Storage client library for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **Azure.ResourceManager.Storage** | [Reference](/dotnet/api/azure.resourcemanager.storage) | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Storage/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.ResourceManager.Storage) |

To learn more about using the Azure Storage management library for specific resource management scenarios, see the [Azure Storage management library developer guide for .NET](storage-srp-dotnet-get-started.md).

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

## Related content

- Develop for Azure Files with [.NET](storage-dotnet-how-to-use-files.md), [Java](storage-java-how-to-use-file-storage.md), or [Python](storage-python-how-to-use-file-storage.md)
- Mount SMB file share on [Windows](storage-how-to-use-files-windows.md) or [Linux](storage-how-to-use-files-linux.md)
- [Mount NFS file share on Linux](storage-files-how-to-mount-nfs-shares.md)