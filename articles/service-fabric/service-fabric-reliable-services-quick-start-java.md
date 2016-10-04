<properties
   pageTitle="Get started with Reliable Services | Microsoft Azure"
   description="Introduction to creating a Microsoft Azure Service Fabric application with stateless and stateful services."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/26/2016"
   ms.author="vturecek"/>

# Get started with Reliable Services

> [AZURE.SELECTOR]
- [C# on Windows](service-fabric-reliable-services-quick-start.md)
- [Java on Linux](service-fabric-reliable-services-quick-start-java.md)

This article explains the basics of Azure Service Fabric Reliable Services and walks you through creating and deploying a simple Reliable Service application written in Java.

## Installation and setup
Before you start, make sure you have the Service Fabric development environment set up on your machine.
If you need to set it up, go to [getting started on Mac](service-fabric-get-started-mac.md) or [getting started on Linux](service-fabric-get-started-linux.md).

## Basic concepts
To get started with Reliable Services, you only need to understand a few basic concepts:

 - **Service type**: This is your service implementation. It is defined by the class you write that extends `StatelessService` and any other code or dependencies used therein, along with a name and a version number.

 - **Named service instance**: To run your service, you create named instances of your service type, much like you create object instances of a class type. Service instances are in fact object instantiations of your service class that you write. 

 - **Service host**: The named service instances you create need to run inside a host. The service host is just a process where instances of your service can run.

 - **Service registration**: Registration brings everything together. The service type must be registered with the Service Fabric runtime in a service host to allow Service Fabric to create instances of it to run.  

## Create a stateless service

Start by creating a new Service Fabric application. The Service Fabric SDK for Linux includes a Yeoman generator to provide the scaffolding for a Service Fabric application with a stateless service. Start by running the following Yeoman command:

```bash
$ yo azuresfjava
```

Follow the instructions to create a **Reliable Stateless Service**. For this tutorial, name the application "HelloWorldApplication" and the service "HelloWorld". The result will include directories for the `HelloWorldApplication` and `HelloWorld`.

```bash
HelloWorldApplication/
├── build.gradle
├── HelloWorld
│   ├── build.gradle
│   └── src
│       └── statelessservice
│           ├── HelloWorldServiceHost.java
│           └── HelloWorldService.java
├── HelloWorldApplication
│   ├── ApplicationManifest.xml
│   └── HelloWorldPkg
│       ├── Code
│       │   ├── entryPoint.sh
│       │   └── _readme.txt
│       ├── Config
│       │   └── _readme.txt
│       ├── Data
│       │   └── _readme.txt
│       └── ServiceManifest.xml
├── install.sh
├── settings.gradle
└── uninstall.sh
```

## Implement the service

Open **HelloWorldApplication/HelloWorld/src/statelessservice/HelloWorldService.java**. This class defines the service type, and can run any code. The service API provides two entry points for your code:

 - An open-ended entry point method, called `runAsync()`, where you can begin executing any workloads, including long-running compute workloads.

```java
@Override
protected CompletableFuture<?> runAsync() {
    ...
}
```

 - A communication entry point where you can plug in your communication stack of choice. This is where you can start receiving requests from users and other services.

```java
@Override
protected List<ServiceInstanceListener> createServiceInstanceListeners() {
    ...
}
```

In this tutorial, we will focus on the `runAsync()` entry point method. This is where you can immediately start running your code.

### RunAsync

The platform calls this method when an instance of a service is placed and ready to execute. The open/close cycle of a service instance can occur many times over the lifetime of the service as a whole. This can happen for various reasons, including:

- The system moves your service instances for resource balancing.
- Faults occur in your code.
- The application or system is upgraded.
- The underlying hardware experiences an outage.

This orchestration is managed by Service Fabric to keep your service highly available and properly balanced.

#### Cancellation

It is vital that your code in `runAsync()` can stop execution when notified by Service Fabric. The `CompletableFuture` returned from `runAsync()` is canceled when Service Fabric requires your service to stop execution. The following example demonstrates how to handle a cancellation event: 

```java
    @Override
    protected CompletableFuture<?> runAsync() {

        CompletableFuture<?> completableFuture = new CompletableFuture<>();
        ExecutorService service = Executors.newFixedThreadPool(1);
        
        Future<?> userTask = service.submit(() -> {
            while (!Thread.currentThread().isInterrupted()) {
            	try
            	{
                   logger.log(Level.INFO, this.context().serviceName().toString());
                   Thread.sleep(1000);
            	}
            	catch (InterruptedException ex)
            	{
                    logger.log(Level.INFO, this.context().serviceName().toString() + " interrupted. Exiting");
                    return;
            	}
            }
         });
 
        completableFuture.handle((r, ex) -> {
            if (ex instanceof CancellationException) {
                userTask.cancel(true);
                service.shutdown();
            }
            return null;
        });
 
        return completableFuture;
   }
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
        logger.log(Level.SEVERE, "Exception in registration: {0}", ex.toString());
        throw ex;
    }
}
```

## Run the application

The Yeoman scaffolding includes a gradle script to build the application and bash scripts to deploy and un-deploy the application. To run the application, first build the application with gradle:

```bash
$ gradle
```

This will produce a Service Fabric application package that can be deployed using Service Fabric Azure CLI. The install.sh script contains the necessary Azure CLI commands to deploy the application package. Simply run the install.sh script to deploy:

```bask
$ ./install.sh
```
