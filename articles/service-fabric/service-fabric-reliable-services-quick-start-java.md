---
title: Create your first reliable Azure microservice in Java | Microsoft Docs
description: Introduction to creating a Microsoft Azure Service Fabric application with stateless and stateful services.
services: service-fabric
documentationcenter: java
author: vturecek
manager: timlt
editor: ''

ms.assetid: 7831886f-7ec4-4aef-95c5-b2469a5b7b5d
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/10/2017
ms.author: vturecek

---
# Get started with Reliable Services
> [!div class="op_single_selector"]
> * [C# on Windows](service-fabric-reliable-services-quick-start.md)
> * [Java on Linux](service-fabric-reliable-services-quick-start-java.md)
>
>

This article explains the basics of Azure Service Fabric Reliable Services and walks you through creating and deploying a simple Reliable Service application written in Java. This Microsoft Virtual Academy video also shows you how to create a stateless Reliable service:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=DOX8K86yC_206218965">  
<img src="./media/service-fabric-reliable-services-quick-start-java/ReliableServicesJavaVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

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

In this tutorial, we focus on the `runAsync()` entry point method. This is where you can immediately start running your code.

### RunAsync
The platform calls this method when an instance of a service is placed and ready to execute. For a stateless service, that simply means when the service instance is opened. A cancellation token is provided to coordinate when your service instance needs to be closed. In Service Fabric, this open/close cycle of a service instance can occur many times over the lifetime of the service as a whole. This can happen for various reasons, including:

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

        CompletableFuture.runAsync(() -> {
          long iterations = 0;
          while(true)
          {
            cancellationToken.throwIfCancellationRequested();
            logger.log(Level.INFO, "Working-{0}", ++iterations);

            try
            {
              Thread.sleep(1000);
            }
            catch (IOException ex) {}
          }
        });
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
        logger.log(Level.SEVERE, "Exception in registration:", ex);
        throw ex;
    }
}
```

## Run the application

The Yeoman scaffolding includes a gradle script to build the application and bash scripts to deploy and remove the
application. To run the application, first build the application with gradle:

```bash
$ gradle
```

This produces a Service Fabric application package that can be deployed using Service Fabric Azure CLI.

### Deploy with XPlat CLI

If using the XPlat CLI, the install.sh script contains the necessary Azure CLI commands to deploy the application 
package. Run the install.sh script to deploy the application.

```bash
$ ./install.sh
```

### Deploy with Azure CLI 2.0

If using the Azure CLI 2.0, see the reference doc on managing an [application life cycle using the Azure CLI 2.0](service-fabric-application-lifecycle-azure-cli-2.0.md).
