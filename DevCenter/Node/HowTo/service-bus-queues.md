<properties linkid="dev-nodejs-how-to-service-bus-queues" urlDisplayName="Service Bus Queues" pageTitle="How to use Service Bus queues (Node.js) - Windows Azure" metaKeywords="Azure Service Bus queues, Azure queues, Azure messaging, Azure queues Node.js" metaDescription="Learn how to use Service Bus queues in Windows Azure. Code samples written in Node.js." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# How to Use Service Bus Queues

This guide will show you how to use Service Bus queues. The samples are
written in JavaScript and use the Node.js Azure module. The scenarios
covered include **creating queues, sending and receiving messages**, and
**deleting queues**. For more information on queues, see the [Next
Steps] section.

## Table of Contents

-   [What are Service Bus Queues?][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Create a Node.js Application][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Queue][]
-   [How to: Send Messages to a Queue][]
-   [How to: Receive Messages from a Queue][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [Next Steps][]

<div chunk="../../shared/chunks/howto-service-bus-queues.md" />

## <a name="create-app"> </a>Create a Node.js Appication

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## <a name="configure-app"> </a>Configure Your Application to Use Service Bus

To use Windows Azure Service Bus, you need to download and use the
Node.js azure package. This includes a set of convenience libraries that
communicate with the Service Bus REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use the **Windows PowerShell for Node.js** command window to
    navigate to the **c:\\node\\sbqueues\\WebRole1** folder where you
    created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in output similiar to the following:

        azure@0.6.0 ./node_modules/azure
		├── easy-table@0.0.1
		├── dateformat@1.0.2-1.2.3
		├── xmlbuilder@0.3.1
		├── eyes@0.1.7
		├── colors@0.6.0-1
		├── mime@1.2.5
		├── log@1.3.0
		├── commander@0.6.1
		├── node-uuid@1.2.0
		├── xml2js@0.1.14
		├── async@0.1.22
		├── tunnel@0.0.1
		├── underscore@1.3.3
		├── qs@0.5.0
		├── underscore.string@2.2.0rc
		├── sax@0.4.0
		├── streamline@0.2.4
		└── winston@0.6.1 (cycle@1.0.0, stack-trace@0.0.6, pkginfo@0.2.3, request@2.9.202)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Service Bus queues.

### Import the module

Using Notepad or another text editor, add the following to the top of
the **server.js** file of the application:

    var azure = require('azure');

### Setup a Windows Azure Storage Connection

The azure module will read the environment variables AZURE\_SERVICEBUS\_NAMESPACE and AZURE\_SERVICEBUS\_ACCESS\_KEY for information required to connect to your Windows Azure Service Bus. If these environment variables are not set, you must specify the account information when calling **createServiceBusService**.

For an example of setting the environment variables in a configuration file for a Windows Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for a Windows Azure Web Site, see [Node.js Web Application with Storage]

## <a name="create-queue"> </a>How to Create a Queue

The **ServiceBusService** object lets you work with queues. The
following code creates a **ServiceBusService** object. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

    var serviceBusService = azure.createServiceBusService();

By calling **createQueueIfNotExists** on the **ServiceBusService**
object, the specified queue will be returned (if it exists,) or a new
queue with the specified name will be created. The following code uses
**createQueueIfNotExists** to create or connect to the queue named
‘myqueue’:

    serviceBusService.createQueueIfNotExists('myqueue', function(error){
        if(!error){
            // Queue exists
        }
    });

**createServiceBusService** also supports additional options, which
allow you to override default queue settings such as message time to
live or maximum queue size. The following example shows setting the
maximum queue size to 5GB a time to live of 1 minute:

    var queueOptions = {
          MaxSizeInMegabytes: '5120',
          DefaultMessageTimeToLive: 'PT1M'
        };

    serviceBusService.createQueueIfNotExists('myqueue', queueOptions, function(error){
        if(!error){
            // Queue exists
        }
    });

## <a name="send-messages"> </a>How to Send Messages to a Queue

To send a message to a Service Bus queue, your application will call the
**sendQueueMessage** method on the **ServiceBusService** object.
Messages sent to (and received from) Service Bus queues are
**BrokeredMessage** objects, and have a set of standard properties (such
as **Label** and **TimeToLive**), a dictionary that is used to hold
custom application specific properties, and a body of arbitrary
application data. An application can set the body of the message by
passing a string value as the message and any required standard
properties will be populated by default values.

The following example demonstrates how to send a test message to the
queue named ‘myqueue’ using **sendQueueMessage**:

    var message = {
        body: 'Test message',
        customProperties: {
            testproperty: 'TestValue'
        };
    serviceBusService.sendQueueMessage('myqueue', message, function(error){
        if(!error){
            // message sent
        }
    });

Service Bus queues support a maximum message size of 256 KB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 KB). There is no limit on the number of messages
held in a queue but there is a cap on the total size of the messages
held by a queue. This queue size is defined at creation time, with an
upper limit of 5 GB.

## <a name="receive-messages"> </a>How to Receive Messages from a Queue

Messages are received from a queue using the **receiveQueueMessage**
method on the **ServiceBusService** object. By default, messages are
deleted from the queue as they are read; however, you can read (peek)
and lock the message without deleting it from the queue by setting the
optional parameter **isPeekLock** to **true**.

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
mark the message as being consumed and remove it from the queue.

The example below demonstrates how messages can be received and
processed using **receiveQueueMessage**. The example first receives and
deletes a message, and then receives a message using **isPeekLock** set
to true, then deletes the message using **deleteMessage**:

    serviceBusService.receiveQueueMessage('taskqueue', function(error, receivedMessage){
        if(!error){
            // Message received and deleted
        }
    });
    serviceBusService.receiveQueueMessage(queueName, { isPeekLock: true }, function(error, lockedMessage){
        if(!error){
            // Message received and locked
            serviceBusService.deleteMessage(lockedMessage, function (deleteError){
                if(!deleteError){
                    // Message deleted
                }
            }
        }
    });

## <a name="handle-crashes"> </a>How to Handle Application Crashes and Unreadable Messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlockMessage** method on the
**ServiceBusService** object. This will cause Service Bus to unlock the
message within the queue and make it available to be received again,
either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
queue, and if the application fails to process the message before the
lock timeout expires (e.g., if the application crashes), then Service
Bus will unlock the message automatically and make it available to be
received again.

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

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of Service Bus queues, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions.][]
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #next-steps
  [What are Service Bus Queues?]: #what-are-service-bus-queues
  [Create a Service Namespace]: #create-a-service-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
  [Create a Node.js Application]: #create-app
  [Configure Your Application to Use Service Bus]: #configure-app
  [How to: Create a Queue]: #create-queue
  [How to: Send Messages to a Queue]: #send-messages
  [How to: Receive Messages from a Queue]: #receive-messages
  [How to: Handle Application Crashes and Unreadable Messages]: #handle-crashes
  [Queue Concepts]: ../../dotNet/Media/sb-queues-08.png
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [image]: ../../dotNet/Media/sb-queues-03.png
  [1]: ../../dotNet/Media/sb-queues-04.png
  [2]: ../../dotNet/Media/sb-queues-05.png
  [3]: ../../dotNet/Media/sb-queues-06.png
  [4]: ../../dotNet/Media/sb-queues-07.png
  [Node.js Cloud Service]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [Queues, Topics, and Subscriptions.]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
[Previous Management Portal]: ../../Shared/Media/previous-portal.png
  [Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/