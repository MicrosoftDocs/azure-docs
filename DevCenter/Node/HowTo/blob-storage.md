<properties linkid="dev-nodejs-how-to-blob-storage" urldisplayname="Blob Service" headerexpose pagetitle="How to Use the Blob Storage Service from Node.js" metakeywords="Azure unstructured data Node.js, Azure unstructured storage Node.js, Azure blob Node.js, Azure blob storage Node.js" footerexpose metadescription="Learn how to use the Windows Azure blob storage service to upload, download, list, and delete blob content from your Node.js application." umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Blob Storage Service from Node.js

This guide will show you how to perform common scenarios using the
Windows Azure Blob storage service. The samples are written using the
Node.js API. The scenarios covered include **uploading**,**listing**,
**downloading**, and **deleting** blobs. For more information on blobs,
see the [Next Steps][] section.

## Table of Contents

[What is Blob Storage?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
 [Create a Node.js Application][]   
 [Configure your Application to Access Storage][]   
 [Setup a Windows Azure Storage Connection String][]   
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

2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account**dialog box opens.   
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

8.  Finally, take note of your**Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.   
    ![Blob4][]

## <a name="create-app"> </a>Create a Node.js Application

Create a blank tasklist application using the **Windows PowerShell for
Node.js** command window at the location **c:\\node\\tasklist**. For
instructions on how to use the PowerShell commands to create a blank
application, see the [Node.js Web Application][].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use the **Windows PowerShell for Node.js** command window to
    navigate to the **c:\\node\\tasklist\\WebRole1** folder where you
    created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.5.0 ./node_modules/azure
        ├── xmlbuilder@0.3.1
        ├── mime@1.2.4
        ├── xml2js@0.1.12
        ├── qs@0.4.0
        ├── log@1.2.0
        └── sax@0.3.4

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection

If you are running against the storage emulator on the local machine,
you do not need to configure a connection string, as it will be
configured automatically. You can continue to the next section.

If you are planning to run against the real Windows Azure storage
service, you need to modify your connection string to point at your
cloud-based storage. You can store the storage connection string in a
configuration file, rather than hard-coding it in code. In this how-to,
you use the Web.cloud.config file, which is created when you create a
Windows Azure web role.

1.  Use a text editor to open
    **c:\\node\\tasklist\\WebRole1\\Web.cloud.config**

2.  Add the following inside the **configuration** element

        <appSettings>
            <add key="AZURE_STORAGE_ACCOUNT" value="your storage account" />
            <add key="AZURE_STORAGE_ACCESS_KEY" value="your storage access key" />
        </appSettings>

Note that the examples below assume that you are using cloud-based
storage.

## <a name="create-container"> </a>How to: Create a Container

The **BlobService** object lets you work with containers and blobs. The
following code creates a **BlobService** object. Add the following near
the top of **server.js**:

    var blobService = azure.createBlobService();

All blobs reside in a container. The call to
**createContainerIfNotExists** on the **BlobService** object will return
the specified container if it exists or create a new container with the
specified name if it does not already exist. By default, the new
container is private, so you must specify your storage account key (as
you did above) to download blobs from this container. Modify the
existing call to **createServer** as follows:

    var containerName = 'taskcontainer';

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

If you want to make the files in the container public, you can set the
container’s permissions. You could have done that in the previous
snippet simply by modifying the container creation method call to pass
the public access level as a parameter:

    blobService.createContainerIfNotExists(
        containerName, 
        {publicAccessLevel : 'blob'}, 
         containerCreatedOrExists);

Alternatively, you can modify container after you created it by
replacing the res.end() line indicated by comment \#1 above with the
following code:

    blobService.setContainerAcl(containerName, 'blob', containerAclSet);

You also need to add the following callback in the place of the comment
marked with \#2:

    function containerAclSet(error, serverContainer){
        if(error === null){
            res.end('Successfully made ' + serverContainer.publicAccessLevel + 
                    ' public\r\n');
        } else {
            res.end('Could not make container public: ' + error.Code);
        }
    }

After this change, anyone on the Internet can see blobs in a public
container, but only you can modify or delete them.

## <a name="upload-blob"> </a>How to: Upload a Blob into a Container

To upload a file to a blob, use the **createBlockBlobFromStream** method
to create the blob, using a file stream as the contents of the blob.
First, create a file called **task1.txt** (arbitrary content is fine)
and store it in the same directory as your **server.js** file. To be
able to load the file into a stream from Node.js, you need to add
**require(‘fs’)** at the top of the example in order to load the file
system package.

    var http = require('http');
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

## <a name="list-blob"> </a>How to: List the Blobs in a Container

To list the blobs in a container, use the **listBlobs** method with a
**for** loop to display the name of each blob in the container. The
following code outputs the **name** of each blob in a container to the
console.

    var http = require('http');
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

## <a name="download-blobs"> </a>How to: Download Blobs

To download blobs, use the **getBlobToStream** method to transfer the
blob contents to a stream object that you can then persist to a local
file. You could also call **getBlobToFile** or **getBlobToText**.

    var http = require('http');
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

## <a name="delete-blobs"> </a>How to: Delete a Blob

Finally, to delete a blob, call **deleteBlob**.

    var http = require('http');
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

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of blob storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Blob Storage?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
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
  [Node.js Web Application]: {localLink:2221} "Node.js Web Application"
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
