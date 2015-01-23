<properties urlDisplayName="Service Bus Topics" pageTitle="How to use Service Bus topics (.NET) - Azure" metaKeywords="Get started Azure Service Bus topics, Azure publish subscribe messaging, Azure messaging topics and subscriptions C#" description="Learn how to use Service Bus topics and subscriptions in Azure. Code samples are written for .NET applications." metaCanonical="" services="service-bus" documentationCenter=".net" title="" authors="sethmanheim" solutions="" manager="timlt" editor="mattshel"/>

<tags ms.service="service-bus" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/13/2015" ms.author="sethm" />





# How to Use Service Bus Topics/Subscriptions

<span>This guide will show you how to use Service Bus topics and
subscriptions. The samples are written in C\# and use the .NET API. The
scenarios covered include **creating topics and subscriptions, creating
subscription filters, sending messages** to a topic, **receiving
messages from a subscription**, and **deleting topics and
subscriptions**. For more information on topics and subscriptions, see
the [Next Steps][] section. </span>

[AZURE.INCLUDE [create-account-note](../includes/create-account-note.md)]

[AZURE.INCLUDE [howto-service-bus-topics](../includes/howto-service-bus-topics.md)]

<h2>Configure the Application to Use Service Bus</h2>

When you create an application that uses Service Bus, you will need to
add a reference to the Service Bus assembly and include the
corresponding namespaces.

<h2>Get the Service Bus NuGet Package</h2>

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

You are now ready to write code against Service Bus.

<h2>How to Set Up a Service Bus Connection String</h2>

The Service Bus uses a connection string to store endpoints and credentials. You can put your connection string in a configuration file, rather than hard-coding it in code:

- When using Azure Cloud Services, it is recommended you store your connection string using the Azure service configuration system (`*.csdef` and `*.cscfg` files).
- When using Azure Websites or Azure Virtual Machines, it is recommended you store your connection string using the .NET configuration system (e.g. `web.config` file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method as shown later in this guide.

### <a name="config-connstring"> </a>Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Azure Management Portal without redeploying your
application.  For example, add a Setting to your service definition (`*.csdef`) file, as shown below:

	<ServiceDefinition name="WindowsAzure1">
	...
		<WebRole name="MyRole" vmsize="Small">
	    	<ConfigurationSettings>
	      		<Setting name="Microsoft.ServiceBus.ConnectionString" />
    		</ConfigurationSettings>
  		</WebRole>
	...
	</ServiceDefinition>

You then specify values in the service configuration (`*.cscfg`) file:

	<ServiceConfiguration serviceName="WindowsAzure1">
	...
		<Role name="MyRole">
			<ConfigurationSettings>
				<Setting name="Microsoft.ServiceBus.ConnectionString" 
						 value="Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedSecretValue=yourKey" />
			</ConfigurationSettings>
		</Role>
	...
	</ServiceConfiguration>

Use the issuer and key values retrieved from the Management Portal as
described in the previous section.

### Configuring your connection string when using Websites or Virtual Machines

When using Websites or Virtual Machines, it is recommended you use the .NET configuration system (e.g. `web.config`).  You store the connection string using the `<appSettings>` element:

	<configuration>
	    <appSettings>
		    <add key="Microsoft.ServiceBus.ConnectionString"
			     value="Endpoint=sb://yourServiceNamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedSecretValue=yourKey" />
		</appSettings>
	</configuration>

Use the issuer and key values retrieved from the Management Portal as
described in the previous section.

<h2>How to Create a Topic</h2>

You can perform management operations for Service Bus topics and subscriptions via the **NamespaceManager** class. The **NamespaceManager** class provides methods to create, enumerate, and delete queues. 

This example constructs a **NamespaceManager** object using the Azure **CloudConfigurationManager** class
with a connection string consisting of the base address of a Service Bus service namespace and the appropriate
credentials with permissions to manage it. This connection string is of the form

	Endpoint=sb://<yourServiceNamespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedSecretValue=yourKey

For example, given the configuration settings in the previous section:

	// Create the topic if it does not exist already
	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

	var namespaceManager = 
		NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic("TestTopic");
    }

There are overloads of the **CreateTopic** method that enable you to tune properties
of the topic, for example, to set the default "time-to-live" value
to be applied to messages sent to the topic. These settings are applied
by using the **TopicDescription** class. The following example shows how
to create a topic named "TestTopic" with a maximum size of 5 GB and a
default message time-to-live of 1 minute.

	// Configure Topic Settings
    TopicDescription td = new TopicDescription("TestTopic");
    td.MaxSizeInMegabytes = 5120;
    td.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

	// Create a new Topic with custom settings
	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

	var namespaceManager = 
		NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic(td);
    }

