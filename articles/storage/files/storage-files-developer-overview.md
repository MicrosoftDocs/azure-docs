---
title: Overview of application development with Azure Files
titleSuffix: Azure Storage
description: Learn how to develop applications and services that use Azure Files to store data.
author: pauljewellmsft
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: pauljewell
---

# Overview of application development with Azure Files

This article provides an overview of application development with Azure Files and helps you decide which approach is best based on the needs of your app.

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## About app development with Azure Files

Azure Files offers several ways for developers to access data and manage resources in Azure file shares. The following table lists the approaches, summarizes how they work, and provides guidance on when to use each approach:

| Approach | How it works | When to use |
| --- | --- | --- |
| [Standard file I/O libraries](#standard-file-io-libraries) | Uses OS-level API calls through Azure file shares mounted using the industry standard Server Message Block (SMB) and Network File System (NFS) protocols. When you mount a file share using SMB/NFS, you can use file I/O libraries for a programming language or framework, such as `System.IO` for .NET, `os` and `io` for Python, `java.io` and `java.nio` for Java, or `fs` for JavaScript (Node.js). | You have line-of-business apps with existing code that uses standard file I/O, and you don't want to rewrite code for the app to work with an Azure file share. |
| [FileREST API](#filerest-api)| Directly calls HTTPS endpoints to interact with data stored in Azure Files. Provides programmatic control over file share resources. The Azure SDK provides client libraries that build on the FileREST API, allowing you interact with FileREST API operations through familiar programming language paradigms. | You're building value-added cloud services and apps for customers and you want to use advanced features not available through native protocols. |
| [Storage resource provider REST API](#storage-resource-provider-rest-api) | Uses Azure Resource Manager (ARM) to manage storage accounts and file shares. Calls REST API endpoints for various resource management operations. | Your app or service needs to perform resource management tasks, such as creating, deleting, or updating storage accounts or file shares. |

### Standard file I/O libraries

File I/O libraries are the most common way to access and work with Azure Files resources. When you mount a file share using SMB or NFS, your operating system redirects API requests for the local file system. This approach allows you to use standard file I/O libraries for your preferred programming language or framework, such as `System.IO` for .NET, `os` and `io` for Python, `java.io` and `java.nio` for Java, or `fs` for JavaScript (Node.js).

Consider using file I/O libraries when your app requires:

- **App compatibility:** Ideal for line-of-business apps with existing code that already uses standard file I/O. You don't need to rewrite code for the app to work with an Azure file share.
- **Ease of use:** Standard file I/O libraries are well known by developers and easy to use. A key value proposition of Azure Files is that it exposes native file system APIs through SMB and NFS.

Other considerations:

- **Network access:** SMB communicates over port 445, and NFS communicates over port 2049. Ensure that these ports aren't blocked from the client machine. For more information, see [Networking considerations for Azure Files](storage-files-networking-overview.md).

### FileREST API

The FileREST API provides programmatic access to Azure Files. It allows you to call HTTPS endpoints to perform operations on file shares, directories, and files. The FileREST API is designed for high scalability and advanced features that might not be available through native protocols. The Azure SDK provides client libraries that build on the FileREST API.

Consider using the FileREST API and File Share client libraries if your application requires:

- **Advanced features:** Access operations and features that aren't available through native protocols.
- **Custom cloud integrations:** Build custom value-added services, such as backup, antivirus, or data management, that interact directly with Azure Files.
- **Performance optimization:** Benefit from performance advantages in high-scale scenarios using data plane operations.

The FileREST API models Azure Files as a hierarchy of resources, and is recommended for operations that are performed at the *directory* or *file* level. To learn more about the language-specific client libraries that build on the FileREST API, see the [Libraries for data access](#libraries-for-data-access).

### Storage resource provider REST API

The Azure Storage resource provider is a service that is based on [Azure Resource Manager](/azure/azure-resource-manager/management/overview), and supports both declarative (templates) and imperative (direct API call) methods. The Azure Storage resource provider REST API provides programmatic access to Azure Storage resources, including file shares. The Azure SDK provides management libraries that build on the Azure Storage resource provider REST API.

The Storage resource provider is recommended for operations that are performed at the *file service* or *file share* level. To learn more about the language-specific management libraries that build on the Azure Storage resource provider REST API, see the [Libraries for resource management](#libraries-for-resource-management).

## Azure SDK libraries for Azure Files

The Azure SDK provides two sets of libraries for working with Azure Files resources. One set of libraries builds on the FileREST API, and is designed to handle data access operations at the *directory* or *file* level. These libraries are sometimes referred to as the [data plane](#libraries-for-data-access). Another set of libraries builds on top of the Azure Storage resource provider REST API, and is designed to handle resource management operations at the *file service* or *file share* level. These libraries are sometimes referred to as the [control plane](#libraries-for-resource-management) (or management plane).
  
### Libraries for data access

Data plane libraries are designed to handle data access operations at the *directory* or *file* level. The following sections show the File Shares client library for .NET, Java, Python, JavaScript, and Go.

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

Resource management libraries are designed to handle resource management operations at the *file service* or *file share* level. To learn more about the operations, see [File Services](/rest/api/storagerp/file-services) or [File Shares](/rest/api/storagerp/file-shares). The following sections show the Azure Storage management libraries for .NET, Java, Python, JavaScript, and Go.

## [.NET](#tab/dotnet)

The following table shows the Azure Storage client library for resource management:

| Library | Reference | Package | Source |
| ------- | --------- | ------- | ------ |
| **Azure.ResourceManager.Storage** | [Reference](/dotnet/api/azure.resourcemanager.storage) | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Storage/) | [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/storage/Azure.ResourceManager.Storage) |

To learn more about using the Azure Storage management library for specific resource management scenarios, see the [Azure Storage management library developer guide for .NET](../common/storage-srp-dotnet-get-started.md).

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