---
title: Create your first actor-based Azure microservice in Java | Microsoft Docs
description: This tutorial walks you through the steps of creating, debugging, and deploying a simple actor-based service using Service Fabric Reliable Actors.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: timlt
editor: ''

ms.assetid: d31dc8ab-9760-4619-a641-facb8324c759
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/04/2017
ms.author: vturecek

---
# Getting started with Reliable Actors
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-actors-get-started.md)
> * [Java on Linux](service-fabric-reliable-actors-get-started-java.md)
> 
> 

This article explains the basics of Azure Service Fabric Reliable Actors and walks you through creating and deploying a simple Reliable Actor application in Java.

## Installation and setup
Before you start, make sure you have the Service Fabric development environment set up on your machine.
If you need to set it up, go to [getting started on Mac](service-fabric-get-started-mac.md) or [getting started on Linux](service-fabric-get-started-linux.md).

## Basic concepts
To get started with Reliable Actors, you only need to understand a few basic concepts:

* **Actor service**. Reliable Actors are packaged in Reliable Services that can be deployed in the Service Fabric infrastructure. Actor instances are activated in a named service instance.
* **Actor registration**. As with Reliable Services, a Reliable Actor service needs to be registered with the Service Fabric runtime. In addition, the actor type needs to be registered with the Actor runtime.
* **Actor interface**. The actor interface is used to define a strongly typed public interface of an actor. In the Reliable Actor model terminology, the actor interface defines the types of messages that the actor can understand and process. The actor interface is used by other actors and client applications to "send" (asynchronously) messages to the actor. Reliable Actors can implement multiple interfaces.
* **ActorProxy class**. The ActorProxy class is used by client applications to invoke the methods exposed through the actor interface. The ActorProxy class provides two important functionalities:
  
  * Name resolution: It is able to locate the actor in the cluster (find the node of the cluster where it is hosted).
  * Failure handling: It can retry method invocations and re-resolve the actor location after, for example, a failure that requires the actor to be relocated to another node in the cluster.

The following rules that pertain to actor interfaces are worth mentioning:

* Actor interface methods cannot be overloaded.
* Actor interface methods must not have out, ref, or optional parameters.
* Generic interfaces are not supported.

## Create an actor service
Start by creating a new Service Fabric application. The Service Fabric SDK for Linux includes a Yeoman generator to provide the scaffolding for a Service Fabric application with a stateless service. Start by running the following Yeoman command:

```bash
$ yo azuresfjava
```

Follow the instructions to create a **Reliable Actor Service**. For this tutorial, name the application "HelloWorldActorApplication" and the actor "HelloWorldActor." The following scaffolding will be created:

```bash
HelloWorldActorApplication/
├── build.gradle
├── HelloWorldActor
│   ├── build.gradle
│   ├── settings.gradle
│   └── src
│       └── reliableactor
│           ├── HelloWorldActorHost.java
│           └── HelloWorldActorImpl.java
├── HelloWorldActorApplication
│   ├── ApplicationManifest.xml
│   └── HelloWorldActorPkg
│       ├── Code
│       │   ├── entryPoint.sh
│       │   └── _readme.txt
│       ├── Config
│       │   ├── _readme.txt
│       │   └── Settings.xml
│       ├── Data
│       │   └── _readme.txt
│       └── ServiceManifest.xml
├── HelloWorldActorInterface
│   ├── build.gradle
│   └── src
│       └── reliableactor
│           └── HelloWorldActor.java
├── HelloWorldActorTestClient
│   ├── build.gradle
│   ├── settings.gradle
│   ├── src
│   │   └── reliableactor
│   │       └── test
│   │           └── HelloWorldActorTestClient.java
│   └── testclient.sh
├── install.sh
├── settings.gradle
└── uninstall.sh
```

## Reliable Actors basic building blocks
The basic concepts described earlier translate into the basic building blocks of a Reliable Actor service.

### Actor interface
This contains the interface definition for the actor. This interface defines the actor contract that is shared by the actor implementation and the clients calling the actor, so it typically makes sense to define it in a place that is separate from the actor implementation and can be shared by multiple other services or client applications.

`HelloWorldActorInterface/src/reliableactor/HelloWorldActor.java`:

```java
public interface HelloWorldActor extends Actor {
    @Readonly   
    CompletableFuture<Integer> getCountAsync();

    CompletableFuture<?> setCountAsync(int count);
}
```

### Actor service
This contains your actor implementation and actor registration code. The actor class implements the actor interface. This is where your actor does its work.

`HelloWorldActor/src/reliableactor/HelloWorldActorImpl`:

```java
@ActorServiceAttribute(name = "HelloWorldActor.HelloWorldActorService")
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
public class HelloWorldActorImpl extends ReliableActor implements HelloWorldActor {
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

### Actor registration
The actor service must be registered with a service type in the Service Fabric runtime. In order for the Actor Service to run your actor instances, your actor type must also be registered with the Actor Service. The `ActorRuntime` registration method performs this work for actors.

`HelloWorldActor/src/reliableactor/HelloWorldActorHost`:

```java
public class HelloWorldActorHost {

    public static void main(String[] args) throws Exception {

        try {
            ActorRuntime.registerActorAsync(HelloWorldActorImpl.class, (context, actorType) -> new ActorServiceImpl(context, actorType, ()-> new HelloWorldActorImpl()), Duration.ofSeconds(10));

            Thread.sleep(Long.MAX_VALUE);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
```

### Test client
This is a simple test client application you can run separately from the Service Fabric application to test your actor service. This is an example of where the ActorProxy can be used to activate and communicate with actor instances. It does not get deployed with your service.

### The application
Finally, the application packages the actor service and any other services you might add in the future together for deployment. It contains the *ApplicationManifest.xml* and place holders for the actor service package.

## Run the application

The Yeoman scaffolding includes a gradle script to build the application and bash scripts to deploy and remove the
application. To deploy the application, first build the application with gradle:

```bash
$ gradle
```

This will produce a Service Fabric application package that can be deployed using Service Fabric CLI tools.

### Deploy with XPlat CLI

If using the XPlat CLI, the install.sh script contains the necessary Azure CLI commands to deploy the application 
package. Run the install.sh script to deploy the application.

```bash
$ ./install.sh
```

### Deploy with Azure CLI 2.0

If using the Azure CLI 2.0, see the reference doc on managing an [application life cycle using the Azure CLI 2.0](service-fabric-application-lifecycle-azure-cli-2-0.md).

## Related articles

* [Getting started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md)
* [Getting started with Service Fabric XPlat CLI](service-fabric-azure-cli.md)
