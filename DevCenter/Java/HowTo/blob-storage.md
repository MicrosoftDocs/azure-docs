<properties linkid="dev-net-how-to-use-blog-storage-service-java" urlDisplayName="Blob Service" pageTitle="How to use blob storage (Java) - Windows Azure feature guide" metaKeywords="Get started Azure blob, Azure unstructured data, Azure unstructured storage, Azure blob, Azure blob storage, Azure blob Java" metaDescription="Learn how to use the Windows Azure blob service to upload, download, list, and delete blob content. Samples written in Java." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

# How to use Blob Storage from Java

This guide will show you how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written in Java and
use the [Windows Azure SDK for Java][]. The scenarios covered include
**uploading**, **listing**, **downloading**, and **deleting** blobs. For
more information on blobs, see the [Next Steps](#NextSteps) section.

## <a name="Contents"> </a>Table of Contents

* [What is Blob Storage](#what-is)
* [Concepts](#Concepts)
* [Create a Windows Azure storage account](#CreateAccount)
* [Create a Java application](#CreateApplication)
* [Configure your application to access Blob Storage](#ConfigureStorage)
* [Setup a Windows Azure storage connection string](#ConnectionString)
* [How to: Create a container](#CreateContainer)
* [How to: Upload a blob into a container](#UploadBlob)
* [How to: List the blobs in a container](#ListBlobs)
* [How to: Download a blob](#DownloadBlob)
* [How to: Delete a blob](#DeleteBlob)
* [How to: Delete a blob container](#DeleteContainer)
* [Next steps](#NextSteps)

<div chunk="../../Shared/Chunks/howto-blob-storage.md" />

<h2 id="CreateAccount">Create a Windows Azure storage account</h2>

<div chunk="../../Shared/Chunks/create-storage-account.md" />

## <a name="CreateApplication"> </a>Create a Java application

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

## <a name="ConfigureStorage"> </a>Configure your application to access Blob Storage

Add the following import statements to the top of the Java file where
you want to use Windows Azure storage APIs to access blobs:

    // Include the following imports to use blob APIs
    import com.microsoft.windowsazure.services.core.storage.*;
    import com.microsoft.windowsazure.services.blob.client.*;

## <a name="ConnectionString"> </a>Setup a Windows Azure storage connection string

A Windows Azure storage client uses a storage connection string to store
endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the Primary access key for the storage account listed in the Management Portal for the *AccountName* and *AccountKey* values. This example shows how you can declare a static field to hold the connection string:

    // Define the connection-string with your values
    public static final String storageConnectionString = 
        "DefaultEndpointsProtocol=http;" + 
        "AccountName=your_storage_account;" + 
        "AccountKey=your_storage_account_key";

In an application running within a role in Windows Azure, this string
can be stored in the service configuration file,
ServiceConfiguration.cscfg, and can be accessed with a call to the
**RoleEnvironment.getConfigurationSettings** method. Here's an example
of getting the connection string from a **Setting** element named
*StorageConnectionString* in the service configuration file:

    // Retrieve storage account from connection-string
    String storageConnectionString = 
        RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");

## <a name="CreateContainer"> </a>How to: Create a container

A CloudBlobClient object lets you get reference objects for containers
and blobs. The following code creates a **CloudBlobClient** object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount =
        CloudStorageAccount.parse(storageConnectionString);

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.createCloudBlobClient();

All blobs reside in a container. Use the **CloudBlobClient** object to
get a reference to the container you want to use. You can create the
container if it doesn't exist with the **createIfNotExist** method,
which will otherwise return the existing container. By default, the new
container is private, so you must specify your storage access key (as
you did above) to download blobs from this container.

    // Get a reference to a container
    // The container name must be lower case
    CloudBlobContainer container = blobClient.getContainerReference("mycontainer");

    // Create the container if it does not exist
    container.createIfNotExist();

If you want to make the files public, you can set the container's
permissions.

    // Create a permissions object
    BlobContainerPermissions containerPermissions = new BlobContainerPermissions();

    // Include public access in the permissions object
    containerPermissions.setPublicAccess(BlobContainerPublicAccessType.CONTAINER);

    // Set the permissions on the container
    container.uploadPermissions(containerPermissions);

Anyone on the internet can see blobs in a public container, but public
access is limited to reading only.

## <a name="UploadBlob"> </a>How to: Upload a blob into a container

To upload a file to a blob, get a container reference and use it to get
a blob reference. Once you have a blob reference, you can upload any
stream by calling upload on the blob reference. This operation will
create the blob if it doesn't exist, or overwrite it if it does. This
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

## <a name="ListBlobs"> </a>How to: List the blobs in a container

To list the blobs in a container, first get a container reference like
you did to upload a blob. You can use the container's **listBlobs**
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

## <a name="DownloadBlob"> </a>How to: Download a blob

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

## <a name="DeleteBlob"> </a>How to: Delete a blob

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

## <a name="DeleteContainer"> </a>How to: Delete a blob container

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

## <a name="NextSteps"> </a>Next steps

Now that you've learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure]
-   Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>


[Windows Azure SDK for Java]: http://www.windowsazure.com/en-us/develop/java/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
