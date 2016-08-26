<properties 
	pageTitle="Configure a Connection String to Azure Storage | Microsoft Azure"
	description="Configure a connection string to an Azure storage account. A connection string includes the information needed to authenticate access to a storage account from your application at runtime."
	services="storage"
	documentationCenter=""
	authors="tamram"
	manager="carmonm"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/03/2016"
	ms.author="tamram"/>

# Configure Azure Storage Connection Strings

## Overview

A connection string includes the authentication information needed to access data in an Azure storage account from your application at runtime. You can configure a connection string to:

- Connect to the Azure storage emulator.
- Access a storage account in Azure.
- Access specified resources in Azure via a shared access signature (SAS).

[AZURE.INCLUDE [storage-account-key-note-include](../../includes/storage-account-key-note-include.md)]

## Storing your connection string

Your application will need to access the connection string at runtime in order to authenticate requests made to Azure Storage. You have a few different options for storing your connection string:

- For an application running on the desktop or on a device, you can store the connection string in an `app.config `file or a `web.config` file. Add the connection string to the **AppSettings** section.
- For an application running in an Azure cloud service, you can store your connection string in the [Azure service configuration schema (.cscfg) file](https://msdn.microsoft.com/library/ee758710.aspx). Add the connection string to the **ConfigurationSettings** section of the service configuration file.
- You can also use your connection string directly in your code. For most scenarios, however, we recommend that you store your configuration string in a configuration file.

Storing your connection string within a configuration file makes it easy to update the connection string to switch between the storage emulator and an Azure storage account in the cloud. You only need to edit the connection string to point to your target environment.

You can use the [Microsoft Azure Configuration Manager](https://www.nuget.org/packages/Microsoft.WindowsAzure.ConfigurationManager/) class to access your connection string at runtime regardless of where your application is running.

## Create a connection string to the storage emulator

[AZURE.INCLUDE [storage-emulator-connection-string-include](../../includes/storage-emulator-connection-string-include.md)]

See [Use the Azure Storage Emulator for Development and Testing](storage-use-emulator.md) for more information about the storage emulator.

## Create a connection string to an Azure storage account

To create a connection string to your Azure storage account, use the connection string format below. Indicate whether you want to connect to the storage account through HTTPS (recommended) or HTTP, replace `myAccountName` with the name of your storage account, and replace `myAccountKey` with your account access key:

    DefaultEndpointsProtocol=[http|https];AccountName=myAccountName;AccountKey=myAccountKey

For example, your connection string will look similar to the following sample connection string:

	DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=<account-key>

> [AZURE.NOTE] Azure Storage supports both HTTP and HTTPS in a connection string; however, using HTTPS is highly recommended.

## Create a connection string using a shared access signature

If you possess a shared access signature (SAS) URL, you can use the SAS in your connection string. Because the SAS includes on the URI the information required to authenticate the request, the SAS URI provides the protocol, the service endpoint, and the necessary credentials to access the resource.

To create a connection string that includes a shared access signature, specify the string in the following format:

    BlobEndpoint=myBlobEndpoint;
	QueueEndpoint=myQueueEndpoint;
	TableEndpoint=myTableEndpoint;
	FileEndpoint=myFileEndpoint;
	SharedAccessSignature=sasToken

Each service endpoint is optional, although the connection string must contain at least one.

Using HTTPS with a SAS is recommended as a best practice. For more information about shared access signatures, see [Shared Access Signatures: Understanding the SAS Model](storage-dotnet-shared-access-signature-part-1.md).

>[AZURE.NOTE] If you are specifying a SAS in a connection string in a configuration file, you may need to encode special characters in the URL.

### Service SAS example

Here's an example of a connection string that includes a service SAS for Blob storage:

	BlobEndpoint=https://storagesample.blob.core.windows.net;SharedAccessSignature=sv=2015-04-05&sr=b&si=tutorial-policy-635959936145100803&sig=9aCzs76n0E7y5BpEi2GvsSv433BZa22leDOZXX%2BXXIU%3D

And here's an example of the same connection string with encoding of special characters:

	BlobEndpoint=https://storagesample.blob.core.windows.net;SharedAccessSignature=sv=2015-04-05&amp;sr=b&amp;si=tutorial-policy-635959936145100803&amp;sig=9aCzs76n0E7y5BpEi2GvsSv433BZa22leDOZXX%2BXXIU%3D

### Account SAS example

Here's an example of a connection string that includes an account SAS for Blob and File storage. Note that endpoints for both services are specified:

	BlobEndpoint=https://storagesample.blob.core.windows.net;
	FileEndpoint=https://storagesample.file.core.windows.net;
	SharedAccessSignature=sv=2015-07-08&sig=iCvQmdZngZNW%2F4vw43j6%2BVz6fndHF5LI639QJba4r8o%3D&spr=https&st=2016-04-12T03%3A24%3A31Z&se=2016-04-13T03%3A29%3A31Z&srt=s&ss=bf&sp=rwl

And here's an example of the same connection string with URL encoding:

	BlobEndpoint=https://storagesample.blob.core.windows.net;
	FileEndpoint=https://storagesample.file.core.windows.net;
	SharedAccessSignature=sv=2015-07-08&amp;sig=iCvQmdZngZNW%2F4vw43j6%2BVz6fndHF5LI639QJba4r8o%3D&amp;spr=https&amp;st=2016-04-12T03%3A24%3A31Z&amp;se=2016-04-13T03%3A29%3A31Z&amp;srt=s&amp;ss=bf&amp;sp=rwl

## Creating a connection string to an explicit storage endpoint

You can explicitly specify the service endpoints in your connection string instead of using the default endpoints. To create a connection string that specifies an explicit endpoint, specify the complete service endpoint for each service, including the protocol specification (HTTPS (recommended) or HTTP), in the following format:

	DefaultEndpointsProtocol=[http|https];
	BlobEndpoint=myBlobEndpoint;
	QueueEndpoint=myQueueEndpoint;
	TableEndpoint=myTableEndpoint;
	FileEndpoint=myFileEndpoint;
	AccountName=myAccountName;
	AccountKey=myAccountKey

One scenario where you may wish to do specify an explicit endpoint is if you have mapped your Blob storage endpoint to a custom domain. In that case, you can specify your custom endpoint for Blob storage in your connection string, and optionally specify the default endpoints for the other service if your application uses them.

Here are examples of valid connection strings that specify an explicit endpoint for the Blob service:

	# Blob endpoint only
	DefaultEndpointsProtocol=https;
	BlobEndpoint=www.mydomain.com;
	AccountName=storagesample;
	AccountKey=account-key

	# All service endpoints
	DefaultEndpointsProtocol=https;
	BlobEndpoint=www.mydomain.com;
	FileEndpoint=myaccount.file.core.windows.net;
	QueueEndpoint=myaccount.queue.core.windows.net;
	TableEndpoint=myaccount;
	AccountName=storagesample;
	AccountKey=account-key

The endpoint value that is listed in the connection string is used to construct the request URIs to the Blob service, and it dictates the form of any URIs that are returned to your code.

Note that if you choose to omit a service endpoint from the connection string, then you will not be able to use that connection string to access data in that service from your code.

### Creating a connection string with an endpoint suffix

To create a connection string for storage service in regions or instances with different endpoint suffixes, such as for Azure China or Azure Governance, use the following connection string format. Indicate whether you want to connect to the storage account through HTTP or HTTPS, replace `myAccountName` with the name of your storage account, replace `myAccountKey` with your account access key, and replace `mySuffix` with the URI suffix:


	DefaultEndpointsProtocol=[http|https];
	AccountName=myAccountName;
	AccountKey=myAccountKey;
	EndpointSuffix=mySuffix;


For example, your connection string should look similar to the following connection string:

	DefaultEndpointsProtocol=https;
	AccountName=storagesample;
	AccountKey=<account-key>;
	EndpointSuffix=core.chinacloudapi.cn;

## Parsing a connection string

[AZURE.INCLUDE [storage-cloud-configuration-manager-include](../../includes/storage-cloud-configuration-manager-include.md)]


## Next steps

- [Use the Azure Storage Emulator for Development and Testing](storage-use-emulator.md)
- [Azure Storage Explorers](storage-explorers.md)
