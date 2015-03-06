<properties 
   pageTitle="FabAct State Management" 
   description="Introduction to FabAct State Management" 
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

#FabAct State Management
FabAct allows you to create the actors that are either stateless or stateful. 

##Stateless Actors
Stateless actors, as the name suggests do not have the state that is managed by the framework. The stateless actors derive from Actor base class. They can have member variables and those would be preserved throughout the lifetime of that actor just like any other .NET types. However if that actor instance is garbage collected after being idle for some time it would lose the state stored in its member variables. Similarly if the actor process or the node fails it would lose the state stored in its member variables as well. 

Following is an example of a stateless actor.
```
class HelloActor : Actor, IHello
{
    public Task<string> SayHello(string greeting)
    {
        return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
    }
}
```

##Stateful Actors
Stateful  actors have a state that needs to be preserved across activation and failovers. The stateful actors derive from Actor<TState> base class where TState is the type of the state that needs to be preserved across activations and failovers. The state can be accessed in the actor methods via State property on the base class Actor<TState>.  Following is an example of a stateful actor accessing the state.
```
class VoicemailBoxActor : Actor<VoicemailBox>, IVoicemailBoxActor
{
    public Task<List<Voicemail>> GetMessagesAsync()
    {
        return Task.FromResult(State.MessageList);
    }

    ...
}
```
The storage and retrieval of the state is provided by an actor state provider. There are few default actor state providers that are included in the framework. The durability and reliability of the state is determined by the guarantees offered by the state provider. When an actor is activated its State is loaded in memory. Once the actor method returns modified state is automatically saved by the framework by calling a method on the state provider. If failure occurs during the save state, the framework recycles that actor instance. A new actor instance is created and loaded with the last consistent data from the state provider.
 
State provider can be configured per actor or for all actors within an assembly by the state provider specific attribute. By default a stateful actor uses key value store actor state provider. This state provider is built on the distributed Key-Value store provided by Windows Fabric platform. The state is durably saved on the local disk as well as replicated and durably saved on secondary replicas as well. The state save is complete only when a quorum of replicas has committed the state to their local disks. The Key-Value store has advance capabilities to detect inconsistencies such as false progress and correct them automatically. More details on the KvsActorStateProvider can be found here.

The framework also includes a VolatileActorStateProvider. This state provider replicates the state to replicas but the state remains in-memory on the replica. If one replica goes down and comes back up, its state is rebuilt from the other replica. However if all of the replicas (copies of the state) go down simultaneously the state data will be lost. This state provider is suitable for applications where the data can survive failures of few replicas and can survive the planned failovers such as upgrades, but can be recreated if all  replicas (copies) are lost. You can configure your stateful actor to use volatile actor state provider by adding the following attribute to the actor class or an assembly level attribute.

The following code snippet shows how to changes all actors in the assembly that does not have an explicit state provider attribute to use VolatileActorStateProvider.

```
[assembly:System.Fabric.Services.Actor.VolatileActorStateProvider]
```

The following code snippet shows how to change the state provider for a particular actor, VoicemailBox in this case to be VolatileActorStateProvider. 

```
[VolatileActorStateProvider]
public class VoicemailBoxActor : Actor<VoicemailBox>, IVoicemailBoxActor
{
    public Task<List<Voicemail>> GetMessagesAsync()
    {
        return Task.FromResult(State.MessageList);
    }
 
    ...
}
```

Please note that changing the state provider requires the actor service to be recreated. State providers cannot be changed as part of the application upgrade.

##Readonly Methods
By default the framework saves Actor state upon exiting from an actor method call, timer callback and reminder callback. No other actor call is allowed until the save state is complete.  Depending upon the state provider, saving state may take time and during this time no other actor methods are being allowed in the actor. For example, the default KvsActorStateProvider replicates the data to a replica set and only when a quorum of replicas have committed the data to a persisted store, the save state is completed. 

There may be actor method that do not modify the state, in that case the additional time spent on saving the state can affect the overall throughput of the system. To avoid that you can mark the methods and timer callback that do not modify the state as Readonly.

The example below shows how to mark an actor method as readonly using Readonly attribute.
```
public interface IVoicemailBoxActor : IActor
{
    [Readonly]
    Task<List<Voicemail>> GetMessagesAsync();

```
Similarly you can pass Readonly flag when registering a timer or reminder.


