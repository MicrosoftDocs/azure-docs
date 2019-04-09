---
title: Auto-scale an app running in Azure Service Fabric Mesh | Microsoft Docs
description: Learn how to configure auto-scale policies for the services of a Service Fabric Mesh application.
services: service-fabric-mesh
documentationcenter: .net
author: dkkapur
manager: jeconnoc
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/07/2018
ms.author: dekapur
ms.custom: mvc, devcenter
#Customer intent: As a developer, I want to scale for demand by autoscaling services in a Service Fabric Mesh application.
---

# Create autoscale policies for a Service Fabric Mesh application
One of the main advantages of deploying applications to Service Fabric Mesh is the ability for you to easily scale your services in or out. This should be used for handling varying amounts of load on your services, or improving availability. You can manually scale your services in or out or set up autoscaling policies.

[Auto scaling](service-fabric-mesh-scalability.md#autoscaling-service-instances) allows you to dynamically scale the number of your service instances (horizontal scaling). Auto scaling gives great elasticity and enables provisioning or removal of service instances based on CPU or memory utilization.

## Options for creating an auto scaling policy, trigger, and mechanism
An auto scaling policy is defined for each service you want to scale. The policy is defined in either the YAML service resource file or the JSON deployment template. Each scaling policy consists of two parts: a trigger and a scaling mechanism.

The trigger defines when an autoscaling policy is invoked.  Specify the kind of trigger (average load) and the metric to monitor (CPU or memory).  Upper and lower load thresholds specified as a percentage. The scale interval defines how often to check (in seconds) the specified utilization (such as average CPU load) across all the currently deployed service instances.  The mechanism is triggered when the monitored metric drops below the lower threshold or increases above the upper threshold.  

The scaling mechanism defines how to perform the scaling operation when the policy is triggered.  Specify the kind of mechanism (add/remove replica), the minimum and maximum replica counts (as integers).  The number of service replicas will never be scaled below the minimum count or above the maximum count.  Also specify the scale increment as an integer, which is the number of replicas that will be added or removed in a scaling operation.  

## Define an auto scaling policy in a JSON template

The following example shows an autoscaling policy in a JSON deployment template.  The autoscaling policy is declared in a property of the service to be scaled.  In this example, a CPU average load trigger is defined.  The mechanism will be triggered if the average CPU load of all the deployed instances drops below 0.2 (20%) or goes above 0.8 (80%).  The CPU load is checked every 60 seconds.  The scaling mechanism is defined to add or remove instances if the policy is triggered.  Service instances will be added or removed in increments of one.  A minimum instance count of one and a maximum instance count of 40 is also defined.

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
    { ... },       
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

## Define an autoscale policy in a service.yaml resource file
The following example shows an autoscaling policy in a service resource (YAML) file.  The autoscaling policy is declared as a property of the service to be scaled.  In this example, a CPU average load trigger is defined.  The mechanism will be triggered if the average CPU load of all the deployed instances drops below 0.2 (20%) or goes above 0.8 (80%).  The CPU load is checked every 60 seconds.  The scaling mechanism is defined to add or remove instances if the policy is triggered.  Service instances will be added or removed in increments of one.  A minimum instance count of one and a maximum instance count of 40 is also defined.

```yaml
## Service definition ##
application:
  schemaVersion: 1.0.0-preview2
  name: WorkerApp
  properties:
    services:
      - name: WorkerService
        properties:
          description: WorkerService description.
          osType: Linux
          codePackages:
            ...
          replicaCount: 1
          autoScalingPolicies:
            - name: AutoScaleWorkerRule
              trigger:
                kind: AverageLoad
                metric:
                  kind: Resource
                  name: cpu
                lowerLoadThreshold: 0.2
                upperLoadThreshold: 0.8
                scaleIntervalInSeconds: 60
              mechanism:
                kind: AddRemoveReplica
                minCount: 1
                maxCount: 40
                scaleIncrement: 1
          ...
```

## Next steps
Learn how to [manually scale a service](service-fabric-mesh-tutorial-template-scale-services.md)
