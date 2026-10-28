---
title: Build message-driven applications with NServiceBus and Azure Service Bus
description: Learn how to solve complex problems with distributed systems on Azure Service Bus using the NServiceBus framework.
author: kbaley                      
ms.author: spelluru
ms.topic: how-to                     
ms.date: 03/29/2023                 
ms.custom:
  - template-how-to
  - sfi-ropc-nochange
---


# Build message-driven business applications with NServiceBus and Azure Service Bus

NServiceBus is a commercial messaging framework from Particular Software. It supports Azure Service Bus as a message transport and helps developers focus on business logic by abstracting infrastructure concerns. In this guide, you build a solution that exchanges messages between two services. You also see how NServiceBus automatically retries failing messages and review options for hosting these services in Azure.

> [!NOTE]
> The code for this tutorial is available on the [Particular Software Docs web site](https://docs.particular.net/samples/azure-service-bus-netstandard/send-receive-with-nservicebus/?version=asbs_6). This article describes the version of the sample that uses NServiceBus 10 and the Azure Service Bus transport (`NServiceBus.Transport.AzureServiceBus`) version 6.

## Prerequisites

- The [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
- An [Azure Service Bus namespace](service-bus-quickstart-portal.md#create-a-namespace-in-the-azure-portal).

> [!IMPORTANT]
> NServiceBus requires at least the Standard tier. The Basic tier doesn't support topics, so it won't work.

## Download and prepare the solution

1. Download the code from the [Particular Software Docs web site](https://docs.particular.net/samples/azure-service-bus-netstandard/send-receive-with-nservicebus/?version=asbs_6). Make sure the version selector shows **NServiceBus.Transport.AzureServiceBus 6.x**, and then select **Download sample**. The solution `SendReceiveWithNservicebus.sln` consists of three projects:

    - **Sender**: a console application that sends messages
    - **Receiver**: a console application that receives messages from the sender and replies back
    - **Shared**: a class library containing the message contracts shared between the sender and receiver

    The Sender and Receiver projects target .NET 10 and reference the `NServiceBus` (version 10) and `NServiceBus.Transport.AzureServiceBus` (version 6) NuGet packages. The Shared project references only the lightweight `NServiceBus.MessageInterfaces` package.

    The following sequence diagram shows the message flow between the two endpoints. You can view sequence diagrams like this one for your own systems in [ServicePulse](https://docs.particular.net/servicepulse/sequence-diagram), a monitoring and debugging tool from Particular Software:

    :::image type="content" source="./media/nservicebus/sequence-diagram.png" alt-text="Image showing the sequence diagram":::
1. Open `SendReceiveWithNservicebus.sln` in a code editor that supports .NET 10, for example Visual Studio 2026, Visual Studio Code with the C# Dev Kit, or JetBrains Rider.
1. Open `appsettings.json` in both the Receiver and Sender projects and replace the `<PLACEHOLDER>` value of `AzureServiceBusConnectionString` with the connection string for your Azure Service Bus namespace:

    ```json
    "ConnectionStrings": {
      "AzureServiceBusConnectionString": "<PLACEHOLDER>"
    }
    ```

   - You can find the connection string in the Azure portal under **Service Bus Namespace** > **Settings** > **Shared access policies** > **RootManageSharedAccessKey** > **Primary Connection String**.
   - The `AzureServiceBusTransport` also has a constructor that accepts a fully qualified namespace and a token credential, such as `DefaultAzureCredential`. Microsoft Entra ID authentication is more secure and is recommended for production environments. For simplicity, this tutorial uses the shared access key connection string. For more information, see [token credentials](https://docs.particular.net/transports/azure-service-bus/configuration#connectivity-token-credentials) in the NServiceBus documentation.

## Define the shared message contracts

The Shared class library is where you define the contracts used to send messages. It references the `NServiceBus.MessageInterfaces` NuGet package, which contains interfaces you can use to identify messages. The interfaces aren't required, but they give you extra validation from NServiceBus and make the code self-documenting.

First, review the `Ping.cs` class:

```csharp
using NServiceBus;

namespace Shared;

public class Ping : ICommand
{
    public int Round { get; set; }
}
```

The `Ping` class defines a message that the Sender sends to the Receiver. It's a simple C# class that implements `NServiceBus.ICommand`. This interface signals to the reader and to NServiceBus that the message is a command. There are also other ways to identify messages [without using interfaces](https://docs.particular.net/nservicebus/messaging/conventions).

The other message class in the Shared project is `Pong.cs`:

```csharp
using NServiceBus;

namespace Shared;

public class Pong : IMessage
{
    public required string Acknowledgement { get; set; }
}
```

`Pong` is also a simple C# class, though this one implements `NServiceBus.IMessage`. The `IMessage` interface represents a generic message that's neither a command nor an event, and it's commonly used for replies. In this sample, it's a reply that the Receiver sends back to the Sender to indicate that a message was received.

`Ping` and `Pong` are the two message types you use. The next step is to configure the Sender to use Azure Service Bus and to send `Ping` messages.

## Set up the sender

The Sender is an endpoint that sends `Ping` messages. In this section, you configure the Sender to use Azure Service Bus as the transport, then construct `Ping` instances and send them.

The Sender's `Program.cs` file uses top-level statements to configure and run the endpoint:

```csharp
using Shared;

var builder = Host.CreateApplicationBuilder(args);

var endpointConfiguration = new EndpointConfiguration("Sender");

var connectionString = builder.Configuration.GetConnectionString("AzureServiceBusConnectionString") ?? string.Empty;
var routing = endpointConfiguration.UseTransport(new AzureServiceBusTransport(connectionString, TopicTopology.Default));
endpointConfiguration.UseSerialization<SystemJsonSerializer>();

endpointConfiguration.AuditProcessedMessagesTo("audit");
routing.RouteToEndpoint(typeof(Ping), "Receiver");

// Operational scripting: https://docs.particular.net/transports/azure-service-bus/operational-scripting
endpointConfiguration.EnableInstallers();

builder.Services.AddNServiceBusEndpoint(endpointConfiguration);

using var host = builder.Build();

await host.StartAsync();

var messageSession = host.Services.GetRequiredService<IMessageSession>();

Console.WriteLine("Sending messages... Press [Ctrl] + [C] to cancel");

using (var cts = new CancellationTokenSource())
{
    Console.CancelKeyPress += (s, e) =>
    {
        Console.WriteLine("Cancellation Requested...");
        cts.Cancel();
        e.Cancel = true;
    };

    try
    {
        var number = 1;

        while (true)
        {
            await messageSession.Send(new Ping { Round = number });

            Console.WriteLine($"Sent message #{number}");

            number++;

            await Task.Delay(1_000, cts.Token);
        }
    }
    catch (OperationCanceledException) when (cts.Token.IsCancellationRequested)
    {
        // graceful shutdown
    }
}

await host.StopAsync();
```

There's a lot to unpack here, so let's review it step by step.

> [!NOTE]
> The Sender and Receiver projects enable implicit usings. The `NServiceBus` package adds `NServiceBus` to the implicit usings, and the worker SDK adds the `Microsoft.Extensions.*` hosting, configuration, dependency injection, and logging namespaces. That's why `Program.cs` doesn't need explicit `using` directives for those types.

### Configure a host for the endpoint

Hosting and logging are configured using the standard [.NET Generic Host](/dotnet/core/extensions/generic-host). `Host.CreateApplicationBuilder` creates a host builder with the default logging setup, which writes to the console and applies the `Logging` section of `appsettings.json`. The endpoint runs as a console application, but you can host it in other environments, such as Azure Functions, as discussed later in this article.

### Configure the NServiceBus endpoint

Next, you create an `EndpointConfiguration` for an endpoint named `Sender` and configure it:

- `UseTransport` specifies Azure Service Bus as the transport. The `AzureServiceBusTransport` constructor takes the connection string from `appsettings.json` and a topology. The topology determines how events are published and subscribed to, and it must be passed in explicitly. `TopicTopology.Default` uses the [topic-per-event topology](https://docs.particular.net/transports/azure-service-bus/topology), which creates one Azure Service Bus topic for each event type.
- `UseSerialization<SystemJsonSerializer>` serializes messages as JSON using `System.Text.Json`.
- `AuditProcessedMessagesTo("audit")` sends a copy of every successfully processed message to the `audit` queue. Monitoring tools such as [ServicePulse](https://docs.particular.net/servicepulse/) use the audited messages to visualize message flows.
- `RouteToEndpoint` routes messages of type `Ping` to the endpoint named `Receiver`. Routing lets NServiceBus dispatch the message to its destination without the business code needing to know the receiver's address. It keeps the topology of the system (which messages go to which endpoints) as a separate concern from the business code.

The call to `EnableInstallers` creates the required queues and other entities in the Azure Service Bus namespace when the endpoint starts. In production environments, you can use [operational scripting](https://docs.particular.net/transports/azure-service-bus/operational-scripting) with the `asb-transport` command-line tool to create the entities instead.

Finally, `AddNServiceBusEndpoint` registers the endpoint on the host's service collection. The endpoint starts and stops with the host. For more information, see [Hosting with Microsoft.Extensions.Hosting](https://docs.particular.net/nservicebus/hosting/core-hosting) in the NServiceBus documentation.

### Send messages

After the host is built, `host.StartAsync()` starts the host and the NServiceBus endpoint. The code then resolves `IMessageSession` from the host's service provider. `IMessageSession` lets you send messages with NServiceBus outside of a message handler.

The loop sends a `Ping` message every second and writes a line to the console for each message it sends. The routing you configured earlier determines the destination of each `Ping` message. When you press **Ctrl+C**, the `CancellationTokenSource` is canceled, the loop ends, and `host.StopAsync()` shuts down the endpoint gracefully.

> [!TIP]
> `IMessageSession` is registered in the dependency injection container, so you can also inject it into controllers, background services, and other components that need to send messages.

The Sender application also contains a `PongHandler`. You'll get back to it after you review the Receiver, which is next.

## Set up the receiver

The Receiver is an endpoint that listens for `Ping` messages, logs each message it receives, and replies back to the sender. In this section, you quickly review the endpoint configuration, which is similar to the Sender's, and then turn your attention to the message handler.

Like the sender, the receiver is a console application that uses the .NET Generic Host. Here's the Receiver's `Program.cs`:

```csharp
var builder = Host.CreateApplicationBuilder(args);

var endpointConfiguration = new EndpointConfiguration("Receiver");

var connectionString = builder.Configuration.GetConnectionString("AzureServiceBusConnectionString") ?? string.Empty;
endpointConfiguration.UseTransport(new AzureServiceBusTransport(connectionString, TopicTopology.Default));
endpointConfiguration.UseSerialization<SystemJsonSerializer>();

endpointConfiguration.AuditProcessedMessagesTo("audit");

// Operational scripting: https://docs.particular.net/transports/azure-service-bus/operational-scripting
endpointConfiguration.EnableInstallers();

builder.Services.AddNServiceBusEndpoint(endpointConfiguration);

var host = builder.Build();

await host.RunAsync();
```

It uses the same host and transport configuration, but with a different endpoint name, `Receiver`, to distinguish it from the sender. The endpoint name is also the name of the queue that the endpoint receives messages from.

Since this endpoint only replies to the originator of a message and doesn't start new conversations, no routing configuration is required. It also doesn't need a send loop like the Sender does, because it only acts when it receives a message. `host.RunAsync()` runs the endpoint until the application shuts down.

### The Ping message handler

The Receiver project contains a _message handler_ named `PingHandler`:

```csharp
using Shared;

namespace Receiver;

public class PingHandler(ILogger<PingHandler> logger) : IHandleMessages<Ping>
{
    public async Task Handle(Ping message, IMessageHandlerContext context)
    {
        logger.LogInformation("Processing Ping message #{Round}", message.Round);

        var reply = new Pong { Acknowledgement = $"Ping #{message.Round} processed at {DateTimeOffset.UtcNow:s}" };

        await context.Reply(reply);

        // throw new Exception("BOOM");
    }
}
```

Ignore the commented code for now; you'll get back to it later when you learn about recovering from failure.

The class implements `IHandleMessages<Ping>`, which defines one method: `Handle`. This interface tells NServiceBus that when the endpoint receives a message of type `Ping`, the `Handle` method in this handler should process it. The `Handle` method takes the message itself as a parameter, and an `IMessageHandlerContext`, which allows further messaging operations, such as replying, sending commands, or publishing events.

NServiceBus finds handlers automatically when the endpoint starts and creates them using dependency injection. The `ILogger<PingHandler>` is injected through the class's primary constructor.

The `PingHandler` is straightforward: when it receives a `Ping` message, it logs the message details and replies to the sender with a new `Pong` message. The Sender's `PongHandler` then handles the reply:

```csharp
using Shared;

namespace Sender;

public class PongHandler(ILogger<PongHandler> logger) : IHandleMessages<Pong>
{
    public Task Handle(Pong message, IMessageHandlerContext context)
    {
        logger.LogInformation("Processing Pong message: {Acknowledgement}", message.Acknowledgement);

        return Task.CompletedTask;
    }
}
```

> [!NOTE]
> In the Sender's configuration, you specified that `Ping` messages should be routed to the Receiver. NServiceBus adds metadata to the messages indicating, among other things, the origin of the message. That's why you don't need to specify any routing for the `Pong` reply message; it's automatically routed back to its origin: the Sender.

With the Sender and Receiver both configured, you can now run the solution.

## Run the solution

To launch the solution, you need to run both the Sender and the Receiver.

If you're using Visual Studio, configure the solution to launch both projects:

1. Right-click the solution in Solution Explorer.
1. Select **Configure Startup Projects...**.
1. Select **Multiple startup projects**.
1. For both the Sender and the Receiver, select **Start** in the **Action** list.

If you're using another editor or the command line, open two terminals in the solution folder and run each project:

```bash
dotnet run --project Receiver
```

```bash
dotnet run --project Sender
```

Launch the solution. Two console applications appear, one for the Sender and one for the Receiver.

# [Sender](#tab/Sender)

:::image type="content" source="./media/nservicebus/sender.png" alt-text="Image showing the endpoint sending Ping messages to Receiver":::

# [Receiver](#tab/Receiver)

:::image type="content" source="./media/nservicebus/receiver.png" alt-text="Image showing the endpoint receiving Ping messages from the Sender":::

---

In the Sender, notice that a `Ping` message is dispatched every second by the send loop in `Program.cs`. The Receiver logs the details of each `Ping` message it receives, and the Sender logs the details of each `Pong` message it receives in reply.

Now that you have everything working, let's break it.

## Resilience in action

Errors are a fact of life in software systems. It's inevitable that code will fail, and it can do so for various reasons, such as network failures, database locks, changes in a third-party API, and plain old coding errors.

NServiceBus has robust [recoverability](https://docs.particular.net/nservicebus/recoverability/) features for handling failures. When a message handler fails, messages are automatically retried based on a predefined policy. There are two types of retry policy: immediate retries and delayed retries. By default, NServiceBus performs five immediate retries and three rounds of delayed retries. The best way to describe how they work is to see them in action. Let's configure a shorter retry policy for the Receiver endpoint:

1. Open `Program.cs` in the Receiver project.
1. After the `EnableInstallers` line, and before the call to `AddNServiceBusEndpoint`, add the following code:

    ```csharp
    endpointConfiguration.SendFailedMessagesTo("error");
    var recoverability = endpointConfiguration.Recoverability();
    recoverability.Immediate(
        immediate =>
        {
            immediate.NumberOfRetries(3);
        });
    recoverability.Delayed(
        delayed =>
        {
            delayed.NumberOfRetries(2);
            delayed.TimeIncrease(TimeSpan.FromSeconds(5));
        });
    ```

Before you test the recoverability policy, you need to simulate an error. Open the `PingHandler` code in the Receiver project and uncomment this line:

```csharp
throw new Exception("BOOM");
```

Now, when the Receiver handles a `Ping` message, it fails. The exception is thrown after the call to `context.Reply`, but NServiceBus only dispatches outgoing messages after the handler completes successfully, so no `Pong` reply is sent for a failed attempt. Launch the solution again and see what happens in the Receiver.

With the less reliable `PingHandler`, all messages fail. You can see the retry policy kicking in for those messages. The first time a message fails, it's immediately retried up to three times:

:::image type="content" source="./media/nservicebus/immediate-retries.png" alt-text="Image showing the immediate retry policy that retries messages up to 3 times":::

It continues to fail, so when the three immediate retries are used up, the delayed retry policy kicks in and the message is delayed for 5 seconds:

:::image type="content" source="./media/nservicebus/delayed-retries.png" alt-text="Image showing the delayed retry policy that delays the messages in increments of 5 seconds before attempting another round of immediate retries":::

After those 5 seconds have passed, the message is retried another three times (that is, another iteration of the immediate retry policy). These attempts also fail, and NServiceBus delays the message again, this time for 10 seconds, before trying again.

If `PingHandler` still doesn't succeed after running through the full retry policy, the message is moved to a _centralized_ error queue, named `error`, as defined by the call to `SendFailedMessagesTo`.

:::image type="content" source="./media/nservicebus/failed-message.png" alt-text="Image showing the failed message":::

The concept of a centralized error queue differs from the dead-lettering mechanism in Azure Service Bus, which has a dead-letter queue for each queue and subscription. With NServiceBus, the dead-letter queues in Azure Service Bus act as true poison message queues, whereas messages that end up in the centralized error queue can be reprocessed later, if necessary. If you also want messages that Azure Service Bus dead-letters natively to be handled centrally, the transport can automatically forward them to the error queue. For more information, see [dead lettering](https://docs.particular.net/transports/azure-service-bus/configuration#dead-lettering) in the NServiceBus documentation.

The retry policy helps to address [several types of errors](https://particular.net/blog/but-all-my-errors-are-severe) that are often transient or semi-transient in nature. That is, errors that are temporary and often go away if the message is simply reprocessed after a short delay. Examples include network failures, database locks, and third-party API outages.

Once a message is in the error queue, you can examine the message details in the tool of your choice, then decide what to do with it. For example, using [ServicePulse](https://particular.net/servicepulse), a monitoring tool by Particular Software, you can view the message details and the reason for the failure. ServicePulse reads the error and audit queues through [ServiceControl](https://docs.particular.net/servicecontrol/), which must be installed and connected to the same Azure Service Bus namespace.

:::image type="content" source="./media/nservicebus/servicepulse.png" alt-text="Image showing ServicePulse, from Particular Software":::

After examining the details, you can send the message back to its original queue for processing. You can also edit the message before doing so. If multiple messages in the error queue failed for the same reason, you can send them all back to their original destinations as a batch.

Next, it's time to figure out where to deploy the solution in Azure.

## Where to host the services in Azure

In this sample, the Sender and Receiver endpoints are configured to run as console applications. They can also be hosted in various Azure services, including Azure Functions, Azure App Service, Azure Container Apps, Azure Container Instances, Azure Kubernetes Service, and Azure Virtual Machines.

For example, you can host the Receiver endpoint in an Azure Functions app (isolated worker model) by using the `NServiceBus.AzureFunctions.AzureServiceBus` NuGet package. In `Program.cs`, enable the integration by calling `AddNServiceBusFunctions`:

```csharp
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);
builder.AddNServiceBusFunctions();

var host = builder.Build();
await host.RunAsync();
```

Then declare the endpoint as a partial method decorated with the `[NServiceBusFunction]` attribute and an Azure Service Bus trigger. A source generator emits the method body, which forwards each incoming message to the NServiceBus pipeline. A static `Configure{FunctionName}` method configures the endpoint:

```csharp
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;

public partial class ReceiverEndpoint
{
    [Function("Receiver")]
    [NServiceBusFunction]
    public partial Task Receiver(
        [ServiceBusTrigger("Receiver", AutoCompleteMessages = false)]
        ServiceBusReceivedMessage message,
        ServiceBusMessageActions messageActions,
        FunctionContext functionContext,
        CancellationToken cancellationToken = default);

    public static void ConfigureReceiver(EndpointConfiguration endpointConfiguration)
    {
        endpointConfiguration.UseTransport(new AzureServiceBusServerlessTransport(TopicTopology.Default));
        endpointConfiguration.UseSerialization<SystemJsonSerializer>();
        endpointConfiguration.AddHandler<PingHandler>();
    }
}
```

In this hosting model, the endpoint uses `AzureServiceBusServerlessTransport`, and handlers are registered explicitly with `AddHandler` instead of being discovered through assembly scanning. The trigger sets `AutoCompleteMessages = false` because NServiceBus completes or abandons each message based on the outcome of its handlers.

For more information about using NServiceBus with Functions, see [Azure Functions hosting](https://docs.particular.net/nservicebus/hosting/azure/functions/) in the NServiceBus documentation.

## Next steps

For more information about using NServiceBus with Azure services, see the following articles:

- [Azure Service Bus Send/Reply Sample](https://docs.particular.net/samples/azure-service-bus-netstandard/send-reply/)
- [Using NServiceBus with Azure Functions](https://docs.particular.net/nservicebus/hosting/azure/functions/)
- [Azure Service Bus transport on NServiceBus](https://docs.particular.net/transports/azure-service-bus/)
- [Azure Service Bus transport topology](https://docs.particular.net/transports/azure-service-bus/topology)
- [NServiceBus and Azure](https://docs.particular.net/nservicebus/azure/)
- [NServiceBus](https://particular.net/nservicebus)
- [NServiceBus Quick Start Tutorial](https://docs.particular.net/tutorials/quickstart)
