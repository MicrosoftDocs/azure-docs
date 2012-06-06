# How to Use the Blob Storage Service from Python

This guide will show you how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written using the
Python API. The scenarios covered include **uploading**, **listing**,
**downloading**, and **deleting** blobs. For more information on blobs,
see the [Next Steps][] section.

## Table of Contents

[What is Blob Storage?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
 [How To: Create a Container][]   
 [How To: Upload a Blob into a Container][]   
 [How To: List the Blobs in a Container][]   
 [How To: Download Blobs][]   
 [How To: Delete a Blob][]   
 [Next Steps][]

<div chunk="../../Shared/Chunks/howto-blob-storage.md" />

## <a name="create-account"> </a>Create a Windows Azure Storage Account
<div chunk="../../Shared/Chunks/create-storage-account.md" />

## <a name="create-container"> </a>How to: Create a Container

**Note:** If you need to install Python or the Client Libraries, please see the [Python Installation Guide](../commontasks/how-to-install-python.md).


The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of any Python file in which you wish to programmatically access Windows Azure Storage:

	from azure.storage import *

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

To upload a file to a blob, use the **put_blob** method
to create the blob, using a file stream as the contents of the blob.
First, create a file called **task1.txt** (arbitrary content is fine)
and store it in the same directory as your Python file.

	myblob = open(r'task1.txt', 'r').read()
	blob_service.put_blob('mycontainer', 'myblob', myblob, x_ms_blob_type='BlockBlob')

## <a name="list-blob"> </a>How to: List the Blobs in a Container

To list the blobs in a container, use the **list_blobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** and **url** of each blob in a container to the
console.

	blobs = blob_service.list_blobs('mycontainer')
	for blob in blobs:
		print(blob.name)
		print(blob.url)

## <a name="download-blobs"> </a>How to: Download Blobs

To download blobs, use the **get_blob** method to transfer the
blob contents to a stream object that you can then persist to a local
file.

	blob = blob_service.get_blob('mycontainer', 'myblob')
	with open(r'out-task1.txt', 'w') as f:
		f.write(blob)

## <a name="delete-blobs"> </a>How to: Delete a Blob

Finally, to delete a blob, call **delete_blob**.

	blob_service.delete_blob('mycontainer', 'myblob') 

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Blob Storage?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [How To: Create a Container]: #create-container
  [How To: Upload a Blob into a Container]: #upload-blob
  [How To: List the Blobs in a Container]: #list-blob
  [How To: Download Blobs]: #download-blobs
  [How To: Delete a Blob]: #delete-blobs
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
