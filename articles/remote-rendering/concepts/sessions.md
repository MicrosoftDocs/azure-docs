---
title: Remote Rendering Sessions
description: Describes what a Remote Rendering session is
author: FlorianBorn71
ms.author: flborn
ms.date: 02/21/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Remote Rendering Sessions

In Azure Remote Rendering (ARR), a *session* is a key concept. This article explains what exactly a session is.

## Overview

Azure Remote Rendering works by offloading complex rendering tasks into the cloud. These rendering tasks can't be fulfilled by just any server, since most cloud servers don't have GPUs. Because of the amount of data involved and the hard requirement of producing results at interactive frame rates, the responsibility which server handles which user request also can't be handed over to another machine on-the-fly, as may be possible for more common web traffic.

That means when you use Azure Remote Rendering, a cloud server with the necessary hardware capabilities must be reserved exclusively to handle your rendering requests. A *session* refers to everything involved with interacting with this server. It starts with the initial request to reserve (*lease*) a machine for your use, continues with all the commands for loading and manipulating models, and ends with releasing the lease on the cloud server.

## Managing sessions

There are multiple ways to manage and interact with sessions. The language-independent way of creating, updating, and shutting down sessions is through [the session management REST API](../how-tos/session-rest-api.md). In C# and C++, these operations are exposed through the classes `RemoteRenderingClient` and `RenderingSession`. For Unity applications, there are further utility functions provided by the `ARRServiceUnity` component.

Once you are *connected* to an active session, operations such as [loading models](models.md) and interacting with the scene are exposed through the `RenderingSession` class.

### Managing multiple sessions simultaneously

It is not possible to fully *connect* to multiple sessions from one device. However, you can create, observe and shut down as many sessions as you like from a single application. As long as the app is not meant to ever connect to a session, it doesn't need to run on a device like HoloLens 2, either. A use case for such an implementation may be if you want to control sessions through a central mechanism. For example, one could build a web app, where multiple tablets and HoloLens devices can log into. Then the app can display options on the tablets, such as which CAD model to display. If a user makes a selection, this information is communicated to all HoloLens devices to create a shared experience.

## Session phases

Every session undergoes multiple phases.

### Session startup

When you ask ARR to [create a new session](../how-tos/session-rest-api.md), the first thing it does is to return a session [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier). This UUID allows you to query information about the session. The UUID and some basic information about the session are persisted for 30 days, so you can query that information even after the session has been stopped. At this point, the **session state** will be reported as **Starting**.

Next, Azure Remote Rendering tries to find a server that can host your session. There are two parameters for this search. First, it will only reserve servers in your [region](../reference/regions.md). That's because the network latency across regions may be too high to guarantee a decent experience. The second factor is the desired *size* that you specified. In each region, there is a limited number of servers that can fulfill the [*Standard*](../reference/vm-sizes.md) or [*Premium*](../reference/vm-sizes.md) size request. Consequently, if all servers of the requested size are currently in use in your region, session creation will fail. The reason for failure [can be queried](../how-tos/session-rest-api.md).

> [!IMPORTANT]
> If you request a *Standard* server size and the request fails due to high demand, that doesn't imply that requesting a *Premium* server will fail, as well. So if it is an option for you, you can try falling back to a *Premium* server size.

When the service finds a suitable server, it has to copy the proper virtual machine (VM) onto it to turn it into an Azure Remote Rendering host. This process takes several minutes. Afterwards the VM is booted and the **session state** transitions to **Ready**.

At this point, the server is exclusively waiting for your input. This is also the point from which on you get billed for the service.

### Connecting to a session

Once the session is *ready*, you can *connect* to it. While connected, the device can send commands to load and modify models. Every ARR host only ever serves one client device at a time, so when a client connects to a session, it has exclusive control over the rendered content. That also means that rendering performance will never vary for reasons outside of your control.

> [!IMPORTANT]
> Although only one client can *connect* to a session, basic information about sessions, such as their current state, can be queried without connecting.

While a device is connected to a session, attempts by other devices to connect will fail. However, once the connected device disconnects, either voluntarily or due to some kind of failure, the session will accept another connection request. All previous state (loaded models and such) is discarded such that the next connecting device gets a clean slate. Thus sessions can be reused many times, by different devices and it may be possible to hide the session startup overhead from the end user in most cases.

> [!IMPORTANT]
> The remote server never alters the state of client-side data. All mutations of data (such as transform updates and load requests) must be performed by the client application. All actions immediately update the client state.

### Session end

When you request a new session, you specify a *maximum lease time*, typically in the range of one to eight hours. This is the duration during which the host will accept your input.

