<properties
umbracoNaviHide=0
pageTitle=Service Bus Topics - How To - .NET - Develop
metaKeywords=Get started Azure Service Bus topics, Get Started Service Bus topics, Azure publish subscribe messaging, Azure messaging topics and subscriptions, Azure Service Bus topic, Service Bus topic, Azure messaging topics and subscriptions .NET, Azure Service Bus topic .NET, Service Bus topic .NET, Azure messaging topics and subscriptions C#, Azure Service Bus topic C#, Service Bus topic C#
metaDescription=Get Started with Windows Azure Service Bus topics and subscriptions, including creating topics and subscriptions, creating subscription filters, sending messages to a topic, receiving messages from a subscription, and deleting topics and subscriptions.
linkid=dev-net-how-to-service-bus-topics
urlDisplayName=Service Bus Topics
headerExpose=
footerExpose=
disqusComments=1
/>
<h1>How to Use Service Bus Topics/Subscriptions</h1>
<p><span>This guide will show you how to use Service Bus topics and subscriptions. The samples are written in C# and use the .NET API. The scenarios covered include <strong>creating topics and subscriptions, creating subscription filters, sending messages</strong> to a topic, <strong>receiving messages from a subscription</strong>, and <strong>deleting topics and subscriptions</strong>. For more information on topics and subscriptions, see the <a href="#nextsteps">Next Steps</a> section. </span></p>
<h2>Table of Contents</h2>
<ul>
<li><a href="#what-is">What are Service Bus Topics and Subscriptions</a></li>
<li><a href="#create-namespace">Create a Service Namespace</a></li>
<li><a href="#obtain-creds">Obtain the Default Management Credentials for the Namespace</a></li>
<li><a href="#configure-app">Configure Your Application to Use Service Bus</a></li>
<li><a href="#create-provider">How to: Create a Security Token Provider</a></li>
<li><a href="#create-topic">How to: Create a Topic</a></li>
<li><a href="#create-subscriptions">How to: Create Subscriptions</a></li>
<li><a href="#send-messages">How to: Send Messages to a Topic</a></li>
<li><a href="#receive-messages">How to: Receive Messages from a Subscription</a></li>
<li><a href="#handle-crashes">How to: Handle Application Crashes and Unreadable Messages</a></li>
<li><a href="#delete-topics">How to: Delete Topics and Subscriptions</a></li>
<li><a href="#next-steps">Next Steps</a></li>
</ul>
<h2><a name="what-is"></a>What are Service Bus Topics and Subscriptions</h2>
<p>Service Bus topics and subscriptions support a <strong>publish/subscribe messaging communication</strong> model. When using topics and subscriptions, components of a distributed application do not communicate directly with each other, they instead exchange messages via a topic, which acts as an intermediary.</p>
<p><img src="/media/net/dev-net-how-to-sb-topics-01.png" alt="Topic Concepts"/></p>
<p>In contrast to Service Bus queues, where each message is processed by a single consumer, topics and subscriptions provide a <strong>one-to-many</strong> form of communication, using a publish/subscribe pattern. It is possible to register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently.</p>
<p>A topic subscription resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter/restrict which messages to a topic are received by which topic subscriptions.</p>
<p>Service Bus topics and subscriptions enable you to scale to process a very large number of messages across a very large number of users and applications.</p>
<h2><a name="create-namespace"></a>Create a Service Namespace</h2>
<p>To begin using Service Bus topics and subscriptions in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
<p>To create a service namespace:</p>
<ol>
<li>
<p>Log on to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
</li>
<li>
<p>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</p>
</li>
<li>
<p>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button. <br /><img src="/media/net/dev-net-how-to-sb-queues-03.png"/></p>
</li>
<li>
<p>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button. <br /><img src="/media/net/dev-net-how-to-sb-queues-04.png"/></p>
</li>
<li>
<p>After making sure the <strong>Namespace</strong> name is available, choose the country or region in which your namespace should be hosted (make sure you use the same <strong>Country/Region</strong> in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button.</p>
</li>
</ol>
<p>The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</p>
<h2><a name="obtain-creds"></a>Obtain the Default Management Credentials for the Namespace</h2>
<p>In order to perform management operations, such as creating a topic or subscription, on the new namespace, you need to obtain the management credentials for the namespace.</p>
<ol>
<li>
<p>In the left navigation pane, click the <strong>Service Bus</strong> node to display the list of available namespaces: <br /><img src="/media/net/dev-net-how-to-sb-queues-03.png"/></p>
</li>
<li>
<p>Select the namespace you just created from the list shown: <br /><img src="/media/net/dev-net-how-to-sb-queues-05.png"/></p>
</li>
<li>
<p>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace: <br /><img src="/media/net/dev-net-how-to-sb-queues-06.png"/></p>
</li>
<li>
<p>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials: <br /><img src="/media/net/dev-net-how-to-sb-queues-07.png"/></p>
</li>
<li>
<p>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</p>
</li>
</ol>
<h2><a name="configure-app"></a>Configure Your Application to Use Service Bus</h2>
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
<p>Add the following to the top of any C# file where you want to use Service Bus topics and subscriptions:</p>
<pre class="prettyprint"> using Microsoft.ServiceBus;
 using Microsoft.ServiceBus.Messaging;
</pre>
<p>You are now ready to write code against Service Bus.</p>
<h2><a name="create-provider"></a>How to Create a Security Token Provider</h2>
<p>Service Bus uses a claims-based security model implemented using the Windows Azure Access Control Service (ACS). The <strong>TokenProvider</strong> class provides a security token provider with built-in factory methods. The code below creates a <strong>SharedSecretTokenProvider</strong> to hold the shared secret credentials and handle the acquisition of the appropriate tokens from the Access Control Service:</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
</pre>
<p>Use the issuer and key values retrieved from the Management Portal as described in the previous section.</p>
<h2><a name="create-topic"></a>How to Create a Topic</h2>
<p>Management operations for Service Bus topics and subscriptions can be performed via the <strong>NamespaceManager</strong> class. A <strong>NamespaceManager</strong> object is constructed with the base address of a Service Bus namespace and an appropriate token provider that has permissions to manage it. The base address of a Service Bus namespace is a URI of the form "sb://.servicebus.windows.net". The <strong>ServiceBusEnvironment</strong> class provides the <strong>CreateServiceUri</strong> helper method to assist the creation of these URIs.</p>
<p>The <strong>NamespaceManager</strong> class provides methods to create, enumerate, and delete topics. The example below shows how a <strong>NamespaceManager</strong> can be used to create a topic named "TestTopic" within a "HowToSample" service namespace:</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
 
 // Retrieve URI of our "HowToSample" service namespace (created via the portal)
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for our "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Create a new Topic named "TestQueue" 
 namespaceManager.CreateTopic("TestTopic");
</pre>
<p>There are overloads of the <strong>CreateTopic</strong> method that allow properties of the topic to be tuned, for example, to set the default time-to-live to be applied to messages sent to the topic. These settings are applied by using the <strong>TopicDescription</strong> class. The following example shows how to create a topic named "TestTopic" with a maximum size of 5 GB and a default message time-to-live of 1 minute.</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key);
 
 // Retrieve URI of our "HowToSample" service namespace (created via the portal)
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for our "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Configure Topic Settings
 TopicDescription td = new TopicDescription("TestTopic");
 td.MaxSizeInMegabytes = 5120;
 td.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

 // Create a new Topic with custom settings
 namespaceManager.CreateTopic(td);
