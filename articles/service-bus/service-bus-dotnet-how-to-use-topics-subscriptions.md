<properties
    pageTitle="How to use Service Bus topics (.NET) | Microsoft Azure"
    description="Learn how to use Service Bus topics and subscriptions in Azure. Code samples are written for .NET applications."
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
    ms.topic="get-started-article"
    ms.date="07/02/2015"
    ms.author="sethm"/>

# How to use Azure Service Bus topics and subscriptions

This article describes how to use Service Bus topics and subscriptions. The samples are written in C# and use the .NET APIs. The scenarios covered include creating topics and subscriptions, creating subscription filters, sending messages to a topic, receiving messages from a subscription, and deleting topics and subscriptions. For more information about topics and subscriptions, see the [Next steps](#Next-steps) section.

[AZURE.INCLUDE [create-account-note](../../includes/create-account-note.md)]

[AZURE.INCLUDE [howto-service-bus-topics](../../includes/howto-service-bus-topics.md)]

## Configure the application to use Service Bus

When you create an application that uses Service Bus, you must add a reference to the Service Bus assembly and include the corresponding namespaces.

## Get the Service Bus NuGet package

The Service Bus NuGet package is the easiest way to get the Service Bus API and to configure your application with all of the Service Bus dependencies. The NuGet Visual Studio extension makes it easy to install and update libraries and tools in Visual Studio and Visual Studio Express. The Service Bus NuGet package is the easiest way
to get the Service Bus API and to configure your application with all of the Service Bus dependencies.

To install the NuGet package in your application, do the following:

1.  In Solution Explorer, right-click **References**, then click
    **Manage NuGet Packages**.
2.  Search for "Service Bus" and select the **Microsoft Azure
    Service Bus** item. Click **Install** to complete the installation,
    then close the following dialog box.

    ![][7]

You are now ready to write code for Service Bus.

## How to set up a Service Bus connection string

Service Bus uses a connection string to store endpoints and credentials. You can put your connection string in a configuration file, rather than hard-coding it:

- When using Azure Cloud Services, it is recommended that you store your connection string using the Azure service configuration system (.csdef and .cscfg files).
- When using Azure websites or Azure Virtual Machines, it is recommended that you store your connection string using the .NET configuration system (for example, the Web.config file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method, as shown later in this article.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Azure Cloud Services projects and enables you to dynamically change configuration settings from the Azure portal without redeploying your application. For example, add a `Setting` label to your service definition (***.csdef**) file, as shown in the next example.

    <ServiceDefinition name="Azure1">
    ...
        <WebRole name="MyRole" vmsize="Small">
            <ConfigurationSettings>
                <Setting name="Microsoft.ServiceBus.ConnectionString" />
            </ConfigurationSettings>
        </WebRole>
    ...
    </ServiceDefinition>

You then specify values in the service configuration (.cscfg) file.

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

Use the Shared Access Signature (SAS) key name and key values retrieved from the Azure portal as
described in the previous section.

### Configuring your connection string when using Azure websites or Azure Virtual Machines

When using websites or Virtual Machines, it is recommended you use the .NET configuration system (for example, Web.config). You store the connection string using the `<appSettings>` element.

    <configuration>
        <appSettings>
            <add key="Microsoft.ServiceBus.ConnectionString"
                 value="Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourKey" />
        </appSettings>
    </configuration>

Use the SAS name and key values that you retrieved from the Azure portal, as described in the previous section.

## How to create a topic

You can perform management operations for Service Bus topics and subscriptions using the [`NamespaceManager`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.aspx) class. This class provides methods to create, enumerate, and delete topics.

The following example constructs a `NamespaceManager` object using the Azure `CloudConfigurationManager` class
with a connection string consisting of the base address of a Service Bus service namespace and the appropriate
SAS credentials with permissions to manage it. This connection string is of the following form.

    Endpoint=sb://<yourServiceNamespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yourKey

Use the following example, given the configuration settings in the previous section.

    // Create the topic if it does not exist already.
    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
        NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic("TestTopic");
    }

There are overloads of the [`CreateTopic`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.createtopic.aspx) method that enable you to tune properties of the topic, for example, to set the default "time-to-live" value to be applied to messages sent to the topic. These settings are applied by using the [`TopicDescription`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.topicdescription.aspx) class. The following example shows how to create a topic named TestTopic with a maximum size of 5 GB and a default message time-to-live of 1 minute.

    // Configure Topic Settings.
    TopicDescription td = new TopicDescription("TestTopic");
    td.MaxSizeInMegabytes = 5120;
    td.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

    // Create a new Topic with custom settings.
    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
        NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic(td);
    }

> [AZURE.NOTE] You can use the [`TopicExists`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.topicexists.aspx) method on [`NamespaceManager`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.aspx) objects to check whether a topic with a specified name already exists within a service namespace.