**Note:** You can use the **TopicExists** method on **NamespaceManager**
objects to check if a topic with a specified name already exists within
a service namespace.

<h2>How to Create Subscriptions</h2>

You can also create topic subscriptions with the **NamespaceManager**
class. Subscriptions are named and can have an optional filter that
restricts the set of messages passed to the subscription's virtual
queue.

### Create a Subscription with the default (MatchAll) Filter

The **MatchAll** filter is the default filter that is used if no filter
is specified when a new subscription is created. When the **MatchAll**
filter is used, all messages published to the topic are placed in the
subscription's virtual queue. The following example creates a
subscription named "AllMessages" and uses the default **MatchAll**
filter.

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

	var namespaceManager = 
		NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.SubscriptionExists("TestTopic", "AllMessages"))
    {
        namespaceManager.CreateSubscription("TestTopic", "AllMessages");
    }

### Create Subscriptions with Filters

You can also set up filters that allow you to specify which messages sent
to a topic should appear within a specific topic subscription.

The most flexible type of filter supported by subscriptions is the
**SqlFilter**, which implements a subset of SQL92. SQL filters operate
on the properties of the messages that are published to the topic. For
more details about the expressions that can be used with a SQL filter,
review the [SqlFilter.SqlExpression][] syntax.

The example below creates a subscription named "HighMessages" with a
**SqlFilter** that only selects messages that have a custom
**MessageNumber** property greater than 3:

     // Create a "HighMessages" filtered subscription
     SqlFilter highMessagesFilter = 
		new SqlFilter("MessageNumber > 3");

     namespaceManager.CreateSubscription("TestTopic", 
		"HighMessages", 
		highMessagesFilter);

Similarly, the following example creates a subscription named
"LowMessages" with a **SqlFilter** that only selects messages that have
a **MessageNumber** property less than or equal to 3:

     // Create a "LowMessages" filtered subscription
     SqlFilter lowMessagesFilter = 
		new SqlFilter("MessageNumber <= 3");

     namespaceManager.CreateSubscription("TestTopic", 
		"LowMessages", 
		lowMessagesFilter);

Now when a message is sent to "TestTopic", it will always be
delivered to receivers subscribed to the "AllMessages" topic
subscription, and selectively delivered to receivers subscribed to the
"HighMessages" and "LowMessages" topic subscriptions (depending upon the
message content).

<h2>How to Send Messages to a Topic</h2>

To send a message to a Service Bus topic, your application creates a
**TopicClient** object using the connection string.

The code below demonstrates how to create a **TopicClient** object
for the "TestTopic" topic created above using the **CreateFromConnectionString** API call:

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

   	TopicClient Client = 
		TopicClient.CreateFromConnectionString(connectionString, "TestTopic");

	Client.Send(new BrokeredMessage());
 

Messages sent to Service Bus topics are instances of the
**BrokeredMessage** class. **BrokeredMessage** objects have a set of
standard properties (such as **Label** and **TimeToLive**), a dictionary
that is used to hold custom application-specific properties, and a body
of arbitrary application data. An application can set the body of the
message by passing any serializable object to the constructor of the
**BrokeredMessage**, and the appropriate **DataContractSerializer** will
then be used to serialize the object. Alternatively, a
**System.IO.Stream** can be provided.

The following example demonstrates how to send five test messages to the
"TestTopic" **TopicClient** obtained in the code snippet above.
Note how the **MessageNumber** property value of each message varies on
the iteration of the loop (this will determine which subscriptions
receive it):

     for (int i=0; i<5; i++)
     {
       // Create message, passing a string message for the body
       BrokeredMessage message = 
		new BrokeredMessage("Test message " + i);

       // Set additional custom app-specific property
       message.Properties["MessageNumber"] = i;

       // Send message to the topic
       Client.Send(message);
     }

Service Bus topics support a maximum message size of 256 Kb (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 Kb). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This queue size is defined at creation time, with an
upper limit of 5 GB.

<h2>How to Receive Messages from a Subscription</h2>

The easiest way to receive messages from a subscription is to use a
**SubscriptionClient** object. **SubscriptionClient** objects can work in two
different modes: **ReceiveAndDelete** and **PeekLock**.

When using the **ReceiveAndDelete** mode, receive is a single-shot
operation - that is, when the Service Bus receives a read request for a
message in a subscription, it marks the message as being consumed and
returns it to the application. **ReceiveAndDelete** mode is the simplest
model and works best for scenarios in which an application can tolerate
not processing a message in the event of a failure. To understand this,
consider a scenario in which the consumer issues the receive request and
then crashes before processing it. Because the Service Bus will have marked
the message as consumed, when the application restarts and
begins consuming messages again, it will have missed the message that
was consumed prior to the crash.