</pre>
<p><strong>Note:</strong> You can use the <strong>TopicExists</strong> method on <strong>NamespaceManager</strong> objects to check if a topic with a specified name already exists within a service namespace.</p>
<h2><a name="create-subscriptions"></a>How to Create Subscriptions</h2>
<p>Topic subscriptions are also created with the <strong>NamespaceManager</strong> class. Subscriptions are named and can have an optional filter that restricts the set of messages passed to the subscription's virtual queue.</p>
<h3>Create a Subscription with the default (MatchAll) Filter</h3>
<p>The <strong>MatchAll</strong> filter is the default filter that is used if no filter is specified when a new subscription is created. When the <strong>MatchAll</strong> filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named "AllMessages" and uses the default <strong>MatchAll</strong> filter.</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // TokenProvider and URI of our "HowToSample" service namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for the "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Create a new "AllMessages" subscription on our "TestTopic"  
 namespaceManager.CreateSubscription("TestTopic", "AllMessages");
</pre>
<h3>Create Subscriptions with Filters</h3>
<p>You can also setup filters that allow you to scope which messages sent to a topic should show up within a specific topic subscription.</p>
<p>The most flexible type of filter supported by subscriptions is the <strong>SqlFilter</strong>, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more details about the expressions that can be used with a SQL filter, review the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx">SqlFilter.SqlExpression</a> syntax.</p>
<p>The example below creates a subscription named "HighMessages" with a <strong>SqlFilter</strong> that only selects messages that have a custom <strong>MessageNumber</strong> property greater than 3:</p>
<pre class="prettyprint"> // Create a "HighMessages" filtered subscription
 SqlFilter highMessages = new SqlFilter("MessageNumber &gt; 3");
 namespaceManager.CreateSubscription("TestTopic", "HighMessages", highMessages);
