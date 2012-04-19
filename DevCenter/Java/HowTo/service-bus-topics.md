<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-java-how-to-service-bus-topics" urlDisplayName="Service Bus Topics" headerExpose="" pageTitle="Service Bus Topics - How To - Java - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use Service Bus Topics/Subscriptions</h1>
  <p>This guide will show you how to use Service Bus topics and subscriptions. The samples are written in Java and use the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx">Windows Azure SDK for Java</a>. The scenarios covered include <strong>creating topics and subscriptions</strong>, <strong>creating subscription filters</strong>, <strong>sending messages to a topic</strong>, <strong>receiving messages from a subscription</strong>, and <strong>deleting topics and subscriptions</strong>.</p>
  <h2>Table of Contents</h2>
  <ul>
    <li>
      <a href="#bkmk_WhatAreSvcBusTopics">What are Service Bus Topics and Subscriptions?</a>
    </li>
    <li>
      <a href="#bkmk_CreateSvcNamespace">Create a Service Namespace</a>
    </li>
    <li>
      <a href="#bkmk_ObtainDefaultMngmntCredentials">Obtain the Default Management Credentials for the Namespace</a>
    </li>
    <li>
      <a href="#bkmk_ConfigYourApp">Configure Your Application to Use Service Bus</a>
    </li>
    <li>
      <a href="#bkmk_HowToCreateTopic">How to: Create a Topic</a>
    </li>
    <li>
      <a href="#bkmk_HowToCreateSubscrip">How to: Create Subscriptions</a>
    </li>
    <li>
      <a href="#bkmk_HowToSendMsgs">How to: Send Messages to a Topic</a>
    </li>
    <li>
      <a href="#bkmk_HowToReceiveMsgs">How to: Receive Messages from a Subscription</a>
    </li>
    <li>
      <a href="#bkmk_HowToHandleAppCrash">How to: Handle Application Crashes and Unreadable Messages</a>
    </li>
    <li>
      <a href="#bkmk_HowToDeleteTopics">How to: Delete Topics and Subscriptions</a>
    </li>
    <li>
      <a href="#bkmk_NextSteps">Next Steps</a>
    </li>
  </ul>
  <h2>
    <a name="bkmk_WhatAreSvcBusTopics">
    </a>What are Service Bus Topics and Subscriptions?</h2>
  <p>Service Bus topics and subscriptions support a <strong>publish/subscribe messaging communication</strong> model. When using topics and subscriptions, components of a distributed application do not communicate directly with each other, they instead exchange messages via a topic, which acts as an intermediary.<br /><img src="../../../DevCenter/Java/media/SvcBusTopics_01_FlowDiagram.jpg" alt="Service Bus Topics diagram" /></p>
  <p>In contrast to Service Bus queues, where each message is processed by a single consumer, topics and subscriptions provide a <strong>one-to-many</strong> form of communication, using a publish/subscribe pattern. It is possible to register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently.</p>
  <p>A topic subscription resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter/restrict which messages to a topic are received by which topic subscriptions.</p>
  <p>Service Bus topics and subscriptions enable you to scale to process a very large number of messages across a very large number of users and applications.</p>
  <h2>
    <a name="bkmk_CreateSvcNamespace">
    </a>Create a Service Namespace</h2>
  <p>To begin using Service Bus topics in Windows Azure, you must first create a service namespace. A service namespace provides a scoping container for addressing Service Bus resources within your application.</p>
  <p>
    <strong>To create a service namespace:</strong>
  </p>
  <ol>
    <li>Log on to the <a href="http://windows.azure.com/">Windows Azure Management Portal</a>.</li>
    <li>In the lower left navigation pane of the Management Portal, click <strong>Service Bus, Access Control &amp; Caching</strong>.</li>
    <li>In the upper left pane of the Management Portal, click the <strong>Service Bus</strong> node, and then click the <strong>New</strong> button. <br /><img src="../../../DevCenter/dotNet/media/sb-queues-03.png" alt="Service Bus Node screenshot" /></li>
    <li>In the <strong>Create a new Service Namespace</strong> dialog, enter a <strong>Namespace</strong>, and then to make sure that it is unique, click the <strong>Check Availability</strong> button. <br /><img src="../../../DevCenter/dotNet/media/sb-queues-04.png" alt="Create a New Namespace " /></li>
    <li>After making sure the namespace name is available, choose the country or region in which your namespace should be hosted (make sure you use the same country/region in which you are deploying your compute resources), and then click the <strong>Create Namespace</strong> button. Having a compute instance is optional, and the service bus can be consumed from any application with internet access.<br /><br /> The namespace you created will then appear in the Management Portal and takes a moment to activate. Wait until the status is <strong>Active</strong> before moving on.</li>
  </ol>
  <h2>
    <a name="bkmk_ObtainDefaultMngmntCredentials">
    </a>Obtain the Default Management Credentials for the Namespace</h2>
  <p>In order to perform management operations, such as creating a topic, on the new namespace, you need to obtain the management credentials for the namespace.</p>
  <ol>
    <li>In the left navigation pane, click the <strong>Service Bus</strong> node, to display the list of available namespaces: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-03.png" alt="Available Namespaces " /></li>
    <li>Select the namespace you just created from the list shown:<br /><img src="../../../DevCenter/dotNet/media/sb-queues-05.png" alt="Namespace List screenshot" /></li>
    <li>The right-hand <strong>Properties</strong> pane will list the properties for the new namespace: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-06.png" alt="Properties Pane screenshot" /></li>
    <li>The <strong>Default Key</strong> is hidden. Click the <strong>View</strong> button to display the security credentials: <br /><img src="../../../DevCenter/dotNet/media/sb-queues-07.png" alt="Default Key screenshot" /></li>
    <li>Make a note of the <strong>Default Issuer</strong> and the <strong>Default Key</strong> as you will use this information below to perform operations with the namespace.</li>
  </ol>
  <h2>
    <a name="bkmk_ConfigYourApp">
    </a>Configure Your Application to Use Service Bus</h2>
  <p>Add the following import statements to the top of the Java file:</p>
  <pre class="prettyprint">  // Include the following imports to use service bus APIs
  import com.microsoft.windowsazure.services.serviceBus.*;
  import com.microsoft.windowsazure.services.serviceBus.models.*;
  import com.microsoft.windowsazure.services.core.*;
  import javax.xml.datatype.*;</pre>
  <h2>
    <a name="bkmk_HowToCreateTopic">
    </a>How to Create a Topic</h2>
  <p>Management operations for Service Bus topics can be performed via the <strong>ServiceBusContract</strong> class. A <strong>ServiceBusContract</strong> object is constructed with an appropriate configuration that encapsulates the token permissions to manage it, and the <strong>ServiceBusContract</strong> class is the sole point of communication with Azure.</p>
  <p>The <strong>ServiceBusService</strong> class provides methods to create, enumerate, and delete topics. The example below shows how a <strong>ServiceBusService</strong> can be used to create a topic named "TestTopic" within a "HowToSample" service namespace:</p>
  <pre class="prettyprint">  String issuer = "&lt;obtained from portal&gt;";
  String key = "&lt;obtained from portal&gt;";<br />
  Configuration config = 
  ServiceBusConfiguration.configureWithWrapAuthentication(“HowToSample”, issuer, 
key);<br />  ServiceBusContract service = ServiceBusService.create(config);<br />
  TopicInfo topicInfo = new TopicInfo("TestTopic");<br />  try<br />  {<br />     CreateTopicResult result = service.createTopic(topicInfo);<br />  } catch (ServiceException e) {<br />  System.out.print("ServiceException encountered: ");<br />    System.out.println(e.getMessage());<br />  System.exit(-1);<br />  }</pre>
  <p>There are methods on <strong>TopicInfo</strong> that allow properties of the topic to be tuned (for example: to set the default "time-to-live" value to be applied to messages sent to the topic). The following example shows how to create a topic named "TestTopic" with a maximum size of 5GB:</p>
  <pre class="prettyprint">  long maxSizeInMegabytes = 5120;<br />  TopicInfo topicInfo = new TopicInfo("TestTopic");<br />  TopicInfo.setMaxSizeInMegabytes(maxSizeInMegabytes); <br />
  CreateTopicResult result = service.createTopic(topicInfo);</pre>
  <p>
    <strong>Note:</strong> You can use the <strong>listTopics</strong> method on <strong>ServiceBusContract</strong> objects to check if a topic with a specified name already exists within a service namespace..</p>
  <h2>
    <a name="bkmk_HowToCreateSubscrip">
    </a>How to Create Subscriptions</h2>
  <p>Topic subscriptions are also created with the <strong>ServiceBusService</strong> class. Subscriptions are named and can have an optional filter that restricts the set of messages passed to the subscription's virtual queue.</p>
  <h3>Create a Subscription with the default (MatchAll) Filter</h3>
  <p>The <strong>MatchAll</strong> filter is the default filter that is used if no filter is specified when a new subscription is created. When the <strong>MatchAll</strong> filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named "AllMessages" and uses the default <strong>MatchAll</strong> filter.</p>
  <pre class="prettyprint">  String issuer = "&lt;obtained from portal&gt;";<br />  String key = "&lt;obtained from portal&gt;";<br />
  Configuration config = 
  ServiceBusConfiguration.configureWithWrapAuthentication(“HowToSample”, issuer, 
key);<br />
  ServiceBusContract service = ServiceBusService.create(config);<br />
  try<br />  {<br />     TopicInfo topicInfo = new TopicInfo("TestTopic");<br />     CreateTopicResult result = service.createTopic(topicInfo);<br />     SubscriptionInfo subInfo = new SubscriptionInfo("AllMessages");<br />     CreateSubscriptionResult result = service.createSubscription("TestTopic", 
subInfo);<br />  } catch (ServiceException e) {<br />  System.out.print("ServiceException encountered: ");<br />  System.out.println(e.getMessage());<br />  System.exit(-1);<br />  }</pre>
  <h3>Create Subscriptions with Filters</h3>
  <p>You can also setup filters that allow you to scope which messages sent to a topic should show up within a specific topic subscription.</p>
  <p>The most flexible type of filter supported by subscriptions is the <strong>SqlFilter</strong>, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more details about the expressions that can be used with a SQL filter, review the SqlFilter.SqlExpression syntax.</p>
  <p>The example below creates a subscription named "HighMessages" with a <strong>SqlFilter</strong> that only selects messages that have a custom <strong>MessageNumber</strong> property greater than 3:</p>
  <pre class="prettyprint">  // Create a "HighMessages" filtered subscription<br />  SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");
  CreateSubscriptionResult result = service.createSubscription("TestTopic", 
subInfo);<br />  RuleInfo ruleInfo = new RuleInfo();<br />  ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber &gt; 3");<br />  CreateRuleResult ruleResult = service.createRule("TestTopic", "HighMessages", 
ruleInfo);</pre>
  <p>Similarly, the following example creates a subscription named "LowMessages" with <br /> a SqlFilter that only selects messages that have a MessageNumber property less <br /> than or equal to 3:</p>
  <pre class="prettyprint">  // Create a "LowMessages" filtered subscription<br />  SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");<br />  CreateSubscriptionResult result = service.createSubscription("TestTopic", 
