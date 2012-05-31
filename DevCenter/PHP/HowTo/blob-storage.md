<properties umbracoNaviHide="0" pageTitle="How to Use the Blob Service from PHP" metaKeywords="Windows Azure, Blob Service, Blob Storage, PHP" metaDescription="Learn how to use the Windows Azure Blob Service from PHP applications." linkid="dev-php-howto-blob-service" urlDisplayName="How to Use the Blob Service from PHP" headerExpose="" footerExpose="" disqusComments="1" />

#How to use the Blob service from PHP

This guide will show you how to perform common scenarios using the Windows Azure Blob service. The samples are written in PHP and use the [Windows Azure SDK for PHP] [download]. The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs. For more information on blobs, see the [Next Steps](#NextSteps) section.

##Table of Contents

* [What is Blob Storage](#what-is)
* [Concepts](#concepts)
* [Create a Windows Azure storage account](#CreateAccount)
* [Create a PHP application](#CreateApplication)
* [Configure your application to access the Blob Service](#ConfigureStorage)
* [Setup a Windows Azure storage connection](#ConnectionString)
* [How to: Create a container](#CreateContainer)
* [How to: Upload a Blob into a Container](#UploadBlob)
* [How to: List the Blobs in a container](#ListBlobs)
* [How to: Download a Blob](#DownloadBlob)
* [How to: Delete a Blob](#DeleteBlob)
* [How to: Delete a Blob container](#DeleteContainer)
* [Next steps](#NextSteps)

<div chunk="../../Shared/Chunks/howto-blob-storage.md" />

<h2 id="CreateAccount">Create a Windows Azure storage account</h2>

<div chunk="../../Shared/Chunks/create-storage-account.md" />

<h2 id="CreateApplication">Create a PHP application</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Blob service is the referencing of classes in the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use service features which can be called within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download], and have created a Windows Azure storage account in your Windows Azure subscription.

<h2 id="ConfigureStorage">Configure your application to access the Blob service</h2>

To use the Windows Azure Blob service APIs, you need to:

1. Reference the `WindowsAzure.php` file (from the Windows Azure SDK for PHP) using the [require_once][require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `WindowsAzure.php` file and reference the **BlobService** class:

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;


In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="ConnectionString">Setup a Windows Azure storage connection</h2>

A Windows Azure Blob service client uses a **Configuration** object for storing connection string information. After creating a new **Configuration** object, you must set properties for the name of your storage account, the access key, and the blob URI for the storage account listed in the Management Portal. This example shows how you can create a new configuration object and set these properties:

	require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Blob\BlobSettings;
	
	$config = new Configuration();
	$config->setProperty(BlobSettings::ACCOUNT_NAME, "your_storage_account_name");
	$config->setProperty(BlobSettings::ACCOUNT_KEY, "your_storage_account_key");
	$config->setProperty(BlobSettings::URI, "http://your_storage_account_name.blob.core.windows.net");

You will pass this `Configuration` instance (`$config`) to other objects when using the Blob API.

<h2 id="CreateContainer">How to: Create a container</h2>

A **BlobRestProxy** object lets you create a blob container with the **createContainer** method. When creating a container, you can set options on the container, but doing so is not required. (The example below shows how to set the container ACL and container metadata.)

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Blob\Models\CreateContainerOptions;
	use WindowsAzure\Blob\Models\PublicAccessType;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);

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
	
	// Set container metadata
	$createContainerOptions->addMetaData("key1", "value1");
	$createContainerOptions->addMetaData("key2", "value2");
	
	try	{
		// Create container.
		$blobRestProxy->createContainer("mycontainer", $createContainerOptions);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Calling **setPublicAccess(PublicAccessType::CONTAINER\_AND\_BLOBS)** makes the container and blob data accessible via anonymous requests. Calling **setPublicAccess(PublicAccessType::BLOBS_ONLY)** makes only blob data accessible via anonymous requests. For more information about container ACLs, see [Set Container ACL (REST API)][container-acl].

For more information about Blob service error codes, see [Blob Service Error Codes][error-codes].

<h2 id="UploadBlob">How to: Upload a Blob into a container</h2>

To upload a file as a blob, use the **BlobRestProxy->createBlockBlob** method. This operation will create the blob if it doesn’t exist, or overwrite it if it does. The code example below assumes that the container has already been created and uses [fopen][fopen] to open the file as a stream.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);
	
	$content = fopen("c:\myfile.txt", "r");
	$blob_name = "myblob";
	
	try	{
		//Upload blob
		$blobRestProxy->createBlockBlob("mycontainer", $blob_name, $content);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note that the example above uploads a blob as a stream. However, a blob can also be uploaded as a string using, for example, the [file\_get\_contents][file_get_contents] function. To do this, change `$content = fopen("c:\myfile.txt", "r");` in the example above to `$content = file_get_contents("c:\myfile.txt");`.

<h2 id="ListBlobs">How to: List the Blobs in a container</h2>

To list the blobs in a container, use the **BlobRestProxy->listBlobs** method with a **foreach** loop to loop through the result. The following code outputs the name of each blob in a container and its URI to the browser.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);
	
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
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}


<h2 id="DownloadBlob">How to: download a Blob</h2>

To download a blob, call the **BlobRestProxy->getBlob** method, then call the **getContentStream** method on the resulting **GetBlobResult** object.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);
	
	try	{
		// Get blob.
		$blob = $blobRestProxy->getBlob("mycontainer", "myblob");
		fpassthru($blob->getContentStream());
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Note that the example above gets a blob as a stream resource (the default behavior). However, you can use the [stream\_get\_contents][stream-get-contents] function to convert the returned stream to a string.

<h2 id="DeleteBlob">How to: Delete a Blob</h2>

To delete a blob, pass the container name and blob name to **BlobRestProxy->deleteBlob**. 

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);
	
	try	{
		// Delete container.
		$blobRestProxy->deleteBlob("mycontainer", "myblob");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="DeleteContainer">How to: Delete a Blob container</h2>

Finally, to delete a blob container, pass the container name to **BlobRestProxy->deleteContainer**.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Blob\BlobService;
	use WindowsAzure\Common\ServiceException;

	// Create blob REST proxy.
	$blobRestProxy = BlobService::create($config);
	
	try	{
		// Delete container.
		$blobRestProxy->deleteContainer("mycontainer");
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="NextSteps">Next steps</h2>

Now that you’ve learned the basics of the Windows Azure Blob service, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://go.microsoft.com/fwlink/?LinkID=252473
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
[container-acl]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx
[error-codes]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
[file_get_contents]: http://php.net/file_get_contents
[require_once]: http://php.net/require_once
[fopen]: http://www.php.net/fopen
[stream-get-contents]: http://www.php.net/stream_get_contents