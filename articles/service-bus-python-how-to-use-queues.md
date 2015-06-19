<properties 
	pageTitle="How to use Service Bus queues (Python) - Azure" 
	description="Learn how to use Azure Service Bus queues from Python." 
	services="service-bus" 
	documentationCenter="python" 
	authors="huguesv" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="python" 
	ms.topic="article" 
	ms.date="02/10/2015" 
	ms.author="huvalo"/>




# How to Use Service Bus Queues

This guide describes how to use Service Bus queues. The samples are
written in Python and use the [Python Azure package][]. The scenarios
covered include **creating queues, sending and receiving messages**, and
**deleting queues**. For more information on queues, see the [Next Steps][] section.

[AZURE.INCLUDE [howto-service-bus-queues](../includes/howto-service-bus-queues.md)]

**Note:** If you need to install Python or the [Python Azure package][], please see the [Python Installation Guide](python-how-to-install.md).


## How to create a queue

The **ServiceBusService** object lets you work with queues. Add the following near the top of any Python file in which you wish to programmatically access Azure Service Bus:

	from azure.servicebus import ServiceBusService, Message, Queue

The following code creates a **ServiceBusService** object. Replace 'mynamespace', 'sharedaccesskeyname' and 'sharedaccesskey' with the real namespace, shared access signature (SAS) key name and value.

	bus_service = ServiceBusService(
		service_namespace='mynamespace',
		shared_access_key_name='sharedaccesskeyname',
		shared_access_key_value='sharedaccesskey')

The values for the SAS key name and value can be found in the Azure Portal connection information, or in Visual Studio Properties window when selecting the service bus namespace in Server Explorer (as shown in the previous section).

	bus_service.create_queue('taskqueue')

**create_queue** also supports additional options, which
allow you to override default queue settings such as message time to
live or maximum queue size. The following example shows setting the
maximum queue size to 5GB a time to live of 1 minute:

	queue_options = Queue()
	queue_options.max_size_in_megabytes = '5120'
	queue_options.default_message_time_to_live = 'PT1M'

	bus_service.create_queue('taskqueue', queue_options)

## How to send messages to a queue

To send a message to a Service Bus queue, your application will call the
**send\_queue\_message** method on the **ServiceBusService** object.

The following example demonstrates how to send a test message to the
queue named *taskqueue using* **send\_queue\_message**:

	msg = Message(b'Test Message')
	bus_service.send_queue_message('taskqueue', msg)

Service Bus queues support a maximum message size of 256 KB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 KB). There is no limit on the number of messages
held in a queue but there is a cap on the total size of the messages
held by a queue. This queue size is defined at creation time, with an
upper limit of 5 GB.

## How to receive messages from a queue

Messages are received from a queue using the **receive\_queue\_message**
method on the **ServiceBusService** object:

	msg = bus_service.receive_queue_message('taskqueue', peek_lock=False)
	print(msg.body)

Messages are deleted from the queue as they are read when the parameter
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
receive process by calling the **delete** method on the **Message**
object. The **delete** method will mark the message as being consumed
and remove it from the queue.

	msg = bus_service.receive_queue_message('taskqueue', peek_lock=True)
	print(msg.body)

	msg.delete()

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **unlock** method on the
**Message** object. This will cause Service Bus to unlock the
message within the queue and make it available to be received again,
either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
queue, and if the application fails to process the message before the
lock timeout expires (e.g., if the application crashes), then Service
Bus will unlock the message automatically and make it available to be
received again.

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

## Next Steps

Now that you have learned the basics of Service Bus queues, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].

[Azure Management Portal]: http://manage.windowsazure.com
[Python Azure package]: https://pypi.python.org/pypi/azure  
[Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/library/windowsazure/hh367516.aspx
