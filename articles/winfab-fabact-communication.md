<properties 
   pageTitle="FabAct Communication" 
   description="Introduction to FabAct Communication" 
   services="winfabric" 
   documentationCenter=".net" 
   authors="clca" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="winfabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/02/2015"
   ms.author="claudioc"/>

#FabAct Communication
The actor framework provides communication between the actor instance and the actor client. The framework also provides the location transparency and failover. The ActorProxy class on the client side perform the necessary resolution and locates the actor service partition where the actor with the specified id is hosted and opens a communication channel with it. The ActorProxy retries on the communication failures and in case of failovers.  This does mean that it is possible for an Actor implementation to get duplicate messages from the same client.  ActorProxy should be used for client to Actor as well as Actor to Actor communication.

The code snippet below shows the example of creating the ActorProxy to communicate to the actor that implements IHelloWorld actor interface.

```
var friend = ActorProxy.Create<IHello>(ActorId.GetRandom(), ApplicationName);

Console.WriteLine("\n\nFrom Actor {1}: {0}\n\n", friend.SayHello("Good morning!").Result, friend.GetActorId());
```