<properties umbraconavihide="0" pagetitle="Service Bus Topics - How To - Node.js - Develop" metakeywords="Service Bus topics Node.js, getting started service bus topics node.js, getting started service bus subscriptions node.j" metadescription="" linkid="dev-nodejs-how-to-service-bus-topics" urldisplayname="Service Bus Topics" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to Use Service Bus Topics/Subscriptions

This guide will show you how to use Service Bus topics and subscriptions
from Node.js applications. The scenarios covered include **creating
topics and subscriptions, creating subscription filters, sending
messages** to a topic, **receiving messages from a subscription**, and
**deleting topics and subscriptions**. For more information on topics
and subscriptions, see the [Next Steps][] section.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Create a Node.js Application][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Topic][]
-   [How to: Create Subscriptions][]
-   [How to: Send Messages to a Topic][]
-   [How to: Receive Messages from a Subscription][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [How to: Delete Topics and Subscriptions][]
-   [Next Steps][1]

## What are Service Bus Topics and Subscriptions

Service Bus topics and subscriptions support a **publish/subscribe
messaging communication** model. When using topics and subscriptions,
components of a distributed application do not communicate directly with
each other, they instead exchange messages via a topic, which acts as an
intermediary.

![Topic Concepts][]

In contrast to Service Bus queues, where each message is processed by a
single consumer, topics and subscriptions provide a **one-to-many** form
of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a
topic, it is then made available to each subscription to handle/process
independently.

A topic subscription resembles a virtual queue that receives copies of
the messages that were sent to the topic. You can optionally register
filter rules for a topic on a per-subscription basis, which allows you
to filter/restrict which messages to a topic are received by which topic
subscriptions.

Service Bus topics and subscriptions enable you to scale to process a
very large number of messages across a very large number of users and
applications.

## Create a Service Namespace

To begin using Service Bus topics and subscriptions in Windows Azure,
you must first create a service namespace. A service namespace provides
a scoping container for addressing Service Bus resources within your
application.

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

    ![image][2]

5.  After making sure the **Namespace** name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same **Country/Region** in which you are deploying
    your compute resources), and then click the **Create Namespace**
    button.

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
moving on.

## Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a topic or
subscription, on the new namespace, you need to obtain the management
credentials for the namespace.

1.  In the left navigation pane, click the **Service Bus** node to
    display the list of available namespaces:

    ![image][]

2.  Select the namespace you just created from the list shown:

    ![image][3]

3.  The right-hand **Properties** pane will list the properties for the
    new namespace:

    ![image][4]

4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:

    ![image][5]

5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

## Create a Node.js Application

Create a blank Node.js application. For
instructions on how to use the PowerShell commands to create a blank
application, see the [Node.js Cloud Service]. For instructions on how to use WebMatrix, see [Web Site with WebMatrix].

## Configure Your Application to Use Service Bus

To use Windows Azure Service Bus, you need to download and use the
Node.js azure package. This includes a set of convenience libraries that
communicate with the Service Bus REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.5.2 ./node_modules/azure
        ├── dateformat@1.0.2-1.2.3
        ├── xmlbuilder@0.3.1
        ├── mime@1.2.5
        ├── xml2js@0.1.13
        ├── log@1.3.0
        ├── qs@0.4.2
        └── sax@0.3.5

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder find the
    **azure** package, which contains the libraries you need to access
    Service Bus topics.

### Import the module

Using Notepad or another text editor, add the following to the top of
the **server.js** file of the application:

    var azure = require('azure');

### Setup a Windows Azure Service Bus Connection

You must use the namespace and default key values to connect to the
Service Bus topic. These values can be specified programmatically within
your application, or read from the following environment variables at
runtime:

-   AZURE\_SERVICEBUS\_NAMESPACE
-   AZURE\_SERVICEBUS\_ACCESS\_KEY

You can also store these values in the configuration files created by
the **Windows Azure PowerShell** commands. In this how-to,
you use the **Web.Cloud.Config** and **Web.Config** files, which are
created when you add a Web role to a Windows Azure Cloud Service project:

