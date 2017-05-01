---
title: Reliable Actors on Service Fabric | Microsoft Docs
description: Describes how Reliable Actors are layered on Reliable Services and use the features of the Service Fabric platform.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: amanbha

ms.assetid: 45839a7f-0536-46f1-ae2b-8ba3556407fb
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/07/2017
ms.author: vturecek

---
# How Reliable Actors use the Service Fabric platform
This article explains how Reliable Actors work on the Azure Service Fabric platform. Reliable Actors run in a framework that is hosted in an implementation of a stateful reliable service called the *actor service*. The actor service contains all the components necessary to manage the lifecycle and message dispatching for your actors:

* The Actor Runtime manages lifecycle, garbage collection, and enforces single-threaded access.
* An actor service remoting listener accepts remote access calls to actors and sends them to a dispatcher to route to the appropriate actor instance.
* The Actor State Provider wraps state providers (such as the Reliable Collections state provider) and provides an adapter for actor state management.

These components together form the Reliable Actor framework.

## Service layering
Because the actor service itself is a reliable service, all the [application model](service-fabric-application-model.md), lifecycle, [packaging](service-fabric-package-apps.md), [deployment](service-fabric-deploy-remove-applications.md), upgrade, and scaling concepts of Reliable Services apply the same way to actor services. 

![Actor service layering][1]

The preceding diagram shows the relationship between the Service Fabric application frameworks and user code. Blue elements represent the Reliable Services application framework, orange represents the Reliable Actor framework, and green represents user code.

In Reliable Services, your service inherits the `StatefulService` class. This class is itself derived from `StatefulServiceBase` (or `StatelessService` for stateless services). In Reliable Actors, you use the actor service. The actor service is a different implementation of the `StatefulServiceBase` class that implements the actor pattern where your actors run. Because the actor service itself is just an implementation of `StatefulServiceBase`, you can write your own service that derives from `ActorService` and implement service-level features the same way you would when inheriting `StatefulService`, such as:

* Service backup and restore.
* Shared functionality for all actors, for example, a circuit breaker.
* Remote procedure calls on the actor service itself and on each individual actor.

> [!NOTE]
> Stateful services are not currently supported in Java/Linux.

### Using the actor service
Actor instances have access to the actor service in which they are running. Through the actor service, actor instances can programmatically obtain the service context. The service context has the partition ID, service name, application name, and other Service Fabric platform-specific information:

```csharp
Task MyActorMethod()
{
    Guid partitionId = this.ActorService.Context.PartitionId;
    string serviceTypeName = this.ActorService.Context.ServiceTypeName;
    Uri serviceInstanceName = this.ActorService.Context.ServiceName;
    string applicationInstanceName = this.ActorService.Context.CodePackageActivationContext.ApplicationName;
}
```
```Java
CompletableFuture<?> MyActorMethod()
{
    UUID partitionId = this.getActorService().getServiceContext().getPartitionId();
    String serviceTypeName = this.getActorService().getServiceContext().getServiceTypeName();
    URI serviceInstanceName = this.getActorService().getServiceContext().getServiceName();
    String applicationInstanceName = this.getActorService().getServiceContext().getCodePackageActivationContext().getApplicationName();
}
```


Like all Reliable Services, the actor service must be registered with a service type in the Service Fabric runtime. For the actor service to run your actor instances, your actor type must also be registered with the actor service. The `ActorRuntime` registration method performs this work for actors. In the simplest case, you can just register your actor type, and the actor service with default settings will implicitly be used:

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

Alternatively, you can use a lambda provided by the registration method to construct the actor service yourself. You can then configure the actor service and explicitly construct your actor instances, where you can inject dependencies to your actor through its constructor:

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
```Java
static class Program
{
    private static void Main()
    {
      ActorRuntime.registerActorAsync(
              MyActor.class,
              (context, actorTypeInfo) -> new FabricActorService(context, actorTypeInfo),
              timeout);

        Thread.sleep(Long.MAX_VALUE);
    }
}
```

