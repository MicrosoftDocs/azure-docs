<properties 
	pageTitle="How to use Service Bus queues with PHP | Microsoft Azure" 
	description="Learn how to use Service Bus queues in Azure. Code samples written in PHP." 
	services="service-bus" 
	documentationCenter="php" 
	authors="sethmanheim" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="PHP" 
	ms.topic="article" 
	ms.date="06/01/2016" 
	ms.author="sethm"/>

# How to use Service Bus queues

[AZURE.INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

This guide shows you how to use Service Bus queues. The samples are written in PHP and use the [Azure SDK for PHP](../php-download-sdk.md). The scenarios covered include **creating queues**, **sending and receiving messages**, and **deleting queues**.

[AZURE.INCLUDE [howto-service-bus-queues](../../includes/howto-service-bus-queues.md)]

## Create a PHP application

The only requirement for creating a PHP application that accesses the Azure Blob service is the referencing of classes in the [Azure SDK for PHP](../php-download-sdk.md) from within your code. You can use any development tools to create your application, or Notepad.

> [AZURE.NOTE] Your PHP installation must also have the [OpenSSL extension](http://php.net/openssl) installed and enabled.

In this guide, you will use service features which can be called from within a PHP application locally, or in code running within an Azure web role, worker role, or website.

## Get the Azure client libraries

[AZURE.INCLUDE [get-client-libraries](../../includes/get-client-libraries.md)]

## Configure your application to use Service Bus

To use the Service Bus queue APIs, do the following:

1. Reference the autoloader file using the [require_once][require_once] statement.
2. Reference any classes you might use.

The following example shows how to include the autoloader file and reference the **ServicesBuilder** class.

> [AZURE.NOTE] This example (and other examples in this article) assumes you have installed the PHP Client Libraries for Azure via Composer. If you installed the libraries manually or as a PEAR package, you must reference the **WindowsAzure.php** autoloader file.

```
require_once 'vendor/autoload.php';
use WindowsAzure\Common\ServicesBuilder;
```

In the examples below, the `require_once` statement will always be shown, but only the classes necessary for the example to execute are referenced.

## Set up a Service Bus connection

To instantiate a Service Bus client, you must first have a valid connection string in this format:

```
Endpoint=[yourEndpoint];SharedSecretIssuer=[Default Issuer];SharedSecretValue=[Default Key]
```

Where **Endpoint** is typically of the format `[yourNamespace].servicebus.windows.net`.

To create any Azure service client you must use the **ServicesBuilder** class. You can:

* Pass the connection string directly to it.
* Use the **CloudConfigurationManager (CCM)** to check multiple external sources for the connection string:
	* By default it comes with support for one external source - environmental variables
	* You can add new sources by extending the **ConnectionStringSource** class

For the examples outlined here, the connection string will be passed directly.

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;

$connectionString = "Endpoint=[yourEndpoint];SharedSecretIssuer=[Default Issuer];SharedSecretValue=[Default Key]";

$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
```

## How to: create a queue

You can perform management operations for Service Bus queues via the **ServiceBusRestProxy** class. A **ServiceBusRestProxy** object is constructed via the **ServicesBuilder::createServiceBusService** factory method with an appropriate connection string that encapsulates the token permissions to manage it.

The following example shows how to instantiate a **ServiceBusRestProxy** and call **ServiceBusRestProxy->createQueue** to create a queue named `myqueue` within a `MySBNamespace` service namespace:

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\QueueInfo;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
	
try	{
	$queueInfo = new QueueInfo("myqueue");
		
	// Create queue.
	$serviceBusRestProxy->createQueue($queueInfo);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here: 
	// http://msdn.microsoft.com/library/windowsazure/dd179357
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

> [AZURE.NOTE] You can use the `listQueues` method on `ServiceBusRestProxy` objects to check if a queue with a specified name already exists within a namespace.

## How to: send messages to a queue

To send a message to a Service Bus queue, your application calls the **ServiceBusRestProxy->sendQueueMessage** method. The following code shows how to send a message to the `myqueue` queue previously created within the
`MySBNamespace` service namespace.

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\BrokeredMessage;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
		
try	{
	// Create message.
	$message = new BrokeredMessage();
	$message->setBody("my message");
	
	// Send message.
	$serviceBusRestProxy->sendQueueMessage("myqueue", $message);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here: 
	// http://msdn.microsoft.com/library/windowsazure/hh780775
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

Messages sent to (and received from ) Service Bus queues are instances of the **BrokeredMessage** class. **BrokeredMessage** objects have a set of standard methods (such as **getLabel**, **getTimeToLive**, **setLabel**, and **setTimeToLive**) and properties that are used to hold custom application-specific properties, and a body of arbitrary application data.

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This upper limit on queue size is 5 GB.

## How to receive messages from a queue

The best way to receive messages from a queue is to use a **ServiceBusRestProxy->receiveQueueMessage** method. Messages can be received in two different modes: **ReceiveAndDelete** (the default) and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message in a queue, it marks the message as being consumed and returns it to the application. **ReceiveAndDelete** mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In **PeekLock** mode, receiving a message becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers from receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by passing the received message to **ServiceBusRestProxy->deleteMessage**. When Service Bus sees the **deleteMessage** call, it will mark the message as being consumed and remove it from the queue.

The following example shows how a message can be received and processed using **PeekLock** mode (not the default mode).

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\ReceiveMessageOptions;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
		
try	{
	// Set the receive mode to PeekLock (default is ReceiveAndDelete).
	$options = new ReceiveMessageOptions();
	$options->setPeekLock();
		
	// Receive message.
	$message = $serviceBusRestProxy->receiveQueueMessage("myqueue", $options);
	echo "Body: ".$message->getBody()."<br />";
	echo "MessageID: ".$message->getMessageId()."<br />";
		
	/*---------------------------
		Process message here.
	----------------------------*/
		
	// Delete message. Not necessary if peek lock is not set.
	echo "Message deleted.<br />";
	$serviceBusRestProxy->deleteMessage($message);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here:
	// http://msdn.microsoft.com/library/windowsazure/hh780735
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

## How to: handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the **unlockMessage** method on the received message (instead of the **deleteMessage** method). This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the **deleteMessage** request is issued, then the message will be redelivered to the application when it restarts. This is often called **At Least Once Processing**; that is, each message is processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then adding additional logic to applications to handle duplicate message delivery is recommended. This is often achieved using the **getMessageId** method of the message, which remains constant across delivery attempts.

## Next steps

Now that you've learned the basics of Service Bus queues, see [Queues, topics, and subscriptions][] for more information.

For more information, also see the [PHP Developer Center](/develop/php/).

[Queues, Topics, and Subscriptions]: service-bus-queues-topics-subscriptions.md
[require_once]: http://php.net/require_once

 
