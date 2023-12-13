---
title: Azure Container Apps overview
description: Learn about common scenarios and uses for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: overview
ms.date: 11/14/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022, ignite-2022, build-2023
---

# Azure Container Apps overview

Azure Container Apps is a serverless platform that allows you to maintain less infrastructure and save costs while running containerized applications. Instead of worrying about server configuration, container orchestration, and deployment details, Container Apps provides all the up-to-date server resources required to keep your applications stable and secure.

Common uses of Azure Container Apps include:

- Deploying API endpoints
- Hosting background processing jobs
- Handling event-driven processing
- Running microservices

Additionally, applications built on Azure Container Apps can dynamically scale based on the following characteristics:

- HTTP traffic
- Event-driven processing
- CPU or memory load
- Any [KEDA-supported scaler](https://keda.sh/docs/scalers/)

:::image type="content" source="media/overview/azure-container-apps-example-scenarios.png" alt-text="Example scenarios for Azure Container Apps.":::

To begin working with Container Apps, select the description that best describes your situation.

| | Description | Resource |
|---|---|---|
| **I'm new to containers**| Start here if you have yet to build your first container, but are curious how containers can serve your development needs. | [Learn more about containers](start-containers.md) |
| **I'm using serverless containers** | Container Apps provides automatic scaling, reduces operational complexity, and allows you to focus on your application rather than infrastructure.<br><br>Start here if you're interested in management, scalability, and pay-per-use features of cloud computing. | [Learn more about serverless containers](start-serverless-containers.md) |

## Features

With Azure Container Apps, you can:

- [**Use the Azure CLI extension, Azure portal or ARM templates**](get-started.md) to manage your applications.

- [**Enable HTTPS or TCP ingress**](ingress.md) without having to manage other Azure infrastructure.

- [**Build microservices with Dapr**](microservices.md) and [access its rich set of APIs](./dapr-overview.md).

- [**Run jobs**](jobs.md) on-demand, on a schedule, or based on events.

- Add [**Azure Functions**](https://aka.ms/functionsonaca) and [**Azure Spring Apps**](https://aka.ms/asaonaca) to your Azure Container Apps environment.

- [**Use specialized hardware**](plans.md) for access to increased compute resources.

- [**Run multiple container revisions**](application-lifecycle-management.md) and manage the container app's application lifecycle.

- [**Autoscale**](scale-app.md) your apps based on any KEDA-supported scale trigger. Most applications can scale to zero<sup>1</sup>.

- [**Split traffic**](revisions.md) across multiple versions of an application for Blue/Green deployments and A/B testing scenarios.

- [**Use internal ingress and service discovery**](connect-apps.md) for secure internal-only endpoints with built-in DNS-based service discovery.

- [**Run containers from any registry**](containers.md), public or private, including Docker Hub and Azure Container Registry (ACR).

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
