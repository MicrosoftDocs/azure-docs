<properties linkid="dev-net-how-to-blob-storage" urldisplayname="Blob Service" headerexpose="" pagetitle="How to Use the Blob Storage Service from .NET" metakeywords="Get started Azure blob, Azure unstructured data, Azure unstructured storage, Azure blob, Azure blob storage, Azure blob .NET, Azure blob storage .NET, Azure blob C#, Azure blob storage C#" footerexpose="" metadescription="Get started using the Windows Azure blob storage service to upload, download, list, and delete blob content." umbraconavihide="0" disquscomments="1"></properties>

<div chunk="../chunks/article-left-menu.md" />

# How to use the Windows Azure Blob Storage Service in .NET

<div class="dev-center-tutorial-selector">
<a href="/en-us/develop/net/how-to-guides/blob-storage-v17/" title="version 1.7">version 1.7</a>
<a href="/en-us/develop/net/how-to-guides/blob-storage/" title="version 2.0" class="current">version 2.0</a> 
</div>


This guide will demonstrate how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written in C\# and
use the Windows Azure Storage Client Library for .NET (Version 2.0). The scenarios covered include
**uploading**, **listing**, **downloading**, and **deleting** blobs. For
more information on blobs, see the [Next steps][] section.

<h2>Table of contents</h2>

-   [What is Blob Storage][]
-   [Concepts][]
-   [Create a Windows Azure Storage account][]
-   [Setup a storage connection string][]
-   [How to: Programmatically access blob storage][]
-   [How to: Create a container][]
-   [How to: Upload a blob into a container][]
-   [How to: List the blobs in a container][]
-   [How to: Download blobs][]
-   [How to: Delete blobs][]
-   [Next steps][]

<div chunk="../../Shared/Chunks/howto-blob-storage.md" />

<h2><a name="create-account"></a><span  class="short-header">Create an account</span>Create a Windows Azure Storage account</h2>
<div chunk="../../Shared/Chunks/create-storage-account.md" />

<h2><a name="setup-connection-string"></a><span  class="short-header">Setup a connection string</span>Setup a storage connection string</h2>

The Windows Azure Storage Client Library for .NET supports using a storage connection
string to configure endpoints and credentials for accessing storage
services. You can put your storage connection string in a configuration
file, rather than hard-coding it in code:

- When using Windows Azure Cloud Services, it is recommended you store your connection string using the Windows Azure service configuration system (`*.csdef` and `*.cscfg` files).
- When using Windows Azure Web Sites, Windows Azure Virtual Machines, or building .NET applications that are intended to run outside of Windows Azure, it is recommended you store your connection string using the .NET configuration system (e.g. `web.config` or `app.config` file).

Retrieval of your connection string is shown later in this guide.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Windows Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Windows Azure Management Portal without redeploying your
application.

To configure your connection string in the Windows Azure service
configuration:

1.  Within the Solution Explorer of Visual Studio, in the **Roles**
    folder of your Windows Azure Deployment Project, right-click your
    web role or worker role and click **Properties**.  
    ![Select the properties on a Cloud Service role in Visual Studio][Blob5]

2.  Click the **Settings** tab and press the **Add Setting** button.  
    ![Add a Cloud Service setting in visual Studio][Blob6]

    A new **Setting1** entry will then show up in the settings grid.

3.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog will open.

5.  Choose whether you want to target the storage emulator (Windows
    Azure storage simulated on your local machine) or an actual storage
    account in the cloud. The code in this guide works with either
    option. Enter the **Primary Access Key** value copied from the
    earlier step in this tutorial if you wish to store blob data in the
    storage account we created earlier on Windows Azure.   
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to a friendlier name
    like **StorageConnectionString**. You will reference this
    connection string later in the code in this guide.  
    ![Blob9][]
	
### Configuring your connection string using .NET configuration

Unless you are using Windows Azure Cloud Services (see previous section), it is recommended you use the .NET configuration system (e.g. `web.config` or `app.config`).  This includes Windows Azure Web Sites or Windows Azure Virtual Machines, as well as applications designed to run outside of Windows Azure.  You store the connection string using the `<connectionStrings>` element as follows:

	<configuration>
	    <connectionStrings>
		    <add name="StorageConnectionString"
			     connectionString="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]" />
		</connectionStrings>
	</configuration>

Read [Configuring Connection Strings][] for more information on storage connection strings.
	
You are now ready to perform the how-to tasks in this guide.

<h2> <a name="configure-access"> </a><span  class="short-header">Access programmatically</span>How to: Programmatically access blob storage</h2>

