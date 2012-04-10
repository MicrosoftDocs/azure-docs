<properties
linkid=dev-net-how-to-blob-storage
urlDisplayName=Blob Service
headerExpose=
pageTitle=How to Use the Blob Storage Service from .NET
metaKeywords=Get started Azure blob, Azure unstructured data, Azure unstructured storage, Azure blob, Azure blob storage, Azure blob .NET, Azure blob storage .NET, Azure blob C#, Azure blob storage C#
footerExpose=
metaDescription=Get started using the Windows Azure blob storage service to upload, download, list, and delete blob content.
umbracoNaviHide=0
disqusComments=1
/>
<h1>How to Use the Blob Storage Service</h1>
<p>This guide will demonstrate how to perform common scenarios using the Windows Azure Blob storage service. The samples are written in C# and use the .NET API. The scenarios covered include <strong>uploading</strong>,<strong> listing</strong>, <strong>downloading</strong>, and <strong>deleting</strong> blobs. For more information on blobs, see the <a href="#next-steps">Next Steps</a> section.</p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#what-is">What is Blob Storage</a></li>
<li><a href="#concepts">Concepts</a></li>
<li><a href="#create-account">Create a Windows Azure Storage Account</a></li>
<li><a href="#setup-connection-string">Setup a Windows Azure Storage Connection String</a></li>
<li><a href="#configure-access">How To: Programmatically access Blob Storage Using .NET</a></li>
<li><a href="#create-container">How To: Create a Container</a></li>
<li><a href="#upload-blob">How To: Upload a Blob into a Container</a></li>
<li><a href="#list-blob">How To: List the Blobs in a Container</a></li>
<li><a href="#download-blobs">How To: Download Blobs</a></li>
<li><a href="#delete-blobs">How To: Delete a Blob</a></li>
<li><a href="#next-steps">Next Steps</a></li>
</ul>
<h2><a name="what-is"></a>What is Blob Storage</h2>
<p>Windows Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a single storage account can contain up to 100TB of blobs. Common uses of Blob storage include:</p>
<ul>
<li>Serving images or documents directly to a browser</li>
<li>Storing files for distributed access</li>
<li>Streaming video and audio</li>
<li>Performing secure backup and disaster recovery</li>
<li>Storing data for analysis by an on-premise or Windows Azure-hosted service</li>
</ul>
<p>You can use Blob storage to expose data publicly to the world or privately for internal application storage.</p>
<h2><a name="concepts"></a>Concepts</h2>
<p>The Blob service contains the following components:</p>
<p><img src="/media/blob1.jpg" alt="Blob1"/></p>
<ul>
<li>
<p><strong>Storage Account:</strong> All access to Windows Azure Storage is done through a storage account. This is the highest level of the namespace for accessing blobs. An account can contain an unlimited number of containers, as long as their total size is under 100TB.</p>
</li>
<li>
<p><strong>Container:</strong> A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs.</p>
</li>
<li>
<p><strong>Blob:</strong> A file of any type and size. There are two types of blobs that can be stored in Windows Azure Storage: block and page blobs. Most files are block blobs. A single block blob can be up to 200GB in size. This tutorial uses block blobs. Page blobs, another blob type, can be up to 1TB in size, and are more efficient when ranges of bytes in a file are modified frequently. For more information about blobs, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee691964.aspx">Understanding Block Blobs and Page Blobs</a>.</p>
</li>
<li>
<p><strong>URL format:</strong> Blobs are addressable using the following URL format: <br />http://&lt;storage account&gt;.blob.core.windows.net/&lt;container&gt;/&lt;blob&gt;<br /><br />The following URL could be used to address one of the blobs in the diagram above:<br />http://sally.blob.core.windows.net/movies/MOV1.AVI</p>
</li>
</ul>
<h2><a name="create-account"></a>Create a Windows Azure Storage Account</h2>
<p>You need a Windows Azure storage account to use the blob storage service. You can manually create a storage account by following the below steps (you can also programmatically create a storage account <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx" target="_blank">using the REST API</a>):</p>
<ol>
<li>
<p>Log into the <a href="http://windows.azure.com" target="_blank">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>In the navigation pane, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</p>
</li>
<li>
<p>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</p>
</li>
<li>
<p>On the ribbon, in the Storage group, click <strong>New Storage Account</strong>. <br /><img src="/media/java/WA_HowToBlobStorage2.png" alt="Blob2"/><br /><br />The <strong>Create a New Storage Account </strong>dialog box will then open: <br /><img src="/media/java/WA_HowToBlobStorage3.png" alt="Blob3"/></p>
</li>
<li>
<p>In <strong>Choose a Subscription</strong>, select the account subscription that the storage account will be used with.</p>
</li>
<li>
<p>In <strong>Enter a URL</strong>, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.</p>
</li>
<li>
<p>Choose a region or an affinity group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.</p>
</li>
<li>
<p>Click <strong>OK</strong>.</p>
</li>
<li>
<p>Click the <strong>View</strong> button in the right-hand column below to display and save the <strong>Primary access key</strong> for the storage account. You will need this in subsequent steps to access storage. <br /><img src="/media/java/WA_HowToBlobStorage4.png" alt="Blob4"/></p>
</li>
</ol>
<h2><a name="setup-connection-string"></a>Setup a Windows Azure Storage Connection String</h2>
<p>The Windows Azure .NET storage API supports using a storage connection string to configure endpoints and credentials for accessing storage services. You can put your storage connection string in a configuration file, rather than hard-coding it in code. In this guide, you will store your connection string using the Windows Azure service configuration system. This service configuration mechanism is unique to Windows Azure projects and enables you to dynamically change configuration settings from the Windows Azure Management Portal without redeploying your application.</p>
<p>To configure your connection string in the Windows Azure service configuration:</p>
<ol>
<li>
<p>Within the Solution Explorer of Visual Studio, in the <strong>Roles</strong> folder of your Windows Azure Deployment Project, right-click your web role or worker role and click <strong>Properties</strong>.<br /><img src="/media/net/how-to-blob5.png" alt="Blob5"/></p>
</li>
<li>
<p>Click the <strong>Settings</strong> tab and press the <strong>Add Setting</strong> button.<br /><img src="/media/net/how-to-blob6.png" alt="Blob6"/></p>
<p>A new <strong>Setting1</strong> entry will then show up in the settings grid.</p>
</li>
<li>
<p>In the <strong>Type</strong> drop-down of the new <strong>Setting1</strong> entry, choose <strong>Connection String</strong>.<br /><img src="/media/net/how-to-blob7.png" alt="Blob7"/></p>
</li>
<li>
<p>Click the <strong>...</strong> button at the right end of the <strong>Setting1</strong> entry. The <strong>Storage Account Connection String</strong> dialog will open.</p>
</li>
<li>
<p>Choose whether you want to target the storage emulator (the Windows Azure storage simulated on your local machine) or an actual storage account in the cloud. The code in this guide works with either option. Enter the <strong>Primary Access Key</strong> value copied from the earlier step in this tutorial if you wish to store blob data in the storage account we created earlier on Windows Azure. <br /><img src="/media/net/how-to-blob8.png" alt="Blob8"/></p>
</li>
<li>
<p>Change the entry <strong>Name</strong> from <strong>Setting1</strong> to a "friendlier" name like <strong>StorageConnectionString</strong>. You will reference this connectionstring later in the code in this guide.<br /><img src="/media/net/how-to-blob9.png" alt="Blob9"/></p>
</li>
</ol>
<p>You are now ready to perform the How To's in this guide.</p>
<h2><a name="configure-access"></a>How to Programmatically access Blob Storage Using .NET</h2>
<p>Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Windows Azure Storage:</p>
<pre class="prettyprint">using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;</pre>
<p>You can use the <strong>CloudStorageAccount</strong> type and <strong>RoleEnvironment </strong>type to retrieve your storage connection-string and storage account information from the Windows Azure service configuration:</p>
<pre class="prettyprint">CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));</pre>
<p>A <strong>CloudBlobClient</strong> type allows you to retrieve objects that represent containers and blobs stored within the Blob Storage Service. The following code creates a <strong>CloudBlobClient</strong> object using the storage account object we retrieved above:</p>
<pre class="prettyprint">CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();</pre>
<h2><a name="create-container"></a>How to Create a Container</h2>
<p>All storage blobs reside in a container. You can use a <strong>CloudBlobClient</strong> object to get a reference to the container you want to use. You can create the container if it doesn't exist:</p>
<pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the blob client 
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Retrieve a reference to a container 
CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

