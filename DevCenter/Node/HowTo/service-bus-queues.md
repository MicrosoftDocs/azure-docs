<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-nodejs-how-to-service-bus-queues" urlDisplayName="Service Bus Queues" headerExpose="" pageTitle="Service Bus Queues - How To - Node.js - Develop" metaKeywords="Azure messaging, Azure brokered messaging, Azure messaging queue, Service Bus queue, Azure Service Bus queue, Azure messaging Node.js, Azure messaging queue Node.js, Azure Service Bus queue Node.js, Service Bus queue Node.js" footerExpose="" metaDescription="Learn about Windows Azure Service Bus queues, including how to create queues, how to send and receive messages, and how to delete queues." umbracoNaviHide="0" disqusComments="1" />
  <h1 id="howtouseservicebusqueues">How to Use Service Bus Queues</h1>
  <p>This guide will show you how to use Service Bus queues. The samples are written in JavaScript and use the Node.js Azure module. The scenarios covered include <strong>creating queues, sending and receiving messages</strong>, and <strong>deleting queues</strong>. For more information on queues, see the <a href="#next-steps">Next Steps</a> section.</p>
  <h2 id="tableofcontents">Table of Contents</h2>
  <ul>
    <li>
      <a href="#what-queues">What are Service Bus Queues</a>
    </li>
    <li>
      <a href="#create-namespace">Create a Service Namespace</a>
    </li>
    <li>
      <a href="#obtain-creds">Obtain the Default Management Credentials for the Namespace</a>
    </li>
    <li>
      <a href="#create-app">Create a Node.js Application</a>
    </li>
    <li>
      <a href="#configure-app">Configure Your Application to Use Service Bus</a>
    </li>
    <li>
      <a href="#create-queue">How to: Create a Queue</a>
    </li>
    <li>
      <a href="#send-messages">How to: Send Messages to a Queue</a>
    </li>
    <li>
      <a href="#receive-messages">How to: Receive Messages from a Queue</a>
    </li>
    <li>
      <a href="#handle-crashes">How to: Handle Application Crashes and Unreadable Messages</a>
    </li>
    <li>
      <a href="#next-steps">Next Steps</a>
    </li>
  </ul>
  <h2 id="whatareservicebusqueues">
    <a name="what-queues">
    </a>What are Service Bus Queues</h2>
  <p>Service Bus Queues support a <strong>brokered messaging communication</strong> model. When using queues, components of a distributed application do not communicate directly with each other, they instead exchange messages via a queue, which acts as an intermediary. A message producer (sender) hands off a message to the queue and then continues its processing. Asynchronously, a message consumer (receiver) pulls the message from the queue and processes it. The producer does not have to wait for a reply from the consumer in order to continue to process and send further messages. Queues offer <strong>First In, First Out (FIFO)</strong> message delivery to one or more competing consumers. That is, messages are typically received and processed by the receivers in the order in which they were added to the queue, and each message is received and processed by only one message consumer.</p>
  <p>
    <img src="../../../DevCenter/dotNet/Media/sb-queues-08.png" alt="Queue Concepts" />
  </p>
  <p>Service Bus queues are a general-purpose technology that can be used for a wide variety of scenarios:</p>
  <ul>
    <li>Communication between web and worker roles in a multi-tier Windows Azure application</li>
    <li>Communication between on-premises apps and Windows Azure hosted apps in a hybrid solution</li>
    <li>Communication between components of a distributed application running on-premises in different organizations or departments of an organization</li>
  </ul>
  <p>Using queues can enable you to scale out your applications better, and enable more resiliency to your architecture.</p>
  <h2 id="createaservicenamespace">
    <a name="create-namespace">
    </a>Create a Service Namespace</h2>
  <p>To begin using Service Bus queues in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
  <p>To create a service namespace:</p>
  <ol>
    <li>
      <p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
    </li>
    <li>
      <p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
    </li>
    <li>
      <p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button.</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-03.png" alt="image" />
    </li>
    <li>
      <p>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button.</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-04.png" alt="image" />
    </li>
    <li>
      <p>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
    </li>
  </ol>
  <p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
  <h2 id="obtainthedefaultmanagementcredentialsforthenamespace">
    <a name="obtain-creds">
    </a>Obtain the Default Management Credentials for the Namespace</h2>
  <p>In order to perform management operations, such as creating a queue, on the new namespace, you need to obtain the management credentials for the namespace.</p>
  <ol>
    <li>
      <p>In the left navigation pane, click the <strong>Service Bus</strong> node, to display the list of available namespaces:</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-03.png" alt="image" />
    </li>
    <li>
      <p>Select the namespace you just created from the list shown:</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-05.png" alt="image" />
    </li>
    <li>
      <p>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace:</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-06.png" alt="image" />
    </li>
    <li>
      <p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials:</p>
      <img src="../../../DevCenter/dotNet/Media/sb-queues-07.png" alt="image" />
    </li>
    <li>
      <p>Make a note of the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
    </li>
  </ol>
  <h2 id="createanode.jsappication">
    <a name="create-app">
    </a>Create a Node.js Appication</h2>
  <p>Create a new application using the <strong>Windows PowerShell for Node.js</strong> command window at the location c:\node\sbqueues\WebRole1. For instructions on how to use the PowerShell commands to create a blank application, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/">Node.js Web Application</a>.</p>
  <p>
    <strong>Note</strong>: Several steps in this article are performed using the tools provided by the <strong>Windows Azure SDK for Node.js</strong>, however the information provided should generally be applicable to applications created using other tools. The previous step simply creates a basic server.js file at c:\node\sbqueues\WebRole1.</p>
  <h2 id="configureyourapplicationtouseservicebus">
    <a name="configure-app">
    </a>Configure Your Application to Use Service Bus</h2>
  <p>To use Windows Azure Service Bus, you need to download and use the Node.js azure package. This includes a set of convenience libraries that communicate with the Service Bus REST services.</p>
  <h3 id="usenodepackagemanagernpmtoobtainthepackage">Use Node Package Manager (NPM) to obtain the package</h3>
  <ol>
    <li>
      <p>Use the <strong>Windows PowerShell for Node.js</strong> command window to navigate to the <strong>c:\node\sbqueues\WebRole1</strong> folder where you created your sample application.</p>
    </li>
    <li>
      <p>Type <strong>npm install azure</strong> in the command window, which should result in output similiar to the following:</p>
      <pre class="prettyprint">azure@0.5.0 ./node_modules/azure
