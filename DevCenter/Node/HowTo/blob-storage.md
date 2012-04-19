<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-nodejs-how-to-blob-storage" urlDisplayName="Blob Service" headerExpose="" pageTitle="How to Use the Blob Storage Service from Node.js" metaKeywords="Azure unstructured data Node.js, Azure unstructured storage Node.js, Azure blob Node.js, Azure blob storage Node.js" footerExpose="" metaDescription="Learn how to use the Windows Azure blob storage service to upload, download, list, and delete blob content from your Node.js application." umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the Blob Storage Service from Node.js</h1>
  <p>This guide will show you how to perform common scenarios using the Windows Azure Blob storage service. The samples are written using the Node.js API. The scenarios covered include <strong>uploading</strong>,<strong> listing</strong>, <strong>downloading</strong>, and <strong>deleting</strong> blobs. For more information on blobs, see the <a href="#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#what-is">What is Blob Storage?</a>
    <br />
    <a href="#concepts">Concepts</a>
    <br />
    <a href="#create-account">Create a Windows Azure Storage Account</a>
    <br />
    <a href="#create-app">Create a Node.js Application</a>
    <br />
    <a href="#configure-access">Configure your Application to Access Storage</a>
    <br />
    <a href="#setup-connection-string">Setup a Windows Azure Storage Connection String</a>
    <br />
    <a href="#create-container">How To: Create a Container</a>
    <br />
    <a href="#upload-blob">How To: Upload a Blob into a Container</a>
    <br />
    <a href="#list-blob">How To: List the Blobs in a Container</a>
    <br />
    <a href="#download-blobs">How To: Download Blobs</a>
    <br />
    <a href="#delete-blobs">How To: Delete a Blob</a>
    <br />
    <a href="#next-steps">Next Steps</a>
  </p>
  <h2>
    <a name="what-is">
    </a>What is Blob Storage?</h2>
  <p>Windows Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be hundreds of gigabytes in size, and a single storage account can contain up to 100TB of blobs. Common uses of Blob storage include:</p>
  <ul>
    <li>Serving images or documents directly to a browser</li>
    <li>Storing files for distributed access</li>
    <li>Streaming video and audio</li>
    <li>Performing secure backup and disaster recovery</li>
    <li>Storing data for analysis by an on-premise or Windows Azure-hosted service</li>
  </ul>
  <p>You can use Blob storage to expose data publicly to the world or privately for internal application storage.</p>
  <h2>
    <a name="concepts">
    </a>Concepts</h2>
  <p>The Blob service contains the following components:</p>
  <p>
    <img src="../../../DevCenter/Shared/media/blob1.jpg" alt="Blob1" />
  </p>
  <ul>
    <li>
      <p>
        <strong>URL format:</strong> Blobs are addressable using the following URL format: <br />http://&lt;storage account&gt;.blob.core.windows.net/&lt;container&gt;/&lt;blob&gt;<br /><br />The following URL addresses one of the blobs in the diagram:<br />http://sally.blob.core.windows.net/movies/MOV1.AVI</p>
    </li>
    <li>
      <p>
        <strong>Storage Account:</strong> All access to Windows Azure Storage is done through a storage account. This is the highest level of the namespace for accessing blobs. An account can contain an unlimited number of containers, as long as their total size is under 100TB.</p>
    </li>
    <li>
      <p>
        <strong>Container:</strong> A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs.</p>
    </li>
    <li>
      <p>
        <strong>Blob:</strong> A file of any type and size. There are two types of blobs that can be stored in Windows Azure Storage. Most files are block blobs. A single block blob can be up to 200GB in size. This tutorial uses block blobs. Page blobs, another blob type, can be up to 1TB in size, and are more efficient when ranges of bytes in a file are modified frequently.</p>
    </li>
  </ul>
  <h2>
    <a name="create-account">
    </a>Create a Windows Azure Storage Account</h2>
  <p>To use storage operations, you need a Windows Azure storage account. You can create a storage account by following these steps. (You can also create a storage account <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx" target="_blank">using the REST API</a>.)</p>
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
      <p>On the ribbon, in the Storage group, click <strong>New Storage Account</strong>. <br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage2.png" alt="Blob2" /><br /><br />The <strong>Create a New Storage Account </strong>dialog box opens. <br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage3.png" alt="Blob3" /></p>
    </li>
    <li>
      <p>In <strong>Choose a Subscription</strong>, select the subscription that the storage account will be used with.</p>
    </li>
    <li>
      <p>In Enter a URL, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.</p>
    </li>
    <li>
      <p>Choose a country/region or an affinity group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.</p>
    </li>
    <li>
      <p>Finally, take note of your<strong> Primary access key</strong> in the right-hand column. You will need this in subsequent steps to access storage. <br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage4.png" alt="Blob4" /></p>
    </li>
  </ol>
  <h2>
    <a name="create-app">
    </a>Create a Node.js Application</h2>
  <p>Create a blank tasklist application using the <strong>Windows PowerShell for Node.js</strong> command window at the location <strong>c:\node\tasklist</strong>. For instructions on how to use the PowerShell commands to create a blank application, see the <a href="{localLink:2221}" title="Node.js Web Application">Node.js Web Application</a>.</p>
  <h2>
    <a name="configure-access">
    </a>Configure Your Application to Access Storage</h2>
  <p>To use Windows Azure storage, you need to download and use the Node.js azure package, which includes a set of convenience libraries that communicate with the storage REST services.</p>
  <h3>Use Node Package Manager (NPM) to obtain the package</h3>
  <ol>
    <li>
      <p>Use the <strong>Windows PowerShell for Node.js</strong> command window to navigate to the <strong>c:\node\tasklist\WebRole1</strong> folder where you created your sample application.</p>
    </li>
    <li>
      <p>Type <strong>npm install azure</strong> in the command window, which should result in the following output:</p>
      <pre class="prettyprint">azure@0.5.0 ./node_modules/azure
├── xmlbuilder@0.3.1
├── mime@1.2.4
├── xml2js@0.1.12
├── qs@0.4.0
├── log@1.2.0
└── sax@0.3.4
</pre>
    </li>
    <li>
      <p>You can manually run the <strong>ls</strong> command to verify that a <strong>node_modules</strong> folder was created. Inside that folder find the <strong>azure</strong> package, which contains the libraries you need to access storage.</p>
    </li>
  </ol>
  <h3>Import the package</h3>
  <p>Using Notepad or another text editor, add the following to the top the <strong>server.js</strong> file of the application where you intend to use storage:</p>
  <pre class="prettyprint">var azure = require('azure');
</pre>
  <h2>
    <a name="setup-connection-string">
    </a>Setup a Windows Azure Storage Connection</h2>
  <p>If you are running against the storage emulator on the local machine, you do not need to configure a connection string, as it will be configured automatically. You can continue to the next section.</p>
  <p>If you are planning to run against the real Windows Azure storage service, you need to modify your connection string to point at your cloud-based storage. You can store the storage connection string in a configuration file, rather than hard-coding it in code. In this how-to, you use the Web.cloud.config file, which is created when you create a Windows Azure web role.</p>
  <ol>
    <li>
      <p>Use a text editor to open <strong>c:\node\tasklist\WebRole1\Web.cloud.config</strong></p>
    </li>
    <li>
      <p>Add the following inside the <strong>configuration</strong> element</p>
      <pre class="prettyprint">&lt;appSettings&gt;
    &lt;add key="AZURE_STORAGE_ACCOUNT" value="your storage account" /&gt;
    &lt;add key="AZURE_STORAGE_ACCESS_KEY" value="your storage access key" /&gt;
&lt;/appSettings&gt;
</pre>
    </li>
  </ol>
  <p>Note that the examples below assume that you are using cloud-based storage.</p>
  <h2>
    <a name="create-container">
    </a>How to: Create a Container</h2>
  <p>The <strong>BlobService</strong> object lets you work with containers and blobs. The following code creates a <strong>BlobService</strong> object. Add the following near the top of <strong>server.js</strong>:</p>
  <pre class="prettyprint">var blobService = azure.createBlobService();
</pre>
  <p>All blobs reside in a container. The call to <strong>createContainerIfNotExists</strong> on the <strong>BlobService</strong> object will return the specified container if it exists or create a new container with the specified name if it does not already exist. By default, the new container is private, so you must specify your storage account key (as you did above) to download blobs from this container. Modify the existing call to <strong>createServer</strong> as follows:</p>
  <pre class="prettyprint">var containerName = 'taskcontainer';

http.createServer(function serverCreated(req, res) {
    blobService.createContainerIfNotExists(containerName, null, 
                                           containerCreatedOrExists);

    function containerCreatedOrExists(error)
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if(error === null){
            res.write('Using container ' + containerName + '\r\n');

            // #1 Remove the following line in a later step to set permissions.
            res.end();
        } else {
            res.end('Could not use container: ' + error.Code);
        }
    }

    // #2 In a later step, place permissions callback here.

}).listen(port);
</pre>
  <p>If you want to make the files in the container public, you can set the container’s permissions. You could have done that in the previous snippet simply by modifying the container creation method call to pass the public access level as a parameter:</p>
  <pre class="prettyprint">blobService.createContainerIfNotExists(
    containerName, 
    {publicAccessLevel : 'blob'}, 
     containerCreatedOrExists);
