---
title: Overview of Service Fabric | Microsoft Docs
description: An overview of Service Fabric, where applications are composed of many microservices to provide scale and resilience. Service Fabric is a distributed systems platform used to build scalable, reliable, and easily managed applications for the cloud.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/09/2017
ms.author: ryanwi

---
# So you want to learn about Service Fabric?

## The five minute overview
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and addresses the significant challenges in developing and managing cloud applications. By using Service Fabric, developers and administrators can avoid solving complex infrastructure problems and focus instead on implementing mission-critical, demanding workloads knowing that they are scalable, reliable, and manageable. Service Fabric represents the next-generation middleware platform for building and managing these enterprise-class, Tier-1 cloud-scale applications.  

This short Channel9 video introduces Service Fabric and microservices:
<center><a target="_blank" href="https://aka.ms/servicefabricvideo">  
<img src="./media/service-fabric-content-roadmap/OverviewVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

## The detailed overview
Service Fabric enables you to build and manage scalable and reliable applications composed of microservices that run at very high density on a shared pool of machines, which is referred to as a cluster. It provides a sophisticated runtime to build distributed, scalable, stateless and stateful microservices. It also provides comprehensive application management capabilities to provision, deploy, monitor, upgrade/patch, and delete deployed applications.  Read [Overview of Service Fabric](service-fabric-overview.md) to learn more.

Why a microservices design approach? All applications evolve over time. Successful applications evolve by being useful to people. How much do you know about your requirements today, and what will they be in the future? Sometimes, getting a simple app out the door as proof of concept is the driving factor (knowing that the application can be redesigned later). On the other hand, when companies talk about building for the cloud there is the expectation of growth and usage. The issue is that growth and scale are unpredictable. We would like to be able to prototype quickly while knowing that the app can scale to react to unpredictable growth and usage.  [What are microservices?](service-fabric-overview-microservices.md) describes how the microservice design approach meet these challenges and how you can create microservices which you can scale up or down, test, deploy, and manage independently.

Service Fabric offers a reliable and flexible platform that enables you to write and run many types of business applications and services.  You can also run any of your existing applications (written in any language).  These applications and microservices can be stateless or stateful, and they are resource-balanced across virtual machines to maximize efficiency. The unique architecture of Service Fabric enables you to perform near real-time data analysis, in-memory computation, parallel transactions, and event processing in your applications. You can easily scale your applications up or down (really in or out), depending on your changing resource requirements. Read [Application scenarios](service-fabric-application-scenarios.md) to learn about the categories of applications and services you can create as well as customer case studies.

This longer Microsoft Virtual Academy video describes the Service Fabric core concepts:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=tbuZM46yC_5206218965">  
<img src="./media/service-fabric-content-roadmap/CoreConceptsVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

## Get started and create your first app 
Using the Service Fabric SDKs and tools, you can develop apps in Windows, Linux, or MacOS environments and deploy those apps to clusters running on Windows or Linux.  The following guides will have you deploying an app within minutes.  After you've run your first application, download and run some of our [sample apps](http://aka.ms/servicefabricsamples).

### On Windows
The Service Fabric SDK includes an add-in for Visual Studio that provides templates and tools for creating, deploying, and debugging Service Fabric applications. These topics walk you through the process of creating your first application in Visual Studio and running it on your development computer.

[Set up your dev environment](service-fabric-get-started.md)
[Create your first app(C#)](service-fabric-create-your-first-application-in-visual-studio.md)

Try this extensive [hands-on-lab](https://msdnshared.blob.core.windows.net/media/2016/07/SF-Lab-Part-I.docx) to get familiar with the end-to-end development flow for Service Fabric.  Learn to create a stateless service, configure monitoring and health reports, and perform an application upgrade. 

The following Channel9 video walks you through the process of creating a C# app in Visual Studio:  
<center><a target="_blank" href="https://channel9.msdn.com/Blogs/Windows-Azure/Creating-your-first-Service-Fabric-application-in-Visual-Studio">  
<img src="./media/service-fabric-content-roadmap/first-app-vid.png" WIDTH="360" HEIGHT="244">  
</a></center>

### On Linux
Service Fabric provides SDKs for building services on Linux in both .NET Core and Java. These topics walk you through the process of creating your first Java or C# application on Linux and running it on your development computer.
[Set up your dev environment](service-fabric-get-started-linux.md)
[Create your first app (Java)](service-fabric-create-your-first-linux-application-with-java.md)
[Create your first app (C#)](service-fabric-create-your-first-linux-application-with-csharp.md)

The following Microsoft Virtual Academy video walks you through the process of creating a Java app on Linux:  
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=DOX8K86yC_206218965">  
<img src="./media/service-fabric-content-roadmap/LinuxVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

### On MacOS
You can build Service Fabric applications on MacOS X to run on Linux clusters. These articles describe how to set up your Mac for development and walk you through the process of creating your first Java application on MacOS and running it on an Ubuntu virtual machine.
[Set up your dev environment](service-fabric-get-started-mac.md)
[Create your first app (Java)](service-fabric-create-your-first-linux-application-with-java.md)

## Core concepts
### Service Fabric clusters and nodes
A cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. Clusters can scale to thousands of machines.

A machine or VM that is part of a cluster is called a node. Each node is assigned a node name (a string). Nodes have characteristics such as placement properties. Each machine or VM has an auto-start Windows service, FabricHost.exe, which starts running upon boot and then starts two executables: Fabric.exe and FabricGateway.exe. These two executables make up the node. For testing scenarios, you can host multiple nodes on a single machine or VM by running multiple instances of Fabric.exe and FabricGateway.exe.

### Design time: app types, service types, app package and manifest, service package and manifest
### Run time: clusters, named apps, named services, partitions
### App lifecycle management
### Health systems
### Cluster resource manager

