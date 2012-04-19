<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-how-to-use-queue-storage-service-java" urlDisplayName="Queue Service" headerExpose="" pageTitle="How to Use the Queue Storage Service from Java" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the Queue Storage Service from Java</h1>
  <p>This guide will show you how to perform common scenarios using the Windows Azure Queue storage service. The samples are written in Java and use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=VS.103).aspx"> Windows Azure SDK for Java</a>. The scenarios covered include inserting, peeking, getting, and deleting queue messages, as well as creating and deleting queues. For more information on queues, refer to the <a href="#bkmk_NextSteps"> Next Steps</a> section.</p>
  <h2>What is Queue Storage</h2>
  <p>Windows Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64KB in size, a queue can contain millions of messages, up to the 100TB total capacity limit of a storage account. Common uses of Queue storage include:</p>
  <ul>
    <li>Creating a backlog of work to process asynchronously</li>
    <li>Passing messages from a Windows Azure Web role to a Windows Azure Worker role</li>
  </ul>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#bkmk_Concepts">Concepts</a>
    </li>
    <li>
      <a href="#bkmk_CreateWinAzure">Create a Windows Azure Storage Accoun</a>t</li>
    <li>
      <a href="#bkmk_CreateJavaApp">Create a Java Application</a>
    </li>
    <li>
      <a href="#bkmk_ConfigApp">Configure Your Application to Access Queue Storage</a>
    </li>
    <li>
      <a href="#bkmk_SetupWinAzure">Setup a Windows Azure Storage Connection String</a>
    </li>
    <li>
      <a href="#bkmk_CreateQueue">How to Create a Queue</a>
    </li>
    <li>
      <a href="#bkmk_InsertMessage">How to Insert a Message into a Queue</a>
    </li>
    <li>
      <a href="#bkmk_PeekAtNextMsg">How to Peek at the Next Message</a>
    </li>
    <li>
      <a href="#bkmk_DequeueNxtMsg">How to Dequeue the Next Message</a>
    </li>
    <li>
      <a href="#bkmk_ChangeContents">How to Change the Contents of a Queued Message</a>
    </li>
    <li>
      <a href="#bkmk_AddOptions">Additional Options for Dequeuing Messages</a>
    </li>
    <li>
      <a href="#bkmk_GetQueueLength">How to Get the Queue Length</a>
    </li>
    <li>
      <a href="#bkmk_DeleteQueue">How to Delete a Queue</a>
    </li>
    <li>
      <a href="#bkmk_NextSteps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="bkmk_Concepts">
    </a>Concepts</h2>
  <p>The Queue service contains the following components:<br /><img src="../../../DevCenter/Java/media/WA_HowToQueueStorage1.png" alt="Queue Service Components" /></p>
  <ol>
    <li>
      <strong>URL format: </strong>Queues are addressable using the following URL format: <br /> http://&lt;<em>storage account</em>&gt;.queue.core.windows.net/&lt;<em>queue</em>&gt;<br /> The following URL addresses one of the queues in the diagram:<br /> http://myaccount.queue.core.windows.net/imagesToDownload</li>
    <li>
      <strong>Storage Account: </strong>All access to Windows Azure Storage is done through a storage account. A storage account is the highest level of the namespace for accessing queues. The total size of blob, table, and queue contents in a storage account cannot exceed 100TB.</li>
    <li>
      <strong>Queue: </strong>A queue contains a set of messages. All messages must be in a queue.</li>
    <li>
      <strong>Message: </strong>A message, in any format, of up to 64KB.</li>
  </ol>
  <h2>
    <a name="bkmk_CreateWinAzure">
    </a>Create a Windows Azure Storage Account</h2>
  <p>To use storage operations, you need a Windows Azure storage account. You can create a storage account by following these steps. (You can also create a storage account using the REST API.)</p>
  <h3>
    <a name="bkmk_CreateStorageAcct">
    </a>How to Create a Storage Account using the Management Portal</h3>
  <ol>
    <li>Log into the <a href="http://windows.azure.com/">Windows Azure Management Portal</a>.</li>
    <li>In the navigation pane, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</li>
    <li>At the top of the navigation pane, click <strong>Storage Accounts</strong>.</li>
    <li>On the ribbon, in the <strong>Storage</strong> group, click <strong>New Storage Account</strong>.<br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage2.png" alt="New Storage Account screenshot" /><br /> The <strong>Create a New Storage Account</strong> dialog box opens.<br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage3.png" alt="Create New Storage Account screenshot" /></li>
    <li>In <strong>Choose a Subscription</strong>, select the subscription that the storage account will be used with.</li>
    <li>In <strong>Enter a URL</strong>, type a subdomain name to use in the URI for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URI that is used to address Blob, Queue, or Table resources for the subscription.</li>
    <li>Choose a region or an affinity group in which to locate the storage. If you will be using storage from your Windows Azure application, select the same region where you will deploy your application.</li>
    <li>Finally, take note of your <strong>Primary access key</strong> in the right-hand column. You will need this in subsequent steps to access storage.<br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage4.png" alt="Properties screenshot" /></li>
  </ol>
  <h2>
    <a name="bkmk_CreateJavaApp">
    </a>Create a Java Application</h2>
  <p>In this guide, you will use storage features which can be run within a Java application locally, or in code running within a web role or worker role in Windows Azure. We assume you have downloaded and installed the Java Development Kit (JDK), and followed the instructions in <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=VS.103).aspx"> Download the Windows Azure SDK for Java</a> to install the Windows Azure Libraries for Java and the Windows Azure SDK, and have created a Windows Azure storage account in your Windows Azure subscription. You can use any development tools to create your application, including Notepad. All you need is the ability to compile a Java project and reference the Windows Azure Libraries for Java.</p>
  <h2>
    <a name="bkmk_ConfigApp">
    </a>Configure Your Application to Access Queue Storage</h2>
  <p>Add the following import statements to the top of the Java file where you want to use Windows Azure storage APIs to access queues:</p>
  <pre class="prettyprint">// Include the following imports to use queue APIs
