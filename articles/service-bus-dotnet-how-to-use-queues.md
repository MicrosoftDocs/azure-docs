<properties urlDisplayName="Service Bus Queues" pageTitle="How to use Service Bus queues (.NET) - Azure" metaKeywords="Azure Service Bus queues, Azure queues, Azure messaging, Azure queues C#, Azure queues .NET" description="Learn how to use Service Bus queues in Azure. Code samples written in C# using the .NET API." metaCanonical="" services="service-bus" documentationCenter=".NET" title="How to Use Service Bus Queues" authors="sethm" solutions="" manager="timlt" editor="mattshel" />

<tags ms.service="service-bus" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/12/2015" ms.author="sethm" />





# How to Use Service Bus Queues

<span>This guide will show you how to use Service Bus queues. The
samples are written in C\# and use the .NET API. The scenarios covered
include **creating queues, sending and receiving messages**, and
**deleting queues**. For more information on queues, see the [Next Steps] section. </span>

[WACOM.INCLUDE [create-account-note](../includes/create-account-note.md)]

[WACOM.INCLUDE [howto-service-bus-queues](../includes/howto-service-bus-queues.md)]

##Configure the Application to Use Service Bus

When you create an application that uses Service Bus, you must
add a reference to the Service Bus assembly and include the
corresponding namespaces.

##Get the Service Bus NuGet Package

The Service Bus **NuGet** package is the easiest way to get the
Service Bus API and to configure your application with all of the
Service Bus dependencies. The NuGet Visual Studio extension makes it
easy to install and update libraries and tools in Visual Studio and
Visual Studio Express 2012 for Web.

To install the NuGet package in your application, do the following:

1.  In Solution Explorer, right-click **References**, then click
    **Manage NuGet Packages**.
2.  Search for WindowsAzure" and select the **Azure
    Service Bus** item. Click **Install** to complete the installation,
    then close this dialog.

    ![][7]

You are now ready to write code against Service Bus.


##How to Set Up a Service Bus Connection String

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

Use the issuer and Shared Access Signature (SAS) key values retrieved from the Management Portal as
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

##How to Create a Queue

You can perform management operations for Service Bus queues via the **NamespaceManager** class. The **NamespaceManager** class provides methods to create, enumerate, and delete queues. 

This example constructs a **NamespaceManager** object using the Azure **CloudConfigurationManager** class
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

There are overloads of the **CreateQueue** method that enable you to tune properties
of the queue (for example, to set the default "time-to-live" value to be applied to messages sent to the queue). These
settings are applied by using the **QueueDescription** class. The
following example shows how to create a queue named "TestQueue" with a
maximum size of 5GB and a default message time-to-live of 1 minute:

	// Configure Queue Settings
    QueueDescription qd = new QueueDescription("TestQueue");
    qd.MaxSizeInMegabytes = 5120;
    qd.DefaultMessageTimeToLive = new TimeSpan(0, 1, 0);

	// Create a new Queue with custom settings
	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

	var namespaceManager = 
		NamespaceManager.CreateFromConnectionString(connectionString);

    if (!namespaceManager.QueueExists("TestQueue"))
    {
        namespaceManager.CreateQueue(qd);
    }

**Note:** You can use the **QueueExists** method on **NamespaceManager**
objects to check if a queue with a specified name already exists within
a service namespace.

##How to Send Messages to a Queue

To send a message to a Service Bus queue, your application creates a
**QueueClient** object using the connection string.

The code below demonstrates how to create a **QueueClient** object
for the "TestQueue" queue created above using the **CreateFromConnectionString** API call:

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    QueueClient Client = 
		QueueClient.CreateFromConnectionString(connectionString, "TestQueue");

	Client.Send(new BrokeredMessage());

