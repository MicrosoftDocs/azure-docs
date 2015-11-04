<properties
	pageTitle="How to use Blob storage from Node.js | Microsoft Azure"
	description="Learn how to use the Azure Blob service to upload, download, list, and delete blob content. Samples are written in Node.js."
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
	ms.date="09/01/2015"
	ms.author="mwasson"/>



# How to use Blob storage from Node.js

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]

## Overview

This article shows you how to perform common scenarios using the Azure Blob service. The samples are written via the Node.js API. The scenarios covered include how to upload, list, download, and delete blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a Node.js application

For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure website], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or [Web app with WebMatrix].

## Configure your application to access storage

To use Azure storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix), to navigate to the folder where you created your sample application.

2.  Type **npm install azure-storage** in the command window. Output from the command is similar to the following code example.

		azure-storage@0.5.0 node_modules\azure-storage
		+-- extend@1.2.1
		+-- xmlbuilder@0.4.3
		+-- mime@1.2.11
		+-- node-uuid@1.4.3
		+-- validator@3.22.2
		+-- underscore@1.4.4
		+-- readable-stream@1.0.33 (string_decoder@0.10.31, isarray@0.0.1, inherits@2.0.1, core-util-is@1.0.1)
		+-- xml2js@0.2.7 (sax@0.5.2)
		+-- request@2.57.0 (caseless@0.10.0, aws-sign2@0.5.0, forever-agent@0.6.1, stringstream@0.0.4, oauth-sign@0.8.0, tunnel-agent@0.4.1, isstream@0.1.2, json-stringify-safe@5.0.1, bl@0.9.4, combined-stream@1.0.5, qs@3.1.0, mime-types@2.0.14, form-data@0.2.0, http-signature@0.11.0, tough-cookie@2.0.0, hawk@2.3.1, har-validator@1.8.0)

3.  You can manually run the **ls** command to verify that a **node\_modules** folder was created. Inside that folder, find the **azure-storage** package, which contains the libraries that you need to access storage.

### Import the package

Using Notepad or another text editor, add the following to the top of the **server.js** file of the application where you intend to use storage:

    var azure = require('azure-storage');

## Set up an Azure Storage connection

