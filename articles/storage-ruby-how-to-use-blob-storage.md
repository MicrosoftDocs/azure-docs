<properties 
	pageTitle="How to use Blob storage from Ruby | Microsoft Azure" 
	description="Learn how to use the Azure blob service to upload, download, list, and delete blob content. Samples written in Ruby." 
	services="storage" 
	documentationCenter="ruby" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ruby" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="tomfitz"/>


# How to use Blob storage from Ruby

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview

This guide will show you how to perform common scenarios using the
Azure Blob service. The samples are written using the Ruby API.
The scenarios covered include **uploading, listing, downloading,** and **deleting** blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Azure](/develop/ruby/tutorials/web-app-with-linux-vm/).

## Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Ruby azure package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).

2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package

Using your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

## Setup an Azure Storage Connection

The azure module will read the environment variables **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS_KEY** 
for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information before using **Azure::BlobService** with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your azure storage access key>"


To obtain these values:

1. Log into the [Azure Management Portal](https://manage.windowsazure.com/).
2. Navigate to the storage account you want to use
3. Click **MANAGE KEYS** at the bottom of the navigation pane.
4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can use either the primary one or the secondary one.

## How To: Create a Container

The **Azure::BlobService** object lets you work with containers and blobs. To create a container, use the **create\_container()** method.

The following example creates a container or print out the error if there is any.

	azure_blob_service = Azure::BlobService.new
	begin
	  container = azure_blob_service.create_container("test-container")
	rescue
	  puts $!
	end

If you want to make the files in the container public, you can set the container's permissions. 

You can just modify the <strong>create\_container()</strong> call to pass the **:public\_access\_level** option:

	container = azure_blob_service.create_container("test-container", 
	  :public_access_level => "<public access level>")


Valid values for the **:public\_access\_level** option are:

* **blob:** Specifies full public read access for container and blob data. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.

* **container:** Specifies public read access for blobs. Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request.

Alternatively, you can modify the public access level of a container by using **set\_container\_acl()** method to specify the public access level.
 
The following example changes the public access level to **container**:

	azure_blob_service.set_container_acl('test-container', "container")

## How To: Upload a Blob into a Container

To upload content to a blob, use the **create\_block\_blob()** method to create the blob, use a file or string as the content of the blob. 

The following code will upload the file **test.png** as a new blob named "image-blob" in the container.

	content = File.open("test.png", "rb") { |file| file.read }
	blob = azure_blob_service.create_block_blob(container.name,
	  "image-blob", content)
	puts blob.name

## How To: List the Blobs in a Container

To list the containers, use **list_containers()** method. 
To list the blobs within a container, use **list\_blobs()** method. 

This outputs the urls of all the blobs in all the containers for the account.

	containers = azure_blob_service.list_containers()
	containers.each do |container|
	  blobs = azure_blob_service.list_blobs(container.name)
	  blobs.each do |blob|
	    puts blob.name
	  end
	end

## How To: Download Blobs

To download blobs, use the **get\_blob()** method to retrieve the contents. 

The following example demonstrates using **get\_blob()** to download the contents of "image-blob" and write it to a local file.

	blob, content = azure_blob_service.get_blob(container.name,"image-blob")
	File.open("download.png","wb") {|f| f.write(content)}

## How To: Delete a Blob
Finally, to delete a blob, use the **delete\_blob()** method. The following example demonstrates how to delete a blob.

	azure_blob_service.delete_blob(container.name, "image-blob")

## Next Steps

Now that you have learned the basics of blob storage, follow these links to learn about more complex storage tasks.

- See the MSDN Reference: [Azure Storage](http://msdn.microsoft.com/library/azure/gg433040.aspx)
- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
- Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub
