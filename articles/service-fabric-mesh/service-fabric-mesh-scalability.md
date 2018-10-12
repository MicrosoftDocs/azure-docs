---
title: Scalability of Azure Service Fabric Mesh apps | Microsoft Docs
description: Learn about scaling services in Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords:  
author: rwike77
ms.author: ryanwi
ms.date: 10/12/2018
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: timlt 
---
# Service scalability

## Manual scaling instances

## Auto-scaling service instances
Autoscaling (part of Service REsource)

Horizontal scaling of services based on: CPU utilization, memory utilization, application provided custom metrics (later)  

Intent:  Number of instances can scale up or down, optimizing for two things: make sure it's operating at right number for your workload, helping you optimize for cost.

In Service resource, there is a autoScalePolicy.  
Trigger- defines when the autoscaling policy is invoked. Trigger specifies lower and upper load threshold and the how often the system should check.
Mechanism- Describes which action takes place once auto-scaling is triggered.  Set a min and max count and a scaling increment (how many the count should increase/decrease)
    
## Next steps

For information on the application model, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)
