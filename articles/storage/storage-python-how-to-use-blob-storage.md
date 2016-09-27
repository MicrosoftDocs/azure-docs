<properties
	pageTitle="How to use Azure Blob storage (object storage) from Python | Microsoft Azure"
	description="Store unstructured data in the cloud with Azure Blob storage (object storage)."
	services="storage"
	documentationCenter="python"
	authors="emgerner-msft"
	manager="wpickett"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
    ms.date="07/26/2016"
	ms.author="jehine"/>

# How to use Azure Blob storage from Python

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

Azure Blob storage is a service that stores unstructured data in the cloud as objects/blobs. Blob storage can store any type of text or binary data, such as a document, media file, or application installer. Blob storage is also referred to as object storage.

This article will show you how to perform common scenarios using Blob storage. The samples are written in Python and use the [Microsoft Azure Storage SDK for Python]. The scenarios covered include uploading, listing, downloading, and deleting blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a container

Based on the type of blob you would like to use, create a **BlockBlobService**, **AppendBlobService**, or **PageBlobService** object. The following code uses a **BlockBlobService** object. Add the following near the top of any Python file in which you wish to programmatically access Azure Block Blob Storage.

	from azure.storage.blob import BlockBlobService

The following code creates a **BlockBlobService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with your account name and key.

	block_blob_service = BlockBlobService(account_name='myaccount', account_key='mykey')

[AZURE.INCLUDE [storage-container-naming-rules-include](../../includes/storage-container-naming-rules-include.md)]

In the following code example, you can use a **BlockBlobService** object to create the container if it doesn't exist.

	block_blob_service.create_container('mycontainer')

By default, the new container is private, so you must specify your storage access key (as you did earlier) to download blobs from this container. If you want to make the blobs within the container available to everyone, you can create the container and pass the public access level using the following code.

	from azure.storage.blob import PublicAccess
	block_blob_service.create_container('mycontainer', public_access=PublicAccess.Container)

Alternatively, you can modify a container after you have created it using the following code.

	block_blob_service.set_container_acl('mycontainer', public_access=PublicAccess.Container)

After this change, anyone on the Internet can see blobs in a public container, but only you can modify or delete them.

## Upload a blob into a container

To create a block blob and upload data, use the **create\_blob\_from\_path**, **create\_blob\_from\_stream**, **create\_blob\_from\_bytes** or **create\_blob\_from\_text** methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

**create\_blob\_from\_path** uploads the contents of a file from the specified path, and **create\_blob\_from\_stream** uploads the contents from an already opened file/stream. **create\_blob\_from\_bytes** uploads an array of bytes, and **create\_blob\_from\_text** uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myblob** blob.

	from azure.storage.blob import ContentSettings
	block_blob_service.create_blob_from_path(
        'mycontainer',
        'myblockblob',
        'sunset.png',
        content_settings=ContentSettings(content_type='image/png')
				)

## List the blobs in a container

To list the blobs in a container, use the **list\_blobs** method. This method returns a generator. The following code outputs the **name** of each blob in a container to the console.

	generator = block_blob_service.list_blobs('mycontainer')
	for blob in generator:
		print(blob.name)

## Download blobs

To download data from a blob, use **get\_blob\_to\_path**, **get\_blob\_to\_stream**, **get\_blob\_to\_bytes**, or **get\_blob\_to\_text**. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using **get\_blob\_to\_path** to download the contents of the **myblob** blob and store it to the **out-sunset.png** file.

	block_blob_service.get_blob_to_path('mycontainer', 'myblockblob', 'out-sunset.png')

## Delete a blob

Finally, to delete a blob, call **delete_blob**.

	block_blob_service.delete_blob('mycontainer', 'myblockblob')

## Writing to an append blob

An append blob is optimized for append operations, such as logging. Like a block blob, an append blob is comprised of blocks, but when you add a new block to an append blob, it is always appended to the end of the blob. You cannot update or delete an existing block in an append blob. The block IDs for an append blob are not exposed as they are for a block blob.

Each block in an append blob can be a different size, up to a maximum of 4 MB, and an append blob can include a maximum of 50,000 blocks. The maximum size of an append blob is therefore slightly more than 195 GB (4 MB X 50,000 blocks).

The example below creates a new append blob and appends some data to it, simulating a simple logging operation.

	from azure.storage.blob import AppendBlobService
	append_blob_service = AppendBlobService(account_name='myaccount', account_key='mykey')

	# The same containers can hold all types of blobs
	append_blob_service.create_container('mycontainer')

	# Append blobs must be created before they are appended to
	append_blob_service.create_blob('mycontainer', 'myappendblob')
	append_blob_service.append_blob_from_text('mycontainer', 'myappendblob', u'Hello, world!')

	append_blob = append_blob_service.get_blob_to_text('mycontainer', 'myappendblob')

## Next steps

Now that you've learned the basics of Blob storage, follow these links
to learn more.

- [Python Developer Center](/develop/python/)
- [Azure Storage Services REST API](http://msdn.microsoft.com/library/azure/dd179355)
- [Azure Storage Team Blog]
- [Microsoft Azure Storage SDK for Python]

[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Microsoft Azure Storage SDK for Python]: https://github.com/Azure/azure-storage-python