1.  Use a text editor to open the
    **Web.cloud.config**

2.  Add the following inside the **configuration** element

        <appSettings>
        <add key="AZURE_SERVICEBUS_NAMESPACE" value="your Service Bus namespace"/>
        <add key="AZURE_SERVICEBUS_ACCESS_KEY" value="your default key"/>
        </appSettings>

You are now ready to write code against Service Bus.

## How to Create a Topic

The **ServiceBusService** object lets you work with topics. The
following code creates a **ServiceBusService** object. Add it near the
top of the **server.js** file, after the statement to import the azure
module:

    var serviceBusService = azure.createServiceBusService();

By calling **createTopicIfNotExists** on the **ServiceBusService**
object, the specified topic will be returned (if it exists,) or a new
topic with the specified name will be created. The following code uses
**createTopicIfNotExists** to create or connect to the topic named
'MyTopic':

    serviceBusService.createTopicIfNotExists('MyTopic',function(error){
        if(!error){
            // Topic was created or exists
            console.log('topic created or exists.');
        }
    });

**createServiceBusService** also supports additional options, which
allow you to override default topic settings such as message time to
live or maximum topic size. The following example shows demonstrates
setting the maximum topic size to 5GB a time to live of 1 minute:

    var topicOptions = {
            MaxSizeInMegabytes: '5120',
            DefaultMessageTimeToLive: 'PT1M'
        };

    serviceBusService.createTopicIfNotExists('MyTopic', topicOptions, function(error){
        if(!error){
            // topic was created or exists
        }
    });

## How to Create Subscriptions

Topic subscriptions are also created with the **ServiceBusService**
object. Subscriptions are named and can have an optional filter that
restricts the set of messages delivered to the subscription's virtual
queue.

**Note**: Subscriptions are persistent and will continue to exist until
either they, or the topic they are associated with, are deleted. If your
application contains logic to create a subscription, it should first
check if the subscription already exists by using the
**getSubscription** method.

### Create a Subscription with the default (MatchAll) Filter

The **MatchAll** filter is the default filter that is used if no filter
is specified when a new subscription is created. When the **MatchAll**
filter is used, all messages published to the topic are placed in the
subscription's virtual queue. The following example creates a
subscription named 'AllMessages' and uses the default **MatchAll**
filter.

    serviceBusService.createSubscription('MyTopic','AllMessages',function(error){
        if(!error){
            // subscription created
        }
    });

### Create Subscriptions with Filters

You can also setup filters that allow you to scope which messages sent
to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
**SqlFilter**, which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the [SqlFilter.SqlExpression][] syntax.

Filters can be added to a subscription by using the **createRule**
method of the **ServiceBusService** object. This method allows you to
add new filters to an existing subscription.

**Note**: Since the default filter is applied automatically to all new
subscriptions, you must first remove the default filter or the
**MatchAll** will override any other filters you may specify. You can
remove the default rule by using the **deleteRule** method of the
**ServiceBusService** object.