### Actor service methods
The Actor service implements `IActorService` (C#) or `ActorService` (Java), which in turn implements `IService` (C#) or `Service` (Java). This is the interface used by Reliable Services remoting, which allows remote procedure calls on service methods. It contains service-level methods that can be called remotely via service remoting.

#### Enumerating actors
The actor service allows a client to enumerate metadata about the actors that the service is hosting. Because the actor service is a partitioned stateful service, enumeration is performed per partition. Because each partition might contain many actors, the enumeration is returned as a set of paged results. The pages are looped over until all pages are read. The following example shows how to create a list of all active actors in one partition of an actor service:

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

#### Deleting actors
The actor service also provides a function for deleting actors:

```csharp
ActorId actorToDelete = new ActorId(id);

IActorService myActorServiceProxy = ActorServiceProxy.Create(
    new Uri("fabric:/MyApp/MyService"), actorToDelete);

await myActorServiceProxy.DeleteActorAsync(actorToDelete, cancellationToken)
```
```Java
ActorId actorToDelete = new ActorId(id);

ActorService myActorServiceProxy = ActorServiceProxy.create(
    new URI("fabric:/MyApp/MyService"), actorToDelete);

myActorServiceProxy.deleteActorAsync(actorToDelete);
```

For more information on deleting actors and their state, see the [actor lifecycle documentation](service-fabric-reliable-actors-lifecycle.md).

### Custom actor service
By using the actor registration lambda, you can register your own custom actor service that derives from `ActorService` (C#) and `FabricActorService` (Java). In this custom actor service, you can implement your own service-level functionality by writing a service class that inherits `ActorService` (C#) or `FabricActorService` (Java). A custom actor service inherits all the actor runtime functionality from `ActorService` (C#) or `FabricActorService` (Java) and can be used to implement your own service methods.

```csharp
class MyActorService : ActorService
{
    public MyActorService(StatefulServiceContext context, ActorTypeInformation typeInfo, Func<ActorBase> newActor)
        : base(context, typeInfo, newActor)
    { }
}
```
```Java
class MyActorService extends FabricActorService
{
    public MyActorService(StatefulServiceContext context, ActorTypeInformation typeInfo, BiFunction<FabricActorService, ActorId, ActorBase> newActor)
    {
         super(context, typeInfo, newActor);
    }
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
```Java
public class Program
{
    public static void main(String[] args)
    {
        ActorRuntime.registerActorAsync(
                MyActor.class,
                (context, actorTypeInfo) -> new FabricActorService(context, actorTypeInfo),
                timeout);
        Thread.sleep(Long.MAX_VALUE);
    }
}
```

#### Implementing actor backup and restore
 In the following example, the custom actor service exposes a method to back up actor data by taking advantage of the remoting listener already present in `ActorService`:

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
```Java
public interface MyActorService extends Service
{
    CompletableFuture<?> backupActorsAsync();
}

class MyActorServiceImpl extends ActorService implements MyActorService
{
    public MyActorService(StatefulServiceContext context, ActorTypeInformation typeInfo, Func<FabricActorService, ActorId, ActorBase> newActor)
    {
       super(context, typeInfo, newActor);
    }

    public CompletableFuture backupActorsAsync()
    {
        return this.backupAsync(new BackupDescription((backupInfo, cancellationToken) -> performBackupAsync(backupInfo, cancellationToken)));
    }

    private CompletableFuture<Boolean> performBackupAsync(BackupInfo backupInfo, CancellationToken cancellationToken)
    {
        try
        {
           // store the contents of backupInfo.Directory
           return true;
        }
        finally
        {
           deleteDirectory(backupInfo.Directory)
        }
    }

    void deleteDirectory(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
               deleteDirectory(f);
             }
        }
        file.delete();
    }
}
```


In this example, `IMyActorService` is a remoting contract that implements `IService` (C#) and `Service` (Java), and is then implemented by `MyActorService`. By adding this remoting contract, methods on `IMyActorService` are now also available to a client by creating a remoting proxy via `ActorServiceProxy`:

```csharp
IMyActorService myActorServiceProxy = ActorServiceProxy.Create<IMyActorService>(
    new Uri("fabric:/MyApp/MyService"), ActorId.CreateRandom());

