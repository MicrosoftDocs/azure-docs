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

## <a name="what-is"> </a>What is Blob Storage?

Windows Azure Blob storage is a service for storing large amounts of
unstructured data that can be accessed from anywhere in the world via
HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a
single storage account can contain up to 100TB of blobs. Common uses of
Blob storage include:

-   Serving images or documents directly to a browser
-   Storing files for distributed access
-   Streaming video and audio
-   Performing secure backup and disaster recovery
-   Storing data for analysis by an on-premise or Windows Azure-hosted
    service

You can use Blob storage to expose data publicly to the world or
privately for internal application storage.

## <a name="concepts"> </a>Concepts

The Blob service contains the following components:

![Blob1][]

-   **URL format:** Blobs are addressable using the following URL
    format:   
    http://<storage
    account\>.blob.core.windows.net/<container\>/<blob\>  
      
    The following URL addresses one of the blobs in the diagram:  
    http://sally.blob.core.windows.net/movies/MOV1.AVI

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. This is the highest level of the
    namespace for accessing blobs. An account can contain an unlimited
    number of containers, as long as their total size is under 100TB.

-   **Container:** A container provides a grouping of a set of blobs.
    All blobs must be in a container. An account can contain an
    unlimited number of containers. A container can store an unlimited
    number of blobs.

-   **Blob:** A file of any type and size. There are two types of blobs
    that can be stored in Windows Azure Storage. Most files are block
    blobs. A single block blob can be up to 200GB in size. This tutorial
    uses block blobs. Page blobs, another blob type, can be up to 1TB in
    size, and are more efficient when ranges of bytes in a file are
    modified frequently.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal][].

2.  In the navigation pane, click **Hosted Services, Storage Accounts & CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account** dialog box opens.   
    ![Blob3][]

5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.

6.  In Enter a URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

7.  Choose a country/region or an affinity group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

8.  Finally, take note of your **Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.   
    ![Blob4][]

## <a name="create-container"> </a>How to: Create a Container

The **CloudBlobClient** object lets you work with containers and blobs. The
following code creates a **CloudBlobClient** object. Add the following near
the top of any Python file in which you wish to programmatically access Windows Azure Storage:

    from windowsazure.storages.cloudblobclient import *

The following code creates a **CloudBlobClient** object using the storage account name and account key.  Replace 'myaccount' and 'mykey' with the real account and key.

	blob_client = CloudBlobClient(account_name='myaccount', account_key='mykey')

All storage blobs reside in a container. You can use a **CloudBlobClient** object to create the container if it doesn't exist:

	blob_client.create_container('mycontainer')

By default, the new container is private, so you must specify your storage account key (as you did above) to download blobs from this container. If you want to make the files within the container available to everyone, you can create the container and pass the public access level using the following code:

	blob_client.create_container('mycontainer', x_ms_blob_public_access='container') 

Alternatively, you can modify a container after you have created it using the following code:

	blob_client.set_container_acl('mycontainer', x_ms_blob_public_access='container')

After this change, anyone on the Internet can see blobs in a public
container, but only you can modify or delete them.

## <a name="upload-blob"> </a>How to: Upload a Blob into a Container

To upload a file to a blob, use the **put_blob** method
to create the blob, using a file stream as the contents of the blob.
First, create a file called **task1.txt** (arbitrary content is fine)
and store it in the same directory as your Python file.

	myblob = open(r'task1.txt', 'r').read()
	blob_client.put_blob('mycontainer', 'myblob', myblob, x_ms_blob_type='BlockBlob')

## <a name="list-blob"> </a>How to: List the Blobs in a Container

To list the blobs in a container, use the **list_blobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** and **url** of each blob in a container to the
console.

	blobs = blob_client.list_blobs('mycontainer')
	for blob in blobs:
		print(blob.name)
		print(blob.url)

## <a name="download-blobs"> </a>How to: Download Blobs

To download blobs, use the **get_blob** method to transfer the
blob contents to a stream object that you can then persist to a local
file.

	blob = blob_client.get_blob('mycontainer', 'myblob')
	with open(r'out-task1.txt', 'w') as f:
    	f.write(blob)

## <a name="delete-blobs"> </a>How to: Delete a Blob

Finally, to delete a blob, call **delete_blob**.

	blob_client.delete_blob('mycontainer', 'myblob') 

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
  [Blob1]: ../../../DevCenter/Shared/Media/blob1.jpg
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Blob2]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Blob3]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Blob4]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
