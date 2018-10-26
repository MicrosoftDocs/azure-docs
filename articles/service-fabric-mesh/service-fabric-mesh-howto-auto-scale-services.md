---
title: Auto-scale an app running in Azure Service Fabric Mesh | Microsoft Docs
description: Learn how to configure auto-scale policies for the services of a Service Fabric Mesh application.
services: service-fabric-mesh
documentationcenter: .net
author: rwike77
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/25/2018
ms.author: ryanwi
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want learn how to create an autoscale policy for a Service Fabric Mesh application.
---

# Create auto-scale policies for a Service Fabric Meah application
One of the main advantages of deploying applications to Service Fabric Mesh is the ability for you to easily scale your services in or out. This should be used for handling varying amounts of load on your services, or improving availability. You can manually scale your services in or out or setup autoscaling polices.

[Auto scaling](service-fabric-mesh-scalability.md#auto-scaling-service-instances) is an additional capability of Service Fabric to dynamically scale the number of your service instances (horizontal scaling). Auto scaling gives great elasticity and enables provisioning or removal of service instances based on CPU or memory utilization.

## Define an auto scaling policy for a service
An auto scaling policy is defined per service in the service resource file. Each scaling policy consists of two parts: a trigger and a scaling mechanism.

```json
{
"apiVersion": "2018-09-01-preview",
"name": "WorkerApp",
"type": "Microsoft.ServiceFabricMesh/applications",
"location": "[parameters('location')]",
"dependsOn": [
"Microsoft.ServiceFabricMesh/networks/worker-app-network"
],
"properties": {
"services": [          
    {
    "name": "WorkerService",
    "properties": {
        "description": "Worker Service",
        "osType": "linux",
        "codePackages": [
        {  ...              }
        ],
        "replicaCount": 1,
        "autoScalingPolicies": [
        {
            "name": "AutoScaleWorkerRule",
            "trigger": {
            "kind": "AverageLoad",
            "metric": {
                "kind": "Resource",
                "name": "cpu"
            },
            "lowerLoadThreshold": "0.2",
            "upperLoadThreshold": "0.8",
            "scaleIntervalInSeconds": "60"
            },
            "mechanism": {
            "kind": "AddRemoveReplica",
            "minCount": "1",
            "maxCount": "40",
            "scaleIncrement": "1"
            }
        }
        ],        
        ...
    }
    }
]
}
}
```

## Next steps

