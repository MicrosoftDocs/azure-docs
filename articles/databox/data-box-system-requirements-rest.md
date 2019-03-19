---
title: Microsoft Azure Data Box Blob storage requirements| Microsoft Docs
description: Learn about the supported versions for APIs, SDKs, and client libraries for Azure Data Box Blob storage
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 02/05/2019
ms.author: alkohli
---
# Azure Data Box Blob storage requirements

This article lists the versions of the Azure APIs, SDKs, and tools supported with the Data Box Blob storage. Data Box Blob storage provides blob management functionality with Azure-consistent semantics. This article also summarizes the known Azure Data Box Blob storage differences from the Azure Storage services.

We recommend that you review the information carefully before you connect to the Data Box Blob storage, and then refer back to it as necessary.


## Storage differences

|     Feature                                             |     Azure Storage                                     |     Data Box Blob storage |
|---------------------------------------------------------|-------------------------------------------------------|---------------------------|
|    Azure File storage                                   |    Cloud-based SMB file shares supported              |    Not supported      |
|    Service encryption for data at Rest                  |    256-bit AES encryption                             |    256-bit AES encryption |
|    Storage account type                                 |    General-purpose and Azure blob storage accounts    |    General-purpose v1 only|
|    Blob name                                            |    1,024 characters (2,048 bytes)                     |    880 characters (1,760 bytes)|
|    Block blob maximum size                              |    4.75 TB (100 MB X 50,000 blocks)                   |    4.75 TB (100 MB x 50,000 blocks) for Azure Data Box v 1.8 onwards.|
|    Page blob maximum size                               |    8 TB                                               |    1 TB                   |
|    Page blob page size                                  |    512 bytes                                          |    4 KB                   |

## Supported API versions

The following versions of Azure Storage service APIs are supported with Data Box Blob storage:

Public preview release (Azure Data Box 1.8 onwards)

- [2017-11-09](/rest/api/storageservices/version-2017-11-09)
- [2017-07-29](/rest/api/storageservices/version-2017-07-29)
- [2017-04-17](/rest/api/storageservices/version-2017-04-17)
- [2016-05-31](/rest/api/storageservices/version-2016-05-31)
- [2015-12-11](/rest/api/storageservices/version-2015-12-11)
- [2015-07-08](/rest/api/storageservices/version-2015-07-08)
- [2015-04-05](/rest/api/storageservices/version-2015-04-05)

## Supported SDK versions

|     Client library     |     Data Box Blob storage supported version     |     Link             |     Endpoint specification         |
|------------------------|-------------------------------------------------|---------------------------------------------|------------------------------------|
|    .NET                |    From 6.2.0 to 8.7.0.                         |    Nuget package:   https://www.nuget.org/packages/WindowsAzure.Storage/ <br>GitHub release:   https://github.com/Azure/azure-storage-net/releases                                                                      |    app.config file                 |
|    Java                |    From 4.1.0 to 6.1.0                          |    Maven package:   https://mvnrepository.com/artifact/com.microsoft.azure/azure-storage   <br>GitHub release:   https://github.com/Azure/azure-storage-java/releases                                                      |    Connection string setup         |
|    Node.js             |    From 1.1.0 to 2.7.0                          |    NPM link:   https://www.npmjs.com/package/azure-storage   (For example: run "npm install azure-storage@2.7.0")   <br>GitHub release:   https://github.com/Azure/azure-storage-node/releases                            |    Service instance declaration    |
|    C++                 |    From 2.4.0 to 3.1.0                          |    Nuget package:   https://www.nuget.org/packages/wastorage.v140/   <br>GitHub release:   https://github.com/Azure/azure-storage-cpp/releases                                                                            |    Connection string setup         |
|    PHP                 |    From 0.15.0 to 1.0.0                         |    GitHub release:   https://github.com/Azure/azure-storage-php/releases   <br>Install via Composer (see details below)                                                                                                   |    Connection string setup         |
|    Python              |    From 0.30.0 to 1.0.0                         |    GitHub release:   https://github.com/Azure/azure-storage-python/releases                                                                                                                                              |    Service instance declaration    |
|    Ruby                |    From 0.12.1 to 1.0.1                         |    RubyGems package:<br>Common:   https://rubygems.org/gems/azure-storage-common/   <br>Blob: https://rubygems.org/gems/azure-storage-blob/      <br>GitHub release:   https://github.com/Azure/azure-storage-ruby/releases    |                                   |

## Supported Azure client libraries