import com.microsoft.windowsazure.services.core.storage.*;
import com.microsoft.windowsazure.services.queue.client.*;</pre>
  <h2>
    <a name="bkmk_SetupWinAzure">
    </a>Setup a Windows Azure Storage Connection String</h2>
  <p>A Windows Azure storage client uses a storage connection string to store endpoints and credentials for accessing storage services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the Primary access key for the storage account listed in the Management Portal for the <em> AccountName</em> and <em>AccountKey</em> values. This example shows how you can declare a static field to hold the connection string:</p>
  <pre class="prettyprint">// Define the connection-string with your values
public static final String storageConnectionString = 
    "DefaultEndpointsProtocol=http;" + 
    "AccountName=your_storage_account;" + 
    "AccountKey=your_storage_account_key";</pre>
  <p>In an application running within a role in Windows Azure, this string can be stored in the service configuration file, ServiceConfiguration.cscfg, and can be accessed with a call to the RoleEnvironment.getConfigurationSettings method. Here’s an example of getting the connection string from a <strong>Setting</strong> element named <em>StorageConnectionString</em> in the service configuration file:</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
String storageConnectionString = 
    RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");</pre>
  <h2>
    <a name="bkmk_CreateQueue">
    </a>How to Create a Queue</h2>
  <p>A CloudQueueClient object lets you get reference objects for queues. The following code creates a CloudQueueClient object.</p>
  <p>All code in this guide uses a storage connection string declared one of the two ways shown above. There are also other ways to create CloudStorageAccount objects. See the Javadocs documentation for CloudStorageAccount for details.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();</pre>
  <p>Use the CloudQueueClient object to get a reference to the queue you want to use. You can create the queue if it doesn’t exist.</p>
  <pre class="prettyprint">// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.createIfNotExist();</pre>
  <h2>
    <a name="bkmk_InsertMessage">
    </a>How to Insert a Message into a Queue</h2>
  <p>To insert a message into an existing queue, first create a new CloudQueueMessage. Next, call the addMessage method. A CloudQueueMessage can be created from either a string (in UTF-8 format) or a byte array. Here is code which creates a queu (if it doesn’t exist) and inserts the message “Hello, World”.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.createIfNotExist();

