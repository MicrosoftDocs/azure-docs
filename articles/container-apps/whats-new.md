---
title: What's new in Azure Container Apps
titleSuffix: Azure Container Apps
description: Learn more about what's new in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: conceptual
ms.date: 08/30/2023
# Customer Intent: As an Azure Container Apps user, I'd like to know about new and improved features in Azure Container Apps. 
---

# What's new in Azure Container Apps

This article lists significant updates and new features available in Azure Container Apps.

### November 2023 

| Feature | Description |
| ------- | ------------ |
| [GA: Landing zone accelerators](https://aka.ms/aca-lza) | Landing zone accelerators provide architectural guidance, reference architecture, reference implementations and automation packaged to deploy workload platforms on Azure at scale. |
| [Public Preview: Dedicated GPU workload profiles](https://aka.ms/container-apps/gpu) | Azure Container Apps support GPU compute in their dedicated workload profiles to unlock machine learning computing for event driven workloads. |
| [Public preview: Vector database add-ons](https://aka.ms/aca/addons-vector-dbs) | Azure Container Apps now provides add-ons for three of the most popular open source vector database variants, namely Qdrant, Milvus and Weaviate, to enable you to get started quickly and try out innovative use cases before going into production. |
| [Public preview: Policy-driven resiliency](https://aka.ms/aca-resiliency) | The new resiliency feature enables you to seamlessly recover from service-to-service request and outbound dependency failures just by adding simple policies.  |
| [Public preview: Code to cloud](https://aka.ms/aca/cloud-build) | With this feature, Azure Container Apps automatically builds and package the application code for deployment. |

### September 2023 

| Feature | Description |
| ------- | ------------ |
| [GA: Azure Container Apps in China Cloud](https://azure.microsoft.com/updates/ga-azure-container-apps-in-azure-china-cloud/) | Azure Container Apps is now available in China North 3. |
| [ACA eligible for savings plans](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-container-apps-eligible-for-azure-savings-plan-for-compute/ba-p/3941243) | Azure Container Apps is eligible for Azure savings plan for compute. |

### August 2023   

| Feature | Description |
| ------- | ----------- |
| [GA: Dedicated plan](https://learn.microsoft.com/azure/container-apps/plans#dedicated) | Azure Container Apps dedicated plan is now GA in the new workload profiles environment type. When using dedicated workload profiles you are billed per compute instance, compared to consumption where you are billed per app. |
| [GA: UDR, NAT Gateway, and smaller subnets](https://learn.microsoft.com/azure/container-apps/networking?tabs=azure-cli#environment-selection) | These improved networking features for controlling egress are available with workload profiles environments. |
| [GA: Azure Container Apps jobs](https://learn.microsoft.com/azure/container-apps/jobs?tabs=azure-cli) | In addition to continuously running services that can scale to zero, Azure Container Apps now supports jobs. Jobs enable you to run serverless containers that perform tasks that run to completion. |
| [GA: Cross Origin Resource Sharing (CORS)](https://learn.microsoft.com/azure/container-apps/cors?tabs=arm&pivots=azure-cli) | The CORS feature allows specific origins to make calls on their app through the browser. Azure Container Apps customers can now easily set up Cross Origin Resource Sharing from the portal or through the CLI. |
| [GA: Init containers](https://learn.microsoft.com/azure/container-apps/containers#init-containers) |  Init containers are specialized containers that run to completion before application containers are started in a replica, and they can contain utilities or setup scripts not present in your container app image. |
| [GA: Secrets volume mounts](https://learn.microsoft.com/azure/container-apps/manage-secrets?tabs=azure-portal) |  In addition to referencing secrets as environment variables, you can now mount secrets as volumes in your container apps. Your apps can access all or selected secrets as files in a mounted volume. |
| [GA: Session affinity](https://learn.microsoft.com/azure/container-apps/sticky-sessions) | Session affinity enables you to route all requests from a single client to the same Container Apps replica. This is useful for stateful workloads that require session affinity. |
| [GA: Azure Key Vault references for secrets](https://azure.microsoft.com/updates/generally-available-azure-key-vault-references-for-secrets-in-azure-container-apps/) | Azure Key Vault references enable you to source a container app’s secrets from secrets stored in Azure Key Vault. Using the container app's managed identity, the platform automatically retrieves the secret values from Azure Key Vault and injects it into your application's secrets. |
| [Public preview: additional TCP ports](https://learn.microsoft.com/azure/container-apps/ingress-overview#additional-tcp-ports) | Azure Container Apps now support additional TCP ports, enabling applications to accept TCP connections on multiple ports. This feature is in preview. |
| [Public preview: environment level mTLS encryption](https://learn.microsoft.com/azure/container-apps/networking?tabs=azure-cli#mtls) | When end-to-end encryption is required, mTLS will encrypt data transmitted between applications within an environment. |
| [Retirement: ACA preview API versions 2022-06-01-preview and 2022-11-01-preview](https://azure.microsoft.com/en-us/updates/retirement-azure-container-apps-preview-api-versions-20220601preview-and-20221101preview/) | Starting on November 16, 2023, Azure Container Apps control plane API versions 2022-06-01-preview and 2022-11-01-preview will be retired. Before that date, please migrate to the latest stable API version (2023-05-01) or latest preview API version (2023-04-01-preview). |
| [Dapr: Stable Configuration API](https://docs.dapr.io/developing-applications/building-blocks/configuration/) | Dapr's Configuration API is now stable and supported in Azure Container Apps. Learn how to do [Dapr integration with Azure Container Apps](./dapr-overview.md)|

### June 2023

| Feature | Description |
| ------- | ----------- |
| [GA: Running status](https://learn.microsoft.com/azure/container-apps/revisions#running-status) | The running status helps monitor a container app's health and functionality. |
| [Public Preview: Azure Functions for cloud-native microservices](https://github.com/Azure/azure-functions-on-container-apps) | Azure Function’s host, runtime, extensions and Azure Function apps can be deployed as containers using AzCLI/Portal/code-to-cloud DevOps tooling into the same compute environment, so you can leverage centralized networking, observability, and configuration boundary for multitype application development like microservices. |
| [Public Preview: Azure Spring Apps on Azure Container Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-container-apps-service-management-just-got-easier-preview/ba-p/3827305) | Azure Spring apps can be deployed as containers to your Azure Container Apps within the same compute environment, so you can leverage centralized networking, observability, and configuration boundary for multitype application development like microservices. | 
| [Public Preview: Azure Container Apps add-ons](https://learn.microsoft.com/azure/container-apps/services) | As you develop applications in Azure Container Apps, you often need to connect to different services. Rather than creating services ahead of time and manually connecting them to your container app, you can quickly create instances of development-grade services that are designed for nonproduction environments known as "add-ons". |
| [Public Preview: Free and managed TLS certificates](https://learn.microsoft.com/azure/container-apps/custom-domains-managed-certificates?pivots=azure-cli) | Managed certificates are free and enable you to automatically provision and renew TLS certificates for any custom domain you add to your container app. |
| [Dapr: Multi-app Run improved](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run) |  | Use `dapr run -f .` to run multiple Dapr apps and see the app logs written to the console _and_ a local log file. Learn how to use [multi-app Run logs](https://docs.dapr.io/developing-applications/local-development/multi-app-dapr-run/multi-app-overview/#logs). |

### May 2023

| Feature | Description |
| ------- | ----------- |
| [GA: Inbound IP restrictions](https://learn.microsoft.com/azure/container-apps/ingress-overview#ip-access-restrictions) | This feature enables container apps to restrict inbound HTTP or TCP traffic by allowing or denying access to a specific list of IP address ranges. | 
| [GA: TCP support](https://learn.microsoft.com/azure/container-apps/ingress-overview#tcp) | Azure Container Apps now supports using TCP-based protocols other than HTTP or HTTPS for ingress. | 
| [GA: Github Actions for Azure Container Apps](https://learn.microsoft.com/azure/container-apps/github-actions) | Azure Container Apps allows you to use GitHub Actions to publish revisions to your container app. |
| [GA: Azure Pipelines for Azure Container Apps](https://learn.microsoft.com/azure/container-apps/azure-pipelines) | Azure Container Apps allows you to use Azure Pipelines to publish revisions to your container app. |
| [Dapr: Easy component creation](./dapr-component-connection.md) | This feature makes it easier to configure and secure dependent Azure services to be used with Dapr APIs in the portal using the Service Connector feature. Learn how to [connect to Azure services via Dapr components in the Azure portal](./dapr-component-connection.md). |


## Next steps

[Learn more about Dapr in Azure Container Apps.](./dapr-overview.md)