</pre>
  <p>Alternatively, you can modify container after you created it by replacing the res.end() line indicated by comment #1 above with the following code:</p>
  <pre class="prettyprint">blobService.setContainerAcl(containerName, 'blob', containerAclSet);
</pre>
  <p>You also need to add the following callback in the place of the comment marked with #2:</p>
  <pre class="prettyprint">function containerAclSet(error, serverContainer){
    if(error === null){
        res.end('Successfully made ' + serverContainer.publicAccessLevel + 
                ' public\r\n');
    } else {
        res.end('Could not make container public: ' + error.Code);
    }
}
</pre>
  <p>After this change, anyone on the Internet can see blobs in a public container, but only you can modify or delete them.</p>
  <h2>
    <a name="upload-blob">
    </a>How to: Upload a Blob into a Container</h2>
  <p>To upload a file to a blob, use the <strong>createBlockBlobFromStream</strong> method to create the blob, using a file stream as the contents of the blob. First, create a file called <strong>task1.txt</strong> (arbitrary content is fine) and store it in the same directory as your <strong>server.js</strong> file. To be able to load the file into a stream from Node.js, you need to add <strong>require(‘fs’)</strong> at the top of the example in order to load the file system package.</p>
  <pre class="prettyprint">var http = require('http');
var azure = require('azure');
var fs = require('fs');
var port = process.env.port || 1337;

