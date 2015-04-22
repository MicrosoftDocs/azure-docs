<properties
   pageTitle="Azure Service Fabric Actors Events"
   description="Azure Service Fabric Actor Events"
   services="service-fabric"
   documentationCenter=".net"
   authors="myamanbh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2015"
   ms.author="amanbha"/>


# Actor Events
Actor events provides a way to send best effort notifications of changes from the Actor to the clients. Actor events are designed for Actor-Client communication and should NOT be used for Actor-to-Actor communication.

Following code snippets shows how to use actor events in your application.

Define an interface that describes the events published by the actor. The arguments of the methods must be data contract serializable. The methods must return void as event notifications are one-way and best effort.

```
  public interface IGameEvents
  {
     void GameScoreUpdated(Guid gameId, string currentScore);
  }
```
Declare the events published by the actor in the actor interface.
```
public interface IGameActor : IActor, IActorEventPublisher<IGameEvents>
{
    Task UpdateGameStatus(GameStatus status);
 
    [Readonly]
    Task<string> GetGameScore();
}
```

On the client side implement the event handler.
```
class GameEventsHandler : IGameEvents
{
    public void GameScoreUpdated(Guid gameId, string currentScore)
    {
        Console.WriteLine(@"Updates: Game: {0}, Score: {1}", gameId, currentScore);
    }
}
```
On the client, create proxy to the actor that publishes the event and subscribe to them.
```
var proxy = ActorProxy.Create<IGameActor>(
              new ActorId(Guid.Parse(arg)), ApplicationName);

proxy.SubscribeAsync(new GameEventsHandler()).Wait();
```
In the event of failovers the actor may failover to a different process or node. The actor proxy manages the active subscriptions and automatically re-subscribes them. You can control the re-subscription interval through SubscribeAsync API. To unsubscribe use Unsubscribe API.

On the actor simply publishes the events as they happen. If there are subscribers subscribed to the event, the framework will send them the notification.
```
var ev = GetEvent<IGameEvents>();
ev.GameScoreUpdated(Id.GetGuidId(), State.Status.Score);
```
