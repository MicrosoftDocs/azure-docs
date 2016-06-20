<properties
   pageTitle="Reliable Actors events | Microsoft Azure"
   description="Introduction to events for Service Fabric Reliable Actors."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/13/2016"
   ms.author="amanbha"/>


# Actor events
Actor events provide a way to send best-effort notifications from the actor to the clients. Actor events are designed for actor-to-client communication and should not be used for actor-to-actor communication.

The following code snippets show how to use actor events in your application.

Define an interface that describes the events published by the actor. This interface must be derived from the `IActorEvents` interface. The arguments of the methods must be [data contract serializable](service-fabric-reliable-actors-notes-on-actor-type-serialization.md). The methods must return void, as event notifications are one way and best effort.

```csharp
public interface IGameEvents : IActorEvents
{
    void GameScoreUpdated(Guid gameId, string currentScore);
}
```

Declare the events published by the actor in the actor interface.

```csharp
public interface IGameActor : IActor, IActorEventPublisher<IGameEvents>
{
    Task UpdateGameStatus(GameStatus status);

    Task<string> GetGameScore();
}
```

On the client side, implement the event handler.

```csharp
class GameEventsHandler : IGameEvents
{
    public void GameScoreUpdated(Guid gameId, string currentScore)
    {
        Console.WriteLine(@"Updates: Game: {0}, Score: {1}", gameId, currentScore);
    }
}
```

On the client, create a proxy to the actor that publishes the event and subscribe to its events.

```csharp
var proxy = ActorProxy.Create<IGameActor>(
                    new ActorId(Guid.Parse(arg)), ApplicationName);

await proxy.SubscribeAsync<IGameEvents>(new GameEventsHandler());
```

In the event of failovers, the actor may fail over to a different process or node. The actor proxy manages the active subscriptions and automatically re-subscribes them. You can control the re-subscription interval through the `ActorProxyEventExtensions.SubscribeAsync<TEvent>` API. To unsubscribe, use the `ActorProxyEventExtensions.UnsubscribeAsync<TEvent>` API.

On the actor, simply publish the events as they happen. If there are subscribers to the event, the Actors runtime will send them the notification.

```csharp
var ev = GetEvent<IGameEvents>();
ev.GameScoreUpdated(Id.GetGuidId(), score);
```

## Next steps
 - [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
 - [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
 - [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure/servicefabric-samples)