├── xmlbuilder@0.3.1
├── mime@1.2.4
├── xml2js@0.1.12
├── qs@0.4.0
├── log@1.2.0
└── sax@0.3.4</pre>
    </li>
    <li>
      <p>You can manually run the <strong>ls</strong> command to verify that a <strong>node_modules</strong> folder was created. Inside that folder find the <strong>azure</strong> package, which contains the libraries you need to access Service Bus queues.</p>
    </li>
  </ol>
  <h3 id="importthemodule">Import the module</h3>
  <p>Using Notepad or another text editor, add the following to the top of the <strong>server.js</strong> file of the application:</p>
  <pre class="prettyprint">var azure = require('azure');</pre>
  <h3 id="setupawindowsazurestorageconnection">Setup a Windows Azure Storage Connection</h3>
  <p>You must use the namespace and default key values to connect to the Service Bus queue. These values can be specified programatically within your application, or read from the following environment variables at runtime:</p>
  <ul>
    <li>AZURE_SERVICEBUS_NAMESPACE</li>
    <li>AZURE_SERVICEBUS_ACCESS_KEY</li>
  </ul>
  <p>You can also store these values in the configuration files created by the <strong>Windows Azure PowerShell for Node.js</strong> commands. In this how-to, you use the <strong>Web.Cloud.Config</strong> and <strong>Web.Config</strong> files, which are created when you create a Windows Azure Web role:</p>
  <ol>
    <li>
      <p>Use a text editor to open <strong>c:\node\sbqueues\WebRole1\Web.cloud.config</strong></p>
    </li>
    <li>
      <p>Add the following inside the <strong>configuration</strong> element</p>
      <pre class="prettyprint">&lt;appSettings&gt;
  &lt;add key="AZURE_SERVICEBUS_NAMESPACE" value="your Service Bus namespace"/&gt;
  &lt;add key="AZURE_SERVICEBUS_ACCESS_KEY" value="your default key"/&gt;
&lt;/appSettings&gt;
</pre>
    </li>
  </ol>
  <p>You are now ready to write code against Service Bus.</p>
  <h2 id="howtocreateaqueue">
    <a name="create-queue">
    </a>How to Create a Queue</h2>
  <p>The <strong>ServiceBusService</strong> object lets you work with queues. The following code creates a <strong>ServiceBusService</strong> object. Add it near the top of the <strong>server.js</strong> file, after the statement to import the azure module:</p>
  <pre class="prettyprint">var serviceBusService = azure.createServiceBusService();</pre>
  <p>By calling <strong>createQueueIfNotExists</strong> on the <strong>ServiceBusService</strong> object, the specified queue will be returned (if it exists,) or a new queue with the specified name will be created. The following code uses <strong>createQueueIfNotExists</strong> to create or connect to the queue named ‘myqueue’:</p>
  <pre class="prettyprint">var serviceBusService = azure.createServiceBusService();
