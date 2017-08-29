---
title: Get started with Azure Stack Storage development tools 
description: Guidance to get started with using Azure Stack Storage development tools
services: azure-stack 
author: xiaofmao
ms.author: xiaofmao
ms.date: 7/21/2017
ms.topic: get-started-article
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

Microsoft Azure Stack provides a set of storage services, including Azure Blob, Table, and Queue storage.

This article provides quick guidance on how to start using Azure Stack Storage development tools. You can find more detailed information and sample code in the corresponding Azure Storage tutorials.

There are known differences between Azure Storage and Azure Stack Storage, including some specific requirements for each platform. For example, there are specific client libraries and specific endpoint suffix requirements for Azure Stack. For more information, see [Azure Stack Storage: Differences and considerations](azure-stack-acs-differences.md).

## Azure client libraries
The supported REST API version for Azure Stack Storage is 2015-04-05. It doesn’t have full parity with the latest version of the Azure Storage REST API. So for the storage client libraries, you need to be aware of the version that is compatible with REST API 2015-04-05.


|Client library|Azure Stack supported version|Link|Endpoint specification|
|---------|---------|---------|---------|
|.NET     |6.2.0|Nuget package:<br>[https://www.nuget.org/packages/WindowsAzure.Storage/6.2.0](https://www.nuget.org/packages/WindowsAzure.Storage/6.2.0)<br><br>GitHub release:<br>[https://github.com/Azure/azure-storage-net/releases/tag/v6.2.1](https://github.com/Azure/azure-storage-net/releases/tag/v6.2.1)|app.config file|
|Java|4.1.0|Maven package:<br>[http://mvnrepository.com/artifact/com.microsoft.azure/azure-storage/4.1.0](http://mvnrepository.com/artifact/com.microsoft.azure/azure-storage/4.1.0)<br><br>GitHub release:<br> [https://github.com/Azure/azure-storage-java/releases/tag/v4.1.0](https://github.com/Azure/azure-storage-java/releases/tag/v4.1.0)|Connection string setup|
|Node.js     |1.1.0|NPM link:<br>[https://www.npmjs.com/package/azure-storage](https://www.npmjs.com/package/azure-storage)<br>(run: `npm install azure-storage@1.1.0)`<br><br>Github release:<br>[https://github.com/Azure/azure-storage-node/releases/tag/1.1.0](https://github.com/Azure/azure-storage-node/releases/tag/1.1.0)|Service instance declaration||C++|2.4.0|Nuget package:<br>[https://www.nuget.org/packages/wastorage.v140/2.4.0](https://www.nuget.org/packages/wastorage.v140/2.4.0)<br><br>GitHub release:<br>[https://github.com/Azure/azure-storage-cpp/releases/tag/v2.4.0](https://github.com/Azure/azure-storage-cpp/releases/tag/v2.4.0)|Connection string setup|
|C++|2.4.0|Nuget package:<br>[https://www.nuget.org/packages/wastorage.v140/2.4.0](https://www.nuget.org/packages/wastorage.v140/2.4.0)<br><br>GitHub release:<br>[https://github.com/Azure/azure-storage-cpp/releases/tag/v2.4.0](https://github.com/Azure/azure-storage-cpp/releases/tag/v2.4.0)|Connection string setup|
|PHP|0.15.0|GitHub release:<br>[https://github.com/Azure/azure-storage-php/releases/tag/v0.15.0](https://github.com/Azure/azure-storage-php/releases/tag/v0.15.0)<br><br>Install via Composer (see details below)|Connection string setup|
|Python     |0.30.0|PIP package:<br> [https://pypi.python.org/pypi/azure-storage/0.30.0](https://pypi.python.org/pypi/azure-storage/0.30.0)<br>(Run: `pip install -v azure-storage==0.30.0)`<br><br>GitHub release:<br> [https://github.com/Azure/azure-storage-python/releases/tag/v0.30.0](https://github.com/Azure/azure-storage-python/releases/tag/v0.30.0)|Service instance declaration|
|Ruby|0.12.1<br>Preview|RubyGems package:<br> [https://rubygems.org/gems/azure-storage/versions/0.12.1.preview](https://rubygems.org/gems/azure-storage/versions/0.12.1.preview)<br><br>GitHub release:<br> [https://github.com/Azure/azure-storage-ruby/releases/tag/v0.12.1](https://github.com/Azure/azure-storage-ruby/releases/tag/v0.12.1)|Connection string setup|

> [!NOTE]
> PHP details<br><br>
>To install via Composer:
>1. Create a file named `composer.json` in the root of the project with following code:<br>
>
>   ```
>   {
>       "require":{
>           "Microsoft/azure-storage":"0.15.0"
>        }
>    }
>   ```
>
>2. Download [composer.phar](http://getcomposer.org/composer.phar) into the project root.
>3. Run: `php composer.phar install`.
>


## Endpoint declaration
An Azure Stack endpoint includes two parts: the name of a region and the Azure Stack domain.
In the Azure Stack Development Kit, the default endpoint is **local.azurestack.external**.
Contact your cloud administrator if you’re not sure about your endpoint.

## Examples


### .NET

For Azure Stack, the endpoint suffix is specified in the app.config file:

```
<add key="StorageConnectionString" 
value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;
EndpointSuffix=local.azurestack.external;" />
```
### Java

For Azure Stack, the endpoint suffix is specified in the setup of connection string:

```
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key;" +
    "EndpointSuffix=local.azurestack.external";
```

### Node.js

For Azure Stack, the endpoint suffix is specified in the declaration instance:

```
var blobSvc = azure.createBlobService('myaccount', 'mykey',
'myaccount.blob.local.azurestack.external');
```
### C++

For Azure Stack, the endpoint suffix is specified in the setup of connection string:

```
const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;
AccountName=your_storage_account;
AccountKey=your_storage_account_key;
EndpointSuffix=local.azurestack.external"));
```

### PHP

For Azure Stack, the endpoint suffix is specified in the setup of connection string:

```
$connectionString = 'BlobEndpoint=http://<storage account name>.blob.local.azurestack.external/;
QueueEndpoint=http:// <storage account name>.queue.local.azurestack.external/;
TableEndpoint=http:// <storage account name>.table.local.azurestack.external/;
AccountName=<storage account name>;AccountKey=<storage account key>'
```

### Python

For Azure Stack, the endpoint suffix is specified in the declaration instance:

```
block_blob_service = BlockBlobService(account_name='myaccount',
account_key='mykey',
endpoint_suffix='local.azurestack.external')
```
### Ruby

For Azure Stack, the endpoint suffix is specified in the setup of connection string:

```
set
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;
AccountName=myaccount;
AccountKey=mykey;
EndpointSuffix=local.azurestack.external
```

## Blob storage

The following Azure Blob storage tutorials are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Blob storage using .NET](../storage/blobs/storage-dotnet-how-to-use-blobs.md)
* [How to use Blob storage from Java](../storage/blobs/storage-java-how-to-use-blob-storage.md)
* [How to use Blob storage from Node.js](../storage/blobs/storage-nodejs-how-to-use-blob-storage.md)
* [How to use Blob storage from C++](../storage/blobs/storage-c-plus-plus-how-to-use-blobs.md)
* [How to use Blob storage from PHP](../storage/blobs/storage-php-how-to-use-blobs.md)
* [How to use Azure Blob storage from Python](../storage/blobs/storage-python-how-to-use-blob-storage.md)
* [How to use Blob storage from Ruby](../storage/blobs/storage-ruby-how-to-use-blob-storage.md)

## Queue storage

The following Azure Queue storage tutorials are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Queue storage using .NET](../storage/queues/storage-dotnet-how-to-use-queues.md)
* [How to use Queue storage from Java](../storage/queues/storage-java-how-to-use-queue-storage.md)
* [How to use Queue storage from Node.js](../storage/queues/storage-nodejs-how-to-use-queues.md)
* [How to use Queue storage from C++](../storage/queues/storage-c-plus-plus-how-to-use-queues.md)
* [How to use Queue storage from PHP](../storage/queues/storage-php-how-to-use-queues.md)
* [How to use Queue storage from Python](../storage/queues/storage-python-how-to-use-queue-storage.md)
* [How to use Queue storage from Ruby](../storage/queues/storage-ruby-how-to-use-queue-storage.md)


## Table storage

The following Azure Table storage tutorials are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Table storage using .NET](../cosmos-db/table-storage-how-to-use-dotnet.md)
* [How to use Table storage from Java](../cosmos-db/table-storage-how-to-use-java.md)
* [How to use Azure Table storage from Node.js](../cosmos-db/table-storage-how-to-use-nodejs.md)
* [How to use Table storage from C++](../cosmos-db/table-storage-how-to-use-c-plus.md)
* [How to use Table storage from PHP](../cosmos-db/table-storage-how-to-use-php.md)
* [How to use Table storage in Python](../cosmos-db/table-storage-how-to-use-python.md)
* [How to use Table storage from Ruby](../cosmos-db/table-storage-how-to-use-ruby.md)

## Next steps

* [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md)