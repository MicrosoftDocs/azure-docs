<properties 
	pageTitle="How to use Blob storage from Python | Microsoft Azure" 
	description="Learn how to use the Azure Blob service from Python to upload, list, download, and delete blobs." 
	services="storage" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="huvalo"/>

# How to use Blob storage from Python

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview

This guide will show you how to perform common scenarios using the
Azure Blob storage service. The samples are written in Python and use the [Python Azure package][]. The scenarios covered include **uploading**, **listing**,
**downloading**, and **deleting** blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## How to: Create a Container

> [AZURE.NOTE] If you need to install Python or the [Python Azure package][], please see the [Python Installation Guide](python-how-to-install.md).


The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of any Python file in which you wish to programmatically access Azure Storage:

	from azure.storage import BlobService

The following code creates a **BlobService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	blob_service = BlobService(account_name='myaccount', account_key='mykey')

All storage blobs reside in a container. You can use a **BlobService** object to create the container if it doesn't exist:

	blob_service.create_container('mycontainer')

By default, the new container is private, so you must specify your storage access key (as you did above) to download blobs from this container. If you want to make the files within the container available to everyone, you can create the container and pass the public access level using the following code:

	blob_service.create_container('mycontainer', x_ms_blob_public_access='container') 

Alternatively, you can modify a container after you have created it using the following code:

	blob_service.set_container_acl('mycontainer', x_ms_blob_public_access='container')

After this change, anyone on the Internet can see blobs in a public
container, but only you can modify or delete them.

## How to: Upload a Blob into a Container

To upload data to a blob, use the **put\_block\_blob\_from\_path**, **put\_block\_blob\_from\_file**, **put\_block\_blob\_from\_bytes** or **put\_block\_blob\_from\_text** methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

**put\_block\_blob\_from\_path** uploads the contents of a file from the specified path, **put\_block\_blob\_from\_file** uploads the contents from an already opened file/stream. **put\_block\_blob\_from\_bytes** uploads an array of bytes, **put\_block\_blob\_from\_text** uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myblob** blob.

	blob_service.put_block_blob_from_path(
        'mycontainer',
        'myblob',
        'sunset.png',
        x_ms_blob_content_type='image/png'
    )

## How to: List the Blobs in a Container

To list the blobs in a container, use the **list\_blobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** and **url** of each blob in a container to the
console.

	blobs = blob_service.list_blobs('mycontainer')
	for blob in blobs:
		print(blob.name)
		print(blob.url)

## How to: Download Blobs

To download data from a blob, use **get\_blob\_to\_path**, **get\_blob\_to\_file**, **get\_blob\_to\_bytes** or **get\_blob\_to\_text**. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using **get\_blob\_to\_path** to download the contents of the **myblob** blob and store it to the **out-sunset.png** file:

	blob_service.get_blob_to_path('mycontainer', 'myblob', 'out-sunset.png')

## How to: Delete a Blob

Finally, to delete a blob, call **delete_blob**.

	blob_service.delete_blob('mycontainer', 'myblob') 

## Next Steps

Now that you have learned the basics of blob storage, follow these links
to learn about more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   Visit the [Azure Storage Team Blog][]

[Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Python Azure package]: https://pypi.python.org/pypi/azure  
