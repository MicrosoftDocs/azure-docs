---
title: Stop your app server gracefully.
description: This article provides information about gracefully shutdown SignalR app server
author: vicancy
ms.author: lianwei
ms.date: 08/16/2021
ms.service: signalr
ms.topic: conceptual
---

# Server graceful shutdown
Microsoft Azure SignalR Service provides two modes for gracefully shutdown a SignalR Hub server when Azure SignalR Service is configured as **Default mode** that Azure SignalR Service acts as a proxy between the SignalR Clients and the SignalR Hub Server.

The key advantage of using this feature is to prevent your customer from experiencing unexpectedly connection drops. 

Instead, you could either wait your client connections to close themselves with respect to your business logic, or even migrate the client connection to another server without losing data. 

## How it works

In general, there will be four stages in a graceful shutdown process:

1. **Set the server offline**

    It means no more client connections will be routed to this server.

2. **Trigger `OnShutdown` hooks**

    You could register shutdown hooks for each hub you have owned in your server.
    They'll be called with respect to the registered order right after we got an **FINACK** response from our Azure SignalR Service, which means this server has been set offline in the Azure SignalR Service.

    You can broadcast messages or do some cleaning jobs in this stage, once all shutdown hooks has been executed, we'll proceed to the next stage.

3. **Wait until all client connections finished**, depends on the mode you choose, it could be:

    **Mode set to WaitForClientsToClose**

    Azure SignalR Service will hold existing clients.

    You may have to design a way, like broadcast a closing message to all clients, and then let your clients decide when to close/reconnect itself.

    Read [ChatSample](https://github.com/Azure/azure-signalr/tree/dev/samples/ChatSample) for sample usage, which we broadcast a 'exit' message to trigger client close in shutdown hook.

    **Mode set to MigrateClients**

    Azure SignalR Service will try to reroute the client connection on this server to another valid server. 
    
    In this scenario, `OnConnectedAsync` and `OnDisconnectedAsync` will be triggered on the new server and the old server respectively with an `IConnectionMigrationFeature` set in the `Context`, which can be used to identify if the client connection was being migrated-in or migrated-out. This feature could be useful especially for stateful scenarios.

    The client connection will be immediately migrated after the current message has been delivered, which means the next message will be routed to the new server.

4. **Stop server connections**

    After all client connections have been closed/migrated, or timeout (30s by default) exceeded,

    SignalR Server SDK will proceed the shutdown process to this stage, and close all server connections.

    Client connections will still be dropped if it failed to be closed/migrated. For example, no suitable target server / current client-to-server message hasn't finished.

## Sample codes.

Add following options when `AddAzureSignalR`:

```csharp
services.AddSignalR().AddAzureSignalR(option =>
{
    option.GracefulShutdown.Mode = GracefulShutdownMode.WaitForClientsClose;
    // option.GracefulShutdown.Mode = GracefulShutdownMode.MigrateClients;
    option.GracefulShutdown.Timeout = TimeSpan.FromSeconds(30);

    option.GracefulShutdown.Add<Chat>(async (c) =>
    {
        await c.Clients.All.SendAsync("exit");
    });
});
```

### configure `OnConnected` and `OnDisconnected` while setting graceful shutdown mode to `MigrateClients`.

We've introduced an "IConnectionMigrationFeature" to indicate if a connection was being migrated-in/out.

```csharp
public class Chat : Hub {

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"{Context.ConnectionId} connected.");

        var feature = Context.Features.Get<IConnectionMigrationFeature>();
        if (feature != null)
        {
            Console.WriteLine($"[{feature.MigrateTo}] {Context.ConnectionId} is migrated from {feature.MigrateFrom}.");
            // Your business logic.
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception e)
    {
        Console.WriteLine($"{Context.ConnectionId} disconnected.");

        var feature = Context.Features.Get<IConnectionMigrationFeature>();
        if (feature != null)
        {
            Console.WriteLine($"[{feature.MigrateFrom}] {Context.ConnectionId} will be migrated to {feature.MigrateTo}.");
            // Your business logic.
        }

        await base.OnDisconnectedAsync(e);
    }
}
```
