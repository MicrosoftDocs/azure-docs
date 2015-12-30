<properties
   pageTitle="Service Fabric Reliable Actors overview | Microsoft Azure"
   description="Introduction to the Service Fabric Reliable Actors programming model"
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
   ms.date="08/05/2015"
   ms.author="vturecek"/>

# Introduction to Service Fabric Reliable Actors
The Reliable Actors API is one of two high-level frameworks provided by [Azure Service Fabric](service-fabric-technical-overview.md), along with the [Reliable Services API](service-fabric-reliable-services-introduction.md).

Based on the actor pattern, the Reliable Actors API provides an asynchronous, single-threaded programming model that simplifies your code while still taking advantage of the scalability and reliability that Service Fabric provides.

## Actors
Actors are isolated, single-threaded components that encapsulate both state and behavior. They are similar to .NET objects, and they therefore provide a natural programming model. Every actor is an instance of an actor type, similar to the way a .NET object is an instance of a .NET type. For example, an actor type may implement the functionality of a calculator, and many actors of that type could be distributed on various nodes across a cluster. Each such actor is uniquely identified by an actor ID.

## Defining and implementing actor interfaces

Actors interact with rest of the system, including other actors, by passing asynchronous messages using a request-response pattern. These interactions are defined in an interface as asynchronous methods. For example, the interface for an actor type that implements the functionality of a calculator might be defined as follows:

```csharp
public interface ICalculatorActor : IActor
{
    Task<double> AddAsync(double valueOne, double valueTwo);
    Task<double> SubtractAsync(double valueOne, double valueTwo);
}
```

An actor type could implement this interface as follows:

