<properties
   pageTitle="Service Fabric programming model overview | Microsoft Azure"
   description="Service Fabric offers two frameworks for building services: the actor framework and the services framework. They offer distinct trade-offs in simplicity and control."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="01/26/2016"
   ms.author="seanmck"/>

# Service Fabric programming model overview

Service Fabric offers multiple ways to write and manage your services. Services can choose to use the Service Fabric APIs to take advantage of Service Fabric features and application frameworks, or services can simply be any compiled executable program - called a "guest executable" - written in any language and simply hosted on the Service Fabric platform.

## Comparing guest executables with the Service Fabric API

The following table illustrates the differences between a guest executable and a service using the Service Fabric API.

Service Fabric feature | Guest EXE | Service Fabric API
---|---|---
Supported language and runtimes|Any|C#/.NET
Supports stateless or stateful|Stateless only|Both stateless and stateful
State high availability|N/A - stateless only|Yes
Service high availability|Yes|Yes
Service version management|Yes|Yes
Rolling upgrades|Yes|Yes
Health monitoring|Limited to EXE exit code|Yes
Health reporting|No|Yes
Service endpoint discovery|No|Yes

## When to use guest executables or the Service Fabric API

 - **Guest executable**: when you have an existing program that you want to host on Service Fabric or you want to use a language or runtime currently not supported by the Service Fabric API.

 - **Service Fabric API**: when you want to take advantage of the full set of Service Fabric features, have tighter integration with Service Fabric's application lifecycle management and health monitoring, and achieve higher application density.

## Next steps

- [Learn more about guest executables](service-fabric-deploy-existing-app.md)
- [Learn more about the Reliable Services APIs](../Service-Fabric/service-fabric-reliable-services-introduction.md)
- [Learn more about the Reliable Actors APIs](service-fabric-reliable-actors-introduction.md)
