---
title: Linux container support in Azure Functions
description: Describes the options for and benefits of running your function code in Linux containers in Azure.
ms.service: azure-functions
ms.custom: build-2024, linux-related-content
ms.topic: concept-article
ms.date: 10/13/2024

#CustomerIntent: As a developer, I want to understand the options that are available to me for hosting function apps in Linux containers so I can choose the best development and deployment options for containerized deployments of function code to Azure.
---

# Linux container support in Azure Functions

When you plan and develop your individual functions to run in Azure Functions, you're typically focused on the code itself. Azure Functions makes it easy to deploy just your code project to a function app in Azure. When you deploy your code project to a function app that runs on Linux, the project runs in a container that is created for you automatically. This container is managed by Functions.

Functions also supports containerized function app deployments. In a containerized deployment, you create your own function app instance in a local Docker container from a supported based image. You can then deploy this _containerized_ function app to a hosting environment in Azure. Creating your own function app container lets you customize or otherwise control the immediate runtime environment of your function code. 

[!INCLUDE [functions-linux-custom-container-note](../../includes/functions-linux-custom-container-note.md)]

## Container hosting options

There are several options for hosting your containerized function apps in Azure:

| Hosting option | Benefits |
| --- | --- |  
| **[Azure Container Apps]** | Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on [Azure Container Apps](../container-apps/overview.md). This enables you to manage your apps using the same Functions tools and pages in the Azure portal. Use Azure Container Apps to host your function app containers when you need to run your event-driven functions in Azure in the same environment as other microservices, APIs, websites, workflows, or any container hosted programs. Container Apps hosting lets you run your functions in a managed Kubernetes-based environment with built-in support for open-source monitoring, mTLS, Dapr, and KEDA. Supports scale-to-zero and provides a serverless pay-for-what-you-use hosting model. You can also request dedicated hardware, even GPUs, by using workload profiles. _Recommended hosting option for running containerized function apps on Azure._ | 
| **Azure Arc-enabled Kubernetes clusters (preview)** | You can host your function apps on Azure Arc-enabled Kubernetes clusters as either a code-only deployment or in a custom Linux container. Azure Arc lets you attach Kubernetes clusters so that you can manage and configure them in Azure. _Hosting Azure Functions containers on Azure Arc-enabled Kubernetes clusters is currently in preview._  For more information, see [Working with containers and Azure Functions](functions-how-to-custom-container.md?pivots=azure-arc).|
| **[Azure Functions]** | You can host your containerized function apps in Azure Functions by running the container in either an [Elastic Premium plan](./functions-premium-plan.md) or a [Dedicated plan](./dedicated-plan.md). Premium plan hosting provides you with the benefits of dynamic scaling. You might want to use Dedicated plan hosting to take advantage of existing unused App Service plan resources. |  
| **[Kubernetes]** | Because the Azure Functions runtime provides flexibility in hosting where and how you want, you can host and manage your function app containers directly in Kubernetes clusters. [KEDA](https://keda.sh) (Kubernetes-based Event Driven Autoscaling) pairs seamlessly with the Azure Functions runtime and tooling to provide event driven scale in Kubernetes. Just keep in mind that running your containerized function apps on Kubernetes, either by using KEDA or by direct deployment, is an open-source effort that you can use free of cost, with best-effort support provided by contributors and from the community. You're responsible for maintaining your own function app containers in a cluster, even when deploying to Azure Kubernetes Service (AKS). |

## Feature support comparison

The degree to which various features and behaviors of Azure Functions are supported when running your function app in a container depends on the container hosting option you choose.

| Feature/behavior | [Container Apps (integrated)][Azure Container Apps] | [Container Apps (direct)](../container-apps/overview.md) | [Premium plan](./functions-premium-plan.md) | [Dedicated plan](./dedicated-plan.md) | [Kubernetes] |
| ------ | ------ | ------ |------|-------| ------|
| Product support | Yes | No | Yes |Yes | No  |
| Functions portal integration | Yes | No | Yes | Yes | No |
| [Event-driven scaling](./event-driven-scaling.md) | Yes<sup>5</sup> | Yes ([scale rules](../container-apps/scale-app.md#scale-rules)) | Yes | No | No |
| Maximum scale (instances) | 1000<sup>1</sup> | 1000<sup>1</sup> | 100<sup>2</sup> | 10-30<sup>3</sup> | Varies by cluster |
| [Scale-to-zero instances](./event-driven-scaling.md#scale-in-behaviors) | Yes | Yes | No | No | KEDA |
| Execution time limit | Unbounded<sup>6</sup>| Unbounded<sup>6</sup> | Unbounded<sup>7</sup> | Unbounded<sup>8</sup> | None |
| [Core Tools deployment](./functions-run-local.md#deploy-containers) | [`func azurecontainerapps`](./functions-core-tools-reference.md#func-azurecontainerapps-deploy) | No | No | No | [`func kubernetes`](./functions-core-tools-reference.md#func-kubernetes-deploy) |
| [Revisions](../container-apps/revisions.md) | No | Yes |No |No |No |
| [Deployment slots](./functions-deployment-slots.md) |No |No |Yes |Yes |No |
| [Streaming logs](./streaming-logs.md) | Yes | [Yes](../container-apps/log-streaming.md) | Yes | Yes | No |
| [Console access](../container-apps/container-console.md) | Not currently available<sup>4</sup> | Yes | Yes (using [Kudu](./functions-how-to-custom-container.md#enable-ssh-connections)) | Yes (using [Kudu](./functions-how-to-custom-container.md#enable-ssh-connections)) | Yes (in pods [using `kubectl`](https://kubernetes.io/docs/reference/kubectl/)) |
| Cold start mitigation | Minimum replicas | [Scale rules](../container-apps/scale-app.md#scale-rules) | [Always-ready/pre-warmed instances](functions-premium-plan.md#eliminate-cold-starts) | n/a | n/a |
| [App Service authentication](../app-service/overview-authentication-authorization.md) | Not currently available<sup>4</sup> | Yes | Yes | Yes | No |
| [Custom domain names](../app-service/app-service-web-tutorial-custom-domain.md) | Not currently available<sup>4</sup> | Yes | Yes | Yes | No |
| [Private key certificates](../app-service/overview-tls.md) | Not currently available<sup>4</sup> | Yes | Yes | Yes | No |
| Virtual networks | Yes | Yes | Yes | Yes | Yes |
| Availability zones | Yes | Yes | Yes | Yes | Yes |
| Diagnostics | Not currently available<sup>4</sup> | [Yes](../container-apps/troubleshooting.md#use-the-diagnose-and-solve-problems-tool) | [Yes](./functions-diagnostics.md) | [Yes](./functions-diagnostics.md) | No |
| Dedicated hardware | Yes ([workload profiles](../container-apps/workload-profiles-overview.md)) | Yes ([workload profiles](../container-apps/workload-profiles-overview.md)) | No | Yes | Yes | 
| Dedicated GPUs | Yes ([workload profiles](../container-apps/workload-profiles-overview.md)) | Yes ([workload profiles](../container-apps/workload-profiles-overview.md)) | No | No | Yes | 
| [Configurable memory/CPU count](../container-apps/workload-profiles-overview.md) | Yes | Yes | No | No | Yes |
| "Free grant" option | [Yes](../container-apps/billing.md#consumption-plan) | [Yes](../container-apps/billing.md#consumption-plan) | No | No | No |
| Pricing details | [Container Apps billing](../container-apps/billing.md) | [Container Apps billing](../container-apps/billing.md) | [Premium plan billing](./functions-premium-plan.md#billing) | [Dedicated plan billing](./dedicated-plan.md#billing) | [AKS pricing](/azure/aks/free-standard-pricing-tiers) | 
| Service name requirements | 2-32 characters: limited to lowercase letters, numbers, and hyphens. Must start with a letter and end with an alphanumeric character. | 2-32 characters: limited to lowercase letters, numbers, and hyphens. Must start with a letter and end with an alphanumeric character. | Less than 64 characters: limited to alphanumeric characters and hyphens. Can't start with or end in a hyphen. | Less than 64 characters: limited to alphanumeric characters and hyphens. Can't start with or end in a hyphen. | Less than 253 characters: limited to alphanumeric characters and hyphens. Must start and end with an alphanumeric character. |

1. On Container Apps, the default is 10 instances, but you can set the [maximum number of replicas](../container-apps/scale-app.md#scale-definition), which has an overall maximum of 1000. This setting is honored as long as there's enough cores quota available. When you create your function app from the Azure portal, you're limited to 300 instances.
2. In some regions, Linux apps on a Premium plan can scale to 100 instances. For more information, see the [Premium plan article](functions-premium-plan.md#region-max-scale-out). <br/>
3. For specific limits for the various App Service plan options, see the [App Service plan limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits).
4. Feature parity is a goal of integrated hosting on Azure Container Apps.
5. Requires [KEDA](./functions-kubernetes-keda.md); supported by most triggers. To learn which triggers support event-driven scaling, see [Considerations for Container Apps hosting](functions-container-apps-hosting.md#considerations-for-container-apps-hosting).  
6. When the [minimum number of replicas](../container-apps/scale-app.md#scale-definition) is set to zero, the default timeout depends on the specific triggers used in the app.
7. There's no maximum execution timeout duration enforced. However, the grace period given to a function execution is 60 minutes [during scale in](event-driven-scaling.md#scale-in-behaviors), and a grace period of 10 minutes is given during platform updates.
8. Requires the App Service plan be set to [Always On](dedicated-plan.md#always-on). A grace period of 10 minutes is given during platform updates.

## Getting started

 Use these links to get started working with Azure Functions in Linux containers:

| I want to... |  See article: |
| --- | --- |
| Create my first containerized functions | [Create a function app in a local Linux container](functions-create-container-registry.md)  |  
| Create and deploy functions to Azure Container Apps | [Create your first containerized functions on Azure Container Apps](functions-deploy-container-apps.md) |
| Create and deploy containerized functions to Azure Functions | [Create your first containerized Azure Functions](functions-deploy-container.md)|

## Related articles

+ [Working with containers and Azure Functions](functions-how-to-custom-container.md)


[Azure Container Apps]: functions-container-apps-hosting.md
[Kubernetes]: functions-kubernetes-keda.md
[Azure Functions]: functions-how-to-custom-container.md?pivots=azure-functions#azure-portal-create-using-containers
