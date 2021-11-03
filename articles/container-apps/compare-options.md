---
title: 'Comparing Container Apps with other compute options'
description: Understand which scenarios and use cases are best suited for Azure Container Apps and how it compares to other compute options including Azure Container Instances, Azure App Services, Azure Functions, and Azure Kubernetes Service.
services: app-service
author: jeffhollan
ms.service: app-service
ms.topic:  quickstart
ms.date: 11/03/2021
ms.author: jehollan
ms.custom: ignite-fall-2021
---

# Comparing Container Apps with other compute options

Teams today have many viable options for building and deploying cloud native and containerized applications on Azure. This article will help you understand which scenarios and use cases are best suited for Azure Container Apps and how it compares to other compute options including Azure Container Instances, Azure App Services, Azure Functions, and Azure Kubernetes Service.

There is no perfect solution for every use case and every team. The below guidance provides general guidance and recommendations as a starting point for understanding the optimal tools to use for your specific use cases and requirements.

> [!IMPORTANT]
> Azure Container Apps is currently in public preview while these other options are generally available.


## Compute option comparisons

#### Azure Container Apps
Azure Container Apps provides serverless microservices based on containers. It is optimized for running general purpose containers as part of an application - especially an application that spans many containers as microservices. Behind-the-scenes, Azure Container Apps is powered by Kubernetes and open source technology like [Dapr](https://dapr.io/) and [KEDA](https://keda.sh/).  Because of this architecture, Container Apps supports Kubernetes-style applications and microservices with capabilities like [service discovery](connect-apps.md). Container Apps also supports capabilities like [scale to zero](scale-app.md), containers that pull from [event sources like queues](scale-app.md), and [background tasks](background-processing.md).

Azure Container Apps does not provide direct access to the underlying Kubernetes APIs. If you require access to the Kubernetes APIs and control plane, you should use [Azure Kubernetes Service](../aks/intro-kubernetes.md).  However, if you are looking to build Kubernetes-style applications and do not require direct access to the lower level Kubernetes APIs and cluster management, Container Apps provides a productive experience with best-practices managed by the platform. In addition, all Container Apps solution are Kubernetes-compatible. For these reasons, many teams may prefer to start buildling container microservices with Azure Container Apps.

#### Azure App Services
Azure App Services provides fully managed hosting for web applications including websites and web APIs.  These web applications may be deployed using code or containers. Azure App Services features are optimized on web applications. Azure App Services can integrate with compute running in other options including Azure Container Apps or Azure Functions. If building a web application, especially if moving from another web hosting solution, Azure App Services will provide the best experience.

#### Azure Container Instances
Azure Container Instances provides hyper-v isolated containers on a serverless platform. It's a fundamentally lower-level building block than Container Apps which provides single containers hosted on demand. Azure Container Apps provides many *app* specific concepts on top of containers, including certificates, revisions, scale, and environments. However, if you are looking for a more unopinionated building block, Azure Container Instances is an ideal option. Scenarios including controlled batch jobs, long-running jobs, or hosting managed compute environments are best suited for Azure Container Instances.  Often users will interact with Azure Container Instances through other services.  For instance, Azure Kubernetes Service can layer orchestration on top of container instance through the [virtual nodes](../aks/virtual-nodes.md) feature.

#### Azure Kubernetes Service
Azure Kubernetes Service provides a fully managed Kubernetes option in Azure. It supports direct access to the Kubernetes API and runs any Kubernetes workload. For teams looking for a fully managed and secure version of Kubernetes in Azure, Azure Kubernetes Service is the ideal option. 

#### Azure Functions
Azure Functions is a serverless Functions-as-a-Service (FaaS) solution in Azure. It is optimized for running event-driven functions using the functions programming model.  It shares many characteristics with Azure Container Apps around scale and integration with events, but is optimized for ephemeral functions publised as either code or containers. The Azure Functions programming model provides productivity benefits for teams looking to trigger on events and bind to other data sources. When building FaaS-style functions, Azure Functions is the ideal option.

### Next steps

> [!div class="nextstepaction"]
> [Deploy your first container app](get-started.md)