<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-how-to-queue-service" urlDisplayName="Queue Service" headerExpose="" pageTitle="How to Use the Queue Storage Service from .NET" metaKeywords="Get started Azure queue, Azure asynchronous processing, Azure queue, Azure queue storage, Azure queue .NET, Azure queue storage .NET, Azure queue C#, Azure queue storage C#" footerExpose="" metaDescription="Learn how to use the Windows Azure queue storage service to create and delete queues and insert, peek, get, and delete queue messages." umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the Queue Storage Service</h1>
  <p>This guide will show you how to perform common scenarios using the Windows Azure Queue storage service. The samples are written in C# code and use the .NET API. The scenarios covered include <strong>inserting</strong>, <strong>peeking</strong>, <strong>getting</strong>, and <strong>deleting </strong>queue messages, as well as <strong>creating and deleting queues</strong>. For more information on queues, refer to the <a href="#next-steps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#what-is">What is Queue Storage</a>
    </li>
    <li>
      <a href="#concepts">Concepts</a>
    </li>
    <li>
      <a href="#create-account">Create a Windows Azure Storage Account</a>
    </li>
    <li>
      <a href="#create-project">Create a Windows Azure Project in Visual Studio</a>
    </li>
    <li>
      <a href="#configure-access">Configure your Application to Access Storage</a>
    </li>
    <li>
      <a href="#setup-connection-string">Setup a Windows Azure Storage Connection String</a>
    </li>
    <li>
      <a href="#create-queue">How To: Create a Queue</a>
    </li>
    <li>
      <a href="#insert-message">How To: Insert a Message into a Queue</a>
    </li>
    <li>
      <a href="#peek-message">How To: Peek at the Next Message</a>
    </li>
    <li>
      <a href="#change-contents">How To: Change the Contents of a Queued Message</a>
    </li>
    <li>
      <a href="#get-message">How To: Dequeue the Next Message</a>
    </li>
    <li>
      <a href="#advanced-get">How To: Additional Options for Dequeuing Messages</a>
    </li>
    <li>
      <a href="#get-queue-length">How To: Get the Queue Length</a>
    </li>
    <li>
      <a href="#delete-queue">How To: Delete a Queue</a>
    </li>
    <li>
      <a href="#next-steps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="what-is">
    </a>What is Queue Storage</h2>
  <p>Windows Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64KB in size, a queue can contain millions of messages, up to the 100TB total capacity limit of a storage account. Common uses of Queue storage include:</p>
  <ul>
    <li>
      <span>Creating a backlog of work to process asynchronously</span>
    </li>
    <li>Passing messages from a Windows Azure Web role to a Windows Azure Worker role</li>
  </ul>
  <h2>
    <a name="concepts">
    </a>Concepts</h2>
  <p>The Queue service contains the following components:</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/queue1.png" alt="Queue1" />
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
      <p>On the ribbon, in the Storage group, click <strong>New Storage Account</strong>. <br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage2.png" alt="Blob2" /><br /><br />The <strong>Create a New Storage Account </strong>dialog box opens. <br /><img src="../../../DevCenter/Java/media/WA_HowToBlobStorage3.png" alt="Blob3" /></p>
    </li>
    <li>
      <p>In <strong>Choose a Subscription</strong>, select the subscription that the storage account will be used with.</p>
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
      <p>Click the <strong>View</strong> button in the right-hand column below to display and save the <strong>Primary access key</strong> for the storage account. You will need this in subsequent steps to access storage. <br /><img src="/media//java/WA_HowToBlobStorage4.png" alt="Blob4" /></p>
    </li>
  </ol>
  <h2>
    <a name="create-project">
    </a>Create a Windows Azure Project in Visual Studio</h2>
  <p>In this guide, you will use storage features within a Windows Azure cloud project in Visual Studio. To learn how to create Windows Azure cloud projects:</p>
  <ol>
    <li>
      <p>
        <a href="/en-us/develop/net/">Download and install the Windows Azure SDK for .NET</a> if you have not already done so.</p>
    </li>
    <li>
      <p>Read <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx">Creating a Windows Azure Project in Visual Studio</a> on MSDN, and follow the steps for creating a Windows Azure project with at least one web or worker role.</p>
    </li>
  </ol>
  <h2>
    <a name="configure-access">
    </a>Configure Your Application to Access Storage</h2>
  <p>The web and worker roles in your cloud project are already configured to use Windows Azure storage. Add the following to the top of any C# file where you want to use Windows Azure Storage:</p>
  <pre class="prettyprint">using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;</pre>
  <h2>
    <a name="setup-connection-string">
    </a>Setup a Windows Azure Storage Connection String</h2>
  <p>The Windows Azure .NET storage client uses a storage connection string to store endpoints and credentials for accessing storage services. You can put your storage connection string in a configuration file, rather than hard-coding it in code. One option is to use .NET's built-in configuration mechanism (e.g. <strong>Web.config</strong> for web applications). In this guide, you will store your connection string using Windows Azure service configuration. The service configuration is unique to Windows Azure projects and allows you to change configuration from the Management Portal without redeploying your application.</p>
  <p>To configure your connection string in the Windows Azure service configuration:</p>
  <ol>
    <li>
      <p>In the Solution Explorer, in the <strong>Roles</strong> folder, right-click a web role or worker role and click <strong>Properties</strong>.<br /><img src="../../../DevCenter/dotNet/media/blob5.png" alt="Blob5" /></p>
    </li>
    <li>
      <p>Click <strong>Settings</strong> and click <strong>Add Setting</strong>.<br /><img src="../../../DevCenter/dotNet/media/blob6.png" alt="Blob6" /></p>
      <p>A new setting is created.</p>
    </li>
    <li>
      <p>In the <strong>Type</strong> drop-down of the <strong>Setting1</strong> entry, choose <strong>Connection String</strong>.<br /><img src="../../../DevCenter/dotNet/media/blob7.png" alt="Blob7" /></p>
    </li>
    <li>
      <p>Click the <strong>...</strong> button at the right end of the <strong>Setting1</strong> entry. The <strong>Storage Account Connection String</strong> dialog opens.</p>
    </li>
    <li>
      <p>Choose whether you want to target the storage emulator (Windows Azure storage simulated on your desktop) or an actual storage account in the cloud, and click <strong>OK</strong>. The code in this guide works with either option.<br /><img src="../../../DevCenter/dotNet/media/blob8.png" alt="Blob8" /></p>
    </li>
    <li>
      <p>Change the entry <strong>Name</strong> from <strong>Setting1</strong> to <strong>StorageConnectionString</strong>. You will reference this name in the code in this guide.<br /><img src="../../../DevCenter/dotNet/media/blob9.png" alt="Blob9" /></p>
    </li>
  </ol>
  <p>You are now ready to perform the How To's in this guide.</p>
  <h2>
    <a name="create-queue">
    </a>How To: Create a Queue</h2>
  <p>A <strong>CloudQueueClient</strong> object lets you get reference objects for queues. The following code creates a <strong>CloudQueueClient </strong>object. All code in this guide uses a storage connection string stored in the Windows Azure application's service configuration. There are also other ways to create a <strong>CloudStorageAccount</strong> object. See <a href="http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.cloudstorageaccount_methods.aspx">CloudStorageAccount</a> documentation for details.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();</pre>
  <p>Use the <strong>queueClient</strong> object to get a reference to the queue you want to use. You can create the queue if it doesn't exist.</p>
  <pre class="prettyprint">// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.CreateIfNotExist();</pre>
  <h2>
    <a name="insert-message">
    </a>How To: Insert a Message into a Queue</h2>
  <p>To insert a message into an existing queue, first create a new <strong>CloudQueueMessage</strong>. Next, call the <strong>AddMessage</strong> method. A <strong>CloudQueueMessage</strong> can be created from either a string (in UTF-8 format) or a <strong>byte</strong> array. Here is code which creates a queue (if it doesn't exist) and inserts the message 'Hello, World'.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.CreateIfNotExist();

// Create a message and add it to the queue
CloudQueueMessage message = new CloudQueueMessage("Hello, World");
queue.AddMessage(message);</pre>
  <h2>
    <a name="peek-message">
    </a>How To: Peek at the Next Message</h2>
  <p>You can peek at the message in the front of a queue without removing it from the queue by calling the <strong>PeekMessage</strong> method.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Peek at the next message
CloudQueueMessage peekedMessage = queue.PeekMessage();</pre>
  <h2>
    <a name="change-contents">
    </a>How To: Change the Contents of a Queued Message</h2>
  <p>You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than <em>n</em> times, you would delete it. This protects against a message that triggers an application error each time it is processed.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

CloudQueueMessage message = queue.GetMessage();
message.SetMessageContent("Updated contents.") ;
queue.UpdateMessage(message, 
    TimeSpan.FromSeconds(0.0),  // visible immediately
    MessageUpdateFields.Content | MessageUpdateFields.Visibility);</pre>
  <h2>
    <a name="get-message">
    </a>How To: Dequeue the Next Message</h2>
  <p>Your code dequeues a message from a queue in two steps. When you call <strong>GetMessage</strong>, you get the next message in a queue. A message returned from <strong>GetMessage</strong> becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call <strong>DeleteMessage</strong>. This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls <strong>DeleteMessage</strong> right after the message has been processed.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Get the next message
CloudQueueMessage retrievedMessage = queue.GetMessage();

//Process the message in less than 30 seconds, and then delete the message
queue.DeleteMessage(retrievedMessage);</pre>
  <h2>
    <a name="advanced-get">
    </a>Additional Options for Dequeuing Messages</h2>
  <p>There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the <strong>GetMessages</strong> method to get 20 messages in one call. Then it processes each message using a <strong>foreach</strong> loop. It also sets the invisibility timeout to five minutes for each message. Note that the 5 minutes starts for all messages at the same time, so after 5 minutes have passed since the call to <strong>GetMessages</strong>, any messages which have not been deleted will become visible again.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

foreach (CloudQueueMessage message in queue.GetMessages(20, TimeSpan.FromMinutes(5)))
{
    // Do processing for all messages in less than 5 minutes, deleting each message after processing
    queue.DeleteMessage(message);
}
</pre>
  <h2>
    <a name="get-queue-length">
    </a>How To: Get the Queue Length</h2>
  <p>You can get an estimate of the number of messages in a queue. The <strong>RetrieveApproximateMessageCount</strong> method asks the Queue service to count how many messages are in a queue. The count is only an approximation because messages can be added or removed after the Queue service responds to your request. The <strong>ApproximateMethodCount</strong> property returns the last value retrieved by the <strong>RetrieveApproximateMessageCount</strong>, without calling the Queue service.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Retrieve the approximate message count
int freshMessageCount = queue.RetrieveApproximateMessageCount();

// Retrieve the cached approximate message count
int? cachedMessageCount = queue.ApproximateMessageCount;</pre>
  <h2>
    <a name="delete-queue">
    </a>How To: Delete a Queue</h2>
  <p>To delete a queue and all the messages contained in it, call the <strong>Delete</strong> method on the queue object.</p>
  <pre class="prettyprint">// Retrieve storage account from connection-string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Delete the queue
queue.Delete();</pre>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you've learned the basics of queue storage, follow these links to learn how to do more complex storage tasks.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a></li>
    <li>Visit the <a href="http://blogs.msdn.com/b/windowsazurestorage/">Windows Azure Storage Team Blog</a></li>
  </ul>
</body>