There are two regular reasons for a session to end. Either you manually request the session to be stopped or the maximum lease time expires. In both cases, any active connection to the host is closed right away, and the service is shut down on that server. The server is then given back to the Azure pool and may get requisitioned for other purposes. Stopping a session cannot be undone or canceled. Querying the **session state** on a stopped session will either return **Stopped** or **Expired**, depending on whether it was manually shut down or because the maximum lease time was reached.

A session may also be stopped because of some failure.

In all cases, you won't be billed further once a session is stopped.

> [!WARNING]
> Whether you connect to a session, and for how long, doesn't affect billing. What you pay for the service depends on the *session duration*, that means the time that a server is exclusively reserved for you, and the requested hardware capabilities (the [allocated size](../reference/vm-sizes.md)). If you start a session, connect for five minutes and then don't stop the session, such that it keeps running until its lease expires, you will be billed for the full session lease time. Conversely, the *maximum lease time* is mostly a safety net. It does not matter whether you request a session with a lease time of eight hours, then only use it for five minutes, if you manually stop the session afterwards.

#### Extend a session's lease time

You can [extend the lease time](../how-tos/session-rest-api.md) of an active session, if it turns out that you need it longer.

## Example code

The code below shows a simple implementation of starting a session, waiting for the *ready* state, connecting, and then disconnecting and shutting down again.

```cs
RemoteRenderingInitialization init = new RemoteRenderingInitialization();
// fill out RemoteRenderingInitialization parameters...

RemoteManagerStatic.StartupRemoteRendering(init);

SessionConfiguration sessionConfig = new SessionConfiguration();
// fill out sessionConfig details...

RemoteRenderingClient client = new RemoteRenderingClient(sessionConfig);

RenderingSessionCreationOptions rendererOptions = new RenderingSessionCreationOptions();
// fill out rendererOptions...

CreateRenderingSessionResult result = await client.CreateNewRenderingSessionAsync(rendererOptions);

RenderingSession session = result.Session;
RenderingSessionProperties sessionProperties;
while (true)
{
    var propertiesResult = await session.GetPropertiesAsync();
    sessionProperties = propertiesResult.SessionProperties;
    if (sessionProperties.Status != RenderingSessionStatus.Starting &&
        sessionProperties.Status != RenderingSessionStatus.Unknown)
    {
        break;
    }
    // REST calls must not be issued too frequently, otherwise the server returns failure code 429 ("too many requests"). So we insert the recommended delay of 10s
    await Task.Delay(TimeSpan.FromSeconds(10));
}

if (sessionProperties.Status != RenderingSessionStatus.Ready)
{
    // Do some error handling and either terminate or retry.
}

// Connect to server
ConnectionStatus connectStatus = await session.ConnectAsync(new RendererInitOptions());

// Connected!

while (...)
{
    // per frame update

    session.Connection.Update();
}

// Disconnect
session.Disconnect();

// stop the session
await session.StopAsync();

// shut down the remote rendering SDK
RemoteManagerStatic.ShutdownRemoteRendering();
```

Multiple `RemoteRenderingClient` and `RenderingSession` instances can be maintained, manipulated, and queried from code. But only a single device may connect to an `RenderingSession` at a time.

The lifetime of a virtual machine isn't tied to the `RemoteRenderingClient` instance or the `RenderingSession` instance. `RenderingSession.StopAsync` must be called to stop a session.

The persistent session ID can be queried via `RenderingSession.SessionUuid()` and cached locally. With this ID, an application can call `RemoteRenderingClient.OpenRenderingSessionAsync` to bind to that session.

When `RenderingSession.IsConnected` is true, `RenderingSession.Connection` returns an instance of `RenderingConnection`, which contains the functions to [load models](models.md), manipulate [entities](entities.md), and [query information](../overview/features/spatial-queries.md) about the rendered scene.

## API documentation

* [C# RenderingSession class](/dotnet/api/microsoft.azure.remoterendering.renderingsession)
* [C# RemoteRenderingClient.CreateNewRenderingSessionAsync()](/dotnet/api/microsoft.azure.remoterendering.remoterenderingclient.createnewrenderingsessionasync)
* [C# RemoteRenderingClient.OpenRenderingSessionAsync()](/dotnet/api/microsoft.azure.remoterendering.remoterenderingclient.openrenderingsessionasync)
* [C++ RenderingSession class](/cpp/api/remote-rendering/renderingsession)
* [C++ RemoteRenderingClient::CreateNewRenderingSessionAsync](/cpp/api/remote-rendering/remoterenderingclient#createnewrenderingsessionasync)
* [C++ RemoteRenderingClient::OpenRenderingSession](/cpp/api/remote-rendering/remoterenderingclient#openrenderingsession)

## Next steps

* [Entities](entities.md)
* [Models](models.md)