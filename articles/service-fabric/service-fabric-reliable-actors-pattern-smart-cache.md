<properties
   pageTitle="Smart cache design pattern | Microsoft Azure"
   description="Design pattern on how to use Service Fabric's Reliable Actors programming model to build a caching infrastructure for web-based applications."
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

# Reliable Actors design pattern: Smart cache

The combination of a web tier, a caching tier, a storage tier, and (occasionally) a worker tier makes up the standard parts of many of today’s applications. The caching tier is usually vital to performance, and it may itself be comprised of multiple tiers.
Many caches are simple key-value pairs. Other systems, such as [Redis](http://redis.io), are used as caches, but they also offer richer semantics. Any special caching tier will have limited semantics, though. More importantly, it is yet another tier to manage.

Objects can instead keep state in local variables, and these objects can be snapshotted or persisted to a durable store automatically. Further, rich collections such as lists, sorted sets, queues, and other custom types can be modeled simply as member variables and methods.

![Actors and caching][1]

## Explore the leaderboard example

Let's look at leaderboards as an example. A leaderboard object needs to maintain a sorted list of players and their scores, so that the list can be queried. A query can find the top 100 players. It can also find a player’s position in the leaderboard relative to a specified number of players above and below him or her. A traditional solution would require getting the leaderboard object (a collection that supports inserting a new tuple `<Player, Points>` named **Score**) by using GET, sorting it, and finally putting it back to the cache by using PUT. You would probably lock (GETLOCK, PUTLOCK) the leaderboard object for consistency.
Let’s look at an Actor-based solution where state and behavior are together. There are two options:

* Implement the leaderboard collection as part of the Actor.
* Use the Actor as an interface to the collection that we can keep in a member variable.

The following code sample shows what the interface could look like.

### Smart cache code sample: Leaderboard interface

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

Next, you can implement this interface by using the latter option and encapsulating this collection's behavior in the Actor:

### Smart cache code sample: Leaderboard Actor

```
public class Leaderboard : StatefulActor<LeaderboardCollection>, ILeaderboard
{
    // Specialised collection, could be part of the actor

    public Task UpdateLeaderboard(Score score)
    {
        State.UpdateLeaderboard(score);
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

The state member of the class provides the state of the Actor. In the sample code above, it also provides methods to read and write data.

### Smart cache code sample: LeaderboardCollection

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

There are no locks or data shipping in this approach. It just manipulates remote objects in a distributed runtime, which services multiple clients as if they were single objects in a single application servicing only one client. The following code sample focuses on the sample client.

### Smart cache code sample: Calling the leaderboard Actor

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

## Scale the architecture
It may seem that the example above could create a bottleneck in the leaderboard instance. For example, what if you plan to support thousands of players? One way to deal with that would be to introduce stateless aggregators that act as buffers. These aggregators would hold partial scores (subtotals), and then periodically send them to the leaderboard Actor, which would maintain the final leaderboard. We will discuss this technique in more detail later. Also, we do not have to consider mutexes, semaphores, or other concurrency constructs that are traditionally required by concurrent programs that are behaving correctly.

Below is another cache example that demonstrates the rich semantics you can implement with Actors. This time, we implement the logic of a priority queue (the lower the number, the higher the priority) as part of the Actor implementation.
The following code sample provides a look at the interface for **IJobQueue**.

### Smart cache code sample: Job queue interface

```
public interface IJobQueue : IActor
{
    Task Enqueue(Job item);
    Task<Job> Dequeue();
    Task<Job> Peek();
    Task<int> GetCount();
}
```

We also need to define the **Job** item:

### Smart cache code sample: Job

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

Finally, we implement the IJobQueue interface in the Actor. Note that we omitted the implementation details of the priority queue here for clarity. A look at implementation is provided in the accompanying samples.

### Smart cache code sample: Job queue

```
public class JobQueue : StatefulActor<List<Jobs>>, IJobQueue
{

    public override Task OnActivateAsync()
    {
        State = new List<Job>();
    }

    public Task Enqueue(Job item)
    {
        // this is where we add to the queue

        ...

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

## Use Actors to provide flexibility
In the leaderboard and job queue samples above, we used two different techniques:

* In the leaderboard sample, we encapsulated a leaderboard object as a private member variable in the Actor. We then merely provided an interface to this object, to both its state and its functionality.

* In the job queue sample, we instead implemented the Actor as a priority queue itself, rather than by referencing another object defined elsewhere.

Actors provide developer with the flexibility to define rich object structures as part of the Actors or reference object graphs outside of the Actors. In caching terms, Actors can write behind or write through, or they can employ different techniques at the granularity of member variables. You have full control over what to persist and when to persist it. You don’t have to persist transient state or state that you can build from saved state.

How are the caches of these Actors populated? There are number of ways to achieve this. Actors provide the virtual methods **OnActivateAsync()** and **OnDeactivateAsync()** to let you know when an instance of the Actor is activated and deactivated. Note that the Actor is activated on demand when a request is first sent to it.

You can use OnActivateAsync() to populate state on demand, as in read-through, such as from an external stable store. You can also populate state on a timer, for example, by using an exchange rate Actor that provides a conversion function based on the latest currency rates. Such an Actor can populate its state from an external service periodically, say every five seconds, and it can use the state for the conversion function. The following code sample shows how this can be done.

### Smart cache code sample: Rate converter

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

}

public Task RefreshRates()
{
    // this is where we will make an external call and populate rates
}

```

Essentially, the smart cache approach provides:

* High throughput/low latency by service requests from memory.
* Single-instance routing and single-threaded serialization of requests to an item with no contention on a persistent store.
* Semantic operations, for example, **Enqueue(Job item)**.
* Easy-to-implement write-through and write-behind.
* Automatic eviction of least recently used (LRU) items (resource management).
* Automatic elasticity and reliability.


## Next steps

[Pattern: Distributed networks and graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful service composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-smart-cache/smartcache-arch.png
