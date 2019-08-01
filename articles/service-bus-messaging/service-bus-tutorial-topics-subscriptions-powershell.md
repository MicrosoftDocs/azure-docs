---
title: Tutorial - Update retail inventory assortment using publish/subscribe channels and topic filters with Azure PowerShell | Microsoft Docs
description: In this tutorial, you learn how to send and receive messages from a topic and subscription, and how to add and use filter rules using Azure PowerShell
services: service-bus-messaging
author: spelluru
manager: timlt

ms.author: spelluru
ms.date: 09/22/2018
ms.topic: tutorial
ms.service: service-bus-messaging
ms.custom: mvc
#Customer intent: In a retail scenario, how do I update inventory assortment and send a set of messages from the back office to the stores?

---

# Tutorial: Update inventory using PowerShell and topics/subscriptions

Microsoft Azure Service Bus is a multi-tenant cloud messaging service that sends information between applications and services. Asynchronous operations give you flexible, brokered messaging, along with structured first-in, first-out (FIFO) messaging, and publish/subscribe capabilities. 

This tutorial shows how to send and receive messages to and from a Service Bus queue, using PowerShell to create a messaging namespace and a queue within that namespace, and to obtain the authorization credentials on that namespace. The procedure then shows how to send and receive messages from this queue using the [.NET Standard library](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus).

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a Service Bus topic and one or more subscriptions to that topic using Azure PowerShell
> * Add topic filters using PowerShell
> * Create two messages with different content
> * Send the messages and verify they arrived in the expected subscriptions
> * Receive messages from the subscriptions

An example of this scenario is an inventory assortment update for multiple retail stores. In this scenario, each store, or set of stores, gets messages intended for them to update their assortments. This tutorial shows how to implement this scenario using subscriptions and filters. First, you create a topic with 3 subscriptions, add some rules and filters, and then send and receive messages from the topic and subscriptions.

![topic](./media/service-bus-tutorial-topics-subscriptions-powershell/about-service-bus-topic.png)

If you do not have an Azure subscription, create a [free account][] before you begin.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

To complete this tutorial, make sure you have installed:

