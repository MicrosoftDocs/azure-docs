<properties 
	pageTitle="How to use Service Bus topics with Node.js | Microsoft Azure" 
	description="Learn how to use Service Bus topics and subscriptions in Azure from a Node.js app." 
	services="service-bus" 
	documentationCenter="nodejs" 
	authors="sethmanheim" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="05/10/2016" 
	ms.author="sethm"/>


# How to Use Service Bus topics and subscriptions

[AZURE.INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

This guide describes how to use Service Bus topics and subscriptions
from Node.js applications. The scenarios covered include **creating
topics and subscriptions**, **creating subscription filters**, **sending
messages** to a topic, **receiving messages from a subscription**, and
**deleting topics and subscriptions**. For more information about topics
and subscriptions, see the [Next steps](#next-steps) section.

[AZURE.INCLUDE [howto-service-bus-topics](../../includes/howto-service-bus-topics.md)]

## Create a Node.js application

Create a blank Node.js application. For instructions on creating a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or Web Site with WebMatrix.

## Configure your application to use Service Bus

To use Service Bus, download the Node.js Azure package. This package includes a set of libraries that
communicate with the Service Bus REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

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

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Service Bus topics.

### Import the module

Using Notepad or another text editor, add the following to the top of the **server.js** file of the application:

```
var azure = require('azure');
```

### Set up a Service Bus connection

The Azure module reads the environment variables AZURE\_SERVICEBUS\_NAMESPACE and AZURE\_SERVICEBUS\_ACCESS\_KEY for information required to connect to Service Bus. If these environment variables are not set, you must specify the account information when calling **createServiceBusService**.

For an example of setting the environment variables in a configuration file for an Azure Cloud Service, see [Node.js Cloud Service with Storage][].

For an example of setting the environment variables in the [Azure classic portal][] for an Azure Website, see [Node.js Web Application with Storage][].

## Create a topic

The **ServiceBusService** object enables you to work with topics. The
following code creates a **ServiceBusService** object. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

```
var serviceBusService = azure.createServiceBusService();
```

By calling **createTopicIfNotExists** on the **ServiceBusService**
object, the specified topic will be returned (if it exists,) or a new
topic with the specified name will be created. The following code uses
**createTopicIfNotExists** to create or connect to the topic named
'MyTopic':

```
serviceBusService.createTopicIfNotExists('MyTopic',function(error){
    if(!error){
        // Topic was created or exists
        console.log('topic created or exists.');
    }
});
```

**createServiceBusService** also supports additional options, which
enable you to override default topic settings such as message time to
live or maximum topic size. The following example sets the maximum topic size to 5GB with a time to live of 1 minute:

```
var topicOptions = {
        MaxSizeInMegabytes: '5120',
        DefaultMessageTimeToLive: 'PT1M'
    };

serviceBusService.createTopicIfNotExists('MyTopic', topicOptions, function(error){
    if(!error){
        // topic was created or exists
    }
});
```

### Filters

Optional filtering operations can be applied to operations performed using **ServiceBusService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

```
function handle (requestOptions, next)
```

After performing preprocessing on the request options, the method calls `next` passing a callback with the following signature:

```
function (returnObject, finalCallback, next)
```

In this callback, and after processing the **returnObject** (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke **finalCallback** otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **ServiceBusService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var serviceBusService = azure.createServiceBusService().withFilter(retryOperations);

## Create subscriptions

Topic subscriptions are also created with the **ServiceBusService**
object. Subscriptions are named and can have an optional filter that
restricts the set of messages delivered to the subscription's virtual
queue.

> [AZURE.NOTE] Subscriptions are persistent and will continue to exist until
either they, or the topic they are associated with, are deleted. If your
application contains logic to create a subscription, it should first
check if the subscription already exists by using the
**getSubscription** method.

### Create a subscription with the default (MatchAll) filter

The **MatchAll** filter is the default filter that is used if no filter
is specified when a new subscription is created. When the **MatchAll**
filter is used, all messages published to the topic are placed in the
subscription's virtual queue. The following example creates a
subscription named 'AllMessages' and uses the default **MatchAll**
filter.

```
serviceBusService.createSubscription('MyTopic','AllMessages',function(error){
    if(!error){
        // subscription created
    }
});
```

### Create subscriptions with filters

You can also create filters that allow you to scope which messages sent
to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
**SqlFilter**, which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the [SqlFilter.SqlExpression][SqlFilter.SqlExpression] syntax.

Filters can be added to a subscription by using the **createRule**
method of the **ServiceBusService** object. This method allows you to
add new filters to an existing subscription.

> [AZURE.NOTE] Because the default filter is applied automatically to all new
subscriptions, you must first remove the default filter or the
**MatchAll** will override any other filters you may specify. You can
remove the default rule by using the **deleteRule** method of the
**ServiceBusService** object.

The following example creates a subscription named `HighMessages` with a
**SqlFilter** that only selects messages that have a custom **messagenumber** property greater than 3:

```
serviceBusService.createSubscription('MyTopic', 'HighMessages', function (error){
    if(!error){
        // subscription created
        rule.create();
    }
});
var rule={
    deleteDefault: function(){
        serviceBusService.deleteRule('MyTopic',
            'HighMessages', 
            azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
            rule.handleError);
    },
    create: function(){
        var ruleOptions = {
            sqlExpressionFilter: 'messagenumber > 3'
        };
        rule.deleteDefault();
        serviceBusService.createRule('MyTopic', 
            'HighMessages', 
            'HighMessageFilter', 
            ruleOptions, 
            rule.handleError);
    },
    handleError: function(error){
        if(error){
            console.log(error)
        }
    }
}
```

Similarly, the following example creates a subscription named
`LowMessages` with a **SqlFilter** that only selects messages that have
a **messagenumber** property less than or equal to 3:

```
serviceBusService.createSubscription('MyTopic', 'LowMessages', function (error){
    if(!error){
        // subscription created
        rule.create();
    }
});
var rule={
    deleteDefault: function(){
        serviceBusService.deleteRule('MyTopic',
            'LowMessages', 
            azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
            rule.handleError);
    },
    create: function(){
        var ruleOptions = {
            sqlExpressionFilter: 'messagenumber <= 3'
        };
        rule.deleteDefault();
        serviceBusService.createRule('MyTopic', 
            'LowMessages', 
            'LowMessageFilter', 
            ruleOptions, 
            rule.handleError);
    },
    handleError: function(error){
        if(error){
            console.log(error)
        }
    }
}
```

When a message is now sent to `MyTopic`, it will always be delivered to
receivers subscribed to the `AllMessages` topic subscription, and
selectively delivered to receivers subscribed to the `HighMessages` and
`LowMessages` topic subscriptions (depending upon the message content).

## How to send messages to a topic

To send a message to a Service Bus topic, your application must use the
**sendTopicMessage** method of the **ServiceBusService** object.
Messages sent to Service Bus topics are **BrokeredMessage** objects.
**BrokeredMessage** objects have a set of standard properties (such as
**Label** and **TimeToLive**), a dictionary that is used to hold custom
application specific properties, and a body of string data. An
application can set the body of the message by passing a string value to
the **sendTopicMessage** and any required standard properties will be
populated by default values.

The following example demonstrates how to send five test messages to
'MyTopic'. Note that the **messagenumber** property value of each
message varies on the iteration of the loop (this will determine which
subscriptions receive it):

```
var message = {
    body: '',
    customProperties: {
        messagenumber: 0
    }
}

for (i = 0;i < 5;i++) {
    message.customProperties.messagenumber=i;
    message.body='This is Message #'+i;
    serviceBusService.sendTopicMessage(topic, message, function(error) {
      if (error) {
        console.log(error);
      }
    });
}
```

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). The header, which includes the standard and custom application properties, can have
a maximum size of 64 KB. There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

## Receive messages from a subscription

Messages are received from a subscription using the
**receiveSubscriptionMessage** method on the **ServiceBusService**
object. By default, messages are deleted from the subscription as they
are read; however, you can read (peek) and lock the message without
deleting it from the subscription by setting the optional parameter
**isPeekLock** to **true**.

The default behavior of reading and deleting the message as part of the
receive operation is the simplest model, and works best for scenarios in
which an application can tolerate not processing a message in the event
of a failure. To understand this, consider a scenario in which the
consumer issues the receive request and then crashes before processing
it. Because Service Bus will have marked the message as being consumed,
then when the application restarts and begins consuming messages again,
it will have missed the message that was consumed prior to the crash.

If the **isPeekLock** parameter is set to **true**, the receive becomes
a two stage operation, which makes it possible to support applications
that cannot tolerate missing messages. When Service Bus receives a
request, it finds the next message to be consumed, locks it to prevent
other consumers receiving it, and then returns it to the application.
After the application finishes processing the message (or stores it
reliably for future processing), it completes the second stage of the
receive process by calling **deleteMessage** method and providing the
message to be deleted as a parameter. The **deleteMessage** method will
mark the message as being consumed and remove it from the subscription.

The following example demonstrates how messages can be received and
processed using **receiveSubscriptionMessage**. The example first
receives and deletes a message from the 'LowMessages' subscription, and
then receives a message from the 'HighMessages' subscription using
**isPeekLock** set to true. It then deletes the message using
**deleteMessage**:

    serviceBusService.receiveSubscriptionMessage('MyTopic', 'LowMessages', function(error, receivedMessage){
        if(!error){
            // Message received and deleted
            console.log(receivedMessage);
        }
    });
    serviceBusService.receiveSubscriptionMessage('MyTopic', 'HighMessages', { isPeekLock: true }, function(error, lockedMessage){
        if(!error){
            // Message received and locked
            console.log(lockedMessage);
            serviceBusService.deleteMessage(lockedMessage, function (deleteError){
                if(!deleteError){
                    // Message deleted
                    console.log('message has been deleted.');
                }
            }
        }
    });

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlockMessage** method on the
**ServiceBusService** object. This will cause Service Bus to unlock the
message within the subscription and make it available to be received
again, either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
subscription, and if the application fails to process the message before
the lock timeout expires (e.g., if the application crashes), then
Service Bus will unlock the message automatically and make it available
to be received again.

In the event that the application crashes after processing the message
but before the **deleteMessage** method is called, then the message will
be redelivered to the application when it restarts. This is often called
**At Least Once Processing**, that is, each message will be processed at
least once but in certain situations the same message may be
redelivered. If the scenario cannot tolerate duplicate processing, then
application developers should add additional logic to their application
to handle duplicate message delivery. This is often achieved using the
**MessageId** property of the message, which will remain constant across
delivery attempts.

## Delete topics and subscriptions

Topics and subscriptions are persistent, and must be explicitly deleted
either through the [Azure classic portal][] or programmatically.
The following example demonstrates how to delete the topic named `MyTopic`:

    serviceBusService.deleteTopic('MyTopic', function (error) {
        if (error) {
            console.log(error);
        }
    });

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following example shows how to delete a subscription named
`HighMessages` from the `MyTopic` topic:

    serviceBusService.deleteSubscription('MyTopic', 'HighMessages', function (error) {
        if(error) {
            console.log(error);
        }
    });

## Next Steps

Now that you've learned the basics of Service Bus topics, follow these links to learn more.

-   See [Queues, topics, and subscriptions][].
-   API reference for [SqlFilter][].
-   Visit the [Azure SDK for Node][] repository on GitHub.

  [Azure SDK for Node]: https://github.com/Azure/azure-sdk-for-node
  [Azure classic portal]: https://manage.windowsazure.com
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
  [SqlFilter]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Node.js Cloud Service]: ../cloud-services/cloud-services-nodejs-develop-deploy-app.md
  [Create and deploy a Node.js application to an Azure Web Site]: ../app-service-web/web-sites-nodejs-develop-deploy-mac.md
  [Node.js Cloud Service with Storage]: ../cloud-services/cloud-services-nodejs-develop-deploy-app.md
  [Node.js Web Application with Storage]: ../cloud-services/storage-nodejs-use-table-storage-cloud-service-app.md
 