// Create the container if it doesn't already exist
container.CreateIfNotExist();</pre>
<p>By default, the new container is private, so you must specify your storage account key (as you did above) to download blobs from this container. If you want to make the files within the container available to everyone, you can set the container to be public using the following code:</p>
<pre class="prettyprint">container.SetPermissions(
   new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob }); </pre>
<p>Anyone on the Internet can see blobs in a public container, but you can modify or delete them only if you have the appropriate access key.</p>
<h2><a name="upload-blob"></a>How to Upload a Blob into a Container</h2>
<p>To upload a file to a blob, get a container reference and use it to get a blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the <strong>UploadFromStream</strong> method on the blob reference. This operation will create the blob if it didn't exist, or overwrite it if it did. The below code sample shows this, and assumes that the container was already created.</p>
<pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

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
} </pre>
<h2><a name="list-blob"></a>How to List the Blobs in a Container</h2>
<p>To list the blobs in a container, first get a container reference. You can then use the container's<strong> ListBlobs </strong>method to retrieve the blobs within it. The following code demonstrates how to retrieve and output the <strong>Uri</strong> of each blob in a container:</p>
<pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the blob client
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Retrieve reference to a previously created container
CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

// Loop over blobs within the container and output the URI to each of them
foreach (var blobItem in container.ListBlobs())
{
    Console.WriteLine(blobItem.Uri);
} </pre>
<p>The blob service has the concept of directories within containers, as well. This is so that you can organize your blobs in a more folder-like structure. For example, you could have a container named 'photos', in which you might upload blobs named 'rootphoto1', '2010/photo1', '2010/photo2', and '2011/photo1'. This would virtually create the directories '2010' and '2011' within the 'photos' container. When you call <strong>ListBlobs</strong> on the 'photos' container, the collection returned will contain <strong>CloudBlobDirectory</strong> and <strong>CloudBlob</strong> objects representing the directories and blobs contained at the top level. In this case, directories '2010' and '2011', as well as photo 'rootphoto1' would be returned. Optionally, you can pass in a new <strong>BlobRequestOptions</strong> class with <strong>UseFlatBlobListing</strong> set to <strong>true</strong>. This would result in every blob being returned, regardless of directory. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee772878.aspx">CloudBlobContainer.ListBlobs</a> on MSDN.</p>
<h2><a name="download-blobs"></a>How to Download Blobs</h2>
<p>To download blobs, first retrieve a blob reference. The following example uses the <strong>DownloadToStream </strong>method to transfer the blob contents to a stream object that you can then persist to a local file. You could also call the blob's <strong>DownloadToFile</strong>,<strong> DownloadByteArray</strong>, or <strong>DownloadText</strong> methods.</p>
<pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

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
} </pre>
<h2><a name="delete-blobs"></a>How to Delete Blobs</h2>
<p>Finally, to delete a blob, get a blob reference, and then call the <strong>Delete</strong> method on it.</p>
<pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the blob client
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

// Retrieve reference to a previously created container
CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

// Retrieve reference to a blob named "myblob"
CloudBlob blob = container.GetBlobReference("myblob");

// Delete the blob
blob.Delete(); </pre>
<h2><a name="next-steps"></a>Next Steps</h2>
<p>Now that you've learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.</p>
<ul>
<li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
<li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
</ul>