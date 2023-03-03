---
title: Query a storage account endpoint using the Azure Storage management library
titleSuffix: Azure Storage
description: Query a storage account endpoint using the Azure Storage management library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/02/2023
ms.subservice: blobs
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Query a storage account endpoint using the Azure Storage management library

A storage service endpoint forms the base address for all objects within a storage account. When an application connects to a storage service to work with data resources, a URI representing the endpoint is passed to the client constructor. A [standard endpoint](../common/storage-account-overview.md#standard-endpoints) includes the unique storage account name along with a fixed domain name, while an [Azure DNS zone endpoint](../common/storage-account-overview.md#azure-dns-zone-endpoints-preview) dynamically selects an Azure DNS zone and assigns it to the storage account when it's created. 

When creating a client object in your application, you can construct the URI string manually, or you can query for the service endpoint at runtime. In this article, you learn how to query a blob service endpoint using the management library.

## Set up your project 

To work with the code examples in this article, follow these steps to set up your project.

### Install packages

Install the following packages using `dotnet add package`:

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
dotnet add package Azure.Storage.Blobs
```
- [Azure.Identity](/dotnet/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [Azure.ResourceManager.Storage](/dotnet/api/overview/azure/resourcemanager.storage-readme): Supports management of Azure Storage resources, including resource groups and storage accounts.
- [Azure.Storage.Blobs](/dotnet/api/overview/azure/storage.blobs-readme): Contains the primary classes that you can use to work with Blob Storage data resources.

## Query for the service endpoint

In this example, we retrieve a blob service endpoint for a specified storage account using the Azure Storage management library. The endpoint string can be constructed manually using the storage account name and service domain, but there are scenarios where querying for the endpoint is a better option. 

The following code sample

## Create a client object using the service endpoint

## Next steps