## How to create a subscription

You can also create topic subscriptions using the [`NamespaceManager`](https://msdn.microsoft.com/library/microsoft.servicebus.namespacemanager.aspx) class. Subscriptions are named and can have an optional filter that
restricts the set of messages passed to the subscription's virtual
queue.

### Create a subscription with the default (MatchAll) filter

The **MatchAll** filter is the default filter that is used if no filter is specified when a new subscription is created. When you use the **MatchAll** filter, all messages published to the topic are placed in the subscription's virtual queue. The following example creates a subscription named "AllMessages" and uses the default **MatchAll** filter.

    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    var namespaceManager =
        NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.SubscriptionExists("TestTopic", "AllMessages"))
    {
        namespaceManager.CreateSubscription("TestTopic", "AllMessages");
    }

### Create subscriptions with filters

You can also set up filters that enable you to specify which messages sent to a topic should appear within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the [SqlFilter] class, which implements a subset of SQL92. SQL filters operate on the properties of the messages that are published to the topic. For more information about the expressions that can be used with a SQL filter, see the [SqlFilter.SqlExpression][] syntax.

The following example creates a subscription named **HighMessages** with a [SqlFilter] object that only selects messages that have a custom **MessageNumber** property greater than 3.

     // Create a "HighMessages" filtered subscription.
     SqlFilter highMessagesFilter =
        new SqlFilter("MessageNumber > 3");

     namespaceManager.CreateSubscription("TestTopic",
        "HighMessages",
        highMessagesFilter);

Similarly, the following example creates a subscription named **LowMessages** with a [SqlFilter] that only selects messages that have a **MessageNumber** property less than or equal to 3.

     // Create a "LowMessages" filtered subscription.
     SqlFilter lowMessagesFilter =
        new SqlFilter("MessageNumber <= 3");

     namespaceManager.CreateSubscription("TestTopic",
        "LowMessages",
        lowMessagesFilter);

Now when a message is sent to `TestTopic`, it is always delivered to receivers subscribed to the **AllMessages** topic subscription, and selectively delivered to receivers subscribed to the **HighMessages** and **LowMessages** topic subscriptions (depending on the message content).

## How to send messages to a topic

To send a message to a Service Bus topic, your application creates a [`TopicClient`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicclient.aspx) object using the connection string.

