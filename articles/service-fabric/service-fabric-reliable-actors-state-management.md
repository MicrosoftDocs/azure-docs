---
title: Reliable Actors state management | Microsoft Docs
description: Describes how Reliable Actors state is managed, persisted, and replicated for high availability.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: ''

ms.assetid: 37cf466a-5293-44c0-a4e0-037e5d292214
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/29/2017
ms.author: vturecek

---
# Reliable Actors state management
Reliable Actors are single-threaded objects that can encapsulate both logic and state. Because actors run on Reliable Services, they can maintain state reliably by using the same persistence and replication mechanisms that Reliable Services uses. This way, actors don't lose their state after failures, upon reactivation after garbage collection, or when they are moved around between nodes in a cluster due to resource balancing or upgrades.

## State persistence and replication
All Reliable Actors are considered *stateful* because each actor instance maps to a unique ID. This means that repeated calls to the same actor ID are routed to the same actor instance. In a stateless system, by contrast, client calls are not guaranteed to be routed to the same server every time. For this reason, actor services are always stateful services.

Even though actors are considered stateful, that does not mean they must store state reliably. Actors can choose the level of state persistence and replication based on their data storage requirements:

* **Persisted state**: State is persisted to disk and is replicated to 3 or more replicas. This is the most durable state storage option, where state can persist through complete cluster outage.
* **Volatile state**: State is replicated to 3 or more replicas and only kept in memory. This provides resilience against node failure and actor failure, and during upgrades and resource balancing. However, state is not persisted to disk. So if all replicas are lost at once, the state is lost as well.
* **No persisted state**: State is not replicated or written to disk. This level is for actors that simply don't need to maintain state reliably.

Each level of persistence is simply a different *state provider* and *replication* configuration of your service. Whether or not state is written to disk depends on the state provider--the component in a reliable service that stores state. Replication depends on how many replicas a service is deployed with. As with Reliable Services, both the state provider and replica count can easily be set manually. The actor framework provides an attribute that, when used on an actor, automatically selects a default state provider and automatically generates settings for replica count to achieve one of these three persistence settings. The StatePersistence attribute is not inherited by derived class, each Actor type must provide its StatePersistence level.

### Persisted state
```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl  extends FabricActor implements MyActor
{
}
```  
This setting uses a state provider that stores data on disk and automatically sets the service replica count to 3.

### Volatile state
```csharp
[StatePersistence(StatePersistence.Volatile)]
class MyActor : Actor, IMyActor
{
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Volatile)
class MyActorImpl extends FabricActor implements MyActor
{
}
```
This setting uses an in-memory-only state provider and sets the replica count to 3.

### No persisted state
```csharp
[StatePersistence(StatePersistence.None)]
class MyActor : Actor, IMyActor
{
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.None)
class MyActorImpl extends FabricActor implements MyActor
{
}
```
This setting uses an in-memory-only state provider and sets the replica count to 1.

### Defaults and generated settings
When you're using the `StatePersistence` attribute, a state provider is automatically selected for you at runtime when the actor service starts. The replica count, however, is set at compile time by the Visual Studio actor build tools. The build tools automatically generate a *default service* for the actor service in ApplicationManifest.xml. Parameters are created for **min replica set size** and **target replica set size**.

You can change these parameters manually. But each time the `StatePersistence` attribute is changed, the parameters are set to the default replica set size values for the selected `StatePersistence` attribute, overriding any previous values. In other words, the values that you set in ServiceManifest.xml are *only* overridden at build time when you change the `StatePersistence` attribute value.

```xml
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="Application12Type" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Parameters>
      <Parameter Name="MyActorService_PartitionCount" DefaultValue="10" />
      <Parameter Name="MyActorService_MinReplicaSetSize" DefaultValue="3" />
      <Parameter Name="MyActorService_TargetReplicaSetSize" DefaultValue="3" />
   </Parameters>
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="MyActorPkg" ServiceManifestVersion="1.0.0" />
   </ServiceManifestImport>
   <DefaultServices>
      <Service Name="MyActorService" GeneratedIdRef="77d965dc-85fb-488c-bd06-c6c1fe29d593|Persisted">
         <StatefulService ServiceTypeName="MyActorServiceType" TargetReplicaSetSize="[MyActorService_TargetReplicaSetSize]" MinReplicaSetSize="[MyActorService_MinReplicaSetSize]">
            <UniformInt64Partition PartitionCount="[MyActorService_PartitionCount]" LowKey="-9223372036854775808" HighKey="9223372036854775807" />
         </StatefulService>
      </Service>
   </DefaultServices>
</ApplicationManifest>
```

## State manager
Every actor instance has its own state manager: a dictionary-like data structure that reliably stores key/value pairs. The state manager is a wrapper around a state provider. You can use it to store data regardless of which persistence setting is used. It does not provide any guarantees that a running actor service can be changed from a volatile (in-memory-only) state setting to a persisted state setting through a rolling upgrade while preserving data. However, it is possible to change replica count for a running service.

State manager keys must be strings. Values are generic and can be any type, including custom types. Values stored in the state manager must be data contract serializable because they might be transmitted over the network to other nodes during replication and might be written to disk, depending on an actor's state persistence setting.

The state manager exposes common dictionary methods for managing state, similar to those found in Reliable Dictionary.