var blobService = azure.createBlobService();
var containerName = 'taskcontainer';
  
http.createServer(function serverCreated(req, res) {
    blobService.createContainerIfNotExists(containerName, 
                                           {publicAccessLevel : 'blob'}, 
                                            containerCreatedOrExists);

    function containerCreatedOrExists(error)
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if(error === null){
            res.write('Using container ' + containerName + '\r\n');
	    
            var blobName = 'task1.txt';
            blobService.createBlockBlobFromStream(containerName, blobName, 
                                                  fs.createReadStream('task1.txt'), 
                                                  14, null, blobCreated);
        } else {
            res.end('Could not use container: ' + error.Code);
        }
    }

    function blobCreated(error, serverBlob)
    {
        if(error === null)
        {
            res.end("Successfully uploaded blob " + serverBlob.blob + '\r\n');
        } else {
            res.end('Could not upload blob: ' + error.Code);
        }
    }

}).listen(port);
</pre>
  <h2>
    <a name="list-blob">
    </a>How to: List the Blobs in a Container</h2>
  <p>To list the blobs in a container, use the <strong>listBlobs</strong> method with a <strong>for</strong> loop to display the name of each blob in the container. The following code outputs the <strong>name</strong> of each blob in a container to the console.</p>
  <pre class="prettyprint">var http = require('http');
