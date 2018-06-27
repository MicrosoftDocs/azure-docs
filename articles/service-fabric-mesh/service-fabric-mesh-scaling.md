---
title: Scaling apps on Azure Service Fabric Mesh | Microsoft Docs
description: Learn about scaling applications deployed to Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: 
author: chackdan
ms.author: chackdan
ms.date: 06/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt
---
# Scaling applications deployed to Azure Service Fabric Mesh

Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. Applications scale on demand. You optimize resource usage by specifying auto-scale rules for the container(s) in the application definition.  

Auto scaling is a capability of Service Fabric Mesh to dynamically scale your services based on the load that services are reporting, or based on their usage of resources. Auto scaling gives great elasticity and enables provisioning of additional instances or partitions of your service on demand. The entire auto scaling process is automated and transparent, and once you set up your policies on a service there is no need for manual scaling operations at the service level. 

A common scenario where auto-scaling is useful is when the load on a particular service varies over time. For example, a service such as a gateway can scale based on the amount of resources necessary to handle incoming requests. Let's take a look at an example of what those scaling rules could look like:
- If all instances of my gateway are using more than two cores on average, then scale the gateway service out by adding one more instance. Do this every hour, but never have more than seven instances in total.
- If all instances of my gateway are using less than 0.5 cores on average, then scale the service in by removing one instance. Do this every hour, but never have fewer than three instances in total.

To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)