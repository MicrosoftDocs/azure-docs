<properties linkid="dev-java-how-to-service-bus-queues" urlDisplayName="Service Bus Queues" pageTitle="How to use Service Bus queues (Java) - Windows Azure" metaKeywords="Azure Service Bus queues, Azure queues, Azure messaging, Azure queues Java" metaDescription="Learn how to use Service Bus queues in Windows Azure. Code samples written in Java." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# <span> How to Use Service Bus Queues</span>

This guide will show you how to use Service Bus queues. The samples are
written in Java and use the [Windows Azure SDK for Java][]. The
scenarios covered include **creating queues**, **sending and receiving
messages**, and **deleting queues**.

## Table of Contents

-   [What are Service Bus Queues?][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Security Token Provider][]
-   [How to: Create a Queue][How to: Create a Security Token Provider]
-   [How to: Send Messages to a Queue][]
-   [How to: Receive Messages from a Queue][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [Next Steps][]

<div chunk="../../shared/chunks/howto-service-bus-queues.md" />

## <a name="bkmk_ConfigApp"> </a>Configure Your Application to Use Service Bus

Add the following import statements to the top of the Java file:

	// Include the following imports to use service bus APIs
	import com.microsoft.windowsazure.services.serviceBus.*;
	import com.microsoft.windowsazure.services.serviceBus.models.*; 
	import com.microsoft.windowsazure.services.core.*; 
	import javax.xml.datatype.*;
	
## <a name="bkmk_HowToCreateQueue"> </a>How to Create a Queue

Management operations for Service Bus queues can be performed via the
**ServiceBusContract** class. A **ServiceBusContract** object is
constructed with an appropriate configuration that encapsulates the
token permissions to manage it, and the **ServiceBusContract** class is
the sole point of communication with Azure.

The **ServiceBusService** class provides methods to create, enumerate,
and delete queues. The example below shows how a **ServiceBusService**
can be used to create a queue named "TestQueue" within a "HowToSample"
service namespace:

    String issuer = "<obtained from portal>";
    String key = "<obtained from portal>";
    Configuration config = 
    	ServiceBusConfiguration.configureWithWrapAuthentication(
			“HowToSample”, 
			issuer, 
			key);
    ServiceBusContract service = ServiceBusService.create(config);
    QueueInfo queueInfo = new QueueInfo("TestQueue");
    try
    {     
		CreateQueueResult result = service.createQueue(queueInfo);
    }
	catch (ServiceException e)
	{
	    System.out.print("ServiceException encountered: ");
        System.out.println(e.getMessage());
        System.exit(-1);
    }

There are methods on QueueInfo that allow properties of the queue to be
tuned (for example: to set the default "time-to-live" value to be
applied to messages sent to the queue). The following example shows how
to create a queue named "TestQueue" with a maximum size of 5GB:

    long maxSizeInMegabytes = 5120;
    QueueInfo queueInfo = new QueueInfo("TestQueue");
    queueInfo.setMaxSizeInMegabytes(maxSizeInMegabytes); 
    CreateQueueResult result = service.createQueue(queueInfo);

**Note:**You can use the **listQueues** method on **ServiceBusContract**
objects to check if a queue with a specified name already exists within
a service namespace.

## <a name="bkmk_HowToSendMsgs"> </a>How to Send Messages to a Queue

To send a message to a Service Bus Queue, your application will obtain a
**ServiceBusContract** object. The below code demonstrates how to send a
message for the "TestQueue" queue we created above within our
"HowToSample" service namespace:

    String issuer = "<obtained from portal>";
    String key = "<obtained from portal>";
    Configuration config = 
    	ServiceBusConfiguration.configureWithWrapAuthentication(
			“HowToSample”, 
			issuer,
			key);
    ServiceBusContract service = ServiceBusService.create(config);
    QueueInfo queueInfo = new QueueInfo("TestQueue");
    try
    {
         CreateQueueResult result = service.createQueue(queueInfo);
         BrokeredMessage message = new BrokeredMessage("sendMessageWorks");
         service.sendQueueMessage("TestQueue", message);
    }
	catch (ServiceException e) {
         System.out.print("ServiceException encountered: ");
         System.out.println(e.getMessage());
         System.exit(-1);
    }

Messages sent to (and received from ) Service Bus queues are instances
of the **BrokeredMessage** class. **BrokeredMessage** objects have a set
of standard methods (such as **getLabel**, **getTimeToLive**,
**setLabel**, and **setTimeToLive**), a dictionary that is used to hold
custom application specific properties, and a body of arbitrary
application data. An application can set the body of the message by
passing any serializable object into the constructor of the
**BrokeredMessage**, and the appropriate serializer will then be used to
serialize the object. Alternatively, a **java.IO.InputStream** can be
provided.

The following example demonstrates how to send five test messages to the
"TestQueue" **MessageSender** we obtained in the code snippet above:

    for (int i=0; i<5; i++)
    {
         // Create message, passing a string message for the body
         BrokeredMessage message = new BrokeredMessage("Test message " + i);
         // Set some additional custom app-specific property
         message.setProperty("TestProperty", "TestValue" + i); 
         // Send message to the queue
         service.sendQueueMessage("TestQueue", message);
    }

Service Bus queues support a maximum message size of 256 KB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 KB). There is no limit on the number of messages
held in a queue but there is a cap on the total size of the messages
held by a queue. This queue size is defined at creation time, with an
upper limit of 5 GB.