1. [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](https://www.visualstudio.com/vs) or later.
2. [NET Core SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

This tutorial requires that you run the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Sign in to Azure

Issue the following commands to sign in to Azure. These steps are not necessary if you're running PowerShell commands in Cloud Shell: 

1. Install the Service Bus PowerShell module:

   ```azurepowershell-interactive
   Install-Module Az.ServiceBus
   ```

2. Run the following command to sign in to Azure:

   ```azurepowershell-interactive
   Login-AzAccount
   ```

4. Set the current subscription context, or see the currently active subscription:

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "MyAzureSubName" 
   Get-AzContext
   ```

## Provision resources

After signing in to Azure, issue the following commands to provision Service Bus resources. Be sure to replace all placeholders with the appropriate values:

```azurepowershell-interactive
# Create a resource group 
New-AzResourceGroup –Name my-resourcegroup –Location westus2

# Create a Messaging namespace
New-AzServiceBusNamespace -ResourceGroupName my-resourcegroup -NamespaceName namespace-name -Location westus2

# Create a queue 
New-AzServiceBusQueue -ResourceGroupName my-resourcegroup -NamespaceName namespace-name -Name queue-name -EnablePartitioning $False

# Get primary connection string (required in next step)
Get-AzServiceBusKey -ResourceGroupName my-resourcegroup -Namespace namespace-name -Name RootManageSharedAccessKey
```

After the `Get-AzServiceBusKey` cmdlet runs, copy and paste the connection string and the queue name you selected to a temporary location, such as Notepad. You will need it in the next step.

## Send and receive messages

After the namespace and queue are created, and you have the necessary credentials, you are ready to send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/BasicSendReceiveQuickStart).

To run the code, do the following:

1. Clone the [Service Bus GitHub repository](https://github.com/Azure/azure-service-bus/) by issuing the following command:

   ```shell
   git clone https://github.com/Azure/azure-service-bus.git
   ```

2. Open a PowerShell prompt.

3. Navigate to the sample folder `azure-service-bus\samples\DotNet\GettingStarted\BasicSendReceiveQuickStart\BasicSendReceiveQuickStart`.

4. If you have not done so already, obtain the connection string using the following PowerShell cmdlet. Be sure to replace `my-resourcegroup` and `namespace-name` with your specific values: 

   ```azurepowershell-interactive
   Get-AzServiceBusKey -ResourceGroupName my-resourcegroup -Namespace namespace-name -Name RootManageSharedAccessKey
   ```
5. At the PowerShell prompt, type the following command:

   ```shell
   dotnet build
   ```
6. Navigate to the `\bin\Debug\netcoreapp2.0` folder.
7. Type the following command to run the program. Be sure to replace `myConnectionString` with the value you previously obtained, and `myQueueName` with the name of the queue you created:

   ```shell
   dotnet BasicSendReceiveQuickStart.dll -ConnectionString "myConnectionString" -QueueName "myQueueName"
   ``` 
8. Observe 10 messages being sent to the queue, and subsequently received from the queue:

   ![program output](./media/service-bus-quickstart-powershell/dotnet.png)

## Clean up resources

Run the following command to remove the resource group, namespace, and all related resources:

```powershell-interactive
Remove-AzResourceGroup -Name my-resourcegroup
```

## Understand the sample code

This section contains more details about what the sample code does. 

### Get connection string and queue

The connection string and queue name are passed to the `Main()` method as command line arguments. `Main()` declares two string variables to hold these values:

```csharp
static void Main(string[] args)
{
    string ServiceBusConnectionString = "";
    string QueueName = "";

    for (int i = 0; i < args.Length; i++)
    {
        var p = new Program();
        if (args[i] == "-ConnectionString")
        {
            Console.WriteLine($"ConnectionString: {args[i+1]}");
            ServiceBusConnectionString = args[i + 1]; 
        }
        else if(args[i] == "-QueueName")
        {
            Console.WriteLine($"QueueName: {args[i+1]}");
            QueueName = args[i + 1];
        }                
    }

    if (ServiceBusConnectionString != "" && QueueName != "")
        MainAsync(ServiceBusConnectionString, QueueName).GetAwaiter().GetResult();
    else
    {
        Console.WriteLine("Specify -Connectionstring and -QueueName to execute the example.");
        Console.ReadKey();
    }                            
}
```
 
The `Main()` method then starts the asynchronous message loop, `MainAsync()`.

### Message loop

The `MainAsync()` method creates a queue client with the command line arguments, calls a receiving message handler named `RegisterOnMessageHandlerAndReceiveMessages()`, and sends the set of messages:

```csharp
static async Task MainAsync(string ServiceBusConnectionString, string QueueName)
{
    const int numberOfMessages = 10;
    queueClient = new QueueClient(ServiceBusConnectionString, QueueName);

    Console.WriteLine("======================================================");
    Console.WriteLine("Press any key to exit after receiving all the messages.");
    Console.WriteLine("======================================================");

    // Register QueueClient's MessageHandler and receive messages in a loop
    RegisterOnMessageHandlerAndReceiveMessages();

    // Send Messages
    await SendMessagesAsync(numberOfMessages);

    Console.ReadKey();

    await queueClient.CloseAsync();
}
```

The `RegisterOnMessageHandlerAndReceiveMessages()` method sets a few message handler options, then calls the queue client's `RegisterMessageHandler()` method, which starts the receiving:

```csharp
static void RegisterOnMessageHandlerAndReceiveMessages()
{
    // Configure the MessageHandler Options in terms of exception handling, number of concurrent messages to deliver etc.
    var messageHandlerOptions = new MessageHandlerOptions(ExceptionReceivedHandler)
    {
        // Maximum number of Concurrent calls to the callback `ProcessMessagesAsync`, set to 1 for simplicity.
        // Set it according to how many messages the application wants to process in parallel.
        MaxConcurrentCalls = 1,

        // Indicates whether MessagePump should automatically complete the messages after returning from User Callback.
        // False below indicates the Complete will be handled by the User Callback as in `ProcessMessagesAsync` below.
        AutoComplete = false
    };

    // Register the function that will process messages
    queueClient.RegisterMessageHandler(ProcessMessagesAsync, messageHandlerOptions);
} 
```

### Send messages

The message creation and send operations occur in the `SendMessagesAsync()` method:

```csharp
static async Task SendMessagesAsync(int numberOfMessagesToSend)
{
    try
    {
        for (var i = 0; i < numberOfMessagesToSend; i++)
        {
            // Create a new message to send to the queue
            string messageBody = $"Message {i}";
            var message = new Message(Encoding.UTF8.GetBytes(messageBody));

            // Write the body of the message to the console
            Console.WriteLine($"Sending message: {messageBody}");

            // Send the message to the queue
            await queueClient.SendAsync(message);
        }
    }
    catch (Exception exception)
    {
        Console.WriteLine($"{DateTime.Now} :: Exception: {exception.Message}");
    }
}
```

### Process messages

The `ProcessMessagesAsync()` method acknowledges, processes, and completes the receipt of the messages:

```csharp
static async Task ProcessMessagesAsync(Message message, CancellationToken token)
{
    // Process the message
    Console.WriteLine($"Received message: SequenceNumber:{message.SystemProperties.SequenceNumber} Body:{Encoding.UTF8.GetString(message.Body)}");

    // Complete the message so that it is not received again.
    await queueClient.CompleteAsync(message.SystemProperties.LockToken);
}
```

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps

In this tutorial, you provisioned resources using Azure PowerShell, then sent and received messages from a Service Bus topic and its subscriptions. You learned how to:

> [!div class="checklist"]
> * Create a Service Bus topic and one or more subscriptions to that topic using the Azure portal
> * Add topic filters using .NET code
> * Create two messages with different content
> * Send the messages and verify they arrived in the expected subscriptions
> * Receive messages from the subscriptions

For more examples of sending and receiving messages, get started with the [Service Bus samples on GitHub](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted).

Advance to the next tutorial to learn more about using the publish/subscribe capabilities of Service Bus.

> [!div class="nextstepaction"]
> [Update inventory using PowerShell and topics/subscriptions](service-bus-tutorial-topics-subscriptions-cli.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-Az-ps