</pre>
<p>Similarly, the following example creates a subscription named "LowMessages" with a <strong>SqlFilter</strong> that only selects messages that have a <strong>MessageNumber</strong> property less than or equal to 3:</p>
<pre class="prettyprint"> // Create a "LowMessages" filtered subscription
 SqlFilter lowMessages = new SqlFilter("MessageNumber &lt;= 3");
 namespaceManager.CreateSubscription("TestTopic", "LowMessages", lowMessages);
</pre>
<p>When a message is now sent to the "TestTopic", it will always be delivered to receivers subscribed to the "AllMessages" topic subscription, and selectively delivered to receivers subscribed to the "HighMessages" and "LowMessages" topic subscriptions (depending upon the message content).</p>
<h2><a name="send-messages"></a>How to Send Messages to a Topic</h2>
<p>To send a message to a Service Bus topic, your application will obtain a <strong>MessageSender</strong> object. Like <strong>NamespaceManager</strong> objects, this object is created from the base URI of the service namespace and the appropriate token provider.</p>
<p>The below code demonstrates how to retrieve a <strong>MessageSender</strong> object for the "TestTopic" topic we created above within our "HowToSample" service namespace:</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // URI address and token for our "HowToSample" namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Retrieve MessageSender for the "TestTopic" within our "HowToSample" namespace
 MessagingFactory factory = MessagingFactory.Create(uri, tP);
 MessageSender testTopic = factory.CreateMessageSender("TestTopic");
</pre>
<p>Messages sent to Service Bus Topics are instances of the <strong>BrokeredMessage</strong> class. <strong>BrokeredMessage</strong> objects have a set of standard properties (such as <strong>Label</strong> and <strong>TimeToLive</strong>), a dictionary that is used to hold custom application specific properties, and a body of arbitrary application data. An application can set the body of the message by passing any serializable object into the constructor of the <strong>BrokeredMessage</strong>, and the appropriate <strong>DataContractSerializer</strong> will then be used to serialize the object. Alternatively, a <strong>System.IO.Stream</strong> can be provided.</p>
<p>The following example demonstrates how to send five test messages to the "TestTopic" <strong>MessageSender</strong> we obtained in the code snippet above. Note how the <strong>MessageNumber</strong> property value of each message varies on the iteration of the loop (this will determine which subscriptions receive it):</p>
<pre class="prettyprint"> for (int i=0; i&lt;5; i++)
 {
   // Create message, passing a string message for the body
   BrokeredMessage message = new BrokeredMessage("Test message " + i);

   // Set additional custom app-specific property
   message.Properties["MessageNumber"] = i;

   // Send message to the topic
   testTopic.Send(message);
 }