## <a name="bkmk_HowToReceiveMsgs"> </a>How to Receive Messages from a Queue

The primary way to receive messages from a queue is to use a
**ServiceBusContract** object. Received messages can work in two
different modes: **ReceiveAndDelete** and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot
operation - that is, when Service Bus receives a read request for a
message in a queue, it marks the message as being consumed and returns
it to the application. **ReceiveAndDelete** mode (which is the default
mode) is the simplest model and works best for scenarios in which an
application can tolerate not processing a message in the event of a
failure. To understand this, consider a scenario in which the consumer
issues the receive request and then crashes before processing it.
Because Service Bus will have marked the message as being consumed, then
when the application restarts and begins consuming messages again, it
will have missed the message that was consumed prior to the crash.

In **PeekLock** mode, receive becomes a two stage operation, which makes
it possible to support applications that cannot tolerate missing
messages. When Service Bus receives a request, it finds the next message
to be consumed, locks it to prevent other consumers receiving it, and
then returns it to the application. After the application finishes
processing the message (or stores it reliably for future processing), it
completes the second stage of the receive process by calling **Delete**
on the received message. When Service Bus sees the **Delete** call, it
will mark the message as being consumed and remove it from the queue.

The example below demonstrates how messages can be received and
processed using **PeekLock** mode (not the default mode). The example
below does an infinite loop and processes messages as they arrive into
our "TestQueue":

    ReceiveMessageOptions opts = ReceiveMessageOptions.DEFAULT;
    opts.setReceiveMode(ReceiveMode.PEEK_LOCK);
    while(true)
    { 
         ReceiveQueueMessageResult resultQM = 
			service.receiveQueueMessage("TestQueue", opts);
         BrokeredMessage message = resultQM.getValue(); 
         if (message != null && message.getMessageId() != null)
         {
            try 
            {
               System.out.println("Body: " + message.toString());
               System.out.println("MessageID: " + message.getMessageId());
               System.out.println("Custom Property: " + 
					message.getProperty("TestProperty"));
               // Remove message from queue
               System.out.println("Deleting this message.");
               service.deleteMessage(message);
            }
            catch (Exception ex)
            {
               // Indicate a problem, unlock message in queue
               System.out.println("Inner exception encountered!");
               service.unlockMessage(message);
            }
         }
         else
         {
            System.out.println("Finishing up - no more messages.");
            break; 
			// Added to handle no more messages in the queue.
            // Could instead wait for more messages to be added.
         }
    }

## <a name="bkmk_HowToHandleAppCrashes"> </a>How to Handle Application Crashes and Unreadable Messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlockMessage** method on the received message
(instead of the **deleteMessage** method). This will cause Service Bus
to unlock the message within the queue and make it available to be
received again, either by the same consuming application or by another
consuming application.

There is also a timeout associated with a message locked within the
queue, and if the application fails to process the message before the
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

## <a name="bkmk_NextSteps"> </a>Next Steps

Now that you've learned the basics of Service Bus queues, see the MSDN
topic [Queues, Topics, and Subscriptions][] for more information.

  [Windows Azure SDK for Java]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=vs.103).aspx
  [What are Service Bus Queues?]: #what-are-service-bus-queues
  [Create a Service Namespace]: #create-a-service-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
  [Configure Your Application to Use Service Bus]: #bkmk_ConfigApp
  [How to: Create a Security Token Provider]: #bkmk_HowToCreateQueue
  [How to: Send Messages to a Queue]: #bkmk_HowToSendMsgs
  [How to: Receive Messages from a Queue]: #bkmk_HowToReceiveMsgs
  [How to: Handle Application Crashes and Unreadable Messages]: #bkmk_HowToHandleAppCrashes
  [Next Steps]: #bkmk_NextSteps
  [Service Bus Queue Diagram]: ../../../DevCenter/Java/Media/SvcBusQueues_01_FlowDiagram.jpg
  [Windows Azure Management Portal]: http://manage.windowsazure.com/
  [Service Bus Node screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_02_SvcBusNode.jpg
  [Create a New Namespace screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_03_CreateNewSvcNamespace.jpg
  [Available Namespaces screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_04_SvcBusNode_AvailNamespaces.jpg
  [Namespace List screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_05_NamespaceList.jpg
  [Properties Pane screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_06_PropertiesPane.jpg
  [Default Key screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_07_DefaultKey.jpg
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
