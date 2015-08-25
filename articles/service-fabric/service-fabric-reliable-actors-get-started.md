<properties
   pageTitle="Get Started with Reliable Actors | Microsoft Azure"
   description="This tutorial walks you through the steps of creating, debugging, and deploying a canonical HelloWorld service using Service Fabric Reliable Actors."
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

# Reliable Actors: The canonical HelloWorld walk-through scenario
This article explains the basics of Service Fabric Reliable Actors and walks you through creating, debugging, and deploying a simple HelloWorld application in Visual Studio.

## Installation and setup
Before starting, make sure you have the Service Fabric development environment setup on your machine.
Detailed instructions on how to setup the development environment can be found [here](service-fabric-get-started.md).

## Basic concepts
In order to get started with Reliable Actors you just need to understand 4 basic concepts:

* **Actor Service**. Reliable Actors are packaged in Services that can be deployed in the Service Fabric infrastructure. A service can host one or more actors. We will go into more details about the trade-offs of one vs. multiple actors per service later. For now let's assume we need to implement only one actor.
* **Actor Interface**. The Actor interface is used to define the public interface of an actor. In Actor model terminology it defines the type of messages that the actor is able to understand process. The Actor interface is used by other Actors or client applications to 'send' (asynchronously) messages to the Actor. Reliable Actors can implement multiple interfaces, as we will see, an HelloWorld Actor can implement the IHelloWorld interface but also an ILogging interface that defines different messages/functionalities.
* **Actor Registration**. In the Actor Service, the Actor Type needs to be registered so Service Fabric is aware of the new type and can use it to create new actors.
* **ActorProxy Class**. The ActorProxy class is used to bind to an Actor and invoke the methods exposed through its interfaces. The ActorProxy class provides two important functionalities:
	* Name resolution: it is able to locate the Actor in the cluster (find in which node of the cluster it is hosted).
	* Handle failures: it can re-try method invocations and re-determine the Actor location after, for instance, a failure that requires the actor to be relocated to another node in the cluster.

## Create a new project in Visual Studio
After you install the Service Fabric Tools for Visual Studio, you can create a new project types. The new project types are under the 'Cloud' category of the New Project Dialog


![Service Fabric tools for VS - New project][1]

In the next dialog you can choose the type of project that you want to create.

![Service Fabric Project Templates][5]

For the HelloWorld project, let's use the Service Fabric Actor Service.

Once the solution is created you should see the following structure:

![Service Fabric Project Structure][2]

## Reliable Actors basic building blocks

A typical Reliable Actors solution is composed of 3 projects:

* The Application project (HelloWorldApplication). This is the project that packages all the services together for deployment. It contains the ApplicationManifest.xml and PowerShell scripts for managing the application.

* The Interface project (HelloWorld.Interfaces). This is the project that contains the interface definition for the actor. In the Interfaces project you can define the interfaces that will be used by the actors in the solution.

```csharp

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Actors;

namespace HelloWorld.Interfaces
{
    public interface IHelloWorld : IActor
    {
        Task<string> SayHello(string greeting);
    }
}

```

* The Service project (HelloWorld). This is the project used to define the Service Fabric service that is going to host the actor. It contains some boilerplate code that does not need to be edited in most cases (ServiceHost.cs) and the implementation of the Actor. Implementation of the actor involves implementing a class that derives from a base type (Actor) and implements the interface(s) defined in the .Interfaces project.

```csharp

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HelloWorld.Interfaces;
using Microsoft.ServiceFabric;
using Microsoft.ServiceFabric.Actors;

namespace HelloWorld
{
    public class HelloWorld : Actor, IHelloWorld
    {
        public Task<string> SayHello(string greeting)
        {
            return Task.FromResult("You said: '" + greeting + "', I say: Hello Actors!");
        }
    }
}

```

The Actor Service project contains the code to create a Service Fabric service, in the service definition, Actor type(s) are registered so they can be used to instantiate new actors.

```csharp

public class Program
{
    public static void Main(string[] args)
    {
        try
        {
            using (FabricRuntime fabricRuntime = FabricRuntime.Create())
            {
                fabricRuntime.RegisterActor(typeof(HelloWorld));

                Thread.Sleep(Timeout.Infinite);
            }
        }
        catch (Exception e)
        {
            ActorEventSource.Current.ActorHostInitializationFailed(e);
            throw;
        }
    }
}  

```

If you start from a new project in Visual Studio and you have only one Actor definition, the registration is included by default in the code that Visual Studio generates. If you define other actors in the service, you need to add the Actor registration using:

```csharp

fabricRuntime.RegisterActor(typeof(MyNewActor));


```

## Debugging

Service Fabric tools for Visual Studio supports debugging on the local machine. You can start a debugging session by hitting F5. Visual Studio builds (if necessary), packages and deploys the application on the local Service Fabric cluster and attaches the debugger. The experience is similar to debugging an ASP.NET application.
During the deployment process you can see progress in the Output Window

![Service Fabric Debugging output window][3]


## Next steps

[Introduction to Service Fabric Reliable Actors](service-fabric-reliable-actors-introduction.md)
[Actors APIs Reference Documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
[Sample code](https://github.com/Azure/servicefabric-samples)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-newproject.PNG
[2]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-projectstructure.PNG
[3]: ./media/service-fabric-reliable-actors-get-started/debugging-output.PNG
[4]: ./media/service-fabric-reliable-actors-get-started/vs-context-menu.png
[5]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-newproject1.PNG
