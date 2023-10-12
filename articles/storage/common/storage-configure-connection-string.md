---
title: Configure a connection string
titleSuffix: Azure Storage
description: Configure a connection string for an Azure storage account. A connection string contains the information needed to authorize access to a storage account from your application at runtime using Shared Key authorization.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 01/24/2023
ms.author: akashdubey
ms.reviewer: nachakra
---

# Configure Azure Storage connection strings

A connection string includes the authorization information required for your application to access data in an Azure Storage account at runtime using Shared Key authorization. You can configure connection strings to:

- Connect to the Azurite storage emulator.
- Access a storage account in Azure.
- Access specified resources in Azure via a shared access signature (SAS).

To learn how to view your account access keys and copy a connection string, see [Manage storage account access keys](storage-account-keys-manage.md).

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## Store a connection string

Your application needs to access the connection string at runtime to authorize requests made to Azure Storage. You have several options for storing your account access keys or connection string:

- You can store your account keys securely in Azure Key Vault. For more information, see [About Azure Key Vault managed storage account keys](../../key-vault/secrets/about-managed-storage-account-keys.md).
- You can store your connection string in an environment variable.
- An application can store the connection string in an **app.config** or **web.config** file. Add the connection string to the **AppSettings** section in these files.

> [!WARNING]
> Storing your account access keys or connection string in clear text presents a security risk and is not recommended. Store your account keys in an encrypted format, or migrate your applications to use Microsoft Entra authorization for access to your storage account.

## Configure a connection string for Azurite

[!INCLUDE [storage-emulator-connection-string-include](../../../includes/storage-emulator-connection-string-include.md)]

For more information about Azurite, see [Use the Azurite emulator for local Azure Storage development](../common/storage-use-azurite.md).

## Configure a connection string for an Azure storage account

To create a connection string for your Azure storage account, use the following format. Indicate whether you want to connect to the storage account through HTTPS (recommended) or HTTP, replace `myAccountName` with the name of your storage account, and replace `myAccountKey` with your account access key:

`DefaultEndpointsProtocol=[http|https];AccountName=myAccountName;AccountKey=myAccountKey`

For example, your connection string might look similar to:

`DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=<account-key>`

Although Azure Storage supports both HTTP and HTTPS in a connection string, *HTTPS is highly recommended*.

> [!TIP]
> You can find your storage account's connection strings in the [Azure portal](https://portal.azure.com). Navigate to **Security + networking** > **Access keys** in your storage account's settings to see connection strings for both primary and secondary access keys.
>

## Create a connection string using a shared access signature

[!INCLUDE [storage-use-sas-in-connection-string-include](../../../includes/storage-use-sas-in-connection-string-include.md)]

## Create a connection string for an explicit storage endpoint

You can specify explicit service endpoints in your connection string instead of using the default endpoints. To create a connection string that specifies an explicit endpoint, specify the complete service endpoint for each service, including the protocol specification (HTTPS (recommended) or HTTP), in the following format:

```
DefaultEndpointsProtocol=[http|https];
BlobEndpoint=myBlobEndpoint;
FileEndpoint=myFileEndpoint;
QueueEndpoint=myQueueEndpoint;
TableEndpoint=myTableEndpoint;
AccountName=myAccountName;
AccountKey=myAccountKey
```

One scenario where you might wish to specify an explicit endpoint is when you've mapped your Blob storage endpoint to a [custom domain](../blobs/storage-custom-domain-name.md). In that case, you can specify your custom endpoint for Blob storage in your connection string. You can optionally specify the default endpoints for the other services if your application uses them.

Here is an example of a connection string that specifies an explicit endpoint for the Blob service:

```
# Blob endpoint only
DefaultEndpointsProtocol=https;
BlobEndpoint=http://www.mydomain.com;
AccountName=storagesample;
AccountKey=<account-key>
```

This example specifies explicit endpoints for all services, including a custom domain for the Blob service:

```
# All service endpoints
DefaultEndpointsProtocol=https;
BlobEndpoint=http://www.mydomain.com;
FileEndpoint=https://myaccount.file.core.windows.net;
QueueEndpoint=https://myaccount.queue.core.windows.net;
TableEndpoint=https://myaccount.table.core.windows.net;
AccountName=storagesample;
AccountKey=<account-key>
```

The endpoint values in a connection string are used to construct the request URIs to the storage services, and dictate the form of any URIs that are returned to your code.

If you've mapped a storage endpoint to a custom domain and omit that endpoint from a connection string, then you will not be able to use that connection string to access data in that service from your code.

For more information about configuring a custom domain for Azure Storage, see [Map a custom domain to an Azure Blob Storage endpoint](../blobs/storage-custom-domain-name.md).

> [!IMPORTANT]
> Service endpoint values in your connection strings must be well-formed URIs, including `https://` (recommended) or `http://`.

### Create a connection string with an endpoint suffix

To create a connection string for a storage service in regions or instances with different endpoint suffixes, such as for Microsoft Azure operated by 21Vianet or Azure Government, use the following connection string format. Indicate whether you want to connect to the storage account through HTTPS (recommended) or HTTP, replace `myAccountName` with the name of your storage account, replace `myAccountKey` with your account access key, and replace `mySuffix` with the URI suffix:

```
DefaultEndpointsProtocol=[http|https];
AccountName=myAccountName;
AccountKey=myAccountKey;
EndpointSuffix=mySuffix;
```

Here's an example connection string for storage services in Azure operated by 21Vianet:

```
DefaultEndpointsProtocol=https;
AccountName=storagesample;
AccountKey=<account-key>;
EndpointSuffix=core.chinacloudapi.cn;
```

## Authorizing access with Shared Key

To learn how to authorize access to Azure Storage with the account key or with a connection string, see one of the following articles:

- [Authorize access and connect to Blob Storage with .NET](../blobs/storage-blob-dotnet-get-started.md?tabs=account-key#authorize-access-and-connect-to-blob-storage)
- [Authorize access and connect to Blob Storage with Java](../blobs/storage-blob-java-get-started.md?tabs=account-key#authorize-access-and-connect-to-blob-storage)
- [Authorize access and connect to Blob Storage with JavaScript](../blobs/storage-blob-javascript-get-started.md#authorize-access-and-connect-to-blob-storage)
- [Authorize access and connect to Blob Storage with Python](../blobs/storage-blob-python-get-started.md#authorize-access-and-connect-to-blob-storage)

## Next steps

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Use the Azurite emulator for local Azure Storage development](storage-use-azurite.md)
