<properties
   pageTitle="Polymorphism in the Actor Framework | Microsoft Azure"
   description="Build hierarchies of .NET interfaces and types in the Reliable Actors framework to reuse functionality and API definitions."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/15/2015"
   ms.author="seanmck"/>

# Polymorphism in the Reliable Actor framework

The Reliable Actor framework simplifies distributed systems programming by allowing you to build your service using many of the same techniques that you would use in object-oriented design. One of those techniques in polymporphism, allowing types and interfaces to inherit from more generalized parents. Inheritance in the actor framework generally follows the .NET model with a few additional constraints.

## Interfaces

The actor framework requires you to define at least one interface to be implemented by your actor type. This interface is used to generate a proxy class that can be used by clients to communicate with your actors. Interfaces can inherit from other interfaces as long as every interface implemented by an actor type and all of its parents ultimately derive from IActor, the platform-defined base interface for actors. Thus, the classic polymorphism example using shapes might look something like this:

![Interface hierarchy for shape actors][shapes-interface-hierarchy]


## Types

You can also create a hierarchy of actor types, derived from the base Actor class provided by the platform. For stateful actors, you can likewise create a hierarchy of state types. In the case of shapes, you might have a base `Shape` type with a state type of `ShapeState`.

    public abstract class Shape : Actor<ShapeState>, IShape
    {
        ...
    }

Sub-types of `Shape` can use sub-types of `ShapeType` for storing more specific-properties.

    [ActorService(Name = "Circle")]
    public class Circle : Shape, ICircle
    {
        private CircleState CircleState => this.State as CircleState;

        public override ShapeState InitializeState()
        {
            return new CircleState();
        }

        [Readonly]
        public override Task<int> GetVerticeCount()
        {
            return Task.FromResult(0);
        }

       [Readonly]
       public override Task<double> GetArea()
       {
           return Task.FromResult(
               Math.PI*
               this.CircleState.Radius*
               this.CircleState.Radius);
       }

       ...
    }

Note the `ActorService` attribute on the actor type. This tells the Service Fabric SDK that it should automatically create a Service for hosting actors of this type. In some cases, you may wish to create a base type that is solely intended for sharing functionality with sub-types and will never be used to instantiate concrete actors. In those cases, you should use the `abstract` keyword to indicate that you will never create an actor based on that type.


## Next steps

- See [how the Reliable Actors Framework leverages the Service Fabric Platform](service-fabric-reliable-actors-platform.md) to provide reliability, scalability, and consistent state
- Learn about the [actor lifecycle](service-fabric-reliable-actors)

<!-- Image references -->

[shapes-interface-hierarchy]: ./media/service-fabric-reliable-actors-polymorphism/Shapes-Interface-Hierarchy.png
