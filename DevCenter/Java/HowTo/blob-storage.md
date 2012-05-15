<properties linkid="dev-net-how-to-use-blog-storage-service-java" urldisplayname="Blob Storage" headerexpose="" pagetitle="How to Use the Blob Storage Service from Java" metakeywords="" footerexpose="" metadescription="" umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Blob Storage Service from Java

This guide will show you how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written in Java and
use the [Windows Azure SDK for Java][]. The scenarios covered include
**uploading**, **listing**, **downloading**, and **deleting** blobs. For
more information on blobs, see the [Next Steps][] section.

## <a name="bkmk_WhatIsBlobSvc"> </a>What is Blob Storage

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

## <a name="bkmk_Contents"> </a>Table of Contents

-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Create a Java Application][]
-   [Configure your Application to Access Blob Storage][]
-   [Setup a Windows Azure Storage Connection String][]
-   [How to Create a Container][]
-   [How to Upload a Blob into a Container][]
-   [How to List the Blobs in a Container][]
-   [How to Download Blobs][]
-   [How to Delete a Blob][]
-   [How to Delete a Blob Container][]
-   [Next Steps][]

## <a name="bkmk_Concepts"> </a>Concepts

The Blob service contains the following components:

![Blob Service Components][]

-   **URL format:** Blobs are addressable using the following URL
    format:   
     http://<*storage
    account*\>.blob.core.windows.net/<*container*\>/<blob\>  
    The following URL addresses one of the blobs in the diagram:  
    http://sally.blob.core.windows.net/movies/MOV1.AVI
-   **Storage Account:**All access to Windows Azure Storage is done
    through a storage account. This is the highest level of the
    namespace for accessing blobs. An account can contain an unlimited
    number of containers, as long as their total size is under 100TB.
-   **Container:**A container provides a grouping of a set of blobs. All
    blobs must be in a container. An account can contain an unlimited
    number of containers. A container can store an unlimited number of
    blobs.
-   **Blob:** A file of any type and size. There are two types of blobs
    that can be stored in Windows Azure Storage. Most files are block
    blobs. A single block blob can be up to 200GB in size. This tutorial
    uses block blobs. Page blobs, another blob type, can be up to 1TB in
    size, and are more efficient when ranges of bytes in a file are
    modified frequently

## <a name="bkmk_CreateWinAzureStorAcct"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account using the REST API.)

**How to Create a Storage Account using the Management Portal**

1.  Log into the [Windows Azure Management Portal][].
2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.
3.  At the top of the navigation pane, click **Storage Accounts**.
4.  On the ribbon, in the **Storage** group, click **New Storage
    Account**.  
    ![New Storage Account screenshot][]  
     The **Create a New Storage Account** dialog box opens.  
    ![Create New Storage Account screenshot][]
5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.
6.  In **Enter a URL**, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.
7.  Choose a region or an affinity group in which to locate the storage.
    If you will be using storage from your Windows Azure application,
    select the same region where you will deploy your application.
8.  Finally, take note of your **Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.  
    ![Properties screenshot][]

## <a name="bkmk_CreateJavaApp"> </a>Create a Java Application

In this guide, you will use storage features which can be run within a
Java application locally, or in code running within a web role or worker
role in Windows Azure. We assume you have downloaded and installed the
Java Development Kit (JDK), and followed the instructions in [Download
the Windows Azure SDK for Java][Windows Azure SDK for Java] to install
the Windows Azure Libraries for Java and the Windows Azure SDK, and have
created a Windows Azure storage account in your Windows Azure
subscription.

You can use any development tools to create your application, including
Notepad. All you need is the ability to compile a Java project and
reference the Windows Azure Libraries for Java.

## <a name="bkmk_ConfigApp"> </a>Configure your Application to Access Blob Storage

Add the following import statements to the top of the Java file where
you want to use Windows Azure storage APIs to access blobs:

    // Include the following imports to use blob APIs
    import com.microsoft.windowsazure.services.core.storage.*;
    import com.microsoft.windowsazure.services.blob.client.*;

## <a name="bkmk_SetupConnectString"> </a>Setup a Windows Azure Storage Connection String

A Windows Azure storage client uses a storage connection string to store
endpoints and credentials for accessing storage services. When running
in a client application, you must provide the storage connection string
in the following format, using the name of your storage account and the
Primary access key for the storage account listed in the Management
Portal for the *AccountName* and *AccountKey* values. This example shows
how you can declare a static field to hold the connection string:

    // Define the connection-string with your values
    public static final String storageConnectionString = 
        "DefaultEndpointsProtocol=http;" + 
        "AccountName=your_storage_account;" + 
        "AccountKey=your_storage_account_key";

In an application running within a role in Windows Azure, this string
can be stored in the service configuration file,
ServiceConfiguration.cscfg, and can be accessed with a call to the
**RoleEnvironment.getConfigurationSettings** method. Here’s an example
of getting the connection string from a **Setting** element named
*StorageConnectionString* in the service configuration file:

    // Retrieve storage account from connection-string
    String storageConnectionString = 
        RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");

## <a name="bkmk_CreateContainer"> </a>How to Create a Container

A CloudBlobClient object lets you get reference objects for containers
and blobs. The following code creates a **CloudBlobClient** object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

