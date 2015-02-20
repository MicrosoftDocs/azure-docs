<properties 
	pageTitle="Configuring Azure Connection Strings" 
	description="Learn how to configure connection strings to storage account in Azure." 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor="cgronlun"/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="tamram"/>

# Configuring Azure Connection Strings

## Overview
A connection string contains the parameters that are necessary to access your storage account in Azure. You can configure a connection string in the following ways:

- Connect to the Azure storage emulator while you are locally testing your service or application.

- Connect to a storage account in Azure by using the default endpoints for the storage services.

- Connect to a storage account in Azure by using explicit endpoints for the storage services.

If your application is a cloud service running in Azure, the most convenient place to store your connection string is in the [Azure Service Configuration Schema (.cscfg File)](https://msdn.microsoft.com/en-us/library/ee758710.aspx). If your application is running in another environment (for example, on the desktop), then you will probably want to store your connection string in an app.config file or another configuration file. You can use the Azure CloudConfigurationManager class to access your connection string at runtime regardless of where it is running.

##Connecting to the storage emulator

The storage emulator is a local account with a well-known name and key. Since the account name and key are the same for all users, you can use a shortcut string format to refer to the storage emulator within a connection string. Set the value of the connection string to `UseDevelopmentStorage=true`.

You can also specify an HTTP proxy to use when you're testing your service against the storage emulator. This can be useful for observing HTTP requests and responses while you're debugging operations against the storage services. To specify a proxy, add the DevelopmentStorageProxyUri option to the connection string, and set its value to the proxy URI. For example, here is a connection string that points to the storage emulator and configures an HTTP proxy:

`UseDevelopmentStorage=true;DevelopmentStorageProxyUri=http://myProxyUri`

##Connecting to a storage account in Azure

You can define a connection string to a storage account in Azure in one of the following ways:

- Assume the default endpoints for the storage services. This is the simplest option for creating a connection string. When you use this connection string format, you need to 

- Specify explicit endpoints for the storage services. This option allows you to create a more complex connection string. When you use this string format, you can specify storage service endpoints that include a custom domain name, or minimize information exposure for a shared access signature-based connection string.


> [AZURE.NOTE] The Azure storage services support both HTTP and HTTPS; however, using HTTPS is highly recommended.

##Creating a Connection String with default endpoints

To create a connection string that relies on the default endpoints for the storage service, use the following connection string format. Indicate whether you want to connect to the storage account through HTTP or HTTPS, replace myAccountName with the name of your storage account, replace myAccountKey with your account access key:

`DefaultEndpointsProtocol=[http|https];AccountName=myAccountName;AccountKey=myAccountKey` 

For example, your connection string should look similar to the following sample connection string:

`DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=KWPLd0rpW2T0U7K2pVpF8rYr1BgYtR7wYQk33AYiXeUoquiaY6o0TWqduxmPHlqeCNZ3LU0DHptbeIHy5l/Yhg==` 

##Creating a connection string with explicit endpoints

You may want to explicitly specify the service endpoints in your connection string for the following reasons:

- You have registered a custom domain name for your storage account with the Blob service.

- You have a shared access signature for accessing storage resources.

###Specifying a blob endpoint with a custom domain name 
If you have registered a custom domain name for use with the Blob service, you may want to explicitly configure the blob endpoint in your connection string. The endpoint value that is listed in the connection string is used to construct the request URIs to the Blob service, and it dictates the form of any URIs that are returned to your code. 

To create a connection string that specifies explicit endpoints, specify the complete service endpoint for each service, including the protocol specification (HTTP or HTTPS) by using the following format:

`BlobEndpoint=myBlobEndpoint;QueueEndpoint=myQueueEndpoint;TableEndpoint=myTableEndpoint;[credentials]`

When you explicitly specify service endpoints, you have two options for specifying credentials. You can specify the account name and key (AccountName=myAccountName;AccountKey=myAccountKey), as shown in the previous section, or you can **specify a shared access signature**, as shown in the Specifying endpoints with a shared access signature section. If you are specifying the account name and key, the complete string format is:

`BlobEndpoint=myBlobEndpoint;QueueEndpoint=myQueueEndpoint;TableEndpoint=myTableEndpoint;AccountName=myAccountName;AccountKey=myAccountKey` 

You can specify endpoints for blob, table, and queue in a connection string. You must specify at least one endpoint, but you do not need to specify all three. For example, if you're creating a connection string for use with a custom blob endpoint, specifying the queue and table endpoints is optional. Note that if you choose to omit the queue and table endpoints from the connection string, then you will not be able to access the Queue and Table services from your code by using that connection string.

###Specifying endpoints with a shared access signature 
You can create a connection string with explicit endpoints to access storage resources via a shared access signature. In this case, you can specify the shared access signature for as part of the connection string, rather than the account name and key credentials. The shared access signature token encapsulates information about the resource to be accessed, the period of time for which it is available, and the permissions being granted. For more information about shared access signatures, see [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/en-us/library/ee395415.aspx).

To create a connection string that includes a shared access signature, specify the string in the following format:

`BlobEndpoint=myBlobEndpoint; QueueEndpoint=myQueueEndpoint;TableEndpoint=myTableEndpoint;SharedAccessSignature=base64Signature` 

The endpoint can be either the default service endpoint or a custom endpoint. The `base64Signature` corresponds to the signature portion of a shared access signature. The signature is an HMAC computed over a valid string-to-sign and key using the SHA256 algorithm, that is then Base64-encoded.
