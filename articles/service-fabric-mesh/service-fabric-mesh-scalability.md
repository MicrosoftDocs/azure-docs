---
title: Scalability of Azure Service Fabric Mesh apps 
description: One of the advantages of deploying applications to Service Fabric Mesh is the ability to easily scale your services, either manually or with autoscaling policies.
author: dkkapur
ms.author: dekapur
ms.date: 10/26/2018
ms.topic: conceptual
---
# Scaling Service Fabric Mesh applications

One of the main advantages of deploying applications to Service Fabric Mesh is the ability for you to easily scale your services in or out. This should be used for handling varying amounts of load on your services, or improving availability. You can manually scale your services in or out or setup autoscaling policies.

## Manual scaling instances

In the deployment template for the application resource, each service has a *replicaCount* property that can be used to set the number of times you want that service deployed. An application can consist of multiple services, each service with a unique *replicaCount* number, which are deployed and managed together. In order to scale the number of service replicas, modify the *replicaCount* value for each service you want to scale in the deployment template or parameters file. Then upgrade the application.

For examples of manually scaling services instances, see [Manually scale your services in or out](service-fabric-mesh-tutorial-template-scale-services.md).

## Autoscaling service instances
Auto scaling is an additional capability of Service Fabric to dynamically scale the number of your service instances (horizontal scaling). Auto scaling gives great elasticity and enables provisioning or removal of service instances based on CPU or memory utilization.  Auto scaling enables you to run the right number of service instances for your workload and optimize for cost.

An auto scaling policy is defined per service in the service resource file. Each scaling policy consists of two parts:

- A scaling trigger, which describes when scaling of the service will be performed. There are three factors that determine when the service will scale. *Lower load threshold* is a value that determines when the service will be scaled in. If the average load of all instances of the partitions is lower than this value, then the service will be scaled in. *Upper load threshold* is a value that determines when the service will be scaled out. If the average load of all instances of the partition is higher than this value, then the service will be scaled out. *Scaling interval* determines how often (in seconds) the trigger will be checked. Once the trigger is checked, if scaling is needed the mechanism will be applied. If scaling is not needed, then no action will be taken. In both cases, trigger will not be checked again before scaling interval expires.

- A scaling mechanism, which describes how scaling will be performed when it is triggered. *Scale increment* determines how many instances will be added or removed when the mechanism is triggered. *Maximum instance count* defines the upper limit for scaling. If the number of instances reaches this limit, then the service will not be scaled out regardless of the load. *Minimum instance count* defines the lower limit for scaling. If number of instances of the partition reaches this limit, then service will not be scaled in regardless of the load.

To learn how to set an autoscale policy for your service, read [autoscale services](service-fabric-mesh-howto-auto-scale-services.md).

## Next steps

For information on the application model, see [Service Fabric resources](service-fabric-mesh-service-fabric-resources.md)