```csharp
public class CalculatorActor : StatelessActor, ICalculatorActor
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

Because method invocations and their responses ultimately result in network requests across the cluster, the arguments and the result types of the tasks that they return must be serializable by the platform. In particular, they must be [data contract serializable](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

> [AZURE.TIP] The Service Fabric Actors runtime emits some [events and performance counters related to actor methods](service-fabric-reliable-actors-diagnostics.md#actor-method-events-and-performance-counters). They are useful in diagnostics and in monitoring performance.

The following rules pertaining to actor interface methods are worth mentioning:
- Actor interface methods cannot be overloaded.
- Actor interface methods must not have out, ref, or optional parameters.

## Actor communication
### The actor proxy
The Reliable Actors client API provides communication between an actor instance and an actor client. To communicate with an actor, a client creates an actor proxy object that implements the actor interface. The client interacts with the actor by invoking methods on the proxy object. The actor proxy can be used for client-to-actor as well as actor-to-actor communication. Continuing our calculator example, the client code for a calculator actor could be written as:

```csharp
ActorId actorId = ActorId.NewId();
string applicationName = "fabric:/CalculatorActorApp";
ICalculatorActor calculatorActor = ActorProxy.Create<ICalculatorActor>(actorId, applicationName);
double result = calculatorActor.AddAsync(2, 3).Result;
```

Note that the two pieces of information used to create the actor proxy object are the actor ID and the application name. The actor ID uniquely identifies the actor, while the application name identifies the [Service Fabric application](service-fabric-reliable-actors-platform.md#service-fabric-application-model-concepts-for-actors) where the actor is deployed.

### Actor lifetime

Service Fabric actors are virtual, meaning that their lifetime is not tied to their in-memory representation. As a result, they do not need to be explicitly created or destroyed. The Actors runtime automatically activates an actor the first time it receives a request for that actor. If an actor is not used for a certain time, the Actors runtime will garbage-collect the in-memory object. It will also maintain knowledge of the actor's existence should it need to be reactivated later. For more details, see [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md).

### Location transparency and automatic failover

To provide high scalability and reliability, Service Fabric distributes actors throughout the cluster and automatically migrates them from failed nodes to healthy ones as required. The `ActorProxy` class on the client side performs the necessary resolution to locate the actor by ID [partition](service-fabric-reliable-actors-platform.md#service-fabric-partition-concepts-for-actors) and open a communication channel with it. The `ActorProxy` also retries in the cases of communication failures and failovers. This ensures that messages will be reliably delivered despite the presence of faults. But this also means that it is possible for an actor implementation to receive duplicate messages from the same client.

## Concurrency
### Turn-based access

The Actors runtime provides a simple turn-based model for accessing actor methods. This means that no more than one thread can be active inside the actor code at any time.

A turn consists of the complete execution of an actor method in response to a request from other actors or clients, or the complete execution of a [timer/reminder](service-fabric-reliable-actors-timers-reminders.md) callback. Even though these methods and callbacks are asynchronous, the Actors runtime does not interleave them. A turn must be fully completed before a new turn is allowed. In other words, an actor method or timer/reminder callback that is currently executing must be fully completed before a new call to a method or callback is allowed. A method or callback is considered to have completed if the execution has returned from the method or callback and the task returned by the method or callback has completed. It is worth emphasizing that turn-based concurrency is respected even across different methods, timers, and callbacks.

The Actors runtime enforces turn-based concurrency by acquiring a per-actor lock at the beginning of a turn and releasing the lock at the end of the turn. Thus, turn-based concurrency is enforced on a per-actor basis and not across actors. Actor methods and timer/reminder callbacks can execute simultaneously on behalf of different actors.

The following example illustrates the above concepts. Consider an actor type that implements two asynchronous methods (say, *Method1* and *Method2*), a timer, and a reminder. The diagram below shows an example of a timeline for the execution of these methods and callbacks on behalf of two actors (*ActorId1* and *ActorId2*) that belong to this actor type.

![Reliable Actors runtime turn-based concurrency and access][1]

The conventions followed by the above diagram:

- Each vertical line shows the logical flow of execution of a method or a callback on behalf of a particular actor.
- The events marked on each vertical line occur in chronological order, with newer events occurring below older ones.
- Different colors are used for timelines corresponding to different actors.
- Highlighting is used to indicate when the per-actor lock is being held on behalf of a method or callback.

The following points about the above diagram are worth mentioning:

- While *Method1* is executing on behalf of *ActorId2* in response to client request *xyz789*, another client request (*abc123*) arrives that also requires *Method1* to be executed by *ActorId2*. However, the second execution of *Method1* does not begin until the prior execution has completed. Similarly, a reminder registered by *ActorId2* fires while *Method1* is being executed in response to client request *xyz789*. The reminder callback is executed only after both executions of *Method1* are complete. All of this is due to turn-based concurrency being enforced for *ActorId2*.
- Similarly, turn-based concurrency is also enforced for *ActorId1*, as demonstrated by the execution of *Method1*, *Method2*, and the timer callback on behalf of *ActorId1* happening in a serial fashion.
- Execution of *Method1* on behalf of *ActorId1* overlaps with its execution on behalf of *ActorId2*. This is because turn-based concurrency is enforced only within an actor and not across actors.
- In some of the method/callback executions, the `Task` returned by the method/callback completes after the method returns. In some others, the `Task` has already completed by the time the method/callback returns. In both cases, the per-Actor lock is released only after both the method/callback returns and the `Task` completes.

### Reentrancy

The Actors runtime allows reentrancy by default. This means that if an actor method of *Actor A* calls a method on *Actor B*, which in turn calls another method on *Actor A*, that method is allowed to run. This is because it is part of the same logical call-chain context. All timer and reminder calls start with the new logical call context. See the [reentrancy](service-fabric-reliable-actors-reentrancy.md) section for more details.

### Scope of concurrency guarantees

The Actors runtime provides these concurrency guarantees in situations where it controls the invocation of these methods. For example, it provides these guarantees for the method invocations that are done in response to a client request, as well as for timer and reminder callbacks. However, if the actor code directly invokes these methods outside of the mechanisms provided by the Actors runtime, then the runtime cannot provide any concurrency guarantees. For example, if the method is invoked in the context of some task that is not associated with the task returned by the actor methods, then the runtime cannot provide concurrency guarantees. If the method is invoked from a thread that the actor creates on its own, then the runtime also cannot provide concurrency guarantees. Therefore, to perform background operations, actors should use [actor timers and actor reminders](service-fabric-reliable-actors-timers-reminders.md) that respect turn-based concurrency.

> [AZURE.TIP] The Service Fabric Actors runtime emits some [events and performance counters related to concurrency](service-fabric-reliable-actors-diagnostics.md#concurrency-events-and-performance-counters). They are useful in diagnostics and in monitoring performance.

## Actor state management
Service Fabric allows you to create actors that are either stateless or stateful.

### Stateless actors
Stateless actors, which are derived from the `StatelessActor` base class, do not have any state that is managed by the Actors runtime. Their member variables are preserved throughout their in-memory lifetime, just as with any other .NET type. However, when they are garbage-collected after a period of inactivity, their state is lost. Similarly, the state can be lost due to failovers, which can occur during upgrades or resource-balancing operations, or as the result of failures in the actor process or its hosting node.

The following is an example of a stateless actor:

```csharp
class HelloActor : StatelessActor, IHello
{
    public Task<string> SayHello(string greeting)
    {
        return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
    }
}
```

### Stateful actors
Stateful actors have a state that needs to be preserved across garbage collections and failovers. They derive from the `StatefulActor<TState>`, where `TState` is the type of the state that needs to be preserved. The state can be accessed in the actor methods via the `State` property on the base class.  

The following is an example of a stateful actor accessing the state:

```csharp
class VoicemailBoxActor : StatefulActor<VoicemailBox>, IVoicemailBoxActor
{
    public Task<List<Voicemail>> GetMessagesAsync()
    {
        return Task.FromResult(State.MessageList);
    }
    ...
}
```

Actor state is preserved across garbage collections and failovers by persisting it on disk and replicating it across multiple nodes in the cluster. This means that, as with method arguments and return values, the actor state's type must be [data contract serializable](service-fabric-reliable-actors-notes-on-actor-type-serialization.md).

> [AZURE.NOTE] Please refer to the [Reliable Actors notes on serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md) article for more details on how interfaces and Actor state types should be defined.  

#### Actor state providers
The storage and retrieval of the state is provided by an actor state provider. State providers can be configured per actor or for all actors within an assembly by using the state provider specific attribute. When an actor is activated, its state is loaded in memory. When an actor method completes, the Actors runtime automatically saves the modified state by calling a method on the state provider. If failure occurs during the **Save** operation, the Actors runtime creates a new actor instance and loads the last consistent state from the state provider.

By default, stateful actors use the key-value store actor state provider, which is built on the distributed key-value store provided by the Service Fabric platform. See more on [state provider choices](service-fabric-reliable-actors-platform.md#actor-state-provider-choices).

> [AZURE.TIP] The Actors runtime emits some [events and performance counters related to actor state management](service-fabric-reliable-actors-diagnostics.md#actor-state-management-events-and-performance-counters). They are useful in diagnostics and in monitoring performance.

#### Read-only methods
By default, the Actors runtime saves the actor state upon the completion of an actor method call, timer callback, or reminder callback. No other actor call is allowed until the save state is complete.  

There may be actor methods that do not modify the state, though. In that case, the additional time spent on saving the state can affect the overall throughput of the system. To avoid this, you can mark the methods and timer callbacks that do not modify the state as read-only.

This example shows how to mark an actor method as read-only by using the `Readonly` attribute:

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
[Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)

[Actor timers and reminders](service-fabric-reliable-actors-timers-reminders.md)

[Actor events](service-fabric-reliable-actors-events.md)

[Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)

[How Reliable Actors use the Service Fabric platform](service-fabric-reliable-actors-platform.md)

[Configure the KVSActorStateProvider Actor](service-fabric-reliable-actors-kvsactorstateprovider-configuration.md)

[Actor diagnostics and performance-monitoring](service-fabric-reliable-actors-diagnostics.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-introduction/concurrency.png
