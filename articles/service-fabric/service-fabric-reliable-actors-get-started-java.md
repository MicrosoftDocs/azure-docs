<properties
   pageTitle="Get started with Service Fabric Reliable Actors | Microsoft Azure"
   description="This tutorial walks you through the steps of creating, debugging, and deploying a simple actor-based service using Service Fabric Reliable Actors."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/25/2016"
   ms.author="vturecek"/>

# Getting started with Reliable Actors
This article explains the basics of Azure Service Fabric Reliable Actors and walks you through creating, debugging, and deploying a simple Reliable Actor application in Java.

## Installation and setup
Before you start, ensure that you have the Service Fabric development environment set up on your machine.
If you need to set it up, see detailed instructions on [how to set up the development environment](service-fabric-get-started.md).

## Basic concepts
To get started with Reliable Actors, you need to understand a few basic concepts:

* **Actor service**. Reliable Actors are packaged in Reliable Services that can be deployed in the Service Fabric infrastructure. A service can host one or more actors. We will go into more detail about the trade-offs of one actor versus multiple actors per service below. For now, let's assume that we need to implement only one actor.
* **Actor interface**. The actor interface is used to define a strongly-typed public interface of an actor. In the Reliable Actor model terminology, the actor interface defines the types of messages that the actor can understand and process. The actor interface is used by other actors and client applications to "send" (asynchronously) messages to the actor. Reliable Actors can implement multiple interfaces. As we will see, a HelloWorld actor can implement the IHelloWorld interface, but it can also implement an ILogging interface that defines different messages and/or functionalities.
* **Actor registration**. In the Reliable Actors service, the actor type needs to be registered. This way, Service Fabric is aware of the new type and can use it to create new actors.
* **ActorProxy class**. The ActorProxy class is used by client applications to invoke the methods exposed through its interfaces. The ActorProxy class provides two important functionalities:
	* It resolves names. It is able to locate the actor in the cluster (find the node of the cluster where it is hosted).
	* It handles failures. It can retry method invocations and re-determine the actor location after, for example, a failure that requires the actor to be relocated to another node in the cluster.

The following rules that pertain to actor interfaces are worth mentioning:

- Actor interface methods cannot be overloaded.
- Actor interface methods must not have out, ref, or optional parameters.
- Generic interfaces are not supported.

## Create an actor service
Start by creating a new Service Fabric application. The Service Fabric SDK for Linux includes a Yeoman generator to provide the scaffolding for a Service Fabric application with a stateless service. Start by running the following Yeoman command:

```bash
$ yo azuresf
```

Follow the instructions to create a **Reliable Actor Service - Java**. For this tutorial, we will name the application "HelloWorldActorApplication" and the actor "HelloWorldActor". The following scaffolding will be created:

```bash
HelloWorldActorApplication/
├── build.gradle
├── HelloWorldActor
│   ├── build.gradle
│   ├── settings.gradle
│   └── src
│       └── statefulactor
│           ├── HelloWorldActorImpl.java
│           └── HelloWorldActorService.java
├── HelloWorldActorApplication
│   ├── ApplicationManifest.xml
│   └── HelloWorldActorPkg
│       ├── Code
│       │   ├── entryPoint.sh
│       │   └── _readme.txt
│       ├── Config
│       │   ├── _readme.txt
│       │   └── Settings.xml
│       ├── Data
│       │   └── _readme.txt
│       └── ServiceManifest.xml
├── HelloWorldActorInterface
│   ├── build.gradle
│   └── src
│       └── statefulactor
│           └── HelloWorldActor.java
├── HelloWorldActorTestClient
│   ├── build.gradle
│   ├── settings.gradle
│   ├── src
│   │   └── statefulactor
│   │       └── test
│   │           └── HelloWorldActorTestClient.java
│   └── testclient.sh
├── install.sh
├── settings.gradle
└── uninstall.sh

```

## Reliable Actors basic building blocks

A typical Reliable Actors application is composed of several parts.

### Actor interface

This contains the interface definition for the actor. This interface defines the actor contract that is shared by the actor implementation and the clients calling the actor, so it typically makes sense to define it in a place that is separate from the actor implementation and can be shared by multiple other services or client applications.

`HelloWorldActorInterface/src/statefulactor/HelloWorldActor.java`:
```java
public interface HelloWorldActor extends Actor {
    @Readonly   
    CompletableFuture<Integer> getCountAsync();

    CompletableFuture<?> setCountAsync(int count);
}
```

### Actor service 
This contains your actor implementation and actor registration code. The actor class implements the actor interface. This is where your actor does its work.

`HelloWorldActor/src/statefulactor/HelloWorldActorImpl`:
```java
@ActorServiceAttribute(name = "HelloWorldActor.HelloWorldActorService")
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
public class HelloWorldActorImpl extends ActorWithState implements HelloWorldActor {
    Logger logger = Logger.getLogger(this.getClass().getName());

    protected CompletableFuture<?> onActivateAsync() {
        logger.log(Level.INFO, "onActivateAsync");

        return this.stateManager().tryAddStateAsync("count", 0);
    }

    @Override
    public CompletableFuture<Integer> getCountAsync() {
        logger.log(Level.INFO, "Getting current count value");
        return this.stateManager().getStateAsync("count");
    }

    @Override
    public CompletableFuture<?> setCountAsync(int count) {
        logger.log(Level.INFO, "Setting current count value {0}", count);
        return this.stateManager().addOrUpdateStateAsync("count", count, (key, value) -> count > value ? count : value);
    }
}
```

The actor service must be registered with a service type in the Service Fabric runtime. In order for the Actor Service to run your actor instances, your actor type must also be registered with the Actor Service. The `ActorRuntime` registration method performs this work for actors.

`HelloWorldActor/src/statefulactor/HelloWorldActorService`:
```java
public class HelloWorldActorService {
	
    public static void main(String[] args) throws Exception {
		
        try {
            ActorRuntime.registerActorAsync(HelloWorldActorImpl.class, 
                (context, actorType) -> new ActorServiceImpl(context, actorType, ()-> new HelloWorldActorImpl()), 
                Duration.ofMinutes

            Thread.sleep(Long.MAX_VALUE);
			
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
```

### The application 

This represents the application that packages all of the services together for deployment. It contains the *ApplicationManifest.xml* and place holders for the actor service package.

### Test client
 
This is a simple test client application you can run separately from the Service Fabric application to test your actor service. It does not get deployed with your service.

## Debugging

The Service Fabric tools for Visual Studio support debugging on your local machine. You can start a debugging session by hitting the F5 key. Visual Studio builds (if necessary) packages. It also deploys the application on the local Service Fabric cluster and attaches the debugger.

During the deployment process, you can see the progress in the **Output** window.

![Service Fabric debugging output window][3]


## Next steps
 - [How Reliable Actors use the Service Fabric platform](service-fabric-reliable-actors-platform.md)
 - [Actor state management](service-fabric-reliable-actors-state-management.md)
 - [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
 - [Actor API reference documentation](https://msdn.microsoft.com/library/azure/dn971626.aspx)
 - [Sample code](https://github.com/Azure/servicefabric-samples)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-newproject.PNG
[2]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-projectstructure.PNG
[3]: ./media/service-fabric-reliable-actors-get-started/debugging-output.PNG
[4]: ./media/service-fabric-reliable-actors-get-started/vs-context-menu.png
[5]: ./media/service-fabric-reliable-actors-get-started/reliable-actors-newproject1.PNG
