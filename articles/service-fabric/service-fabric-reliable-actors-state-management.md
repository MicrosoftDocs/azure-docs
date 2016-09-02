<properties
   pageTitle="Reliable Actors state management | Microsoft Azure"
   description="Describes how Reliable Actors state is managed, persisted, and replicated for high-availability."
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
   ms.date="07/06/2016"
   ms.author="vturecek"/>

# Reliable Actors state management

Reliable Actors are single-threaded objects that can encapsulate both logic and state. Since actors run on Reliable Services, they can maintain state reliably using the same persistence and replication mechanisms used by Reliable Services. This way, actors don't lose their state after failures, re-activation after garbage collection, or when they are moved around between nodes in a cluster due to resource balancing or upgrades.

## State persistence and replication

All Reliable Actors are considered *stateful* because each actor instance maps to a unique ID. This means that repeated calls to the same actor ID will be routed to the same actor instance. This is in contrast to a stateless system in which client calls are not guaranteed to be routed to the same server every time. For this reason, actor services are always stateful services.

However, even though actors are considered stateful, it does not mean they must store state reliably. Actors can choose the level of state persistence and replication based on their data storage requirements:

 - **Persisted state:** State is persisted to disk and is replicated to 3 or more replicas. This is the most durable state storage option, where state can persist through complete cluster outage.
 - **Volatile state:** State is replicated to 3 or more replicas and only kept in memory. This provides resilience against node failure, actor failure, and during upgrades and resource balancing. However, state is not persisted to disk, so if all replicas are lost at once, the state is lost as well.
 - **No persisted state:** State is not replicated nor is it written to disk. For actors that simply don't need to maintain state reliably.
 
Each level of persistence is simply a different *state provider* and *replication* configuration of your service. Whether or not state is written to disk depends on the *state provider* - the component in a Reliable Service that stores state - and replication depends on how many replicas a service is deployed with. Just as with Reliable Services, both the state provider and replica count can easily be set manually. The actor framework provides an attribute, that, when used on an actor will automatically select a default state provider and auto-generate settings for replica count to achieve one of these three persistence settings.

### Persisted state
```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
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
This setting uses an in-memory-only state provider and sets the replica count to 3.

### No persisted state

```csharp
[StatePersistence(StatePersistence.None)]
class MyActor : Actor, IMyActor
{
}
```
This setting uses an in-memory-only state provider and sets the replica count to 1.

### Defaults and generated settings

When using the `StatePersistence` attribute, a state provider is automatically selected for you at runtime when the actor service starts. The replica count, however, is set at compile time by the Visual Studio actor build tools. The build tools automatically generate a *default service* for the actor service in ApplicationManifest.xml. Parameters are created for **min replica set size** and **target replica set size**. You can of course change these parameters manually, however each time the `StatePersistence` attribute is changed, the parameters will be set to the default replica set size values for the selected `StatePersistence` attribute, overriding any previous values. In other words, the values you set in ServiceManifest.xml will **only** be overridden at build time when you change the `StatePersistence` attribute value. 

```xml
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="Application12Type" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Parameters>
      <Parameter Name="MyActorService_PartitionCount" DefaultValue="10" />
      <Parameter Name="MyActorService_MinReplicaSetSize" DefaultValue="2" />
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

## State Manager

Every actor instance has its own State Manager: A dictionary-like data structure that reliably stores key-value pairs. The State Manager is a wrapper around a state provider. It can be used to store data regardless of which persistence setting is used, but it does not provide any guarantees that a running actor service can be changed from a volatile (in-memory-only) state setting to a persisted state setting through a rolling upgrade while preserving data. However, it is possible to change replica count for a running service. 

State Manager keys must be strings, while values are generic and can be any type, including custom types. Values stored in the State Manager must be Data Contract serializable because they may be transmitted over the network to other nodes during replication and may be written to disk, depending on an actor's state persistence setting. 

The State Manager exposes common dictionary methods for managing state, similar to those found in Reliable Dictionary.

### Accessing state

State can be accessed through the State Manager by key. State Manager methods are all asynchronous as they may require disk I/O when actors have persisted state. Upon first access, state objects are cached in memory. Repeat access operations access objects directly from memory and return synchronously without incurring disk I/O or asynchronous context switching overhead. A state object is removed from the cache in the following cases:

 - An actor method throws an unhandled exception after retrieving an object from the State Manager.
 - An actor is re-activated, either after being deactivated or due to failure.
 - If the state provider pages state to disk. This behavior depends on the state provider implementation. The default state provider for the `Persisted` setting has this behavior. 

State can be retrieved using a standard *Get* operation that throws `KeyNotFoundException` if an entry does not exist for the given key: 

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public Task<int> GetCountAsync()
    {
        return this.StateManager.GetStateAsync<int>("MyState");
    }
}
```

State can also be retrieved using a *TryGet* method that does not throw if an entry does not exist for a given key:

```csharp
class MyActor : Actor, IMyActor
{
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

### Saving state

The State Manager retrieval methods return a reference to an object in local memory. Modifying this object in local memory alone does not cause it to be saved durably. When an object is retrieved from the State Manager and modified, it must be re-inserted into the State Manager to be saved durably.

State can be inserted using an unconditional *Set*, which is the equivalent of the `dictionary["key"] = value` syntax:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public Task SetCountAsync(int value)
    {
        return this.StateManager.SetStateAsync<int>("MyState", value);
    }
}
```

State can be added using an *Add* method, which will throw `InvalidOperationException` when trying to add a key that already exists:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public Task AddCountAsync(int value)
    {
        return this.StateManager.AddStateAsync<int>("MyState", value);
    }
}
```

State can also be added using a *TryAdd* method, which will not throw when trying to add a key that already exists:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
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

At the end of an actor method, the State Manager automatically saves any values that have been added or modified by an insert or update operation. A "save" can include persisting to disk and replication, depending on the settings used. Values that have not been modified are not persisted or replicated. If no values have been modified, the save operation does nothing. In the event that saving fails, the modified state is discarded and the original state is reloaded.

State can also be saved manually be calling the `SaveStateAsync` method on the actor base:

```csharp
async Task IMyActor.SetCountAsync(int count)
{
    await this.StateManager.AddOrUpdateStateAsync("count", count, (key, value) => count > value ? count : value);
            
    await this.SaveStateAsync();
}
```

### Removing state

State can be removed permanently from an actor's State Manager by calling the *Remove* method. This method will throw `KeyNotFoundException` when trying to remove a key that doesn't exist:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
    public Task RemoveCountAsync()
    {
        return this.StateManager.RemoveStateAsync("MyState");
    }
}
```

State can also be removed permanently by using the *TryRemove* method, which will not throw when trying to remove a key that doesn't exist:

```csharp
[StatePersistence(StatePersistence.Persisted)]
class MyActor : Actor, IMyActor
{
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

## Next steps
 - [Actor type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)
 - [Actor polymorphism and object-oriented design patterns](service-fabric-reliable-actors-polymorphism.md)
 - [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
 - [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure/servicefabric-samples)
