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

When creating a client object in your application, you can construct the URI string manually, or you can query for the account endpoint at runtime. In this article, you learn how to query storage account endpoints using the management library.

## Code

```console
dotnet add package Azure.ResourceManager.Storage
```

```console
dotnet add package Azure.Identity
```

```console
dotnet add package Azure.Storage.Blobs
```



