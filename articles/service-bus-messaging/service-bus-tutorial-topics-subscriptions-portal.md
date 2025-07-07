---
title: 'Tutorial: Update inventory using Azure portal and topics/subscriptions'
description: In this tutorial, you learn how to send and receive messages from a topic and subscription, and how to add and use filter rules using .NET.
author: spelluru
ms.author: spelluru
ms.date: 06/18/2025
ms.topic: tutorial
ms.custom: devx-track-csharp, devx-track-dotnet
#Customer intent: In a retail scenario, how do I update inventory assortment and send a set of messages from the back office to the stores?
---

# Tutorial: Update inventory using Azure portal and topics/subscriptions

This tutorial shows how to use Service Bus topics and subscriptions in a retail inventory scenario. It includes publish/subscribe channels using the Azure portal and .NET. An example of this scenario is an inventory assortment update for multiple retail stores. In this scenario, each store, or set of stores, gets messages intended for them to update their assortments. 

Azure Service Bus is a multiple tenant cloud messaging service that sends information between applications and services. Asynchronous operations give you flexible, brokered messaging, along with structured first-in, first-out (FIFO) messaging, and publish/subscribe capabilities. For an overview, see [What is Service Bus?](service-bus-messaging-overview.md) 

This tutorial shows how to implement this scenario using subscriptions and filters. First, you create a topic with three subscriptions, add some rules and filters, and then send and receive messages from the topic and subscriptions.

:::image type="content" source="./media/service-bus-tutorial-topics-subscriptions-portal/about-service-bus-topic.png" alt-text="Diagram showing a sender, a topic with three subscriptions, and three receivers.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a Service Bus topic and three subscriptions to that topic using the Azure portal
> - Add filters for subscriptions using .NET code
> - Create messages with different content
> - Send messages and verify that they arrived in the expected subscriptions
> - Receive messages from the subscriptions

## Prerequisites

To complete this tutorial, make sure you have:

- An Azure subscription. To use Azure services, including Azure Service Bus, you need a subscription. You can create a [free account][] before you begin.
- [Visual Studio 2019](https://www.visualstudio.com/vs) or later.

## Service Bus topics and subscriptions

Each [subscription to a topic](service-bus-messaging-overview.md#topics) can receive a copy of each message. Topics are fully protocol and semantically compatible with Service Bus queues. Service Bus topics support a wide array of selection rules with filter conditions, with optional actions that set or modify message properties. Each time a rule matches, it produces a message. To learn more about rules, filters, and actions, see [Topic filters and actions](topic-filters.md).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [get-namespace-connection-string](./includes/get-namespace-connection-string.md)]

[!INCLUDE [service-bus-create-topics-three-subscriptions-portal](./includes/service-bus-create-topics-three-subscriptions-portal.md)]

## Create filter rules on subscriptions

After you provision the namespace, topics, and subscriptions, and get the connection string to the namespace, you're ready to create filter rules on the subscriptions. After that, send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/azure-servicebus/TopicFilters).

## Send and receive messages

To run the code, follow these steps:

1. In a Command Prompt window or at a PowerShell prompt, clone the [Service Bus GitHub repository](https://github.com/Azure/azure-service-bus/):

   ```shell
   git clone https://github.com/Azure/azure-service-bus.git
   ```

1. Navigate to the sample folder `azure-service-bus\samples\DotNet\Azure.Messaging.ServiceBus\BasicSendReceiveTutorialWithFilters`.

1. Get the connection string you copied to Notepad earlier in this tutorial. You also need the name of the topic you created.

1. At the command prompt, type the following command:

   ```shell
   dotnet build
   ```

1. Navigate to the `BasicSendReceiveTutorialWithFilters\bin\Debug\netcoreapp3.1` folder.

1. To run the program, enter the following command. Be sure to replace `myConnectionString` with your value  and `myTopicName` with the name of the topic you created:

   ```shell
   dotnet --roll-forward Major BasicSendReceiveTutorialWithFilters.dll -ConnectionString "myConnectionString" -TopicName "myTopicName"
   ``` 

1. Follow the instructions in the console to select filter creation first. Part of creating filters is to remove the default filters. When you use PowerShell or CLI, you don't need to remove the default filter. If you use code to create filters, first remove the default filter. The console commands 1 and 3 help you manage the filters on the subscriptions you previously created:

   - Execute 1: to remove the default filters.
   - Execute 2: to add your own filters.
   - Execute 3: **Skip this step for the tutorial**. This option optionally removes your own filters. It doesn't recreate the default filters.

   :::image type="content" source="./media/service-bus-tutorial-topics-subscriptions-portal/create-rules.png" alt-text="Screenshot shows the output of command 2.":::

1. After filter creation, you can send messages. Press 4 and observe 10 messages being sent to the topic:

   :::image type="content" source="./media/service-bus-tutorial-topics-subscriptions-portal/send-output.png" alt-text="Screenshot shows the result of 10 messages being sent.":::

1. Press 5 and observe the messages being received. If you didn't get 10 messages back, press "m" to display the menu, then press 5 again.

    :::image type="content" source="./media/service-bus-tutorial-topics-subscriptions-portal/receive-output.png" alt-text="Screenshot shows the received messages output.":::

## Clean up resources

When no longer needed, follow these steps to clean up resources.

1. Navigate to your namespace in the Azure portal. 
1. On the **Service Bus Namespace** page, select **Delete** from the command bar to delete the namespace and resources (queues, topics, and subscriptions) in it. 

## Understand the sample code

This section contains more details about what the sample code does.

### Get connection string and topic

First, the code declares a set of variables, which drive the remaining execution of the program.

```csharp
string ServiceBusConnectionString;
string TopicName;

static string[] Subscriptions = { "S1", "S2", "S3" };
static IDictionary<string, string[]> SubscriptionFilters = new Dictionary<string, string[]> {
    { "S1", new[] { "StoreId IN('Store1', 'Store2', 'Store3')", "StoreId = 'Store4'"} },
    { "S2", new[] { "sys.To IN ('Store5','Store6','Store7') OR StoreId = 'Store8'" } },
    { "S3", new[] { "sys.To NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8') OR StoreId NOT IN ('Store1','Store2','Store3','Store4','Store5','Store6','Store7','Store8')" } }
};
// You can have only have one action per rule and this sample code supports only one action for the first filter, which is used to create the first rule. 
static IDictionary<string, string> SubscriptionAction = new Dictionary<string, string> {
    { "S1", "" },
    { "S2", "" },
    { "S3", "SET sys.Label = 'SalesEvent'"  }
};
static string[] Store = { "Store1", "Store2", "Store3", "Store4", "Store5", "Store6", "Store7", "Store8", "Store9", "Store10" };
static string SysField = "sys.To";
static string CustomField = "StoreId";
static int NrOfMessagesPerStore = 1; // Send at least 1.
```

The connection string and topic name are passed in by using command line parameters as shown. They're read in the `Main()` method:

```csharp
static void Main(string[] args)
{
    string ServiceBusConnectionString = "";
    string TopicName = "";

    for (int i = 0; i < args.Length; i++)
    {
        if (args[i] == "-ConnectionString")
        {
            Console.WriteLine($"ConnectionString: {args[i + 1]}");
            ServiceBusConnectionString = args[i + 1]; // Alternatively enter your connection string here.
        }
        else if (args[i] == "-TopicName")
        {
            Console.WriteLine($"TopicName: {args[i + 1]}");
            TopicName = args[i + 1]; // Alternatively enter your queue name here.
        }
    }

    if (ServiceBusConnectionString != "" && TopicName != "")
    {
        Program P = StartProgram(ServiceBusConnectionString, TopicName);
        P.PresentMenu().GetAwaiter().GetResult();
    }
    else
    {
        Console.WriteLine("Specify -Connectionstring and -TopicName to execute the example.");
        Console.ReadKey();
    }
}
```

### Remove default filters

When you create a subscription, Service Bus creates a default filter per subscription. This filter enables receiving every message sent to the topic. If you want to use custom filters, you can remove the default filter, as shown in the following code:

```csharp
private async Task RemoveDefaultFilters()
{
    Console.WriteLine($"Starting to remove default filters.");

    try
    {
        var client = new ServiceBusAdministrationClient(ServiceBusConnectionString);
        foreach (var subscription in Subscriptions)
        {
            await client.DeleteRuleAsync(TopicName, subscription, CreateRuleOptions.DefaultRuleName);
            Console.WriteLine($"Default filter for {subscription} has been removed.");
        }

        Console.WriteLine("All default Rules have been removed.\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
    }

    await PresentMenu();
}
```

### Create filters

The following code adds the custom filters defined in this tutorial:

```csharp
private async Task CreateCustomFilters()
{
    try
    {
        for (int i = 0; i < Subscriptions.Length; i++)
        {
            var client = new ServiceBusAdministrationClient(ServiceBusConnectionString);
            string[] filters = SubscriptionFilters[Subscriptions[i]];
            if (filters[0] != "")
            {
                int count = 0;
                foreach (var myFilter in filters)
                {
                    count++;

                    string action = SubscriptionAction[Subscriptions[i]];
                    if (action != "")
                    {
                        await client.CreateRuleAsync(TopicName, Subscriptions[i], new CreateRuleOptions
                        {
                            Filter = new SqlRuleFilter(myFilter),
                            Action = new SqlRuleAction(action),
                            Name = $"MyRule{count}"
                        });
                    }
                    else
                    {
                        await client.CreateRuleAsync(TopicName, Subscriptions[i], new CreateRuleOptions
                        {
                            Filter = new SqlRuleFilter(myFilter),
                            Name = $"MyRule{count}"
                        });
                    }
                }
            }

            Console.WriteLine($"Filters and actions for {Subscriptions[i]} have been created.");
        }

        Console.WriteLine("All filters and actions have been created.\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
    }

    await PresentMenu();
}
```

### Remove your custom created filters

If you want to remove all filters on your subscription, the following code shows how to do that:

```csharp
private async Task CleanUpCustomFilters()
{
    foreach (var subscription in Subscriptions)
    {
        try
        {
            var client = new ServiceBusAdministrationClient(ServiceBusConnectionString);
            IAsyncEnumerator<RuleProperties> rules = client.GetRulesAsync(TopicName, subscription).GetAsyncEnumerator();
            while (await rules.MoveNextAsync())
            {
                await client.DeleteRuleAsync(TopicName, subscription, rules.Current.Name);
                Console.WriteLine($"Rule {rules.Current.Name} has been removed.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
        }
    }
    Console.WriteLine("All default filters have been removed.\n");

    await PresentMenu();
}
```

### Send messages

Sending messages to a topic is similar to sending messages to a queue. This example shows how to send messages, using a task list and asynchronous processing:

```csharp
public async Task SendMessages()
{
    try
    {
        await using var client = new ServiceBusClient(ServiceBusConnectionString);
        var taskList = new List<Task>();
        for (int i = 0; i < Store.Length; i++)
        {
            taskList.Add(SendItems(client, Store[i]));
        }

        await Task.WhenAll(taskList);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
    }
    Console.WriteLine("\nAll messages sent.\n");
}

private async Task SendItems(ServiceBusClient client, string store)
{
    // create the sender
    ServiceBusSender tc = client.CreateSender(TopicName);

    for (int i = 0; i < NrOfMessagesPerStore; i++)
    {
        Random r = new Random();
        Item item = new Item(r.Next(5), r.Next(5), r.Next(5));

        // Note the extension class which is serializing an deserializing messages
        ServiceBusMessage message = item.AsMessage();
        message.To = store;
        message.ApplicationProperties.Add("StoreId", store);
        message.ApplicationProperties.Add("Price", item.GetPrice().ToString());
        message.ApplicationProperties.Add("Color", item.GetColor());
        message.ApplicationProperties.Add("Category", item.GetItemCategory());

        await tc.SendMessageAsync(message);
        Console.WriteLine($"Sent item to Store {store}. Price={item.GetPrice()}, Color={item.GetColor()}, Category={item.GetItemCategory()}"); ;
    }
}
```

### Receive messages

Messages are again received by using a task list, and the code uses batching. You can send and receive using batching, but this example only shows how to batch receive. In reality, you wouldn't break out of the loop, but keep looping and set a higher time span, such as one minute. The receive call to the broker is kept open for this amount of time. If messages arrive, they're returned immediately. A new receive call is issued. 

This concept is called *long polling*. Using the receive pump, which you can see in several samples in the repository, is a more typical option. For more information, see [Use Azure portal to create a Service Bus namespace and a queue](service-bus-quickstart-portal.md).

```csharp
public async Task Receive()
{
    var taskList = new List<Task>();
    for (var i = 0; i < Subscriptions.Length; i++)
    {
        taskList.Add(this.ReceiveMessages(Subscriptions[i]));
    }

    await Task.WhenAll(taskList);
}

private async Task ReceiveMessages(string subscription)
{
    await using var client = new ServiceBusClient(ServiceBusConnectionString);
    ServiceBusReceiver receiver = client.CreateReceiver(TopicName, subscription);

    // In reality you would not break out of the loop like in this example but would keep looping. The receiver keeps the connection open
    // to the broker for the specified amount of seconds and the broker returns messages as soon as they arrive. The client then initiates
    // a new connection. So in reality you would not want to break out of the loop. 
    // Also note that the code shows how to batch receive, which you would do for performance reasons. For convenience you can also always
    // use the regular receive pump which we show in our Quick Start and in other GitHub samples.
    while (true)
    {
        try
        {
            //IList<Message> messages = await receiver.ReceiveAsync(10, TimeSpan.FromSeconds(2));
            // Note the extension class which is serializing an deserializing messages and testing messages is null or 0.
            // If you think you did not receive all messages, just press M and receive again via the menu.
            IReadOnlyList<ServiceBusReceivedMessage> messages = await receiver.ReceiveMessagesAsync(maxMessages: 100);

            if (messages.Any())
            {
                foreach (ServiceBusReceivedMessage message in messages)
                {
                    lock (Console.Out)
                    {
                        Item item = message.As<Item>();
                        IReadOnlyDictionary<string, object> myApplicationProperties = message.ApplicationProperties;
                        Console.WriteLine($"StoreId={myApplicationProperties["StoreId"]}");
                        if (message.Subject != null)
                        {
                            Console.WriteLine($"Subject={message.Subject}");
                        }
                        Console.WriteLine(
                            $"Item data: Price={item.GetPrice()}, Color={item.GetColor()}, Category={item.GetItemCategory()}");
                    }

                    await receiver.CompleteMessageAsync(message);
                }
            }
            else
            {
                break;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
        }
    }
}
```

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs, and events hubs. 

## Related content

In this tutorial, you provisioned resources using the Azure portal, then sent and received messages from a Service Bus topic and its subscriptions. You learned how to:

> [!div class="checklist"]
> - Create a Service Bus topic and one or more subscriptions to that topic using the Azure portal
> - Add topic filters using .NET code
> - Create two messages with different content
> - Send the messages and verify they arrived in the expected subscriptions
> - Receive messages from the subscriptions

For more examples of sending and receiving messages, see [Service Bus samples on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted).

Advance to the next tutorial to learn more about using the publish/subscribe capabilities of Service Bus.

> [!div class="nextstepaction"]
> [Respond to events via Event Grid](service-bus-to-event-grid-integration-example.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[Azure portal]: https://portal.azure.com/

[connection-string]: ./media/service-bus-tutorial-topics-subscriptions-portal/connection-string.png
[service-bus-flow]: ./media/service-bus-tutorial-topics-subscriptions-portal/about-service-bus-topic.png