serviceBusService.createQueueIfNotExists('myqueue', function(error){
    if(!error){
        // Queue exists
    }
});</pre>
  <p>
    <strong>createServiceBusService</strong> also supports additional options, which allow you to override default queue settings such as message time to live or maximum queue size. The following example shows setting the maximum queue size to 5GB a time to live of 1 minute:</p>
  <pre class="prettyprint">var serviceBusService = azure.createServiceBusService();
var queueOptions = {
      MaxSizeInMegabytes: '5120',
      DefaultMessageTimeToLive: 'PT1M'
    };

serviceBusService.createQueueIfNotExists('myqueue', queueOptions, function(error){
    if(!error){
        // Queue exists
    }
});</pre>
  <h2 id="howtosendmessagestoaqueue">
    <a name="send-messages">
    </a>How to Send Messages to a Queue</h2>
  <p>To send a message to a Service Bus queue, your application will call the <strong>sendQueueMessage</strong> method on the <strong>ServiceBusService</strong> object. Messages sent to (and received from) Service Bus queues are <strong>BrokeredMessage</strong> objects, and have a set of standard properties (such as <strong>Label</strong> and <strong>TimeToLive</strong>), a dictionary that is used to hold custom application specific properties, and a body of arbitrary application data. An application can set the body of the message by passing a string value as the message and any required standard properties will be populated by default values.</p>
  <p>The following example demonstrates how to send a test message to the queue named ‘myqueue’ using <strong>sendQueueMessage</strong>:</p>
  <pre class="prettyprint">var message = {
    body: 'Test message',
    customProperties: {
        testproperty: 'TestValue'
    };
serviceBusService.sendQueueMessage('myqueue', message, function(error){
    if(!error){
        // message sent
    }
});</pre>
  <p>Service Bus queues support a maximum message size of 256 KB (the header, which includes the standard and custom application properties, can have a maximum size of 64 KB). There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB.</p>
  <h2 id="howtoreceivemessagesfromaqueue">
    <a name="receive-messages">
    </a>How to Receive Messages from a Queue</h2>
  <p>Messages are received from a queue using the <strong>receiveQueueMessage</strong> method on the <strong>ServiceBusService</strong> object. By default, messages are deleted from the queue as they are read; however, you can read (peek) and lock the message without deleting it from the queue by setting the optional parameter <strong>isPeekLock</strong> to <strong>true</strong>.</p>
  <p>The default behavior of reading and deleting the message as part of the receive operation is the simplest model, and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.</p>
  <p>If the <strong>isPeekLock</strong> parameter is set to <strong>true</strong>, the receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling <strong>deleteMessage</strong> method and providing the message to be deleted as a parameter. The <strong>deleteMessage</strong> method will mark the message as being consumed and remove it from the queue.</p>
  <p>The example below demonstrates how messages can be received and processed using <strong>receiveQueueMessage</strong>. The example first receives and deletes a message, and then receives a message using <strong>isPeekLock</strong> set to true, then deletes the message using <strong>deleteMessage</strong>:</p>
  <pre class="prettyprint">serviceBusService.receiveQueueMessage('taskqueue', function(error, receivedMessage){
    if(!error){
        // Message received and deleted
    }
});
serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true }, function(error, lockedMessage){
    if(!error){
        // Message received and locked
        serviceBusService.deleteMessage(lockedMessage, function (deleteError){
            if(!deleteError){
                // Message deleted
            }
        }
    }
});
</pre>
  <h2 id="howtohandleapplicationcrashesandunreadablemessages">
    <a name="handle-crashes">
    </a>How to Handle Application Crashes and Unreadable Messages</h2>
  <p>Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the <strong>unlockMessage</strong> method on the <strong>ServiceBusService</strong> object. This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.</p>
  <p>There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.</p>
  <p>In the event that the application crashes after processing the message but before the <strong>deleteMessage</strong> method is called, then the message will be redelivered to the application when it restarts. This is often called <strong>At Least Once Processing</strong>, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the <strong>MessageId</strong> property of the message, which will remain constant across delivery attempts.</p>
  <h2 id="nextsteps">
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you’ve learned the basics of Service Bus queues, follow these links to learn more.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx">Queues, Topics, and Subscriptions.</a></li>
  </ul>
</body>