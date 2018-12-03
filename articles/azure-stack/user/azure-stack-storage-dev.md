---
title: Get started with Azure Stack storage development tools  | Microsoft Docs
description: Guidance to get started with using Azure Stack storage development tools
services: azure-stack 
author: mattbriggs
ms.author: mabrigg
ms.date: 12/03/2018
ms.topic: get-started-article
ms.service: azure-stack
manager: femila
ms.reviewer: xiaofmao

---

# Get started with Azure Stack storage development tools

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Microsoft Azure Stack provides a set of storage services that includes blob, table, and queue storage.

Use this article as a guide to get started using Azure Stack storage development tools. You can find more detailed information and sample code in corresponding Azure storage tutorials.

> [!NOTE]  
> There are known differences between Azure Stack storage and Azure storage, including specific requirements for each platform. For example, there are specific client libraries and specific endpoint suffix requirements for Azure Stack. For more information, see [Azure Stack storage: Differences and considerations](azure-stack-acs-differences.md).

## Azure client libraries

For the storage client libraries, be aware of the version that is compatible with the REST API. You must also specify the Azure Stack endpoint in your code.

### 1811 update or newer versions

| Client library | Azure Stack supported version | Link | Endpoint specification |
|----------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| .NET | 9.2.0 | Nuget package:<br>https://www.nuget.org/packages/WindowsAzure.Storage/9.2.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-net/releases/tag/v9.2.0 | app.config file |
| Java | 7.0.0 | Maven package:<br>https://mvnrepository.com/artifact/com.microsoft.azure/azure-storage/7.0.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-java/releases/tag/v7.0.0 | Connection string setup |
| Node.js | 2.8.3 | NPM link:<br>https://www.npmjs.com/package/azure-storage<br>(Run: `npm install azure-storage@2.8.3`)<br> <br>Github release:<br>https://github.com/Azure/azure-storage-node/releases/tag/v2.8.3 | Service instance declaration |
| C++ | 5.2.0 | Nuget package:<br>https://www.nuget.org/packages/Microsoft.Azure.Storage.CPP.v140/5.2.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-cpp/releases/tag/v5.2.0 | Connection string setup |
| PHP | 1.2.0 | GitHub release:<br>Common: https://github.com/Azure/azure-storage-php/releases/tag/v1.2.0-common<br>Blob: https://github.com/Azure/azure-storage-php/releases/tag/v1.2.0-blob<br>Queue:<br>https://github.com/Azure/azure-storage-php/releases/tag/v1.1.1-queue<br>Table: https://github.com/Azure/azure-storage-php/releases/tag/v1.1.0-table<br> <br>Install via Composer (To learn more, [see the details below](#install-php-client-via-composer---current).) | Connection string setup |
| Python | 1.1.0 | GitHub release:<br>Common:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.1.0-common<br>Blob:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.1.0-blob<br>Queue:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.1.0-queue | Service instance declaration |
| Ruby | 1.0.1 | RubyGems package:<br>Common:<br>https://rubygems.org/gems/azure-storage-common/versions/1.0.1<br>Blob: https://rubygems.org/gems/azure-storage-blob/versions/1.0.1<br>Queue: https://rubygems.org/gems/azure-storage-queue/versions/1.0.1<br>Table: https://rubygems.org/gems/azure-storage-table/versions/1.0.1<br> <br>GitHub release:<br>Common: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-common<br>Blob: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-blob<br>Queue: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-queue<br>Table: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-table | Connection string setup |

#### Install PHP client via Composer - current

To install via Composer: (take the blob as an example).

1. Create a file named **composer.json** in the root of the project with following code:

    ```php
    {
      "require": {
      "Microsoft/azure-storage-blob":"1.2.0"
      }
    }
    ```

