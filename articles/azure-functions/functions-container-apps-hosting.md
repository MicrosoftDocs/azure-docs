---
title: Azure Container Apps hosting of Azure Functions 
description: Learn about how you can use Azure Functions on Azure Container Apps to host and manage containerized function apps in Azure.
ms.date: 05/07/2024
ms.topic: conceptual
ms.custom: build-2024
# Customer intent: As a cloud developer, I want to learn more about hosting my function apps in Linux containers managed by Azure Container Apps.
---

# Azure Container Apps hosting of Azure Functions 

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs. Container Apps hosting lets you run your functions in a fully managed, Kubernetes-based environment with built-in support for open-source monitoring, mTLS, Dapr, and KEDA.

You can write your function code in any [language stack supported by Functions](supported-languages.md). You can use the same Functions triggers and bindings with event-driven scaling. You can also use existing Functions client tools and the Azure portal to create containers, deploy function app containers to Container Apps, and configure continuous deployment. 

Container Apps integration also means that network and observability configurations, which are defined at the Container App environment level, apply to your function app as they do to all microservices running in a Container Apps environment. You also get the other cloud-native capabilities of Container Apps, including KEDA, Dapr, Envoy. You can still use Application Insights to monitor your functions executions, and your function app can access the same virtual networking resources provided by the environment.

For a general overview of container hosting options for Azure Functions, see [Linux container support in Azure Functions](container-concepts.md).

## Hosting and workload profiles

There are two primary hosting plans for Container Apps, a serverless [Consumption plan](../container-apps/plans.md#consumption) and a [Dedicated plan](../container-apps/plans.md#dedicated), which uses workload profiles to better control your deployment resources. A workload profile determines the amount of compute and memory resources available to container apps deployed in an environment. These profiles are configured to fit the different needs of your applications. 

The Consumption workload profile is the default profile added to every Workload profiles environment type. You can add Dedicated workload profiles to your environment as you create an environment or after it's created. To learn more about workload profiles, see [Workload profiles in Azure Container Apps](../container-apps/workload-profiles-overview.md).

Container Apps hosting of containerized function apps is supported in all [regions that support Container Apps](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=container-apps). 

If your app doesn't have specific hardware requirements, you can run your environment either in a Consumption plan or in a Dedicated plan using the default Consumption workload profile. When running functions on Container Apps, you're charged only for the Container Apps usage. For more information, see the [Azure Container Apps pricing page](https://azure.microsoft.com/pricing/details/container-apps/). 

Azure Functions on Azure Container Apps supports GPU-enabled hosting in the Dedicated plan with workload profiles. 

To learn how to create and deploy a function app container to Container Apps in the default Consumption plan, see [Create your first containerized functions on Azure Container Apps](functions-deploy-container-apps.md). 

To learn how to create a Container Apps environment with workload profiles and deploy a function app container to a specific workload, see [Container Apps workload profiles](functions-how-to-custom-container.md#container-apps-workload-profiles).

## Functions in containers

To use Container Apps hosting, your code must run on a function app in a Linux container that you create and maintain. Functions maintains a set of [language-specific base images](https://mcr.microsoft.com/catalog?search=functions) that you can use to generate your containerized function apps. 

When you create a code project using [Azure Functions Core Tools](./functions-run-local.md) and include the [`--docker` option](./functions-core-tools-reference.md#func-init), Core Tools generates the Dockerfile with the correct base image, which you can use as a starting point when creating your container. 

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


## Virtual network integration

When you host your function apps in a Container Apps environment, your functions are able to take advantage of both internally and externally accessible virtual networks. To learn more about environment networks, see [Networking in Azure Container Apps environment](../container-apps/networking.md).  

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

Azure Functions on Container Apps runs your containerized function app resources in specially managed resource groups. These managed resource groups help protect the consistency of your apps by preventing unintended or unauthorized modification or deletion of resources in the managed group, even by service principles. 

A managed resource group is created for you the first time you create function app resources in a Container Apps environment. Container Apps resources required by your containerized function app run in this managed resource group. Any other function apps that you create in the same environment use this existing group. 

A managed resource group gets removed automatically after all function app container resources are removed from the environment. While the managed resource group is visible, any attempts to modify or remove the managed resource group result in an error. To remove a managed resource group from an environment, remove all of the function app container resources and it gets removed for you. 

If you run into any issues with these managed resource groups, you should contact support.       

## Considerations for Container Apps hosting

Keep in mind the following considerations when deploying your function app containers to Container Apps:
 
+ While all triggers can be used, only the following triggers can dynamically scale (from zero instances) when running in a Container Apps environment:
    + HTTP 
    + Azure Queue Storage 
    + Azure Service Bus 
    + Azure Event Hubs 
    + Kafka  
    + Timer  
+ These limitations apply to Kafka triggers:
    + The protocol value of `ssl` isn't supported when hosted on Container Apps. Use a [different protocol value](functions-bindings-kafka-trigger.md?pivots=programming-language-csharp#attributes). 
    + For a Kafka trigger to dynamically scale when connected to Event Hubs, the `username` property must resolve to an application setting that contains the actual username value. When the default `$ConnectionString` value is used, the Kafka trigger won't be able to cause the app to scale dynamically.  
+ For the built-in Container Apps [policy definitions](../container-apps/policy-reference.md#policy-definitions), currently only environment-level policies apply to Azure Functions containers.
+ You can use managed identities both for [trigger and binding connections](functions-reference.md#configure-an-identity-based-connection) and for [deployments from an Azure Container Registry](https://azure.github.io/AppService/2021/07/03/Linux-container-from-ACR-with-private-endpoint.html#using-user-assigned-managed-identity). 
+ When either your function app and Azure Container Registry-based deployment use managed identity-based connections, you can't modify the CPU and memory allocation settings in the portal. You must instead [use the Azure CLI](functions-how-to-custom-container.md?tabs=acr%2Cazure-cli2%2Cazure-cli&pivots=container-apps#container-apps-workload-profiles).
+ You currently can't move a Container Apps hosted function app deployment between resource groups or between subscriptions. Instead, you would have to recreate the existing containerized app deployment in a new resource group, subscription, or region. 
+ When using Container Apps, you don't have direct access to the lower-level Kubernetes APIs. 
+ The `containerapp` extension conflicts with the `appservice-kube` extension in Azure CLI. If you have previously published apps to Azure Arc, run `az extension list` and make sure that `appservice-kube` isn't installed. If it is, you can remove it by running `az extension remove -n appservice-kube`.  

## Next steps

+ [Hosting and scale](./functions-scale.md)