subInfo);
  RuleInfo ruleInfo = new RuleInfo();<br />  ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber &lt;= 3");<br />  CreateRuleResult ruleResult = service.createRule("TestTopic", "HighMessages", 
ruleInfo);</pre>
  <p>When a message is now sent to the "TestTopic", it will always be delivered to receivers subscribed to the "AllMessages" topic subscription, and selectively delivered to receivers subscribed to the "HighMessages" and "LowMessages" topic subscriptions (depending upon the message content).</p>
  <h2>
    <a name="bkmk_HowToSendMsgs">
    </a>How to Send Messages to a Topic</h2>
  <p>To send a message to a Service Bus Topic, your application will obtain a <strong>ServiceBusContract</strong> object. The below code demonstrates how to send a message for the "TestTopic" topic we created above within our "HowToSample" service namespace:</p>
  <pre class="prettyprint">String issuer = "&lt;obtained from portal&gt;";<br /> String key = "&lt;obtained from portal&gt;";<br /><br /> Configuration config = ServiceBusConfiguration.configureWithWrapAuthentication (“HowToSample”, issuer, key);<br /> ServiceBusContract service = ServiceBusService.create(config);<br /><br /> TopicInfo topicInfo = new TopicInfo("TestTopic");<br /> try<br /> {<br /> CreateTopicResult result = service.createTopic(topicInfo);<br /> BrokeredMessage message = new BrokeredMessage("sendMessageWorks");<br /> service.sendTopicMessage("TestTopic", message);<br /> } catch (ServiceException e) {<br /> System.out.print("ServiceException encountered: ");<br /> System.out.println(e.getMessage());<br /> System.exit(-1);<br /> }</pre>
  <p>Messages sent to Service Bus Topics are instances of the <strong>BrokeredMessage</strong> class. <strong>BrokeredMessage</strong> objects have a set of standard methods (such as <strong>setLabel</strong> and <strong>TimeToLive</strong>), a dictionary that is used to hold custom application specific properties, and a body of arbitrary application data. An application can set the body of the message by passing any serializable object into the constructor of the <strong>BrokeredMessage</strong>, and the appropriate <strong>DataContractSerializer</strong> will then be used to serialize the object. Alternatively, a <strong>java.io.InputStream</strong> can be provided.</p>
  <p>The following example demonstrates how to send five test messages to the "TestTopic" <strong>MessageSender</strong> we obtained in the code snippet above. Note how the <strong>MessageNumber</strong> property value of each message varies on the iteration of the loop (this will determine which subscriptions receive it):</p>
  <pre class="prettyprint">  for (int i=0; i&lt;5; i++)<br />  {
     // Create message, passing a string message for the body<br />     BrokeredMessage message = new BrokeredMessage("Test message " + i);<br />
     // Set some additional custom app-specific property<br />     message.setProperty("TestProperty", "TestValue" + i); <br />
     // Send message to the topic<br />     service.sendTopicMessage("TestTopic", message);<br />  }</pre>
  <p>Service Bus topics support a maximum message size of 256 MB (the header, which includes the standard and custom application properties, can have a maximum size of 64 MB). There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB.</p>
  <h2>
    <a name="bkmk_HowToReceiveMsgs">
    </a>How to Receive Messages from a Subscription</h2>
  <p>The primary way to receive messages from a subscription is to use a <strong>ServiceBusContract</strong> object. Received messages can work in two different modes: <strong>ReceiveAndDelete</strong> and <strong>PeekLock</strong>.</p>
  <p>When using the <strong>ReceiveAndDelete</strong> mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message, it marks the message as being consumed and returns it to the application. <strong>ReceiveAndDelete</strong> mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.</p>
  <p>In <strong>PeekLock</strong> mode, receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling <strong>Delete</strong> on the received message. When Service Bus sees the <strong>Delete</strong> call, it will mark the message as being consumed and remove it from the topic.</p>
  <p>The example below demonstrates how messages can be received and processed using <strong>PeekLock</strong> mode (not the default mode). The example below does an infinite loop and processes messages as they arrive to our "HighMessages" subscription. Note that the path to our "HighMessages" subscription is supplied in the form "&lt;topic path&gt;/subscriptions/&lt;subscription name&gt;".</p>
  <pre class="prettyprint">  ReceiveMessageOptions opts = ReceiveMessageOptions.DEFAULT;<br />  opts.setReceiveMode(ReceiveMode.PEEK_LOCK);<br />
  while(true)<br />  { 
     ReceiveTopicMessageResult resultQM = service.receiveTopicMessage("TestTopic", 
opts);<br />     BrokeredMessage message = resultQM.getValue(); <br />
     if (message != null &amp;&amp; message.getMessageId() != null)
     {<br />        try 
        {<br />              System.out.println("Body: " + message.toString());<br />              System.out.println("MessageID: " + message.getMessageId());
              System.out.println("Custom Property: " + message.getProperty("TestProperty"));<br />
              // Remove message from topic<br />              System.out.println("Deleting this message.");<br />              service.deleteMessage(message);
        }<br />        catch (Exception ex)<br />        {<br />              // Indicate a problem, unlock message in topic<br />              System.out.println("Inner exception encountered!");<br />              service.unlockMessage(message);<br />        }<br />  }<br />  else<br />  {<br />        System.out.println("Finishing up - no more messages.");<br />        break; // Added to handle no more messages in the topic.<br />        // Could instead wait for more messages to be added.<br />  }<br />} </pre>
  <h2>
    <a name="bkmk_HowToHandleAppCrash">
    </a>How to Handle Application Crashes and Unreadable Messages</h2>
  <p>Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the <strong>unlockMessage</strong> method on the received message (instead of the <strong>deleteMessage</strong> method). This will cause Service Bus to unlock the message within the topic and make it available to be received again, either by the same consuming application or by another consuming application.</p>
  <p>There is also a timeout associated with a message locked within the topic, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.</p>
  <p>In the event that the application crashes after processing the message but before the <strong>deleteMessage</strong> request is issued, then the message will be redelivered to the application when it restarts. This is often called <strong>At Least Once Processing</strong>, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the <strong>getMessageId</strong> method of the message, which will remain constant across delivery attempts.</p>
  <h2>
    <a name="bkmk_HowToDeleteTopics">
    </a>How to Delete Topics and Subscriptions</h2>
  <p>The primary way to delete topics and subscriptions is to use a <strong>ServiceBusContract</strong> object. Received messages can work in two different modes: <strong>ReceiveAndDelete</strong> and <strong>PeekLock</strong></p>
  <pre class="prettyprint">  // Delete Topic<br />  service.deleteTopic("TestTopic");
  // Delete subscription<br />  service.deleteSubscription("TestTopic", "HighMessages");</pre>
  <p>Deleting a topic will also delete any subscriptions that are registered with the topic. Subscriptions can also be deleted independently.</p>
  <h1>
    <a name="bkmk_NextSteps">
    </a>Next Steps</h1>
  <p>Now that you've learned the basics of Service Bus queues, see the MSDN topic <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx">Queues, Topics, and Subscriptions</a> for more information.</p>
</body>