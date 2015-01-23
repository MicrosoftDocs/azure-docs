<properties pageTitle="How to use Service Bus topics (Python) - Azure" description="Learn how to use Service Bus topics and subscriptions in Azure. Code samples are written for Python applications." services="service-bus" documentationCenter="python" authors="huguesv" manager="wpickett" editor=""/>

<tags ms.service="service-bus" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="python" ms.topic="article" ms.date="09/19/2014" ms.author="huvalo"/>





# How to Use Service Bus Topics/Subscriptions
This guide will show you how to use Service Bus topics and subscriptions
from Python applications. The scenarios covered include **creating
topics and subscriptions, creating subscription filters, sending
messages** to a topic, **receiving messages from a subscription**, and
**deleting topics and subscriptions**. For more information on topics
and subscriptions, see the [Next Steps](#Next_Steps) section.

## Table of Contents

-   [What are Service Bus Topics and Subscriptions?](#what-are-service-bus-topics)
-   [Create a Service Namespace](#create-a-service-namespace)
-   [Obtain the Default Management Credentials for the Namespace](#obtain-default-credentials)
-   [How to: Create a Topic](#How_to_Create_a_Topic)
-   [How to: Create Subscriptions](#How_to_Create_Subscriptions)
-   [How to: Send Messages to a Topic](#How_to_Send_Messages_to_a_Topic)
-   [How to: Receive Messages from a Subscription](#How_to_Receive_Messages_from_a_Subscription)
-   [How to: Handle Application Crashes and Unreadable Messages](#How_to_Handle_Application_Crashes_and_Unreadable_Messages)
-   [How to: Delete Topics and Subscriptions](#How_to_Delete_Topics_and_Subscriptions)
-   [Next Steps](#Next_Steps)


[WACOM.INCLUDE [howto-service-bus-topics](../includes/howto-service-bus-topics.md)]

**Note:** If you need to install Python or the Client Libraries, please see the [Python Installation Guide](../python-how-to-install/).


##<a name="How_to_Create_a_Topic"></a>How to Create a Topic

The **ServiceBusService** object lets you work with topics. Add the following near the top of any Python file in which you wish to programmatically access Azure Service Bus:

	from azure.servicebus import ServiceBusService, Message, Topic, Rule, DEFAULT_RULE_NAME

The following code creates a **ServiceBusService** object. Replace 'mynamespace', 'sharedaccesskeyname' and 'sharedaccesskey' with the real namespace, shared access signature (SAS) key name and value.

	bus_service = ServiceBusService(
		service_namespace='mynamespace',
		shared_access_key_name='sharedaccesskeyname',
		shared_access_key_value='sharedaccesskey')

The values for the SAS key name and value can be found in the Azure Portal connection information, or in Visual Studio Properties window when selecting the service bus namespace in Server Explorer (as shown in the previous section).

	bus_service.create_topic('mytopic')

**create\_topic** also supports additional options, which
allow you to override default topic settings such as message time to
live or maximum topic size. The following example shows demonstrates
setting the maximum topic size to 5GB a time to live of 1 minute:

	topic_options = Topic()
	topic_options.max_size_in_megabytes = '5120'
	topic_options.default_message_time_to_live = 'PT1M'

	bus_service.create_topic('mytopic', topic_options)

##<a name="How_to_Create_Subscriptions"></a>How to Create Subscriptions

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
	bus_service.delete_rule('mytopic', 'HighMessages', DEFAULT_RULE_NAME)

Similarly, the following example creates a subscription named
'LowMessages' with a **SqlFilter** that only selects messages that have
a **messagenumber** property less than or equal to 3:

	bus_service.create_subscription('mytopic', 'LowMessages')

	rule = Rule()
	rule.filter_type = 'SqlFilter'
	rule.filter_expression = 'messagenumber <= 3'

	bus_service.create_rule('mytopic', 'LowMessages', 'LowMessageFilter', rule)
	bus_service.delete_rule('mytopic', 'LowMessages', DEFAULT_RULE_NAME)

When a message is now sent to 'mytopic', it will always be delivered to
receivers subscribed to the 'AllMessages' topic subscription, and
selectively delivered to receivers subscribed to the 'HighMessages' and
'LowMessages' topic subscriptions (depending upon the message content).

##<a name="How_to_Send_Messages_to_a_Topic"></a>How to Send Messages to a Topic

To send a message to a Service Bus topic, your application must use the
**send\_topic\_message** method of the **ServiceBusService** object.

The following example demonstrates how to send five test messages to
'mytopic'. Note that the **messagenumber** property value of each
message varies on the iteration of the loop (this will determine which
subscriptions receive it):

	for i in range(5):
		msg = Message('Msg {0}'.format(i).encode('utf-8'), custom_properties={'messagenumber':i})
		bus_service.send_topic_message('mytopic', msg)

Service Bus topics support a maximum message size of 256 MB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 MB). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This topic size is defined at creation time, with an
upper limit of 5 GB.

##<a name="How_to_Receive_Messages_from_a_Subscription"></a>How to Receive Messages from a Subscription

Messages are received from a subscription using the
**receive\_subscription\_message** method on the **ServiceBusService**
object:

	msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=False)
	print(msg.body)

Messages are deleted from the subscription as they are read when the parameter
**peek\_lock** is set to **False**. You can read (peek) and lock the
message without deleting it from the queue by setting the parameter
**peek\_lock** to **True**.

The behavior of reading and deleting the message as part of the
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
receive process by calling **delete** method on the **Message** object.
The **delete** method will mark the message as being consumed and remove
it from the subscription.

	msg = bus_service.receive_subscription_message('mytopic', 'LowMessages', peek_lock=True)
	print(msg.body)

	msg.delete()


  ##<a name="How_to_Handle_Application_Crashes_and_Unreadable_Messages"></a>How to Handle Application Crashes and Unreadable Messages

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

##<a name="How_to_Delete_Topics_and_Subscriptions"></a>How to Delete Topics and Subscriptions

Topics and subscriptions are persistent, and must be explicitly deleted
either through the Azure Management portal or programmatically.
The example below demonstrates how to delete the topic named 'mytopic':

	bus_service.delete_topic('mytopic')

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following code demonstrates how to delete a subscription named
'HighMessages' from the 'mytopic' topic:

	bus_service.delete_subscription('mytopic', 'HighMessages')

##<a name="Next_Steps"></a>Next Steps

Now that you've learned the basics of Service Bus topics, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].

  [Next Steps]: #nextsteps
  [What are Service Bus Topics and Subscriptions?]: #what-are-service-bus-topics
  [Create a Service Namespace]: #create-a-service-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-default-credentials
  [How to: Create a Topic]: #How_to_Create_a_Topic
  [How to: Create Subscriptions]: #How_to_Create_Subscriptions
  [How to: Send Messages to a Topic]: #How_to_Send_Messages_to_a_Topic
  [How to: Receive Messages from a Subscription]: #How_to_Receive_Messages_from_a_Subscription
  [How to: Handle Application Crashes and Unreadable Messages]: #How_to_Handle_Application_Crashes_and_Unreadable_Messages
  [How to: Delete Topics and Subscriptions]: #How_to_Delete_Topics_and_Subscriptions
  
  [Topic Concepts]: ../../../DevCenter/dotNet/Media/sb-topics-01.png
  [Azure Management Portal]: http://manage.windowsazure.com
  
  
  
  
  
  
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
