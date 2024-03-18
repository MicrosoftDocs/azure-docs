---
title: Azure Container Apps hosting of Azure Functions 
description: Learn about how you can use Azure Functions on Azure Container Apps to host and manage containerized function apps in Azure.
ms.date: 03/07/2024
ms.topic: conceptual
ms.custom: references_regions, build-2023
# Customer intent: As a cloud developer, I want to learn more about hosting my function apps in Linux containers managed by Azure Container Apps.
---

# Azure Container Apps hosting of Azure Functions 

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs. Container Apps hosting lets you run your functions in a Kubernetes-based environment with built-in support for open-source monitoring, mTLS, Dapr, and KEDA.

[!INCLUDE [functions-container-apps-preview](../../includes/functions-container-apps-preview.md)]

Integration with Container Apps lets you use the existing functions programming model to write function code in your preferred programming language or framework supported by Azure Functions. You still get the Functions triggers and bindings with event-driven scaling. Container Apps uses the power of the underlying Azure Kubernetes Service (AKS) while removing the complexity of having to work with Kubernetes APIs.

This integration also means that you can use existing Functions client tools and the Azure portal to create containers, deploy function app containers to Container Apps, and configure continuous deployment. Network and observability configurations are defined at the Container App environment level and apply to all microservices running in a Container Apps environment, including your function app. You also get the other cloud-native capabilities of Container Apps, including KEDA, Dapr, Envoy. You can still use Application Insights to monitor your functions executions.

## Hosting and workload profiles

There are two primary hosting plans for Container Apps, a serverless [Consumption plan](../container-apps/plans.md#consumption) and a [Dedicated plan](../container-apps/plans.md#dedicated), which uses workload profiles to better control your deployment resources. A workload profile determines the amount of compute and memory resources available to container apps deployed in an environment. These profiles are configured to fit the different needs of your applications. The Consumption workload profile is the default profile added to every Workload profiles environment type. You can add Dedicated workload profiles to your environment as you create an environment or after it's created. To learn more about workload profiles, see [Workload profiles in Azure Container Apps](../container-apps/workload-profiles-overview.md).

Container Apps hosting of containerized function apps is supported in all [regions that support Container Apps](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=container-apps). 

If your app doesn't have a specific hardware requirements, you can run your environment either in a Consumption plan or in a Dedicated plan using the default Consumption workload profile. When running functions on Container Apps, you're charged only for the Container Apps usage. For more information, see the [Azure Container Apps pricing page](https://azure.microsoft.com/pricing/details/container-apps/). 

Azure Functions on Azure Container Apps supports GPU-enabled hosting in the Dedicated plan with workload profiles. 

To learn how to create and deploy a function app container to Container Apps in the default Consumption plan, see [Create your first containerized functions on Azure Container Apps](functions-deploy-container-apps.md). 

To learn how to create a Container Apps environment with workload profiles and deploy a function app container to a specific workload, see [Container Apps workload profiles](functions-how-to-custom-container.md#container-apps-workload-profiles).

## Functions in containers

To use Container Apps hosting, your functions code must run in a Linux container that you create and maintain. Functions maintains a set of [language-specific base images](https://mcr.microsoft.com/catalog?search=functions) that you can use to generate your containerized function apps. 

When you create a Functions project using [Azure Functions Core Tools](./functions-run-local.md) and include the [`--docker` option](./functions-core-tools-reference.md#func-init), Core Tools generates the Dockerfile with the correct base image, which you can use as a starting point when creating your container. 

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

When you make changes to your functions code, you must rebuild and republish your container image. For more information, see [Update an image in the registry](functions-how-to-custom-container.md#update-an-image-in-the-registry).

## Deployment options

Azure Functions currently supports the following methods of deploying a containerized function app to Azure Container Apps:

+ [Azure CLI](./functions-deploy-container-apps.md)
+ Azure portal
+ GitHub Actions
+ Azure Pipeline tasks
+ ARM templates
+ [Bicep templates](https://github.com/Azure/azure-functions-on-container-apps/tree/main/samples/Biceptemplates)
+ [Azure Functions Core Tools](functions-run-local.md#deploy-containers)

## Configure scale rules

Azure Functions on Container Apps is designed to configure the scale parameters and rules as per the event target. You don't need to worry about configuring the KEDA scaled objects. You can still set minimum and maximum replica count when creating or modifying your function app. The following Azure CLI command sets the minimum and maximum replica count when creating a new function app in a Container Apps environment from an Azure Container Registry: 

```azurecli
az functionapp create --name <APP_NAME> --resource-group <MY_RESOURCE_GROUP> --max-replicas 15 --min-replicas 1 --storage-account <STORAGE_NAME> --environment MyContainerappEnvironment --image <LOGIN_SERVER>/azurefunctionsimage:v1 --registry-username <USERNAME> --registry-password <SECURE_PASSWORD> --registry-server <LOGIN_SERVER>
```  

The following command sets the same minimum and maximum replica count on an existing function app:

```azurecli
az functionapp config container set --name <APP_NAME> --resource-group <MY_RESOURCE_GROUP> --max-replicas 15 --min-replicas 1
```

## Managed resource groups

Azure Function on Container Apps run your functionized container resources in specially managed resource groups, which helps protect the consistency of your apps by preventing unintended or unauthorized modification or deletion of resources in the managed group by users, groups, or service principles. This managed resource group is created for you the first time you create function app resources in a Container Apps environment. Container Apps resources required by your containerized function app run in this managed resource group, and any other function apps that are created in the same environment use this existing group. A managed resource group gets removed automatically after all function app container resources are removed from the environment. While the managed resource group is visible, any attempts to modify or remove the managed resource group result in an error. To remove a managed resource group from an environment, remove all of the function app container resources and it gets removed for you. If you run into any issues with these managed resource groups, you should contact support.       

## Considerations for Container Apps hosting

Keep in mind the following considerations when deploying your function app containers to Container Apps:
 
+ While all triggers can be used, only the following triggers can dynamically scale (from zero instances) when running on Container Apps:
    + HTTP 
    + Azure Queue Storage 
    + Azure Service Bus 
    + Azure Event Hubs 
    + Kafka<sup>*</sup>  
    + Timer  
    <sup>*</sup>The protocol value of `ssl` isn't supported when hosted on Container Apps. Use a [different protocol value](functions-bindings-kafka-trigger.md?pivots=programming-language-csharp#attributes).  
+ For the built-in Container Apps [policy definitions](../container-apps/policy-reference.md#policy-definitions), currently only environment-level policies apply to Azure Functions containers.
+ You currently can't move a Container Apps hosted function app deployment between resource groups or between subscriptions. Instead, you would have to recreate the existing containerized app deployment in a new resource group, subscription, or region. 
+ When using Container Apps, you don't have direct access to the lower-level Kubernetes APIs. 
+ The `containerapp` extension conflicts with the `appservice-kube` extension in Azure CLI. If you have previously published apps to Azure Arc, run `az extension list` and make sure that `appservice-kube` isn't installed. If it is, you can remove it by running `az extension remove -n appservice-kube`.  
+ The Functions Dapr extension is also in preview, with help provided [in the repository](https://github.com/Azure/azure-functions-dapr-extension/issues).

## Next steps

+ [Hosting and scale](./functions-scale.md)
