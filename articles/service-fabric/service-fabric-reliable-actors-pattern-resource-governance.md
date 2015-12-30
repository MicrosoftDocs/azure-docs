<properties
   pageTitle="Resource governance design pattern | Microsoft Azure"
   description="Design pattern on how Service Fabric Reliable Actors can be used to model application needs to scale up but use constrained resources."
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
   ms.date="11/13/2015"
   ms.author="vturecek"/>

# Reliable Actors design pattern: Resource governance

This pattern and related scenarios are easily recognizable by developers--enterprise or otherwise--who have constrained resources on-premises or in the cloud that they cannot immediately scale. They are also familiar to developers who want to ship large-scale applications and data to the cloud.

In the enterprise, these constrained resources, such as databases, run on scale-up hardware. Anyone with a long enterprise history knows that this is a common situation on-premises. Even at cloud scale, developers see this situation occur when a cloud service attempts to exceed the 64K TCP limit of connections between an address/port tuple. This also occurs in attempts to connect to a cloud-based database that limits the number of concurrent connections.

In the past, this was typically solved by throttling through message-based middleware or by using custom-built pooling and façade mechanisms. These are hard to get right, though, especially when you need to scale the middle tier but still maintain the correct connection counts. It’s a fragile and complex solution.

Like the smart cache pattern, this pattern spans multiple scenarios and customers who already have working systems with constrained resources. Their systems need to scale out not just services, but also their state in-memory, as well as the persisted state in stable storage.

The diagram below illustrates this scenario:

![Stateless actors, partitioning and constrained resources][1]

## Model cache scenarios with actors

You can model access to resources by using an actor or multiple actors that act as proxies to a resource or a group of resources (a connection, for example). You can then either manage the resource directly through individual actors or use a coordination actor that manages the resource actors.

To make this concept more concrete, we will address the common need to work against a partitioned (sharded) storage tier for reasons of performance and scalability. Your first option is fairly basic. You can use a static function to map and resolve your actors to downstream resources. Such a function can, for example, return a connection string with a given input. It is up to you how to implement that function. But this approach comes with drawbacks, such as static affinity that makes it difficult to repartition resources or remap actors to resources.

Here is a simple example. We do modular arithmetic to determine the database name by using **userId**, and we use **region** to identify the database server.

### Resource governance code sample: Static resolution

```csharp
private static string _connectionString = "none";

private static string ResolveConnectionString(long userId, int region)
{
    if (_connectionString == "none")
    {
        // an example of static mapping
        _connectionString = String.Format("Server=SERVER_{0};Database=DB_{0}", region, userId % 4);
    }
    return _connectionString;
}
```

This is simple, but it's not very flexible. Now let’s take a look at a more-advanced and more-useful approach.

First, model the affinity among physical resources and actors. This is done through an actor called a **resolver**. It understands the mapping among users, logical partitions, and physical resources. The resolver maintains its data in a persisted store, but it is cached so it can be looked up easily. As discussed in [the exchange rate sample in the smart cache pattern](service-fabric-reliable-actors-pattern-smart-cache.md), a resolver can proactively fetch the latest information by using a timer. Once the user actor resolves the resource it needs to use, it caches it in a local variable called **_resolution** and uses it during its lifetime.

We chose a look-up-based resolution (illustrated below) over simple hashing or range hashing because of the flexibility it provides in operations. This can include scaling in or out and moving a user from one resource to another.

![A look-up resolver solution][2]

In the illustration above, you can see that the actor B23 first resolves its resource (resolution) **DB1** and caches it. Subsequent operations can now use the cached resolution to access the constrained resource. Since the actors support single-threaded execution, developers no longer need to worry about concurrent access to the resource. See the following code sample for a look at the user and resolver actors.

### Resource governance code sample: Resolver

```csharp
public interface IUser : IActor
{
    Task UpdateProfile(string name, string country, int age);
}

[DataContract]
public class UserState
{
    [DataMember]
    private long _userId;
    [DataMember]
    private string _name;
    [DataMember]
    private string _country;
    [DataMember]
    private int _age;
    [DataMember]
    private Resolution _resolution;
}


public class User : StatefulActor<UserState>, IUser
{
    public override async Task ActivateAsync()
    {
        State._userId = this.GetPrimaryKeyLong();
        var resolver = ActorProxy.Create<IResolver>(0);
        State._resolution = await resolver.ResolveAsync(State._userId);
        await base.ActivateAsync();
    }

    public Task UpdateProfile(string name, string country, int age)
    {
        Console.WriteLine("Using {0}", State._resolution.Resource.ConnectionString);
        // this is where we use the resource...
        return TaskDone.Done;
    }
}
```

#### Resource governance: Resolver example

