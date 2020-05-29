---
title: Configure a connection string
titleSuffix: Azure Storage
description: Configure a connection string for an Azure storage account. A connection string contains the information needed to authorize access to a storage account from your application at runtime using Shared Key authorization.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/24/2020
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Configure Azure Storage connection strings

A connection string includes the authorization information required for your application to access data in an Azure Storage account at runtime using Shared Key authorization. You can configure connection strings to:

* Connect to the Azure storage emulator.
* Access a storage account in Azure.
* Access specified resources in Azure via a shared access signature (SAS).

To learn how to view your account access keys and copy a connection string, see [Manage storage account access keys](storage-account-keys-manage.md).

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## Store a connection string

Your application needs to access the connection string at runtime to authorize requests made to Azure Storage. You have several options for storing your connection string:

* You can store your connection string in an environment variable.
* An application running on the desktop or on a device can store the connection string in an **app.config** or **web.config** file. Add the connection string to the **AppSettings** section in these files.
* An application running in an Azure cloud service can store the connection string in the [Azure service configuration schema (.cscfg) file](https://msdn.microsoft.com/library/ee758710.aspx). Add the connection string to the **ConfigurationSettings** section of the service configuration file.

Storing your connection string in a configuration file makes it easy to update the connection string to switch between the storage emulator and an Azure storage account in the cloud. You only need to edit the connection string to point to your target environment.

You can use the [Microsoft Azure Configuration Manager](https://www.nuget.org/packages/Microsoft.Azure.ConfigurationManager/) to access your connection string at runtime regardless of where your application is running.

## Configure a connection string for the storage emulator

[!INCLUDE [storage-emulator-connection-string-include](../../../includes/storage-emulator-connection-string-include.md)]

For more information about the storage emulator, see [Use the Azure storage emulator for development and testing](storage-use-emulator.md).

## Configure a connection string for an Azure storage account

To create a connection string for your Azure storage account, use the following format. Indicate whether you want to connect to the storage account through HTTPS (recommended) or HTTP, replace `myAccountName` with the name of your storage account, and replace `myAccountKey` with your account access key:

`DefaultEndpointsProtocol=[http|https];AccountName=myAccountName;AccountKey=myAccountKey`

For example, your connection string might look similar to:

`DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=<account-key>`

Although Azure Storage supports both HTTP and HTTPS in a connection string, *HTTPS is highly recommended*.

> [!TIP]
> You can find your storage account's connection strings in the [Azure portal](https://portal.azure.com). Navigate to **SETTINGS** > **Access keys** in your storage account's menu blade to see connection strings for both primary and secondary access keys.
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

> [!IMPORTANT]
> Service endpoint values in your connection strings must be well-formed URIs, including `https://` (recommended) or `http://`. Because Azure Storage does not yet support HTTPS for custom domains, you *must* specify `http://` for any endpoint URI that points to a custom domain.
>

### Create a connection string with an endpoint suffix

To create a connection string for a storage service in regions or instances with different endpoint suffixes, such as for Azure China 21Vianet or Azure Government, use the following connection string format. Indicate whether you want to connect to the storage account through HTTPS (recommended) or HTTP, replace `myAccountName` with the name of your storage account, replace `myAccountKey` with your account access key, and replace `mySuffix` with the URI suffix:

```
DefaultEndpointsProtocol=[http|https];
AccountName=myAccountName;
AccountKey=myAccountKey;
EndpointSuffix=mySuffix;
```

Here's an example connection string for storage services in Azure China 21Vianet:

```
DefaultEndpointsProtocol=https;
AccountName=storagesample;
AccountKey=<account-key>;
EndpointSuffix=core.chinacloudapi.cn;
```

## Parsing a connection string

[!INCLUDE [storage-cloud-configuration-manager-include](../../../includes/storage-cloud-configuration-manager-include.md)]

## Next steps

* [Use the Azure storage emulator for development and testing](storage-use-emulator.md)
* [Azure Storage explorers](storage-explorers.md)
* [Using Shared Access Signatures (SAS)](storage-sas-overview.md)
