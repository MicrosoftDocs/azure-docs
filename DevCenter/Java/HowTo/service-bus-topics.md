<properties linkid="dev-java-how-to-service-bus-topics" urlDisplayName="Service Bus Topics" pageTitle="How to use Service Bus topics (Java) - Windows Azure" metaKeywords="Get started Azure Service Bus topics, Get Started Service Bus topics, Azure publish subscribe messaging, Azure messaging topics and subscriptions, Service Bus topic Java" metaDescription="Learn how to use Service Bus topics and subscriptions in Windows Azure. Code samples are written for Java applications." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# How to Use Service Bus Topics/Subscriptions

This guide will show you how to use Service Bus topics and
subscriptions. The samples are written in Java and use the [Windows Azure SDK for Java][]. The scenarios covered include **creating topics
and subscriptions**, **creating subscription filters**, **sending
messages to a topic**, **receiving messages from a subscription**, and
**deleting topics and subscriptions**.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions?][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Topic][]
-   [How to: Create Subscriptions][]
-   [How to: Send Messages to a Topic][]
-   [How to: Receive Messages from a Subscription][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [How to: Delete Topics and Subscriptions][]
-   [Next Steps][]

<div chunk="../../shared/chunks/howto-service-bus-topics.md" />

## <a name="bkmk_ConfigYourApp"> </a>Configure Your Application to Use Service Bus

Add the following import statements to the top of the Java file:

    // Include the following imports to use service bus APIs
    import com.microsoft.windowsazure.services.serviceBus.*;
    import com.microsoft.windowsazure.services.serviceBus.models.*;
    import com.microsoft.windowsazure.services.core.*;
    import javax.xml.datatype.*;

## <a name="bkmk_HowToCreateTopic"> </a>How to Create a Topic

Management operations for Service Bus topics can be performed via the
**ServiceBusContract** class. A **ServiceBusContract** object is
constructed with an appropriate configuration that encapsulates the
token permissions to manage it, and the **ServiceBusContract** class is
the sole point of communication with Azure.

The **ServiceBusService** class provides methods to create, enumerate,
and delete topics. The example below shows how a **ServiceBusService**
can be used to create a topic named "TestTopic" within a "HowToSample"
service namespace:

    String issuer = "<obtained from portal>";
    String key = "<obtained from portal>";
    Configuration config = 
    	ServiceBusConfiguration.configureWithWrapAuthentication(
			“HowToSample”,
			issuer,
			key);  
	ServiceBusContract service = ServiceBusService.create(config);
    TopicInfo topicInfo = new TopicInfo("TestTopic");
	try  
	{
    	CreateTopicResult result = service.createTopic(topicInfo);
	}
	catch (ServiceException e) {
		System.out.print("ServiceException encountered: ");
	    System.out.println(e.getMessage());
		System.exit(-1);
	}

There are methods on **TopicInfo** that allow properties of the topic to
be tuned (for example: to set the default "time-to-live" value to be
applied to messages sent to the topic). The following example shows how
to create a topic named "TestTopic" with a maximum size of 5GB:

    long maxSizeInMegabytes = 5120;  
	TopicInfo topicInfo = new TopicInfo("TestTopic");  TopicInfo.setMaxSizeInMegabytes(maxSizeInMegabytes); 
    CreateTopicResult result = service.createTopic(topicInfo);

**Note:** You can use the **listTopics** method on
**ServiceBusContract** objects to check if a topic with a specified name
already exists within a service namespace..

## <a name="bkmk_HowToCreateSubscrip"> </a>How to Create Subscriptions

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

    String issuer = "<obtained from portal>";
	String key = "<obtained from portal>";
    Configuration config = 	ServiceBusConfiguration.configureWithWrapAuthentication(
			“HowToSample”,
			issuer,
			key);    
	ServiceBusContract service = ServiceBusService.create(config);
    try 
	{
	    TopicInfo topicInfo = new TopicInfo("TestTopic");     
		CreateTopicResult result = service.createTopic(topicInfo);
		SubscriptionInfo subInfo = new SubscriptionInfo("AllMessages");
	    CreateSubscriptionResult result = 
			service.createSubscription("TestTopic", subInfo);
	}
	catch (ServiceException e) {
		System.out.print("ServiceException encountered: ");
		System.out.println(e.getMessage()); 
		System.exit(-1);
	}

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

    // Create a "HighMessages" filtered subscription  
	SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");
    CreateSubscriptionResult result = 
		service.createSubscription("TestTopic", subInfo);
	RuleInfo ruleInfo = new RuleInfo();
	ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber > 3");
	CreateRuleResult ruleResult = 
		service.createRule("TestTopic", "HighMessages", ruleInfo);

Similarly, the following example creates a subscription named
"LowMessages" with   
 a SqlFilter that only selects messages that have a MessageNumber
property less   
 than or equal to 3:

    // Create a "LowMessages" filtered subscription
	SubscriptionInfo subInfo = new SubscriptionInfo("HighMessages");
	CreateSubscriptionResult result = 
		service.createSubscription("TestTopic", subInfo);
    RuleInfo ruleInfo = new RuleInfo();
	ruleInfo = ruleInfo.withSqlExpressionFilter("MessageNumber <= 3");
	CreateRuleResult ruleResult = 
		service.createRule("TestTopic", "HighMessages", ruleInfo);

When a message is now sent to the "TestTopic", it will always be
delivered to receivers subscribed to the "AllMessages" topic
subscription, and selectively delivered to receivers subscribed to the
"HighMessages" and "LowMessages" topic subscriptions (depending upon the
message content).

## <a name="bkmk_HowToSendMsgs"> </a>How to Send Messages to a Topic

To send a message to a Service Bus Topic, your application will obtain a
**ServiceBusContract** object. The below code demonstrates how to send a
message for the "TestTopic" topic we created above within our
"HowToSample" service namespace:

    String issuer = "<obtained from portal>";
	String key = "<obtained from portal>";
	Configuration config = 	ServiceBusConfiguration.configureWithWrapAuthentication(
			“HowToSample”,
			issuer,
			key);
	ServiceBusContract service = ServiceBusService.create(config);
	TopicInfo topicInfo = new TopicInfo("TestTopic");
	try 
	{
		CreateTopicResult result = service.createTopic(topicInfo);
		BrokeredMessage message = new BrokeredMessage("sendMessageWorks");
		service.sendTopicMessage("TestTopic", message);
	} 
	catch (ServiceException e) {
		System.out.print("ServiceException encountered: ");
		System.out.println(e.getMessage());
		System.exit(-1);
	}

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
       	//Create message, passing a string message for the body
		BrokeredMessage message = new BrokeredMessage("Test message " + i);
		// Set some additional custom app-specific property
		message.setProperty("TestProperty", "TestValue" + i);
		// Send message to the topic
		service.sendTopicMessage("TestTopic", message);
	}

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
    	ReceiveSubscriptionMessageResult  resultQM = 
			service.receiveSubscriptionMessage("TestTopic", opts);
    	BrokeredMessage message = resultQM.getValue();
        if (message != null && message.getMessageId() != null)
        {
	        try 
            {
				System.out.println("Body: " + message.toString());
				System.out.println("MessageID: " + message.getMessageId());
                System.out.println("Custom Property: " + 
					message.getProperty("TestProperty"));
                // Remove message from topic
	            System.out.println("Deleting this message.");
				service.deleteMessage(message);
            }
			catch (Exception ex)
	        {              
				// Indicate a problem, unlock message in topic       
				System.out.println("Inner exception encountered!");              
				service.unlockMessage(message);
			}  
		}  
		else  
		{        
			System.out.println("Finishing up - no more messages.");        
			break; 
			// Added to handle no more messages in the topic.
	        // Could instead wait for more messages to be added.
		}
	} 

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

    // Delete Topic  
	service.deleteTopic("TestTopic");
    // Delete subscription  service.deleteSubscription("TestTopic", "HighMessages");

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently.

# <a name="bkmk_NextSteps"> </a>Next Steps

Now that you've learned the basics of Service Bus queues, see the MSDN
topic [Queues, Topics, and Subscriptions][] for more information.

  [Windows Azure SDK for Java]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx
  [What are Service Bus Topics and Subscriptions?]: #what-are-service-bus-topics
  [Create a Service Namespace]: #create-a-service-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
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
