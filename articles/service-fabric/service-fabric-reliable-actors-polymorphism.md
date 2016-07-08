<properties
   pageTitle="Polymorphism in the Reliable Actors framework | Microsoft Azure"
   description="Build hierarchies of .NET interfaces and types in the Reliable Actors framework to reuse functionality and API definitions."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/07/2016"
   ms.author="seanmck"/>

# Polymorphism in the Reliable Actors framework

The Reliable Actors framework allows you to build actors using many of the same techniques that you would use in object-oriented design. One of those techniques is polymorphism, which allows types and interfaces to inherit from more generalized parents. Inheritance in the Reliable Actors framework generally follows the .NET model with a few additional constraints.

## Interfaces

The Reliable Actors framework requires you to define at least one interface to be implemented by your actor type. This interface is used to generate a proxy class that can be used by clients to communicate with your actors. Interfaces can inherit from other interfaces as long as every interface that is implemented by an actor type and all of its parents ultimately derive from IActor. IActor is the platform-defined base interface for actors. Thus, the classic polymorphism example using shapes might look something like this:

![Interface hierarchy for shape actors][shapes-interface-hierarchy]


## Types

You can also create a hierarchy of actor types, which are derived from the base Actor class that is provided by the platform. In the case of shapes, you might have a base `Shape` type:

```csharp
public abstract class Shape : Actor, IShape
{
    public abstract Task<int> GetVerticeCount();

    public abstract Task<double> GetAreaAsync();
}
```

Subtypes of `Shape` can override methods from the base.

```csharp
[ActorService(Name = "Circle")]
[StatePersistence(StatePersistence.Persisted)]
public class Circle : Shape, ICircle
{
    public override Task<int> GetVerticeCount()
    {
        return Task.FromResult(0);
    }

    public override async Task<double> GetAreaAsync()
    {
        CircleState state = await this.StateManager.GetStateAsync<CircleState>("circle");

        return Math.PI *
            state.Radius *
            state.Radius;
    }
}
```

Note the `ActorService` attribute on the actor type. This attribute tells the Reliable Actor framework that it should automatically create a service for hosting actors of this type. In some cases, you may wish to create a base type that is solely intended for sharing functionality with subtypes and will never be used to instantiate concrete actors. In those cases, you should use the `abstract` keyword to indicate that you will never create an actor based on that type.


## Next steps

- See [how the Reliable Actors framework leverages the Service Fabric platform](service-fabric-reliable-actors-platform.md) to provide reliability, scalability, and consistent state.
- Learn about the [actor lifecycle](service-fabric-reliable-actors-lifecycle.md).

<!-- Image references -->

[shapes-interface-hierarchy]: ./media/service-fabric-reliable-actors-polymorphism/Shapes-Interface-Hierarchy.png
