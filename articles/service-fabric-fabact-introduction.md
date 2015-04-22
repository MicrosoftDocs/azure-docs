<properties
   pageTitle="Azure Service Fabric Actors Overview"
   description="Introduction to Azure Service Fabric Actors programming model"
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/02/2015"
   ms.author="claudioc"/>

# Introduction to Azure Service Fabric Actors
Azure Service Fabric Actors is an Actor programming model for [Service Fabric](service-fabric-technical-overview.md). Service Fabric is a platform for building highly reliable, scalable applications for both cloud and on premise that are easy to develop and manage.

Fabric Actors provides an asynchronous, single-threaded actor model. An actor represents a unit of state and computation. Actors are distributed throughout the cluster to achieve high scalability. When a process hosting the actor fails, the system recreates the actor in another process. Similarly, when the node on which the actor's host process is running fails, the system recreates the actor in a host process on another node. The framework leverages the distributed store provided by underlying Service Fabric platform to provide highly available and consistent state management for the actors. This makes developing and maintaining actor-based distributed cloud applications extremely easy.

## Actors
The actors are isolated single-threaded components that encapsulate both state and behavior. They are similar to .NET objects and hence provide a natural programming model to the developers. Every actor is an instance of an actor type, similar to the way a .NET object is an instance of a .NET type. For example, there may be an actor type that implements the functionality of a calculator and there could be many actors of that type that are distributed on various nodes across a cluster. Each such actor is uniquely identified by an actor ID.

Actors interact with rest of the system, including other actors, by passing asynchronous messages with request-response pattern. These interactions are defined in an interface as asynchronous methods. For example, the interface for an actor type that implements the functionality of a calculator may be defined as follows.

```csharp
public interface ICalculatorActor : IActor
{
    Task<double> AddAsync(double valueOne, double valueTwo);
    Task<double> SubtractAsync(double valueOne, double valueTwo);
}
```

An actor type may implement the above interface as follows:

```csharp
public class CalculatorActor : Actor, ICalculatorActor
{
    public Task<double> AddAsync(double valueOne, double valueTwo)
    {
        return Task.FromResult(valueOne + valueTwo);
    }

    public Task<double> SubtractAsync(double valueOne, double valueTwo)
    {
        return Task.FromResult(valueOne - valueTwo);
    }
}
```

