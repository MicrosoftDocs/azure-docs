<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-how-to-service-bus-queues" urlDisplayName="Service Bus Queues" headerExpose="" pageTitle="Service Bus Queues - How To - .NET - Develop" metaKeywords="Get Started Service Bus queues, Get started Azure Service Bus queues, Azure messaging, Azure brokered messaging, Azure messaging queue, Service Bus queue, Azure Service Bus queue, Azure messaging .NET, Azure messaging queue .NET, Azure Service Bus queue .NET, Service Bus queue .NET, Azure messaging C#, Azure messaging queue C#, Azure Service Bus queue C#, Service Bus queue C#" footerExpose="" metaDescription="Get started with Windows Azure Service Bus queues, including how to create queues, how to send and receive messages, and how to delete queues." umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use Service Bus Queues</h1>
  <p>
    <span>This guide will show you how to use Service Bus queues. The samples are written in C# and use the .NET API. The scenarios covered include <strong>creating queues, sending and receiving messages</strong>, and <strong>deleting queues</strong>. For more information on queues, see the <a href="#next-steps">Next Steps</a> section. </span>
  </p>
  <h2>Table of Contents</h2>
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
      <a href="#configure-app">Configure Your Application to Use Service Bus</a>
    </li>
    <li>
      <a href="#create-provider">How to: Create a Security Token Provider</a>
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
  <h2>
    <a name="what-queues">
    </a>What are Service Bus Queues</h2>
  <p>
    <span>Service Bus Queues support a <strong>brokered messaging communication</strong> model. When using queues, components of a distributed application do not communicate directly with each other, they instead exchange messages via a queue, which acts as an intermediary. A message producer (sender) hands off a message to the queue and then continues its processing. Asynchronously, a message consumer (receiver) pulls the message from the queue and processes it. The producer does not have to wait for a reply from the consumer in order to continue to process and send further messages. Queues offer <strong>First In, First Out (FIFO)</strong> message delivery to one or more competing consumers. That is, messages are typically received and processed by the receivers in the order in which they were added to the queue, and each message is received and processed by only one message consumer.</span>
  </p>
  <p>
    <img src="../../../DevCenter/dotNet/media/sb-queues-08.png" alt="Queue Concepts" />
  </p>
  <p>Service Bus queues are a general-purpose technology that can be used for a wide variety of scenarios:</p>
  <ul>
    <li>Communication between web and worker roles in a multi-tier Windows Azure application</li>
    <li>Communication between on-premises apps and Windows Azure hosted apps in a hybrid solution</li>
    <li>Communication between components of a distributed application running on-premises in different organizations or departments of an organization</li>
  </ul>
  <p>Using queues can enable you to scale out your applications better, and enable more resiliency to your architecture.</p>
  <h2>
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
      <p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button. <br /><img src="../../../DevCenter/dotNet/media/sb-queues-03.png" /></p>
    </li>
    <li>
      <p>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button. <br /><img src="../../../DevCenter/dotNet/media/sb-queues-04.png" /></p>
    </li>
    <li>
      <p>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
    </li>
  </ol>
  <p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
  <h2>
    <a name="obtain-creds">
    </a>Obtain the Default Management Credentials for the Namespace</h2>
  <p>In order to perform management operations, such as creating a queue, on the new namespace, you need to obtain the management credentials for the namespace.</p>
  <ol>
    <li>
      <p>In the left navigation pane, click the <strong>Service Bus</strong> node, to display the list of available namespaces: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-03.png" /></p>
    </li>
    <li>
      <p>Select the namespace you just created from the list shown: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-05.png" /></p>
    </li>
    <li>
      <p>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-06.png" /></p>
    </li>
    <li>
      <p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-07.png" /></p>
    </li>
    <li>
      <p>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
    </li>
  </ol>
  <h2>
    <a name="configure-app">
    </a>Configure Your Application to Use Service Bus</h2>
  <p>When you create an application that uses Service Bus, you will need to add a reference to the Service Bus assembly and include the corresponding namespaces.</p>
  <h3>Add a Reference to the Service Bus Assembly</h3>
  <ol>
    <li>
      <p>In Visual Studio's <strong>Solution Explorer</strong>, right-click <strong>References</strong>, and then click <strong>Add Reference</strong>.</p>
    </li>
    <li>
      <p>In the <strong>Browse</strong> tab, go to C:\Program Files\Windows Azure SDK\v1.6\ServiceBus\ref\ and add a <strong>Microsoft.ServiceBus.dll</strong> reference.</p>
    </li>
  </ol>
  <h3>Import the Service Bus Namespaces</h3>
  <p>Add the following to the top of any C# file where you want to use Service Bus queues:</p>
  <pre class="prettyprint"> using Microsoft.ServiceBus;
 using Microsoft.ServiceBus.Messaging;