For Data Box Blob storage, there are specific client libraries and specific endpoint suffix requirements. The Data Box Blob storage endpoints do not have full parity with the latest version of the Azure Blob Storage REST API, see the [supported versions for Azure Data Box 1.8 onwards](#supported-api-versions). For the storage client libraries, you need to be aware of the version that is compatible with the REST API.

### Azure Data Box 1.8 onwards

| Client library     |Data Box Blob storage supported version     | Link   |     Endpoint specification      |
|--------------------|--------------------------------------------|--------|---------------------------------|
|    .NET                |    8.7.0                                           |    Nuget package:   https://www.nuget.org/packages/WindowsAzure.Storage/8.7.0    <br>GitHub release:   https://github.com/Azure/azure-storage-net/releases/tag/v8.7.0                                                                                                                                                                                               |    app.config file                 |
|    Java                |    6.1.0                                           |    Maven package:   https://mvnrepository.com/artifact/com.microsoft.azure/azure-storage/6.1.0   <br>GitHub release:   https://github.com/Azure/azure-storage-java/releases/tag/v6.1.0                                                                                                                                                                              |    Connection string setup         |
|    Node.js             |    2.7.0                                           |    NPM link:   https://www.npmjs.com/package/azure-storage   (Run: npm install azure-storage@2.7.0)   <br>GitHub release:   https://github.com/Azure/azure-storage-node/releases/tag/v2.7.0                                                                                                                                                                        |    Service instance declaration    |
|    C++                 |    3.1.0                                           |    Nuget package:   https://www.nuget.org/packages/wastorage.v140/3.1.0   <br>GitHub release:   https://github.com/Azure/azure-storage-cpp/releases/tag/v3.1.0                                                                                                                                                                                                     |    Connection string setup         |
|    PHP                 |    1.0.0                                           |    GitHub release:<br>Common: https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-common   <br>Blob: https://github.com/Azure/azure-storage-php/releases/tag/v1.0.0-blob      <br>Install via Composer (To learn more, See   the details below.)                                                                                                             |    Connection string setup         |
|    Python              |    1.0.0                                           |    GitHub release:<br>Common:   https://github.com/Azure/azure-storage-python/releases/tag/v1.0.0-common <br>Blob:   https://github.com/Azure/azure-storage-python/releases/tag/v1.0.0-blob                                                                                                                                                                          |    Service instance declaration    |
|    Ruby                |    1.0.1                                           |    RubyGems package:<br>Common:   https://rubygems.org/gems/azure-storage-common/versions/1.0.1   <br>Blob: https://rubygems.org/gems/azure-storage-blob/versions/1.0.1         <br>GitHub release:<br>Common: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-common   <br>Blob: https://github.com/Azure/azure-storage-ruby/releases/tag/v1.0.1-blob          |    Connection string setup         |



### Install PHP client via Composer - current

To install via Composer: (take blob as example).
Create a file named composer.json in the root of the project with following code:

```
 {
   "require": {
   "Microsoft/azure-storage-blob":"1.0.0"
   }
```

Download `composer.phar` to the project root.

Run: php composer.phar install.

### Endpoint declaration

An Azure Data Box Blob storage endpoint includes two parts: the name of a region and the Data Box domain. In the Data Box Blob storage SDK, the default endpoint is \<serial no. of the device>.microsoftdatabox.com.  For more information on blob service endpoint, go to [Connect via Data Box Blob storage](data-box-deploy-copy-data-via-rest.md).
 
## Examples

### .NET

For Data Box Blob storage, the endpoint suffix is specified in the `app.config` file:

```
<add key="StorageConnectionString"
value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;
EndpointSuffix=<<serial no. of the device>.microsoftdatabox.com  />
```

### Java

For Data Box Blob storage, the endpoint suffix is specified in the setup of connection string:

```
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key;" +
    "EndpointSuffix=<serial no. of the device>.microsoftdatabox.com ";
```

### Node.js

For Data Box Blob storage, the endpoint suffix is specified in the declaration instance:

```
var blobSvc = azure.createBlobService('myaccount', 'mykey',
'myaccount.blob. <serial no. of the device>.microsoftdatabox.com ');
```

### C++

For Data Box Blob storage, the endpoint suffix is specified in the setup of connection string:

```
const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;
AccountName=your_storage_account;
AccountKey=your_storage_account_key;
EndpointSuffix=<serial no. of the device>.microsoftdatabox.com "));
```

### PHP

For Data Box Blob storage, the endpoint suffix is specified in the setup of connection string:

```
$connectionString = 'BlobEndpoint=http://<storage account name>.blob.<serial no. of the device>.microsoftdatabox.com /;
AccountName=<storage account name>;AccountKey=<storage account key>'
```

### Python

For Data Box Blob storage, the endpoint suffix is specified in the declaration instance:

```
block_blob_service = BlockBlobService(account_name='myaccount',
account_key='mykey',
endpoint_suffix=’<serial no. of the device>.microsoftdatabox.com’)
```

### Ruby

For Data Box Blob storage, the endpoint suffix is specified in the setup of connection string:

```
set
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;
AccountName=myaccount;
AccountKey=mykey;
EndpointSuffix=<serial no. of the device>.microsoftdatabox.com
```

## Next steps

* [Deploy your Azure Data Box](data-box-deploy-ordered.md)