The Azure module will read the environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING`, for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createBlobService**.

For an example of setting the environment variables in the Azure portal for an Azure web app, see [Node.js Web Application with Storage]

## Create a container

The **BlobService** object lets you work with containers and blobs. The following code creates a **BlobService** object. Add the following near the top of **server.js**:

    var blobSvc = azure.createBlobService();

> [AZURE.NOTE] You can access a blob anonymously by using **createBlobServiceAnonymous** and providing the host address. For example, use `var blobSvc = azure.createBlobServiceAnonymous('https://myblob.blob.core.windows.net/');`.

[AZURE.INCLUDE [storage-container-naming-rules-include](../../includes/storage-container-naming-rules-include.md)]

To create a new container, use **createContainerIfNotExists**. The following code example creates a new container named 'mycontainer':

	blobSvc.createContainerIfNotExists('mycontainer', function(error, result, response){
      if(!error){
        // Container exists and allows
        // anonymous read access to blob
        // content and metadata within this container
      }
	});

If the container is newly created, `result` is true. If the container already exists, `result` is false. `response` contains information about the operation, including the [ETag](http://en.wikipedia.org/wiki/HTTP_ETag) information for the container.

### Container security

By default, new containers are private and cannot be accessed anonymously. To make the container public so that you can access it anonymously, you can set the container's access level to **blob** or **container**.

* **blob** - allows anonymous read access to blob content and metadata within this container, but not to container metadata such as listing all blobs within a container

* **container** - allows anonymous read access to blob content and metadata as well as container metadata

The following code example demonstrates setting the access level to **blob**:

    blobSvc.createContainerIfNotExists('mycontainer', {publicAccessLevel : 'blob'}, function(error, result, response){
      if(!error){
        // Container exists and is private
      }
	});

Alternatively, you can modify the access level of a container by using **setContainerAcl** to specify the access level. The following code example changes the access level to container:

    blobSvc.setContainerAcl('mycontainer', null /* signedIdentifiers */, 'container' /* publicAccessLevel*/, function(error, result, response){
	  if(!error){
		// Container access level set to 'container'
	  }
	});

The result contains information about the operation, including the current **ETag** for the container.

### Filters

You can apply optional filtering operations to operations performed using **BlobService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next", passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback to end the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **BlobService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var blobSvc = azure.createBlobService().withFilter(retryOperations);

## Upload a blob into a container

A blob can be either block-based or page-based. Block blobs allow you to more efficiently upload large data, while page blobs are optimized for read/write operations. For more information, see [Understanding block blobs and page blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).

### Block blobs

To upload data to a block blob, use the following:

* **createBlockBlobFromLocalFile** - creates a new block blob and uploads the contents of a file

* **createBlockBlobFromStream** - creates a new block blob and uploads the contents of a stream

* **createBlockBlobFromText** - creates a new block blob and uploads the contents of a string

* **createWriteStreamToBlockBlob** - provides a write stream to a block blob

The following code example uploads the contents of the **test.txt** file into **myblob**.

	blobSvc.createBlockBlobFromLocalFile('mycontainer', 'myblob', 'test.txt', function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});

The `result` returned by these methods contains information on the operation, such as the **ETag** of the blob.

### Page blobs

To upload data to a page blob, use the following:

* **createPageBlob** - creates a new page blob of a specific length

* **createPageBlobFromLocalFile** - creates a new page blob and uploads the contents of a file

* **createPageBlobFromStream** - creates a new page blob and uploads the contents of a stream

* **createWriteStreamToExistingPageBlob** - provides a write stream to an existing page blob

* **createWriteStreamToNewPageBlob** - creates a new blob and then provides a stream to write to it

The following code example uploads the contents of the **test.txt** file into **mypageblob**.

	blobSvc.createPageBlobFromLocalFile('mycontainer', 'mypageblob', 'test.txt', function(error, result, response){
	  if(!error){
	    // file uploaded
	  }
	});

> [AZURE.NOTE] Page blobs consist of 512-byte 'pages'. You may receive an error when uploading data with a size that is not a multiple of 512.

## List the blobs in a container

To list the blobs in a container, use the **listBlobsSegmented** method. If you'd like to return blobs with a specific prefix, use **listBlobsSegmentedWithPrefix**.

    blobSvc.listBlobsSegmented('mycontainer', null, function(error, result, response){
      if(!error){
        // result.entries contains the entries
        // If not all blobs were returned, result.continuationToken has the continuation token.
	  }
	});

The `result` contains an `entries` collection, which is an array of objects that describe each blob. If all blobs cannot be returned, the `result` also provides a `continuationToken`, which you may use as the second parameter to retrieve additional entries.

## Download blobs

To download data from a blob, use the following:

* **getBlobToLocalFile** - writes the blob contents to file

* **getBlobToStream** - writes the blob contents to a stream

* **getBlobToText** - writes the blob contents to a string

* **createReadStream** - provides a stream to read from the blob

The following code example demonstrates using **getBlobToStream** to download the contents of the **myblob** blob and store it to the **output.txt** file by using a stream:

    var fs = require('fs');
	blobSvc.getBlobToStream('mycontainer', 'myblob', fs.createWriteStream('output.txt'), function(error, result, response){
	  if(!error){
	    // blob retrieved
	  }
	});

The `result` contains information about the blob, including **ETag** information.

## Delete a blob

Finally, to delete a blob, call **deleteBlob**. The following code example deletes the blob named **myblob**.

    blobSvc.deleteBlob(containerName, 'myblob', function(error, response){
	  if(!error){
		// Blob has been deleted
	  }
	});

## Concurrent access

To support concurrent access to a blob from multiple clients or multiple process instances, you can use **ETags** or **leases**.

* **Etag** - provides a way to detect that the blob or container has been modified by another process

* **Lease** - provides a way to obtain exclusive, renewable, write or delete access to a blob for a period of time

### ETag

Use ETags if you need to allow multiple clients or instances to write to the blob simultaneously. The ETag allows you to determine if the container or blob was modified since you initially read or created it, which allows you to avoid overwriting changes committed by another client or process.

You can set ETag conditions by using the optional `options.accessConditions` parameter. The following code example only uploads the **test.txt** file if the blob already exists and has the ETag value contained by `etagToMatch`.

	blobSvc.createBlockBlobFromLocalFile('mycontainer', 'myblob', 'test.txt', { accessConditions: { 'if-match': etagToMatch} }, function(error, result, response){
      if(!error){
	    // file uploaded
	  }
	});

When you're using ETags, the general pattern is:

1. Obtain the ETag as the result of a create, list, or get operation.

2. Perform an action, checking that the ETag value has not been modified.

If the value was modified, this indicates that another client or instance modified the blob or container since you obtained the ETag value.

### Lease

You can acquire a new lease by using the **acquireLease** method, specifying the blob or container that you wish to obtain a lease on. For example, the following code acquires a lease on **myblob**.

	blobSvc.acquireLease('mycontainer', 'myblob', function(error, result, response){
	  if(!error) {
	    console.log('leaseId: ' + result.id);
	  }
	});

Subsequent operations on **myblob** must provide the `options.leaseId` parameter. The lease ID is returned as `result.id` from **acquireLease**.

> [AZURE.NOTE] By default, the lease duration is infinite. You can specify a non-infinite duration (between 15 and 60 seconds) by providing the `options.leaseDuration` parameter.

To remove a lease, use **releaseLease**. To break a lease, but prevent others from obtaining a new lease until the original duration has expired, use **breakLease**.

## Work with shared access signatures

Shared access signatures (SAS) are a secure way to provide granular access to blobs and containers without providing your storage account name or keys. Shared access signatures are often used to provide limited access to your data, such as allowing a mobile app to access blobs.

> [AZURE.NOTE] While you can also allow anonymous access to blobs, shared access signatures allow you to provide more controlled access, as you must generate the SAS.

A trusted application such as a cloud-based service generates shared access signatures using the **generateSharedAccessSignature** of the **BlobService**, and provides it to an untrusted or semi-trusted application such as a mobile app. Shared access signatures are generated using a policy, which describes the start and end dates during which the shared access signatures are valid, as well as the access level granted to the shared access signatures holder.

The following code example generates a new shared access policy that allows the shared access signatures holder to perform read operations on the **myblob** blob, and expires 100 minutes after the time it is created.

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

Note that the host information must be provided also, as it is required when the shared access signatures holder attempts to access the container.

The client application then uses shared access signatures with **BlobServiceWithSAS** to perform operations against the blob. The following gets information about **myblob**.

	var sharedBlobSvc = azure.createBlobServiceWithSas(host, blobSAS);
	sharedBlobSvc.getBlobProperties('mycontainer', 'myblob', function (error, result, response) {
	  if(!error) {
	    // retrieved info
	  }
	});

Since the shared access signatures were generated with read-only access, if an attempt is made to modify the blob, an error will be returned.

### Access control lists

You can also use an access control list (ACL) to set the access policy for SAS. This is useful if you wish to allow multiple clients to access a container but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The following code example defines two policies, one for 'user1' and one for 'user2':

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

The following code example gets the current ACL for **mycontainer**, and then adds the new policies using **setBlobAcl**. This approach allows:

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

Once the ACL is set, you can then create shared access signatures based on the ID for a policy. The following code example creates new shared access signatures for 'user2':

	blobSAS = blobSvc.generateSharedAccessSignature('mycontainer', { Id: 'user2' });

## Next steps

For more information, see the following resources.

-   [Azure Storage SDK for Node API Reference][]
-   MSDN Reference: [Storing and accessing data in Azure][]
-   [Azure Storage Team Blog][]
-   [Azure Storage SDK for Node][] repository on GitHub
-   [Node.js Developer Center](/develop/nodejs/)

[Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node
[Create and deploy a Node.js application to an Azure Web Site]: /develop/nodejs/tutorials/create-a-website-(mac)/
[Node.js Cloud Service with Storage]: ../storage-nodejs-use-table-storage-cloud-service-app.md
[Node.js Web Application with Storage]: ../storage-nodejs-use-table-storage-web-site.md
[Web app with WebMatrix]: ../web-sites-nodejs-use-webmatrix.md
[Using the REST API]: http://msdn.microsoft.com/library/azure/hh264518.aspx
[Azure portal]: http://manage.windowsazure.com
[Node.js Cloud Service]: ../cloud-services-nodejs-develop-deploy-app.md
[Storing and accessing data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Azure Storage SDK for Node API Reference]: http://dl.windowsazure.com/nodestoragedocs/index.html
