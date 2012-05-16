<properties linkid="dev-nodejs-how-to-service-bus-queues" urldisplayname="Queue Service" headerexpose="" pagetitle="Queue Service - How To - Node.js - Develop" metakeywords="Azure asynchronous processing Node.js, Azure queue Node.js, Azure queue storage Node.js" footerexpose="" metadescription="Learn how to use the Windows Azure queue service to create and delete queues and insert, peek, get, and delete queue messages from your Node.js application." umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Queue Service from Node.js

This guide shows you how to perform common scenarios using the Windows
Azure Queue service. The samples are written using the Node.js
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting**queue messages, as well as **creating and
deleting queues**. For more information on queues, refer to the [Next
Steps][] section.

## Table of Contents

[What is Queue Storage?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
 [Create a Node.js Application][]   
 [Configure your Application to Access Storage][]   
 [Setup a Windows Azure Storage Connection String][]   
 [How To: Create a Queue][]   
 [How To: Insert a Message into a Queue][]   
 [How To: Peek at the Next Message][]   
 [How To: Dequeue the Next Message][]   
 [How To: Change the Contents of a Queued Message][]   
 [How To: Additional Options for Dequeuing Messages][]   
 [How To: Get the Queue Length][]   
 [How To: Delete a Queue][]   
 [Next Steps][]

## <a name="what-is"> </a>What is Queue Storage?

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of Queue
storage include:

-   <span>Creating a backlog of work to process asynchronously</span>
-   Passing messages from a Windows Azure web role to a worker role

## <a name="concepts"> </a>Concepts

The Queue service contains the following components:

![Queue1][]

-   **URL format:** Queues are addressable using the following URL
    format:   
    http://<storage account\>.queue.core.windows.net/<queue\>  
      
    The following URL addresses one of the queues in the diagram:  
    http://myaccount.queue.core.windows.net/imagesToDownload

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. A storage account is the highest level of
    the namespace for accessing queues. The total size of blob, table,
    and queue contents in a storage account cannot exceed 100TB.

-   **Queue:** A queue contains a set of messages. All messages must be
    in a queue.

-   **Message:** A message, in any format, of up to 64KB.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][plus-new]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

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
        +-- xmlbuilder@0.3.1
        +-- mime@1.2.4
        +-- xml2js@0.1.12
        +-- qs@0.4.0
        +-- log@1.2.0
        +-- sax@0.3.4

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure** package, which contains the libraries you need to
    access storage.

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
configuration file, rather than hard-coding it in code. In this tutorial
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

## <a name="create-queue"> </a>How To: Create a Queue

The following code creates a **QueueService** object, which enables you
to work with queues.

    var queueService = azure.createQueueService();

Use the **createQueueIfNotExists** method, which returns the specified
queue if it already exists or creates a new queue with the specified
name if it does not already exist. Replace the existing definition of
the **createServer** method with the following.

    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                res.end();
        
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="insert-message"> </a>How To: Insert a Message into a Queue

