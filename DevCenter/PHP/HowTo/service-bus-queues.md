<properties linkid="dev-php-how-to-service-bus-queues" urldisplayname="Service Bus Queues" headerexpose="" pagetitle="Service Bus Queues - How To - PHP - Develop" metakeywords="Windows Azure, PHP, Service Bus, Queues, Service Bus Queues" footerexpose="" metadescription="Learn how to use Windows Azure Service Bus Queues from PHP." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Service Bus Queues

This guide will show you how to use Service Bus queues with PHP. The samples are
written in PHP and use the [Windows Azure SDK for PHP][download-sdk]. The
scenarios covered include **creating queues**, **sending and receiving
messages**, and **deleting queues**.

## Table of Contents

-   [What are Service Bus queues?](#WhatAreQueues)
-   [Create a service namespace](#CreateNamespace)
-   [Obtain the default management credentials for the namespace](#GetDefaultCredentials)
-   [Configure your application to use Service Bus](#ConfigureApp)
-   [How to: Create a queue](#CreateQueue)
-   [How to: Send messages to a queue](#SendMessages)
-   [How to: Receive messages from a queue](#ReceiveMessages)
-   [How to: Handle application crashes and unreadable messages](#HandleCrashes)
-   [Next steps](#NextSteps)

<h2 id="WhatAreQueues">What are Service Bus queues?</h2>

Service Bus Queues support a **brokered messaging communication** model.
When using queues, components of a distributed application do not
communicate directly with each other, they instead exchange messages via
a queue, which acts as an intermediary. A message producer (sender)
hands off a message to the queue and then continues its processing.
Asynchronously, a message consumer (receiver) pulls the message from the
queue and processes it. The producer does not have to wait for a reply
from the consumer in order to continue to process and send further
messages. Queues offer **First In, First Out (FIFO)** message delivery
to one or more competing consumers. That is, messages are typically
received and processed by the receivers in the order in which they were
added to the queue, and each message is received and processed by only
one message consumer.

![Service Bus Queue Diagram][]

Service Bus queues are a general-purpose technology that can be used for
a wide variety of scenarios:

-   Communication between web and worker roles in a multi-tier Windows
    Azure application
-   Communication between on-premises apps and Windows Azure hosted apps
    in a hybrid solution
-   Communication between components of a distributed application
    running on-premises in different organizations or departments of an
    organization

Using queues can enable you to scale out your applications better, and
enable more resiliency to your architecture.

<h2 id="CreateNamespace">Create a service namespace</h2>

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

<h2 id="GetDefaultCredentials">Obtain the default management credentials for the namespace</h2>

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:  
 
    ![Available Namespaces screenshot][]

2.  Select the namespace you just created from the list shown: 
  
    ![Namespace List screenshot][]

3.  The right-hand **Properties** pane will list the properties for the new namespace:   

    ![Properties Pane screenshot][]

4.  The **Default Key** is hidden. Click the **View** button to display the security credentials:  
 
    ![Default Key screenshot][]

5.  Make a note of the **Default Issuer** and the **Default Key** as you will use this information below to perform operations with the  namespace.

<h2 id="ConfigureApp">Configure your application to use Service Bus</h2>

The only requirement for creating a PHP application that accesses the Windows Azure Blob service is the referencing of classes in the Windows Azure SDK for PHP from within your code. You can use any development tools to create your application, including Notepad.

In this guide, you will use service features which can be called within a PHP application locally, or in code running within a Windows Azure web role, worker role, or web site. We assume you have downloaded and installed PHP, followed the instructions in [Download the Windows Azure SDK for PHP] [download-sdk], and have created a Windows Azure Service Bus namespace in your Windows Azure subscription.

<div class="dev-callout"> 
<b>Note</b> 
<p>In addition to the dependencies noted in <a href="http://go.microsoft.com/fwlink/?LinkId=252473">Download the Windows Azure SDK for PHP</a>, your PHP installation must also have the <a href="http://php.net/openssl">OpenSSL extension</a> installed and enabled.</p> 
</div>


To use the Windows Azure Service Bus queue APIs, you need to:

1. Reference the `WindowsAzure.php` file (from the Windows Azure SDK for PHP) using the [require_once][require_once] statement, and
2. Reference any classes you might use.

The following example shows how to include the `WindowsAzure.php` file and reference the **ServiceBusService** class:

	require_once 'WindowsAzure.php';

	use WindowsAzure\ServiceBus\ServiceBusService;


In the examples below, the `require_once` statement will be shown always, but only the classes necessary for the example to execute will be referenced.

<h2 id="CreateQueue">How to: Create a queue</h2>

Management operations for Service Bus queues can be performed via the
**ServiceBusRestProxy** class. A **ServiceBusRestProxy** object is
constructed via the **ServiceBusService::create** method with an appropriate configuration that encapsulates the
token permissions to manage it.

The example below shows how create a **Configuration** object, instantiate **ServiceBusRestProxy** via the **ServiceBusService::create** method, and call **ServiceBusRestProxy->createQueue** to create a queue named `myqueue` within a `MySBNamespace` service namespace:

    require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\ServiceBus\ServiceBusSettings;
	use WindowsAzure\ServiceBus\ServiceBusService;
	use WindowsAzure\ServiceBus\Models\QueueInfo;

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
		$queueInfo = new QueueInfo("myqueue");
		
		// Create queue.
		$serviceBusRestProxy->createQueue($queueInfo);
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
<p>You can use the <b>listQueues</b> method on <b>ServiceBusRestProxy</b> objects to check if a queue with a specified name already exists within a service namespace.</p> 
</div>

<h2 id="SendMessages">How to: Send messages to a queue</h2>

To send a message to a Service Bus queue, your application will call the **ServiceBusRestProxy->sendQueueMessage** method. The code below demonstrates how to send a message to the "myqueue" queue we created above within the
"MySBNamespace" service namespace. Note that first parameter of the **sendQueueMessage** method is `myqueue/messages`, the path to which the message is sent.

	require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\ServiceBus\ServiceBusSettings;
	use WindowsAzure\ServiceBus\ServiceBusService;
	use WindowsAzure\ServiceBus\Models\BrokeredMessage;

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
	
	$message = new BrokeredMessage();
	$message->setBody("my message");
		
	try	{
		// Send message.
		$serviceBusRestProxy->sendQueueMessage("myqueue", $message);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here: 
		// http://msdn.microsoft.com/en-us/library/windowsazure/hh780775
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

Messages sent to (and received from ) Service Bus queues are instances
of the **BrokeredMessage** class. **BrokeredMessage** objects have a set
of standard methods (such as **getLabel**, **getTimeToLive**,
**setLabel**, and **setTimeToLive**) and properties that are used to hold
custom application specific properties, and a body of arbitrary
application data.

Service Bus queues support a maximum message size of 256 KB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 KB). There is no limit on the number of messages
held in a queue but there is a cap on the total size of the messages
held by a queue. This upper limit on queue size is 5 GB.

<h2 id="ReceiveMessages">How to: Receive messages from a queue</h2>

The primary way to receive messages from a queue is to use a **ServiceBusRestProxy->receiveQueueMessage** method. Received messages can work in two different modes: **ReceiveAndDelete** and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message in a queue, it marks the message as being consumed and returns it to the application. **ReceiveAndDelete** mode (which is the default mode) is the simplest model and works best for scenarios in which an
application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In **PeekLock** mode, receive becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by passing the received message to **ServiceBusRestProxy->deleteMessage**. When Service Bus sees the **deleteMessage** call, it will mark the message as being consumed and remove it from the queue.

The example below demonstrates how a message can be received and processed using **PeekLock** mode (not the default mode).

	require_once 'WindowsAzure.php';

	use WindowsAzure\Common\Configuration;
	use WindowsAzure\Common\ServiceException;
	use WindowsAzure\ServiceBus\ServiceBusSettings;
	use WindowsAzure\ServiceBus\ServiceBusService;
	use WindowsAzure\ServiceBus\Models\ReceiveMessageOptions;

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
	
	$options = new ReceiveMessageOptions();
	$options->setIsPeekLock(true);
		
	try	{
		// Get message.
		$message = $serviceBusRestProxy->receiveQueueMessage("myqueue", $options);
		echo "Body: ".$message->getBody()."<br />";
		echo "MessageID: ".$message->getMessageId()."<br />";
		
		/*---------------------------
			Process message here.
		----------------------------*/
		
		// Delete message.
		echo "Deleting message...<br />";
		$serviceBusRestProxy->deleteMessage($message);
	}
	catch(ServiceException $e){
		// Handle exception based on error codes and messages.
		// Error codes and messages are here:
		// http://msdn.microsoft.com/en-us/library/windowsazure/hh780735
		$code = $e->getCode();
		$error_message = $e->getMessage();
		echo $code.": ".$error_message."<br />";
	}

<h2 id="HandleCrashes">How to: Handle application crashes and unreadable messages</h2>

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

<h2 id="NextSteps">Next steps</h2>

Now that you've learned the basics of Service Bus queues, see the MSDN
topic [Queues, Topics, and Subscriptions][] for more information.

[download-sdk]: http://go.microsoft.com/fwlink/?LinkId=252473
[Service Bus Queue Diagram]: ../../../DevCenter/Java/Media/SvcBusQueues_01_FlowDiagram.jpg
[Windows Azure Management Portal]: http://windows.azure.com/
[Service Bus Node screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_02_SvcBusNode.jpg
[Create a New Namespace screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_03_CreateNewSvcNamespace.jpg
[Available Namespaces screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_04_SvcBusNode_AvailNamespaces.jpg
[Namespace List screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_05_NamespaceList.jpg
[Properties Pane screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_06_PropertiesPane.jpg
[Default Key screenshot]: ../../../DevCenter/Java/Media/SvcBusQueues_07_DefaultKey.jpg
[Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
[require_once]: http://php.net/require_once
