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

Fabric Actors provides an asynchronous, single-threaded actor model. An actor represents a unit of state and computation. Actors are distributed throughout the cluster to achieve high scalability. When a process hosting the actor fails, the system recreates the actor in another process. Similarly, when the node on which the actor's host process is running fails, the system recreates the actor in a host process on another node. The Actors runtime leverages the distributed store provided by underlying Service Fabric platform to provide highly available and consistent state management for the actors. This makes developing and maintaining actor-based distributed cloud applications extremely easy.

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

For each interface method, the arguments and the result type of the Task that it returns must be [data contract serializable](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

The implementation of these methods does not involve dealing with locking or other concurrency issues because the Actors runtime provides turn-based concurrency for the actor methods. More details on this are in the [Concurrency](#concurrency) section.

> [AZURE.TIP] The Fabric Actors runtime emits some [events and performance counters related to actor methods](service-fabric-reliable-actors-diagnostics.md#actor-method-events-and-performance-counters). They are useful in diagnostics and performance monitoring.

## Actor Communication
The Actors client API provides communication between an actor instance and an actor client. To communicate with an actor, a client creates an actor proxy object that implements the actor interface. The client interacts with the actor by invoking methods on the proxy object. The actor proxy can be used for client-to-actor as well as actor-to-actor communication. Continuing our calculator example, the client code for a calculator actor could be written as shown below:

```csharp
ActorId actorId = ActorId.NewId();
string applicationName = "fabric:/CalculatorActorApp";
ICalculatorActor calculatorActor = ActorProxy.Create<ICalculatorActor>(actorId, applicationName);
double result = calculatorActor.AddAsync(2, 3).Result;
```

As shown in the above example, there were two pieces of information that were used to create the actor proxy object - the actor ID and the application name. The actor ID is an identifier that uniquely identifies the actor. The application name is the name of the [Service Fabric application](service-fabric-reliable-actors-platform.md#service-fabric-application-model-concepts-for-actors) that the actor is deployed as.

The actors are virtual actors meaning that they always exist. You do not need to explicitly create them nor destroy them. The Actors runtime automatically activates an actor the first time it receives a request for that actor. If an actor is not used for certain time the Actors runtime will garbage collect it and will activate it at later time if required. More details on this are in the section on [Actor lifecycle and Garbage Collection](service-fabric-reliable-actors-lifecycle.md).

The Actors client API also provides the location transparency and failover. The `ActorProxy` class on the client side performs the necessary resolution and locates the actor service [partition](service-fabric-reliable-actors-platform.md#service-fabric-partition-concepts-for-actors) where the actor with the specified ID is hosted and opens a communication channel with it. The `ActorProxy` retries on the communication failures and in case of failovers.  This means that it is possible for an Actor implementation to get duplicate messages from the same client.

## Concurrency
The Actors runtime provides a simple turn-based concurrency for actor methods. This means that no more than one thread can be active inside the actor code at any time.

A turn consists of the complete execution of an actor method in response to the request from other actors or clients, or the complete execution of a [timer/reminder](service-fabric-reliable-actors-timers-reminders.md) callback. Even though these methods and callbacks are asynchronous, the Actors runtime does not interleave them. A turn must be fully completed before a new turn is allowed. In other words, an actor method or timer/reminder callback that is currently executing must be completed fully before a new call to a method or a callback is allowed. A method or callback is considered completed if execution has returned from the method or callback, and the Task returned by the method or callback has completed. It is worth emphasizing that turn-based concurrency is respected even across different methods, timers and callbacks.

The Actors runtime enforces turn-based concurrency by acquiring a per-actor lock at the beginning of a turn and releasing the lock at the end of the turn. Thus, turn-based concurrency is enforced on a per-actor basis and not across actors. Actor methods and timer/reminder callbacks can execute simultaneously on behalf of different actors.

The following example illustrates the above concepts. Consider an actor type that implements two asynchronous methods (say *Method1* and *Method2*), a timer and a reminder. The diagram below shows an example of a timeline for the execution of these methods and callbacks on behalf of two actors - *ActorId1* and *ActorId2* - that belong to this actor type.

![][1]

The conventions followed by the above diagram are:

- Each vertical line shows the logical flow of execution of a method or a callback on behalf of a particular actor.
- The events marked on each vertical line occur in chronological order with newer events occurring below the older ones.
- Different colors are used for timelines corresponding to different actors.
- Highlighting is used to indicate the duration for which the per-actor lock is held on behalf of a method or callback.

The following points about the above diagram are worth mentioning:

- When *Method1* is executing on behalf of *ActorId2* in response to client request *xyz789*, another client request *abc123* arrives that also requires *Method1* to be executed by *ActorId2*. However, the latter execution of *Method1* does not begin until the former execution has completed. Similarly, a reminder registered by *ActorId2* fires while *Method1* is being executed in response to client request *xyz789*. The reminder callback is executed only after both executions of *Method1* are complete. All of this is due to turn-based concurrency being enforced for *ActorId2*.
- Similarly, turn-based concurrency is also enforced for *ActorId1*, as demonstrated by the execution of *Method1*, *Method2* and the timer callback on behalf of *ActorId1* happening in a serial fashion.
- Execution of *Method1* on behalf of *ActorId1* overlaps with its execution on behalf of *ActorId2*. This is because turn-based concurrency is only enforced within an actor and not across actors.
- In some of the method/callback executions, the `Task` returned by the method/callback completes after the method returns. In some others, the `Task` is already complete by the time the method/callback returns. In either case, the per-actor lock is released only after the both of these happen, i.e. after the method/callback returns and the `Task` completes.

The Actors runtime allows reentrancy by default. This means that if an actor method of Actor A calls method on Actor B which in turn calls another method on actor A, that method is allowed to run as it is part of the same logical call chain context. All timer and reminder calls start with the new logical call context. See [Reentrancy](service-fabric-reliable-actors-reentrancy.md) section for more details.

The Actors runtime provides these concurrency guarantees in situations where it controls the invocation of these methods. For example, it provides these guarantees for the method invocations that are done in response to receiving a client request and for timer and reminder callbacks. However, if the actor code directly invokes these methods outside of the mechanisms provided by the Actors runtime, then the runtime cannot provide any concurrency guarantees. For example, if the method is invoked in the context of some Task that is not associated with the Task returned by the actor methods, or if it is invoked from a thread that the actor creates on its own, then the runtime cannot provide concurrency guarantees. Therefore, to perform background operations, actors should use [Actor Timers or Actor Reminders](service-fabric-reliable-actors-timers-reminders.md) that respect the turn-based concurrency.

> [AZURE.TIP] The Fabric Actors runtime emits some [events and performance counters related to concurrency](service-fabric-reliable-actors-diagnostics.md#concurrency-events-and-performance-counters). They are useful in diagnostics and performance monitoring.

## Actor State Management
Fabric Actors allows you to create the actors that are either stateless or stateful.

### Stateless Actors
Stateless actors, as the name suggests, do not have any state that is managed by the Actors runtime. The stateless actors derive from Actor base class. They can have member variables and those would be preserved throughout the lifetime of that actor just like any other .NET types. However if that actor instance is garbage collected after being idle for some time it would lose the state stored in its member variables. Similarly, state could be lost due to failovers, which could happen in situations such as upgrades, resource-balancing operations or the failure of an actor process or of the node hosting the actor process.

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

The type of the actor state must be [data contract serializable](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

> [Note] please refer to the [Reliable Actors notes on serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md) article for mode details on how interfaces and Actor State types should be defined.  

#### Actor state providers
The storage and retrieval of the state is provided by an actor state provider. State provider can be configured per actor or for all actors within an assembly by the state provider specific attribute. There are some default actor state providers that are included in the Actors runtime. The durability and reliability of the state is determined by the guarantees offered by the state provider. When an actor is activated its state is loaded in memory. When an actor method completes, the modified state is automatically saved by the Actors runtime by calling a method on the state provider. If failure occurs during the save state, the Actors runtime recycles that actor instance. A new actor instance is created and loaded with the last consistent state from the state provider.

By default a stateful actor uses key value store actor state provider. This state provider is built on the distributed Key-Value store provided by Service Fabric platform. For more information, please see the topic on [state provider choices](service-fabric-reliable-actors-platform.md#actor-state-provider-choices).

> [AZURE.TIP] The Fabric Actors runtime emits some [events and performance counters related to actor state management](service-fabric-reliable-actors-diagnostics.md#actor-state-management-events-and-performance-counters). They are useful in diagnostics and performance monitoring.

#### Readonly Methods
By default the Actors runtime saves Actor state upon the completion of an actor method call, timer callback and reminder callback. No other actor call is allowed until the save state is complete.  Depending upon the state provider, saving state may take time and during this time no other actor calls are being allowed in the actor.

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
[Actor Lifecycle and Garbage Collection](service-fabric-reliable-actors-lifecycle.md)

[Actor Timers & Reminders](service-fabric-reliable-actors-timers-reminders.md)

[Actor Events](service-fabric-reliable-actors-events.md)

[Actor Reentrancy](service-fabric-reliable-actors-reentrancy.md)

[How Fabric Actors use the Service Fabric platform](service-fabric-reliable-actors-platform.md)

[Configuring KVSActorStateProvider Actor](service-fabric-reliable-actors-KVSActorstateprovider-configuration.md)

[Actor Diagnostics and Performance Monitoring](service-fabric-reliable-actors-diagnostics.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-introduction/concurrency.png
