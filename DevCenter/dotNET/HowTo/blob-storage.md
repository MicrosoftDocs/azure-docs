<properties linkid="dev-net-how-to-blob-storage" urldisplayname="Blob Service" headerexpose pagetitle="How to Use the Blob Storage Service from .NET" metakeywords="Get started Azure blob, Azure unstructured data, Azure unstructured storage, Azure blob, Azure blob storage, Azure blob .NET, Azure blob storage .NET, Azure blob C#, Azure blob storage C#" footerexpose metadescription="Get started using the Windows Azure blob storage service to upload, download, list, and delete blob content." umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Blob Storage Service

This guide will demonstrate how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written in C\# and
use the .NET API. The scenarios covered include
**uploading**,**listing**, **downloading**, and **deleting** blobs. For
more information on blobs, see the [Next Steps][] section.

## Table of Contents

-   [What is Blob Storage][]
-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Setup a Windows Azure Storage Connection String][]
-   [How To: Programmatically access Blob Storage Using .NET][]
-   [How To: Create a Container][]
-   [How To: Upload a Blob into a Container][]
-   [How To: List the Blobs in a Container][]
-   [How To: Download Blobs][]
-   [How To: Delete a Blob][]
-   [Next Steps][]

<div chunk="../Shared/Chunks/howto-blob-storage.md" />

<div chunk="../../Shared/Chunks/create-storage-account.md" />

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection String

The Windows Azure .NET storage API supports using a storage connection
string to configure endpoints and credentials for accessing storage
services. You can put your storage connection string in a configuration
file, rather than hard-coding it in code. In this guide, you will store
your connection string using the Windows Azure service configuration
system. This service configuration mechanism is unique to Windows Azure
projects and enables you to dynamically change configuration settings
from the Windows Azure Management Portal without redeploying your
application.

To configure your connection string in the Windows Azure service
configuration:

1.  Within the Solution Explorer of Visual Studio, in the **Roles**
    folder of your Windows Azure Deployment Project, right-click your
    web role or worker role and click **Properties**.  
    ![Blob5][]

2.  Click the **Settings** tab and press the **Add Setting** button.  
    ![Blob6][]

    A new **Setting1** entry will then show up in the settings grid.

3.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog will open.

5.  Choose whether you want to target the storage emulator (the Windows
    Azure storage simulated on your local machine) or an actual storage
    account in the cloud. The code in this guide works with either
    option. Enter the **Primary Access Key** value copied from the
    earlier step in this tutorial if you wish to store blob data in the
    storage account we created earlier on Windows Azure.   
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to a "friendlier" name
    like **StorageConnectionString**. You will reference this
    connectionstring later in the code in this guide.  
    ![Blob9][]

You are now ready to perform the How To's in this guide.

## <a name="configure-access"> </a>How to Programmatically access Blob Storage Using .NET

Add the following code namespace declarations to the top of any C\# file
in which you wish to programmatically access Windows Azure Storage:

    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;

You can use the **CloudStorageAccount** type and **RoleEnvironment**type
to retrieve your storage connection-string and storage account
information from the Windows Azure service configuration:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

A **CloudBlobClient** type allows you to retrieve objects that represent
containers and blobs stored within the Blob Storage Service. The
following code creates a **CloudBlobClient** object using the storage
account object we retrieved above:

    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

## <a name="create-container"> </a>How to Create a Container

All storage blobs reside in a container. You can use a
**CloudBlobClient** object to get a reference to the container you want
to use. You can create the container if it doesn't exist:

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client 
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve a reference to a container 
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Create the container if it doesn't already exist
    container.CreateIfNotExist();

By default, the new container is private, so you must specify your
storage account key (as you did above) to download blobs from this
container. If you want to make the files within the container available
to everyone, you can set the container to be public using the following
code:

    container.SetPermissions(
       new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob }); 

Anyone on the Internet can see blobs in a public container, but you can
modify or delete them only if you have the appropriate access key.

## <a name="upload-blob"> </a>How to Upload a Blob into a Container

To upload a file to a blob, get a container reference and use it to get
a blob reference. Once you have a blob reference, you can upload any
stream of data to it by calling the **UploadFromStream** method on the
blob reference. This operation will create the blob if it didn't exist,
or overwrite it if it did. The below code sample shows this, and assumes
that the container was already created.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob"
    CloudBlob blob = container.GetBlobReference("myblob");

    // Create or overwrite the "myblob" blob with contents from a local file
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        blob.UploadFromStream(fileStream);
    } 

## <a name="list-blob"> </a>How to List the Blobs in a Container

To list the blobs in a container, first get a container reference. You
can then use the container's**ListBlobs**method to retrieve the blobs
within it. The following code demonstrates how to retrieve and output
the **Uri** of each blob in a container:

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Loop over blobs within the container and output the URI to each of them
    foreach (var blobItem in container.ListBlobs())
    {
        Console.WriteLine(blobItem.Uri);
    } 

The blob service has the concept of directories within containers, as
well. This is so that you can organize your blobs in a more folder-like
structure. For example, you could have a container named 'photos', in
which you might upload blobs named 'rootphoto1', '2010/photo1',
'2010/photo2', and '2011/photo1'. This would virtually create the
directories '2010' and '2011' within the 'photos' container. When you
call **ListBlobs** on the 'photos' container, the collection returned
will contain **CloudBlobDirectory** and **CloudBlob** objects
representing the directories and blobs contained at the top level. In
this case, directories '2010' and '2011', as well as photo 'rootphoto1'
would be returned. Optionally, you can pass in a new
**BlobRequestOptions** class with **UseFlatBlobListing** set to
**true**. This would result in every blob being returned, regardless of
directory. For more information, see [CloudBlobContainer.ListBlobs][] on
MSDN.

## <a name="download-blobs"> </a>How to Download Blobs

To download blobs, first retrieve a blob reference. The following
example uses the **DownloadToStream**method to transfer the blob
contents to a stream object that you can then persist to a local file.
You could also call the blob's **DownloadToFile**,**DownloadByteArray**,
or **DownloadText** methods.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob"
    CloudBlob blob = container.GetBlobReference("myblob");

    // Save blob contents to disk
    using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
    {
        blob.DownloadToStream(fileStream);
    } 

## <a name="delete-blobs"> </a>How to Delete Blobs

Finally, to delete a blob, get a blob reference, and then call the
**Delete** method on it.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob"
    CloudBlob blob = container.GetBlobReference("myblob");

    // Delete the blob
    blob.Delete(); 

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Blob Storage]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How To: Programmatically access Blob Storage Using .NET]: #configure-access
  [How To: Create a Container]: #create-container
  [How To: Upload a Blob into a Container]: #upload-blob
  [How To: List the Blobs in a Container]: #list-blob
  [How To: Download Blobs]: #download-blobs
  [How To: Delete a Blob]: #delete-blobs
  [Blob5]: ../../../DevCenter/dotNet/Media/blob5.png
  [Blob6]: ../../../DevCenter/dotNet/Media/blob6.png
  [Blob7]: ../../../DevCenter/dotNet/Media/blob7.png
  [Blob8]: ../../../DevCenter/dotNet/Media/blob8.png
  [Blob9]: ../../../DevCenter/dotNet/Media/blob9.png
  [CloudBlobContainer.ListBlobs]: http://msdn.microsoft.com/en-us/library/windowsazure/ee772878.aspx
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