The following code demonstrates how to create a [`TopicClient`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.topicclient.aspx) object for the **TestTopic** topic created earlier using the [`CreateFromConnectionString`](https://msdn.microsoft.com/library/microsoft.servicebus.messaging.topicclient.createfromconnectionstring.aspx) API call.

    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    TopicClient Client =
        TopicClient.CreateFromConnectionString(connectionString, "TestTopic");

    Client.Send(new BrokeredMessage());


Messages sent to Service Bus topics are instances of the [`BrokeredMessage`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.aspx) class. **BrokeredMessage** objects have a set of
standard properties (such as [`Label`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.label.aspx) and [`TimeToLive`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.timetolive.aspx)), a dictionary that is used to hold custom application-specific properties, and a body of arbitrary application data. An application can set the body of the
message by passing any serializable object to the constructor of the [`BrokeredMessage`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.aspx) object, and the appropriate **DataContractSerializer** is then used to serialize the object. Alternatively, a **System.IO.Stream** can be provided.

The following example demonstrates how to send five test messages to the **TestTopic** [`TopicClient`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicclient.aspx) object obtained in the previous code example. Note that the [`MessageNumber`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.properties.aspx) property value of each message varies depending on the iteration of the loop (this determines which subscriptions receive it).

     for (int i=0; i<5; i++)
     {
       // Create message, passing a string message for the body.
       BrokeredMessage message =
        new BrokeredMessage("Test message " + i);

       // Set additional custom app-specific property.
       message.Properties["MessageNumber"] = i;

       // Send message to the topic.
       Client.Send(message);
     }

Service Bus topics support a [maximum message size of 256 KB](service-bus-quotas.md) (the header, which includes the standard and custom application properties, can have a maximum size of 64 KB). There is no limit on the number of messages held in a topic but there is a cap on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB. If partitioning is enabled, the upper limit is higher. For more information, see [Partitioning Messaging Entities](https://msdn.microsoft.com/library/azure/dn520246.aspx).

## How to receive messages from a subscription

The recommended way to receive messages from a subscription is to use a [`SubscriptionClient`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptionclient.aspx) object. **SubscriptionClient** objects can work in two different modes: [`ReceiveAndDelete` and `PeekLock`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.receivemode.aspx).

When using the **ReceiveAndDelete** mode, receive is a single-shot operation - that is, when Service Bus receives a read request for a message in a subscription, it marks the message as being consumed and returns it to the application. **ReceiveAndDelete** mode is the simplest model and works best for scenarios in which an application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus will have marked
the message as consumed, when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In **PeekLock** mode (which is the default mode), the receive process becomes a two-stage operation which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives a request,
it finds the next message to be consumed, locks it to prevent other consumers receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling [`Complete`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) on the received message. When Service Bus sees the `Complete` call, it marks the message as being consumed and removes it from the subscription.

The following example demonstrates how messages can be received and processed using the default **PeekLock** mode. To specify a different [`ReceiveMode`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.receivemode.aspx) value, you can use another overload for [`CreateFromConnectionString`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptionclient.createfromconnectionstring.aspx). This example uses the [`OnMessage`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptionclient.onmessage.aspx) callback to process messages as they arrive
in the **HighMessages** subscription.

    string connectionString =
        CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    SubscriptionClient Client =
        SubscriptionClient.CreateFromConnectionString
                (connectionString, "TestTopic", "HighMessages");

    // Configure the callback options.
    OnMessageOptions options = new OnMessageOptions();
    options.AutoComplete = false;
    options.AutoRenewTimeout = TimeSpan.FromMinutes(1);

    Client.OnMessage((message) =>
    {
        try
        {
            // Process message from subscription.
            Console.WriteLine("\n**High Messages**");
            Console.WriteLine("Body: " + message.GetBody<string>());
            Console.WriteLine("MessageID: " + message.MessageId);
            Console.WriteLine("Message Number: " +
                message.Properties["MessageNumber"]);

            // Remove message from subscription.
            message.Complete();
        }
        catch (Exception)
        {
            // Indicates a problem, unlock message in subscription.
            message.Abandon();
        }
    }, options);

This example configures the [`OnMessage`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.subscriptionclient.onmessage.aspx) callback using an [`OnMessageOptions`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.onmessageoptions.aspx) object. [`AutoComplete`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.onmessageoptions.autocomplete.aspx) is set to **false** to enable manual control of when to call [`Complete`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) on the received message. [`AutoRenewTimeout`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.onmessageoptions.autorenewtimeout.aspx) is set to 1 minute, which causes the client to wait for up to one minute for a message before the call times out and the client makes a new call to check for messages. This property value reduces the number of times the client makes
chargeable calls that do not retrieve messages.

## How to handle application crashes and unreadable messages

Service Bus provides functionality to help you gracefully recover from errors in your application or difficulties processing a message. If a receiving application is unable to process the message for some reason, then it can call the [`Abandon`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.abandon.aspx) method on the received message (instead
of the [`Complete`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) method). This causes Service Bus to unlock the message within the subscription and make it available to be received again, either by the same consuming application or by another consuming application.

There is also a time-out associated with a message locked within the subscription, and if the application fails to process the message before the lock time-out expires (for example, if the application crashes), then Service Bus unlocks the message automatically and makes it available to be received again.

In the event that the application crashes after processing the message but before the [`Complete`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.complete.aspx) request is issued, the message will be redelivered to the application when it restarts. This is often called **At Least Once Processing**; that is, each message is processed at least once but in certain situations the same message may be
redelivered. If the scenario cannot tolerate duplicate processing, then application developers should add additional logic to their application to handle duplicate message delivery. This is often achieved using the
[`MessageId`](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.brokeredmessage.messageid.aspx) property of the message, which will remain constant across delivery attempts.

## How to delete topics and subscriptions

The following example demonstrates how to delete the topic **TestTopic** from the **HowToSample** service namespace.

     // Delete Topic.
     namespaceManager.DeleteTopic("TestTopic");

Deleting a topic also deletes any subscriptions that are registered with the topic. Subscriptions can also be deleted independently. The following code demonstrates how to delete a subscription named **HighMessages** from the **TestTopic** topic.

      namespaceManager.DeleteSubscription("TestTopic", "HighMessages");

## Next steps

Now that you've learned the basics of Service Bus topics and subscriptions, follow these links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].
-   Build a working application that sends and receives messages to and from a Service Bus queue: [Service Bus Brokered Messaging .NET Tutorial][].
-   Service Bus samples: Download from [Azure Samples][] or see the overview on [MSDN][].

  [Azure portal]: http://manage.windowsazure.com

  [7]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/getting-started-multi-tier-13.png

  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sqlfilter.aspx
  [SqlFilter.SqlExpression]: https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Service Bus Brokered Messaging .NET Tutorial]: http://msdn.microsoft.com/library/azure/hh367512.aspx
  [Azure Samples]: https://code.msdn.microsoft.com/windowsazure/site/search?query=service%20bus&f%5B0%5D.Value=service%20bus&f%5B0%5D.Type=SearchText&ac=2
  [MSDN]: https://msdn.microsoft.com/library/azure/dn194201.aspx
