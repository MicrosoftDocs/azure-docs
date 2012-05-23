<properties linkid="dev-php-how-to-service-bus-topics" urldisplayname="Service Bus Topics" headerexpose="" pagetitle="Service Bus Topics - How To - PHP - Develop" metakeywords="Windows Azure Service Bus, Service Bus topics, Service Bus subscriptions, PHP" footerexpose="" metadescription="Learn how to use Windows Azure Service Bus topics and subscriptions with PHP." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Service Bus Topics/Subscriptions

This guide will show you how to use Service Bus topics and
subscriptions. The samples are written in PHP and use the [Windows Azure SDK for PHP][download-sdk]. The scenarios covered include **creating topics and subscriptions**, **creating subscription filters**, **sending messages to a topic**, **receiving messages from a subscription**, and **deleting topics and subscriptions**.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions?](#WhatAreTopicsAndSubscriptions)
-   [Create a Service Namespace](#CreateNamespace)
-   [Obtain the Default Management Credentials for the Namespace](#GetDefaultCredentials)
-   [Configure Your Application to Use Service Bus](#ConfigureApp)
-   [How to: Create a Topic](#CreateTopic)
-   [How to: Create a Subscription](#CreateSubscription)
-   [How to: Send Messages to a Topic][]
-   [How to: Receive Messages from a Subscription][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [How to: Delete Topics and Subscriptions][]
-   [Next Steps][]

<h2 id="WhatAreTopicsAndSubscriptions">What are Service Bus Topics and Subscriptions?</h2>

Service Bus topics and subscriptions support a **publish/subscribe
messaging communication** model. When using topics and subscriptions,
components of a distributed application do not communicate directly with
each other, they instead exchange messages via a topic, which acts as an
intermediary.

![Service Bus Topics diagram][]

In contrast to Service Bus queues, where each message is processed by a
single consumer, topics and subscriptions provide a **one-to-many** form
of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a
topic, it is then made available to each subscription to handle/process
independently.

A topic subscription resembles a virtual queue that receives copies of
the messages that were sent to the topic. You can optionally register
filter rules for a topic on a per-subscription basis, which allows you
to filter/restrict which messages to a topic are received by which topic
subscriptions.

Service Bus topics and subscriptions enable you to scale to process a
very large number of messages across a very large number of users and
applications.

<h2 id="CreateNamespace">Create a Service Namespace</h2>

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].
2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.
3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, and then click the **New** button. 
 
    ![Service Bus Node screenshot][]

4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button. 
 
    ![Create a New Namespace screenshot][]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources), and then click the **Create Namespace** button.
    Having a compute instance is optional, and the service bus can be
    consumed from any application with internet access.  
      
    The namespace you created will then appear in the Management Portal
    and takes a moment to activate. Wait until the status is **Active**
    before moving on.

<h2 id="GetDefaultCredentials">Obtain the Default Management Credentials for the Namespace</h2>

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:  
 
    ![Available Namespaces screenshot][]

2.  Select the namespace you just created from the list shown:   
    ![Namespace List screenshot][]
3.  The right-hand **Properties** pane will list the properties for the
    new namespace:   
    ![Properties Pane screenshot][]
4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![Default Key screenshot][]
5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

<h2 id="ConfigureApp">Configure Your Application to Use Service Bus</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Blob service is the referencing of classes in the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use service features which can be called within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download-sdk], and have created a Windows Azure Service Bus namespace in your Windows Azure subscription.

<div class="dev-callout"> 
<b>Note</b> 
<p>In addition to the dependencies noted in <a href="http://go.microsoft.com/fwlink/?LinkId=252473">Download the Windows Azure SDK for PHP</a>, your PHP installation must also have the <a href="http://php.net/openssl">OpenSSL extension</a> installed and enabled.</p> 
</div>


To use the Windows Azure Service Bus topic APIs, you need to:

1. Reference the `WindowsAzure.php` file (from the Windows Azure SDK for PHP) using the [require_once][require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `WindowsAzure.php` file and reference the **BlobService** class:

	require_once 'WindowsAzure.php';

	use WindowsAzure\ServiceBus\ServiceBusService;


In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="CreateTopic">How to Create a Topic</h2>

Management operations for Service Bus topics can be performed via the
**ServiceBusRestProxy** class. A **ServiceBusRestProxy** object is
constructed via the **ServiceBusService::create** method with an appropriate configuration that encapsulates the
token permissions to manage it.

The example below shows how create a **Configuration** object, instantiate **ServiceBusRestProxy** via the **ServiceBusService::create** method, and call **ServiceBusRestProxy->createTopic** to create a topic named `mytopic` within a `MySBNamespace` service namespace:

	require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\ServiceBus\ServiceBusSettings;
	use WindowsAzure\ServiceBus\ServiceBusService;
	use WindowsAzure\ServiceBus\Models\TopicInfo;

	$issuer = "<obtained from portal>";
	$key = "<obtained from portal>";

	// Create configuration object.
	$config = new Configuration();
	ServiceBusSettings::configureWithWrapAuthentication( $config,
														 "MySBNamespace",
														 $issuer,
														 $key);

	// Create Service Bus REST proxy.
	$serviceBusRestProxy = ServiceBusService::create($config);
	
	try	{		
		// Create topic.
		$topicInfo = new TopicInfo("mytopic");
		$serviceBusRestProxy->createTopic($topicInfo);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/dd179357
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<div class="dev-callout"> 
<b>Note</b> 
<p>You can use the <b>listTopics</b> method on <b>ServiceBusRestProxy</b> objects to check if a topic with a specified name already exists within a service namespace.</p> 
</div>

<h2 id="CreateSubscription">How to Create Subscriptions</h2>

Topic subscriptions are also created with the **ServiceBusService**
class. Subscriptions are named and can have an optional filter that
restricts the set of messages passed to the subscription's virtual
queue.

### Create a Subscription with the default (MatchAll) Filter

The **MatchAll** filter is the default filter that is used if no filter
is specified when a new subscription is created. When the **MatchAll**
filter is used, all messages published to the topic are placed in the
subscription's virtual queue. The following example creates a
subscription named "AllMessages" and uses the default **MatchAll**
filter.

      String issuer = "<obtained from portal>";  String key = "<obtained from portal>";
      Configuration config = 
      ServiceBusConfiguration.configureWithWrapAuthentication(“HowToSample”, issuer, 
    key);
      ServiceBusContract service = ServiceBusService.create(config);
      try  {     TopicInfo topicInfo = new TopicInfo("TestTopic");     CreateTopicResult result = service.createTopic(topicInfo);     SubscriptionInfo subInfo = new SubscriptionInfo("AllMessages");     CreateSubscriptionResult result = service.createSubscription("TestTopic", 
    subInfo);  } catch (ServiceException e) {  System.out.print("ServiceException encountered: ");  System.out.println(e.getMessage());  System.exit(-1);  }

### Create Subscriptions with Filters

You can also setup filters that allow you to scope which messages sent
to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
**SqlFilter**, which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the SqlFilter.SqlExpression syntax.

The example below creates a subscription named "HighMessages" with a
**SqlFilter** that only selects messages that have a custom
**MessageNumber** property greater than 3:

      // Create a "HighMessages" filtered subscription  SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");
      CreateSubscriptionResult result = service.createSubscription("TestTopic", 
    subInfo);  RuleInfo ruleInfo = new RuleInfo();  ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber > 3");  CreateRuleResult ruleResult = service.createRule("TestTopic", "HighMessages", 
    ruleInfo);

Similarly, the following example creates a subscription named
"LowMessages" with   
 a SqlFilter that only selects messages that have a MessageNumber
property less   
 than or equal to 3:

      // Create a "LowMessages" filtered subscription  SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");  CreateSubscriptionResult result = service.createSubscription("TestTopic", 
    subInfo);
      RuleInfo ruleInfo = new RuleInfo();  ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber <= 3");  CreateRuleResult ruleResult = service.createRule("TestTopic", "HighMessages", 
    ruleInfo);

When a message is now sent to the "TestTopic", it will always be
delivered to receivers subscribed to the "AllMessages" topic
subscription, and selectively delivered to receivers subscribed to the
"HighMessages" and "LowMessages" topic subscriptions (depending upon the
message content).

<h2 id="SendMessage">How to Send Messages to a Topic</h2>

To send a message to a Service Bus Topic, your application will obtain a
**ServiceBusContract** object. The below code demonstrates how to send a
message for the "TestTopic" topic we created above within our
"HowToSample" service namespace:

    String issuer = "<obtained from portal>"; String key = "<obtained from portal>"; Configuration config = ServiceBusConfiguration.configureWithWrapAuthentication (“HowToSample”, issuer, key); ServiceBusContract service = ServiceBusService.create(config); TopicInfo topicInfo = new TopicInfo("TestTopic"); try { CreateTopicResult result = service.createTopic(topicInfo); BrokeredMessage message = new BrokeredMessage("sendMessageWorks"); service.sendTopicMessage("TestTopic", message); } catch (ServiceException e) { System.out.print("ServiceException encountered: "); System.out.println(e.getMessage()); System.exit(-1); }

Messages sent to Service Bus Topics are instances of the
**BrokeredMessage** class. **BrokeredMessage** objects have a set of
standard methods (such as **setLabel** and **TimeToLive**), a dictionary
that is used to hold custom application specific properties, and a body
of arbitrary application data. An application can set the body of the
message by passing any serializable object into the constructor of the
**BrokeredMessage**, and the appropriate **DataContractSerializer** will
then be used to serialize the object. Alternatively, a
**java.io.InputStream** can be provided.

The following example demonstrates how to send five test messages to the
"TestTopic" **MessageSender** we obtained in the code snippet above.
Note how the **MessageNumber** property value of each message varies on
the iteration of the loop (this will determine which subscriptions
receive it):

      for (int i=0; i<5; i++)  {
         // Create message, passing a string message for the body     BrokeredMessage message = new BrokeredMessage("Test message " + i);
         // Set some additional custom app-specific property     message.setProperty("TestProperty", "TestValue" + i); 
         // Send message to the topic     service.sendTopicMessage("TestTopic", message);  }

Service Bus topics support a maximum message size of 256 MB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 MB). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

## <a name="bkmk_HowToReceiveMsgs"> </a>How to Receive Messages from a Subscription

The primary way to receive messages from a subscription is to use a
**ServiceBusContract** object. Received messages can work in two
different modes: **ReceiveAndDelete** and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot
operation - that is, when Service Bus receives a read request for a
message, it marks the message as being consumed and returns it to the
application. **ReceiveAndDelete** mode is the simplest model and works
best for scenarios in which an application can tolerate not processing a
message in the event of a failure. To understand this, consider a
scenario in which the consumer issues the receive request and then
crashes before processing it. Because Service Bus will have marked the
message as being consumed, then when the application restarts and begins
consuming messages again, it will have missed the message that was
consumed prior to the crash.

In **PeekLock** mode, receive becomes a two stage operation, which makes
it possible to support applications that cannot tolerate missing
messages. When Service Bus receives a request, it finds the next message
to be consumed, locks it to prevent other consumers receiving it, and
then returns it to the application. After the application finishes
processing the message (or stores it reliably for future processing), it
completes the second stage of the receive process by calling **Delete**
on the received message. When Service Bus sees the **Delete** call, it
will mark the message as being consumed and remove it from the topic.

The example below demonstrates how messages can be received and
processed using **PeekLock** mode (not the default mode). The example
below does an infinite loop and processes messages as they arrive to our
"HighMessages" subscription. Note that the path to our "HighMessages"
subscription is supplied in the form "&lt;topic
path&gt;/subscriptions/&lt;subscription name&gt;".

      ReceiveMessageOptions opts = ReceiveMessageOptions.DEFAULT;  opts.setReceiveMode(ReceiveMode.PEEK_LOCK);
      while(true)  { 
         ReceiveTopicMessageResult resultQM = service.receiveTopicMessage("TestTopic", 
    opts);     BrokeredMessage message = resultQM.getValue(); 
         if (message != null && message.getMessageId() != null)
         {        try 
            {              System.out.println("Body: " + message.toString());              System.out.println("MessageID: " + message.getMessageId());
                  System.out.println("Custom Property: " + message.getProperty("TestProperty"));
                  // Remove message from topic              System.out.println("Deleting this message.");              service.deleteMessage(message);
            }        catch (Exception ex)        {              // Indicate a problem, unlock message in topic              System.out.println("Inner exception encountered!");              service.unlockMessage(message);        }  }  else  {        System.out.println("Finishing up - no more messages.");        break; // Added to handle no more messages in the topic.        // Could instead wait for more messages to be added.  }} 

## <a name="bkmk_HowToHandleAppCrash"> </a>How to Handle Application Crashes and Unreadable Messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlockMessage** method on the received message
(instead of the **deleteMessage** method). This will cause Service Bus
to unlock the message within the topic and make it available to be
received again, either by the same consuming application or by another
consuming application.

There is also a timeout associated with a message locked within the
topic, and if the application fails to process the message before the
lock timeout expires (e.g., if the application crashes), then Service
Bus will unlock the message automatically and make it available to be
received again.

In the event that the application crashes after processing the message
but before the **deleteMessage** request is issued, then the message
will be redelivered to the application when it restarts. This is often
called **At Least Once Processing**, that is, each message will be
processed at least once but in certain situations the same message may
be redelivered. If the scenario cannot tolerate duplicate processing,
then application developers should add additional logic to their
application to handle duplicate message delivery. This is often achieved
using the **getMessageId** method of the message, which will remain
constant across delivery attempts.

## <a name="bkmk_HowToDeleteTopics"> </a>How to Delete Topics and Subscriptions

The primary way to delete topics and subscriptions is to use a
**ServiceBusContract** object. Received messages can work in two
different modes: **ReceiveAndDelete** and **PeekLock**

      // Delete Topic  service.deleteTopic("TestTopic");
      // Delete subscription  service.deleteSubscription("TestTopic", "HighMessages");

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently.

# <a name="bkmk_NextSteps"> </a>Next Steps

Now that you've learned the basics of Service Bus queues, see the MSDN
topic [Queues, Topics, and Subscriptions][] for more information.

[download-sdk]: http://go.microsoft.com/fwlink/?LinkId=252473
[What are Service Bus Topics and Subscriptions?]: #bkmk_WhatAreSvcBusTopics
[Create a Service Namespace]: #bkmk_CreateSvcNamespace
[Obtain the Default Management Credentials for the Namespace]: #bkmk_ObtainDefaultMngmntCredentials
[Configure Your Application to Use Service Bus]: #bkmk_ConfigYourApp
[How to: Create a Topic]: #bkmk_HowToCreateTopic
[How to: Create Subscriptions]: #bkmk_HowToCreateSubscrip
[How to: Send Messages to a Topic]: #bkmk_HowToSendMsgs
[How to: Receive Messages from a Subscription]: #bkmk_HowToReceiveMsgs
[How to: Handle Application Crashes and Unreadable Messages]: #bkmk_HowToHandleAppCrash
[How to: Delete Topics and Subscriptions]: #bkmk_HowToDeleteTopics
[Next Steps]: #bkmk_NextSteps
[Service Bus Topics diagram]: ../../../DevCenter/Java/Media/SvcBusTopics_01_FlowDiagram.jpg
[Windows Azure Management Portal]: http://windows.azure.com/
[Service Bus Node screenshot]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
[Create a New Namespace ]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
[Namespace List screenshot]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
[Properties Pane screenshot]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
[Default Key screenshot]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
[Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
