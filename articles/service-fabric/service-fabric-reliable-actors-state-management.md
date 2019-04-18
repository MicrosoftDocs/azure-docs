---
title: Reliable Actors state management | Microsoft Docs
description: Describes how Reliable Actors state is managed, persisted, and replicated for high availability.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: chackdan
editor: ''

ms.assetid: 37cf466a-5293-44c0-a4e0-037e5d292214
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: vturecek

---
# Reliable Actors state management
Reliable Actors are single-threaded objects that can encapsulate both logic and state. Because actors run on Reliable Services, they can maintain state reliably by using the same persistence and replication mechanisms. This way, actors don't lose their state after failures, upon reactivation after garbage collection, or when they are moved around between nodes in a cluster due to resource balancing or upgrades.

## State persistence and replication
All Reliable Actors are considered *stateful* because each actor instance maps to a unique ID. This means that repeated calls to the same actor ID are routed to the same actor instance. In a stateless system, by contrast, client calls are not guaranteed to be routed to the same server every time. For this reason, actor services are always stateful services.

Even though actors are considered stateful, that does not mean they must store state reliably. Actors can choose the level of state persistence and replication based on their data storage requirements:

* **Persisted state**: State is persisted to disk and is replicated to three or more replicas. Persisted state is the most durable state storage option, where state can persist through complete cluster outage.
* **Volatile state**: State is replicated to three or more replicas and only kept in memory. Volatile state provides resilience against node failure and actor failure, and during upgrades and resource balancing. However, state is not persisted to disk. So if all replicas are lost at once, the state is lost as well.
* **No persisted state**: State is not replicated or written to disk, only use for actors that don't need to maintain state reliably.

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
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="Application12Type" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
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

For examples of managing actor state, read [Access, save, and remove Reliable Actors state](service-fabric-reliable-actors-access-save-remove-state.md).

## Best practices
Here are some suggested practices and troubleshooting tips for managing your actor state.

### Make the actor state as granular as possible
This is critical for performance and resource usage of your application. Whenever there is any write/update to the "named state" of an actor, the whole value corresponding to that "named state" is serialized and sent over the network to the secondary replicas.  The secondaries write it to local disk and reply back to the primary replica. When the primary receives acknowledgements from a quorum of secondary replicas, it writes the state to its local disk. For example, suppose the value is a class which has 20 members and a size of 1 MB. Even if you only modified one of the class members which is of size 1 KB, you end up paying the cost of serialization and network and disk writes for the full 1 MB. Similarly, if the value is a collection (such as a list, array, or dictionary), you pay the cost for the complete collection even if you modify one of it's members. The StateManager interface of the actor class is like a dictionary. You should always model the data structure representing actor state on top of this dictionary.
 
### Correctly manage the actor's life-cycle
You should have clear policy about managing the size of state in each partition of an actor service. Your actor service should have a fixed number of actors and reuse them as much as possible. If you continuously create new actors, you must delete them once they are done with their work. The actor framework stores some metadata about each actor that exists. Deleting all the state of an actor does not remove metadata about that actor. You must delete the actor (see [deleting actors and their state](service-fabric-reliable-actors-lifecycle.md#manually-deleting-actors-and-their-state)) to remove all the information about it stored in the system. As an extra check, you should query the actor service (see [enumerating actors](service-fabric-reliable-actors-enumerate.md)) once in a while to make sure the number of actors are within the expected range.
 
If you ever see that database file size of an Actor Service is increasing beyond the expected size, make sure that you are following the preceding guidelines. If you are following these guidelines and are still database file size issues, you should [open a support ticket](service-fabric-support.md) with the product team to get help.

## Next steps

State that's stored in Reliable Actors must be serialized before its written to disk and replicated for high availability. Learn more about [Actor type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

Next, learn more about [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md).
