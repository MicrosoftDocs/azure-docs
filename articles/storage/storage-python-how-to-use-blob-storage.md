<properties
	pageTitle="How to use Azure Blob storage from Python | Microsoft Azure"
	description="Learn how to use the Azure Blob storage from Python to upload, list, download, and delete blobs."
	services="storage"
	documentationCenter="python"
	authors="emgerner-msft"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="python"
	ms.topic="article"
	ms.date="08/25/2015"
	ms.author="emgerner"/>

# How to use Azure Blob storage from Python

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]

## Overview

This article will show you how to perform common scenarios using Blob storage. The samples are written in Python and use the [Python Azure Storage package][]. The scenarios covered include uploading, listing,
downloading, and deleting blobs.

[AZURE.INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a container

> [AZURE.NOTE] If you need to install Python or the [Python Azure package][], see the [Python Installation Guide](../python-how-to-install.md).

The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of any Python file in which you wish to programmatically access Azure Storage.

	from azure.storage.blob import BlobService

The following code creates a **BlobService** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	blob_service = BlobService(account_name='myaccount', account_key='mykey')

[AZURE.INCLUDE [storage-container-naming-rules-include](../../includes/storage-container-naming-rules-include.md)]

In the following code example, you can use a **BlobService** object to create the container if it doesn't exist.

	blob_service.create_container('mycontainer')

By default, the new container is private, so you must specify your storage access key (as you did earlier) to download blobs from this container. If you want to make the files within the container available to everyone, you can create the container and pass the public access level using the following code.

	blob_service.create_container('mycontainer', x_ms_blob_public_access='container')

Alternatively, you can modify a container after you have created it using the following code.

	blob_service.set_container_acl('mycontainer', x_ms_blob_public_access='container')

After this change, anyone on the Internet can see blobs in a public
container, but only you can modify or delete them.

## Upload a blob into a container

To upload data to a blob, use the **put\_block\_blob\_from\_path**, **put\_block\_blob\_from\_file**, **put\_block\_blob\_from\_bytes** or **put\_block\_blob\_from\_text** methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

**put\_block\_blob\_from\_path** uploads the contents of a file from the specified path, and **put\_block\_blob\_from\_file** uploads the contents from an already opened file/stream. **put\_block\_blob\_from\_bytes** uploads an array of bytes, and **put\_block\_blob\_from\_text** uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **sunset.png** file into the **myblob** blob.

	blob_service.put_block_blob_from_path(
        'mycontainer',
        'myblob',
        'sunset.png',
        x_ms_blob_content_type='image/png'
    )

## List the blobs in a container

To list the blobs in a container, use the **list\_blobs** method. Each
call to **list\_blobs** will return a segment of results. To get all results,
check the **next\_marker** of the results and call **list\_blobs** again as
needed. The following code outputs the **name** of each blob in a container
to the console.

	blobs = []
	marker = None
	while True:
		batch = blob_service.list_blobs('mycontainer', marker=marker)
		blobs.extend(batch)
		if not batch.next_marker:
			break
		marker = batch.next_marker
	for blob in blobs:
		print(blob.name)

## Download blobs

Each segment of results can contain a variable number of blobs up to a maximum
of 5000. If **next\_marker** exists for a particular segment, there may be
more blobs in the container.

To download data from a blob, use **get\_blob\_to\_path**, **get\_blob\_to\_file**, **get\_blob\_to\_bytes**, or **get\_blob\_to\_text**. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using **get\_blob\_to\_path** to download the contents of the **myblob** blob and store it to the **out-sunset.png** file.

	blob_service.get_blob_to_path('mycontainer', 'myblob', 'out-sunset.png')

## Delete a blob

Finally, to delete a blob, call **delete_blob**.

	blob_service.delete_blob('mycontainer', 'myblob')

## Next steps

Now that you have learned the basics of Blob storage, follow these links
to learn about more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   Visit the [Azure Storage Team Blog][]

For more information, see also the [Python Developer Center](/develop/python/).

[Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
[Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
[Python Azure package]: https://pypi.python.org/pypi/azure
[Python Azure Storage package]: https://pypi.python.org/pypi/azure-storage  
