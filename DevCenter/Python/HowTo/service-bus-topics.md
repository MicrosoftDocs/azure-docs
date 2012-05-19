# How to Use Service Bus Topics/Subscriptions

This guide will show you how to use Service Bus topics and subscriptions
from Python applications. The scenarios covered include **creating
topics and subscriptions, creating subscription filters, sending
messages** to a topic, **receiving messages from a subscription**, and
**deleting topics and subscriptions**. For more information on topics
and subscriptions, see the [Next Steps][] section.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
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

## How to Create a Topic

The **ServiceBusService** object lets you work with topics. Add the following near the top of any Python file in which you wish to programmatically access Windows Azure Service Bus:

	from windowsazure.servicebus import *

The following code creates a **ServiceBusService** object. Replace 'mynamespace', 'mykey' and 'myissuer' with the real namespace, key and issuer.

	bus_service = ServiceBusService(service_namespace='mynamespace', account_key='mykey', issuer='myissuer')

	bus_service.create_topic('mytopic')

**create\_topic** also supports additional options, which
allow you to override default topic settings such as message time to
live or maximum topic size. The following example shows demonstrates
setting the maximum topic size to 5GB a time to live of 1 minute:

	topic_options = Topic()
	topic_options.max_size_in_megabytes = '5120'
	topic_options.default_message_time_to_live = 'PT1M'

	bus_service.create_topic('mytopic', topic_options)

## How to Create Subscriptions

Topic subscriptions are also created with the **ServiceBusService**
object. Subscriptions are named and can have an optional filter that
restricts the set of messages delivered to the subscription's virtual
queue.

**Note**: Subscriptions are persistent and will continue to exist until
either they, or the topic they are associated with, are deleted.

### Create a Subscription with the default (MatchAll) Filter

The **MatchAll** filter is the default filter that is used if no filter
is specified when a new subscription is created. When the **MatchAll**
filter is used, all messages published to the topic are placed in the
subscription's virtual queue. The following example creates a
subscription named 'AllMessages' and uses the default **MatchAll**
filter.

    bus_service.create_subscription('mytopic', 'AllMessages')

### Create Subscriptions with Filters

You can also setup filters that allow you to scope which messages sent
to a topic should show up within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
**SqlFilter**, which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the [SqlFilter.SqlExpression][] syntax.

Filters can be added to a subscription by using the **create\_rule**
method of the **ServiceBusService** object. This method allows you to
add new filters to an existing subscription.

**Note**: Since the default filter is applied automatically to all new
subscriptions, you must first remove the default filter or the
**MatchAll** will override any other filters you may specify. You can
remove the default rule by using the **delete\_rule** method of the
**ServiceBusService** object.

The example below creates a subscription named 'HighMessages' with a
**SqlFilter** that only selects messages that have a custom
**messagenumber** property greater than 3:

    bus_service.create_subscription('mytopic', 'HighMessages')

	rule = Rule()
	rule.filter_type = 'SqlFilter'
	rule.filter_expression = 'messagenumber > 3'

	bus_service.create_rule('mytopic', 'HighMessages', 'HighMessageFilter', rule)
	bus_service.delete_rule('mytopic', 'HighMessages', servicebus.DEFAULT_RULE_NAME)

Similarly, the following example creates a subscription named
'LowMessages' with a **SqlFilter** that only selects messages that have
a **messagenumber** property less than or equal to 3:

    bus_service.create_subscription('mytopic', 'LowMessages')

	rule = Rule()
	rule.filter_type = 'SqlFilter'
	rule.filter_expression = 'messagenumber <= 3'

	bus_service.create_rule('mytopic', 'LowMessages', 'LowMessageFilter', rule)
	bus_service.delete_rule('mytopic', 'LowMessages', servicebus.DEFAULT_RULE_NAME)

When a message is now sent to 'mytopic', it will always be delivered to
receivers subscribed to the 'AllMessages' topic subscription, and
selectively delivered to receivers subscribed to the 'HighMessages' and
'LowMessages' topic subscriptions (depending upon the message content).