In **PeekLock** mode (which is the default mode), the receive process becomes a two-stage operation which makes it possible to support applications that
cannot tolerate missing messages. When the Service Bus receives a request,
it finds the next message to be consumed, locks it to prevent other
consumers receiving it, and then returns it to the application. After
the application finishes processing the message (or stores it reliably
for future processing), it completes the second stage of the receive
process by calling **Complete** on the received message. When the Service
Bus sees the **Complete** call, it marks the message as being
consumed and removes it from the subscription.

The example below demonstrates how messages can be received and
processed using the default **PeekLock** mode. To specify a different **ReceiveMode** value, you can use another overload for **CreateFromConnectionString**. This example creates an infinite loop and processes messages as they arrive to the "HighMessages" subscription. Note that the path to the "HighMessages"
subscription is supplied in the form "<*topic
path*\>/subscriptions/<*subscription name*\>".

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    SubscriptionClient Client = 
		SubscriptionClient.CreateFromConnectionString
                (connectionString, "TestTopic", "HighMessages");

	Client.Receive();
     
	// Continuously process messages received from the HighMessages subscription 
    while (true) 
    {  
       BrokeredMessage message = Client.Receive();

       if (message != null)
       {
          try 
          {
             Console.WriteLine("Body: " + message.GetBody<string>());
             Console.WriteLine("MessageID: " + message.MessageId);
             Console.WriteLine("MessageNumber: " + 
				message.Properties["MessageNumber"]);

             // Remove message from subscription
             message.Complete();
          }
          catch (Exception)
          {
             // Indicate a problem, unlock message in subscription
             message.Abandon();
          }
       }
    } 

<h2>How to Handle Application Crashes and Unreadable Messages</h2>

The Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiving application is unable to process the message for some reason,
then it can call the **Abandon** method on the received message (instead
of the **Complete** method). This will cause the Service Bus to unlock the
message within the subscription and make it available to be received
again, either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
subscription, and if the application fails to process the message before
the lock timeout expires (for example, if the application crashes), then the Service Bus unlocks the message automatically and makes it available to be received again.

In the event that the application crashes after processing the message
but before the **Complete** request is issued, then the message will be
redelivered to the application when it restarts. This is often called
**At Least Once Processing**, that is, each message will be processed at
least once but in certain situations the same message may be
redelivered. If the scenario cannot tolerate duplicate processing, then
application developers should add additional logic to their application
to handle duplicate message delivery. This is often achieved using the
**MessageId** property of the message, which will remain constant across
delivery attempts.

<h2>How to Delete Topics and Subscriptions</h2>

The example below demonstrates how to delete the topic named
**TestTopic** from the **HowToSample** service namespace:

     // Delete Topic
     namespaceManager.DeleteTopic("TestTopic");

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following code demonstrates how to delete a subscription named
**HighMessages** from the **TestTopic** topic:

      namespaceManager.DeleteSubscription("TestTopic", "HighMessages");

<h2>Next Steps</h2>

Now that you've learned the basics of Service Bus topics and subscriptions, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions][].
-   API reference for [SqlFilter][].
-   Build a working application that sends and receives messages to and
    from a Service Bus queue: [Service Bus Brokered Messaging .NET
    Tutorial][].

  [Next Steps]: #nextsteps
  [What are Service Bus Topics and Subscriptions]: #what-is
  [Create a Service Namespace]: #create-namespace
  [Obtain the Default Management Credentials for the Namespace]: #obtain-creds
  [Configure Your Application to Use Service Bus]: #configure-app
  [How to: Set Up a Service Bus Connection String]: #set-up-connstring
  [How to: Configure your Connection String]: #config-connstring
  [How to: Create a Topic]: #create-topic
  [How to: Create Subscriptions]: #create-subscriptions
  [How to: Send Messages to a Topic]: #send-messages
  [How to: Receive Messages from a Subscription]: #receive-messages
  [How to: Handle Application Crashes and Unreadable Messages]: #handle-crashes
  [How to: Delete Topics and Subscriptions]: #delete-topics
  
  [Topic Concepts]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/sb-topics-01.png
  [Azure Management Portal]: http://manage.windowsazure.com
  
  
  
  
  
  
  [7]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/getting-started-multi-tier-13.png
  
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/microsoft.servicebus.messaging.sqlfilter.aspx
  [Service Bus Brokered Messaging .NET Tutorial]: http://msdn.microsoft.com/en-us/library/hh367512.aspx