Messages sent to (and received from) Service Bus queues are instances of
the **BrokeredMessage** class. **BrokeredMessage** objects have a set of
standard properties (such as **Label** and **TimeToLive**), a dictionary
that is used to hold custom application specific properties, and a body
of arbitrary application data. An application can set the body of the
message by passing any serializable object into the constructor of the
**BrokeredMessage**, and the appropriate **DataContractSerializer** will
then be used to serialize the object. Alternatively, a
**System.IO.Stream** can be provided.

The following example demonstrates how to send five test messages to the
"TestQueue" **QueueClient** obtained in the code snippet above:

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
upper limit of 5 GB.

##How to Receive Messages from a Queue

The easiest way to receive messages from a queue is to use a
**QueueClient** object. These objects can work in two
different modes: **ReceiveAndDelete** and **PeekLock**.

When using the **ReceiveAndDelete** mode, the receive is a single-shot
operation - that is, when the Service Bus receives a read request for a
message in a queue, it marks the message as consumed, and returns
it to the application. **ReceiveAndDelete** mode is the simplest model
and works best for scenarios in which an application can tolerate not
processing a message in the event of a failure. To understand this,
consider a scenario in which the consumer issues the receive request and
then crashes before processing it. Because the Service Bus will have marked
the message as being consumed, when the application restarts and
begins consuming messages again, it will have missed the message that
was consumed prior to the crash.

In **PeekLock** mode (which is the default mode), the receive becomes a two-stage operation, which makes it possible to support applications that
cannot tolerate missing messages. When the Service Bus receives a request,
it finds the next message to be consumed, locks it to prevent other
consumers receiving it, and then returns it to the application. After
the application finishes processing the message (or stores it reliably
for future processing), it completes the second stage of the receive
process by calling **Complete** on the received message. When the Service
Bus sees the **Complete** call, it marks the message as being
consumed and removes it from the queue.

The example below demonstrates how messages can be received and
processed using the default **PeekLock** mode. To specify a different **ReceiveMode** value, you can use another overload for **CreateFromConnectionString**. This example creates an infinite loop and processes messages as they arrive into the "TestQueue":

    Client.Receive();
     
    // Continuously process messages sent to the "TestQueue" 
    while (true) 
    {  
       BrokeredMessage message = Client.Receive();

       if (message != null)
       {
          try 
          {
             Console.WriteLine("Body: " + message.GetBody<string>());
             Console.WriteLine("MessageID: " + message.MessageId);
             Console.WriteLine("Test Property: " + 
				message.Properties["TestProperty"]);

             // Remove message from queue
             message.Complete();
          }
          catch (Exception)
          {
             // Indicate a problem, unlock message in queue
             message.Abandon();
          }
       }
    } 

##How to Handle Application Crashes and Unreadable Messages

The Service Bus provides functionality to help you gracefully recover from
errors in your application or difficulties processing a message. If a
receiver application is unable to process the message for some reason,
then it can call the **Abandon** method on the received message (instead
of the **Complete** method). This will cause the Service Bus to unlock the
message within the queue and make it available to be received again,
either by the same consuming application or by another consuming
application.

There is also a timeout associated with a message locked within the
queue, and if the application fails to process the message before the
lock timeout expires (for example, if the application crashes), then the Service
Bus unlocks the message automatically and makes it available to be
received again.

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

##Next Steps

Now that you've learned the basics of Service Bus queues, follow these
links to learn more.

-   See the MSDN Reference: [Queues, Topics, and Subscriptions.][]
-   Build a working application that sends and receives messages to and
    from a Service Bus queue: [Service Bus Brokered Messaging .NET
    Tutorial].

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
  [Queue Concepts]: ./media/service-bus-dotnet-how-to-use-queues/sb-queues-08.png
  [Azure Management Portal]: http://manage.windowsazure.com
  
  
  
  
  
  
  [7]: ./media/service-bus-dotnet-how-to-use-queues/getting-started-multi-tier-13.png
  [Queues, Topics, and Subscriptions.]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367516.aspx
  [Service Bus Brokered Messaging .NET Tutorial]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367512.aspx
