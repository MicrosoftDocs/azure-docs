---
title: Azure Functions hosting using containers
description: Learn how to better understand the options for deploying containerized function apps in Azure.
ms.date: 05/04/2023
ms.topic: conceptual
# Customer intent: As a cloud developer, I want to understand what options are available for developing, deploying, and running my functions code in Linux containers.
---

# Azure Functions container hosting

Azure Functions lets you run your functions in Linux containers. This means that Azure Functions can run in any hosting environments that support containers. Event-driven scaling and other Azure Functions behaviors depend on the specific container hosting environment.

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

## Container hosting options

When your function app is running in a container, there are various hosting environments you can choose for your containerized functions, which include the following:

+ **Azure Container Apps** (preview): Azure Container Apps hosting provides a good option when your function app needs to run in a managed environment with other microservices, APIs, websites, workflows or any container hosted programs. Azure Functions support for Container Apps is currently in preview. To learn more, see [Azure Container Apps hosting](#azure-container-apps-hosting).

+ **Azure Functions**: Azure Functions runs natively on Azure App Service by leveraging the container support in App Service. While it offers the regular benefits of Functions [Premium plan](./functions-premium-plan.md) and [Dedicated plan](./dedicated-plan.md) hosting, you won't obtain many of the other benefits of container deployments. To learn how to deploy a custom container to Functions, see [Deploy a custom container to Azure Functions](./functions-deploy-custom-container.md).

+ **Azure Arc** (preview): Azure Arc 

+ **Kubernetes**:  

Regardless of the container host you choose, you create your deployable function app container in the same way.

## Create functions in a custom container

Azure Functions maintains a set of [lanuage-specific base images](https://mcr.microsoft.com/en-us/catalog?search=functions) that you can use to generate your containerized function apps. When you create a Functions project using [Azure Functions Core Tools](./functions-run-local.md) and include the [`--docker` option](./functions-core-tools-reference.md#func-init), Core Tools also generates a .Dockerfile that is used to create your container from the correct base image. To learn more, see [Quickstart: Create a function that runs in a custom container](./functions-create-function-linux-custom-image.md). 

## Azure Container Apps hosting

Azure Functions provides integrated suppport for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). Integration with Container Apps lets you leverage the existing functions programming model to write function code in your preferred programming language or framework supported by Azure Functions. You still get the Functions triggers and bindings, as well as event-driven scaling. Container Apps leverages the power of the underlying Azure Kubernetes Service (AKS) while removing the complexity of having to work with Kubernetes APIs.

This integration also means that you can leverage existing Functions client tools and the portal to create containers, deploy function app containers to Container Apps, and configure continuous deployment. Network and observability configurations are defined at the Container App environment level and apply to all microservices running in a Container Apps environment, including your function app. You also get the other cloud-native capabilities of Container Apps, including KEDA, Dapr, Envoy. You can still use Application Insights to monitor your functions executions.

To learn how to deploy a function app to Container Apps, [Deploy a custom container to Azure Container Apps](./functions-deploy-custom-container-aca.md). This article requires you to first [create a containerized function app](./functions-create-function-linux-custom-image.md).

### Considerations for Container Apps hosting

Keep in mind the following considerations when deploying your function app containers to Container Apps:
 
+ Container Apps support for Functions is currently in preview and is only available in the following regions:
    + Australia East
    + Central US 
    + East US 
    + East Us 2 
    + North Europe 
    + South Central US 
    + UK South 
    + West Europe 
    + West US3 
+ When running in a [Consumption + Dedicated plan structure](../container-apps/plans.md#consumption-dedicated), only the default Consumption plan is currently supported. Dedicated plans in this structure aren't yet supported for Functions.
+ While all triggers can be used, only the following triggers can scale as expected when running on Container Apps:
    + HTTP 
    + Azure Queue Storage 
    + Azure Service Bus 
    + Azure Event Hubs 
    + Kafka (without certificates)  
    Other 
+ For the built-in Container Apps [policy definitions](../container-apps/policy-reference.md#policy-definitions), currently only environment-level policies apply to Azure Functions containers.
+ When using Container Apps, you don't have direct access to the lower-level Kubernetes APIs. However, you can access the AKS instance directly.

## Next steps

+ [Hosting and scale](./functions-scale.md)