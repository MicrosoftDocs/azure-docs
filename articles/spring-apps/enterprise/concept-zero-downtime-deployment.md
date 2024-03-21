---
title: Zero downtime deployment in Azure Spring Apps
description: Learn about zero downtime deployment with blue-green deployment strategies in Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/01/2023
ms.author: haital
ms.custom: devx-track-java
---

# Zero downtime deployment in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article describes the zero downtime deployment support in Azure Spring Apps.

Achieving zero downtime deployments is a fundamental goal for mission-critical applications. Your application needs to be available even when new releases are rolled out during business hours. With zero downtime deployment support in Azure Spring Apps, you can complete the deployment process from start to finish without any workload interruptions.

## Zero downtime with blue-green deployment strategy

You can achieve zero downtime with [blue-green deployment strategies](concepts-blue-green-deployment-strategies.md) in Azure Spring Apps.
A blue-green deployment eliminates downtime by running two deployment versions, with only one of the deployments serving production traffic at any time. A blue-green deployment provides zero downtime by allowing you to switch to the other deployment version if something disrupts the live deployment.

When you perform a blue-green switch, Azure Spring Apps performs the following underlying operations:

- If the Eureka client is enabled for the deployment, overrides and sets the Eureka registry status to `UP` for instances in the `production` deployment.
- If the Eureka client is enabled for the deployment, overrides and sets the Eureka registry status to `OUT_OF_SERVICE` for instances in the `staging` deployment.
- If a public endpoint is enabled for the app, updates ingress rules to route public traffic to instances in the `production` deployment.

> [!NOTE]
> For a blue-green deployment, you can achieve zero down time even for single-replica deployment.

## Zero downtime with rolling update strategy

For a deployment with a replica number of two or higher, you can achieve zero downtime with a rolling update strategy from Azure Spring Apps. When you deploy a new version to an existing deployment, or restart a deployment, Azure Spring Apps uses underlying Kubernetes rolling updates to perform the update.

Rolling updates enable deployment updates to take place with zero downtime by incrementally updating instances with new instances. Your application continues to serve production traffic when performing a rolling update if the deployment replica number is two or higher. For more information, see [Performing a Rolling Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/).

> [!WARNING]
> For single-replica deployment, you might see downtime during the deployment update. To ensure application availability, we recommend that you deploy with at least two replicas for your production workload.

> [!NOTE]
> To gracefully start or shutdown your application, you must configure health probes for your deployments. For more information, see [How to configure health probes and graceful termination periods for apps hosted in Azure Spring Apps](./how-to-configure-health-probes-graceful-termination.md). Kubernetes checks these probes during the rolling update process, and the Nginx ingress controller routes traffic to instances with a succeeded readiness probe.

When you scale in your application instances, Azure Spring Apps uses underlying Kubernetes [Container Lifecycle Hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) to gracefully shut down the pods.

In the hook, Azure Spring Apps performs the following operations for a shutting down an application container:

- If the Eureka client is enabled, overrides and sets the instance's Eureka registry status to `OUT_OF_SERVICE`.
- Waits a few seconds to continue to serve any traffic from Nginx or other applications before Kubernetes shuts down the application container.

## Next steps

- [Blue-green deployment strategies in Azure Spring Apps](concepts-blue-green-deployment-strategies.md)
- [How to configure health probes and graceful termination periods for apps hosted in Azure Spring Apps](how-to-configure-health-probes-graceful-termination.md)
