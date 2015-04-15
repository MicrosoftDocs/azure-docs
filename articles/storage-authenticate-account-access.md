<properties 
    pageTitle="Authenticating Access to Your Azure Storage Account with .NET | Microsoft Azure" 
    description="Authenticate access to your Azure Storage account using the .NET client library." 
    services="storage" 
    documentationCenter=".net" 
    authors="tamram" 
    manager="adinah" 
    editor=""/>

<tags 
    ms.service="storage" 
    ms.workload="storage" 
    ms.tgt_pltfrm="na" 
    ms.devlang="dotnet" 
    ms.topic="article" 
    ms.date="04/15/2015" 
    ms.author="tamram"/>

# Authenticating Access to Your Azure Storage Account with .NET

## Overview

Every request you make to the Azure storage services must be authenticated, unless it is an anonymous request against a public container or its blobs. The Azure client library simplifies this authentication process for you. There are two ways to authenticate a request against the storage services:

- By using the Shared Key or Shared Key Lite authentication schemes for resources in the Blob, Queue, Table, and File services. These authentication schemes use an HMAC computed with the SHA-256 algorithm and encoded as Base64. The HMAC is constructed from a set of fields related to the request. For details on the protocol, see [Authentication for the Azure Storage Services](https://msdn.microsoft.com/en-us/library/azure/dd179428.aspx).

- By creating a shared access signature. A shared access signature incorporates the credentials required for authentication on the URI in a secure fashion, together with the address of the resource being accessed. Because the shared access signature includes all data necessary for authentication on the URI, it can be used to grant controlled access to a resource in the Blob, Queue, or Table service, and can be distributed apart from your code. For details on the protocol, see [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/ee395415.aspx).

## Options for Authenticating Access

The Azure .NET managed library provides a few key classes for authenticating access to your storage account:

- The [CloudStorageAccount](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.aspx) class represents your Azure storage account.
- The [StorageCredentials](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.auth.storagecredentials.aspx) class stores two different types of credentials that may be used to authenticate a request: a storage account name and access key, which can be used for authenticating requests via the Shared Key and Shared Key Lite authentication schemes, or a shared access signature. 
- The [CloudBlobClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.blob.cloudblobclient.aspx), [CloudQueueClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.queue.cloudqueueclient.aspx), and [CloudTableClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.table.cloudtableclient.aspx) classes provide a point of entry to the resource hierarchy for the Blob service, Queue service, and Table service, respectively. In other words, to work with containers and blobs, you will create a **CloudBlobClient** object; to work with queues and messages, a **CloudQueueClient**; and to work with tables and entities, a **CloudTableClient**. The client object can be created directly, by providing the service endpoint and a set of credentials, or it can be created from a **CloudStorageAccount** object by calling one of the [CreateCloudBlobClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.createcloudblobclient.aspx), [CreateCloudQueueClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.createcloudqueueclient.aspx), or [CreateCloudTableClient](https://msdn.microsoft.com/en-us/library/azure/microsoft.windowsazure.storage.cloudstorageaccount.createcloudtableclient.aspx) methods. These methods permit you to return a client object for one or more services from a **CloudStorageAccount** object defined with a single set of credentials.
> [AZURE.NOTE] that to access a container or blob anonymously, you do not need to create a **CloudStorageAccount** or a client object. Authentication is not required for anonymous access, so you can access the resource directly. Only certain read operations (using HTTP GET) are supported via anonymous access.

### Accessing the Storage Emulator

This property is useful when you are writing code that will only use the storage emulator, but if you will want to point your code to an Azure storage account when you have finished testing against the storage emulator, you may want to use a connection string. You can quickly modify the connection string to switch between storage accounts without modifying your code; see [Configuring Connection Strings](https://msdn.microsoft.com/en-us/library/azure/ee758697.aspx) for more information.

### Accessing an Azure Storage Account Using the Default Endpoints

The simplest way to access an Azure storage account from your code is to create a new **CloudStorageAccount** object by providing your storage account name and access key in the form of a **StorageCredentials** object, and indicating whether to access the account using HTTP or HTTPS. Requests made via this **CloudStorageAccount** or one of its derived objects will use these credentials for authentication.

This **CloudStorageAccount** object uses the default endpoints for the storage services. The default service endpoints are `myaccount.blob.core.windows.net`, `myaccount.queue.core.windows.net`, and `myaccount.table.core.windows.net`, where `myaccount` is the name of your storage account.

The following code example shows how to create a new **CloudStorageAccount** object using a reference to your account name and access key. It then creates a new **CloudBlobClient** object, followed by a new container:

	//Account name and key. Modify for your account.
	string accountName = "myaccount";
	string accountKey = "nYS0gln9fA7bvY+rwu2iWADyzSNITGkhM88J8HUoyofpK7C8fHcZc2kIZp6cKgYJUM74rHI82L50Iau4+9hPjQ==";
	
	//Get a reference to the storage account, with authentication credentials.
	CloudStorageAccount storageAccount = new CloudStorageAccount(new StorageCredentials(accountName, accountKey), true);
	
	//Create a new client object.
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
	
	// Retrieve a reference to a container. 
	CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");
	
	// Create the container if it does not already exist.
	container.CreateIfNotExists();
	
	// Output container URI to debug window.
	Console.WriteLine(container.Uri);  
### Accessing an Azure Storage Account Using Explicit Endpoints

You can also access a storage account by explicitly specifying the service endpoints. This approach is useful in two scenarios:

- When you are accessing a storage account via a shared access signature.

- When you have configured a custom domain for your storage account and wish to use those custom endpoints to access the account. Note that the default endpoints continue to be available in addition to your custom endpoints.

#### Creating and Using a Shared Access Signature

A shared access signature is a means to provide controlled access to resources in your storage account to other clients. The shared access signature incorporates information about the resource to be accessed, the permissions to be granted, the interval for which the resource is to be available, and the access policy on the container, if one exists. For the purposes of authentication, this information is encapsulated in a string-to-sign that's encoded as UTF-8, and a signature is then constructed using the HMAC-SHA256 algorithm. The signature forms part of a token that clients can use to access your resource. For example, a client can use a shared access signature to create or delete a blob in your storage account, operations they would not have access to if the container were only marked as public. For more information on shared access signatures, see [Shared Access Signatures, Part 1: Understanding the SAS Model](http://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/) and [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/en-us/library/azure/ee395415.aspx).

## See Also

**Other Resources**  
[Getting Started with Blob Storage](http://www.windowsazure.com/develop/net/how-to-guides/blob-storage/)   
 [Getting Started with Queue Storage](http://www.windowsazure.com/develop/net/how-to-guides/queue-service/)   
 [Getting Started with File Storage](http://azure.microsoft.com/documentation/articles/storage-dotnet-how-to-use-files/)