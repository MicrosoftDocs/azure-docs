<properties 
	pageTitle="How to use Blob storage from Node.js | Microsoft Azure" 
	description="Learn how to use the Azure blob service to upload, download, list, and delete blob content. Samples written in Node.js." 
	services="storage" 
	documentationCenter="nodejs" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="mwasson"/>



# How to Use Blob storage from Node.js

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview

This guide will show you how to perform common scenarios using the
Azure Blob service. The samples are written using the
Node.js API. The scenarios covered include **uploading**, **listing**,
**downloading**, and **deleting** blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## Create a Node.js application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## Configure your application to access storage

To use Azure storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure-storage** in the command window, which should
    result in the following output:

        azure-storage@0.1.0 node_modules\azure-storage
		├── extend@1.2.1
		├── xmlbuilder@0.4.3
		├── mime@1.2.11
		├── underscore@1.4.4
		├── validator@3.1.0
		├── node-uuid@1.4.1
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.27.0 (json-stringify-safe@5.0.0, tunnel-agent@0.3.0, aws-sign@0.3.0, forever-agent@0.5.2, qs@0.6.6, oauth-sign@0.3.0, cookie-jar@0.3.0, hawk@1.0.0, form-data@0.1.3, http-signature@0.10.0)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure-storage** package, which contains the libraries you need to access
    storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure-storage');

## Setup an Azure storage connection

