---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Get started with Azure Stack Storage development tools 
description: Guidance to get started with Azure Stack Storage using development tools.
services: azure-stack 
author: xiaofmao
ms.author: xiaofmao
ms.date: 06/23/2017
ms.topic: get-started-article
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
ms.service: azure-stack

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

# Get started with Azure Stack Storage development tools 

Microsoft Azure Stack provides a set of the storage services including Blob, Table and, Queue.

This article provides quick guidance on how to get started with Azure Stack Storage using development tools. More detailed information and sample code can be found in the corresponding Azure Storage tutorials.

There are known differences between Azure Storage and Azure Stack Storage, including some specific requirements for each platform. For example, there are specific client libraries and specific endpoint suffix requirements for Azure Stack. 

## Azure client libraries
The Azure Stack Storage supported REST API version is 2015-04-05. It doesn’t have full parity with the latest version of Azure Storage REST API. So for the storage client libraries, you need to be aware of the version which is compatible with REST API 2015-04-05.


|Client Library|Azure Stack supported version|Link|Endpoint specification|
|---------|---------|---------|---------|
|.NET     |6.2.0|[https://github.com/Azure/azure-storage-net/releases/tag/v6.2.1](https://github.com/Azure/azure-storage-net/releases/tag/v6.2.1)|app.config file|
|Node.js     |1.1.0|[https://github.com/Azure/azure-storage-node/releases/tag/1.1.0](https://github.com/Azure/azure-storage-node/releases/tag/1.1.0)|Service instance declaration|
|Python     |0.30.0|[https://github.com/Azure/azure-storage-python/releases/tag/v0.30.0](https://github.com/Azure/azure-storage-python/releases/tag/v0.30.0)|Service instance declaration|

### Endpoint declaration
An Azure Stack endpoint includes two parts: the name of a region and the Azure Stack domain.
In the Azure Stack POC, the default endpoint is **local.azurestack.external**.
Contact your service administrator if you’re not sure about your endpoint.

## Examples


#### .NET

For Azure Stack, endpoint suffix needs to be specified in the `app.config` file:

```
<add key="StorageConnectionString" 
value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;
EndpointSuffix=local.azurestack.external;" />
```

#### Node.js

For Azure Stack, the endpoint suffix needs to be specified in the declaration instance:

```
var blobSvc = azure.createBlobService(‘'myaccount', ‘mykey’,
‘myaccount.blob.local.azurestack.external’);
```

#### Python

For Azure Stack, the endpoint suffix needs to be specified in the declaration instance:

```
block_blob_service = BlockBlobService(account_name='myaccount', account_key='mykey', endpoint_suffix='local.azurestack.external')
```

For more information, see [Azure Stack storage: differences and considerations](azure-stack-acs-differences.md#azure-client-libraries).

## Get started with Blob storage

Refer to the following Azure Blob storage tutorials that are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Blob storage using .NET](../storage/storage-dotnet-how-to-use-blobs.md)
* [How to use Blob storage from Node.js](../storage/storage-nodejs-how-to-use-blob-storage.md)
* [How to use Azure Blob storage from Python](../storage/storage-python-how-to-use-blob-storage.md)

## Get started with Queue storage

Refer to the following Azure Queue storage tutorials that are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Queue storage using .NET](../storage/storage-dotnet-how-to-use-queues.md)
* [How to use Queue storage from Node.js](../storage/storage-nodejs-how-to-use-queues.md)
* [How to use Queue storage from Python](../storage/storage-python-how-to-use-queue-storage.md)


## Get started with Table storage

Refer to the following Azure Table storage tutorials that are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Table storage using .NET](../storage/storage-dotnet-how-to-use-tables.md)
* [How to use Azure Table storage from Node.js](../storage/storage-nodejs-how-to-use-table-storage.md)
* [How to use Table storage in Python](../storage/storage-python-how-to-use-table-storage.md)

## Next steps

* TBD