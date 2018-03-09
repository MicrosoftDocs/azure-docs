---
title: Reliable Actors on Service Fabric | Microsoft Docs
description: Describes how to use the features of the Service Fabric platform.
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
ms.date: 09/20/2017
ms.author: vturecek

---
# Using the actor service
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

## Actor service methods
The Actor service implements `IActorService` (C#) or `ActorService` (Java), which in turn implements `IService` (C#) or `Service` (Java). This is the interface used by Reliable Services remoting, which allows remote procedure calls on service methods. It contains service-level methods that can be called remotely via service remoting and allow you to enumerate and [delete](service-fabric-actors-delete-actors.md) actors.

### Enumerating actors
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

## Custom actor service
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

## Implementing actor backup and restore
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

## Actor using Remoting V2 Stack
With 2.8 nuget package, users can now use Remoting V2 stack, which is more performant and provides features like custom Serialization. Remoting V2 is not backward compatible with existing Remoting stack (we are calling now it as V1 Remoting stack).

Following changes are required to use the Remoting V2 Stack.
 1. Add the following assembly attribute on Actor Interfaces.
   ```csharp
   [assembly:FabricTransportActorRemotingProvider(RemotingListener = RemotingListener.V2Listener,RemotingClient = RemotingClient.V2Client)]
   ```

 2. Build and Upgrade ActorService And Actor Client projects to start using V2 Stack.

### Actor Service Upgrade to Remoting V2 Stack without impacting Service Availability.
This change will be a 2-step upgrade. Follow the steps in the same sequence as listed.

1.  Add the following assembly attribute on Actor Interfaces. This attribute will start two listeners for ActorService, V1 (existing) and V2 Listener. Upgrade ActorService with this change.

  ```csharp
  [assembly:FabricTransportActorRemotingProvider(RemotingListener = RemotingListener.CompatListener,RemotingClient = RemotingClient.V2Client)]
  ```

2. Upgrade ActorClients after completing the above upgrade.
This step makes sure Actor Proxy is using Remoting V2 Stack.

3. This step is optional. Change the above attribute to remove V1 Listener.

    ```csharp
    [assembly:FabricTransportActorRemotingProvider(RemotingListener = RemotingListener.V2Listener,RemotingClient = RemotingClient.V2Client)]
    ```

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
