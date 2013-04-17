<properties linkid="dev-ruby-how-to-service-bus-queues" urlDisplayName="Service Bus Queues" pageTitle="How to use Service Bus queues (Ruby) - Windows Azure" metaKeywords="Azure Service Bus queues, Azure queues, Azure messaging, Azure queues Ruby" metaDescription="Learn how to use Service Bus queues in Windows Azure. Code samples written in Ruby." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="guayan" />

<div chunk="../chunks/article-left-menu.md" />

# How to Use Service Bus Queues

This guide will show you how to use Service Bus queues. The samples are
written in Ruby and use the Azure gem. The scenarios
covered include **creating queues, sending and receiving messages**, and
**deleting queues**. For more information on queues, see the [Next Steps](#next-steps) section.

## Table of Contents

* [What are Service Bus Queues?](#what-are-service-bus-queues)
* [Create a Service Namespace](#create-a-service-namespace)
* [Obtain the Default Management Credentials for the Namespace](#obtain-the-default-management-credentials-for-the-namespace)
* [Create a Ruby Application](#create-a-ruby-application)
* [Configure Your Application to Use Service Bus](#configure-your-application-to-use-service-bus)
* [Setup a Windows Azure Service Bus Connection](#setup-a-windows-azure-service-bus-connection)
* [How to Create a Queue](#how-to-create-a-queue)
* [How to Send Messages to a Queue](#how-to-send-messages-to-a-queue)
* [How to Receive Messages from a Queue](#how-to-receive-messages-from-a-queue)
* [How to Handle Application Crashes and Unreadable Messages](#how-to-handle-application-crashes-and-unreadable-messages)
* [Next Steps](#next-steps)

<div chunk="../../shared/chunks/howto-service-bus-queues.md" />

## <a id="create-a-ruby-application"></a>Create a Ruby Application

Create a Ruby application. For instructions, see [Create a Ruby Application on Windows Azure](/en-us/develop/ruby/tutorials/web-app-with-linux-vm/).

## <a id="configure-your-application-to-use-service-bus"></a>Configure Your Application to Use Service Bus

To use Windows Azure service bus, you need to download and use the Ruby azure package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).

2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

    require "azure"

## <a id="setup-a-windows-azure-service-bus-connection"></a>Setup a Windows Azure Service Bus Connection

The azure module will read the environment variables **AZURE\_SERVICEBUS\_NAMESPACE** and **AZURE\_SERVICEBUS\_ACCESS_KEY** 
for information required to connect to your Windows Azure service bus namespace. If these environment variables are not set, you must specify the namespace information before using **Azure::ServiceBusService** with the following code:

    Azure.config.sb_namespace = "<your azure service bus namespace>"
    Azure.config.sb_access_key = "<your azure service bus access key>"

## <a id="how-to-create-a-queue"></a>How to Create a Queue

The **Azure::ServiceBusService** object lets you work with queues. To create a queue, use the **create_queue()** method. The following example creates a queue or print out the error if there is any.

    azure_service_bus_service = Azure::ServiceBusService.new
    begin
      queue = azure_service_bus_service.create_queue("test-queue")
    rescue
      puts $!
    end

You can also pass in a **Azure::ServiceBus::Queue** object with additional options, which allows you to override default queue settings such as message time to live or maximum queue size. The following example shows setting the maximum queue size to 5GB and time to live to 1 minute:

    queue = Azure::ServiceBus::Queue.new("test-queue")
    queue.max_size_in_megabytes = 5120
    queue.default_message_time_to_live = "PT1M"

    queue = azure_service_bus_service.create_queue(queue)

## <a id="how-to-send-messages-to-a-queue"></a>How to Send Messages to a Queue

To send a message to a service bus queue, you application will call the **send\_queue\_message()** method on the **Azure::ServiceBusService** object. Messages sent to (and received from) service bus queues are **Azure::ServiceBus::BrokeredMessage** objects, and have a set of standard properties (such as **label** and **time\_to\_live**), a dictionary that is used to hold custom application specific properties, and a body of arbitrary application data. An application can set the body of the message by passing a string value as the message and any required standard properties will be populated with default values.

The following example demonstrates how to send a test message to the queue named "test-queue" using **send\_queue\_message()**:

    message = Azure::ServiceBus::BrokeredMessage.new("test queue message")
    message.correlation_id = "test-correlation-id"
    azure_service_bus_service.send_queue_message("test-queue", message)

Service bus queues support a maximum message size of 256 KB (the header, which includes the standard and custom application properties, can have a maximum size of 64 KB). There is no limit on the number of messages held in a queue but there is a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB.

## <a id="how-to-receive-messages-from-a-queue"></a>How to Receive Messages from a Queue

Messages are received from a queue using the **receive\_queue\_message()** method on the **Azure::ServiceBusService** object. By default, messages are read and locked without being deleted from the queue. However, you can delete messages from the queue as they are read by setting the **:peek_lock** option to **false**.

The default behavior makes the reading and deleting into a two stage operation, which makes it possible to support applications that cannot tolerate missing messages. When service bus receives a request, it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling **delete\_queue\_message()** method and providing the message to be deleted as a parameter. The **delete\_queue\_message()** method will mark the message as being consumed and remove it from the queue.

If the **:peek\_lock** parameter is set to **false**, reading and deleting the message becomes the simplest model, and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked the message as being consumed, then when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

The example below demonstrates how messages can be received and processed using **receive\_queue\_message()**. The example first receives and deletes a message by using **:peek\_lock** set to **false**, then it receives another message and then deletes the message using **delete\_queue\_message()**:

    message = azure_service_bus_service.receive_queue_message("test-queue", 
	  { :peek_lock => false })
    message = azure_service_bus_service.receive_queue_message("test-queue")
    azure_service_bus_service.delete_queue_message("test-queue",
	  message.sequence_number, message.lock_token)

## <a id="how-to-handle-application-crashes-and-unreadable-messages"></a>How to Handle Application Crashes and Unreadable Messages

Service bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiver application is unable to process the message for some reason, then it can call the **unlock\_queue\_message()** method on the **Azure::ServiceBusService** object. This will cause service bus to unlock the message within the queue and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a timeout associated with a message locked within the queue, and if the application fails to process the message before the lock timeout expires (e.g., if the application crashes), then service bus will unlock the message automatically and make it available to be received again.

In the event that the application crashes after processing the message but before the **delete\_queue\_message()** method is called, then the message will be redelivered to the application when it restarts. This is often called **At Least Once Processing**, that is, each message will be processed at least once but in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the **message\_id** property of the message, which will remain constant across delivery attempts.

## <a id="next-steps"></a>Next Steps

Now that you’ve learned the basics of Service Bus queues, follow these links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions.](http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx)
-   Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub.