<properties
    pageTitle="How to use Service Bus queues (.NET) - Azure"
    description="Learn how to use Service Bus queues in Azure. Code samples written in C# using the .NET API."
    services="service-bus"
    documentationCenter=".net"
    authors="sethmanheim"
    manager="timlt"
    editor=""/>

<tags
    ms.service="service-bus"
    ms.workload="tbd"
    ms.tgt_pltfrm="na"
    ms.devlang="dotnet"
    ms.topic="article"
    ms.date="03/18/2015"
    ms.author="sethm"/>





# How to Use Service Bus Queues

<span>This guide describes how to use Service Bus queues. The
samples are written in C\# and use the .NET API. The scenarios covered
include **creating queues** and **sending and receiving messages**. For more information about queues, see the [Next Steps] section. </span>

[AZURE.INCLUDE [create-account-note](../includes/create-account-note.md)]

[AZURE.INCLUDE [howto-service-bus-queues](../includes/howto-service-bus-queues.md)]

## Configure the application to use Service Bus

When you create an application that uses Service Bus, you must
add a reference to the Service Bus assembly and include the
corresponding namespaces.

## Add the Service Bus NuGet package

The Service Bus **NuGet** package is the easiest way to get the
Service Bus API and to configure your application with all of the
Service Bus dependencies. The NuGet Visual Studio extension makes it
easy to install and update libraries and tools in Visual Studio and
Visual Studio Express. The Service Bus NuGet package is the easiest way
to get the Service Bus API and to configure your application with all of
the Service Bus dependencies.

To install the NuGet package in your application, do the following:

1.  In Solution Explorer, right-click **References**, then click
    **Manage NuGet Packages**.
2.  Search for "Service Bus" and select the **Microsoft Azure
    Service Bus** item. Click **Install** to complete the installation,
    then close this dialog.

    ![][7]

You are now ready to write code for Service Bus.


## How to set up a Service Bus connection string

Service Bus uses a connection string to store endpoints and credentials. You can put your connection string in a configuration file, rather than hard-coding it:

- When using Azure Cloud Services, it is recommended that you store your connection string using the Azure service configuration system (***.csdef** and ***.cscfg** files).
- When using Azure Websites or Azure Virtual Machines, it is recommended that you store your connection string using the .NET configuration system (for example, the **Web.config** file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method, as shown later in this guide.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Azure management portal without redeploying your
application. For example, add a `Setting` label to your service definition (***.csdef**) file, as shown here:

    <ServiceDefinition name="Azure1">
    ...
        <WebRole name="MyRole" vmsize="Small">
            <ConfigurationSettings>
                <Setting name="Microsoft.ServiceBus.ConnectionString" />
            </ConfigurationSettings>
        </WebRole>
    ...
    </ServiceDefinition>

You then specify values in the service configuration (***.cscfg**) file:

    <ServiceConfiguration serviceName="Azure1">
    ...
        <Role name="MyRole">
            <ConfigurationSettings>
                <Setting name="Microsoft.ServiceBus.ConnectionString"
                         value="Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourKey" />
            </ConfigurationSettings>
        </Role>
    ...
    </ServiceConfiguration>

Use the Shared Access Signature (SAS) key name and key values retrieved from the management portal as
described in the previous section.

### Configuring your connection string when using Websites or Virtual Machines

When using Websites or Virtual Machines, it is recommended that you use the .NET configuration system (for example, **Web.config**). You store the connection string using the `<appSettings>` element:

    <configuration>
        <appSettings>
            <add key="Microsoft.ServiceBus.ConnectionString"
                 value="Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourKey" />
        </appSettings>
    </configuration>

Use the SAS name and key values that you retrieved from the management portal, as described in the previous section.

## How to create a queue

You can perform management operations for Service Bus queues using the [`NamespaceManager` class](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.aspx). This class provides methods to create, enumerate, and delete queues.

This example constructs a `NamespaceManager` object using the Azure `CloudConfigurationManager` class
with a connection string consisting of the base address of a Service Bus service namespace and the appropriate
SAS credentials with permissions to manage it. This connection string is of the form

    Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedSecretValue=yourKey

For example, given the configuration settings in the previous section:

    // Create the queue if it does not exist already
    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
        NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.QueueExists("TestQueue"))
    {
        namespaceManager.CreateQueue("TestQueue");
    }

There are overloads of the [`CreateQueue`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.createqueue.aspx) method that enable you to tune properties
of the queue (for example, to set the default "time-to-live" value to be applied to messages sent to the queue). These
settings are applied by using the [`QueueDescription`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queuedescription.aspx) class. The
following example shows how to create a queue named "TestQueue" with a
maximum size of 5 GB and a default message time-to-live of 1 minute:

    // Configure queue settings
    QueueDescription qd = new QueueDescription("TestQueue");
    qd.MaxSizeInMegabytes = 5120;
    qd.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

    // Create a new queue with custom settings
    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
        NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.QueueExists("TestQueue"))
    {
        namespaceManager.CreateQueue(qd);
    }

> [AZURE.NOTE] You can use the [`QueueExists`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.queueexists.aspx) method on [`NamespaceManager`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.aspx) objects to check if a queue with a specified name already exists within a service namespace.

## How to send messages to a queue

To send a message to a Service Bus queue, your application creates a
[`QueueClient`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.aspx) object using the connection string.

The code below demonstrates how to create a [`QueueClient`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.aspx) object for the "TestQueue" queue you just created using the [`CreateFromConnectionString`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.createfromconnectionstring.aspx) API call:

    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    QueueClient Client =
        QueueClient.CreateFromConnectionString(connectionString, "TestQueue");

    Client.Send(new BrokeredMessage());

Messages sent to (and received from) Service Bus queues are instances of
the [`BrokeredMessage`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.aspx) class. `BrokeredMessage` objects have a set of
standard properties (such as [`Label`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.label.aspx) and [`TimeToLive`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.timetolive.aspx)), a dictionary
that is used to hold custom application specific properties, and a body
of arbitrary application data. An application can set the body of the
message by passing any serializable object into the constructor of the
[`BrokeredMessage`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.aspx) object, and the appropriate **DataContractSerializer** will
then be used to serialize the object. Alternatively, a
**System.IO.Stream** can be provided.

The following example demonstrates how to send five test messages to the
"TestQueue" [`QueueClient`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.aspx) object obtained in the previous code snippet:

     for (int i=0; i<5; i++)
     {
       // Create message, passing a string message for the body
       BrokeredMessage message = new BrokeredMessage("Test message " + i);

       // Set some addtional custom app-specific properties
       message.Properties["TestProperty"] = "TestValue";
       message.Properties["Message number"] = i;

       // Send message to the queue
       Client.Send(message);
     }

Service Bus queues support a maximum message size of 256 Kb (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 Kb). There is no limit on the number of messages
held in a queue but there is a cap on the total size of the messages
held by a queue. This queue size is defined at creation time, with an
upper limit of 5 GB. If partitioning is enabled, the upper limit is higher. For more information, see [Partitioning Messaging Entities](https://msdn.microsoft.com/library/dn520246.aspx).

## How to receive messages from a queue

The recommended way to receive messages from a queue is to use a
[`QueueClient`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.aspx) object. `QueueClient` objects can work in two different modes: [`ReceiveAndDelete` and `PeekLock`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.receivemode.aspx).

When using the **ReceiveAndDelete** mode, the receive is a single-shot
operation - that is, when Service Bus receives a read request for a
message in a queue, it marks the message as consumed, and returns
it to the application. **ReceiveAndDelete** is the simplest model
and works best for scenarios in which an application can tolerate not
processing a message in the event of a failure. To understand this,
consider a scenario in which the consumer issues the receive request and
then crashes before processing it. Because Service Bus will have marked
the message as consumed, when the application restarts and
begins consuming messages again, it will have missed the message that
was consumed prior to the crash.

In **PeekLock** mode (which is the default mode), the receive becomes a two-stage operation, which makes it possible to support applications that
cannot tolerate missing messages. When Service Bus receives a request,
it finds the next message to be consumed, locks it to prevent other
consumers receiving it, and then returns it to the application. After
the application finishes processing the message (or stores it reliably
for future processing), it completes the second stage of the receive
process by calling [`Complete`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) on the received message. When Service
Bus sees the `Complete` call, it marks the message as consumed, and removes it from the queue.

The following example demonstrates how messages can be received and
processed using the default **PeekLock** mode. To specify a different
[`ReceiveMode`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.receivemode.aspx) value, you can use another overload of
[`CreateFromConnectionString`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.createfromconnectionstring.aspx). This example uses the [`OnMessage`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.onmessage.aspx) callback
to process messages as they arrive into the "TestQueue".

    string connectionString =
      CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");
    QueueClient Client =
      QueueClient.CreateFromConnectionString(connectionString, "TestQueue");

    // Configure the callback options
    OnMessageOptions options = new OnMessageOptions();
    options.AutoComplete = false;
    options.AutoRenewTimeout = TimeSpan.FromMinutes(1);

    // Callback to handle received messages
    Client.OnMessage((message) =>
    {
        try
        {
            // Process message from queue
            Console.WriteLine("Body: " + message.GetBody<string>());
            Console.WriteLine("MessageID: " + message.MessageId);
            Console.WriteLine("Test Property: " +
            message.Properties["TestProperty"]);

            // Remove message from queue
            message.Complete();
        }
            catch (Exception)
        {
            // Indicates a problem, unlock message in queue
            message.Abandon();
        }
    };

This example configures the [`OnMessage`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.queueclient.onmessage.aspx) callback using an [`OnMessageOptions`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.onmessageoptions.aspx) object. [`AutoComplete`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.onmessageoptions.autocomplete.aspx)
is set to **false** to enable manual control over when to call [`Complete`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) on the received message.
[`AutoRenewTimeout`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.onmessageoptions.autorenewtimeout.aspx) is set to 1 minute, which causes the client to wait for up to one minute for a message before the call times out and the client makes a new call to check for messages. This property value reduces the number of times the client makes chargeable calls that do not retrieve messages.

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from
errors in your application or with difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the [`Abandon`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.abandon.aspx) method on the received message (instead
of the [`Complete`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) method). This causes Service Bus to unlock the
message within the queue and make it available to be received again,
either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
queue, and if the application fails to process the message before the
lock timeout expires (for example, if the application crashes), then Service
Bus unlocks the message automatically and makes it available to be
received again.

In the event that the application crashes after processing the message
but before the [`Complete`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) request is issued, the message will be
redelivered to the application when it restarts. This is often called
**At Least Once Processing**; that is, each message is processed at
least once but in certain situations the same message may be
redelivered. If the scenario cannot tolerate duplicate processing, then
application developers should add additional logic to their application
to handle duplicate message delivery. This is often achieved using the
[`MessageId`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.messageid.aspx) property of the message, which remains constant across
delivery attempts.

## Next steps

Now that you've learned the basics of Service Bus queues, follow these
links to learn more.

-   See the MSDN overview: [Queues, Topics, and Subscriptions.][]
-   Build a working application that sends and receives messages to and
    from a Service Bus queue: [Service Bus Brokered Messaging .NET
    Tutorial].
-   Service Bus samples: download from [Azure Samples][] or see the overview on [MSDN][].

  [Next Steps]: #next-steps
  [What are Service Bus Queues]: #what-queues
  [Create a Service Namespace]: #create-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-creds
  [Configure Your Application to Use Service Bus]: #configure-app
  [How to: Set Up a Service Bus Connection String]: #set-up-connstring
  [How to: Configure your Connection String]: #config-connstring
  [How to: Create a Queue]: #create-queue
  [How to: Send Messages to a Queue]: #send-messages
  [How to: Receive Messages from a Queue]: #receive-messages
  [How to: Handle Application Crashes and Unreadable Messages]: #handle-crashes
  [Azure Management Portal]: http://manage.windowsazure.com
  [7]: ./media/service-bus-dotnet-how-to-use-queues/getting-started-multi-tier-13.png
  [Queues, Topics, and Subscriptions.]: http://msdn.microsoft.com/library/hh367516.aspx
  [Service Bus Brokered Messaging .NET Tutorial]: http://msdn.microsoft.com/library/hh367512.aspx
  [Azure Samples]: https://code.msdn.microsoft.com/windowsazure/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=2
  [MSDN]: https://msdn.microsoft.com/library/dn194201.aspx