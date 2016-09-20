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

# Getting started with Reliable Actors
This article explains the basics of Azure Service Fabric Reliable Services and walks you through creating and deploying a simple Reliable Service application written in Java.

## Installation and setup
Before you start, make sure that you have the Service Fabric development environment for Linux set up. See detailed instructions on [how to set up the development environment](service-fabric-get-started.md).

## Basic concepts
To get started with Reliable Services, you need to understand a few basic concepts:

 - **Service type**: This is your service implementation. It is the class you write that extends `StatelessService`. 
 
 - **Service registration**: The service type is registered with Service Fabric and has a name and a version. 

 - **Service instance**: To run your service, you create instances of your service type, much like you create object instances of a class type. Service instances are in fact object instantiations of your service class that you write. 

 - **Service host**: The service instances you create need to run somewhere. The service host is a host process where instances of your service can run.

## Create a stateless service

Start by creating a new Service Fabric application. The Service Fabric SDK for Linux includes a Yeoman generator to provide the scaffolding for a Service Fabric application with a stateless service. Start by running the following Yeoman command:

```bash
$ yo azuresf
```

Follow the instructions to create a **Reliable Stateless Service - Java**. For this tutorial, we will name the application "HelloWorldApplication" and the service "HelloWorld". The result will include directories for the `HelloWorldApplication` and `HelloWorld`.

```bash
HelloWorldApplication/
├── build.gradle
├── HelloWorld
│   ├── build.gradle
│   └── src
│       └── statelessservice
│           ├── HelloWorld.java
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

Open **HelloWorldApplication/HelloWorld/src/statelessservice/HelloWorldService.java**. In Service Fabric, a service can run any business logic. The service API provides two entry points for your code:

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


The platform calls this method when an instance of a service is placed and ready to execute. For a stateless service, that simply means when the service instance is opened. A cancellation token is provided to coordinate when your service instance needs to be closed. In Service Fabric, this open/close cycle of a service instance can occur many times over the lifetime of the service as a whole. This can happen for various reasons, including:

- The system moves your service instances for resource balancing.
- Faults occur in your code.
- The application or system is upgraded.
- The underlying hardware experiences an outage.

This orchestration is managed by the system to keep your service highly available and properly balanced.

`runAsync()` is executed in its own task. Note that in the code snippet above, we jumped right into a *while* loop. There is no need to schedule a separate task for your workload. Cancellation of your workload is a cooperative effort orchestrated by the provided cancellation token. The system will wait for your task to end (by successful completion, cancellation, or fault) before it moves on. It is important to honor the cancellation token, finish any work, and exit `runAsync()` as quickly as possible when the system requests cancellation.

In this stateless service example, the count is stored in a local variable. But because this is a stateless service, the value that's stored exists only for the current lifecycle of its service instance. When the service moves or restarts, the value is lost.

## Service registration

Service types must be registered with the Service Fabric runtime. The service type is defined in the `ServiceManifest.xml` and your service class that implements `StatelessService`. Service registration is performed in the process main entry point. In this example, the process main entry point is `HelloWorld.java`:

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

We now return to the *HelloWorld* application. You can now build and deploy your services. When you press **F5**, your application will be built and deployed to your local cluster.

After the services start running, you can view the generated Event Tracing for Windows (ETW) events in a **Diagnostic Events** window. Note that the events displayed are from both the stateless service and the stateful service in the application. You can pause the stream by clicking the **Pause** button. You can then examine the details of a message by expanding that message.

>[AZURE.NOTE] Before you run the application, make sure that you have a local development cluster running. Check out the [getting started guide](service-fabric-get-started.md) for information on setting up your local environment.

## Next steps

[Debug your Service Fabric application in Visual Studio](service-fabric-debugging-your-application.md)

[Get started: Service Fabric Web API services with OWIN self-hosting](service-fabric-reliable-services-communication-webapi.md)

[Learn more about Reliable Collections](service-fabric-reliable-services-reliable-collections.md)

[Deploy an application](service-fabric-deploy-remove-applications.md)

[Application upgrade](service-fabric-application-upgrade.md)

[Developer reference for Reliable Services](https://msdn.microsoft.com/library/azure/dn706529.aspx)