2. Download [composer.phar](http://getcomposer.org/composer.phar) to the project root.
3. Run: `php composer.phar install`.

### Previous versions (1802 to 1809 update)

| Client library | Azure Stack supported version | Link | Endpoint specification |
|----------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| .NET | 8.7.0 | Nuget package:<br>https://www.nuget.org/packages/WindowsAzure.Storage/8.7.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-net/releases/tag/v8.7.0 | app.config file |
| Java | 6.1.0 | Maven package:<br>http://mvnrepository.com/artifact/com.microsoft.azure/azure-storage/6.1.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-java/releases/tag/v6.1.0 | Connection string setup |
| Node.js | 2.7.0 | NPM link:<br>https://www.npmjs.com/package/azure-storage<br>(Run: `npm install azure-storage@2.7.0`)<br> <br>Github release:<br>https://github.com/Azure/azure-storage-node/releases/tag/v2.7.0 | Service instance declaration |
| C++ | 3.1.0 | Nuget package:<br>https://www.nuget.org/packages/wastorage.v140/3.1.0<br> <br>GitHub release:<br>https://github.com/Azure/azure-storage-cpp/releases/tag/v3.1.0 | Connection string setup |
| PHP | 1.0.0 | GitHub release:<br>Common: https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-common<br>Blob: https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-blob<br>Queue:<br>https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-queue<br>Table: https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-table<br> <br>Install via Composer (see the details below).) | Connection string setup |
| Python | 1.0.0 | GitHub release:<br>Common:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.0.0-common<br>Blob:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.0.0-blob<br>Queue:<br>https://github.com/Azure/azure-storage-python/releases/tag/v1.0.0-queue | Service instance declaration |
| Ruby | 1.0.1 | RubyGems package:<br>Common:<br>https://rubygems.org/gems/azure-storage-common/versions/1.0.1<br>Blob: https://rubygems.org/gems/azure-storage-blob/versions/1.0.1<br>Queue: https://rubygems.org/gems/azure-storage-queue/versions/1.0.1<br>Table: https://rubygems.org/gems/azure-storage-table/versions/1.0.1<br> <br>GitHub release:<br>Common: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-common<br>Blob: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-blob<br>Queue: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-queue<br>Table: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-table | Connection string setup |

#### Install PHP client via Composer - previous

To install via Composer: (take blob as example).

1. Create a file named **composer.json** in the root of the project with following code:

  ```php
    {
      "require": {
      "Microsoft/azure-storage-blob":"1.0.0"
      }
    }
  ```

2. Download [composer.phar](http://getcomposer.org/composer.phar) to the project root.
3. Run: `php composer.phar install`.

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

* [Get started with Azure Blob storage using .NET](../../storage/blobs/storage-dotnet-how-to-use-blobs.md)
* [How to use Blob storage from Java](../../storage/blobs/storage-java-how-to-use-blob-storage.md)
* [How to use Blob storage from Node.js](../../storage/blobs/storage-nodejs-how-to-use-blob-storage.md)
* [How to use Blob storage from C++](../../storage/blobs/storage-c-plus-plus-how-to-use-blobs.md)
* [How to use Blob storage from PHP](../../storage/blobs/storage-php-how-to-use-blobs.md)
* [How to use Azure Blob storage from Python](../../storage/blobs/storage-python-how-to-use-blob-storage.md)
* [How to use Blob storage from Ruby](../../storage/blobs/storage-ruby-how-to-use-blob-storage.md)

## Queue storage

The following Azure Queue storage tutorials are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Queue storage using .NET](../../storage/queues/storage-dotnet-how-to-use-queues.md)
* [How to use Queue storage from Java](../../storage/queues/storage-java-how-to-use-queue-storage.md)
* [How to use Queue storage from Node.js](../../storage/queues/storage-nodejs-how-to-use-queues.md)
* [How to use Queue storage from C++](../../storage/queues/storage-c-plus-plus-how-to-use-queues.md)
* [How to use Queue storage from PHP](../../storage/queues/storage-php-how-to-use-queues.md)
* [How to use Queue storage from Python](../../storage/queues/storage-python-how-to-use-queue-storage.md)
* [How to use Queue storage from Ruby](../../storage/queues/storage-ruby-how-to-use-queue-storage.md)

## Table storage

The following Azure Table storage tutorials are applicable to Azure Stack. Note the specific endpoint suffix requirement for Azure Stack described in the previous [Examples](#examples) section.

* [Get started with Azure Table storage using .NET](../../cosmos-db/table-storage-how-to-use-dotnet.md)
* [How to use Table storage from Java](../../cosmos-db/table-storage-how-to-use-java.md)
* [How to use Azure Table storage from Node.js](../../cosmos-db/table-storage-how-to-use-nodejs.md)
* [How to use Table storage from C++](../../cosmos-db/table-storage-how-to-use-c-plus.md)
* [How to use Table storage from PHP](../../cosmos-db/table-storage-how-to-use-php.md)
* [How to use Table storage in Python](../../cosmos-db/table-storage-how-to-use-python.md)
* [How to use Table storage from Ruby](../../cosmos-db/table-storage-how-to-use-ruby.md)

## Next steps

* [Introduction to Microsoft Azure storage](../../storage/common/storage-introduction.md)
