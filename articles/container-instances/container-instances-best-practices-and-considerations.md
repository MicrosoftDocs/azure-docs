---
title: Best practices and considerations
description: Best practices and considerations for customers to account for in their Container Instances workloads.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 07/22/2023
---

# Best practices and considerations for Azure Container Instances

Azure Container Instances allow you to package, deploy and manage cloud applications without having to manage the underlying infrastructure. Common scenarios that run on ACI include burst workloads, task automation, and build jobs. You can use ACI by defining the resources they need per container group, including vCPU and memory. ACI is a great solution for any scenario that can operate in isolated container and provides fast start up times, hyper-visor level security, custom container sizes, and more. The information below will help you determine if Azure Container Instances is best for your scenario.

## What to consider

There are default limits that may require quota increases. For more details: [Resource availability & quota limits for ACI - Azure Container Instances | Microsoft Learn](./container-instances-resource-and-quota-limits.md)

Container Images can't be larger than 15 GB, any images above this size may cause unexpected behavior: [How large can my container image be?](./container-instances-faq.yml)

If your container image is larger than 15 GB, you can [mount an Azure Fileshare](container-instances-volume-azure-files.md) to store the image.

If a container group restarts, the container group’s IP may change. We advise against using a hard coded IP address in your scenario. If you need a static public IP address, use Application Gateway: [Static IP address for container group - Azure Container Instances | Microsoft Learn](./container-instances-application-gateway.md).

There are ports that are reserved for service functionality. We advise you not to use these ports, because their use will lead to unexpected behavior: [Does the ACI service reserve ports for service functionality?](./container-instances-faq.yml).

Your container groups may restart due to platform maintenance events. These maintenance events are done to ensure the continuous improvement of the underlying infrastructure: [Container had an isolated restart without explicit user input](./container-instances-faq.yml).

ACI doesn't allow [privileged container operations](./container-instances-faq.yml). We advise you not to depend on using the root directory for your scenario 

## Best practices

We advise running container groups in multiple regions so your workloads can continue to run if there's an issue in one region.

We advise against using a hard coded IP address in your scenario since a container group's IP address isn't guaranteed. To mitigate connectivity issues, we recommend configuring a gateway. If your container is behind a public IP address and you need a static public IP address, use [Application Gateway](./container-instances-application-gateway.md). If your container is behind a virtual network and you need a static IP address, we recommend using [NAT Gateway](./container-instances-nat-gateway.md).

## Other Azure Container options

### Azure Container Apps
Azure Container Apps enables you to build serverless microservices based on containers. Azure Container Apps doesn't provide direct access to the underlying Kubernetes APIs. If you require access to the Kubernetes APIs and control plane, you should use Azure Kubernetes Service. However, if you would like to build Kubernetes-style applications and don't require direct access to all the native Kubernetes APIs and cluster management, Container Apps provides a fully managed experience based on best-practices. For these reasons, many teams may prefer to start building container microservices with Azure Container Apps.

### Azure App Service
Azure App Service provides fully managed hosting for web applications including websites and web APIs. These web applications may be deployed using code or containers. Azure App Service is optimized for web applications. Azure App Service is integrated with other Azure services including Azure Container Apps or Azure Functions. If you plan to build web apps, Azure App Service is an ideal option.

### Azure Container Instances
Azure Container Instances (ACI) provides a single pod of Hyper-V isolated containers on demand. It can be thought of as a lower-level "building block" option compared to Container Apps. Concepts like scale, load balancing, and certificates aren't provided with ACI containers. For example, to scale to five container instances, you create five distinct container instances. Azure Container Apps provide many application-specific concepts on top of containers, including certificates, revisions, scale, and environments. Users often interact with Azure Container Instances through other services. For example, Azure Kubernetes Service can layer orchestration and scale on top of ACI through virtual nodes. If you need a less "opinionated" building block that doesn't align with the scenarios Azure Container Apps is optimizing for, Azure Container Instances is an ideal option.

### Azure Kubernetes Service
Azure Kubernetes Service (AKS) provides a fully managed Kubernetes option in Azure. It supports direct access to the Kubernetes API and runs any Kubernetes workload. The full cluster resides in your subscription, with the cluster configurations and operations within your control and responsibility. Teams looking for a fully managed version of Kubernetes in Azure, Azure Kubernetes Service is an ideal option.

### Azure Functions
Azure Functions is a serverless Functions-as-a-Service (FaaS) solution. It's optimized for running event-driven applications using the functions programming model. It shares many characteristics with Azure Container Apps around scale and integration with events, but optimized for ephemeral functions deployed as either code or containers. The Azure Functions programming model provides productivity benefits for teams looking to trigger the execution of your functions on events and bind to other data sources. If you plan to build FaaS-style functions, Azure Functions is the ideal option. The Azure Functions programming model is available as a base container image, making it portable to other container based compute platforms allowing teams to reuse code as environment requirements change.

### Azure Spring Apps
Azure Spring Apps is a fully managed service for Spring developers. If you want to run Spring Boot, Spring Cloud or any other Spring applications on Azure, Azure Spring Apps is an ideal option. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

### Azure Red Hat OpenShift
Azure Red Hat OpenShift is jointly engineered, operated, and supported by Red Hat and Microsoft to provide an integrated product and support experience for running Kubernetes-powered OpenShift. With Azure Red Hat OpenShift, teams can choose their own registry, networking, storage, and CI/CD solutions, or use the built-in solutions for automated source code management, container and application builds, deployments, scaling, health management, and more from OpenShift. If your team or organization is using OpenShift, Azure Red Hat OpenShift is an ideal option.

## Next steps

Learn how to deploy a multi-container container group with an Azure Resource Manager template:

> [!div class="nextstepaction"]
> [Deploy a container group][resource-manager template]

<!-- LINKS - Internal -->
[resource-manager template]: container-instances-multi-container-group.md
