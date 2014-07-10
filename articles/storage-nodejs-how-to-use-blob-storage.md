<properties linkid="dev-nodejs-how-to-blob-storage" urlDisplayName="Blob Service" pageTitle="How to use blob storage (Node.js) | Microsoft Azure" metaKeywords="Get started Azure blob, Azure unstructured data, Azure unstructured storage, Azure blob, Azure blob storage, Azure blob Node.js" description="Learn how to use the Azure blob service to upload, download, list, and delete blob content. Samples written in Node.js." metaCanonical="" services="storage" documentationCenter="Node.js" title="How to Use the Blob Service from Node.js" authors="larryfr" solutions="" manager="" editor="" />





# How to Use the Blob Service from Node.js

This guide will show you how to perform common scenarios using the
Azure Blob service. The samples are written using the
Node.js API. The scenarios covered include **uploading**, **listing**,
**downloading**, and **deleting** blobs. For more information on blobs,
see the [Next Steps][] section.

## Table of Contents

* [What is the Blob Service?][]    
* [Concepts][]    
* [Create an Azure Storage Account][]   
* [Create a Node.js Application][]   
* [Configure your Application to Access Storage][]   
* [Setup an Azure Storage Connection String][]   
* [How To: Create a Container][]   
* [How To: Upload a Blob into a Container][]   
* [How To: List the Blobs in a Container][]   
* [How To: Download Blobs][]   
* [How To: Delete a Blob][]   
* [Next Steps][]

[WACOM.INCLUDE [howto-blob-storage](../includes/howto-blob-storage.md)]

##<a name="create-account"></a><span  class="short-header">Create an account</span>Create an Azure Storage account
[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <a name="create-app"> </a>Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.7.5 node_modules\azure
		├── dateformat@1.0.2-1.2.3
		├── xmlbuilder@0.4.2
		├── node-uuid@1.2.0
		├── mime@1.2.9
		├── underscore@1.4.4
		├── validator@1.1.1
		├── tunnel@0.0.2
		├── wns@0.5.3
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.21.0 (json-stringify-safe@4.0.0, forever-agent@0.5.0, aws-sign@0.3.0, tunnel-agent@0.3.0, oauth-sign@0.3.0, qs@0.6.5, cookie-jar@0.3.0, node-uuid@1.4.0, http-signature@0.9.11, form-data@0.0.8, hawk@0.13.1)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup an Azure Storage Connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createBlobService**.

For an example of setting the environment variables in a configuration file for an Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for an Azure Web Site, see [Node.js Web Application with Storage]

## <a name="create-container"> </a>How to: Create a Container

The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of **server.js**:

    var blobService = azure.createBlobService();

All blobs reside in a container. The call to
**createContainerIfNotExists** on the **BlobService** object will return
the specified container if it exists or create a new container with the
specified name if it does not already exist. By default, the new
container is private and requires the use of the access key to download blobs from this container.

	blobService.createContainerIfNotExists(containerName, function(error){
    	if(!error){
        	// Container exists and is private
    	}
	});


If you want to make the files in the container public so that they can be accessed without requiring the access key, you can set the
container's access level to **blob** or **container**. Setting the access level to **blob** allows anonymous read access to blob content and metadata within this container, but not to container metadata such as listing all blobs within a container. Setting the access level to **container** allows anonymous read access to blob content and metadata as well as container metadata. The following example demonstrates setting the access level to **blob**: 

    blobService.createContainerIfNotExists(containerName
		, {publicAccessLevel : 'blob'}
		, function(error){
			if(!error){
				// Container exists and is public
			}
		});

Alternatively, you can modify the access level of a container by using **setContainerAcl** to specify the access level. The following example changes the access level to container:

    blobService.setContainerAcl(containerName
		, 'container'
		, function(error){
			if(!error){
				// Container access level set to 'container'
			}
		});

###Filters

Optional filtering operations can be applied to operations performed using **BlobService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **BlobService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var blobService = azure.createBlobService().withFilter(retryOperations);

## <a name="upload-blob"> </a>How to: Upload a Blob into a Container

To upload data to a blob, use the **createBlockBlobFromLocalFile**, **createBlockBlobFromStream** or **createBlockBlobFromText** methods. **createBlockBlobFromLocalFile** uploads the contents of a file, while **createBlockBlobFromStream** uploads the contents of a stream.  **createBlockBlobFromText** uploads the specified text value.

The following example uploads the contents of the **test1.txt** file into the 'test1' blob.

	blobService.createBlockBlobFromLocalFile(containerName
		, 'test1'
		, 'test1.txt'
		, function(error){
			if(!error){
				// File has been uploaded
			}
		});

## <a name="list-blob"> </a>How to: List the Blobs in a Container

To list the blobs in a container, use the **listBlobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** of each blob in a container to the
console.

    blobService.listBlobs(containerName, function(error, blobs){
		if(!error){
			for(var index in blobs){
				console.log(blobs[index].name);
			}
		}
	});

## <a name="download-blobs"> </a>How to: Download Blobs

To download data from a blob, use **getBlobToFile**, **getBlobToStream**, or **getBlobToText**. The following example demonstrates using **getBlobToStream** to download the contents of the **test1** blob and store it to the **output.txt** file using a stream:

    var fs=require('fs');
	blobService.getBlobToStream(containerName
		, 'test1'
		, fs.createWriteStream('output.txt')
		, function(error){
			if(!error){
				// Wrote blob to stream
			}
		});

## <a name="delete-blobs"> </a>How to: Delete a Blob

Finally, to delete a blob, call **deleteBlob**. The following example deletes the blob named 'blob1'.

    blobService.deleteBlob(containerName
		, 'blob1'
		, function(error){
			if(!error){
				// Blob has been deleted
			}
		});

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][].
-   Visit the [Azure Storage Team Blog][].
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #next-steps
  [What is the Blob Service?]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup an Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Container]: #create-container
  [How To: Upload a Blob into a Container]: #upload-blob
  [How To: List the Blobs in a Container]: #list-blob
  [How To: Download Blobs]: #download-blobs
  [How To: Delete a Blob]: #delete-blobs
[Create and deploy a Node.js application to an Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/documentation/articles/storage-nodejs-use-table-storage-cloud-service-app/
  [Node.js Web Application with Storage]: /en-us/documentation/articles/storage-nodejs-use-table-storage-web-site/
 [Web Site with WebMatrix]: /en-us/documentation/articles/web-sites-nodejs-use-webmatrix/
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Azure Management Portal]: http://manage.windowsazure.com
  [Node.js Cloud Service]: /en-us/documentation/articles/cloud-services-nodejs-develop-deploy-app/
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