await myActorServiceProxy.BackupActorsAsync();
```
```Java
MyActorService myActorServiceProxy = ActorServiceProxy.create(MyActorService.class,
    new URI("fabric:/MyApp/MyService"), actorId);

myActorServiceProxy.backupActorsAsync();
```

## Application model
Actor services are Reliable Services, so the application model is the same. However, the actor framework build tools generate some of the application model files for you.

### Service manifest
The actor framework build tools automatically generate the contents of your actor service's ServiceManifest.xml file. This file includes:

* Actor service type. The type name is generated based on your actor's project name. Based on the persistence attribute on your actor, the HasPersistedState flag is also set accordingly.
* Code package.
* Config package.
* Resources and endpoints.

### Application manifest
The actor framework build tools automatically create a default service definition for your actor service. The build tools populate the default service properties:

* Replica set count is determined by the persistence attribute on your actor. Each time the persistence attribute on your actor is changed, the replica set count in the default service definition is reset accordingly.
* Partition scheme and range are set to Uniform Int64 with the full Int64 key range.

## Service Fabric partition concepts for actors
Actor services are partitioned stateful services. Each partition of an actor service contains a set of actors. Service partitions are automatically distributed over multiple nodes in Service Fabric. Actor instances are distributed as a result.

![Actor partitioning and distribution][5]

Reliable Services can be created with different partition schemes and partition key ranges. The actor service uses the Int64 partitioning scheme with the full Int64 key range to map actors to partitions.

### Actor ID
Each actor that's created in the service has a unique ID associated with it, represented by the `ActorId` class. `ActorId` is an opaque ID value that can be used for uniform distribution of actors across the service partitions by generating random IDs:

```csharp
ActorProxy.Create<IMyActor>(ActorId.CreateRandom());
```
```Java
ActorProxyBase.create<MyActor>(MyActor.class, ActorId.newId());
```


Every `ActorId` is hashed to an Int64. This is why the actor service must use an Int64 partitioning scheme with the full Int64 key range. However, custom ID values can be used for an `ActorID`, including GUIDs/UUIDs, strings, and Int64s.

```csharp
ActorProxy.Create<IMyActor>(new ActorId(Guid.NewGuid()));
ActorProxy.Create<IMyActor>(new ActorId("myActorId"));
ActorProxy.Create<IMyActor>(new ActorId(1234));
```
```Java
ActorProxyBase.create(MyActor.class, new ActorId(UUID.randomUUID()));
ActorProxyBase.create(MyActor.class, new ActorId("myActorId"));
ActorProxyBase.create(MyActor.class, new ActorId(1234));
```

When you're using GUIDs/UUIDs and strings, the values are hashed to an Int64. However, when you're explicitly providing an Int64 to an `ActorId`, the Int64 will map directly to a partition without further hashing. You can use this technique to control which partition the actors are placed in.

## Next steps
* [Actor state management](service-fabric-reliable-actors-state-management.md)
* [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
* [Actors API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
* [.NET sample code](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Java sample code](http://github.com/Azure-Samples/service-fabric-java-getting-started)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-platform/actor-service.png
[2]: ./media/service-fabric-reliable-actors-platform/app-deployment-scripts.png
[3]: ./media/service-fabric-reliable-actors-platform/actor-partition-info.png
[4]: ./media/service-fabric-reliable-actors-platform/actor-replica-role.png
[5]: ./media/service-fabric-reliable-actors-introduction/distribution.png