</pre>
<p>Service Bus topics support a maximum message size of 256 MB (the header, which includes the standard and custom application properties, can have a maximum size of 64 MB). There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This queue size is defined at creation time, with an upper limit of 5 GB.</p>
<h2><a name="receive-messages"></a>How to Receive Messages from a Subscription</h2>
<p>The simplest way to receive messages from a subscription is to use a <strong>MessageReceiver</strong> object. <strong>MessageReceiver</strong> objects can work in two different modes: <strong>ReceiveAndDelete</strong> and <strong>PeekLock</strong>.</p>
<p>When using the <strong>ReceiveAndDelete</strong> mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message in a subscription, it marks the message as being consumed and returns it to the application. <strong>ReceiveAndDelete</strong> mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.</p>
<p>In <strong>PeekLock</strong> mode (which is the default mode), receive becomes a two stage operation which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling <strong>Complete</strong> on the received message. When Service Bus sees the <strong>Complete</strong> call, it will mark the message as being consumed and remove it from the subscription.</p>
<p>The example below demonstrates how messages can be received and processed using <strong>PeekLock</strong> mode (the default mode). The example below does an infinite loop and processes messages as they arrive to our "HighMessages" subscription. Note that the path to our "HighMessages" subscription is supplied in the form "&lt;<em>topic path</em>&gt;/subscriptions/&lt;<em>subscription name</em>&gt;".</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // URI address and token for our "HowToSample" namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Retrieve MessageReceiver for the "HighMessages" subscription 
 MessagingFactory factory = MessagingFactory.Create(uri, tP);
 MessageReceiver highMessages = 
    factory.CreateMessageReceiver("TestTopic/subscriptions/HighMessages");
 
 // Continuously process messages received from the "HighMessages" subscription 
 while (true) 
 {  
    BrokeredMessage message = highMessages.Receive();

    if (message != null)
    {
       try 
       {
          Console.WriteLine("Body: " + message.GetBody&lt;string&gt;());
          Console.WriteLine("MessageID: " + message.MessageId);
          Console.WriteLine("MessageNumber: " + message.Properties["MessageNumber"]);

          // Remove message from subscription
          message.Complete();
       }
       catch (Exception)
       {
          // Indicate a problem, unlock message in subscription
          message.Abandon();
       }
    }
 } 
</pre>
<h2><a name="handle-crashes"></a>How to Handle Application Crashes and Unreadable Messages</h2>
<p>Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the <strong>Abandon</strong> method on the received message (instead of the <strong>Complete</strong> method). This will cause Service Bus to unlock the message within the subscription and make it available to be received again, either by the same consuming application or by another consuming application.</p>
<p>There is also a timeout associated with a message locked within the subscription, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.</p>
<p>In the event that the application crashes after processing the message but before the <strong>Complete</strong> request is issued, then the message will be redelivered to the application when it restarts. This is often called <strong>At Least Once Processing</strong>, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the <strong>MessageId</strong> property of the message, which will remain constant across delivery attempts.</p>
<h2><a name="delete-topics"></a>How to Delete Topics and Subscriptions</h2>
<p>The example below demonstrates how to delete the topic named <strong>TestTopic</strong> from the <strong>HowToSample</strong> service namespace:</p>
<pre class="prettyprint"> string issuer = "&lt;obtained from portal&gt;";
 string key = "&lt;obtained from portal&gt;";

 // TokenProvider and URI of our "HowToSample" service namespace
 TokenProvider tP = TokenProvider.CreateSharedSecretTokenProvider(issuer, key); 
 Uri uri = ServiceBusEnvironment.CreateServiceUri("sb", "HowToSample", string.Empty);

 // Create NamespaceManager for the "HowToSample" service namespace
 NamespaceManager namespaceManager = new NamespaceManager(uri, tP);

 // Delete Topic
 namespaceManager.DeleteTopic("TestTopic");
</pre>
<p>Deleting a topic will also delete any subscriptions that are registered with the topic. Subscriptions can also be deleted independently. The following code demonstrates how to delete a subscription named <strong>HighMessages</strong> from the <strong>TestTopic</strong> topic:</p>
<pre class="prettyprint">  namespaceManager.DeleteSubscription("TestTopic", "HighMessages");
</pre>
<h2><a name="next-steps"></a><a name="nextsteps"></a>Next Steps</h2>
<p>Now that you've learned the basics of Service Bus topics, follow these links to learn more.</p>
<ul>
<li>See the MSDN Reference: <a href="http://msdn.microsoft.com/en-us/library/hh367516.aspx">Queues, Topics, and Subscriptions</a>.</li>
<li>API reference for <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx">SqlFilter</a>.</li>
<li>Build a working application that sends and receives messages to and from a Service Bus queue: <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh367512.aspx">Service Bus Brokered Messaging .NET Tutorial</a>.</li>
</ul>