The azure module will read the environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING` for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createBlobService**.

For an example of setting the environment variables in the management portal for an Azure Website, see [Node.js Web Application with Storage]

## How to: create a container

The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of **server.js**:

    var blobSvc = azure.createBlobService();

> [AZURE.NOTE] You can access a blob anonymously by using **createBlobServiceAnonymous** and providing the host address. For example, `var blobSvc = azure.createBlobServiceAnonymous('https://myblob.blob.core.windows.net/');`.

All blobs reside in a container. To create a new container, use **createContainerIfNotExists**. The following creates a new container named 'mycontainer'

	blobSvc.createContainerIfNotExists('mycontainer', function(error, result, response){
      if(!error){
        // Container exists and allows 
        // anonymous read access to blob 
        // content and metadata within this container
      }
	});

If the container is created, `result` will be true. If the container already exists, `result` will be false. `response` will contain information about the operation, including the [ETag](http://en.wikipedia.org/wiki/HTTP_ETag) information for the container.

### Container security

By default, new containers are private and cannot be accessed anonymously. To make the container public so that they can be accessed anonymously, you can set the container's access level to **blob** or **container**.

* **blob** - allows anonymous read access to blob content and metadata within this container, but not to container metadata such as listing all blobs within a container. 

* **container** - allows anonymous read access to blob content and metadata as well as container metadata. 

The following example demonstrates setting the access level to **blob**: 

    blobSvc.createContainerIfNotExists('mycontainer', {publicAccessLevel : 'blob'}, function(error, result, response){
      if(!error){
        // Container exists and is private
      }
	});

Alternatively, you can modify the access level of a container by using **setContainerAcl** to specify the access level. The following example changes the access level to container:

    blobSvc.setContainerAcl('mycontainer', null /* signedIdentifiers */, 'container' /* publicAccessLevel*/, function(error, result, response){
	  if(!error){
		// Container access level set to 'container'
	  }
	});

The result will contain information about the operation, including the current **ETag** for the container.

### Filters

Optional filtering operations can be applied to operations performed using **BlobService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback to end the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **BlobService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var blobSvc = azure.createBlobService().withFilter(retryOperations);

## How to: Upload a blob into a container

A blob can be either block, or page based. Block blobs allow you to more efficiently upload large data, while page blobs are optimized for read/write operations. For more information, see [Understanding block blobs and page blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).

### Block blobs

To upload data to a block blob, use the following:

* **createBlockBlobFromLocalFile** - creates a new block blob and uploads the contents of a file.

* **createBlockBlobFromStream** - creates a new block blob and uploads the contents of a stream.

* **createBlockBlobFromText** - creates a new block blob and uploads the contents of a string.

* **createWriteStreamToBlockBlob** - provides a write stream to a block blob.

The following example uploads the contents of the **test.txt** file into **myblob**.

	blobSvc.createBlockBlobFromLocalFile('mycontainer', 'myblob', 'test.txt', function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});

The `result` returned by these methods will contain information on the operation, such as the **ETag** of the blob.

### Page blobs

To upload data to a page blob, use the following:

* **createPageBlob** - creates a new page blob of a specific length.

* **createPageBlobFromLocalFile** - creates a new page blob and uploads the contents of a file.

* **createPageBlobFromStream** - creates a new page blob and uploads the contents of a stream.

* **createWriteStreamToExistingPageBlob** - provides a write stream to an existing page blob.

* **createWriteStreamToNewPageBlob** - creates a new blob and then provides a stream to write to it.

The following example uploads the contents of the **test.txt** file into **mypageblob**.

	blobSvc.createPageBlobFromLocalFile('mycontainer', 'mypageblob', 'test.txt', function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});

> [AZURE.NOTE] Page blobs consist of 512-byte 'pages'. You may receive an error when uploading data with a size that is not a multiple of 512.

## How to: List the blobs in a container

To list the blobs in a container, use the **listBlobsSegmented** method. If you would like to return blobs with a specific prefix, use **listBlobsSegmentedWithPrefix**.

    blobSvc.listBlobsSegmented('mycontainer', null, function(error, result, response){
      if(!error){
        // result contains the entries
	  }
	});

The `result` will contain an `entries` collection, which is an array of objects describing each blob. If all blobs cannot be returned, the `result` will also provide a `continuationToken`, which may be used as the second parameter to retrieve additional entries.

## How to: Download blobs

To download data from a blob, use the following:

* **getBlobToFile** - writes the blob contents to file

* **getBlobToStream** - writes the blob contents to a stream.

* **getBlobToText** - writes the blob contents to a string. 

* **createReadStream** - provides a stream to read from the blob

The following example demonstrates using **getBlobToStream** to download the contents of the **myblob** blob and store it to the **output.txt** file using a stream:

    var fs = require('fs');
	blobSvc.getBlobToStream('mycontainer', 'myblob', fs.createWriteStream('output.txt'), function(error, result, response){
	  if(!error){
	    // blob retrieved
	  }
	});

The `result` will contain information about the blob, including **ETag** information.

## How to: Delete a blob

Finally, to delete a blob, call **deleteBlob**. The following example deletes the blob named **myblob**.

    blobSvc.deleteBlob(containerName, 'myblob', function(error, response){
	  if(!error){
		// Blob has been deleted
	  }
	});

## How to: Concurrent access

To support concurrent access to a blob from multiple clients or multiple process instances, you can use **ETags** or **leases**.

* **Etag** - provides a way to detect that the blob or container has been modified by another process.

* **Lease** - provides a way to obtain exclusive, renewable, write or delete access to a blob for a period of time.

### ETag

ETags should be used if you need to allow multiple clients or instances to write to the blob simultaneously. The ETag allows you to determine if the container or blob has been modified since you initially read or created it, which allows you to avoid overwriting changes committed by another client or process.

ETag conditions can be set using the optional `options.accessConditions` parameter. The following example will only upload the **test.txt** file if the blob already exists and has the ETag value contained by `etagToMatch`.

	blobSvc.createBlockBlobFromLocalFile('mycontainer', 'myblob', 'test.txt', { accessConditions: { 'if-match': etagToMatch} }, function(error, result, response){
      if(!error){
	    // file uploaded
	  }
	});

The general pattern when using ETags is:

1. Obtain the ETag as the result of a create, list, or get operation.

2. Perform an action, checking that the ETag value has not been modified.

If the value has been modified, this indicates that another client or instance has modified the blob or container since you obtained the ETag value.

### Lease

A new lease can be acquired using the **acquireLease** method, specifying the blob or container that you wish to obtain a lease on. For example, the following acquires a lease on **myblob**.

	blobSvc.acquireLease('mycontainer', 'myblob', function(error, result, response){
	  if(!error) {
	    console.log('leaseId: ' + result.id);
	  }
	});

Subsequent operations on **myblob** must provide `options.leaseId` parameter. The lease ID is returned as `result.id` from **acquireLease**.

> [AZURE.NOTE] By default, the lease duration is infinite. You can specify a non-infinite duration (between 15 and 60 seconds,) by providing the `options.leaseDuration` parameter.

To remove a lease, use **releaseLease**. To break a lease, but prevent others from obtaining a new lease until the original duration has expired, use **breakLease**.

## How to: Work with shared access signatures

Shared Access Signatures (SAS) are a secure way to provide granular access to blobs and containers without providing your storage account name or keys. SAS are often used to provide limited access to your data, such as allowing a mobile app to access blobs.

> [AZURE.NOTE] While you can also allow anonymous access to blobs, SAS allows you to provide more controlled access, as you must generate the SAS.

A trusted application such as a cloud-based service generates a SAS using the **generateSharedAccessSignature** of the **BlobService**, and provides it to an untrusted or semi-trusted application. For example, a mobile app. The SAS is generated using a policy, which describes the start and end dates during which the SAS is valid, as well as the access level granted to the SAS holder.

The following example generates a new shared access policy that will allow the SAS holder to perform read operations on the **myblob** blob, and expires 100 minutes after the time it is created.

	var startDate = new Date();
	var expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + 100);
	startDate.setMinutes(startDate.getMinutes() - 100);
	    
	var sharedAccessPolicy = {
	  AccessPolicy: {
	    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
	    Start: startDate,
	    Expiry: expiryDate
	  },
	};
	
	var blobSAS = blobSvc.generateSharedAccessSignature('mycontainer', 'myblob', sharedAccessPolicy);
	var host = blobSvc.host;

Note that the host information must be provided also, as it is required when the SAS holder attempts to access the container.

The client application then uses the SAS with **BlobServiceWithSAS** to perform operations against the blob. The following gets information about **myblob**.

	var sharedBlobSvc = azure.createBlobServiceWithSas(host, blobSAS);
	sharedBlobSvc.getBlobProperties('mycontainer', 'myblob', function (error, result, response) {
	  if(!error) {
	    // retrieved info
	  }
	});

Since the SAS was generated with only read access, if an attempt were made to modify the blob, an error would be returned.

### Access control lists

You can also use an Access Control List (ACL) to set the access policy for a SAS. This is useful if you wish to allow multiple clients to access a container, but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The  following example defines two policies; one for 'user1' and one for 'user2':

	var sharedAccessPolicy = [
	  {
	    AccessPolicy: {
	      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
	      Start: startDate,
	      Expiry: expiryDate
	    },
	    Id: 'user1'
	  },
	  {
	    AccessPolicy: {
	      Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
	      Start: startDate,
	      Expiry: expiryDate
	    },
	    Id: 'user2'
	  }
	];

The following example gets the current ACL for **mycontainer**, then adds the new policies using **setBlobAcl**. This approach allows:

	blobSvc.getBlobAcl('mycontainer', function(error, result, response) {
      if(!error){
		//push the new policy into signedIdentifiers
		result.signedIdentifiers.push(sharedAccessPolicy);
		blobSvc.setBlobAcl('mycontainer', result, function(error, result, response){
	  	  if(!error){
	    	// ACL set
	  	  }
		});
	  }
	});

Once the ACL has been set, you can then create a SAS based on the ID for a policy. The following example creates a new SAS for 'user2':

	blobSAS = blobSvc.generateSharedAccessSignature('mycontainer', { Id: 'user2' });

## Next steps

Now that you've learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   Read the [Azure Storage SDK for Node API Reference][]
-   See the MSDN Reference: [Storing and Accessing Data in Azure][].
-   Visit the [Azure Storage Team Blog][].
-   Visit the [Azure Storage SDK for Node][] repository on GitHub.

[Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node
[Create and deploy a Node.js application to an Azure Web Site]: /develop/nodejs/tutorials/create-a-website-(mac)/
[Node.js Cloud Service with Storage]: storage-nodejs-use-table-storage-cloud-service-app.md
[Node.js Web Application with Storage]: storage-nodejs-use-table-storage-web-site.md
[Web Site with WebMatrix]: web-sites-nodejs-use-webmatrix.md
[using the REST API]: http://msdn.microsoft.com/library/azure/hh264518.aspx
[Azure Management Portal]: http://manage.windowsazure.com
[Node.js Cloud Service]: cloud-services-nodejs-develop-deploy-app.md
[Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Azure Storage SDK for Node API Reference]: http://dl.windowsazure.com/nodestoragedocs/index.html
