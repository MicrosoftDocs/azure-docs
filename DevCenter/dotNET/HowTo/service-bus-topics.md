<properties umbraconavihide="0" pagetitle="Service Bus Topics - How To - .NET - Develop" metakeywords="Get started Azure Service Bus topics, Get Started Service Bus topics, Azure publish subscribe messaging, Azure messaging topics and subscriptions, Azure Service Bus topic, Service Bus topic, Azure messaging topics and subscriptions .NET, Azure Service Bus topic .NET, Service Bus topic .NET, Azure messaging topics and subscriptions C#, Azure Service Bus topic C#, Service Bus topic C#" metadescription="Get Started with Windows Azure Service Bus topics and subscriptions, including creating topics and subscriptions, creating subscription filters, sending messages to a topic, receiving messages from a subscription, and deleting topics and subscriptions." linkid="dev-net-how-to-service-bus-topics" urldisplayname="Service Bus Topics" headerexpose="" footerexpose="" disquscomments="1"></properties>

# How to Use Service Bus Topics/Subscriptions

<span>This guide will show you how to use Service Bus topics and
subscriptions. The samples are written in C\# and use the .NET API. The
scenarios covered include **creating topics and subscriptions, creating
subscription filters, sending messages** to a topic, **receiving
messages from a subscription**, and **deleting topics and
subscriptions**. For more information on topics and subscriptions, see
the [Next Steps][] section. </span>

## Table of Contents

-   [What are Service Bus Topics and Subscriptions][]
-   [Create a Service Namespace][]
-   [Obtain the Default Management Credentials for the Namespace][]
-   [Configure Your Application to Use Service Bus][]
-   [How to: Create a Security Token Provider][]
-   [How to: Create a Topic][]
-   [How to: Create Subscriptions][]
-   [How to: Send Messages to a Topic][]
-   [How to: Receive Messages from a Subscription][]
-   [How to: Handle Application Crashes and Unreadable Messages][]
-   [How to: Delete Topics and Subscriptions][]
-   [Next Steps][1]

## <a name="what-is"> </a>What are Service Bus Topics and Subscriptions

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

## <a name="create-namespace"> </a>Create a Service Namespace

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
    ![][0]

4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.   
    ![][2]

5.  After making sure the **Namespace** name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same **Country/Region** in which you are deploying
    your compute resources), and then click the **Create Namespace**
    button.

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
moving on.

## <a name="obtain-creds"> </a>Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a topic or
subscription, on the new namespace, you need to obtain the management
credentials for the namespace.

1.  In the left navigation pane, click the **Service Bus** node to
    display the list of available namespaces:   
    ![][0]

2.  Select the namespace you just created from the list shown:   
    ![][3]

3.  The right-hand **Properties** pane will list the properties for the
    new namespace:   
    ![][4]

4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![][5]

5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

## <a name="configure-app"> </a>Configure Your Application to Use Service Bus

When you create an application that uses Service Bus, you will need to
add a reference to the Service Bus assembly and include the
corresponding namespaces.

### Add a Reference to the Service Bus Assembly

1.  In Visual Studio's **Solution Explorer**, right-click
    **References**, and then click **Add Reference**.

2.  In the **Browse** tab, go to C:\\Program Files\\Microsoft SDKs\\Windows Azure\\.NET SDK\\2012-06\\ref and add a **Microsoft.ServiceBus.dll** reference.

### Import the Service Bus Namespaces

Add the following to the top of any C\# file where you want to use
Service Bus topics and subscriptions:

     using Microsoft.ServiceBus;
     using Microsoft.ServiceBus.Messaging;

You are now ready to write code against Service Bus.

## <a name="create-provider"> </a>How to Set Up a Service Bus Connection String

The Service Bus uses a connection string to store endpoints and credentials. You can put your connection string in a configuration file, rather than hard-coding it in code:

- When using Windows Azure Cloud Services, it is recommended you store your connection string using the Windows Azure service configuration system (`*.csdef` and `*.cscfg` files).
- When using Windows Azure Web Sites or Windows Azure Virtual Machines, it is recommended you store your connection string using the .NET configuration system (e.g. `web.config` file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method as shown later in this guide.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Windows Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Windows Azure Management Portal without redeploying your
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
						 value="Endpoint=sb://[yourServiceNamespace].servicebus.windows.net/;SharedSecretIssuer=[issuerName];SharedSecretValue=[yourDefaultKey]" />
			</ConfigurationSettings>
		</Role>
	...
	</ServiceConfiguration>

Use the issuer and key values retrieved from the Management Portal as
described in the previous section.

### Configuring your connection string when using Web Sites or Virtual Machines

When using Web Sites or Virtual Machines, it is recommended you use the .NET configuration system (e.g. `web.config`).  You store the connection string using the `<appSettings>` element:

	<configuration>
	    <appSettings>
		    <add key="Microsoft.ServiceBus.ConnectionString"
			     value="Endpoint=sb://[yourServiceNamespace].servicebus.windows.net/;SharedSecretIssuer=[issuerName];SharedSecretValue=[yourDefaultKey]" />
		</appSettings>
	</configuration>

Use the issuer and key values retrieved from the Management Portal as
described in the previous section.

## <a name="create-topic"> </a>How to Create a Topic

Management operations for Service Bus topics and subscriptions can be performed via the
**NamespaceManager** class. The **NamespaceManager** class provides methods to create, enumerate, and delete queues. 

In this example, a **NamespaceManager** object is constructed by using the Windows Azure **CloudConfigurationManager** class
with a connection string consisting of the base address of a Service Bus namespace and the appropriate
credentials with permissions to manage it. This connection string is of the form
`Endpoint=sb://<yourServiceNamespace>.servicebus.windows.net/;SharedSecretIssuer=<issuerName>;SharedSecretValue=<yourDefaultKey>`. For example, given the configuration settings in the previous section:

	// Create the topic if it does not exist already
	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");
	var namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic("TestTopic");
    }