The example below creates a subscription named 'HighMessages' with a
**SqlFilter** that only selects messages that have a custom
**messagenumber** property greater than 3:

    serviceBusService.createSubscription('MyTopic', 'HighMessages', function (error){
        if(!error){
            // subscription created
            rule.create();
        }
    });
    var rule={
        deleteDefault: function(){
            serviceBusClient.deleteRule('MyTopic',
                'HighMessages', 
                azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
                rule.handleError);
        },
        create: function(){
            var ruleOptions = {
                sqlExpressionFilter: 'messagenumber > 3'
            };
            rule.deleteDefault();
            serviceBusClient.createRule('MyTopic', 
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

Similarly, the following example creates a subscription named
'LowMessages' with a **SqlFilter** that only selects messages that have
a **messagenumber** property less than or equal to 3:

    serviceBusService.createSubscription('MyTopic', 'LowMessages', function (error){
        if(!error){
            // subscription created
            rule.create();
        }
    });
    var rule={
        deleteDefault: function(){
            serviceBusClient.deleteRule('MyTopic',
                'LowMessages', 
                azure.Constants.ServiceBusConstants.DEFAULT_RULE_NAME, 
                rule.handleError);
        },
        create: function(){
            var ruleOptions = {
                sqlExpressionFilter: 'messagenumber <= 3'
            };
            rule.deleteDefault();
            serviceBusClient.createRule('MyTopic', 
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

When a message is now sent to 'MyTopic', it will always be delivered to
receivers subscribed to the 'AllMessages' topic subscription, and
selectively delivered to receivers subscribed to the 'HighMessages' and
'LowMessages' topic subscriptions (depending upon the message content).

## How to Send Messages to a Topic

To send a message to a Service Bus topic, your application must use the
**sendTopicMessage** method of the **ServiceBusService** object.
Messages sent to Service Bus Topics are **BrokeredMessage** objects.
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

    var message = {
        body: '',
        customProperties: {
            messagenumber: 0
        }
    }

    for (i = 0;i < 5;i++) {
        message.customProperties.messagenumber=i;
        message.body='This is Message #'+i;
        serviceBusClient.sendTopicMessage(topic, message, function(error) {
          if (error) {
            console.log(error);
          }
        });
    }

Service Bus topics support a maximum message size of 256 MB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 MB). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

## How to Receive Messages from a Subscription

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

The example below demonstrates how messages can be received and
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

## How to Handle Application Crashes and Unreadable Messages

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

## How to Delete Topics and Subscriptions

Topics and subscriptions are persistent, and must be explicitly deleted
either through the Windows Azure Management portal or programmatically.
The example below demonstrates how to delete the topic named 'MyTopic':

    serviceBusService.deleteTopic('MyTopic', function (error) {
        if (error) {
            console.log(error);
        }
    });

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following code demonstrates how to delete a subscription named
'HighMessages' from the 'MyTopic' topic:

    serviceBusService.deleteSubscription('MyTopic', 'HighMessages', function (error) {
        if(error) {
            console.log(error);
        }
    });

## Next Steps

Now that you've learned the basics of Service Bus topics, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].

  [Next Steps]: #nextsteps
  [What are Service Bus Topics and Subscriptions]: #What_are_Service_Bus_Topics_and_Subscriptions
  [Create a Service Namespace]: #Create_a_Service_Namespace
  [Obtain the Default Management Credentials for the Namespace]: #Obtain_the_Default_Management_Credentials_for_the_Namespace
  [Create a Node.js Application]: #Create_a_Nodejs_Application
  [Configure Your Application to Use Service Bus]: #Configure_Your_Application_to_Use_Service_Bus
  [How to: Create a Topic]: #How_to_Create_a_Topic
  [How to: Create Subscriptions]: #How_to_Create_Subscriptions
  [How to: Send Messages to a Topic]: #How_to_Send_Messages_to_a_Topic
  [How to: Receive Messages from a Subscription]: #How_to_Receive_Messages_from_a_Subscription
  [How to: Handle Application Crashes and Unreadable Messages]: #How_to_Handle_Application_Crashes_and_Unreadable_Messages
  [How to: Delete Topics and Subscriptions]: #How_to_Delete_Topics_and_Subscriptions
  [1]: #Next_Steps
  [Topic Concepts]: ../../dotNet/Media/sb-topics-01.png
  [Windows Azure Management Portal]: http://windows.azure.com
  [image]: ../../dotNet/Media/sb-queues-03.png
  [2]: ../../dotNet/Media/sb-queues-04.png
  [3]: ../../dotNet/Media/sb-queues-05.png
  [4]: ../../dotNet/Media/sb-queues-06.png
  [5]: ../../dotNet/Media/sb-queues-07.png
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/website-with-webmatrix/
  [Node.js Cloud Service]: {localLink:2221} "Node.js Web Application"