```csharp
public interface IResolver : IActor
{
    Task<Resolution> ResolveAsync(long entity);
}

[DataContract]
public class ResolverState
{
    ...
}

public class Resolver : StatefulActor<ResolverState>, IResolver
{
    ...

    public Task<Resolution> ResolveAsync(long entityKey)
    {
        if (State._resolutionCache.ContainsKey(entityKey))
            return Task.FromResult(_resolutionCache[entityKey]); // return from cache

        var partitionKey = State._entityPartitions[entityKey]; // resolve partition;
        var resourceKey = State._partitionResources[partitionKey]; // resolve resource;
        var resolution =
            new Resolution()
            {
                Entity = State._entities[entityKey],
                Partition = State._partitions[partitionKey],
                Resource = State._resources[resourceKey]
            }; // create resolution

        State._resolutionCache.Add(entityKey, resolution); // cache the resolution

        return Task.FromResult(resolution);
    }

    ...
}
```

## Access resources with finite capability

Now let’s look at another example: exclusive access to precious resources, such as databases, storage accounts, and file systems with finite throughput capability.
In this scenario, we want to process events by using an actor called **EventProcessor**. This actor is responsible for processing and persisting the event, in this case to a .CSV file for simplicity. We can follow the partitioning approach discussed above to scale out your resources, but we still have to deal with concurrency issues. We chose a file-based example to illustrate this point because writing to a single file from multiple actors will raise concurrency issues. To address this problem, we introduce another actor, called **EventWriter**, that has exclusive ownership of the constrained resources. The scenario is illustrated below:

![Writing and processing events by using EventWriter and EventProcessor][3]

We mark EventProcessor actors as stateless workers, which allows the runtime to scale them across the cluster as necessary. Note that we didn’t use any identifiers in the illustration above for these actors. Stateless actors constitute a pool of workers maintained by the runtime.

In the sample code below, the EventProcessor actor does two things. First, it decides which EventWriter (and therefore resource) to use, and then it invokes the chosen actor to write the processed event. For simplicity, we chose the event type as the identifier for the EventWriter actor. Thus, there is only one EventWriter for this event type, and it provides single-threaded and exclusive access to the resource.

### Resource governance code sample: EventProcessor

```csharp
public interface IEventProcessor : IActor
{
    Task ProcessEventAsync(long eventId, long eventType, DateTime eventTime, string payload);
}

public class EventProcessor : StatelessActor, IEventProcessor
{
    public Task ProcessEventAsync(long eventId, long eventType, DateTime eventTime, string payload)
    {
        // This where we write to constrained resource...
        var eventWriterKey = ResolveWriter(eventType, eventTime);
        var eventWriter = ActorProxy.Create<IEventWriter>(eventWriterKey);

        return eventWriter.WriteEventAsync(eventId, eventType, eventTime, payload);
    }

    private long ResolveWriter(long eventType, DateTime eventTime)
    {
        // To simplify, we are returning event type as to identify the event writer actor.
        return eventType;
    }
}
```

Now let’s have a look at the EventWriter actor. It controls exclusive access to the constrained resource--in this case, the file and writing events to it--but it doesn't do much more.

### Resource governance code sample: EventWriter

```csharp
public interface IEventWriter : IActor
{
    Task WriteEventAsync(long eventId, long eventType, DateTime eventTime, string payload);
    Task WriteEventBufferAsync(long eventId, long eventType, DateTime eventTime, string payload);
}

[DataContract]
public class EventWriterState
{
    [DataMember]
    public string _filename;
}

public class EventWriter : StatefulActor<EventWriterState>, IEventWriter
{
    private StreamWriter _writer;

    protected override Task OnActivateAsync()
    {
        State._filename = string.Format(@"C:\{0}.csv", this.Id);
        _writer = new StreamWriter(_filename);

        return base.OnActivateAsync();
    }

    protected override Task OnDeactivateAsync()
    {
        _writer.Close();
        return base.OnDeactivateAsync();
    }

    public async Task WriteEventAsync(long eventId, long eventType, DateTime eventTime, string payload)
    {
        var text = string.Format("{0}, {1}, {2}, {3}", eventId, eventType, eventTime, payload);
        await _writer.WriteLineAsync(text);
        await _writer.FlushAsync();
    }
 }
```

By using a single actor responsible for the resource, you can add capabilities such as buffering. You can buffer incoming events and write those events periodically by using a timer or when the buffer is full. The following code sample provides a simple timer-based example.

### Resource governance code sample: EventWriter with buffer

