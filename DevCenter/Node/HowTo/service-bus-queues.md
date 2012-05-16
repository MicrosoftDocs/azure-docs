<properties linkid="dev-nodejs-how-to-service-bus-queues" urldisplayname="Service Bus Queues" headerexpose="" pagetitle="Service Bus Queues - How To - Node.js - Develop" metakeywords="Azure messaging, Azure brokered messaging, Azure messaging queue, Service Bus queue, Azure Service Bus queue, Azure messaging Node.js, Azure messaging queue Node.js, Azure Service Bus queue Node.js, Service Bus queue Node.js" footerexpose="" metadescription="Learn about Windows Azure Service Bus queues, including how to create queues, how to send and receive messages, and how to delete queues." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Service Bus Queues

This guide will show you how to use Service Bus queues. The samples are
written in JavaScript and use the Node.js Azure module. The scenarios
covered include **creating queues, sending and receiving messages**, and
**deleting queues**. For more information on queues, see the [Next
Steps][] section.

## Table of Contents

-   [What are Service Bus Queues][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Create a Node.js Application][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Queue][]
-   [How to: Send Messages to a Queue][]
-   [How to: Receive Messages from a Queue][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [Next Steps][]

## <a name="what-queues"> </a>What are Service Bus Queues

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

![Queue Concepts][]

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

## <a name="create-namespace"> </a>Create a Service Namespace

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].

2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.

3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, and then click the **New** button.

    ![image][]

4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.

    ![image][1]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources), and then click the **Create Namespace** button.

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
moving on.

## <a name="obtain-creds"> </a>Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:

    ![image][]

2.  Select the namespace you just created from the list shown:

    ![image][2]

3.  The right-hand **Properties** pane will list the properties for the
    new namespace:

    ![image][3]

4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:

    ![image][4]

5.  Make a note of the **Default Key** as you will use this information
    below to perform operations with the namespace.

## <a name="create-app"> </a>Create a Node.js Appication

Create a new application using the **Windows PowerShell for Node.js**
command window at the location c:\\node\\sbqueues\\WebRole1. For
instructions on how to use the PowerShell commands to create a blank
application, see [Node.js Web Application][].

**Note**: Several steps in this article are performed using the tools
provided by the **Windows Azure SDK for Node.js**, however the
information provided should generally be applicable to applications
created using other tools. The previous step simply creates a basic
server.js file at c:\\node\\sbqueues\\WebRole1.

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

        azure@0.5.0 ./node_modules/azure
        ├── xmlbuilder@0.3.1
        ├── mime@1.2.4
        ├── xml2js@0.1.12
        ├── qs@0.4.0
        ├── log@1.2.0
        └── sax@0.3.4

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Service Bus queues.

### Import the module

Using Notepad or another text editor, add the following to the top of
the **server.js** file of the application:

    var azure = require('azure');

### Setup a Windows Azure Storage Connection

You must use the namespace and default key values to connect to the
Service Bus queue. These values can be specified programatically within
your application, or read from the following environment variables at
runtime:

-   AZURE\_SERVICEBUS\_NAMESPACE
-   AZURE\_SERVICEBUS\_ACCESS\_KEY

You can also store these values in the configuration files created by
the **Windows Azure PowerShell for Node.js** commands. In this how-to,
you use the **Web.Cloud.Config** and **Web.Config** files, which are
created when you create a Windows Azure Web role:

1.  Use a text editor to open
    **c:\\node\\sbqueues\\WebRole1\\Web.cloud.config**

2.  Add the following inside the **configuration** element

        <appSettings>
          <add key="AZURE_SERVICEBUS_NAMESPACE" value="your Service Bus namespace"/>
          <add key="AZURE_SERVICEBUS_ACCESS_KEY" value="your default key"/>
        </appSettings>

You are now ready to write code against Service Bus.

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

    var serviceBusService = azure.createServiceBusService();
    serviceBusService.createQueueIfNotExists('myqueue', function(error){
        if(!error){
            // Queue exists
        }
    });

**createServiceBusService** also supports additional options, which
allow you to override default queue settings such as message time to
live or maximum queue size. The following example shows setting the
maximum queue size to 5GB a time to live of 1 minute:

    var serviceBusService = azure.createServiceBusService();
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

  [Next Steps]: #next-steps
  [What are Service Bus Queues]: #what-queues
  [Create a Service Namespace]: #create-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-creds
  [Create a Node.js Application]: #create-app
  [Configure Your Application to Use Service Bus]: #configure-app
  [How to: Create a Queue]: #create-queue
  [How to: Send Messages to a Queue]: #send-messages
  [How to: Receive Messages from a Queue]: #receive-messages
  [How to: Handle Application Crashes and Unreadable Messages]: #handle-crashes
  [Queue Concepts]: ../../../DevCenter/dotNet/Media/sb-queues-08.png
  [Windows Azure Management Portal]: http://windows.azure.com
  [image]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [1]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [4]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
  [Node.js Web Application]: http://www.windowsazure.com/en-us/develop/nodejs/tutorials/getting-started/
  [Queues, Topics, and Subscriptions.]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
