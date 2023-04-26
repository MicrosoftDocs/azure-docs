---
title: Zero downtime deployment in Azure Spring Apps
description: Learn the zero downtime deployment in Azure Spring Apps
author: haital
ms.service: spring-apps
ms.topic: conceptual
ms.date: 04/14/2023
ms.author: haital
ms.custom: devx-track-java
---

# Zero downtime deployment in Azure Spring Apps

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article describes the zero downtime deployment support in Azure Spring Apps.

Achieving zero-downtime deployments is a fundamental goal for mission-critical applications. Your application needs to be available even when new releases are rolled out during business hours. With zero downtime deployment support in Azure Spring Apps, you can complete the deployment process from start to finish without any workload interruption.

## Zero downtime with blue-green deployment strategy

You can achieve zero downtime with [blue-green deployment strategy](concepts-blue-green-deployment-strategies.md) in Azure Spring Apps. 

Blue-green deployment eliminates downtime by running two deployment versions, and only one of the deployments can serve production traffic at any time. Blue-green deployment can enable zero downtime by allowing you to switch to the other deployment version if something bad happens to the live one. 

When you perform a blue-green switch, Azure Spring Apps does the following operations underlyingly:
1. Override eureka registry status to **UP** for instances under `production` deployment, if eureka client is enabled for the deployment
2. Override eureka registry status to **OUT_OF_SERVICE** for instances under `staging` deployment, if eureka client is enabled for the deployment
3. Update ingress rules to route public traffic to instances under `production` deployment, if public endpoint is enabled for the app 

> [!NOTE]
> For blue-green deployment, you can achieve zero down time even for single replica deployment.

## Zero downtime with rolling update strategy

For deployment with replica number >= 2, you can achieve zero down time using the rolling update strategy from Azure Spring Apps. 

When you deploy a new version to an existing deployment, or restart a deployment, Azure Spring Apps underlying uses K8S's [rolling update strategy](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) to do the update. Rolling updates allow deployments' update to take place with zero downtime by incrementally updating instances with new ones. Your application will continously serve production traffic when doing rolling update if deployment replica >= 2. 

> [!WARNING]
> For single replica deployment, you may see downtime during deployment update. To ensure application availability, it's highly suggested to deploy at least two replicas for your production workload.   

> [!NOTE]
> To gracefully start or shutdown your application, you need to configure proper [health probes](./how-to-configure-health-probes-graceful-termination.md) for your deployments. Kubernetes will check these probes during the rolling update process, and Nginx ingress controller routes traffic to instances with succeeded readiness probe.

Also, when scale in your application instances, Azure Spring Apps underlyingly use K8S's [preStop hook](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) to gracefully shutdown the pods. In the hook, the following operations are performed for a shutting down application container:
1. Override the instance's eureka registry status to **OUT_OF_SERVICE**, if eureka client is enabled
2. Wait some seconds to continue serve traffic (from Nginx or other apps if any) before K8S kills the application container 


## Next steps

* [Blue-green deployment strategies in Azure Spring Apps](concepts-blue-green-deployment-strategies.md)
* [How to configure health probes and graceful termination periods for apps hosted in Azure Spring Apps](how-to-configure-health-probes-graceful-termination.md)