The implementation of these methods does not involve dealing with locking or other concurrency issues because the framework provides turn-based concurrency for the actor methods. More details on this are in the [Concurrency](#concurrency) section.

## Actors and the Service Fabric Application Model
Actors use the Service Fabric application model to manage the application lifecycle. The actor code is packaged as a Service Fabric application and deployed to the cluster. Subsequent management (i.e. upgrades and eventual deletion) of the application is also performed using Service Fabric application management mechanisms. For more information, please see the topics on the [application model](service-fabric-application-model.md), [application deployment and removal](service-fabric-deploy-remove-applications.md), and [application upgrade](service-fabric-application-upgrade.md).

Every Actor type is mapped to a Service Fabric Service type. Cluster administrators can create one or more services of each service type in the cluster. Each of those actor services can have one or more partitions (similar to any other Service Fabric service). The ability to create multiple services of a service type (which maps to an actor type) and the ability to create multiple partitions for a service allow the actor application to scale. Please see the section on service and partition scaling for more information on techniques to achieve scalability.

The actor ID of an actor is mapped to a partition of an actor service. The actor is created within the partition that its actor ID maps to.

## Actor Communication
The actor framework provides communication between an actor instance and an actor client. To communicate with an actor, a client creates an actor proxy object that implements the actor interface. The client interacts with the actor by invoking methods on the proxy object. The actor proxy can be used for client-to-actor as well as actor-to-actor communication. Continuing our calculator example, the client code for a calculator actor could be written as shown below:

```csharp
ActorId actorId = ActorId.NewId();
string applicationName = "fabric:/CalculatorActorApp";
ICalculatorActor calculatorActor = ActorProxy.Create<ICalculatorActor>(actorId, applicationName);
double result = calculatorActor.AddAsync(2, 3).Result;
```

As shown in the above example, there were two pieces of information that were used to create the actor proxy object - the actor ID and the application name. The actor ID is an identifier that uniquely identifies the actor. The application name is the name of the Service Fabric application that the actor is deployed as.

The actors are virtual actors meaning that they always exist. You do not need to explicitly create them nor destroy them. The framework automatically activates an actor the first time it receives a request for that actor. If an actor is not used for certain time the framework will garbage collect it and will activate it at later time if required. More details on this are in the section on [Actor lifecycle and Garbage Collection](service-fabric-fabact-lifecycle.md).

The framework also provides the location transparency and failover. The `ActorProxy` class on the client side performs the necessary resolution and locates the actor service partition where the actor with the specified ID is hosted and opens a communication channel with it. The `ActorProxy` retries on the communication failures and in case of failovers.  This means that it is possible for an Actor implementation to get duplicate messages from the same client.

## Concurrency
Actor framework provides a simple turn-based concurrency for actor methods. This means that no more than one thread can be active inside the actor code at any time.

A turn consists of the complete execution of an actor method in response to the request from other actors or clients, or the complete execution of a timer/reminder callback. Even though these methods and callbacks are asynchronous, the framework does not interleave them. A turn must be fully completed before a new turn is allowed. In other words, an actor method or timer/reminder callback that is currently executing must be completed fully before a new call to a method or a callback is allowed. A method or callback is considered completed if execution has returned from the method or callback, and the Task returned by the method or callback has completed. It is worth emphasizing that turn-based concurrency is respected even across different methods, timers and callbacks.

The following example illustrates the above concepts. Consider an actor that implements two asynchronous methods (say Method1 and Method2), a timer and a reminder. The framework guarantees that while Method2 is executing in response to a client request, it will not invoke Method1 or Method2 on behalf of any other client request. In addition, it will not invoke any timer or reminder callbacks while Method2 is executing. Any new method or timer/reminder callback will be invoked only after the execution has returned from Method2 and the Task returned by Method2 has completed.

The framework however, allows reentrancy by default. This means that if an actor method of Actor A calls method on Actor B which in turn calls another method on actor A, that method is allowed to run as it is part of the same logical call chain context. All timer and reminder calls start with the new logical call context. See [Reentrancy](service-fabric-fabact-reentrancy.md) section for more details.

The framework provides these concurrency guarantees in situations where it controls the invocation of these methods. For example, it provides these guarantees for the method invocations that are done in response to receiving a client request and for timer and reminder callbacks. However, if the actor code directly invokes these methods outside of the mechanisms provided by the framework, then the framework cannot provide any concurrency guarantees. For example, if the method is invoked in the context of some Task that is not associated with the Task returned by the actor methods, or if it is invoked from a thread that the actor creates on its own, then the framework cannot provide concurrency guarantees. Therefore, to perform background operations, actors should use [Actor Timers or Actor Reminders](service-fabric-fabact-timers-reminders.md) that respect the turn-based concurrency.

## Actor State Management
Fabric Actors allows you to create the actors that are either stateless or stateful.

### Stateless Actors
Stateless actors, as the name suggests, do not have any state that is managed by the framework. The stateless actors derive from Actor base class. They can have member variables and those would be preserved throughout the lifetime of that actor just like any other .NET types. However if that actor instance is garbage collected after being idle for some time it would lose the state stored in its member variables. Similarly, state could be lost due to failovers, which could happen in situations such as upgrades, resource-balancing operations or the failure of an actor process or of the node hosting the actor process.

Following is an example of a stateless actor.

```csharp
class HelloActor : Actor, IHello
{
    public Task<string> SayHello(string greeting)
    {
        return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
    }
}
```

Stateless actors are created within a partition of a Service Fabric stateless service. The actor ID determines which partition the actor is created under. The actor is created inside one or more instances within that partition. Indeed, it is possible that multiple instances within a partition each have an active actor with the same actor ID.

### Stateful Actors
Stateful  actors have a state that needs to be preserved across actor garbage collections and failovers. The stateful actors derive from `Actor<TState>` base class where `TState` is the type of the state that needs to be preserved across garbage collections and failovers. The state can be accessed in the actor methods via `State` property on the base class `Actor<TState>`.  Following is an example of a stateful actor accessing the state.

```csharp
class VoicemailBoxActor : Actor<VoicemailBox>, IVoicemailBoxActor
{
    public Task<List<Voicemail>> GetMessagesAsync()
    {
        return Task.FromResult(State.MessageList);
    }
    ...
}
```

Stateful actors are created within a partition of the Service Fabric stateful service. The actor ID determines which partition the actor is created under. Each partition of the service can have one or more replicas that are placed on different nodes in the cluster. Having multiple replicas provides reliability for the actor state. The resource manager optimizes the placement based on the available fault and upgrade domains in the cluster. Two replicas of the same partition are never placed on the same node. The actors are always created in the primary replica of the partition to which their actor ID maps to.

The storage and retrieval of the state is provided by an actor state provider. State provider can be configured per actor or for all actors within an assembly by the state provider specific attribute. There are few default actor state providers that are included in the framework. The durability and reliability of the state is determined by the guarantees offered by the state provider. When an actor is activated its state is loaded in memory. When an actor method completes, the modified state is automatically saved by the framework by calling a method on the state provider. If failure occurs during the save state, the framework recycles that actor instance. A new actor instance is created and loaded with the last consistent state from the state provider.

By default a stateful actor uses key value store actor state provider. This state provider is built on the distributed Key-Value store provided by Service Fabric platform. The state is durably saved on the local disk of the node hosting the primary replica, as well as replicated and durably saved on the local disks of nodes hosting the secondary replicas. The state save is complete only when a quorum of replicas has committed the state to their local disks. The Key-Value store has advanced capabilities to detect inconsistencies such as false progress and correct them automatically.

The framework also includes a `VolatileActorStateProvider`. This state provider replicates the state to replicas but the state remains in-memory on the replica. If one replica goes down and comes back up, its state is rebuilt from the other replica. However if all of the replicas (copies of the state) go down simultaneously the state data will be lost. Therefore, this state provider is suitable for applications where the data can survive failures of few replicas and can survive the planned failovers such as upgrades. If all replicas (copies) are lost, then the data needs to be recreated using mechanisms external to Service Fabric. You can configure your stateful actor to use volatile actor state provider by adding the `VolatileActorStateProvider` attribute to the actor class or an assembly level attribute.

The following code snippet shows how to changes all actors in the assembly that does not have an explicit state provider attribute to use `VolatileActorStateProvider`.

```csharp
[assembly:Microsoft.ServiceFabric.Actors.VolatileActorStateProvider]
```

The following code snippet shows how to change the state provider for a particular actor type, `VoicemailBox` in this case, to be `VolatileActorStateProvider`.

```csharp
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

### Readonly Methods
By default the framework saves Actor state upon the completion of an actor method call, timer callback and reminder callback. No other actor call is allowed until the save state is complete.  Depending upon the state provider, saving state may take time and during this time no other actor calls are being allowed in the actor. For example, the default `KvsActorStateProvider` replicates the data to a replica set and only when a quorum of replicas have committed the data to a persisted store, the save state is completed.

There may be actor methods that do not modify the state and in that case the additional time spent on saving the state can affect the overall throughput of the system. To avoid that you can mark the methods and timer callbacks that do not modify the state as read-only.

The example below shows how to mark an actor method as read-only using `Readonly` attribute.

```csharp
public interface IVoicemailBoxActor : IActor
{
    [Readonly]
    Task<List<Voicemail>> GetMessagesAsync();
}
```

Timer callbacks can be marked with the `Readonly` attribute in a similar way. For reminders, the read-only flag is passed in as an argument to the `RegisterReminder` method that is invoked to register the reminder.

## Next steps
### Concepts
[Actor Lifecycle and Garbage Collection](service-fabric-fabact-lifecycle.md)

[Actor Timers & Reminders](service-fabric-fabact-timers-reminders.md)

[Actor Events](service-fabric-fabact-events.md)

[Actor Reentrancy](service-fabric-fabact-reentrancy.md)
