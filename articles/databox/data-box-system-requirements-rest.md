---
title: Microsoft Azure Data Box Blob storage requirements| Microsoft Docs
description: Learn about the supported versions for APIs, SDKs, and client libraries for Azure Data Box Blob storage
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 10/05/2020
ms.author: shaas
---
# Azure Data Box Blob storage requirements

This article lists the versions of the Azure APIs, Azure client libraries, and tools supported with the Data Box Blob storage. Data Box Blob storage provides blob management functionality with Azure-consistent semantics. This article also summarizes the known Azure Data Box Blob storage differences from the Azure Storage services.

We recommend that you review the information carefully before you connect to the Data Box Blob storage, and then refer back to it as necessary.


## Storage differences

|     Feature                                             |     Azure Storage                                     |     Data Box Blob storage |
|---------------------------------------------------------|-------------------------------------------------------|---------------------------|
|    Azure Files                                   |    Cloud-based SMB and NFS file shares supported               |    Not supported      |
|    Service encryption for data at Rest                  |    256-bit AES encryption                             |    256-bit AES encryption |
|    Storage account type                                 |    General-purpose and Azure Blob storage accounts    |    General-purpose v1 only|
|    Blob name                                            |    1,024 characters (2,048 bytes)                     |    880 characters (1,760 bytes)|
|    Block blob maximum size                              |    4.75 TiB (100 MB X 50,000 blocks)                   |    4.75 TiB (100 MB x 50,000 blocks) for Azure Data Box v 3.0 onwards.|
|    Page blob maximum size                               |    8 TiB                                               |    1 TiB                   |
|    Page blob page size                                  |    512 bytes                                          |    4 KiB                   |

## Supported API versions

The following versions of Azure Storage service APIs are supported with Data Box Blob storage.

### Azure Data Box 3.0 onwards

[!INCLUDE [data-box-rest-supported-api-versions](../../includes/data-box-rest-supported-api-versions.md)]

## Supported Azure client libraries

For Data Box Blob storage, there are specific client libraries and specific endpoint suffix requirements. The Data Box Blob storage endpoints do not have full parity with the latest version of the Azure Blob Storage REST API; see the [supported versions for Azure Data Box 3.0 onwards](#supported-api-versions). For the storage client libraries, you need to be aware of the version that is compatible with the REST API.

### Azure Data Box 3.0 onwards

The following Azure client library versions are supported for Data Box Blob storage.

[!INCLUDE [data-box-rest-supported-azure-client-libraries](../../includes/data-box-rest-supported-azure-client-libraries.md)]

### Install PHP client via Composer - current

To install via Composer: (take blob as example).
1. Create a file named composer.json in the root of the project with following code:

    ```
    {
    "require": {
    "Microsoft/azure-storage-blob":"1.2.0"
    }
    ```

2. Download `composer.phar` to the project root.

3. Run: php composer.phar install.

### Endpoint declaration

In the Data Box Blob storage SDK, the endpoint suffix - `<device serial number>.microsoftdatabox.com` - identifies the Data Box domain. For more information on the blob service endpoint, go to [Connect via Data Box Blob storage](data-box-deploy-copy-data-via-rest.md).
 
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
