---
title: Service Fabric programming model overview 
description: 'Service Fabric offers two frameworks for building services: the actor framework and the services framework. They offer distinct trade-offs in simplicity and control.'
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---
# Service Fabric programming model overview

Service Fabric offers multiple ways to write and manage your services. Services can choose to use the Service Fabric APIs to take full advantage of the platform's features and application frameworks. Services can also be any compiled executable program written in any language or code running in a container hosted on a Service Fabric cluster.

## Guest executables

A [guest executable](service-fabric-guest-executables-introduction.md) is an existing, arbitrary executable (written in any language) that can be run as a service in your application. Guest executables do not call the Service Fabric SDK APIs directly. However they still benefit from features the platform offers, such as service discoverability, custom health and load reporting by calling REST APIs exposed by Service Fabric. They also have full application lifecycle support.

Get started with guest executables by deploying your first [guest executable application](service-fabric-deploy-existing-app.md).

## Containers

By default, Service Fabric deploys and activates services as processes. Service Fabric can also deploy services in [containers](service-fabric-containers-overview.md). Service Fabric supports deployment of Linux containers and Windows containers on Windows Server 2016 and later. Container images can be pulled from any container repository and deployed to the machine. You can deploy existing applications as guest executables, Service Fabric stateless or stateful Reliable services or Reliable Actors in containers, and you can mix services in processes and services in containers in the same application.

[Learn more about containerizing your services in Windows or Linux](./service-fabric-get-started-containers.md)

## Reliable Services

Reliable Services is a light-weight framework for writing services that integrate with the Service Fabric platform and benefit from the full set of platform features. Reliable Services provide a minimal set of APIs that allow the Service Fabric runtime to manage the lifecycle of your services and that allow your services to interact with the runtime. The application framework is minimal, giving you full control over design and implementation choices, and can be used to host any other application framework, such as ASP.NET Core.

Reliable Services can be stateless, similar to most service platforms, such as web servers, in which each instance of the service is created equal and state is persisted in an external solution, such as Azure DB or Azure Table Storage.

Exclusive to Service Fabric, Reliable Services can also be stateful, where state is persisted directly in the service itself using Reliable Collections. State is made highly-available through replication and distributed through partitioning, all managed automatically by Service Fabric.

[Learn more about Reliable Services](service-fabric-reliable-services-introduction.md) or get started by [writing your first Reliable Service](service-fabric-reliable-services-quick-start.md).

## ASP.NET Core

ASP.NET Core is an open-source, cross-platform framework for building modern cloud-based Internet-connected applications, such as web apps, IoT apps, and mobile backends. Service Fabric integrates with ASP.NET Core so you can write both stateless and stateful ASP.NET Core applications that take advantage of Reliable Collections and Service Fabric's advanced orchestration capabilities.

[Learn more about ASP.NET Core in Service Fabric](service-fabric-reliable-services-communication-aspnetcore.md) or get started by [writing your first ASP.NET Core Service Fabric application](service-fabric-tutorial-create-dotnet-app.md).

## Reliable Actors

Built on top of Reliable Services, the Reliable Actor framework is an application framework that implements the [Virtual Actor](https://research.microsoft.com/en-us/projects/orleans/) pattern, based on the computational [actor model](https://en.wikipedia.org/wiki/Actor_model). The Reliable Actor framework uses independent units of compute and state with single-threaded execution called *actors*. The Reliable Actor framework provides built-in communication for actors and pre-set state persistence and scale-out configurations.

Because Reliable Actors is an application framework built on Reliable Services, it is fully integrated with the Service Fabric platform and benefits from the full set of features offered by the platform.

[Learn more about Reliable Actors](service-fabric-reliable-actors-introduction.md) or get started by [writing your first Reliable Actor service](service-fabric-reliable-actors-get-started.md)

[Build a front end service using ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md)

## Next steps

[Service Fabric and containers overview](service-fabric-containers-overview.md)

[Reliable Services overview](service-fabric-reliable-services-introduction.md)

[Reliable Actors overview](service-fabric-reliable-actors-introduction.md)

[Service Fabric and ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md)