```csharp
[DataMember]
public class EventWriterState
{
    [DataMember]
    public string _filename;
    [DataMember]
    public Queue<CustomEvent> _buffer;
}

public class EventWriter : StatefulActor<EventWriterState>, IEventWriter
{
    private StreamWriter _writer;
    private IActorTimer _timer;

    protected override Task OnActivateAsync()
    {
        State._filename = string.Format(@"C:\{0}.csv", this.Id);
        _writer = new StreamWriter(_filename);
        State._buffer = new Queue<CustomEvent>();

        this.RegisterTimer(
            ProcessBatchAsync,
            null,
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(5));

        return base.OnActivateAsync();
    }

    private async Task ProcessBatchAsync(object obj)
    {
        if (State._buffer.Count == 0)
            return;

        while (State._buffer.Count > 0)
        {
            var customEvent = State._buffer.Dequeue();
            await this.WriteEventAsync(customEvent.EventId, customEvent.EventType, customEvent.EventTime, customEvent.Payload);
        }
    }

    public Task WriteEventBufferAsync(long eventId, long eventType, DateTime eventTime, string payload)
    {
        var customEvent = new CustomEvent()
        {
            EventId = eventId,
            EventType = eventType,
            EventTime = eventTime,
            Payload = payload
        };

        State._buffer.Enqueue(customEvent);

        return TaskDone.Done;
    }
}
```

The code above will work well, but clients won't know whether their event made it to the underlying store. To allow buffering and provide clients with information on what is happening to their request, the following approach lets clients wait until their event is written to the .CSV file.

### Resource governance code sample: Asynchronous batching

```csharp
public class AsyncBatchExecutor
{
    private readonly List<TaskCompletionSource<bool>> actionPromises;

    public AsyncBatchExecutor()
    {
        this.actionPromises = new List<TaskCompletionSource<bool>>();
    }

    public int Count
    {
        get
        {
            return actionPromises.Count;
        }
    }

    public Task SubmitNext()
    {
        var resolver = new TaskCompletionSource<bool>();
        actionPromises.Add(resolver);
        return resolver.Task;
    }

    public void Flush()
    {
        foreach (var tcs in actionPromises)
        {
            tcs.TrySetResult(true);

        }
        actionPromises.Clear();
    }
}
```

We will use this class to create and maintain a list of incomplete tasks (to block clients). We will complete them in one pass after we have written the buffered events to storage.

In the EventWriter class, we need to do three things: mark the actor class as reentrant, return the result of **SubmitNext()**, and flush our timer. See the modified code below.

### Resource governance code sample: Buffering with asynchronous batching

```csharp
public class EventWriter : StatefulActor<EventWriterState>, IEventWriter
{
    protected override Task OnActivateAsync()
    {
        State._filename = string.Format(@"C:\{0}.csv", this.GetPrimaryKeyLong());
        _writer = new StreamWriter(_filename);
        State._buffer = new Queue<CustomEvent>();
        _batchExecuter = new AsyncBatchExecutor();

        this.RegisterTimer(
            ProcessBatchAsync,
            null,
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(5));

        return base.OnActivateAsync();
    }

    private async Task ProcessBatchAsync(object obj)
    {
        if (_batchExecuter.Count > 0)
        {
            // take snapshot of the batch tasks
            var batchSnapshot = _batchExecuter;
            _batchExecuter = new AsyncBatchExecutor();

            if (State._buffer.Count == 0)
                return;

            while (State._buffer.Count > 0)
            {
                var customEvent = State._buffer.Dequeue();
                await this.WriteEventAsync(customEvent.EventId, customEvent.EventType, customEvent.EventTime, customEvent.Payload);
            }

            _batchExecuter.Flush();
        }
    }
    ...

    public Task WriteEventBufferAsync(long eventId, long eventType, DateTime eventTime, string payload)
    {
        var customEvent = new CustomEvent()
        {
            EventId = eventId,
            EventType = eventType,
            EventTime = eventTime,
            Payload = payload
        };

        State._buffer.Enqueue(customEvent);

        // we are adding an incomplete task to batch executer and returning this task.
        // this will block until task is completed when we call Flush();
        return _batchExecuter.SubmitNext();
    }
}
```

The ease of this approach belies the enterprise power. By using this architecture, you get:

* Location-independent resource addressing.
* Tunable pool size based simply on changing the number of actors that act on behalf of a resource.
* Client-side coordinated pool usage (as depicted) or server-side (imagine a single actor in front of each of those pools in the image).
* Scalable pool addition (just add actors that represent the new resource).
* Actors that can cache results from back-end resources on demand or pre-cache by using a timer, as demonstrated earlier. This reduces the need to hit back-end resources.
* Efficient asynchronous dispatch.
* A coding environment familiar to any developer, not just middleware specialists.

This pattern is common in scenarios where developers have constrained resources they need to develop against. It is also common when developers build large scale-out systems.


## Next steps

[Pattern: Smart cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Stateful service composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-resource-governance/resourcegovernance_arch1.png
[2]: ./media/service-fabric-reliable-actors-pattern-resource-governance/resourcegovernance_arch2.png
[3]: ./media/service-fabric-reliable-actors-pattern-resource-governance/resourcegovernance_arch3.png
