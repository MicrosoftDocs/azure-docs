<properties
   pageTitle="Azure Service Fabric Actors Resource Governance design pattern"
   description="Design pattern on how Service Fabric Actors can be used to model application what needs to scale but use constrained resources"
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
   ms.date="03/17/2015"
   ms.author="claudioc"/>

# Azure Service Fabric Actors design pattern: resource governance
This pattern and related scenarios are easily recognizable by developers—enterprise or otherwise—who have constrained resources on-premises or in the cloud, which they cannot immediately scale or that wish to ship large scale applications and data to the cloud.

In the enterprise these constrained resources, such as databases, run on scale-up hardware. Anyone with a long enterprise history knows this is a common situation on-premises. Even at cloud scale, we have seen this situation occur when a cloud service has attempted to exceed the 64K TCP limit of connections between an address/port tuple, or when attempting to connect to a cloud-based database that limits the number of concurrent connections.

Typically in the past, this was solved by throttling through message-based middleware or by custom-built pooling and façade mechanisms. These are hard to get right, especially when we need to scale the middle tier but still maintain the correct connection counts. It’s just fragile and complex.

In fact, like the Smart Cache pattern, this pattern spans across multiple scenarios and customers who already have working systems with constrained resources. They are building systems where they need to scale-out not just the services, but their state in-memory as well as the persisted state in stable storage.

The diagram below illustrates this scenario:

![][1]

## Modeling cache scenarios with actors
Essentially we model access to resources as an actor or multiple actors that act as proxies (say connection, for example) to a resource or a group of resources. You can then either directly manage the resource through individual actors or use a coordination actor that manages the resource actors.
To make this more concrete, we will address the common need of having to work against a partitioned (aka sharded) storage tier for performance and scalability reasons.
Our first option is pretty basic: we can use a static function to map and resolve our actors to downstream resources. Such a function can return, for example, a connection string with given input. It is entirely up to us how to implement that function. Of course, this approach comes with its own drawbacks such as static affinity that makes repartitioning resources or remapping an actor to resources very difficult.
Here is a very simple example—we do modulo arithmetic to determine the database name using userId and use region to identify the database server.

## Resource Governance code sample – static resolution

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

Simple yet not very flexible. Now let’s have a look at a more advanced and useful approach.
First, we model the affinity between physical resources and actors. This is done through an actor called Resolver that understands the mapping between users, logical partitions, and physical resources. Resolver maintains its data in a persisted store, however it is cached for easy lookup. As we saw in the Exchange Rate sample earlier in the Smart Cache pattern, Resolver can proactively fetch the latest information using a timer. Once the user actor resolves the resource it needs to use, it caches it in a local variable called _resolution and uses it during its lifetime.
We chose a look-up based resolution (illustrated below) over simple hashing or range hashing because of the flexibility it provides in operations such as scaling in/out or moving a user from one resource to another.

![][2]

In the illustration above, we see that actor B23 is first resolving its resource (aka resolution) —DB1 and caches it. Subsequent operations can now use the cached resolution to access the constrained resource. Since the actors support single-threaded execution, developers no longer need to worry about concurrent access to the resource.
The User and Resolver actors look like this:

## Resource Governance code sample – Resolver

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


public class User : Actor<UserState>, IUser
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

Resource Governance – Resolver Example

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

public class Resolver : Actor<ResolverState>, IResolver
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

## Accessing resources with finite capability
Now let’s look at another example; exclusive access to precious resources such as DB, storage accounts, and file systems with finite throughput capability.
Our scenario is as follows: we would like to process events using an actor called EventProcessor, which is responsible for processing and persisting the event, in this case to a .CSV file for simplicity. While we can follow the partitioning approach discussed above to scale-out our resources, we will still have to deal with the concurrency issues. That is why we chose a file-based example to illustrate this particular point—writing to a single file from multiple actors will raise concurrency issues. To address the problem we introduce another actor called EventWriter that has exclusive ownership of the constrained resources. The scenario is illustrated below:

![][3]

We mark EventProcessor actors as “Stateless Workers,” which allows the runtime to scale them across the cluster as necessary. Hence we didn’t use any identifiers in the illustration above for these actors. In other words, stateless actors are a pool of workers maintained by the runtime.
In the sample code below, the EventProcessor actor does two things: it first decides which EventWriter (therefore resource) to use, and invokes the chosen actor to write the processed event. For simplicity, we are choosing Event Type as the identifier for the EventWriter actor. In other words, there will be one and only one EventWriter for this Event Type providing single-threaded and exclusive access to the resource.

## Resource Governance code sample – Event Processor

```csharp
public interface IEventProcessor : IActor
{
    Task ProcessEventAsync(long eventId, long eventType, DateTime eventTime, string payload);
}

public class EventProcessor : Actor, IEventProcessor
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

Now let’s have a look at the EventWriter actor. It really doesn’t do much apart from control exclusive access to the constrained resource, in this case the file and writing events to it.
## Resource Governance code sample – Event Writer

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

public class EventWriter : Actor<EventWriterState>, IEventWriter
{
    private StreamWriter _writer;

    public override Task OnActivateAsync()
    {
        State._filename = string.Format(@"C:\{0}.csv", this.Id);
        _writer = new StreamWriter(_filename);

        return base.OnActivateAsync();
    }

    public override Task OnDeactivateAsync()
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

Having a single actor responsible for the resource allows us to add capabilities such as buffering. We can buffer incoming events and write these events periodically using a timer or when our buffer is full. Here is a simple timer based example:
## Resource Governance code sample – Event Writer with buffer

```csharp
[DataMember]
public class EventWriterState
{
    [DataMember]
    public string _filename;
    [DataMember]
    public Queue<CustomEvent> _buffer;
}

public class EventWriter : Actor<EventWriterState>, IEventWriter
{
    private StreamWriter _writer;
    private IActorTimer _timer;

    public override Task OnActivateAsync()
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

While the code above will work fine, clients will not know whether their event made it to the underlying store. To allow buffering and let clients be aware what is happening to their request, we introduce the following approach to let clients wait until their event is written to the .CSV file:

## Resource Governance code sample – Async batching

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

We will use this class to create and maintain a list of incomplete tasks (to block clients) and complete them in one go once we write the buffered events to storage.
In the EventWriter class, we need to do three things: mark the actor class as Reentrant, return the result of SubmitNext(), and Flush our timer. The modified code is as follows:

## Resource Governance code sample – Buffering with async batching

```csharp
public class EventWriter : Actor<EventWriterState>, IEventWriter
{
    public override Task OnActivateAsync()
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

Seem easy? Well it is. But the ease belies the enterprise power. With this architecture we get:

* Location independent resource addressing.
* Tuneable pool size based simply on changing the number of actors that act on behalf a resource.
* Client side coordinated pool usage (as depicted) or server side (just imagine a single actor in front of each of those pools in the picture).
* Scalable pool addition (just add actors representing the new resource).
* Actor (as we demonstrated earlier) can cache results from backend resource on demand or pre-cache using a timer reducing the need to hit the backend resource.
* Efficient asynchronous dispatch.
* A coding environment that will be familiar to any developer not just middleware specialists.

This pattern is very common in scenarios where developers either have constrained resources they need to develop against or building large scale-out systems.


## Next Steps
[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smartcache.md)

[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)

<!--Image references-->
[1]: ./media/service-fabric-reliable-actors/resourcegovernance_arch1.png
[2]: ./media/service-fabric-reliable-actors/resourcegovernance_arch2.png
[3]: ./media/service-fabric-reliable-actors/resourcegovernance_arch3.png
