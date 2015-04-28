<properties
   pageTitle="Azure Service Fabric Actors Smart Cache design pattern"
   description="Design pattern on how to use Service Fabric Actors as Caching infrastructure on web-based applications"
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

# Service Fabric Actors design pattern: smart cache
The combination of a web tier, caching tier, storage tier, and occasionally a worker tier are pretty much the standard parts of today’s applications. The caching tier is usually vital to performance and may, in fact, be comprised of multiple tiers itself.
Many caches are simple key-value pairs while other systems like [Redis](http://redis.io) that are used as caches offer richer semantics. Still, any special, caching tier will be limited in semantics and more importantly it is yet another tier to manage.
What if instead, objects just kept state in local variables and these objects can be snapshotted or persisted to a durable store automatically? Furthermore, rich collections such as lists, sorted sets, queues, and any other custom type for that matter are simply modelled as member variables and methods.

![][1]

## The leaderboard sample
Take leader boards as an example—a Leaderboard object needs to maintain a sorted list of players and their scores so that we can query it. For example for the "Top 100 Players" or to find a player’s position in the leader board relative to +- N players above and below him/her. A typical solution with traditional tools would require ‘GET’ing the Leaderboard object (collection which supports inserting a new tuple<Player, Points> named Score), sorting it, and finally ‘PUT’ing it back to the cache. We would probably LOCK (GETLOCK, PUTLOCK) the Leaderboard object for consistency.
Let’s have an actor-based solution where state and behaviour are together. There are two options:

* Implement the Leaderboard Collection as part of the actor,
* Or use the actor as an interface to the collection that we can keep in a member variable.
First let’s have a look at what the a interface may look like:

## Smart Cache code sample – Leaderboard interface

```
public interface ILeaderboard : IActor
{
    // Updates the leaderboard with the score - player, points
    Task UpdateLeaderboard(Score score);

    // Returns the Top [count] from the leaderboard e.g., Top 10
    Task<List<Score>> GetLeaderboard(int count);

    // Returns the specific position of the player relative to other players
    Task<List<Score>> GetPosition(long player, int range);
}

```

Next, we implement this interface and use the latter option and encapsulate this collection's behaviour in the actor:

## Smart Cache code sample – Leaderboard actor

```
public class Leaderboard : Actor<LeaderboardCollection>, ILeaderboard
{
    // Specialised collection, could be part of the actor

    public Task UpdateLeaderboard(Score score)
    {
        State.UpdateLeaderboard(score);
        return TaskDone.Done;
    }

    public Task<List<Score>> GetLeaderboard(int count)
    {
        // Return top N from Leaderboard
        return Task.FromResult(State.GetLeaderboard(count));
    }

    public Task<List<Score>> GetPosition(long player, int range)
    {
        // Return player position and other players in range from Leaderboard
        return Task.FromResult(State.FindPosition(player, range));
    }
}

```

The state member of the class provides the state of the actor, in the sample code above it also provides methods to read/write data.

## Smart Cache code sample – LeaderboardCollection

```
[DataContract]
public class LeaderboardCollection
{
    // Specialised collection, could be part of the actor
    [DataMember]
    Private List<score> _leaderboard = new List<score>();

    public void UpdateLeaderboard(Score score)
    {
        _leaderboard.add(score);
    }

    public List<Score> GetLeaderboard(int count)
    {
        …
    }

    public List<Score> GetPosition(long player, int range)
    {
        …
    }
}

```

No data shipping, no locks, just manipulating remote objects in a distributed runtime, servicing multiple clients as if they were single objects in a single application servicing only one client.  
Here is the sample client:

## Smart Cache code sample – calling the Leaderboard actor

```
// Get reference to Leaderboard
const string appName = "fabric:/FunnyGameApp";
var leaderboard = ActorProxy.Create<ILeaderboard>(1001, appName);

// Update Leaderboard with dummy players and scores
await leaderboard.UpdateLeaderboard(new Score() { Player = 1, Points = 500 });
await leaderboard.UpdateLeaderboard(new Score() { Player = 2, Points = 100 });
await leaderboard.UpdateLeaderboard(new Score() { Player = 3, Points = 1500 });

// Finally, Get the Leaderboard. 0 represents ALL, any other number > 0 represents TOP N
var result = await leaderboard.GetLeaderboard(0);
```

The output looks like this:

```
Player = 3 Points = 1500
Player = 1 Points = 500
Player = 2 Points = 100
```

## Scaling the architecture
It may feel like the example above could create a bottleneck in the Leaderboard instance. What if, for instance, we are planning to support hundreds and thousands of players? One way to deal with that might be to introduce stateless aggregators that would act like a buffer—hold the partial scores (say subtotals) and then periodically send them to the Leaderboard actor, which can maintain the final Leaderboard. We will discuss this “aggregation” technique in more detail later.
Also, we do not have to consider mutexes, semaphores, or other concurrency constructs traditionally required by correctly behaving concurrent programs.
Below is another cache example that demonstrates the rich semantics one can implement with actors. This time we implement the logic of the Priority Queue (lower the number, higher the priority) as part of the Actor implementation.
The interface for IJobQueue looks like below:

## Smart Cache code sample – Job Queue interface

```
public interface IJobQueue : IActor
{
    Task Enqueue(Job item);
    Task<Job> Dequeue();
    Task<Job> Peek();
    Task<int> GetCount();
}
```

We also need to define the Job item:

## Smart Cache code sample – Job

```
public class Job : IComparable<Job>
{
    public double Priority { get; set; }
    public string Name { get; set; }

    public override string ToString()
    {
        return string.Format("Job = {0} Priority = {1}", Name, Priority);
    }

    public int CompareTo(Job other)
    {
        return Priority.CompareTo(other.Priority);
    }
}
```

Finally, we implement the IJobQueue interface in the grain. Note that we omitted the implementation details of the priority queue here for clarity. A sample implementation can be found in the accompanying samples.

## Smart Cache code sample – Job Queue

```
public class JobQueue : Actor<List<Jobs>>, IJobQueue
{

    public override Task OnActivateAsync()
    {
        State = new List<Job>();
    }

    public Task Enqueue(Job item)
    {
        // this is where we add to the queue

        ...

        return TaskDone.Done;
    }

    public Task<Job> Dequeue()
    {
        // this is where we remove from the head of the queue

        ...

        return Task.FromResult(frontItem);
    }

    public Task<Job> Peek()
    {
        // this is where we peek at the head of the queue

        ...

        return Task.FromResult(frontItem);
    }

    public Task<int> GetCount()
    {

        // this is where we return the number of items in the queue

        return Task.FromResult(data.Count);
    }
}

```

The output looks like this:

```
Job = 2 Priority = 0.0323341116459733
Job = 3 Priority = 0.125596747792138
Job = 4 Priority = 0.208425460480352
Job = 0 Priority = 0.304352047063574
Job = 8 Priority = 0.415597594070992
Job = 7 Priority = 0.477669881413537
Job = 5 Priority = 0.525898784178262
Job = 9 Priority = 0.921959541701693
Job = 6 Priority = 0.962653734238191
Job = 1 Priority = 0.97444181375878
```

## Actors provide flexibility
In the samples above, Leaderboard and JobQueue, we used two different techniques:

* In the Leaderboard sample we encapsulated a Leaderboard object as a private member variable in the actor and merely provided an interface to this object – both to its state and functionality.

* On the other hand, in the JobQueue sample we implemented the actor as a priority queue itself rather than referencing another object defined elsewhere.

Actors provide flexibility for the developer to define rich object structures as part the actors or reference object graphs outside of the actors.
In caching terms actors can write-behind or write-through, or we can use different techniques at a member variable granularity. In other words, we have full control over what to persist and when to persist. We don’t have to persist transient state or state that we can build from saved state.
And how about populating these actors caches then? There are number of ways to achieve this. Actors provide virtual methods called OnActivateAsync() and OnDectivateAsync() to let us know when an instance of the actor is activated and deactivated. Note that the actor is activated on demand when a first request is sent to it.
We can use OnActivateAsync() to populate state on-demand as in read-through, perhaps from an external stable store. Or we can populate state on a timer, say an Exchange Rate actor that provides the conversion function based on the latest currency rates. This actor can populate its state from an external service periodically, say every 5 seconds, and use the state for the conversion function. See the example below:

## Smart Cache code sample – Rate Converter

```
...

private List<ExchangeRate> _rates;
private IActorTimer _timer;

public Task Activate()
{
    // registering a timer that will live as long as the actor...
    _timer = this.RegisterTimer((obj) =>
    {
        Console.WriteLine("Refreshing rates...");
        return this.RefreshRates(); // call to external service/source to retrieve exchange rates
    },
    null,
    TimeSpan.FromSeconds(0), // start immediately
    TimeSpan.FromSeconds(5)); // refresh every 5 seconds

    return TaskDone.Done;
}

public Task RefreshRates()
{
    // this is where we will make an external call and populate rates
    return TaskDone.Done;
}

```

Essentially Smart Cache provides:

* High throughput/low latency by service requests from memory.
* Single-instance routing and single-threaded serialization of requests to an item with no contention on persistent store.
* Semantic operations, for example, Enqueue(Job item).
* Easy-to-implement write-through or write-behind.
* Automatic eviction of LRU (Least Recently Used) items (resource management).
* Automatic elasticity and reliability.


## Next Steps
[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors/smartcache-arch.png
