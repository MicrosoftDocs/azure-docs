---
title: Create your first reliable service in Java 
description: Introduction to creating a Microsoft Azure Service Fabric application with stateless and stateful services in Java.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-extended-java
services: service-fabric
ms.date: 07/11/2022
---

# Get started with Reliable Services in Java
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-quick-start.md)
> * [Java on Linux](service-fabric-reliable-services-quick-start-java.md)
>
>

This article explains the basics of Azure Service Fabric Reliable Services and walks you through creating and deploying a simple Reliable Service application written in Java. 

[Check this page for a training video that shows you how to create a stateless Reliable service:](/shows/building-microservices-applications-on-azure-service-fabric/creating-a-stateless-reliable-service)

## Installation and setup
Before you start, make sure you have the Service Fabric development environment set up on your machine.
If you need to set it up, go to [getting started on Mac](service-fabric-get-started-mac.md) or [getting started on Linux](service-fabric-get-started-linux.md).

## Basic concepts
To get started with Reliable Services, you only need to understand a few basic concepts:

* **Service type**: This is your service implementation. It is defined by the class you write that extends `StatelessService` and any other code or dependencies used therein, along with a name and a version number.
* **Named service instance**: To run your service, you create named instances of your service type, much like you create object instances of a class type. Service instances are in fact object instantiations of your service class that you write.
* **Service host**: The named service instances you create need to run inside a host. The service host is just a process where instances of your service can run.
* **Service registration**: Registration brings everything together. The service type must be registered with the Service Fabric runtime in a service host to allow Service Fabric to create instances of it to run.  

## Create a stateless service
Start by creating a Service Fabric application. The Service Fabric SDK for Linux includes a Yeoman generator to provide the scaffolding for a Service Fabric application with a stateless service. Start by running the following Yeoman command:

```bash
$ yo azuresfjava
```

Follow the instructions to create a **Reliable Stateless Service**. For this tutorial, name the application "HelloWorldApplication" and the service "HelloWorld". The result includes directories for the `HelloWorldApplication` and `HelloWorld`.

```bash
HelloWorldApplication/
├── build.gradle
├── HelloWorld
│   ├── build.gradle
│   └── src
│       └── statelessservice
│           ├── HelloWorldServiceHost.java
│           └── HelloWorldService.java
├── HelloWorldApplication
│   ├── ApplicationManifest.xml
│   └── HelloWorldPkg
│       ├── Code
│       │   ├── entryPoint.sh
│       │   └── _readme.txt
│       ├── Config
│       │   └── _readme.txt
│       ├── Data
│       │   └── _readme.txt
│       └── ServiceManifest.xml
├── install.sh
├── settings.gradle
└── uninstall.sh
```
### Service registration
Service types must be registered with the Service Fabric runtime. The service type is defined in the `ServiceManifest.xml` and your service class that implements `StatelessService`. Service registration is performed in the process main entry point. In this example, the process main entry point is `HelloWorldServiceHost.java`:

```java
public static void main(String[] args) throws Exception {
    try {
        ServiceRuntime.registerStatelessServiceAsync("HelloWorldType", (context) -> new HelloWorldService(), Duration.ofSeconds(10));
        logger.log(Level.INFO, "Registered stateless service type HelloWorldType.");
        Thread.sleep(Long.MAX_VALUE);
    }
    catch (Exception ex) {
        logger.log(Level.SEVERE, "Exception in registration:", ex);
        throw ex;
    }
}
```

## Implement the service

Open **HelloWorldApplication/HelloWorld/src/statelessservice/HelloWorldService.java**. This class defines the service type, and can run any code. The service API provides two entry points for your code:

* An open-ended entry point method, called `runAsync()`, where you can begin executing any workloads, including long-running compute workloads.

```java
@Override
protected CompletableFuture<?> runAsync(CancellationToken cancellationToken) {
    ...
}
```

* A communication entry point where you can plug in your communication stack of choice. This is where you can start receiving requests from users and other services.