### Accessing state
State can be accessed through the state manager by key. State manager methods are all asynchronous because they might require disk I/O when actors have persisted state. Upon first access, state objects are cached in memory. Repeat access operations access objects directly from memory and return synchronously without incurring disk I/O or asynchronous context-switching overhead. A state object is removed from the cache in the following cases:

* An actor method throws an unhandled exception after it retrieves an object from the state manager.
* An actor is reactivated, either after being deactivated or after failure.
* The state provider pages state to disk. This behavior depends on the state provider implementation. The default state provider for the `Persisted` setting has this behavior.

You can retrieve state by using a standard *Get* operation that throws `KeyNotFoundException`(C#) or `NoSuchElementException`(Java) if an entry does not exist for the key:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public Task<int> GetCountAsync()
    {
        return this.StateManager.GetStateAsync<int>("MyState");
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture<Integer> getCountAsync()
    {
        return this.stateManager().getStateAsync("MyState");
    }
}
```

You can also retrieve state by using a *TryGet* method that does not throw if an entry does not exist for a key:

```csharp
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public async Task<int> GetCountAsync()
    {
        ConditionalValue<int> result = await this.StateManager.TryGetStateAsync<int>("MyState");
        if (result.HasValue)
        {
            return result.Value;
        }

        return 0;
    }
}
```
```Java
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture<Integer> getCountAsync()
    {
        return this.stateManager().<Integer>tryGetStateAsync("MyState").thenApply(result -> {
            if (result.hasValue()) {
                return result.getValue();
            } else {
                return 0;
            });
    }
}
```

### Saving state
The state manager retrieval methods return a reference to an object in local memory. Modifying this object in local memory alone does not cause it to be saved durably. When an object is retrieved from the state manager and modified, it must be reinserted into the state manager to be saved durably.

You can insert state by using an unconditional *Set*, which is the equivalent of the `dictionary["key"] = value` syntax:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public Task SetCountAsync(int value)
    {
        return this.StateManager.SetStateAsync<int>("MyState", value);
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture setCountAsync(int value)
    {
        return this.stateManager().setStateAsync("MyState", value);
    }
}
```

You can add state by using an *Add* method. This method throws `InvalidOperationException`(C#) or `IllegalStateException`(Java) when it tries to add a key that already exists.

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public Task AddCountAsync(int value)
    {
        return this.StateManager.AddStateAsync<int>("MyState", value);
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture addCountAsync(int value)
    {
        return this.stateManager().addOrUpdateStateAsync("MyState", value, (key, old_value) -> old_value + value);
    }
}
```

You can also add state by using a *TryAdd* method. This method does not throw when it tries to add a key that already exists.

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public async Task AddCountAsync(int value)
    {
        bool result = await this.StateManager.TryAddStateAsync<int>("MyState", value);

        if (result)
        {
            // Added successfully!
        }
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture addCountAsync(int value)
    {
        return this.stateManager().tryAddStateAsync("MyState", value).thenApply((result)->{
            if(result)
            {
                // Added successfully!
            }
        });
    }
}
```

At the end of an actor method, the state manager automatically saves any values that have been added or modified by an insert or update operation. A "save" can include persisting to disk and replication, depending on the settings used. Values that have not been modified are not persisted or replicated. If no values have been modified, the save operation does nothing. If saving fails, the modified state is discarded and the original state is reloaded.

You can also save state manually by calling the `SaveStateAsync` method on the actor base:

```csharp
async Task IMyActor.SetCountAsync(int count)
{
    await this.StateManager.AddOrUpdateStateAsync("count", count, (key, value) => count > value ? count : value);

    await this.SaveStateAsync();
}
```
```Java
interface MyActor {
    CompletableFuture setCountAsync(int count)
    {
        this.stateManager().addOrUpdateStateAsync("count", count, (key, value) -> count > value ? count : value).thenApply();

        this.stateManager().saveStateAsync().thenApply();
    }
}
```

### Removing state
You can remove state permanently from an actor's state manager by calling the *Remove* method. This method throws `KeyNotFoundException`(C#) or `NoSuchElementException`(Java) when it tries to remove a key that doesn't exist.

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public Task RemoveCountAsync()
    {
        return this.StateManager.RemoveStateAsync("MyState");
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture removeCountAsync()
    {
        return this.stateManager().removeStateAsync("MyState");
    }
}
```

You can also remove state permanently by using the *TryRemove* method. This method does not throw when it tries to remove a key that does not exist.

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public MyActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public async Task RemoveCountAsync()
    {
        bool result = await this.StateManager.TryRemoveStateAsync("MyState");

        if (result)
        {
            // State removed!
        }
    }
}
```
```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
class MyActorImpl extends FabricActor implements  MyActor
{
    public MyActorImpl(ActorService actorService, ActorId actorId)
    {
        super(actorService, actorId);
    }

    public CompletableFuture removeCountAsync()
    {
        return this.stateManager().tryRemoveStateAsync("MyState").thenApply((result)->{
            if(result)
            {
                // State removed!
            }
        });
    }
}
```

## Next steps

State that's stored in Reliable Actors must be serialized before its written to disk and replicated for high availability. Learn more about [Actor type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

Next, learn more about [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md).