All blobs reside in a container. Use the **CloudBlobClient** object to
get a reference to the container you want to use. You can create the
container if it doesn’t exist with the **createIfNotExist** method,
which will otherwise return the existing container. By default, the new
container is private, so you must specify your storage account key (as
you did above) to download blobs from this container.

    // Get a reference to a container
    // The container name must be lower case
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Create the container if it does not exist
    container.createIfNotExist();

If you want to make the files public, you can set the container’s
permissions.

    // Create a permissions object
    BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

    // Include public access in the permissions object
    containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

    // Set the permissions on the container
    container.uploadPermissions(containerPermissions);

Anyone on the internet can see blobs in a public container, but public
access is limited to reading only.

## <a name="bkmk_UploadBlobToContainer"> </a>How to Upload a Blob into a Container

To upload a file to a blob, get a container reference and use it to get
a blob reference. Once you have a blob reference, you can upload any
stream by calling upload on the blob reference. This operation will
create the blob if it doesn’t exist, or overwrite it if it does. This
code sample shows this, and assumes that the container has already been
created.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Create or overwrite the "myimage.jpg" blob with contents from a local file
    CloudBlockBlob blob = container.getBlockBlobReference("myimage.jpg");
    File source = new File("c:\\myimages\\myimage.jpg");
    blob.upload(new FileInputStream(source), source.length());

## <a name="bkmk_ListBlobs"> </a>How to List the Blobs in a Container

To list the blobs in a container, first get a container reference like
you did to upload a blob. You can use the container’s **listBlobs**
method with a for loop. The following code outputs the Uri of each blob
in a container to the console.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Loop over blobs within the container and output the URI to each of them
    for (ListBlobItem blobItem : container.listBlobs()) {
        System.out.println(blobItem.getUri());
    }

The blob service has the concept of directories within containers, as
well. This is so that you can organize your blobs in a more folder-like
structure.

For example, you could have a container named “photos”, in which you
might upload blobs named “rootphoto1”, “2010/photo1”, “2010/photo2”, and
“2011/photo1”. This would create the virtual directories “2010” and
“2011” within the “photos” container. When you call **listBlobs** on the
“photos” container, the collection returned will contain
**CloudBlobDirectory** and **CloudBlob** objects representing the
directories and blobs contained at the top level. In this case,
directories “2010” and “2011”, as well as photo “rootphoto1” would be
returned. You can use the **instanceof** operator to distinguish these
objects.

Optionally, you can pass in parameters to the **listBlobs** method with
the **useFlatBlobListing** parameter set to true. This will result in
every blob being returned, regardless of directory. For more
information, see CloudBlobContainer.listBlobs in the Javadocs
documentation.

## <a name="bkmk_DownloadBlobs"> </a>How to Download Blobs

To download blobs, follow the same steps as you did for uploading a blob
in order to get a blob reference. In the uploading example, you called
upload on the blob object. In the following example, call download to
transfer the blob contents to a stream object such as a
**FileOutputStream** that you can use to persist the blob to a local
file.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // For each item in the container
    for (ListBlobItem blobItem : container.listBlobs()) {
        // If the item is a blob, not a virtual directory
        if (blobItem instanceof CloudBlob) {
            // Download the item and save it to a file with the same name
            CloudBlob blob = (CloudBlob) blobItem;
            blob.download(new FileOutputStream(blob.getName()));
        }
    }

## <a name="bkmk_DeleteBlob"> </a>How to Delete a Blob

To delete a blob, get a blob reference, and call **delete**.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Retrieve reference to a blob named "myimage.jpg"
    CloudBlockBlob blob = container.getBlockBlobReference("myimage.jpg");

    // Delete the blob
    blob.delete();

## <a name="bkmk_DeleteBlobContainer"> </a>How to Delete a Blob Container

Finally, to delete a blob container, get a blob container reference, and
call delete.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Delete the blob container
    container.delete();

## <a name="bkmk_NextSteps"> </a>Next Steps

Now that you’ve learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the Windows Azure Storage Team Blog:
    [http://blogs.msdn.com/b/windowsazurestorage/][]

  [Windows Azure SDK for Java]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx
  [Next Steps]: #bkmk_NextSteps
  [Concepts]: #bkmk_Concepts
  [Create a Windows Azure Storage Account]: #bkmk_CreateWinAzureStorAcct
  [Create a Java Application]: #bkmk_CreateJavaApp
  [Configure your Application to Access Blob Storage]: #bkmk_ConfigApp
  [Setup a Windows Azure Storage Connection String]: #bkmk_SetupConnectString
  [How to Create a Container]: #bkmk_CreateContainer
  [How to Upload a Blob into a Container]: #bkmk_UploadBlobToContainer
  [How to List the Blobs in a Container]: #bkmk_ListBlobs
  [How to Download Blobs]: #bkmk_DownloadBlobs
  [How to Delete a Blob]: #bkmk_DeleteBlob
  [How to Delete a Blob Container]: #bkmk_DeleteBlobContainer
  [Blob Service Components]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage.png
  [Windows Azure Management Portal]: http://windows.azure.com/
  [New Storage Account screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Create New Storage Account screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Properties screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [http://blogs.msdn.com/b/windowsazurestorage/]: http://blogs.msdn.com/b/windowsazurestorage/