```java
@Override
protected List<ServiceInstanceListener> createServiceInstanceListeners() {
    ...
}
```

This tutorial focuses on the `runAsync()` entry point method. This is where you can immediately start running your code.

### RunAsync
The platform calls this method when an instance of a service is placed and ready to execute. For a stateless service, that means when the service instance is opened. A cancellation token is provided to coordinate when your service instance needs to be closed. In Service Fabric, this open/close cycle of a service instance can occur many times over the lifetime of the service as a whole. This can happen for various reasons, including:

* The system moves your service instances for resource balancing.
* Faults occur in your code.
* The application or system is upgraded.
* The underlying hardware experiences an outage.

This orchestration is managed by Service Fabric to keep your service highly available and properly balanced.

`runAsync()` should not block synchronously. Your implementation of runAsync should return a CompletableFuture to allow the runtime to continue. If your workload needs to implement a long running task that should be done inside the CompletableFuture.

#### Cancellation
Cancellation of your workload is a cooperative effort orchestrated by the provided cancellation token. The system waits for your task to end (by successful completion, cancellation, or fault) before it moves on. It is important to honor the cancellation token, finish any work, and exit `runAsync()` as quickly as possible when the system requests cancellation. The following example demonstrates how to handle a cancellation event:

```java
@Override
protected CompletableFuture<?> runAsync(CancellationToken cancellationToken) {

    // TODO: Replace the following sample code with your own logic
    // or remove this runAsync override if it's not needed in your service.

    return CompletableFuture.runAsync(() -> {
        long iterations = 0;
        while(true)
        {
        cancellationToken.throwIfCancellationRequested();
        logger.log(Level.INFO, "Working-{0}", ++iterations);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex){}
        }
    });
}
```

In this stateless service example, the count is stored in a local variable. But because this is a stateless service, the value that's stored exists only for the current lifecycle of its service instance. When the service moves or restarts, the value is lost.

## Create a stateful service
Service Fabric introduces a new kind of service that is stateful. A stateful service can maintain state reliably within the service itself, co-located with the code that's using it. State is made highly available by Service Fabric without the need to persist state to an external store.

To convert a counter value from stateless to highly available and persistent, even when the service moves or restarts, you need a stateful service.

In the same directory as the HelloWorld application, you can add a new service by running the `yo azuresfjava:AddService` command. Choose the "Reliable Stateful Service" for your framework and name the service "HelloWorldStateful". 

Your application should now have two services: the stateless service HelloWorld and the stateful service HelloWorldStateful.

A stateful service has the same entry points as a stateless service. The main difference is the availability of a state provider that can store state reliably. Service Fabric comes with a state provider implementation called Reliable Collections, which lets you create replicated data structures through the Reliable State Manager. A stateful Reliable Service uses this state provider by default.

Open HelloWorldStateful.java in **HelloWorldStateful -> src**, which contains the following RunAsync method:

```java
@Override
protected CompletableFuture<?> runAsync(CancellationToken cancellationToken) {
    Transaction tx = stateManager.createTransaction();
    return this.stateManager.<String, Long>getOrAddReliableHashMapAsync("myHashMap").thenCompose((map) -> {
        return map.computeAsync(tx, "counter", (k, v) -> {
            if (v == null)
                return 1L;
            else
                return ++v;
            }, Duration.ofSeconds(4), cancellationToken)
                .thenCompose((r) -> tx.commitAsync())
                .whenComplete((r, e) -> {
            try {
                tx.close();
            } catch (Exception e) {
                logger.log(Level.SEVERE, e.getMessage());
            }
        });
    });
}
```

### RunAsync
`RunAsync()` operates similarly in stateful and stateless services. However, in a stateful service, the platform performs additional work on your behalf before it executes `RunAsync()`. This work can include ensuring that the Reliable State Manager and Reliable Collections are ready to use.

### Reliable Collections and the Reliable State Manager
```java
ReliableHashMap<String,Long> map = this.stateManager.<String, Long>getOrAddReliableHashMapAsync("myHashMap")
```