<h3>Obtaining the assembly</h3>
To obtain version 2.0 of the Windows Azure Storage Client Library, you can use NuGet. Right-click your project in Solution Explorer and choose Manage NuGet Packages. Type "windowsazure.storage" (including the quotes) into the search box to locate the package.

<h3>Namespace declarations</h3>
Add the following namespace declarations to the top of any C\# file
in which you wish to programmatically access Windows Azure Storage:

    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Blob;

<h3>Retrieving your connection string</h3>
You can use the **CloudStorageAccount** type to represent 
your Storage Account information. If you are using a Windows 
Azure project template and/or have a reference to 
Microsoft.WindowsAzure.CloudConfigurationManager, you 
can you use the **CloudConfigurationManager** type
to retrieve your storage connection string and storage account
information from the Windows Azure service configuration:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

If you are creating an application with no reference to Microsoft.WindowsAzure.CloudConfigurationManager, and your connection string is located in the `web.config` or `app.config` as show above, then you can use **ConfigurationManager** to retrieve the connection string.  You will need to add a reference to System.Configuration.dll to your project, and add another namespace declaration for it:

	using System.Configuration;
	...
	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

A **CloudBlobClient** type allows you to retrieve objects that represent
containers and blobs stored within the Blob Storage Service. The
following code creates a **CloudBlobClient** object using the storage
account object we retrieved above:

    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

<h3>ODataLib dependencies</h3>
ODataLib dependencies in the Storage Client Library for .NET are resolved through the ODataLib (version 5.0.2) packages available through NuGet and not WCF Data Services.  The ODataLib libraries can be downloaded directly or referenced by your code project through NuGet.  The specific ODataLib packages are [OData], [Edm], and [Spatial].

<h2> <a name="create-container"> </a><span  class="short-header">Create a container</span>How to: Create a container</h2>

All storage blobs reside in a container. You can use a
**CloudBlobClient** object to get a reference to the container you want
to use. You can create the container if it doesn't exist:

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve a reference to a container. 
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Create the container if it doesn't already exist.
    container.CreateIfNotExists();

By default, the new container is private and you must specify your
storage access key to download blobs from this
container. If you want to make the files within the container available
to everyone, you can set the container to be public using the following
code:

    container.SetPermissions(
        new BlobContainerPermissions { PublicAccess = 
 	    BlobContainerPublicAccessType.Blob }); 

Anyone on the Internet can see blobs in a public container, but you can
modify or delete them only if you have the appropriate access key.

<h2> <a name="upload-blob"> </a><span  class="short-header">Upload to a container</span>How to: Upload a blob into a container</h2>

Windows Azure Blob Storage supports block blobs and page blobs.  In the majority of cases, block blob is the recommended type to use.

To upload a file to a block blob, get a container reference and use it to get
a block blob reference. Once you have a blob reference, you can upload any
stream of data to it by calling the **UploadFromStream** method. This operation will create the blob if it didn't previously exist,
or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

    // Create or overwrite the "myblob" blob with contents from a local file.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        blockBlob.UploadFromStream(fileStream);
    } 

<h2> <a name="list-blob"> </a><span  class="short-header">List blobs in a container</span>How to: List the blobs in a container</h2>

To list the blobs in a container, first get a container reference. You
can then use the container's **ListBlobs** method to retrieve the blobs and/or directories
within it. To access the rich set of properties and methods for a 
returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, 
**CloudPageBlob**, or **CloudBlobDirectory** object.  If the type is unknown, you can use a 
type check to determine which to cast it to.  The following code 
demonstrates how to retrieve and output the URI of each item in 
a container:

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Loop over items within the container and output the length.
    foreach (IListBlobItem item in container.ListBlobs(null, true))
    {
        if (item.GetType() == typeof(CloudBlockBlob))
        {
            Console.WriteLine("It's a block blob of length: " + ((CloudBlockBlob)item).Properties.Length);
        }
        else if (item.GetType() == typeof(CloudPageBlob))
        {
            Console.WriteLine("It's a page blob of length: " + ((CloudPageBlob)item).Properties.Length);
        }
        else if (item.GetType() == typeof(CloudBlobDirectory))
        {
            Console.WriteLine("It's a directory!");
        }
    }

As shown above, the blob service has the concept of directories within containers, as
well. This is so that you can organize your blobs in a more folder-like
structure. For example, consider the following set of block blobs in a container
named `photos`:

	photo1.jpg
	photo2.jpg
	2010/photo3.jpg
	2010/architecture/photo4.jpg
	2010/architecture/photo5.jpg
	2011/photo6.jpg
	2011/photo7.jpg

