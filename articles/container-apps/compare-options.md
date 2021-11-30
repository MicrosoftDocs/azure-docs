---
title: 'Comparing Container Apps with other Azure container options'
description: Understand when to use Azure Container Apps and how it compares to d container options including Azure Container Instances, Azure App Services, Azure Functions, and Azure Kubernetes Service.
services: app-service
author: jeffhollan
ms.service: app-service
ms.topic:  quickstart
ms.date: 11/03/2021
ms.author: jehollan
ms.custom: ignite-fall-2021
---

# Comparing Container Apps with other Azure container options

There are many options for teams to build and deploy cloud native and containerized applications on Azure. This article will help you understand which scenarios and use cases are best suited for Azure Container Apps and how it compares to other container options on Azure including:  
- Azure Container Instances
- Azure App Services
- Azure Functions
- Azure Kubernetes Service

There's no perfect solution for every use case and every team. The following explanation provides general guidance and recommendations as a starting point to help find the best fit for your team and your requirements.

> [!IMPORTANT]
> Azure Container Apps is currently in public preview while these other options are generally available (GA).


## Container option comparisons

### Azure Container Apps
Azure Container Apps enables you to build serverless microservices based on containers. Distinctive features of Container Apps include:

* Optimized for running general purpose containers, especially for applications that spans many microservices deployed in containers.
* Powered by Kubernetes and open-source technologies like [Dapr](https://dapr.io/), [KEDA](https://keda.sh/), and [envoy](https://www.envoyproxy.io/).
* Supports Kubernetes-style apps and microservices with features like [service discovery](connect-apps.md) and [traffic splitting](revisions.md).
* Enables event-driven application architectures by supporting scale based on traffic and pulling from [event sources like queues](scale-app.md), including [scale to zero](scale-app.md).
* Support of long running processes and can run [background tasks](background-processing.md).
* All Container Apps are Kubernetes compatible.

Azure Container Apps doesn't provide direct access to the underlying Kubernetes APIs. If you require access to the Kubernetes APIs and control plane, you should use [Azure Kubernetes Service](../aks/intro-kubernetes.md). However, if you would like to build Kubernetes-style applications and don't require direct access to all the native Kubernetes APIs and cluster management, Container Apps provides a fully managed experience based on best-practices. For these reasons, many teams may prefer to start building container microservices with Azure Container Apps.

### Azure App Services
Azure App Services provides fully managed hosting for web applications including websites and web APIs. These web applications may be deployed using code or containers. Azure App Services is optimized for web applications. Azure App Services is integrated with other Azure services including Azure Container Apps or Azure Functions. If building a web application, especially if moving from another web hosting solution, Azure App Services will provide the best experience.

### Azure Container Instances
Azure Container Instances provide a Hyper-V isolated serverless hosted containers on demand. It can be thought of as a lower-level "building block" option compared to Container Apps. Azure Container Apps provide many *application-specific concepts on top of containers, including certificates, revisions, scale, and environments. However, if you're looking for a less "opinionated" building block, Azure Container Instances is an ideal option. Scenarios like controlled batch jobs, long-running jobs, or hosting managed compute environments are ideal for Azure Container Instances.   Users often interact with Azure Container Instances through other services. For example, Azure Kubernetes Service can layer orchestration on top of container instance through [virtual nodes](../aks/virtual-nodes.md).

### Azure Kubernetes Service
Azure Kubernetes Service provides a fully managed Kubernetes option in Azure. It supports direct access to the Kubernetes API and runs any Kubernetes workload. Teams that need a fully managed and secure version of Kubernetes in Azure, Azure Kubernetes Service is the ideal option.

### Azure Functions
Azure Functions is a serverless Functions-as-a-Service (FaaS) solution. It's optimized for running event-driven functions using the functions programming model. It shares many characteristics with Azure Container Apps around scale and integration with events, but optimized for ephemeral functions deployed as either code or containers. The Azure Functions programming model provides productivity benefits for teams looking to trigger on events and bind to other data sources. When building FaaS-style functions, Azure Functions is the ideal option. The Azure Functions programming model is available as a base container image, making it portable to other container based compute platforms allowing teams to reuse code as  environment requirements change.

### Azure Spring Cloud
Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more. If your team or organization is predominantly Spring, Azure Spring Cloud is an ideal fit.

## Next steps

> [!div class="nextstepaction"]
> [Deploy your first container app](get-started.md)