---
title: Azure Container Apps overview
description: Learn about common scenarios and uses for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: overview
ms.date: 03/13/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, ignite-2022
---

# Azure Container Apps overview

Azure Container Apps is a fully managed environment that enables you to run microservices and containerized applications on a serverless platform. Common uses of Azure Container Apps include:

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

Azure Container Apps enables executing application code packaged in any container and is unopinionated about runtime or programming model. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of managing cloud infrastructure and complex container orchestrators.

## Features

With Azure Container Apps, you can:

- [**Run multiple container revisions**](application-lifecycle-management.md) and manage the container app's application lifecycle.

- [**Autoscale**](scale-app.md) your apps based on any KEDA-supported scale trigger. Most applications can scale to zero<sup>1</sup>.

- [**Enable HTTPS or TCP ingress**](ingress-how-to.md) without having to manage other Azure infrastructure.

- [**Split traffic**](revisions.md) across multiple versions of an application for Blue/Green deployments and A/B testing scenarios.

- [**Use internal ingress and service discovery**](connect-apps.md) for secure internal-only endpoints with built-in DNS-based service discovery.

- [**Build microservices with Dapr**](microservices.md) and [access its rich set of APIs](./dapr-overview.md).

- [**Run containers from any registry**](containers.md), public or private, including Docker Hub and Azure Container Registry (ACR).

- [**Use the Azure CLI extension, Azure portal or ARM templates**](get-started.md) to manage your applications.

- [**Provide an existing virtual network**](vnet-custom.md) when creating an environment for your container apps.

- [**Securely manage secrets**](manage-secrets.md) directly in your application.

- [**Monitor logs**](log-monitoring.md) using Azure Log Analytics.

- [**Generous quotas**](quotas.md) which can be overridden to increase limits on a per-account basis.

<sup>1</sup> Applications that [scale on CPU or memory load](scale-app.md) can't scale to zero.

## Introductory video

> [!VIDEO https://www.youtube.com/embed/b3dopSTnSRg]

### Next steps

> [!div class="nextstepaction"]
> [Deploy your first container app](get-started.md)
