---
title: Azure Container Apps overview
description: Learn about common scenarios and uses for Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  overview
ms.date: 10/19/2021
ms.author: cshoe
---

# Azure Container Apps overview

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. Common uses of Azure Container Apps include:

- Deploying API endpoints
- Hosting background processing applications
- Handling event-driven processing
- Running microservices

Applications built on Azure Container Apps can dynamically scale based on the following characteristics:

- HTTP traffic
- Event-driven processing
- CPU or memory load
- Any [KEDA-supported scaler](https://keda.sh/docs/scalers/)

:::image type="content" source="media/overview/azure-container-apps-example-scenarios.png" alt-text="Example scenarios for Azure Container Apps.":::

Azure Container Apps is an unopinionated service that allows you to develop applications based on your own programming model. Your containers are not required to use any specific base container image, or reference any specific libraries or SDKs. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

With Azure Container Apps, you can:

- [Run multiple container revisions](application-lifecycle-management.md) and manage the container app's application lifecycle.

- [Autoscale](scale-app.md) your apps based on any KEDA-supported scale trigger. Most applications can scale to zero<sup>1</sup>.

- [Enable HTTPS ingress](get-started.md) without having to manage other Azure infrastructure.

- [Split traffic](get-started.md) across multiple versions of an application for Blue/Green deployments and A/B testing scenarios.

- [Use internal ingress and service discovery](connect-apps.md) for secure internal-only endpoints with built-in DNS-based service discovery.

- [Provide your own VNET](get-started.md) as you deploy your apps.

- [Build microservices with Dapr](microservices.md) and access its rich set of APIs.

- [Run containers from any registry](containers.md), public or private, including Docker Hub and Azure Container Registry (ACR).

- [Use the Azure CLI extension or ARM templates](get-started.md) to manage your applications.

- [Securely manage secrets](secure-app.md) directly in your application.

- [View application logs](monitor.md) using Azure Log Analytics.

<sup>1</sup> Applications that [scale on CPU or memory load](scale-app.md) can't scale to zero.

### Next steps

> [!div class="nextstepaction"]
> [Deploy your first container app](get-started.md)
