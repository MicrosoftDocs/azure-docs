---
title: Enumerate actors on Azure Service Fabric 
description: Learn about enumeration of Reliable Actors and their metadata in an Azure Service Fabric application using examples.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Enumerate Service Fabric Reliable Actors
The Reliable Actors service allows a client to enumerate metadata about the actors that the service is hosting. Because the actor service is a partitioned stateful service, enumeration is performed per partition. Because each partition might contain many actors, the enumeration is returned as a set of paged results. The pages are looped over until all pages are read. The following example shows how to create a list of all [active](service-fabric-reliable-actors-lifecycle.md) actors in one partition of an actor service:

```csharp
IActorService actorServiceProxy = ActorServiceProxy.Create(
    new Uri("fabric:/MyApp/MyService"), partitionKey);

ContinuationToken continuationToken = null;
List<ActorInformation> activeActors = new List<ActorInformation>();

do
{
    PagedResult<ActorInformation> page = await actorServiceProxy.GetActorsAsync(continuationToken, cancellationToken);

    activeActors.AddRange(page.Items.Where(x => x.IsActive));

    continuationToken = page.ContinuationToken;
}
while (continuationToken != null);
```

```Java
ActorService actorServiceProxy = ActorServiceProxy.create(
    new URI("fabric:/MyApp/MyService"), partitionKey);

ContinuationToken continuationToken = null;
List<ActorInformation> activeActors = new ArrayList<ActorInformation>();

do
{
    PagedResult<ActorInformation> page = actorServiceProxy.getActorsAsync(continuationToken);

    while(ActorInformation x: page.getItems())
    {
         if(x.isActive()){
              activeActors.add(x);
         }
    }

    continuationToken = page.getContinuationToken();
}
while (continuationToken != null);
```

While the code above will retrieve all the actors in a given partition, occasionally the need will arise to query the IDs of all actors (active or inactive) across each partition. This should be done by exception as it's quite a heavy task.

The following example demonstrates how to query the partitions of the service and iterate through each in combination with the above example to produce a list of all the active and inactive actors in the service across the Service Fabric application:


```csharp

var serviceName = new Uri("fabric:/MyApp/MyService");

//As the FabricClient is expensive to create, it should be shared as much as possible
FabricClient fabricClient = new();

//List each of the service's partitions
ServicePartitionList partitions = await fabricClient.QueryManager.GetPartitionListAsync(serviceName);

List<Guid> actorIds = new();

foreach(var partition in partitions)
{
    //Retrieve the partition information
    Int64RangePartitionInformation partitionInformation = (Int64RangePartitionInformation)partition.PartitionInformation; //Actors are restricted to the uniform Int64 scheme per https://learn.microsoft.com/azure/service-fabric/service-fabric-reliable-actors-introduction#distribution-and-failover
    IActorService actorServiceProxy = ActorServiceProxy.Create(serviceName, partitionInformation.LowKey);
    
    ContinuationToken? continuationToken = null;
    
    do 
    {
        var page = await actorServiceProxy.GetActorsAsync(continuationToken, cancellationToken);
        actorIds.AddRange(page.Items.Select(actor => actor.ActorId.GetGuidId());
        continuationToken = page.ContinuationToken;
    } while (continuationToken != null);
}

return actorIds;
```


## Next steps
* [Actor state management](service-fabric-reliable-actors-state-management.md)
* [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
* [Actors API reference documentation](/previous-versions/azure/dn971626(v=azure.100))
* [.NET sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java sample code](https://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-platform/actor-service.png
[2]: ./media/service-fabric-reliable-actors-platform/app-deployment-scripts.png
[3]: ./media/service-fabric-reliable-actors-platform/actor-partition-info.png
[4]: ./media/service-fabric-reliable-actors-platform/actor-replica-role.png
[5]: ./media/service-fabric-reliable-actors-introduction/distribution.png
