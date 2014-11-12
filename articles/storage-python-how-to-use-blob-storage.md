<properties urlDisplayName="Blob Service" pageTitle="How to use blob storage (Python) | Microsoft Azure" metaKeywords="Azure blob service Python, Azure blobs Python" description="Learn how to use the Azure Blob service to upload, list, download, and delete blobs." metaCanonical="" disqusComments="1" umbracoNaviHide="0" services="storage" documentationCenter="Python" title="How to use the Blob service from Python" authors="huvalo" videoId="" scriptId="" manager="wpickett" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="python" ms.topic="article" ms.date="09/19/2014" ms.author="huvalo" />

# How to Use the Blob Storage Service from Python
This guide will show you how to perform common scenarios using the
Azure Blob storage service. The samples are written using the
Python API. The scenarios covered include **uploading**, **listing**,
**downloading**, and **deleting** blobs. For more information on blobs,
see the [Next Steps][] section.

## Table of Contents

[What is Blob Storage?][]   
 [Concepts][]   
 [Create an Azure Storage Account][]   
 [How To: Create a Container][]   
 [How To: Upload a Blob into a Container][]   
 [How To: List the Blobs in a Container][]   
 [How To: Download Blobs][]   
 [How To: Delete a Blob][]   
 [How To: Upload and Download Large Blobs][]   
 [Next Steps][]

[WACOM.INCLUDE [howto-blob-storage](../includes/howto-blob-storage.md)]

## <a name="create-account"> </a>Create an Azure Storage Account

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <a name="create-container"> </a>How to: Create a Container

**Note:** If you need to install Python or the Client Libraries, please see the [Python Installation Guide](../python-how-to-install/).


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

## <a name="upload-blob"> </a>How to: Upload a Blob into a Container

To upload data to a blob, use the **put\_block\_blob\_from\_path**, **put\_block\_blob\_from\_file**, **put\_block\_blob\_from\_bytes** or **put\_block\_blob\_from\_text** methods. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

**put\_block\_blob\_from\_path** uploads the contents of a file from the specified path, **put\_block\_blob\_from\_file** uploads the contents from an already opened file/stream. **put\_block\_blob\_from\_bytes** uploads an array of bytes, **put\_block\_blob\_from\_text** uploads the specified text value using the specified encoding (defaults to UTF-8).

The following example uploads the contents of the **task1.txt** file into the **myblob** blob.

	blob_service.put_block_blob_from_path('mycontainer', 'myblob', 'task1.txt')

## <a name="list-blob"> </a>How to: List the Blobs in a Container

To list the blobs in a container, use the **list\_blobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** and **url** of each blob in a container to the
console.

	blobs = blob_service.list_blobs('mycontainer')
	for blob in blobs:
		print(blob.name)
		print(blob.url)

## <a name="download-blobs"> </a>How to: Download Blobs

To download data from a blob, use **get\_blob\_to\_path**, **get\_blob\_to\_file**, **get\_blob\_to\_bytes** or **get\_blob\_to\_text**. They are high-level methods that perform the necessary chunking when the size of the data exceeds 64 MB.

The following example demonstrates using **get\_blob\_to\_path** to download the contents of the **myblob** blob and store it to the **out-task1.txt** file:

	blob_service.get_blob_to_path('mycontainer', 'myblob', 'out-task1.txt')

## <a name="delete-blobs"> </a>How to: Delete a Blob

Finally, to delete a blob, call **delete_blob**.

	blob_service.delete_blob('mycontainer', 'myblob') 

## <a name="next-steps"> </a>Next Steps

Now that you have learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   Visit the [Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Blob Storage?]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [How To: Create a Container]: #create-container
  [How To: Upload a Blob into a Container]: #upload-blob
  [How To: List the Blobs in a Container]: #list-blob
  [How To: Download Blobs]: #download-blobs
  [How To: Delete a Blob]: #delete-blobs
  [How To: Upload and Download Large Blobs]: #large-blobs
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
