---
title: Use Azure Service Bus queues in Node.js using azure-sb package
description: Learn how to create Node.js applications to send messages to and receive messages from an Azure Service Bus queue using the azure-sb package.
author: spelluru
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 06/23/2020
ms.author: spelluru
ms.custom: seo-javascript-september2019, seo-javascript-october2019
---

# Quickstart: Use Service Bus queues in Azure with Node.js and the azure-sb package
In this tutorial, you learn how to create Node.js applications to send messages to and receive messages from an Azure Service Bus queue using the [azure-sb](https://www.npmjs.com/package/azure-sb) package. The samples are written in JavaScript and use the Node.js [Azure module](https://www.npmjs.com/package/azure) which internally uses the azure-sb package.

> [!IMPORTANT]
> The [azure-sb](https://www.npmjs.com/package/azure-sb) package uses [Service Bus REST run-time APIs](/rest/api/servicebus/service-bus-runtime-rest). You can get a faster experience using the new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) which uses the faster [AMQP 1.0 protocol](service-bus-amqp-overview.md). 
> 
> To learn more about the new package, see [How to use Service Bus queues with Node.js and @azure/service-bus package](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-nodejs-how-to-use-queues-new-package), otherwise continue reading to see how to use the [azure](https://www.npmjs.com/package/azure) package.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue.
    1. Read the quick **overview** of Service Bus **queues**. 
    2. Create a Service Bus **namespace**. 
    3. Get the **connection string**. 

        > [!NOTE]
        > You will create a **queue** in the Service Bus namespace by using Node.js in this tutorial. 
 

## Create a Node.js application
Create a blank Node.js application. For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website][Create and deploy a Node.js application to an Azure Website], or [Node.js Cloud Service][Node.js Cloud Service] using Windows PowerShell.

## Configure your application to use Service Bus
To use Azure Service Bus, download and use the Node.js Azure package. This package includes a set of libraries that communicate with the Service Bus REST services.

### Use Node Package Manager (NPM) to obtain the package
1. Use the **Windows PowerShell for Node.js** command window to navigate to the **c:\\node\\sbqueues\\WebRole1** folder in which you created your sample application.
2. Type **npm install azure** in the command window, which should result in output similar to the following example:

    ```
    azure@0.7.5 node_modules\azure
        ├── dateformat@1.0.2-1.2.3
        ├── xmlbuilder@0.4.2
        ├── node-uuid@1.2.0
        ├── mime@1.2.9
        ├── underscore@1.4.4
        ├── validator@1.1.1
        ├── tunnel@0.0.2
        ├── wns@0.5.3
        ├── xml2js@0.2.7 (sax@0.5.2)
        └── request@2.21.0 (json-stringify-safe@4.0.0, forever-agent@0.5.0, aws-sign@0.3.0, tunnel-agent@0.3.0, oauth-sign@0.3.0, qs@0.6.5, cookie-jar@0.3.0, node-uuid@1.4.0, http-signature@0.9.11, form-data@0.0.8, hawk@0.13.1)
    ```
3. You can manually run the **ls** command to verify that a **node_modules** folder was created. Inside that folder, find the **azure** package, which contains the libraries you need to access Service Bus queues.

### Import the module
Using Notepad or another text editor, add the following to the top of the **server.js** file of the application:

```javascript
var azure = require('azure');
```

### Set up an Azure Service Bus connection
The Azure module reads the environment variable `AZURE_SERVICEBUS_CONNECTION_STRING` to obtain information required to connect to Service Bus. If this environment variable isn't set, you must specify the account information when calling `createServiceBusService`.

For an example of setting the environment variables in the [Azure portal][Azure portal] for an Azure Website, see [Node.js Web Application with Storage][Node.js Web Application with Storage].

## Create a queue
The **ServiceBusService** object enables you to work with Service Bus queues. The following code creates a **ServiceBusService** object. Add it near the top of the **server.js** file, after the statement to import the Azure module:

```javascript
var serviceBusService = azure.createServiceBusService();
```

By calling `createQueueIfNotExists` on the **ServiceBusService** object, the specified queue is returned (if it exists), or a new queue with the specified name is created. The following code uses `createQueueIfNotExists` to create or connect to the queue named `myqueue`:

```javascript
serviceBusService.createQueueIfNotExists('myqueue', function(error){
    if(!error){
        // Queue exists
    }
});
```

The `createServiceBusService` method also supports additional options, which enable you to override default queue settings such as message time to live or maximum queue size. The following example sets the maximum queue size to 5 GB, and a time to live (TTL) value of 1 minute:

```javascript
var queueOptions = {
      MaxSizeInMegabytes: '5120',
      DefaultMessageTimeToLive: 'PT1M'
    };

serviceBusService.createQueueIfNotExists('myqueue', queueOptions, function(error){
    if(!error){
        // Queue exists
    }
});
```

### Filters
Optional filtering operations can be applied to operations performed using **ServiceBusService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

```javascript
function handle (requestOptions, next)
```

After doing its pre-processing on the request options, the method must call `next`, passing a callback with the following signature:

```javascript
function (returnObject, finalCallback, next)
```

In this callback, and after processing the `returnObject` (the response from the request to the server), the callback must either invoke `next` if it exists to continue processing other filters, or invoke `finalCallback`, which ends the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, `ExponentialRetryPolicyFilter` and `LinearRetryPolicyFilter`. The following code creates a `ServiceBusService` object that uses the `ExponentialRetryPolicyFilter`:

```javascript
var retryOperations = new azure.ExponentialRetryPolicyFilter();
var serviceBusService = azure.createServiceBusService().withFilter(retryOperations);
```

## Send messages to a queue
To send a message to a Service Bus queue, your application calls the `sendQueueMessage` method on the **ServiceBusService** object. Messages sent to (and received from) Service Bus queues are **BrokeredMessage** objects, and have a set of standard properties (such as **Label** and **TimeToLive**), a dictionary that is used to hold custom application-specific properties, and a body of arbitrary application data. An application can set the body of the message by passing a string as the message. Any required standard properties are populated with default values.

The following example demonstrates how to send a test message to the queue named `myqueue` using `sendQueueMessage`:

```javascript
var message = {
    body: 'Test message',
    customProperties: {
        testproperty: 'TestValue'
    }};
serviceBusService.sendQueueMessage('myqueue', message, function(error){
    if(!error){
        // message sent
    }
});
```

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There's no limit on the number of messages held in a queue but there's a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB. For more information about quotas, see [Service Bus quotas][Service Bus quotas].

## Receive messages from a queue
Messages are received from a queue using the `receiveQueueMessage` method on the **ServiceBusService** object. By default, messages are deleted from the queue as they are read; however, you can read (peek) and lock the message without deleting it from the queue by setting the optional parameter `isPeekLock` to **true**.

The default behavior of reading and deleting the message as part of the receive operation is the simplest model, and works best for scenarios in which an application can tolerate not processing a message when a failure occurs. To understand this behavior, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed before the crash.

If the `isPeekLock` parameter is set to **true**, the receive becomes a two stage operation, which makes it possible to support applications that can't tolerate missing messages. When Service Bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling `deleteMessage` method and providing the message to be deleted as a parameter. The `deleteMessage` method marks the message as being consumed and removes it from the queue.

The following example demonstrates how to receive and process messages using `receiveQueueMessage`. The example first receives and deletes a message, and then receives a message using `isPeekLock` set to **true**, then deletes the message using `deleteMessage`:

```javascript
serviceBusService.receiveQueueMessage('myqueue', function(error, receivedMessage){
    if(!error){
        // Message received and deleted
    }
});
serviceBusService.receiveQueueMessage('myqueue', { isPeekLock: true }, function(error, lockedMessage){
    if(!error){
        // Message received and locked
        serviceBusService.deleteMessage(lockedMessage, function (deleteError){
            if(!deleteError){
                // Message deleted
            }
        });
    }
});
```

## How to handle application crashes and unreadable messages
Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the `unlockMessage` method on the **ServiceBusService** object. it will cause Service Bus to unlock the
message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There's also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the `deleteMessage` method is called, then the message will be redelivered to the application when it restarts. This approach is often called *At Least Once Processing*, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario can't tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. It's often achieved using the **MessageId** property of the message, which will remain constant across delivery attempts.

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
To learn more about queues, see the following resources.

* [Queues, topics, and subscriptions][Queues, topics, and subscriptions]
* [Azure SDK for Node][Azure SDK for Node] repository on GitHub
* [Node.js Developer Center](https://azure.microsoft.com/develop/nodejs/)

[Azure SDK for Node]: https://github.com/Azure/azure-sdk-for-node
[Azure portal]: https://portal.azure.com

[Node.js Cloud Service]: ../cloud-services/cloud-services-nodejs-develop-deploy-app.md
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[Create and deploy a Node.js application to an Azure Website]: ../app-service/app-service-web-get-started-nodejs.md
[Node.js Web Application with Storage]:../cosmos-db/table-storage-how-to-use-nodejs.md
[Service Bus quotas]: service-bus-quotas.md
