---
title: Linux container support in Azure Functions
description: Describes the options for and benefits of running your function code in Linux containers in Azure.
ms.service: azure-functions
ms.custom:
  - build-2024
ms.topic: concept-article
ms.date: 04/05/2024

#CustomerIntent: As a developer, I want to understand the options that are available to me for hosting function apps in Linux containers so I can choose the best development and deployment options for containerized deployments of function code to Azure.
---

# Linux container support in Azure Functions

When you plan and develop your individual functions to run in Azure Functions, you are typically focused on the code itself. Azure Functions makes it easy to deploy just your code project to a function app in Azure. When you deploy your code project to a function app that runs on Linux, the project runs in a container that is created for you automatically. This container is managed by Functions.

Functions also supports containerized function app deployments. In a containerized deployment, you create your own function app instance in a local Docker container from a supported based image. You can then deploy this _containerized_ function app to a hosting environment in Azure. Creating your own function app container lets you customize or otherwise control the immediate runtime environment of your function code. 

## Container hosting options

There are several options for hosting your containerized function apps in Azure:

| Hosting option | Benefits |
| --- | --- |  
| **[Azure Container Apps]** | Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs. Container Apps hosting lets you run your functions in a managed Kubernetes-based environment with built-in support for open-source monitoring, mTLS, Dapr, and KEDA. Container Apps uses the power of the underlying Azure Kubernetes Service (AKS) while removing the complexity of having to work with Kubernetes APIs. | 
| **Azure Arc-enabled Kubernetes clusters (preview)** | You can host your function apps on Azure Arc-enabled Kubernetes clusters as either a [code-only deployment](./create-first-function-arc-cli.md) or in a [custom Linux container](./create-first-function-arc-custom-container.md). Azure Arc lets you attach Kubernetes clusters so that you can manage and configure them in Azure. _Hosting Azure Functions containers on Azure Arc-enabled Kubernetes clusters is currently in preview._ |
| **[Azure Functions]** | You can deploy your containerized function apps to run in either an [Elastic Premium plan](./functions-premium-plan.md) or a [Dedicated plan](./dedicated-plan.md). Premium plan hosting provides you with the benefits of dynamic scaling. You might want to use Dedicated plan hosting to take advantage of existing unused App Service plan resources. |  
| **[Kubernetes]** | Because the Azure Functions runtime provides flexibility in hosting where and how you want, you can host and manage your function app containers directly in Kubernetes clusters. [KEDA](https://keda.sh) (Kubernetes-based Event Driven Autoscaling) pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes. Just keep in mind that running your containerized function apps on Kubernetes, either by using KEDA or by direct deployment, is an open-source effort that you can use free of cost, with best-effort support provided by contributors and from the community. |

## Getting started

 Use these links to get started working with Azure Functions in Linux containers:

| I want to... |  See article: |
| --- | --- |
| Create my first containerized functions | [Create a function app in a local Linux container](functions-create-container-registry.md)  |  
| Create and deploy functions to Azure Container Apps | [Create your first containerized functions on Azure Container Apps](functions-deploy-container-apps.md) |
| Create and deploy containerized functions to Azure Functions | [Create your first containerized Azure Functions](functions-deploy-container.md)|
| Create and deploy functions to Azure Arc-enabled Kubernetes | [Create your first containerized Azure Functions on Azure Arc (preview)](create-first-function-arc-custom-container.md) |

## Related articles

+ [Working with containers and Azure Functions](functions-how-to-custom-container.md)


[Azure Container Apps]: functions-container-apps-hosting.md
[Kubernetes]: functions-kubernetes-keda.md
[Azure Functions]: functions-how-to-custom-container.md?pivots=azure-functions#azure-portal-create-using-containers
[Azure Arc-enabled Kubernetes clusters]
