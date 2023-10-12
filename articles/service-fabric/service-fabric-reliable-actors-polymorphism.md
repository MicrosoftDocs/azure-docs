---
title: Polymorphism in the Reliable Actors framework 
description: Build hierarchies of .NET interfaces and types in the Reliable Actors framework to reuse functionality and API definitions.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-dotnet
services: service-fabric
ms.date: 07/11/2022
---

# Polymorphism in the Reliable Actors framework
The Reliable Actors framework allows you to build actors using many of the same techniques that you would use in object-oriented design. One of those techniques is polymorphism, which allows types and interfaces to inherit from more generalized parents. Inheritance in the Reliable Actors framework generally follows the .NET model with a few additional constraints. In case of Java/Linux, it follows the Java model.

## Interfaces
The Reliable Actors framework requires you to define at least one interface to be implemented by your actor type. This interface is used to generate a proxy class that can be used by clients to communicate with your actors. Interfaces can inherit from other interfaces as long as every interface that is implemented by an actor type and all of its parents ultimately derive from IActor(C#) or Actor(Java) . IActor(C#) and Actor(Java) are the platform-defined base interfaces for actors in the frameworks .NET and Java respectively. Thus, the classic polymorphism example using shapes might look something like this:

![Interface hierarchy for shape actors][shapes-interface-hierarchy]

## Types
You can also create a hierarchy of actor types, which are derived from the base Actor class that is provided by the platform. In the case of shapes, you might have a base `Shape`(C#) or `ShapeImpl`(Java) type:

```csharp
public abstract class Shape : Actor, IShape
{
    public abstract Task<int> GetVerticeCount();

    public abstract Task<double> GetAreaAsync();
}
```
```Java
public abstract class ShapeImpl extends FabricActor implements Shape
{
    public abstract CompletableFuture<int> getVerticeCount();

    public abstract CompletableFuture<double> getAreaAsync();
}
```

Subtypes of `Shape`(C#) or `ShapeImpl`(Java) can override methods from the base.

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
```Java
@ActorServiceAttribute(name = "Circle")
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
public class Circle extends ShapeImpl implements Circle
{
    @Override
    public CompletableFuture<Integer> getVerticeCount()
    {
        return CompletableFuture.completedFuture(0);
    }

    @Override
    public CompletableFuture<Double> getAreaAsync()
    {
        return (this.stateManager().getStateAsync<CircleState>("circle").thenApply(state->{
          return Math.PI * state.radius * state.radius;
        }));
    }
}
```

Note the `ActorService` attribute on the actor type. This attribute tells the Reliable Actor framework that it should automatically create a service for hosting actors of this type. In some cases, you may wish to create a base type that is solely intended for sharing functionality with subtypes and will never be used to instantiate concrete actors. In those cases, you should use the `abstract` keyword to indicate that you will never create an actor based on that type.

## Next steps
* See [how the Reliable Actors framework leverages the Service Fabric platform](service-fabric-reliable-actors-platform.md) to provide reliability, scalability, and consistent state.
* Learn about the [actor lifecycle](service-fabric-reliable-actors-lifecycle.md).

<!-- Image references -->

[shapes-interface-hierarchy]: ./media/service-fabric-reliable-actors-polymorphism/Shapes-Interface-Hierarchy.png