</pre>
  <p>You are now ready to write code against Service Bus.</p>
  <h2>
    <a name="create-provider">
    </a>How to Create a Security Token Provider</h2>
  <p>Service Bus uses a claims-based security model implemented using the Windows Azure Access Control Service (ACS). The <strong>TokenProvider</strong> class provides a security token provider with built-in factory methods. The code below creates a <strong>SharedSecretTokenProvider</strong> to hold the shared secret credentials and handle the acquisition of the appropriate tokens from the Access Control Service:</p>
  <pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
</pre>
  <p>Use the issuer and key values retrieved from the Management Portal as described in the previous section.</p>
  <h2>
    <a name="create-queue">
    </a>How to Create a Queue</h2>
  <p>Management operations for Service Bus queues can be performed via the <strong>NamespaceManager</strong> class. A <strong>NamespaceManager</strong> object is constructed with the base address of a Service Bus namespace and an appropriate token provider that has permissions to manage it. The base address of a Service Bus namespace is a URI of the form "sb://.servicebus.windows.net". The <strong>ServiceBusEnvironment</strong> class provides the <strong>CreateServiceUri</strong> helper method to assist the creation of these URIs.</p>
  <p>The <strong>NamespaceManager</strong> class provides methods to create, enumerate, and delete queues. The example below shows how a <strong>NamespaceManager</strong> can be used to create a queue named "TestQueue" within a "HowToSample" service namespace:</p>
  <pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
 
 // Retrieve URI of our "HowToSample" service namespace (created via the portal)
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for our "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Create a new Queue named "TestQueue" 
 namespaceManager.CreateQueue("TestQueue");
</pre>
  <p>There are overloads of the <strong>CreateQueue</strong> method that allow properties of the queue to be tuned ( for example: to set the default "time-to-live" value to be applied to messages sent to the queue). These settings are applied by using the <strong>QueueDescription</strong> class. The following example shows how to create a queue named "TestQueue" with a maximum size of 5GB and a default message time-to-live of 1 minute:</p>
  <pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
 
 // Retrieve URI of our "HowToSample" service namespace (created via the portal)
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for our "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Configure Queue Settings
 QueueDescription qd = new QueueDescription("TestQueue");
 qd.MaxSizeInMegabytes = 5120;
 qd.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

 // Create a new Queue with custom settings
 namespaceManager.CreateQueue(qd);
</pre>
  <p>
    <strong>Note: </strong>You can use the <strong>QueueExists</strong> method on <strong>NamespaceManager</strong> objects to check if a queue with a specified name already exists within a service namespace.</p>
  <h2>
    <a name="send-messages">
    </a>How to Send Messages to a Queue</h2>
  <p>To send a message to a Service Bus Queue, your application will obtain a <strong>MessageSender</strong> object. Like <strong>NamespaceManager</strong> objects, this object is created from the base URI of the service namespace and the appropriate token provider.</p>
  <p>The below code demonstrates how to retrieve a <strong>MessageSender</strong> object for the "TestQueue" queue we created above within our "HowToSample" service namespace:</p>
  <pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // URI address and token for our "HowToSample" namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Retrieve MessageSender for the "TestQueue" within our "HowToSample" namespace
 MessagingFactory factory = MessagingFactory.Create(uri, tP);
 MessageSender testQueue = factory.CreateMessageSender("TestQueue");