To insert a message into a queue, use the **createMessage** method to
create a new message and add it to the queue.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.createMessage(queueName, "Hello world!", null,
                                           messageCreated);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function messageCreated(error, serverQueue)
        {
            if(error === null){
                res.end('Successfully inserted message into queue ' + 
                        serverQueue.queue + ' \r\n');
            } else {
                res.end('Could not insert message into queue: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="peek-message"> </a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **peekMessages** method. By default,
**peekMessages** peeks at a single message.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
          
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.peekMessages(queueName, null, messagePeeked);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function messagePeeked(error, serverMessages)
        {
            if(error === null){
                res.end('Successfully peeked message: ' + 
                        serverMessages[0].messagetext + ' \r\n');
            } else {
                res.end('Could not peek into queue: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="get-message"> </a>How To: Dequeue the Next Message

Your code removes a message from a queue in two steps. When you call
**getMessages**, you get the next message in a queue by default. A
message returned from **getMessages** becomes invisible to any other
code reading messages from this queue. By default, this message stays
invisible for 30 seconds. To finish removing the message from the queue,
you must also call **deleteMessage**. This two-step process of removing
a message assures that when your code fails to process a message due to
hardware or software failure, another instance of your code can get the
same message and try again. Your code calls **deleteMessage** right
after the message has been processed.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.getMessages(queueName, null, messageGot);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function messageGot(error, serverMessages)
        {
            if(error === null){
                res.write('Successfully got message: ' + 
                           serverMessages[0].messagetext + ' \r\n');

                // Process the message in less than 30 seconds, and then delete it

                queueService.deleteMessage(queueName, serverMessages[0].messageid,
                                           serverMessages[0].popreceipt, null, 
                                           messageDeleted);
            } else {
                res.end('Could not get message: ' + error.Code);
            }
        }
        
        function messageDeleted(error)
        {
            if(error === null){
                res.end('Successfully deleted message from queue ' + 
                         queueName + ' \r\n');
            } else {
                res.end('Could not delete message: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="change-contents"> </a>How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. If the
message represents a work task, you could use this feature to update the
status of the work task. The code below uses the **updateMessage**
method to update a message.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.getMessages(queueName, null, messageGot);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function messageGot(error, serverMessages)
        {
            if(error === null){
                res.write('Successfully got message: ' + 
                          serverMessages[0].messagetext + ' \r\n');

                queueService.updateMessage(queueName, serverMessages[0].messageid,
                                           serverMessages[0].popreceipt, 0, 
                                           {messagetext: 'Hello world again!'},
                                           messageUpdated);
            } else {
                res.end('Could not get message: ' + error.Code);
            }
        }
        
        function messageUpdated(error, serverMessage)
        {
            if(error === null){
                res.end('Successfully updated message in queue ' + 
                        serverMessage.queue + ' \r\n');
            } else {
                res.end('Could not update  message: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="advanced-get"> </a>How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**getMessages** method to get 16 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to
five minutes for each message.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();

    var queueName = 'taskqueue';
    var messagesToGet = 16;

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.getMessages(queueName, 
                                         {numofmessages: messagesToGet, 
                                          visibilitytimeout: 5 * 60}, 
                                         messageGot);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function messageGot(error, serverMessages)
        {
            if(error === null){
                for(var index in serverMessages){
                    res.write('Successfully got message: ' + 
                              serverMessages[index].messagetext + ' \r\n');
            
                    // Process the message in less than 5 minutes, and then delete 

                    queueService.deleteMessage(queueName, 
                                               serverMessages[index].messageid,
                                               serverMessages[index].popreceipt, 
                                               null, messageDeleted);
                }
            } else {
                res.end('Could not get messages: ' + error.Code);
            }
        }
        
        var received = 0;
        function messageDeleted(error)
        {
            if(error === null){
                res.write('Successfully deleted message from queue ' + 
                          queueName + ' \r\n');
                if(++received === messagesToGet)
                {
                    res.end();
                }
            } else {
                res.end('Could not delete message: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="get-queue-length"> </a>How To: Get the Queue Length

You can get an estimate of the number of messages in a queue. The
**getQueueMetadata** method asks the queue service to return metadata
about the queue, and the **approximatemessagecount** property of the
response contains a count of how many messages are in a queue. The count
is only approximate because messages can be added or removed after the
queue service responds to your request.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.getQueueMetadata(queueName, metadataGot);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function metadataGot(error, serverQueue)
        {
            if(error === null){
                res.end('Approximate queue length ' + 
                        serverQueue.approximatemessagecount + ' \r\n');
            } else {
                res.end('Could not get queue length: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="delete-queue"> </a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**deleteQueue** method on the queue object.

    var http = require('http');
    var azure = require('azure');
    var port = process.env.port || 1337;

    var queueService = azure.createQueueService();
    var queueName = 'taskqueue';

    http.createServer(function serverCreated(req, res) {
        queueService.createQueueIfNotExists(queueName, null, {}, 
                                            queueCreatedOrExists);
        
        function queueCreatedOrExists(error)
        {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
        
            if(error === null){
                res.write('Using queue ' + queueName + '\r\n');
                queueService.deleteQueue(queueName, null, queueDeleted);
            } else {
                res.end('Could not use queue: ' + error.Code);
            }
        }

        function queueDeleted(error)
        {
            if(error === null){
                res.end('Successfully deleted queue ' + queueName + ' \r\n');
            } else {
                res.end('Could not delete queue: ' + error.Code);
            }
        }

    }).listen(port);

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Queue Storage?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Dequeue the Next Message]: #get-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Queue1]: ../../../DevCenter/dotNet/Media/queue1.png
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com

  [plus-new]: ../../Shared/Media/plus-new.png
  [quick-create-storage]: ../../Shared/Media/quick-storage.png
  [Blob2]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Blob3]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Blob4]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png
  [Node.js Web Application]: {localLink:2221} "Web App with Express"
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