There are overloads of the **CreateTopic** method that allow properties
of the topic to be tuned, for example, to set the default time-to-live
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
	var namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
    if (!namespaceManager.TopicExists("TestTopic"))
    {
        namespaceManager.CreateTopic("TestTopic");
    }

**Note:** You can use the **TopicExists** method on **NamespaceManager**
objects to check if a topic with a specified name already exists within
a service namespace.

## <a name="create-subscriptions"> </a>How to Create Subscriptions

Topic subscriptions are also created with the **NamespaceManager**
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
	var namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
    if (!namespaceManager.SubscriptionExists("TestTopic", "AllMessages"))
    {
        namespaceManager.CreateSubscription("TestTopic", "AllMessages");
    }

### Create Subscriptions with Filters

You can also set up filters that allow you to scope which messages sent
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
     SqlFilter highMessages = new SqlFilter("MessageNumber > 3");
     namespaceManager.CreateSubscription("TestTopic", "HighMessages", highMessages);

Similarly, the following example creates a subscription named
"LowMessages" with a **SqlFilter** that only selects messages that have
a **MessageNumber** property less than or equal to 3:

     // Create a "LowMessages" filtered subscription
     SqlFilter lowMessages = new SqlFilter("MessageNumber <= 3");
     namespaceManager.CreateSubscription("TestTopic", "LowMessages", lowMessages);

Now when a message is sent to "TestTopic", it will always be
delivered to receivers subscribed to the "AllMessages" topic
subscription, and selectively delivered to receivers subscribed to the
"HighMessages" and "LowMessages" topic subscriptions (depending upon the
message content).

## <a name="send-messages"> </a>How to Send Messages to a Topic

To send a message to a Service Bus topic, your application will create a
**TopicClient** object using the connection string.

The code below demonstrates how to create a **TopicClient** object
for the "TestTopic" topic created above using the **CreateFromConnectionString** API call:

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

   	TopicClient Client = TopicClient.CreateFromConnectionString(connectionString, "TestTopic");
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
       BrokeredMessage message = new BrokeredMessage("Test message " + i);

       // Set additional custom app-specific property
       message.Properties["MessageNumber"] = i;

       // Send message to the topic
       Client.Send(message);
     }

Service Bus topics support a maximum message size of 256 MB (the header,
which includes the standard and custom application properties, can have
a maximum size of 64 MB). There is no limit on the number of messages
held in a topic but there is a cap on the total size of the messages
held by a topic. This queue size is defined at creation time, with an
upper limit of 5 GB.

## <a name="receive-messages"> </a>How to Receive Messages from a Subscription

The simplest way to receive messages from a subscription is to use a
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
processed using the default **PeekLock** mode. The example below
creates an infinite loop and processes messages as they arrive to the
"HighMessages" subscription. Note that the path to the "HighMessages"
subscription is supplied in the form "<*topic
path*\>/subscriptions/<*subscription name*\>".

	string connectionString = 
	    CloudConfigurationManager.GetSetting("Microsoft.ServiceBus.ConnectionString");

    SubscriptionClient Client = SubscriptionClient.CreateFromConnectionString
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
             Console.WriteLine("MessageNumber: " + message.Properties["MessageNumber"]);

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

## <a name="handle-crashes"> </a>How to Handle Application Crashes and Unreadable Messages

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

## <a name="delete-topics"> </a>How to Delete Topics and Subscriptions

The example below demonstrates how to delete the topic named
**TestTopic** from the **HowToSample** service namespace:

     // Delete Topic
     namespaceManager.DeleteTopic("TestTopic");

Deleting a topic will also delete any subscriptions that are registered
with the topic. Subscriptions can also be deleted independently. The
following code demonstrates how to delete a subscription named
**HighMessages** from the **TestTopic** topic:

      namespaceManager.DeleteSubscription("TestTopic", "HighMessages");

## <a name="next-steps"> </a> <a name="nextsteps"> </a>Next Steps

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
  [How to: Create a Security Token Provider]: #create-provider
  [How to: Create a Topic]: #create-topic
  [How to: Create Subscriptions]: #create-subscriptions
  [How to: Send Messages to a Topic]: #send-messages
  [How to: Receive Messages from a Subscription]: #receive-messages
  [How to: Handle Application Crashes and Unreadable Messages]: #handle-crashes
  [How to: Delete Topics and Subscriptions]: #delete-topics
  [1]: #next-steps
  [Topic Concepts]: ../../../DevCenter/dotNet/Media/sb-topics-01.png
  [Windows Azure Management Portal]: http://windows.azure.com
  [0]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [4]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [5]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
  [SqlFilter.SqlExpression]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.sqlexpression.aspx
  [Queues, Topics, and Subscriptions]: http://msdn.microsoft.com/en-us/library/hh367516.aspx
  [SqlFilter]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.servicebus.messaging.sqlfilter.aspx
  [Service Bus Brokered Messaging .NET Tutorial]: http://msdn.microsoft.com/en-us/library/windowsazure/hh367512.aspx
