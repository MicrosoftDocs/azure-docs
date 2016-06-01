<properties 
	pageTitle="How to use Service Bus topics with PHP | Microsoft Azure" 
	description="Learn how to use Service Bus topics with PHP in Azure." 
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
	ms.date="05/10/2016" 
	ms.author="sethm"/>


# How to use Service Bus topics and subscriptions

[AZURE.INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This article shows you how to use Service Bus topics and subscriptions. The samples are written in PHP and use the [Azure SDK for PHP](../php-download-sdk.md). The scenarios covered include **creating topics and subscriptions**, **creating subscription filters**, **sending messages to a topic**, **receiving messages from a subscription**, and **deleting topics and subscriptions**.

[AZURE.INCLUDE [howto-service-bus-topics](../../includes/howto-service-bus-topics.md)]

## Create a PHP application

The only requirement for creating a PHP application that accesses the Azure Blob service is to reference classes in the [Azure SDK for PHP](../php-download-sdk.md) from within your code. You can use any development tools to create your application, or Notepad.

> [AZURE.NOTE] Your PHP installation must also have the [OpenSSL extension](http://php.net/openssl) installed and enabled.

This article describes how to use service features that can be called within a PHP application locally, or in code running within an Azure web role, worker role, or website.

## Get the Azure client libraries

[AZURE.INCLUDE [get-client-libraries](../../includes/get-client-libraries.md)]

## Configure your application to use Service Bus

To use the Service Bus APIs:

1. Reference the autoloader file using the [require_once][require-once] statement.
2. Reference any classes you might use.

The following example shows how to include the autoloader file and reference the **ServiceBusService** class.

> [AZURE.NOTE] This example (and other examples in this article) assumes you have installed the PHP Client Libraries for Azure via Composer. If you installed the libraries manually or as a PEAR package, you must reference the **WindowsAzure.php** autoloader file.

```
require_once 'vendor\autoload.php';
use WindowsAzure\Common\ServicesBuilder;
```

In the following examples, the `require_once` statement will always be shown, but only the classes necessary for the example to execute are referenced.

## Set up a Service Bus connection

To instantiate an Azure Service Bus client you must first have a valid connection string in this format:

```
Endpoint=[yourEndpoint];SharedSecretIssuer=[Default Issuer];SharedSecretValue=[Default Key]
```

Where `Endpoint` is typically of the format `https://[yourNamespace].servicebus.windows.net`.

To create any Azure service client you must use the **ServicesBuilder** class. You can:

* Pass the connection string directly to it.
* Use the **CloudConfigurationManager (CCM)** to check multiple external sources for the connection string:
	* By default it comes with support for one external source - environmental variables.
	* You can add new sources by extending the **ConnectionStringSource** class.

For the examples outlined here, the connection string is passed directly.

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
	
$connectionString = "Endpoint=[yourEndpoint];SharedSecretIssuer=[Default Issuer];SharedSecretValue=[Default Key]";

$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
```

## Create a topic

You can perform management operations for Service Bus topics via the **ServiceBusRestProxy** class. A **ServiceBusRestProxy** object is constructed via the **ServicesBuilder::createServiceBusService** factory method with an appropriate connection string that encapsulates the token permissions to manage it.

The following example shows how to instantiate a **ServiceBusRestProxy** and call **ServiceBusRestProxy->createTopic** to create a topic named `mytopic` within a `MySBNamespace` namespace:

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\TopicInfo;
	
// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
	
try	{		
	// Create topic.
	$topicInfo = new TopicInfo("mytopic");
	$serviceBusRestProxy->createTopic($topicInfo);
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

> [AZURE.NOTE] You can use the `listTopics` method on `ServiceBusRestProxy` objects to check if a topic with a specified name already exists within a service namespace.

## Create a subscription

Topic subscriptions are also created with the **ServiceBusRestProxy->createSubscription** method. Subscriptions are named and can have an optional filter that restricts the set of messages passed to the subscription's virtual queue.

### Create a subscription with the default (MatchAll) filter

The **MatchAll** filter is the default filter that is used if no filter is specified when a new subscription is created. When the **MatchAll** filter is used, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named 'mysubscription' and uses the default **MatchAll** filter.

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\SubscriptionInfo;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
	
try	{
	// Create subscription.
	$subscriptionInfo = new SubscriptionInfo("mysubscription");
	$serviceBusRestProxy->createSubscription("mytopic", $subscriptionInfo);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here: 
	// http://msdn.microsoft.com/library/azure/dd179357
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

### Create subscriptions with filters

You can also set up filters that enable you to specify which messages sent to a topic should appear within a specific topic subscription. The most flexible type of filter supported by subscriptions is the **SqlFilter**, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more information about SqlFilters, see [SqlFilter.SqlExpression Property][sqlfilter].

> [AZURE.NOTE] Each rule on a subscription processes incoming messages independently, adding their result messages to the subscription. In addition, each new subscription has a default **Rule** object with a filter that adds all messages from the topic to the subscription. To receive only messages matching your filter, you must remove the default rule. You can remove the default rule by using the `ServiceBusRestProxy->deleteRule` method.

The following example creates a subscription named **HighMessages** with a **SqlFilter** that only selects messages that have a custom **MessageNumber** property greater than 3 (see [Send messages to a topic](#send-messages-to-a-topic) for information about adding custom properties to messages):

```
$subscriptionInfo = new SubscriptionInfo("HighMessages");
$serviceBusRestProxy->createSubscription("mytopic", $subscriptionInfo);

$serviceBusRestProxy->deleteRule("mytopic", "HighMessages", '$Default');

$ruleInfo = new RuleInfo("HighMessagesRule");
$ruleInfo->withSqlFilter("MessageNumber > 3");
$ruleResult = $serviceBusRestProxy->createRule("mytopic", "HighMessages", $ruleInfo);
```

Note that this code requires the use of an additional namespace: `WindowsAzure\ServiceBus\Models\SubscriptionInfo`.

Similarly, the following example creates a subscription named **LowMessages** with a **SqlFilter** that only selects messages that have a **MessageNumber** property less than or equal to 3:

```
$subscriptionInfo = new SubscriptionInfo("LowMessages");
$serviceBusRestProxy->createSubscription("mytopic", $subscriptionInfo);

$serviceBusRestProxy->deleteRule("mytopic", "LowMessages", '$Default');

$ruleInfo = new RuleInfo("LowMessagesRule");
$ruleInfo->withSqlFilter("MessageNumber <= 3");
$ruleResult = $serviceBusRestProxy->createRule("mytopic", "LowMessages", $ruleInfo);
```

Now, when a message is sent to the `mytopic` topic, it is always delivered to receivers subscribed to the `mysubscription` subscription, and selectively delivered to receivers subscribed to the `HighMessages` and `LowMessages` subscriptions (depending upon the message content).

## Send messages to a topic

To send a message to a Service Bus topic, your application calls the **ServiceBusRestProxy->sendTopicMessage** method. The following code shows how to send a message to the `mytopic` topic previously created within the
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
	$serviceBusRestProxy->sendTopicMessage("mytopic", $message);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here: 
	// http://msdn.microsoft.com/library/azure/hh780775
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

Messages sent to Service Bus topics are instances of the **BrokeredMessage** class. **BrokeredMessage** objects have a set of standard properties and methods (such as **getLabel**, **getTimeToLive**, **setLabel**, and **setTimeToLive**), as well as properties that can be used to hold custom application-specific properties. The following example shows how to send 5 test messages to the `mytopic` topic previously created. The **setProperty** method is used to add a custom property (`MessageNumber`) to each message. Note that the `MessageNumber` property value varies on each message (you can use this value to determine which subscriptions receive it, as shown in the [Create a subscription](#create-a-subscription) section):

```
for($i = 0; $i < 5; $i++){
	// Create message.
	$message = new BrokeredMessage();
	$message->setBody("my message ".$i);
			
	// Set custom property.
	$message->setProperty("MessageNumber", $i);
			
	// Send message.
	$serviceBusRestProxy->sendTopicMessage("mytopic", $message);
}
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This upper limit on topic size is 5 GB. For more information about quotas, see [Service Bus quotas][].

## Receive messages from a subscription

The best way to receive messages from a subscription is to use a **ServiceBusRestProxy->receiveSubscriptionMessage** method. Received messages can work in two different modes: **ReceiveAndDelete** (the default) and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot operation; that is, when Service Bus receives a read request for a message in a subscription, it marks the message as being consumed and returns it to the application. **ReceiveAndDelete** mode is the simplest model and works best for scenarios in which an
application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In **PeekLock** mode, receiving a message becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by passing the received message to **ServiceBusRestProxy->deleteMessage**. When Service Bus sees the **deleteMessage** call, it will mark the message as being consumed and remove it from the queue.

The following example shows how to receive and process a message using **PeekLock** mode (not the default mode). 

```
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\ReceiveMessageOptions;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
		
try	{
	// Set receive mode to PeekLock (default is ReceiveAndDelete)
	$options = new ReceiveMessageOptions();
	$options->setPeekLock();
	
	// Get message.
	$message = $serviceBusRestProxy->receiveSubscriptionMessage("mytopic", "mysubscription", $options);

	echo "Body: ".$message->getBody()."<br />";
	echo "MessageID: ".$message->getMessageId()."<br />";
		
	/*---------------------------
		Process message here.
	----------------------------*/
		
	// Delete message. Not necessary if peek lock is not set.
	echo "Deleting message...<br />";
	$serviceBusRestProxy->deleteMessage($message);
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here:
	// http://msdn.microsoft.com/library/azure/hh780735
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

## How to: handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the **unlockMessage** method on the received message (instead of the **deleteMessage** method). This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the **deleteMessage** request is issued, then the message will be redelivered to the application when it restarts. This is often called **At Least Once Processing**; that is, each message is processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to applications to handle duplicate message delivery. This is often achieved using the **getMessageId** method of the message, which remains constant across delivery attempts.

## Delete topics and subscriptions

To delete a topic or a subscription, use the **ServiceBusRestProxy->deleteTopic** or the **ServiceBusRestProxy->deleteSubscripton** methods, respectively. Note that deleting a topic also deletes any subscriptions that are registered with the topic.

The following example shows how to delete a topic named `mytopic` and its registered subscriptions.

```
require_once 'vendor/autoload.php';

use WindowsAzure\ServiceBus\ServiceBusService;
use WindowsAzure\ServiceBus\ServiceBusSettings;
use WindowsAzure\Common\ServiceException;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
	
try	{		
	// Delete topic.
	$serviceBusRestProxy->deleteTopic("mytopic");
}
catch(ServiceException $e){
	// Handle exception based on error codes and messages.
	// Error codes and messages are here: 
	// http://msdn.microsoft.com/library/azure/dd179357
	$code = $e->getCode();
	$error_message = $e->getMessage();
	echo $code.": ".$error_message."<br />";
}
```

By using the **deleteSubscription** method, you can delete a subscription independently:

```
$serviceBusRestProxy->deleteSubscription("mytopic", "mysubscription");
```

## Next steps

Now that you've learned the basics of Service Bus queues, see [Queues, topics, and subscriptions][] for more information.

[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[sqlfilter]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
[require-once]: http://php.net/require_once
[Service Bus quotas]: service-bus-quotas.md
