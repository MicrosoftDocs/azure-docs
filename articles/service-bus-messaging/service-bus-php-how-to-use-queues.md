---
title: How to use Azure Service Bus queues with PHP
description: In this tutorial, you learn how to create PHP applications to send messages to and receive messages from a Service Bus queue. 
services: service-bus-messaging
ms.devlang: PHP
ms.topic: quickstart
ms.date: 06/23/2020
---

# Quickstart: How to use Service Bus queues with PHP
[!INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

In this tutorial, you learn how to create PHP applications to send messages to and receive messages from a Service Bus queue. 

## Prerequisites
1. An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
2. If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue.
    1. Read the quick **overview** of Service Bus **queues**. 
    2. Create a Service Bus **namespace**. 
    3. Get the **connection string**. 

        > [!NOTE]
        > You will create a **queue** in the Service Bus namespace by using PHP in this tutorial. 
3. [Azure SDK for PHP](https://github.com/Azure/azure-sdk-for-php)

## Create a PHP application
The only requirement for creating a PHP application that accesses the Azure Blob service is the referencing of classes in the [Azure SDK for PHP](https://github.com/Azure/azure-sdk-for-php) from within your code. You can use any development tools to create your application, or Notepad.

> [!NOTE]
> Your PHP installation must also have the [OpenSSL extension](https://php.net/openssl) installed and enabled.

In this guide, you will use service features, which can be called from within a PHP application locally, or in code running within an Azure web role, worker role, or website.

## Get the Azure client libraries
[!INCLUDE [get-client-libraries](../../includes/get-client-libraries.md)]

## Configure your application to use Service Bus
To use the Service Bus queue APIs, do the following:

1. Reference the autoloader file using the [require_once][require_once] statement.
2. Reference any classes you might use.

The following example shows how to include the autoloader file and reference the `ServicesBuilder` class.

> [!NOTE]
> This example (and other examples in this article) assumes you have installed the PHP Client Libraries for Azure via Composer. If you installed the libraries manually or as a PEAR package, you must reference the **WindowsAzure.php** autoloader file.
> 
> 

```php
require_once 'vendor/autoload.php';
use WindowsAzure\Common\ServicesBuilder;
```

In the examples below, the `require_once` statement will always be shown, but only the classes necessary for the example to execute are referenced.

## Set up a Service Bus connection
To instantiate a Service Bus client, you must first have a valid connection string in this format:

```
Endpoint=[yourEndpoint];SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[Primary Key]
```

Where `Endpoint` is typically of the format `[yourNamespace].servicebus.windows.net`.

To create any Azure service client, you must use the `ServicesBuilder` class. You can:

* Pass the connection string directly to it.
* Use the **CloudConfigurationManager (CCM)** to check multiple external sources for the connection string:
  * By default it comes with support for one external source - environmental variables
  * You can add new sources by extending the `ConnectionStringSource` class

For the examples outlined here, the connection string is passed directly.

```php
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;

$connectionString = "Endpoint=[yourEndpoint];SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[Primary Key]";

$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);
```

## Create a queue
You can perform management operations for Service Bus queues via the `ServiceBusRestProxy` class. A `ServiceBusRestProxy` object is constructed via the `ServicesBuilder::createServiceBusService` factory method with an appropriate connection string that encapsulates the token permissions to manage it.

The following example shows how to instantiate a `ServiceBusRestProxy` and call `ServiceBusRestProxy->createQueue` to create a queue named `myqueue` within a `MySBNamespace` service namespace:

```php
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\QueueInfo;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);

try    {
    $queueInfo = new QueueInfo("myqueue");

    // Create queue.
    $serviceBusRestProxy->createQueue($queueInfo);
}
catch(ServiceException $e){
    // Handle exception based on error codes and messages.
    // Error codes and messages are here: 
    // https://docs.microsoft.com/rest/api/storageservices/Common-REST-API-Error-Codes
    $code = $e->getCode();
    $error_message = $e->getMessage();
    echo $code.": ".$error_message."<br />";
}
```

> [!NOTE]
> You can use the `listQueues` method on `ServiceBusRestProxy` objects to check if a queue with a specified name already exists within a namespace.
> 
> 

## Send messages to a queue
To send a message to a Service Bus queue, your application calls the `ServiceBusRestProxy->sendQueueMessage` method. The following code shows how to send a message to the `myqueue` queue previously created within the
`MySBNamespace` service namespace.

```php
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\BrokeredMessage;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);

try    {
    // Create message.
    $message = new BrokeredMessage();
    $message->setBody("my message");

    // Send message.
    $serviceBusRestProxy->sendQueueMessage("myqueue", $message);
}
catch(ServiceException $e){
    // Handle exception based on error codes and messages.
    // Error codes and messages are here: 
    // https://docs.microsoft.com/rest/api/storageservices/Common-REST-API-Error-Codes
    $code = $e->getCode();
    $error_message = $e->getMessage();
    echo $code.": ".$error_message."<br />";
}
```

Messages sent to (and received from) Service Bus queues are instances of the [BrokeredMessage][BrokeredMessage] class. [BrokeredMessage][BrokeredMessage] objects have a set of standard methods and properties that are used to hold custom application-specific properties, and a body of arbitrary application data.

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This upper limit on queue size is 5 GB.

## Receive messages from a queue

The best way to receive messages from a queue is to use a `ServiceBusRestProxy->receiveQueueMessage` method. Messages can be received in two different modes: [*ReceiveAndDelete*](/dotnet/api/microsoft.servicebus.messaging.receivemode) and [*PeekLock*](/dotnet/api/microsoft.servicebus.messaging.receivemode#Microsoft_ServiceBus_Messaging_ReceiveMode_PeekLock). **PeekLock** is the default.

When using [ReceiveAndDelete](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode, receive is a single-shot operation; that is, when Service Bus receives a read request for a message in a queue, it marks the message as being consumed and returns it to the application. [ReceiveAndDelete](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In the default [PeekLock](/dotnet/api/microsoft.servicebus.messaging.receivemode#Microsoft_ServiceBus_Messaging_ReceiveMode_PeekLock) mode, receiving a message becomes a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers from receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by passing the received message to `ServiceBusRestProxy->deleteMessage`. When Service Bus sees the `deleteMessage` call, it will mark the message as being consumed and remove it from the queue.

The following example shows how to receive and process a message using [PeekLock](/dotnet/api/microsoft.servicebus.messaging.receivemode#Microsoft_ServiceBus_Messaging_ReceiveMode_PeekLock) mode (the default mode).

```php
require_once 'vendor/autoload.php';

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;
use WindowsAzure\ServiceBus\Models\ReceiveMessageOptions;

// Create Service Bus REST proxy.
$serviceBusRestProxy = ServicesBuilder::getInstance()->createServiceBusService($connectionString);

try    {
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
    // https://docs.microsoft.com/rest/api/storageservices/Common-REST-API-Error-Codes
    $code = $e->getCode();
    $error_message = $e->getMessage();
    echo $code.": ".$error_message."<br />";
}
```

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the `unlockMessage` method on the received message (instead of the `deleteMessage` method). This will cause Service Bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the `deleteMessage` request is issued, then the message will be redelivered to the application when it restarts. This is often called *At Least Once* processing; that is, each message is processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then adding additional logic to applications to handle duplicate message delivery is recommended. This is often achieved using the `getMessageId` method of the message, which remains constant across delivery attempts.

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
Now that you've learned the basics of Service Bus queues, see [Queues, topics, and subscriptions][Queues, topics, and subscriptions] for more information.

For more information, also visit the [PHP Developer Center](https://azure.microsoft.com/develop/php/).

[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[require_once]: https://php.net/require_once


