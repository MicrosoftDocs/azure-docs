---
title: Implement features in Azure Service Fabric actors | Microsoft Docs
description: Describes how to write your own actor service that implements service-level features in the same way as when you inherit StatefulService.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: amanbha

ms.assetid: 45839a7f-0536-46f1-ae2b-8ba3556407fb
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/19/2018
ms.author: vturecek

---
# Implement service-level features in your actor service

As described in [service layering](service-fabric-reliable-actors-platform.md#service-layering), the actor service itself is a reliable service. You can write your own service that derives from `ActorService`. You also can implement service-level features in the same way as when you inherit a stateful service, such as:

- Service backup and restore.
- Shared functionality for all actors, for example, a circuit breaker.
- Remote procedure calls on the actor service itself and on each individual actor.

## Use the actor service

Actor instances have access to the actor service in which they are running. Through the actor service, actor instances can programmatically obtain the service context. The service context has the partition ID, service name, application name, and other Azure Service Fabric platform-specific information.

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

Like all Reliable Services, the actor service must be registered with a service type in the Service Fabric runtime. For the actor service to run your actor instances, your actor type also must be registered with the actor service. The `ActorRuntime` registration method performs this work for actors. In the simplest case, you can register your actor type, and the actor service then uses the default settings.

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

Alternatively, you can use a lambda provided by the registration method to construct the actor service yourself. You then can configure the actor service and explicitly construct your actor instances. You can inject dependencies to your actor through its constructor.

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

The actor service implements `IActorService` (C#) or `ActorService` (Java), which in turn implements `IService` (C#) or `Service` (Java). This interface is used by Reliable Services remoting, which allows remote procedure calls on service methods. It contains service-level methods that can be called remotely via service remoting. You can use it to [enumerate](service-fabric-reliable-actors-enumerate.md) and [delete](service-fabric-reliable-actors-delete-actors.md) actors.


## Custom actor service

By using the actor registration lambda, you can register your own custom actor service that derives from `ActorService` (C#) and `FabricActorService` (Java). You then can implement your own service-level functionality by writing a service class that inherits `ActorService` (C#) or `FabricActorService` (Java). A custom actor service inherits all the actor runtime functionality from `ActorService` (C#) or `FabricActorService` (Java). It can be used to implement your own service methods.

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

## Implement actor backup and restore

A custom actor service can expose a method to back up actor data by taking advantage of the remoting listener already present in `ActorService`. For an example, see [Backup and restore actors](service-fabric-reliable-actors-backup-and-restore.md).

## Actor that uses a remoting V2 (interface compatible) stack

The remoting V2 (interface compatible, known as V2_1) stack has all the features of the V2 remoting stack. Its interface is compatible with the remoting V1 stack, but it is not backward compatible with V2 and V1. To upgrade from V1 to V2_1 with no effects on service availability, follow the steps in the next section.

The following changes are required to use the remoting V2_1 stack:

 1. Add the following assembly attribute on actor interfaces.
  
   ```csharp
   [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
   ```

 2. Build and upgrade actor service and actor client projects to start using the V2 stack.

### Actor service upgrade to remoting V2 (interface compatible) stack without affecting service availability

This change is a two-step upgrade. Follow the steps in this sequence.

1. Add the following assembly attribute on actor interfaces. This attribute starts two listeners for the actor service, V1 (existing) and the V2_1 listener. Upgrade the actor service with this change.

  ```csharp
  [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V1|RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
  ```

2. Upgrade the actor clients after you complete the previous upgrade.
This step makes sure that the actor proxy uses the remoting V2_1 stack.

3. This step is optional. Change the previous attribute to remove the V1 listener.

    ```csharp
    [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
    ```

## Actor that uses the remoting V2 stack

With the version 2.8 NuGet package, users can now use the remoting V2 stack, which performs better and provides features like custom serialization. Remoting V2 is not backward compatible with the existing remoting stack (now called the V1 remoting stack).

The following changes are required to use the remoting V2 stack.

 1. Add the following assembly attribute on actor interfaces.

   ```csharp
   [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2,RemotingClientVersion = RemotingClientVersion.V2)]
   ```

 2. Build and upgrade the actor service and actor client projects to start using the V2 stack.

### Upgrade the actor service to the remoting V2 stack without affecting service availability

This change is a two-step upgrade. Follow the steps in this sequence.

1. Add the following assembly attribute on actor interfaces. This attribute starts two listeners for the actor service, V1 (existing) and the V2 listener. Upgrade the actor service with this change.

  ```csharp
  [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V1|RemotingListenerVersion.V2,RemotingClientVersion = RemotingClientVersion.V2)]
  ```

2. Upgrade the actor clients after you complete the previous upgrade.
This step makes sure that the actor proxy uses the remoting V2 stack.

3. This step is optional. Change the previous attribute to remove the V1 listener.

    ```csharp
    [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2,RemotingClientVersion = RemotingClientVersion.V2)]
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
