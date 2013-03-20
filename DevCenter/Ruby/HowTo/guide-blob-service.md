#How to Use the Blob Service from Ruby

This guide will show you how to perform common scenarios using the
Windows Azure Blob service. The samples are written using the Ruby API.
The scenarios covered include **uploading, listing, downloading,** and **deleting** blobs.
For more information on blobs, see the [Next Steps](#next-steps) section.

##Table of Contents

* [What is the Blob Service?](#what-is-the-blob-service)
* [Concepts](#concepts)
* [Create a Windows Azure Storage Account](#create-a-windows-azure-storage-account)
* [Create a Ruby Application](#create-a-ruby-application)
* [Configure Your Application to Access Storage](#configure-your-application-to-access-storage)
* [Setup a Windows Azure Storage Connection](#setup-a-windows-azure-storage-connection)
* [How To: Create a Container](#how-to-create-a-container)
* [How To: Upload a Blob into a Container](#how-to-upload-a-blob-into-a-container)
* [How To: List the Blobs in a Container](#how-to-list-the-blobs-in-a-container)
* [How To: Download Blobs](#how-to-download-blobs)
* [How To: Delete a Blob](#how-to-delete-a-blob)
* [Next Steps](#next-steps)

[Common Section Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

##What is the Blob Service?

The Windows Azure Blob service is for storing large amounts of
unstructured data that can be accessed from anywhere in the world via
HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a
single storage account can contain up to 100TB of blobs. Common uses of
Blobs include:

* Serving images or documents directly to a browser
* Storing files for distributed access
* Streaming video and audio
* Performing secure backup and disaster recovery
* Storing data for analysis by an on-premise or Windows Azure-hosted service

You can use Blobs to expose data publicly to the world or
privately for internal application storage.

##Concepts

The Blob service contains the following components:

![Blob](https://www.windowsazure.com/media/devcenter/shared/blob1.jpg)

* **URL format**: Blobs are addressable using the following URL format:
http://storageaccount.blob.core.windows.net/container/blob
The following URL addresses one of the blobs in the diagram:
http://sally.blob.core.windows.net/movies/MOV1.AVI

* **Storage Account**: All access to Windows Azure Storage is done through a storage account. This is the highest level of the namespace for accessing blobs. An account can contain an unlimited number of containers, as long as their total size is under 100TB.

* **Container**: A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs.

* **Blob**: A file of any type and size. There are two types of blobs; block and page. Most files are block blobs. A single block blob can be up to 200GB in size. This tutorial uses block blobs. Page blobs, another blob type, can be up to 1TB in size, and are more efficient when ranges of bytes in a file are modified frequently.

## Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account.
You can create a storage account by following these steps. (You can also create a storage account using the [REST API](http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx).)

1. Log into the [Windows Azure Management Portal](https://manage.windowsazure.com/).

2. At the bottom of the navigation pane, click **+NEW**.

	![+new](https://www.windowsazure.com/media/devcenter/shared/plus-new.png)

3. Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog](https://www.windowsazure.com/media/devcenter/shared/quick-storage.png)

4. In URL, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.

5. Choose a Region/Affinity Group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.

6. Click **Create Storage Account**.

[Common Section End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

## Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Windows Azure](no-link-yet). **No link yet**

## Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Ruby azure package, 
which includes a set of convenience libraries that communicate with the storage REST services.

###Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type ``gem install azure`` in the command window to install the gem and dependencies.

###Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

##Setup a Windows Azure Storage Connection

The azure module will read the environment variables **AZURE_STORAGE_ACCOUNT** and **AZURE_STORAGE_ACCESS_KEY** 
for information required to connect to your Windows Azure storage account. If these environment variables are not set, you must specify the account information before using ``Azure::BlobService`` with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your azure storage access key>"


To obtain these values:

1. Log into the [Windows Azure Management Portal](https://manage.windowsazure.com/).
2. On the left side of the navigation pan, click **STORAGE**.

	![Storage](images/storage.png)

3. On the right side, choose the storage account you want to use in the table and click **MANAGE KEYS** at the bottom of the navigation pane.

	![Manage keys](images/manage-keys.png)

4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can either the primary one or the secondary one.

	![Manage keys dialog](images/manage-keys-dialog.png)

##How To: Create a Container

The ``Azure::BlobService`` object lets you work with containers and blobs. To create a container, use the ``create_container()`` method.
The following example creates a container or print out the error if there is any.

	azure_blob_service = Azure::BlobService.new
	begin
	  container = azure_blob_service.create_container("test-container")
	rescue
	  puts $!
	end

If you want to make the files in the container public, you can set the container's permissions. 
You can just modify the ``create_container()`` call to pass the ``:public_access_level`` option:

	container = azure_blob_service.create_container("test-container", :public_access_level => "<public access level>")


Valid values for the ``:public_access_level`` option are:

* ``"blob"``: Specifies full public read access for container and blob data. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.

* ``"container"``: Specifies public read access for blobs. Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request.

Alternatively, you can modify the public access level of a container by using ``set_container_acl()`` method to specify the public access level. 
The following example changes the public access level to **container**:

	azure_blob_service.set_container_acl('test-container', "container")

##How To: Upload a Blob into a Container

To upload content to a blob, use the ``create_block_blob()`` method to create the blob, use a file or string as the content of the blob. 
The following code will upload the file **test.png** as a new blob named "image-blob" in the container.

	content = File.open("test.png", "rb") { |file| file.read }
	blob = azure_blob_service.create_block_blob(container.name,"image-blob",content)
	puts blob.name

##How To: List the Blobs in a Container

To list the containers, use ``list_containers()`` method. 
To list the blobs within a container, use ``list_blobs()`` method. 
This outputs the urls of all the blobs in all the containers for the account.

	containers = azure_blob_service.list_containers().containers
	containers.each do |container|
	  blobs = azure_blob_service.list_blobs(container.name).blobs
	  blobs.each do |blob|
		puts blob.name
	  end
	end

##How To: Download Blobs

To download blobs, use the ``get_blob()`` method to retrieve the contents. 
The following example demonstrates using **get_blob()** to download the contents of **image-blob** and write it to a local file.

	blob, content = azure_blob_service.get_blob(container.name,"image-blob")
	File.open("download.png","wb") {|f| f.write(content)}

##How To: Delete a Blob
Finally, to delete a blob, use the ``delete_blob()`` method. The following example demonstrates how to delete a blob.

	azure_blob_service.delete_blob(container.name, "image-blob")

##Next Steps

Now that you’ve learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx).
-   Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/).
-   Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub.