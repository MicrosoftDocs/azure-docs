  <properties linkid="dev-nodejs-how-to-service-bus-queues" urlDisplayName="Queue Service" headerExpose="" pageTitle="Queue Service - How To - Node.js - Develop" metaKeywords="Azure asynchronous processing Node.js, Azure queue Node.js, Azure queue storage Node.js" footerExpose="" metaDescription="Learn how to use the Windows Azure queue storage service to create and delete queues and insert, peek, get, and delete queue messages from your Node.js application." umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the Queue Storage Service from Node.js</h1>
  <p>This guide shows you how to perform common scenarios using the Windows Azure Queue storage service. The samples are written using the Node.js API. The scenarios covered include <strong>inserting</strong>, <strong>peeking</strong>, <strong>getting</strong>, and <strong>deleting </strong>queue messages, as well as <strong>creating and deleting queues</strong>. For more information on queues, refer to the <a href="#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#what-is">What is Queue Storage?</a>
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
    <a href="#create-queue">How To: Create a Queue</a>
    <br />
    <a href="#insert-message">How To: Insert a Message into a Queue</a>
    <br />
    <a href="#peek-message">How To: Peek at the Next Message</a>
    <br />
    <a href="#get-message">How To: Dequeue the Next Message</a>
    <br />
    <a href="#change-contents">How To: Change the Contents of a Queued Message</a>
    <br />
    <a href="#advanced-get">How To: Additional Options for Dequeuing Messages</a>
    <br />
    <a href="#get-queue-length">How To: Get the Queue Length</a>
    <br />
    <a href="#delete-queue">How To: Delete a Queue</a>
    <br />
    <a href="#next-steps">Next Steps</a>
  </p>
  <h2>
    <a name="what-is">
    </a>What is Queue Storage?</h2>
  <p>Windows Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64KB in size, a queue can contain millions of messages, up to the 100TB total capacity limit of a storage account. Common uses of Queue storage include:</p>
  <ul>
    <li>
      <span>Creating a backlog of work to process asynchronously</span>
    </li>
    <li>Passing messages from a Windows Azure web role to a worker role</li>
  </ul>
  <h2>
    <a name="concepts">
    </a>Concepts</h2>
  <p>The Queue service contains the following components:</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/queue1.png" alt="Queue1" />
  </p>
  <ul>
    <li>
      <p>
        <strong>URL format:</strong> Queues are addressable using the following URL format: <br />http://&lt;storage account&gt;.queue.core.windows.net/&lt;queue&gt;<br /><br />The following URL addresses one of the queues in the diagram:<br />http://myaccount.queue.core.windows.net/imagesToDownload</p>
    </li>
    <li>
      <p>
        <strong>Storage Account:</strong> All access to Windows Azure Storage is done through a storage account. A storage account is the highest level of the namespace for accessing queues. The total size of blob, table, and queue contents in a storage account cannot exceed 100TB.</p>
    </li>
    <li>
      <p>
        <strong>Queue:</strong> A queue contains a set of messages. All messages must be in a queue.</p>
    </li>
    <li>
      <p>
        <strong>Message:</strong> A message, in any format, of up to 64KB.</p>
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
      <p>On the ribbon, in the Storage group, click <strong>New Storage Account</strong>. <br /><img src="../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png" alt="Blob2" /><br /><br />The <strong>Create a New Storage Account </strong>dialog box opens. <br /><img src="../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png" alt="Blob3" /></p>
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
      <p>Finally, take note of your<strong> Primary access key</strong> in the right-hand column. You will need this in subsequent steps to access storage. <br /><img src="../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png" alt="Blob4" /></p>
    </li>
  </ol>
  <h2>
    <a name="create-app">
    </a>Create a Node.js Application</h2>
  <p>Create a blank tasklist application using the <strong>Windows PowerShell for Node.js</strong> command window at the location <strong>c:\node\tasklist</strong>. For instructions on how to use the PowerShell commands to create a blank application, see the <a href="{localLink:2221}" title="Web App with Express">Node.js Web Application</a>.</p>
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
      <p>You can manually run the <strong>ls</strong> command to verify that a <strong>node_modules</strong> folder was created. Inside that folder you will find the <strong>azure</strong> package, which contains the libraries you need to access storage.</p>
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
  <p>If you are planning to run against the real Windows Azure storage service, you need to modify your connection string to point at your cloud-based storage. You can store the storage connection string in a configuration file, rather than hard-coding it in code. In this tutorial you use the Web.cloud.config file, which is created when you create a Windows Azure web role.</p>
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
    <a name="create-queue">
    </a>How To: Create a Queue</h2>
  <p>The following code creates a <strong>QueueService</strong> object, which enables you to work with queues.</p>
  <pre class="prettyprint">var queueService = azure.createQueueService();
</pre>
  <p>Use the <strong>createQueueIfNotExists</strong> method, which returns the specified queue if it already exists or creates a new queue with the specified name if it does not already exist. Replace the existing definition of the <strong>createServer</strong> method with the following.</p>
  <pre class="prettyprint">var queueName = 'taskqueue';

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
</pre>
  <h2>
    <a name="insert-message">
    </a>How To: Insert a Message into a Queue</h2>
  <p>To insert a message into a queue, use the <strong>createMessage</strong> method to create a new message and add it to the queue.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="peek-message">
    </a>How To: Peek at the Next Message</h2>
  <p>You can peek at the message in the front of a queue without removing it from the queue by calling the <strong>peekMessages</strong> method. By default, <strong>peekMessages</strong> peeks at a single message.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="get-message">
    </a>How To: Dequeue the Next Message</h2>
  <p>Your code removes a message from a queue in two steps. When you call <strong>getMessages</strong>, you get the next message in a queue by default. A message returned from <strong>getMessages</strong> becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call <strong>deleteMessage</strong>. This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls <strong>deleteMessage</strong> right after the message has been processed.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="change-contents">
    </a>How To: Change the Contents of a Queued Message</h2>
  <p>You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The code below uses the <strong>updateMessage</strong> method to update a message.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="advanced-get">
    </a>How To: Additional Options for Dequeuing Messages</h2>
  <p>There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the <strong>getMessages</strong> method to get 16 messages in one call. Then it processes each message using a for loop. It also sets the invisibility timeout to five minutes for each message.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="get-queue-length">
    </a>How To: Get the Queue Length</h2>
  <p>You can get an estimate of the number of messages in a queue. The <strong>getQueueMetadata</strong> method asks the queue service to return metadata about the queue, and the <strong>approximatemessagecount</strong> property of the response contains a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after the queue service responds to your request.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="delete-queue">
    </a>How To: Delete a Queue</h2>
  <p>To delete a queue and all the messages contained in it, call the <strong>deleteQueue</strong> method on the queue object.</p>
  <pre class="prettyprint">var http = require('http');
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
</pre>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of queue storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>