[ReliableHashMap](/java/api/microsoft.servicefabric.data.collections.reliablehashmap) is a dictionary implementation that you can use to reliably store state in the service. With Service Fabric and Reliable HashMaps, you can store data directly in your service without the need for an external persistent store. Reliable HashMaps make your data highly available. Service Fabric accomplishes this by creating and managing multiple *replicas* of your service for you. It also provides an API that abstracts away the complexities of managing those replicas and their state transitions.

Reliable Collections can store any Java type, including your custom types, with a couple of caveats:

* Service Fabric makes your state highly available by *replicating* state across nodes, and Reliable HashMap stores your data to local disk on each replica. This means that everything that is stored in Reliable HashMaps must be *serializable*. 
* Objects are replicated for high availability when you commit transactions on Reliable HashMaps. Objects stored in Reliable HashMaps are kept in local memory in your service. This means that you have a local reference to the object.
  
   It is important that you do not mutate local instances of those objects without performing an update operation on the reliable collection in a transaction. This is because changes to local instances of objects will not be replicated automatically. You must reinsert the object back into the dictionary or use one of the *update* methods on the dictionary.

The Reliable State Manager manages Reliable HashMaps for you. You can ask the Reliable State Manager for a reliable collection by name at any time and at any place in your service. The Reliable State Manager ensures that you get a reference back. We don't recommend that you save references to reliable collection instances in class member variables or properties. Special care must be taken to ensure that the reference is set to an instance at all times in the service lifecycle. The Reliable State Manager handles this work for you, and it's optimized for repeat visits.


### Transactional and asynchronous operations
```java
return map.computeAsync(tx, "counter", (k, v) -> {
    if (v == null)
        return 1L;
    else
        return ++v;
    }, Duration.ofSeconds(4), cancellationToken)
        .thenCompose((r) -> tx.commitAsync())
        .whenComplete((r, e) -> {
    try {
        tx.close();
    } catch (Exception e) {
        logger.log(Level.SEVERE, e.getMessage());
    }
});
```

Operations on Reliable HashMaps are asynchronous. This is because write operations with Reliable Collections perform I/O operations to replicate and persist data to disk.

Reliable HashMap operations are *transactional*, so that you can keep state consistent across multiple Reliable HashMaps and operations. For example, you may get a work item from one Reliable Dictionary, perform an operation on it, and save the result in another Reliable HashMap, all within a single transaction. This is treated as an atomic operation, and it guarantees that either the entire operation will succeed or the entire operation will roll back. If an error occurs after you dequeue the item but before you save the result, the entire transaction is rolled back and the item remains in the queue for processing.


## Build the application

The Yeoman scaffolding includes a gradle script to build the application and bash scripts to deploy and remove the
application. To run the application, first build the application with gradle:

```bash
$ gradle
```

This produces a Service Fabric application package that can be deployed using Service Fabric CLI.

## Deploy the application

Once the application is built, you can deploy it to the local cluster.

1. Connect to the local Service Fabric cluster.

    ```bash
    sfctl cluster select --endpoint http://localhost:19080
    ```

2. Run the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

Deploying the built application is the same as any other Service Fabric application. See the documentation on
[managing a Service Fabric application with the Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md) for
detailed instructions.

Parameters to these commands can be found in the generated manifests inside the application package.

Once the application has been deployed, open a browser and navigate to
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) at
`http://localhost:19080/Explorer`. Then, expand the **Applications** node and note
that there is now an entry for your application type and another for the first instance of that type.

> [!IMPORTANT]
> To deploy the application to a secure Linux cluster in Azure, you need to configure a certificate to validate your application with the Service Fabric runtime. Doing so enables your Reliable Services services to communicate with the underlying Service Fabric runtime APIs. To learn more, see [Configure a Reliable Services app to run on Linux clusters](./service-fabric-configure-certificates-linux.md#configure-a-reliable-services-app-to-run-on-linux-clusters).  
>

## Next steps

* [Getting started with Service Fabric CLI](service-fabric-cli.md)
