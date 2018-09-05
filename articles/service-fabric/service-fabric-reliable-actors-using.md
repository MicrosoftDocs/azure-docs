---
title: Implementing features in Azure Service Fabric actors | Microsoft Docs
description: Describes how to write your own actor service that implements service-level features the same way you would when inheriting StatefulService.
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
# Implementing service-level features in your actor service
As described in [service layering](service-fabric-reliable-actors-platform.md#service-layering), the actor service itself is a reliable service.  You can write your own service that derives from `ActorService` and implement service-level features the same way you would when inheriting StatefulService, such as:

- Service backup and restore.
- Shared functionality for all actors, for example, a circuit breaker.
- Remote procedure calls on the actor service itself and on each individual actor.

## Using the actor service
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
The Actor service implements `IActorService` (C#) or `ActorService` (Java), which in turn implements `IService` (C#) or `Service` (Java). This is the interface used by Reliable Services remoting, which allows remote procedure calls on service methods. It contains service-level methods that can be called remotely via service remoting and allow you to [enumerate](service-fabric-reliable-actors-enumerate.md) and [delete](service-fabric-reliable-actors-delete-actors.md) actors.


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
A custom actor service can expose a method to back up actor data by taking advantage of the remoting listener already present in `ActorService`.  For an example, see [Backup and restore actors](service-fabric-reliable-actors-backup-and-restore.md).

## Actor using Remoting V2(InterfaceCompatible) Stack
Remoting V2(InterfaceCompatible aka V2_1) stack has all the features of V2 Remoting stack besides it is interface compatible stack to Remoting V1 stack but is not backward compatible with V2 and V1. In order to do the upgrade from V1 to V2_1 without impacting service availability, follow below [article](#actor-service-upgrade-to-remoting-v2interfacecompatible-stack-without-impacting-service-availability).

Following changes are required to use the Remoting V2_1 Stack.
 1. Add the following assembly attribute on Actor Interfaces.
   ```csharp
   [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
   ```

 2. Build and Upgrade ActorService And Actor Client projects to start using V2 Stack.

#### Actor Service Upgrade to Remoting V2(InterfaceCompatible) Stack without impacting Service Availability.
This change will be a 2-step upgrade. Follow the steps in the same sequence as listed.

1.  Add the following assembly attribute on Actor Interfaces. This attribute will start two listeners for ActorService, V1 (existing) and V2_1 Listener. Upgrade ActorService with this change.

  ```csharp
  [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V1|RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
  ```

2. Upgrade ActorClients after completing the above upgrade.
This step makes sure Actor Proxy is using Remoting V2_1 Stack.

3. This step is optional. Change the above attribute to remove V1 Listener.

    ```csharp
    [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2_1,RemotingClientVersion = RemotingClientVersion.V2_1)]
    ```

## Actor using Remoting V2 Stack
With 2.8 nuget package, users can now use Remoting V2 stack, which is more performant and provides features like custom Serialization. Remoting V2 is not backward compatible with existing Remoting stack (we are calling now it as V1 Remoting stack).

Following changes are required to use the Remoting V2 Stack.
 1. Add the following assembly attribute on Actor Interfaces.
   ```csharp
   [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V2,RemotingClientVersion = RemotingClientVersion.V2)]
   ```

 2. Build and Upgrade ActorService And Actor Client projects to start using V2 Stack.

#### Actor Service Upgrade to Remoting V2 Stack without impacting Service Availability.
This change will be a 2-step upgrade. Follow the steps in the same sequence as listed.

1.  Add the following assembly attribute on Actor Interfaces. This attribute will start two listeners for ActorService, V1 (existing) and V2 Listener. Upgrade ActorService with this change.

  ```csharp
  [assembly:FabricTransportActorRemotingProvider(RemotingListenerVersion = RemotingListenerVersion.V1|RemotingListenerVersion.V2,RemotingClientVersion = RemotingClientVersion.V2)]
  ```

2. Upgrade ActorClients after completing the above upgrade.
This step makes sure Actor Proxy is using Remoting V2 Stack.

3. This step is optional. Change the above attribute to remove V1 Listener.

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