When you call **ListBlobs** on the 'photos' container (as in the above sample), the collection returned
will contain **CloudBlobDirectory** and **CloudBlockBlob** objects
representing the directories and blobs contained at the top level.
Here is code that would accomplish this:

    foreach (IListBlobItem item in container.ListBlobs(null, false))
    {
        if (item.GetType() == typeof(CloudBlockBlob))
        {
            Console.WriteLine("CloudBlockBlob: {0}", ((CloudBlockBlob)item).Uri);
        }
        else if (item.GetType() == typeof(CloudBlobDirectory))
        {
            Console.WriteLine("CloudBlobDirectory: {0}", ((CloudBlobDirectory)item).Uri);
        }
    }

Here would be the resulting output:

	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/photo1.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/photo2.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/photo3.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo4.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo5.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2011/photo6.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2011/photo7.jpg



Optionally, you can set the **UseFlatBlobListing** parameter of of the **ListBlobs** method to 
**true**. This would result in every blob being returned as a **CloudBlockBlob**
, regardless of directory.  Here would be the call to **ListBlobs**:

    foreach (CloudBlockBlob blob in container.ListBlobs(null, true))
    {
        Console.WriteLine("CloudBlockBlob: {0}", blob.Uri);
    }

and here would be the results:

	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/photo1.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/photo2.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/photo3.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo4.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo5.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2011/photo6.jpg
	CloudBlockBlob: https://<accountname>.blob.core.windows.net/photos/2011/photo7.jpg

For more information, see [CloudBlobContainer.ListBlobs][].

<h2> <a name="download-blobs"> </a><span  class="short-header">Download blobs</span>How to: Download blobs</h2>

To download blobs, first retrieve a blob reference. The following
example uses the **DownloadToStream** method to transfer the blob
contents to a stream object that you can then persist to a local file.
You could also call the blob's **DownloadToFile**, **DownloadByteArray**,
or **DownloadText** methods.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob.txt".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

    // Save blob contents to disk.
    using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
    {
        blockBlob.DownloadToStream(fileStream);
    } 

<h2> <a name="delete-blobs"> </a><span  class="short-header">Delete blobs</span>How to: Delete blobs</h2>

To delete a blob, first get a blob reference and then call the
**Delete** method on it.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob.txt".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

    // Delete the blob.
    blockBlob.Delete(); 

<h2> <a name="next-steps"></a><span  class="short-header">Next steps</span>Next steps</h2>

Now that you've learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.
<ul>
<li>View the blob service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/wl_svchosting_mref_reference_home">.NET client library reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179355">REST API reference</a></li>
  </ul>
</li>
<li>Learn about more advanced tasks you can perform with Windows Azure Storage at <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a>.</li>
<li>View more feature guides to learn about additional options for storing data in Windows Azure.
  <ul>
    <li>Use <a href="/en-us/develop/net/how-to-guides/table-services/">Table Storage</a> to store structured data.</li>
    <li>Use <a href="/en-us/develop/net/how-to-guides/sql-database/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>

  [Next Steps]: #next-steps
  [What is Blob Storage]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Setup a storage Connection String]: #setup-connection-string
  [How To: Programmatically access Blob Storage]: #configure-access
  [How To: Create a Container]: #create-container
  [How To: Upload a Blob into a Container]: #upload-blob
  [How To: List the Blobs in a Container]: #list-blob
  [How To: Download Blobs]: #download-blobs
  [How To: Delete blobs]: #delete-blobs
  [Blob5]: ../../../DevCenter/dotNet/Media/blob5.png
  [Blob6]: ../../../DevCenter/dotNet/Media/blob6.png
  [Blob7]: ../../../DevCenter/dotNet/Media/blob7.png
  [Blob8]: ../../../DevCenter/dotNet/Media/blob8.png
  [Blob9]: ../../../DevCenter/dotNet/Media/blob9.png
  [CloudBlobContainer.ListBlobs]: http://msdn.microsoft.com/en-us/library/windowsazure/ee772878.aspx
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [.NET client library reference]: http://msdn.microsoft.com/en-us/library/windowsazure/wl_svchosting_mref_reference_home
  [REST API reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dd179355
  [OData]: http://nuget.org/packages/Microsoft.Data.OData/5.0.2
  [Edm]: http://nuget.org/packages/Microsoft.Data.Edm/5.0.2
  [Spatial]: http://nuget.org/packages/System.Spatial/5.0.2