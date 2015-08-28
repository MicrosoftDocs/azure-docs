<properties
   pageTitle="Reliable Actors Distributed Computation pattern"
   description="Service Fabric Reliable Actors are a good fit with parallel asynchronous messaging, easily managed distributed state, and parallel computation."
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
   ms.date="08/05/2015"
   ms.author="claudioc"/>

# Reliable Actors design pattern: distributed computation
We owe this one in part to watching a real life customer whip out a financial calculation in Service Fabric Reliable Actors in an absurdly small amount of time—a Monte Carlo simulation for risk calculation to be exact.

At first, especially to those who do not have domain specific knowledge, Azure Service Fabric's handling of this kind of workload, as opposed to say more traditional approaches such as Map/Reduce or MPI, may not be obvious.

But it turns out that Azure Service Fabric is a good fit with parallel asynchronous messaging, easily managed distributed state, and parallel computation as the following diagram depicts:

![][1]

In the following example, we simply calculate Pi using a Monte Carlo Simulation. We have the following actors:

* Processor responsible for calculating Pi using PoolTask Actors.

* PoolTask responsible for Monte Carlo simulation and sending results to Aggregator.

* Aggregator responsible for, well, aggregating results and sending them to Finaliser.

* Finaliser responsible for calculating the final result and printing on screen.

## Distributed computation code sample – Monte Carlo simulation

```csharp
public interface IProcessor : IActor
{
    Task ProcessAsync(int tries, int seed, int taskCount);
}

public class Processor : Actor, IProcessor
{
    public Task ProcessAsync(int tries, int seed, int taskCount)
    {
        var tasks = new List<Task>();
        for (int i = 0; i < taskCount; i++)
        {
            var task = ActorProxy.Create<IPooledTask>(0); // stateless
            tasks.Add(task.CalculateAsync(tries, seed));
        }
        return Task.WhenAll(tasks);
    }
}

public interface IPooledTask : IActor
{
    Task CalculateAsync(int tries, int seed);
}

public class PooledTask : Actor, IPooledTask
{
    public Task CalculateAsync(int tries, int seed)
    {
        var pi = new Pi()
        {
            InCircle = 0,
            Tries = tries
        };

        var random = new Random(seed);
        double x, y;
        for (int i = 0; i < tries; i++)
        {
            x = random.NextDouble();
            y = random.NextDouble();
            if (Math.Sqrt(x * x + y * y) <= 1)
                pi.InCircle++;
        }

        var agg = ActorProxy.Create<IAggregator>(ActorId.NewId());
        return agg.AggregateAsync(pi);
    }
}
```

A common way of aggregating results in Azure Service Fabric is to use timers. We are using stateless actors for two main reasons: the runtime will decide how many aggregators are needed dynamically, therefore giving us scale on demand; and it will instantiate these actors “locally” – in other words in the same silo of the calling actor, reducing network hops.
Here is how the Aggregator and Finaliser look:

## Distributed computation code sample – aggregator

```csharp
public interface IAggregator : IActor
{
    Task AggregateAsync(Pi pi);
}

[DataContract]
class AggregatorState
{
    [DataMember]
    public Pi _pi;
    [DataMember]
    public bool _pending;
}

public class Aggregator : Actor<AggregatorState>, IAggregator
{
    public override Task OnActivateAsync()
    {
        State._pi = new Pi() { InCircle = 0, Tries = 0 };
        State._pending = false;

        this.RegisterTimer(
            ProcessAsync,
            null,
            TimeSpan.FromSeconds(5),
            TimeSpan.FromSeconds(5));

        return base.OnActivateAsync();
    }

    private async Task ProcessAsync(object obj)
    {
        if (false == _pending)
            return;

        var finaliser = ActorProxy.Create<IFinaliser>(0);
        await finaliser.FinaliseAsync(_pi);
        State._pending = false;
        State._pi.InCircle = 0;
        State._pi.Tries = 0;
    }

    public Task AggregateAsync(Pi pi)
    {
        State._pi.InCircle += pi.InCircle;
        State._pi.Tries += pi.Tries;
        State._pending = true;
        return TaskDone.Done;
    }
}

public interface IFinaliser : IActor
{
    Task FinaliseAsync(Pi pi);
}

[DataContract]
class FinalizerState
{
    [DataMember]
    public Pi _pi;
}

public class Finaliser : Actor<FinalizerState>, IFinaliser
{
    public override Task OnActivateAsync()
    {
        State._pi = new Pi()
        {
            InCircle = 0,
            Tries = 0
        };

        return base.OnActivateAsync();
    }

    public Task FinaliseAsync(Pi pi)
    {
        State._pi.InCircle += pi.InCircle;
        State._pi.Tries += pi.Tries;
        Console.WriteLine(" Pi = {0:N9}  T = {1:N0}, {2}",(double)State._pi.InCircle / (double)State._pi.Tries * 4.0, State._pi.Tries, State._pi.InCircle);

        return TaskDone.Done;
    }
}
```

At this point, it should be clear how we could potentially enhance the Leaderboard example with an aggregator for scale and performance.

We are by no means asserting that Azure Service Fabric is a drop-in replacement for other distributed computation of big data frameworks or high performance computing. There are some things it is just built to handle better than others. However one can model workflows and distributed parallel computation in Azure Service Fabric while still getting the simplicity benefits it provides.

## Next Steps
[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-distributed-computation/distributed-computation-1.png
