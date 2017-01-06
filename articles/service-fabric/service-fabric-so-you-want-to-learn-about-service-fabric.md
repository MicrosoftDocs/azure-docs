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
ms.date: 01/05/2017
ms.author: ryanwi

---
# So you want to learn about Service Fabric?

## The five minute overview
Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and addresses the significant challenges in developing and managing cloud applications. By using Service Fabric, developers and administrators can avoid solving complex infrastructure problems and focus instead on implementing mission-critical, demanding workloads knowing that they are scalable, reliable, and manageable. Service Fabric represents the next-generation middleware platform for building and managing these enterprise-class, Tier-1 cloud-scale applications.  

This short Channel9 video introduces Service Fabric and microservices:
<center><a target="_blank" href="https://aka.ms/servicefabricvideo">  
<img src="./media/service-fabric-overview/OverviewVid.png" WIDTH="360" HEIGHT="244">  
</a></center>


## The detailed overview
[Overview of SF](service-fabric-overview.md)
[What are microservices?](service-fabric-overview-microservices.md)
[Application scenarios](service-fabric-application-scenarios.md)
[Terminology](service-fabric-technical-overview.md)

This longer Microsoft Virtual Academy video describes the Service Fabric core concepts:
<center><a target="_blank" href="https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747?l=tbuZM46yC_5206218965">  
<img src="./media/service-fabric-overview/CoreConceptsVid.png" WIDTH="360" HEIGHT="244">  
</a></center>

## Get started and create your first app in a local cluster

### on Windows
[Set up your dev environment](service-fabric-get-started.md)
[Create your first app(C#)](service-fabric-create-your-first-application-in-visual-studio.md)
[HOL lab]()

### Linux
[Set up your dev environment](service-fabric-get-started-linux.md)
[Create your first app (Java)](service-fabric-create-your-first-linux-application-with-java.md)
[Create your first app (C#)](service-fabric-create-your-first-linux-application-with-csharp.md)

### on MacOS
[Set up your dev environment](service-fabric-get-started-mac.md)
[Create your first app (Java)](service-fabric-create-your-first-linux-application-with-java.md)

## Core concepts
### Service Fabric cluster
Cluster: A network-connected set of virtual or physical machines into which your microservices are deployed and managed. Clusters can scale to thousands of machines.

Node: A machine or VM that is part of a cluster is called a node. Each node is assigned a node name (a string). Nodes have characteristics such as placement properties. Each machine or VM has an auto-start Windows service, FabricHost.exe, which starts running upon boot and then starts two executables: Fabric.exe and FabricGateway.exe. These two executables make up the node. For testing scenarios, you can host multiple nodes on a single machine or VM by running multiple instances of Fabric.exe and FabricGateway.exe.

### Design time: app types, service types, app package and manifest, service package and manifest
### Run time: clusters, named apps, named services, partitions
### App lifecycle management
### Health systems
### Cluster resource manager

## Build an app

## Create and manage clusters

## Manage app lifecycle

## Manage and orchestrate cluster resources

## Inspect app and cluster health

## Monitor and diagnose

## Scale apps

## Test apps and services