<properties
   pageTitle="Reliable Actors on Service Fabric | Microsoft Azure"
   description="Describes how Reliable Actors are layered on Reliable Services and use the features of the Service Fabric platform."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor="amanbha"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/06/2016"
   ms.author="vturecek"/>

# How Reliable Actors use the Service Fabric platform

This article explains how Reliable Actors work on the Service Fabric platform. Reliable Actors run in a framework that is hosted in an implementation of a stateful Reliable Service called the *Actor Service*. The Actor Service contains all the components necessary to manage the lifecycle and message dispatching for your actors:

 - The Actor Runtime manages lifecycle, garbage collection, and enforces single-threaded access.
 - An actor service remoting listener accepts remote access calls to actors and sends them to a dispatcher to route to the appropriate actor instance.
 - The Actor State Provider wraps state providers (such as the Reliable Collections state provider) and provides an adapter for actor state management.

These components together form the Reliable Actor framework. 

## Service Layering

Because the Actor Service itself is a Reliable Service, all of the [application model](service-fabric-application-model.md), lifecycle, [packaging](service-fabric-application-model.md#package-an-application), [deployment]((service-fabric-deploy-remove-applications.md#deploy-an-application), upgrade, and scaling concepts of Reliable Services apply the same way to Actor services. 

![Actor Service layering][1]

The diagram above shows the relationship between the Service Fabric application frameworks and user code. Blue elements represent the Reliable Services application framework, orange represents the Reliable Actor framework, and green represents user code. 


In Reliable Services, your service inherits the `StatefulService` class, which itself is derived from `StatefulServiceBase`. (or `StatelessService` for stateless services). In Reliable Actors, you use the Actor Service which is a different implementation of the `StatefulServiceBase` class that implements the actor pattern where your actors execute. Since the Actor Service itself is just an implementation of `StatefulServiceBase`, you can write your own service that derives from `ActorService` and implement service-level features the same way you would when inheriting `StatefulService`, such as:

 - Service back-up and restore.
 - Shared functionality for all Actors, for example, a circuit-breaker.
 - Remoting procedure calls on the actor service itself, as well as on each individual actor. 

### Using the Actor Service

Actor instances have access to the Actor Service in which they are executing. Through the Actor Service, actor instances can programmatically obtain the Service Context which has the partition ID, service name, application name, and other Service Fabric platform-specific information:

```csharp
Task MyActorMethod()
{
    Guid partitionId = this.ActorService.Context.PartitionId;
    string serviceTypeName = this.ActorService.Context.ServiceTypeName;
    Uri serviceInstanceName = this.ActorService.Context.ServiceName;
    string applicationInstanceName = this.ActorService.Context.CodePackageActivationContext.ApplicationName;
}
```

Like all Reliable Services, the Actor Service must be registered with a service type in the Service Fabric runtime. In order for the Actor Service to run your actor instances, your actor type must also be registered with the Actor Service. The `ActorRuntime` registration method performs this work for actors. In the simplest case, you can just register your actor type, and the Actor Service with default settings will implicitly be used:

```csharp
static class Program
{
    private static void Main()
    {
        ActorRuntime.RegisterActorAsync<MyActor>().GetAwaiter().GetResult();

        Thread.Sleep(Timeout.Infinite);
    }
}
```  

Alternatively, you can use a lambda provided by the registration method to construct the Actor Service yourself. This allows you to configure the Actor Service as well as explicitly construct your actor instances, where you can inject dependencies to your actor through its constructor:

```csharp
static class Program
{
    private static void Main()
    {
        ActorRuntime.RegisterActorAsync<MyActor>(
            (context, actorType) => new ActorService(context, actorType, () => new MyActor()))
            .GetAwaiter().GetResult();

        Thread.Sleep(Timeout.Infinite);
    }
}
```

### Actor Service methods

The Actor Service implements `IActorService` which in turn implements `IService`. This is the interface used by Reliable Services remoting, which allows remote procedure calls on service methods. It contains service-level methods that can be called remotely using service remoting.


#### Enumerating actors

The Actor Service allows a client to enumerate metadata about the actors being hosted by the service. Since the Actor Service is a partitioned stateful service, enumeration is performed per partition. Because each partition may contain a large number of actors, the enumeration is return as a set of paged results. The pages are looped over until all pages are read. The following example shows how to create a list of all active actors in one partition of an actor service:

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

#### Deleting actors

The Actor Service also provides a function for deleting actors:

```csharp
ActorId actorToDelete = new ActorId(id);

IActorService myActorServiceProxy = ActorServiceProxy.Create(
    new Uri("fabric:/MyApp/MyService"), actorToDelete);
            
await myActorServiceProxy.DeleteActorAsync(actorToDelete, cancellationToken)
```

For more information on deleting actors and their state, refer to the [actor lifecycle documentation](service-fabric-reliable-actors-lifecycle.md).

### Custom Actor Service

Using the actor registration lambda, you can also register your own custom actor service that derives from `ActorService` where you can implement your own service-level functionality. This is done by writing a service class that inherits `ActorService`. A custom actor service inherits all of the actor runtime functionality from `ActorService` and can be used to implement your own service methods.

```csharp
class MyActorService : ActorService
{
    public MyActorService(StatefulServiceContext context, ActorTypeInformation typeInfo, Func<ActorBase> newActor)
        : base(context, typeInfo, newActor)
    { }
}
```

```csharp
static class Program
{
    private static void Main()
    {
        ActorRuntime.RegisterActorAsync<MyActor>(
            (context, actorType) => new MyActorService(context, actorType, () => new MyActor()))
            .GetAwaiter().GetResult();

        Thread.Sleep(Timeout.Infinite);
    }
}
```


#### Implementing actor back-up and restore

 In the following example, the custom actor service exposes a method to back-up actor data by taking advantage of the remoting listener already present in `ActorService`:

```csharp
public interface IMyActorService : IService
{
    Task BackupActorsAsync();
}

class MyActorService : ActorService, IMyActorService
{
    public MyActorService(StatefulServiceContext context, ActorTypeInformation typeInfo, Func<ActorBase> newActor)
        : base(context, typeInfo, newActor)
    { }

    public Task BackupActorsAsync()
    {
        return this.BackupAsync(new BackupDescription(PerformBackupAsync));
    }
    
    private async Task<bool> PerformBackupAsync(BackupInfo backupInfo, CancellationToken cancellationToken)
    {
        try
        {
           // store the contents of backupInfo.Directory
           return true;
        }
        finally
        {
           Directory.Delete(backupInfo.Directory, recursive: true);
        }
    }
}
```

In this example, `IMyActorService` is a remoting contract that implements `IService` and is then implemented by `MyActorService`. By adding this remoting contract, methods on `IMyActorService` are now also available to a client by creating a remoting proxy using `ActorServiceProxy`:

```csharp
IMyActorService myActorServiceProxy = ActorServiceProxy.Create<IMyActorService>(
    new Uri("fabric:/MyApp/MyService"), ActorId.CreateRandom());

await myActorServiceProxy.BackupActorsAsync();
```


## Application model

Actor services are Reliable Services, so the application model is the same. However, the actor framework build tools generate much of the application model files for you.

### Service Manifest
 
The contents of your actor service's ServiceManifest.xml are generated automatically by the actor framework build tools. This includes:

 - The actor service type. The type name is generated based on your actor project name. Based on the persistence attribute on your actor, the HasPersistedState flag is also set accordingly.
 - Code package.
 - Config package.
 - Resources and endpoints

### Application Manifest

The actor framework build tools automatically create a default service definition for your actor service. The default service properties are populated by the build tools:

 - Replica set count is determined by the persistence attribute on your actor. Each time the persistence attribute on your actor is changed, the replica set count in the default service definition will be reset accordingly.
 - Partition scheme and range is set to Uniform Int64 with the full Int64 key range.

## Service Fabric partition concepts for actors

Actor services are partitioned stateful services. Each partition of an actor service contains a set of actors. Service partitions are automatically distributed over multiple nodes in Service Fabric. Thus, actor instances are distributed as a result.

![Actor partitioning and distribution][5]

Reliable Services can be created with different partition schemes and partition key ranges. The Actor Service uses the Int64 partitioning scheme with the full Int64 key range to map actors to partitions. 

### Actor ID

Each actor that's created in the service has a unique ID associated with it, represented by the `ActorId` class. The `ActorId` is an opaque id value that can be used for uniform distribution of actors across the service partitions by generating random IDs:

```csharp
ActorProxy.Create<IMyActor>(ActorId.CreateRandom());
```

Every `ActorId` is hashed to an Int64, which is why the actor service must use an Int64 partitioning scheme with the full Int64 key range. However, custom ID values can be used for an `ActorID`, including GUIDs, strings, and Int64s. 

```csharp
ActorProxy.Create<IMyActor>(new ActorId(Guid.NewGuid()));
ActorProxy.Create<IMyActor>(new ActorId("myActorId"));
ActorProxy.Create<IMyActor>(new ActorId(1234));
```

When using GUIDs and strings, the values are hashed to an Int64. However, when explicitly providing an Int64 to an `ActorId`, the Int64 will map directly to a partition without further hashing. This can be used to control which partition actors are placed in.

## Next steps
 - [Actor state management](service-fabric-reliable-actors-state-management.md)
 - [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
 - [Actors API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)

 
<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-platform/actor-service.png
[2]: ./media/service-fabric-reliable-actors-platform/app-deployment-scripts.png
[3]: ./media/service-fabric-reliable-actors-platform/actor-partition-info.png
[4]: ./media/service-fabric-reliable-actors-platform/actor-replica-role.png
[5]: ./media/service-fabric-reliable-actors-introduction/distribution.png