</pre>
  <p>Messages sent to (and received from) Service Bus queues are instances of the <strong>BrokeredMessage</strong> class. <strong>BrokeredMessage</strong> objects have a set of standard properties (such as <strong>Label</strong> and <strong>TimeToLive</strong>), a dictionary that is used to hold custom application specific properties, and a body of arbitrary application data. An application can set the body of the message by passing any serializable object into the constructor of the <strong>BrokeredMessage</strong>, and the appropriate <strong>DataContractSerializer</strong> will then be used to serialize the object. Alternatively, a <strong>System.IO.Stream</strong> can be provided.</p>
  <p>The following example demonstrates how to send five test messages to the "TestQueue" <strong>MessageSender</strong> we obtained in the code snippet above:</p>
  <pre class="prettyprint"> for (int i=0; i&lt;5; i++)
 {
   // Create message, passing a string message for the body
   BrokeredMessage message = new BrokeredMessage("Test message " + i);

   // Set some additional custom app-specific properties
   message.Properties["TestProperty"] = "TestValue";
   message.Properties["Message number"] = i;   

   // Send message to the queue
   testQueue.Send(message);
 }
</pre>
  <p>Service Bus queues support a maximum message size of 256 KB (the header, which includes the standard and custom application properties, can have a maximum size of 64 KB). There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB.</p>
  <h2>
    <a name="receive-messages">
    </a>How to Receive Messages from a Queue</h2>
  <p>The simplest way to receive messages from a queue is to use a <strong>MessageReceiver</strong> object. <strong>MessageReceiver</strong> objects can work in two different modes: <strong>ReceiveAndDelete</strong> and <strong>PeekLock</strong>.</p>
  <p>When using the <strong>ReceiveAndDelete</strong> mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message in a queue, it marks the message as being consumed and returns it to the application. <strong>ReceiveAndDelete</strong> mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.</p>
  <p>In <strong>PeekLock</strong> mode (which is the default mode), receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling <strong>Complete</strong> on the received message. When Service Bus sees the <strong>Complete</strong> call, it will mark the message as being consumed and remove it from the queue.</p>
  <p>The example below demonstrates how messages can be received and processed using <strong>PeekLock</strong> mode (the default mode). The example below does an infinite loop and processes messages as they arrive into our "TestQueue":</p>
  <pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // URI address and token for our "HowToSample" namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Retrieve MessageReceiver for the "TestQueue" within our "HowToSample" namespace
 MessagingFactory factory = MessagingFactory.Create(uri, tP);
 MessageReceiver testQueue = factory.CreateMessageReceiver("TestQueue");
 
 // Continuously process messages sent to the "TestQueue" 
 while (true) 
 {  
    BrokeredMessage message = testQueue.Receive();

    if (message != null)
    {
       try 
       {
          Console.WriteLine("Body: " + message.GetBody&lt;string&gt;());
          Console.WriteLine("MessageID: " + message.MessageId);
          Console.WriteLine("Custom Property: " + message.Properties["TestProperty"]);

          // Remove message from queue
          message.Complete();
       }
       catch (Exception)
       {
          // Indicate a problem, unlock message in queue
          message.Abandon();
       }
    }
 } 
</pre>
  <h2>
    <a name="handle-crashes">
    </a>How to Handle Application Crashes and Unreadable Messages</h2>
  <p>Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the <strong>Abandon</strong> method on the received message (instead of the <strong>Complete</strong> method). This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.</p>
  <p>There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.</p>
  <p>In the event that the application crashes after processing the message but before the <strong>Complete</strong> request is issued, then the message will be redelivered to the application when it restarts. This is often called <strong>At Least Once Processing</strong>, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the <strong>MessageId</strong> property of the message, which will remain constant across delivery attempts.</p>
  <h2>
    <a name="next-steps">
    </a>Next Steps</h2>
  <p>Now that you've learned the basics of Service Bus queues, follow these links to learn more.</p>
  <ul>
    <li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx">Queues, Topics, and Subscriptions.</a></li>
    <li>Build a working application that sends and receives messages to and from a Service Bus queue: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh367512.aspx">Service Bus Brokered Messaging .NET Tutorial</a>.</li>
  </ul>
</body>