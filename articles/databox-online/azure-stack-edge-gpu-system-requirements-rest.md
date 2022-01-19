---
title: Microsoft Azure Stack Edge Blob storage requirements| Microsoft Docs
description: Learn about the supported versions for APIs, SDKs, and client libraries for Azure Stack Edge Blob storage
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/21/2020
ms.author: alkohli
---
# Azure Stack Edge Blob storage requirements

This article lists the versions of the Azure APIs, Azure client libraries, and tools supported with the Azure Stack Edge Blob storage. Azure Stack Edge Blob storage provides blob management functionality with Azure-consistent semantics. This article also summarizes the known Azure Stack Edge Blob storage differences from the Azure Storage services.

We recommend that you review the information carefully before you connect to the Azure Stack Edge Blob storage, and then refer back to it as necessary.

## Storage differences

|     Feature                                             |     Azure Storage                                     |     Azure Stack Edge Blob storage |
|---------------------------------------------------------|-------------------------------------------------------|---------------------------|
|    Azure Files                                   |    Cloud-based SMB and NFS file shares supported              |    Not supported      |
|    Storage account type                                 |    General-purpose and Azure Blob storage accounts    |    General-purpose v1 only|
|    Blob name                                            |    1,024 characters (2,048 bytes)                     |    880 characters (1,760 bytes)|
|    Block blob maximum size                              |    4.75 TiB (100 MiB X 50,000 blocks)                   |    4.75 TiB (100 MiB x 50,000 blocks) for Azure Stack Edge|
|    Page blob maximum size                               |    8 TiB                                               |    1 TiB                   |
|    Page blob page size                                  |    512 bytes                                          |    4 KiB                   |

## Supported API versions

The following versions of Azure Storage service APIs are supported with Azure Stack Edge Blob storage.

### Azure Stack Edge 2.1.1377.2170 onwards

[!INCLUDE [data-box-rest-supported-api-versions](../../includes/data-box-rest-supported-api-versions.md)]

## Supported Azure client libraries

For Azure Stack Edge Blob storage, there are specific client libraries and specific endpoint suffix requirements. The Azure Stack Edge Blob storage endpoints do not have full parity with the latest version of the Azure Blob Storage REST API; see the [supported API versions for Azure Stack Edge](#supported-api-versions). For the storage client libraries, you need to be aware of the version that is compatible with the REST API.

### Azure Stack Edge 2.1.1377.2170 onwards

The following Azure client library versions are supported for Azure Stack Edge Blob storage.

[!INCLUDE [data-box-rest-supported-azure-client-libraries](../../includes/data-box-rest-supported-azure-client-libraries.md)]

### Install the PHP client via Composer - Current

To install the PHP client via Composer:

1. Create a file named composer.json in the root of the project with following code (example uses Azure Storage Blob service).

    ```
    {
    "require": {
    "Microsoft/azure-storage-blob":"1.2.0"
    }
    ```

2. Download `composer.phar` to the project root.

3. Run: php composer.phar install.


## Endpoint declaration

In the Azure Stack Edge Blob storage SDK, the endpoint suffix - `<device serial number>.microsoftdatabox.com` - identifies the Azure Stack Edge domain. For more information on the blob service endpoint, go to [Transfer data via storage accounts with Azure Stack Edge Pro GPU](./azure-stack-edge-gpu-deploy-add-storage-accounts.md).


## Examples

### .NET

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the `app.config` file:

```
<add key="StorageConnectionString"
value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;
EndpointSuffix=<<serial no. of the device>.microsoftdatabox.com  />
```

### Java

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the setup of connection string:

```
public static final String storageConnectionString =
    "DefaultEndpointsProtocol=http;" +
    "AccountName=your_storage_account;" +
    "AccountKey=your_storage_account_key;" +
    "EndpointSuffix=<serial no. of the device>.microsoftdatabox.com ";
```

### Node.js

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the declaration instance:

```
var blobSvc = azure.createBlobService('myaccount', 'mykey',
'myaccount.blob. <serial no. of the device>.microsoftdatabox.com ');
```

### C++

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the setup of the connection string:

```
const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;
AccountName=your_storage_account;
AccountKey=your_storage_account_key;
EndpointSuffix=<serial no. of the device>.microsoftdatabox.com "));
```

### PHP

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the setup of the connection string:

```
$connectionString = 'BlobEndpoint=http://<storage account name>.blob.<serial no. of the device>.microsoftdatabox.com /;
AccountName=<storage account name>;AccountKey=<storage account key>'
```

### Python

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the declaration instance:

```
block_blob_service = BlockBlobService(account_name='myaccount',
account_key='mykey',
endpoint_suffix=’<serial no. of the device>.microsoftdatabox.com’)
```

### Ruby

For Azure Stack Edge Blob storage, the endpoint suffix is specified in the setup of the connection string:

```
set
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;
AccountName=myaccount;
AccountKey=mykey;
EndpointSuffix=<serial no. of the device>.microsoftdatabox.com
```

## Next steps

* [Prepare to deploy Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-deploy-prep.md)