// Create a message and add it to the queue
CloudQueueMessage message = new CloudQueueMessage("Hello, World");
queue.addMessage(message);</pre>
  <h2>
    <a name="bkmk_PeekAtNextMsg">
    </a>How to Peek at the Next Message</h2>
  <p>You can peek at the message in the front of a queue without removing it from the queue by calling peekMessage.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Peek at the next message
CloudQueueMessage peekedMessage = queue.peekMessage();</pre>
  <h2>
    <a name="bkmk_DequeueNxtMsg">
    </a>How to Dequeue the Next Message</h2>
  <p>Your code dequeues a message from a queue in two steps. When you call retrieveMessage, you get the next message in a queue. A message returned from retrieveMessage becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call deleteMessage. This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls deleteMessage right after the message has been processed.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Retrieve the first visible message in the queue
CloudQueueMessage retrievedMessage = queue.retrieveMessage();

// Process the message in less than 30 seconds, and then delete the message.
queue.deleteMessage(retrievedMessage);</pre>
  <h2>
    <a name="bkmk_ChangeContents">
    </a>How to Change the Contents of a Queued Message</h2>
  <p>You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than n times, you would delete it. This protects against a message that triggers an application error each time it is processed.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Retrieve the first visible message in the queue
CloudQueueMessage message = queue.retrieveMessage();

// Modify the message content and set it to be visible in 60 seconds
message.setMessageContent("Updated contents.");
EnumSet&lt;MessageUpdateFields&gt; updateFields = 
    EnumSet.of(MessageUpdateFields.CONTENT, MessageUpdateFields.VISIBILITY);
queue.updateMessage(message, 60, updateFields, null, null);</pre>
  <h2>
    <a name="bkmk_AddOptions">
    </a>Additional Options for Dequeuing Messages</h2>
  <p>There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.</p>
  <p>The following code example uses the retrieveMessages method to get 20 messages in one call. Then it processes each message using a <strong>for</strong> loop. It also sets the invisibility timeout to five minutes (300 seconds) for each message. Note that the five minutes starts for all messages at the same time, so when five minutes have passed since the call to retrieveMessages, any messages which have not been deleted will become visible again.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Retrieve 20 messages from the queue with a visibility timeout of 300 seconds
for (CloudQueueMessage message : queue.retrieveMessages(20, 300, null, null)) {
    // Do processing for all messages in less than 5 minutes, 
    // deleting each message after processing.
    queue.deleteMessage(message);
}</pre>
  <h2>
    <a name="bkmk_GetQueueLength">
    </a>How to Get the Queue Length</h2>
  <p>You can get an estimate of the number of messages in a queue. The downloadAttributes method asks the Queue service for several current values, including a count of how many messages are in a queue. The count is only approximate because messages can be added or removed after the Queue service responds to your request. The getApproximateMethodCount method returns the last value retrieved by the call to downloadAttributes, without calling the Queue service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Download the approximate message count from the server
queue.downloadAttributes();

// Retrieve the newly cached approximate message count
long cachedMessageCount = queue.getApproximateMessageCount();</pre>
  <h2>
    <a name="bkmk_DeleteQueue">
    </a>How to Delete a Queue</h2>
  <p>To delete a queue and all the messages contained in it, call the delete method on the queue object.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = 
    CloudStorageAccount.parse(storageConnectionString);

// Create the queue client
CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.getQueueReference("myqueue");

// Delete the queue
queue.delete();</pre>
  <h2>
    <a name="bkmk_NextSteps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of queue storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx"> Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>
</body>