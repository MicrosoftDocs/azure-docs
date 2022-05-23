---
title: 'Comparing Container Apps with other Azure container options'
description: Understand when to use Azure Container Apps and how it compares to other container options including Azure Container Instances, Azure App Service, Azure Functions, and Azure Kubernetes Service.
services: container-apps
author: jeffhollan
ms.service: container-apps
ms.topic: quickstart
ms.date: 11/03/2021
ms.author: jehollan
ms.custom: ignite-fall-2021, mode-other, event-tier1-build-2022
---

# Comparing Container Apps with other Azure container options

There are many options for teams to build and deploy cloud native and containerized applications on Azure. This article will help you understand which scenarios and use cases are best suited for Azure Container Apps and how it compares to other container options on Azure including:  
- [Azure App Service](#azure-app-service)
- [Azure Container Instances](#azure-container-instances)
- [Azure Kubernetes Service](#azure-kubernetes-service)
- [Azure Functions](#azure-functions)
- [Azure Spring Cloud](#azure-spring-cloud)
- [Azure Red Hat OpenShift](#azure-red-hat-openshift)

There's no perfect solution for every use case and every team. The following explanation provides general guidance and recommendations as a starting point to help find the best fit for your team and your requirements.

## Container option comparisons

### Azure Container Apps
Azure Container Apps enables you to build serverless microservices based on containers. Distinctive features of Container Apps include:

* Optimized for running general purpose containers, especially for applications that span many microservices deployed in containers.
* Powered by Kubernetes and open-source technologies like [Dapr](https://dapr.io/), [KEDA](https://keda.sh/), and [envoy](https://www.envoyproxy.io/).
* Supports Kubernetes-style apps and microservices with features like [service discovery](connect-apps.md) and [traffic splitting](revisions.md).
* Enables event-driven application architectures by supporting scale based on traffic and pulling from [event sources like queues](scale-app.md), including [scale to zero](scale-app.md).
* Support of long running processes and can run [background tasks](background-processing.md).

Azure Container Apps doesn't provide direct access to the underlying Kubernetes APIs. If you require access to the Kubernetes APIs and control plane, you should use [Azure Kubernetes Service](../aks/intro-kubernetes.md). However, if you would like to build Kubernetes-style applications and don't require direct access to all the native Kubernetes APIs and cluster management, Container Apps provides a fully managed experience based on best-practices. For these reasons, many teams may prefer to start building container microservices with Azure Container Apps.

You can get started building your first container app [using the quickstarts](get-started.md).

### Azure App Service
Azure App Service provides fully managed hosting for web applications including websites and web APIs. These web applications may be deployed using code or containers. Azure App Service is optimized for web applications. Azure App Service is integrated with other Azure services including Azure Container Apps or Azure Functions. When building web apps, Azure App Service is an ideal option.

### Azure Container Instances
Azure Container Instances (ACI) provides a single pod of Hyper-V isolated containers on demand. It can be thought of as a lower-level "building block" option compared to Container Apps. Concepts like scale, load balancing, and certificates are not provided with ACI containers. For example, to scale to five container instances, you create five distinct container instances. Azure Container Apps provide many application-specific concepts on top of containers, including certificates, revisions, scale, and environments. Users often interact with Azure Container Instances through other services. For example, Azure Kubernetes Service can layer orchestration and scale on top of ACI through [virtual nodes](../aks/virtual-nodes.md). If you need a less "opinionated" building block that doesn't align with the scenarios Azure Container Apps is optimizing for, Azure Container Instances is an ideal option.

### Azure Kubernetes Service
Azure Kubernetes Service provides a fully managed Kubernetes option in Azure. It supports direct access to the Kubernetes API and runs any Kubernetes workload. The full cluster resides in your subscription, with the cluster configurations and operations within your control and responsibility. Teams looking for a fully managed version of Kubernetes in Azure, Azure Kubernetes Service is an ideal option.

### Azure Functions
Azure Functions is a serverless Functions-as-a-Service (FaaS) solution. It's optimized for running event-driven applications using the functions programming model. It shares many characteristics with Azure Container Apps around scale and integration with events, but optimized for ephemeral functions deployed as either code or containers. The Azure Functions programming model provides productivity benefits for teams looking to trigger the execution of your functions on events and bind to other data sources. When building FaaS-style functions, Azure Functions is the ideal option. The Azure Functions programming model is available as a base container image, making it portable to other container based compute platforms allowing teams to reuse code as environment requirements change. 

### Azure Spring Cloud
Azure Spring Cloud makes it easy to deploy Spring Boot microservice applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more. If your team or organization is predominantly Spring, Azure Spring Cloud is an ideal option.

### Azure Red Hat OpenShift
Azure Red Hat OpenShift is jointly engineered, operated, and supported by Red Hat and Microsoft to provide an integrated product and support experience for running Kubernetes-powered OpenShift. With Azure Red Hat OpenShift, teams can choose their own registry, networking, storage, and CI/CD solutions, or use the built-in solutions for automated source code management, container and application builds, deployments, scaling, health management, and more from OpenShift. If your team or organization is using OpenShift, Azure Red Hat OpenShift is an ideal option.

## Next steps

> [!div class="nextstepaction"]
> [Deploy your first container app](get-started.md)
