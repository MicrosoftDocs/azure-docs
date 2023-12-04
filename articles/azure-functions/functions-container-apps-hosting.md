---
title: Azure Container Apps hosting of Azure Functions 
description: Learn about how you can use Azure Container Apps to host containerized function apps in Azure Functions.
ms.date: 11/15/2023
ms.topic: conceptual
ms.custom: references_regions, build-2023
# Customer intent: As a cloud developer, I want to learn more about hosting my function apps in Linux containers by using Azure Container Apps.
---

# Azure Container Apps hosting of Azure Functions 

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows or any container hosted programs. Container Apps hosting lets you run your functions in a Kubernetes-based environment with built-in support for open-source monitoring, mTLS, Dapr, and KEDA

[!INCLUDE [functions-container-apps-preview](../../includes/functions-container-apps-preview.md)]

Integration with Container Apps lets you use the existing functions programming model to write function code in your preferred programming language or framework supported by Azure Functions. You still get the Functions triggers and bindings with event-driven scaling. Container Apps uses the power of the underlying Azure Kubernetes Service (AKS) while removing the complexity of having to work with Kubernetes APIs.

This integration also means that you can use existing Functions client tools and the portal to create containers, deploy function app containers to Container Apps, and configure continuous deployment. Network and observability configurations are defined at the Container App environment level and apply to all microservices running in a Container Apps environment, including your function app. You also get the other cloud-native capabilities of Container Apps, including KEDA, Dapr, Envoy. You can still use Application Insights to monitor your functions executions.

## Deploying Azure Functions to Container Apps

In the current preview, you must deploy your functions code in a Linux container that you create. Functions maintains a set of [lanuage-specific base images](https://mcr.microsoft.com/catalog?search=functions) that you can use to generate your containerized function apps. When you create a Functions project using [Azure Functions Core Tools](./functions-run-local.md) and include the [`--docker` option](./functions-core-tools-reference.md#func-init), Core Tools also generates a Dockerfile that you can use to create your container from the correct base image. 

Azure Functions currently supports the following methods of deployment to Azure Container Apps:

+ [Azure CLI](./functions-deploy-container-apps.md)
+ Azure portal
+ GitHub Actions
+ Azure Pipeline tasks
+ ARM templates
+ [Bicep templates](https://github.com/Azure/azure-functions-on-container-apps/tree/main/samples/Biceptemplates)
+ [Azure Functions Core Tools](functions-run-local.md#deploy-containers)

To learn how to create and deploy a function app container to Container Apps using the Azure CLI, see [Create your first containerized functions on Azure Container Apps](functions-deploy-container-apps.md). 

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

When you make changes to your functions code, you must rebuild and republish your container image. For more information, see [Update an image in the registry](functions-how-to-custom-container.md#update-an-image-in-the-registry).

## Configure scale rules

Azure Functions on Container Apps is designed to configure the scale parameters and rules as per the event target. You don't need to worry about configuring the KEDA scaled objects. You can still set minimum and maximum replica count when creating or modifying your function app. The following Azure CLI command sets the minimum and maximum replica count when creating a new function app in a Container Apps environment from an Azure Container Registry: 

```azurecli
az functionapp create --name <APP_NAME> --resource-group <MY_RESOURCE_GROUP> --max-replicas 15 --min-replicas 1 --storage-account <STORAGE_NAME> --environment MyContainerappEnvironment --image <LOGIN_SERVER>/azurefunctionsimage:v1 --registry-username <USERNAME> --registry-password <SECURE_PASSWORD>
```  

The following command sets the same minimum and maximum replica count on an existing function app:

```azurecli
az functionapp config container set --name <APP_NAME> --resource-group <MY_RESOURCE_GROUP> --max-replicas 15 --min-replicas 1
```  

## Considerations for Container Apps hosting

Keep in mind the following considerations when deploying your function app containers to Container Apps:
 
+ Container Apps support for Functions is currently in preview and is only available in the following regions:
    + Australia East
    + Central US 
    + East US 
    + East US 2 
    + North Europe 
    + South Central US 
    + UK South 
    + West Europe 
    + West US 3 
+ When your container is hosted in a [Consumption + Dedicated plan structure](../container-apps/plans.md#consumption-dedicated), only the default Consumption plan is currently supported. Dedicated plans in this structure aren't yet supported for Functions. When running functions on Container Apps, you're charged only for the Container Apps usage. For more information, see the [Azure Container Apps pricing page](https://azure.microsoft.com/pricing/details/container-apps/). 
+ While all triggers can be used, only the following triggers can dynamically scale (from zero instances) when running on Container Apps:
    + HTTP 
    + Azure Queue Storage 
    + Azure Service Bus 
    + Azure Event Hubs 
    + Kafka*  
    \*The protocol value of `ssl` isn't supported when hosted on Container Apps. Use a [different protocol value](functions-bindings-kafka-trigger.md?pivots=programming-language-csharp#attributes).  
+ For the built-in Container Apps [policy definitions](../container-apps/policy-reference.md#policy-definitions), currently only environment-level policies apply to Azure Functions containers.
+ When using Container Apps, you don't have direct access to the lower-level Kubernetes APIs. 
+ The `containerapp` extension conflicts with the `appservice-kube` extension in Azure CLI. If you have previously published apps to Azure Arc, run `az extension list` and make sure that `appservice-kube` isn't installed. If it is, you can remove it by running `az extension remove -n appservice-kube`.  
+ The Functions Dapr extension is also in preview, with help provided [in the repository](https://github.com/Azure/azure-functions-dapr-extension/issues).

## Next steps

+ [Hosting and scale](./functions-scale.md)
