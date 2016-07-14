<properties
	pageTitle="How to use blob storage (object storage) from PHP | Microsoft Azure"
	description="Store unstructured data in the cloud with Azure Blob storage (object storage)."
	documentationCenter="php"
	services="storage"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="PHP"
	ms.topic="article"
    	ms.date="06/01/2016"
	ms.author="robmcm"/>

# How to use blob storage from PHP

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]

## Overview

Azure Blob storage is a service that stores unstructured data in the cloud as objects/blobs. Blob storage can store any type of text or binary data, such as a document, media file, or application installer. Blob storage is also referred to as object storage.

This guide shows you how to perform common scenarios using the Azure blob service. The samples are written in PHP and use the [Azure SDK for PHP] [download]. The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs. For more information on blobs, see the [Next steps](#next-steps) section.

[AZURE.INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a PHP application

The only requirement for creating a PHP application that accesses the Azure blob service is the referencing of classes in the Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you use service features, which can be called within a PHP application locally or in code running within an Azure web role, worker role, or website.

## Get the Azure Client Libraries

[AZURE.INCLUDE [get-client-libraries](../../includes/get-client-libraries.md)]

## Configure your application to access the blob service

To use the Azure blob service APIs, you need to:

1. Reference the autoloader file using the [require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the autoloader file and reference the **ServicesBuilder** class.

> [AZURE.NOTE] This example (and other examples in this article) assume you have installed the PHP Client Libraries for Azure via Composer. If you installed the libraries manually, you need to reference the `WindowsAzure.php` autoloader file.

	require_once 'vendor/autoload.php';
	use WindowsAzure\Common\ServicesBuilder;


In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute are referenced.

## Set up an Azure storage connection

To instantiate an Azure blob service client, you must first have a valid connection string. The format for the blob service connection string is:

For accessing a live service:

	DefaultEndpointsProtocol=[http|https];AccountName=[yourAccount];AccountKey=[yourKey]

For accessing the storage emulator:

	UseDevelopmentStorage=true


To create any Azure service client, you need to use the **ServicesBuilder** class. You can:

* Pass the connection string directly to it or
* Use the **CloudConfigurationManager (CCM)** to check multiple external sources for the connection string:
	* By default, it comes with support for one external source - environmental variables.
	* You can add new sources by extending the **ConnectionStringSource** class.

For the examples outlined here, the connection string will be passed directly.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;

	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);

## Create a container

[AZURE.INCLUDE [storage-container-naming-rules-include](../../includes/storage-container-naming-rules-include.md)]

A **BlobRestProxy** object lets you create a blob container with the **createContainer** method. When creating a container, you can set options on the container, but doing so is not required. (The example below shows how to set the container access control list (ACL) and container metadata.)

	require_once 'vendor\autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Blob\Models\CreateContainerOptions;
	use MicrosoftAzure\Storage\Blob\Models\PublicAccessType;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	// OPTIONAL: Set public access policy and metadata.
	// Create container options object.
	$createContainerOptions = new CreateContainerOptions();

	// Set public access policy. Possible values are
	// PublicAccessType::CONTAINER_AND_BLOBS and PublicAccessType::BLOBS_ONLY.
	// CONTAINER_AND_BLOBS:
	// Specifies full public read access for container and blob data.
    // proxys can enumerate blobs within the container via anonymous
	// request, but cannot enumerate containers within the storage account.
	//
	// BLOBS_ONLY:
	// Specifies public read access for blobs. Blob data within this
    // container can be read via anonymous request, but container data is not
    // available. proxys cannot enumerate blobs within the container via
	// anonymous request.
	// If this value is not specified in the request, container data is
	// private to the account owner.
	$createContainerOptions->setPublicAccess(PublicAccessType::CONTAINER_AND_BLOBS);

	// Set container metadata.
	$createContainerOptions->addMetaData("key1", "value1");
	$createContainerOptions->addMetaData("key2", "value2");

	try	{
		// Create container.
		$blobRestProxy->createContainer("mycontainer", $createContainerOptions);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Calling **setPublicAccess(PublicAccessType::CONTAINER\_AND\_BLOBS)** makes the container and blob data accessible via anonymous requests. Calling **setPublicAccess(PublicAccessType::BLOBS_ONLY)** makes only blob data accessible via anonymous requests. For more information about container ACLs, see [Set container ACL (REST API)][container-acl].

For more information about Blob service error codes, see [Blob Service Error Codes][error-codes].

## Upload a blob into a container

To upload a file as a blob, use the **BlobRestProxy->createBlockBlob** method. This operation creates the blob if it doesn't exist, or overwrites it if it does. The code example below assumes that the container has already been created and uses [fopen][fopen] to open the file as a stream.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	$content = fopen("c:\myfile.txt", "r");
	$blob_name = "myblob";

	try	{
		//Upload blob
		$blobRestProxy->createBlockBlob("mycontainer", $blob_name, $content);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note that the previous sample uploads a blob as a stream. However, a blob can also be uploaded as a string using, for example, the [file\_get\_contents][file_get_contents] function. To do this using the previous sample, change `$content = fopen("c:\myfile.txt", "r");` to `$content = file_get_contents("c:\myfile.txt");`.

## List the blobs in a container

To list the blobs in a container, use the **BlobRestProxy->listBlobs** method with a **foreach** loop to loop through the result. The following code displays the name of each blob as output in a container and displays its URI to the browser.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	try	{
		// List blobs.
		$blob_list = $blobRestProxy->listBlobs("mycontainer");
		$blobs = $blob_list->getBlobs();

		foreach($blobs as $blob)
		{
			echo $blob->getName().": ".$blob->getUrl()."<br />";
		}
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


## Download a blob

To download a blob, call the **BlobRestProxy->getBlob** method, then call the **getContentStream** method on the resulting **GetBlobResult** object.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	try	{
		// Get blob.
		$blob = $blobRestProxy->getBlob("mycontainer", "myblob");
		fpassthru($blob->getContentStream());
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note that the example above gets a blob as a stream resource (the default behavior). However, you can use the [stream\_get\_contents][stream-get-contents] function to convert the returned stream to a string.

## Delete a blob

To delete a blob, pass the container name and blob name to **BlobRestProxy->deleteBlob**.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	try	{
		// Delete blob.
		$blobRestProxy->deleteBlob("mycontainer", "myblob");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## Delete a blob container

Finally, to delete a blob container, pass the container name to **BlobRestProxy->deleteContainer**.

	require_once 'vendor/autoload.php';

	use WindowsAzure\Common\ServicesBuilder;
	use MicrosoftAzure\Storage\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = ServicesBuilder::getInstance()->createBlobService($connectionString);


	try	{
		// Delete container.
		$blobRestProxy->deleteContainer("mycontainer");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/library/azure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

## Next steps

Now that you've learned the basics of the Azure blob service, follow these links to learn about more complex storage tasks.

- Visit the [Azure Storage team blog](http://blogs.msdn.com/b/windowsazurestorage/)
- See the [PHP block blob example](https://github.com/WindowsAzure/azure-sdk-for-php-samples/blob/master/storage/BlockBlobExample.php).
- See the [PHP page blob example](https://github.com/WindowsAzure/azure-sdk-for-php-samples/blob/master/storage/PageBlobExample.php).
- [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)
 
For more information, see also the [PHP Developer Center](/develop/php/).


[download]: http://go.microsoft.com/fwlink/?LinkID=252473
[container-acl]: http://msdn.microsoft.com/library/azure/dd179391.aspx
[error-codes]: http://msdn.microsoft.com/library/azure/dd179439.aspx
[file_get_contents]: http://php.net/file_get_contents
[require_once]: http://php.net/require_once
[fopen]: http://www.php.net/fopen
[stream-get-contents]: http://www.php.net/stream_get_contents
