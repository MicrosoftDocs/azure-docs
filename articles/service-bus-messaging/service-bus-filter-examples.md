---
title: Set subscriptions filters in Azure Service Bus | Microsoft Docs
description: This article provides examples for defining filters and actions on Azure Service Bus topic subscriptions.
ms.topic: how-to
ms.date: 02/28/2023
ms.devlang: csharp
ms.custom: devx-track-dotnet
---

# Set subscription filters (Azure Service Bus)
This article provides a few examples on setting filters on subscriptions for Service Bus topics. For conceptual information about filters, see [Filters](topic-filters.md).

## Filter on system properties
To refer to a system property in a filter, use the following format: `sys.<system-property-name>`. 

```csharp
sys.label LIKE '%bus%'
sys.messageid = 'xxxx'
sys.correlationid like 'abc-%'
```

> [!NOTE]
> - For a list of system properties, see [Messages, payloads, and serialization](service-bus-messages-payloads.md). 
> - Use system property names from [Microsoft.Azure.ServiceBus.Message](/dotnet/api/microsoft.azure.servicebus.message#properties) in your filters even when you use [ServiceBusMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessage) from the new [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus) namespace to send and receive messages. 
> - `Subject` from [Azure.Messaging.ServiceBus.ServiceBusMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessage) maps to `Label` in [Microsoft.Azure.ServiceBus.Message](/dotnet/api/microsoft.azure.servicebus.message#properties). 

## Filter on message properties
Here are the examples of using application or user properties in a filter. You can access application properties set by using [Azure.Messaging.ServiceBus.ServiceBusMessage.ApplicationProperties](/dotnet/api/azure.messaging.servicebus.servicebusmessage.applicationproperties)) (latest) or user properties set by [Microsoft.Azure.ServiceBus.Message.UserProperty](/dotnet/api/microsoft.azure.servicebus.message.userproperties) (deprecated) using the syntax: `user.property-name` or just `property-name`.

```csharp
MessageProperty = 'A'
user.SuperHero like 'SuperMan%'
```

## Filter on message properties with special characters
If the message property name has special characters, use double quotes (`"`) to enclose the property name. For example if the property name is `"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName"`, use the following syntax in the filter. 

```csharp
"http://schemas.microsoft.com/xrm/2011/Claims/EntityLogicalName" = 'account'
```

## Filter on message properties with numeric values
The following examples show how you can use properties with numeric values in filters. 

```csharp
MessageProperty = 1
MessageProperty > 1
MessageProperty > 2.08
MessageProperty = 1 AND MessageProperty2 = 3
MessageProperty = 1 OR MessageProperty2 = 3
```

## Parameter-based filters
Here are a few examples of using parameter-based filters. In these examples, `DataTimeMp` is a message property of type `DateTime` and `@dtParam` is a parameter passed to the filter as a `DateTime` object.

```csharp
DateTimeMp < @dtParam
DateTimeMp > @dtParam

(DateTimeMp2-DateTimeMp1) <= @timespan //@timespan is a parameter of type TimeSpan
DateTimeMp2-DateTimeMp1 <= @timespan
```

## Using IN and NOT IN

```csharp
StoreId IN('Store1', 'Store2', 'Store3')

sys.To IN ('Store5','Store6','Store7') OR StoreId = 'Store8'

sys.To NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8') OR StoreId NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8')
```

For a C# sample, see [Topic Filters sample on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Azure.Messaging.ServiceBus/BasicSendReceiveTutorialwithFilters).


## Correlation filters

### Correlation filter using CorrelationID

```csharp
new CorrelationFilter("Contoso");
```

It filters messages with `CorrelationID` set to `Contoso`. 

> [!NOTE]
> The [CorrelationRuleFilter](/dotnet/api/azure.messaging.servicebus.administration.correlationrulefilter) class in .NET is in the [Azure.Messaging.ServiceBus.Administration](/dotnet/api/azure.messaging.servicebus.administration) namespace. For sample code that shows how to create filters in general using .NET, see [this code on GitHub](https://github.com/Azure/azure-service-bus/blob/master/samples/DotNet/Azure.Messaging.ServiceBus/BasicSendReceiveTutorialwithFilters/BasicSendReceiveTutorialWithFilters/Program.cs#L179).


### Correlation filter using system and user properties

```csharp
var filter = new CorrelationRuleFilter();
filter.Label = "Important";
filter.ReplyTo = "johndoe@contoso.com";
filter.Properties["color"] = "Red";
```

It's equivalent to: `sys.ReplyTo = 'johndoe@contoso.com' AND sys.Label = 'Important' AND color = 'Red'`


## .NET example for creating subscription filters
Here's a .NET C# example that creates the following Service Bus entities:

- Service Bus topic named `topicfiltersampletopic`
- Subscription to the topic named `AllOrders` with a True Rule filter, which is equivalent to a SQL rule filter with expression `1=1`.
- Subscription named `ColorBlueSize10Orders` with a SQL filter expression `color='blue' AND quantity=10`
- Subscription named `ColorRed` with a SQL filter expression `color='red'` and an action 
- Subscription named `HighPriorityRedOrders` with a correlation filter expression `Subject = "red", CorrelationId = "high"`

See the inline code comments for more details. 

```csharp
namespace CreateTopicsAndSubscriptionsWithFilters
{
    using Azure.Messaging.ServiceBus.Administration;
    using System;
    using System.Threading.Tasks;

    public class Program
    {
        // Service Bus Administration Client object to create topics and subscriptions
        static ServiceBusAdministrationClient adminClient;

        // connection string to the Service Bus namespace
        static readonly string connectionString = "<YOUR SERVICE BUS NAMESPACE - CONNECTION STRING>";

        // name of the Service Bus topic
        static readonly string topicName = "topicfiltersampletopic";

        // names of subscriptions to the topic
        static readonly string subscriptionAllOrders = "AllOrders";
        static readonly string subscriptionColorBlueSize10Orders = "ColorBlueSize10Orders";
        static readonly string subscriptionColorRed = "ColorRed";
        static readonly string subscriptionHighPriorityRedOrders = "HighPriorityRedOrders";

        public static async Task Main()
        {
            try
            {

                Console.WriteLine("Creating the Service Bus Administration Client object");
                adminClient = new ServiceBusAdministrationClient(connectionString);
                
                Console.WriteLine($"Creating the topic {topicName}");
                await adminClient.CreateTopicAsync(topicName);

                Console.WriteLine($"Creating the subscription {subscriptionAllOrders} for the topic with a True filter ");
                // Create a True Rule filter with an expression that always evaluates to true
                // It's equivalent to using SQL rule filter with 1=1 as the expression
                await adminClient.CreateSubscriptionAsync(
                        new CreateSubscriptionOptions(topicName, subscriptionAllOrders), 
                        new CreateRuleOptions("AllOrders", new TrueRuleFilter()));


                Console.WriteLine($"Creating the subscription {subscriptionColorBlueSize10Orders} with a SQL filter");
                // Create a SQL filter with color set to blue and quantity to 10
                await adminClient.CreateSubscriptionAsync(
                        new CreateSubscriptionOptions(topicName, subscriptionColorBlueSize10Orders), 
                        new CreateRuleOptions("BlueSize10Orders", new SqlRuleFilter("color='blue' AND quantity=10")));

                Console.WriteLine($"Creating the subscription {subscriptionColorRed} with a SQL filter");
                // Create a SQL filter with color equals to red and a SQL action with a set of statements
                await adminClient.CreateSubscriptionAsync(topicName, subscriptionColorRed);
                // remove the $Default rule
                await adminClient.DeleteRuleAsync(topicName, subscriptionColorRed, "$Default");
                // now create the new rule. notice that user. prefix is used for the user/application property
                await adminClient.CreateRuleAsync(topicName, subscriptionColorRed, new CreateRuleOptions 
                                { 
                                    Name = "RedOrdersWithAction",
                                    Filter = new SqlRuleFilter("user.color='red'"),
                                    Action = new SqlRuleAction("SET quantity = quantity / 2; REMOVE priority;SET sys.CorrelationId = 'low';")

                                }
                );

                Console.WriteLine($"Creating the subscription {subscriptionHighPriorityRedOrders} with a correlation filter");
                // Create a correlation filter with color set to Red and priority set to High
                await adminClient.CreateSubscriptionAsync(
                        new CreateSubscriptionOptions(topicName, subscriptionHighPriorityRedOrders), 
                        new CreateRuleOptions("HighPriorityRedOrders", new CorrelationRuleFilter() {Subject = "red", CorrelationId = "high"} ));

                // delete resources
                //await adminClient.DeleteTopicAsync(topicName);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }
    }
}
```

## .NET example for sending receiving messages 

```csharp
namespace SendAndReceiveMessages
{
    using System;
    using System.Text;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    using Newtonsoft.Json;
    
    public class Program 
    {
        const string TopicName = "TopicFilterSampleTopic";
        const string SubscriptionAllMessages = "AllOrders";
        const string SubscriptionColorBlueSize10Orders = "ColorBlueSize10Orders";
        const string SubscriptionColorRed = "ColorRed";
        const string SubscriptionHighPriorityOrders = "HighPriorityRedOrders";

        // connection string to your Service Bus namespace
        static string connectionString = "<YOUR SERVICE BUS NAMESPACE - CONNECTION STRING>";

        // the client that owns the connection and can be used to create senders and receivers
        static ServiceBusClient client;

        // the sender used to publish messages to the topic
        static ServiceBusSender sender;

        // the receiver used to receive messages from the subscription 
        static ServiceBusReceiver receiver;

        public async Task SendAndReceiveTestsAsync(string connectionString)
        {
            // This sample demonstrates how to use advanced filters with ServiceBus topics and subscriptions.
            // The sample creates a topic and 3 subscriptions with different filter definitions.
            // Each receiver will receive matching messages depending on the filter associated with a subscription.

            // Send sample messages.
            await this.SendMessagesToTopicAsync(connectionString);

            // Receive messages from subscriptions.
            await this.ReceiveAllMessageFromSubscription(connectionString, SubscriptionAllMessages);
            await this.ReceiveAllMessageFromSubscription(connectionString, SubscriptionColorBlueSize10Orders);
            await this.ReceiveAllMessageFromSubscription(connectionString, SubscriptionColorRed);
            await this.ReceiveAllMessageFromSubscription(connectionString, SubscriptionHighPriorityOrders);
        }


        async Task SendMessagesToTopicAsync(string connectionString)
        {
            // Create the clients that we'll use for sending and processing messages.
            client = new ServiceBusClient(connectionString);
            sender = client.CreateSender(TopicName);

            Console.WriteLine("\nSending orders to topic.");

            // Now we can start sending orders.
            await Task.WhenAll(
                SendOrder(sender, new Order()),
                SendOrder(sender, new Order { Color = "blue", Quantity = 5, Priority = "low" }),
                SendOrder(sender, new Order { Color = "red", Quantity = 10, Priority = "high" }),
                SendOrder(sender, new Order { Color = "yellow", Quantity = 5, Priority = "low" }),
                SendOrder(sender, new Order { Color = "blue", Quantity = 10, Priority = "low" }),
                SendOrder(sender, new Order { Color = "blue", Quantity = 5, Priority = "high" }),
                SendOrder(sender, new Order { Color = "blue", Quantity = 10, Priority = "low" }),
                SendOrder(sender, new Order { Color = "red", Quantity = 5, Priority = "low" }),
                SendOrder(sender, new Order { Color = "red", Quantity = 10, Priority = "low" }),
                SendOrder(sender, new Order { Color = "red", Quantity = 5, Priority = "low" }),
                SendOrder(sender, new Order { Color = "yellow", Quantity = 10, Priority = "high" }),
                SendOrder(sender, new Order { Color = "yellow", Quantity = 5, Priority = "low" }),
                SendOrder(sender, new Order { Color = "yellow", Quantity = 10, Priority = "low" })
                );

            Console.WriteLine("All messages sent.");
        }

        async Task SendOrder(ServiceBusSender sender, Order order)
        {
            var message = new ServiceBusMessage(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(order)))
            {
                CorrelationId = order.Priority,
                Subject = order.Color,
                ApplicationProperties =
                {
                    { "color", order.Color },
                    { "quantity", order.Quantity },
                    { "priority", order.Priority }
                }
            };
            await sender.SendMessageAsync(message);

            Console.WriteLine("Sent order with Color={0}, Quantity={1}, Priority={2}", order.Color, order.Quantity, order.Priority);
        }

        async Task ReceiveAllMessageFromSubscription(string connectionString, string subsName)
        {
            var receivedMessages = 0;

            receiver = client.CreateReceiver(TopicName, subsName, new ServiceBusReceiverOptions() { ReceiveMode = ServiceBusReceiveMode.ReceiveAndDelete } );
            
            // Create a receiver from the subscription client and receive all messages.
            Console.WriteLine("\nReceiving messages from subscription {0}.", subsName);

            while (true)
            {
                var receivedMessage = await receiver.ReceiveMessageAsync(TimeSpan.FromSeconds(10));
                if (receivedMessage != null)
                {
                    foreach (var prop in receivedMessage.ApplicationProperties)
                    {
                        Console.Write("{0}={1},", prop.Key, prop.Value);
                    }
                    Console.WriteLine("CorrelationId={0}", receivedMessage.CorrelationId);
                    receivedMessages++;
                }
                else
                {
                    // No more messages to receive.
                    break;
                }
            }
            Console.WriteLine("Received {0} messages from subscription {1}.", receivedMessages, subsName);
        }

       public static async Task Main()
        {
            try
            {
                Program app = new Program();
                await app.SendAndReceiveTestsAsync(connectionString);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }
    }

    class Order
    {
        public string Color
        {
            get;
            set;
        }

        public int Quantity
        {
            get;
            set;
        }

        public string Priority
        {
            get;
            set;
        }
    }
}
```


## Next steps
See the following samples: 

- [Managing rules](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample12_ManagingRules.md).  
- [.NET - Basic send and receive tutorial with filters](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/BasicSendReceiveTutorialwithFilters/BasicSendReceiveTutorialWithFilters). This sample uses the old `Microsoft.Azure.ServiceBus` package. See the [Migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md) to learn how to migrate from using the old SDK to new SDK (`Azure.Messaging.ServiceBus`).
- [.NET - Topic filters](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/Microsoft.Azure.ServiceBus/TopicFilters). This sample uses the old `Microsoft.Azure.ServiceBus` package.
- [Azure Resource Manager template](/azure/templates/microsoft.servicebus/2017-04-01/namespaces/topics/subscriptions/rules)


Try the samples in the language of your choice to explore Azure Service Bus features. 

- [Azure Service Bus client library samples for .NET (latest)](/samples/azure/azure-sdk-for-net/azuremessagingservicebus-samples/)
- [Azure Service Bus client library samples for Java (latest)](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Azure Service Bus client library samples for Python](/samples/azure/azure-sdk-for-python/servicebus-samples/)
- [Azure Service Bus client library samples for JavaScript](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [Azure Service Bus client library samples for TypeScript](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
