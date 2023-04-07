---
title: Zero downtime deployment in Azure Spring Apps
description: Learn the zero downtime deployment in Azure Spring Apps
author: haital
ms.service: spring-apps
ms.topic: conceptual
ms.date: 04/14/2023
ms.author: 
ms.custom: devx-track-java
---

# Zero downtime deployment in Azure Spring Apps

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes the zero downtime deployment suport in Azure Spring Apps.

Achieving zero-downtime deployments is a fundamental goal for mission-critical applications. Your application needs to be available even when new releases are rolled out during business hours. With zero downtime deployment support in Azure Spring Apps, you can complete the deployment process from start to finish without any workload interuption.

## Zero downtime with blue-green deployment strategy

You can achieve zero downtime with [blue-green deployment stratgey](concepts-blue-green-deployment-strategies.md) in Azure Spring Apps. 

Blue-Green deployment eliminate downtime by running 2 deployment versions, and only one of the deployments can serve production traffic at any time. Blue-Green deployment can enable zero downtime by allowing you to switch to the other deployment version if something happens to the live one. 

When you perform a blue-green switch, Azure Spring Apps will do the folling operations underlyingly:
1. Override eureka registry status to **OUT_OF_SERVICE** for instances under staging deployment, if eureka client is enabled for the deployment
2. Update ingress rules to route public traffic to instances under production deployment, if public endpoint is enabled for the app 

Note, for blue-green deployment, you can achieve zero down time even for single replica deployment.

## Zero downtime with rolling update strategy

For deployment with replica number >=2, you can achieve zero down time using the rolling update strategy from Azure Spring Apps. 

When deploy a new version to an existing deployment, or restart a deployment, Azure Spring Apps underlying use k8s's [rolling update strategy](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) to do the update. Rolling updates allow deployments' update to take place with zero downtime by incrementally updating Pods instances with new ones. Your application will continously serve production traffic when doing rolling update if deployment replica >=2. 

Note, for single replica deployment, you will see downtime during deployment update. To ensure application avaiablity, it's highly suggested to deploy at leat 2 replicas for your production workload.   


Also, When scale in your application instances, Azure Spring Apps underlyingly use k8s's [preStop](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) to gracefuly shutdown the pods. In the hook, the following operations will be performed for a shuting down application container:
1. Override the instance's eureka registry status to **OUT_OF_SERVICE**, if eureka client is enabled
2. Wait some seconds to continue serve traffic (from nginx if any) before k8s kill the application container 


## Next steps

* [Blue-green deployment strategies in Azure Spring Apps](concepts-blue-green-deployment-strategies.md)
