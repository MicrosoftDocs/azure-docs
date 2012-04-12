# How to Use the Blob Storage Service from PHP

This guide will show you how to perform common scenarios using the Windows Azure Blob storage service. The samples are written in PHP and use the [Windows Azure SDK for PHP] [download]. The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs. For more information on blobs, see the [Next Steps](#NextSteps) section.

##What is Blob Storage

	(TODO: Reference reusable "chunk".)

##Table of Contents

* [Concepts](#Concepts)
* [Create a Windows Azure Storage Account](#CreateAccount)
* [Create a Java Application](#CreateApplication)
* [Configure your Application to Access Blob Storage](#ConfigureStorage)
* [Setup a Windows Azure Storage Connect String](#ConnectionString)
* [How to Create a Container](#CreateContainer)
* [How to Upload a Blob into a Container](#UploadBlob)
* [How to List the Blobs in a Container](#ListBlobs)
* [How to Download Blobs](#DownloadBlob)
* [How to Delete a Blob](#DeleteBlob)
* [How to Delete a Blob Container](#DeleteContainer)
* [Next Steps](#NextSteps)

<h2 id="Concepts">Concepts</h2>

	(TODO: Reference reusable "chunk".)

<h2 id="CreateAccount">Create a Windows Azure Storage Account</h2>

	(TODO: Reference reusable "chunk".)

<h2 id="CreateApplication">Create a PHP Application</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Blob storage service is the referencing of classes in the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use storage features which can be run within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download], and have created a Windows Azure storage account in your Windows Azure subscription.

<h2 id="ConfigureStorage">Configure your Application to Access Blob Storage</h2>

To use the Windows Azure storage APIs to access blobs, you need to:

1. Reference the `Autoload.php` file (from the Windows Azure SDK for PHP) using the [require_once] [require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `Autoload.php` file and references some of the classes you might use with the Blob API:

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobSettings;
	use PEAR2\WindowsAzure\Services\Blob\BlobService;
	use PEAR2\WindowsAzure\Services\Blob\Models\BlobServiceOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\ListContainersOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\ListContainersResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\CreateContainerOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\SetContainerMetadataOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\ListBlobsOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\ListBlobsResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\CreateBlobOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobPropertiesOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobPropertiesResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\SetBlobPropertiesOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\SetBlobPropertiesResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobMetadataOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobMetadataResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\SetBlobMetadataOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobOptions;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobResult;
	use PEAR2\WindowsAzure\Services\Blob\Models\DeleteBlobOptions;

In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="ConnectionString">Setup a Windows Azure Storage Connection</h2>

A Windows Azure Blob storage client uses a **Configuration** object for storing connection string information. After creating a new **Configuration** object, you must set properties for the name of your storage account, the primary access key, and the blob URI for the storage account listed in the Management Portal. This example shows how you can create a new configuration object and set these properties:

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Core\Configuration;
	use PEAR2\WindowsAzure\Services\Blob\BlobSettings;
	
	$storage_account_name = "your_storage_account_name";
	$storage_account_key = "your_storage_account_key";
	$storage_account_URI = "http://your_storage_account_name.blob.core.windows.net"
	
	$config = new Configuration();
	$config->setProperty(BlobSettings::ACCOUNT_NAME, $storage_account_name);
	$config->setProperty(BlobSettings::ACCOUNT_KEY, $storgae_account_key);
	$config->setProperty(BlobSettings::URI, $storage_account_URI);

You will pass this `Configuration` instance (`$config`) to other objects when using the Blob APIs.

<h2 id="CreateContainer">How to Create a Container</h2>

A **BlobService** object lets you create a blob container with the **createContainer** method. When creating a container, you can set options on the container, but doing so is not required. (The example below shows how to set the container ACL and container metadata.) If you attempt to create a container that already exists, an exception will be thrown and should be handled appropriately.

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;
	use PEAR2\WindowsAzure\Services\Blob\Models\CreateContainerOptions;

	// Create blob service client.
	$blob_client = BlobService::create($config);

	// OPTIONAL: Set public access policy and metadata.
	$createContainerOptions = new CreateContainerOptions();	

	// Set public access policy. Possible values are 'container' and 'blob'.
	// If this value is not specified in the request, container data is private.
	// For more information, see http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx.
	$createContainerOptions->setPublicAccess('container');
	
	// Set container metadata
	$createContainerOptions->addMetaData("key1", "value1");
	$createContainerOptions->addMetaData("key2", "value2");
	
	try	
	{
		// Create container.
		$blob_client->createContainer("mycontainer", $createContainerOptions);
	}
	catch(Exception $e)
	{
		$code = $e->getCode();
		$error_message = $e->getMessage();
		// Handle exception based on error codes and messages.
		// Error codes and messages can be found here: http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
	}

Calling **setPublicAccess('container')** makes the container and blob data accessible via anonymous requests. Calling **setPublicAccess('blob')** makes only blob data accessible via anonymous requests. For more information about container ACLs, see [Set Container ACL (REST API)][container-acl].

For more information about Blob service error codes, see [Blob Service Error Codes][error-codes].

<h2 id="UploadBlob">How to Upload a Blob into a Container</h2>

To upload a file as a blob, use the **BlobService->createBlockBlob** method. This operation will create the blob if it doesn’t exist, or overwrite it if it does. The code example below assumes that the container has already been created and uses [file\_get\_contents][file_get_contents] to open the file as a string.

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;

	// Create blob service client.
	$blob_client = BlobService::create($config);
	
	$content = file_get_contents("c:\myfile.txt");
	$blob_name = "myblob";
	$blob_client->createBlockBlob("mycontainer", $blob_name, $content);

<h2 id="ListBlobs">How to List the Blobs in a Container</h2>

To list the blobs in a container, use the **BlobService->listBlobs** method with a **foreach** loop to loop through the result. The following code outputs the name of each blob in a container and its URI to the browser.

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;
	use PEAR2\WindowsAzure\Services\Blob\Models\ListBlobsResult;

	// Create blob service client.
	$blob_client = BlobService::create($config);

	// List blobs.
	$blob_list = $blob_client->listBlobs("mycontainer"); // Returns ListBlobResult object.
	$blobs = $blob_list->getBlobs(); // Returns an array of Blob objects.
	
	foreach($blobs as $blob)
	{
		echo $blob->getName().": ".$blob->getUrl()."<br />";
	}


<h2 id="DownloadBlob">How to Download Blobs</h2>

To download a blob, call the **BlobService->getBlob** method, then call the **getContentStream** method on the resulting GetBlobResult object.

<font size='5'>**Seems odd that getContentStream returns a string.*</font>

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;
	use PEAR2\WindowsAzure\Services\Blob\Models\GetBlobResult;

	// Create blob service client.
	$blob_client = BlobService::create($config);

	// Get blob.
	$blob = $blob_client->getBlob("mycontainer", "myblob"); //Returns a GetBlobResult object.
	$content = $blob->getContentStream();

<h2 id="DeleteBlob">How to Delete a Blob</h2>

To delete a blob, pass the container name and blob name to **BlobService->deleteBlob**. 

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;

	// Create blob service client.
	$blob_client = BlobService::create($config);
	
	// Delete container.
	$blob_client->deleteBlob("mycontainer", "myblob");

<h2 id="DeleteContainer">How to Delete a Blob Container</h2>

Finally, to delete a blob container, pass the container name to **BlobService->deleteContainer**.

	require_once 'Autoload.php';

	use PEAR2\WindowsAzure\Services\Blob\BlobService;

	// Create blob service client.
	$blob_client = BlobService::create($config);
	
	// Delete container.
	$blob_client->deleteContainer("mycontainer");

<h2 id="NextSteps">Next Steps</h2>

Now that you’ve learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure] []
- Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[download]: http://link-does-not-exist-yet.com
[Windows Azure Management Portal]: http://windows.azure.com/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
[container-acl]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179391.aspx
[error-codes]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179439.aspx
[file_get_contents]: http://php.net/file_get_contents
[require_once]: http://php.net/require_once