## How to Send Messages to a Topic

To send a message to a Service Bus topic, your application must use the
**send\_topic\_message** method of the **ServiceBusService** object.

The following example demonstrates how to send five test messages to
'mytopic'. Note that the **messagenumber** property value of each
message varies on the iteration of the loop (this will determine which
subscriptions receive it):

	for i in range(5):
		msg = Message('Msg ' + str(i), custom_properties={'messagenumber':i})
		bus_service.send_topic_message('mytopic', msg)

Service Bus topics support a maximum message size of 256 MB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 MB). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

## How to Receive Messages from a Subscription

Messages are received from a subscription using the
**receive\_subscription\_message** method on the **ServiceBusService**
object:

	msg = bus_service.receive_subscription_message('mytopic', 'LowMessages')
	print(msg.body)

Messages are deleted from the subscription as they
are read; however, you can read (peek) and lock the message without
deleting it from the subscription by setting the
optional parameter **peek\_lock** to **True**.

The default behavior of reading and deleting the message as part of the
receive operation is the simplest model, and works best for scenarios in
which an application can tolerate not processing a message in the event
of a failure. To understand this, consider a scenario in which the
consumer issues the receive request and then crashes before processing
it. Because Service Bus will have marked the message as being consumed,
then when the application restarts and begins consuming messages again,
it will have missed the message that was consumed prior to the crash.

	
If the **peek\_lock** parameter is set to **True**, the receive becomes
a two stage operation, which makes it possible to support applications
that cannot tolerate missing messages. When Service Bus receives a
request, it finds the next message to be consumed, locks it to prevent
other consumers receiving it, and then returns it to the application.
After the application finishes processing the message (or stores it
reliably for future processing), it completes the second stage of the
receive process by calling **delete** method on the **Message** object. The **delete** method will
mark the message as being consumed and remove it from the subscription.

	msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=True)
	print(msg.body)
	
	msg.delete()
	

## How to Handle Application Crashes and Unreadable Messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlock** method on the
**Message** object. This will cause Service Bus to unlock the
message within the subscription and make it available to be received
again, either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
subscription, and if the application fails to process the message before
the lock timeout expires (e.g., if the application crashes), then
Service Bus will unlock the message automatically and make it available
to be received again.

In the event that the application crashes after processing the message
but before the **delete** method is called, then the message will
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
The example below demonstrates how to delete the topic named 'mytopic':

	bus_service.delete_topic('mytopic')

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following code demonstrates how to delete a subscription named
'HighMessages' from the 'mytopic' topic:

    bus_service.delete_subscription('mytopic', 'HighMessages')

## Next Steps

Now that you've learned the basics of Service Bus topics, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].

  [Next Steps]: #nextsteps
  [What are Service Bus Topics and Subscriptions]: #What_are_Service_Bus_Topics_and_Subscriptions
  [Create a Service Namespace]: #Create_a_Service_Namespace
  [Obtain the Default Management Credentials for the Namespace]: #Obtain_the_Default_Management_Credentials_for_the_Namespace
  [How to: Create a Topic]: #How_to_Create_a_Topic
  [How to: Create Subscriptions]: #How_to_Create_Subscriptions
  [How to: Send Messages to a Topic]: #How_to_Send_Messages_to_a_Topic
  [How to: Receive Messages from a Subscription]: #How_to_Receive_Messages_from_a_Subscription
  [How to: Handle Application Crashes and Unreadable Messages]: #How_to_Handle_Application_Crashes_and_Unreadable_Messages
  [How to: Delete Topics and Subscriptions]: #How_to_Delete_Topics_and_Subscriptions
  [1]: #Next_Steps
  [Topic Concepts]: ../../../DevCenter/dotNet/Media/sb-topics-01.png
  [Windows Azure Management Portal]: http://windows.azure.com
  [image]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [4]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [5]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