var azure = require('azure');
var port = process.env.port || 1337;

var blobService = azure.createBlobService();
var containerName = 'taskcontainer';
  
http.createServer(function serverCreated(req, res) {
    blobService.createContainerIfNotExists(containerName, null, 
                                           containerCreatedOrExists);

    function containerCreatedOrExists(error)
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if(error === null){
            res.write('Using container ' + containerName + '\r\n');	    
	    
            blobService.listBlobs(containerName, null, blobsListed);
        } else {
            res.end('Could not use container: ' + error.Code);
        }
    }

    function blobsListed(error, blobList)
    {
        if(error === null){
            res.write('Successfully listed blobs in ' + containerName + 
                      ':\r\n');
            for(var index in blobList){
                res.write(blobList[index].name + ' ');
            }
            res.end();
        } else {
            res.end('Could not list blobs: ' + error.Code);
        }
    }
}).listen(port);
</pre>
  <h2>
    <a name="download-blobs">
    </a>How to: Download Blobs</h2>
  <p>To download blobs, use the <strong>getBlobToStream</strong> method to transfer the blob contents to a stream object that you can then persist to a local file. You could also call <strong>getBlobToFile</strong> or <strong>getBlobToText</strong>.</p>
  <pre class="prettyprint">var http = require('http');
var azure = require('azure');
var fs = require('fs');
var port = process.env.port || 1337;

var blobService = azure.createBlobService();
var containerName = 'taskcontainer';
  
http.createServer(function serverCreated(req, res) {
    blobService.createContainerIfNotExists(containerName, null, 
                                           containerCreatedOrExists);

    function containerCreatedOrExists(error)
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if(error === null){
            res.write('Using container ' + containerName + '\r\n');
	    
            var blobName = 'task1.txt';
            blobService.getBlobToStream(containerName, blobName, 
                                        fs.createWriteStream('task2.txt'), 
                                        null, blobGetCompleted);
        } else {
            res.end('Could not use container: ' + error.Code);
        }
    }

    function blobGetCompleted(error, serverBlob)
    {
        if(error === null)
        {
            res.end("Successfully downloaded blob " + serverBlob.blob + '\r\n');
        } else {
            res.end('Could not download blob: ' + error.Code);
        }
    }
}).listen(port);
</pre>
  <h2>
    <a name="delete-blobs">
    </a>How to: Delete a Blob</h2>
  <p>Finally, to delete a blob, call <strong>deleteBlob</strong>.</p>
  <pre class="prettyprint">var http = require('http');
var azure = require('azure');
var port = process.env.port || 1337;

var blobService = azure.createBlobService();

var containerName = 'taskcontainer';
var blobName = 'task1.txt';
	
http.createServer(function serverCreated(req, res) {
    blobService.createContainerIfNotExists(containerName, null, 
                                           containerCreatedOrExists);

    function containerCreatedOrExists(error)
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if(error === null){
            res.write('Using container ' + containerName + '\r\n');
	    
            blobService.deleteBlob(containerName, blobName, null, blobDeleted);
        } else {
            res.end('Could not use container: ' + error.Code);
        }
    }

    function blobDeleted(error)
    {
        if(error === null)
        {
            res.end("Successfully deleted blob " + blobName + '\r\n');
        } else {
            res.end('Could not delete blob: ' + error.Code);
        }
    }
}).listen(port);
</pre>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of blob storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>
</body>