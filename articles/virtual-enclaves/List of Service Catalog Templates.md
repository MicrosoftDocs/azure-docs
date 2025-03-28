---
title: List of Service Catalog templates
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# List of Service Catalog Templates
This is the list of Azure services and workload templates in the Service Catalog.

## Table of Azure Service templates

| Template Name | Link | Status |
|--|--|--|
| Storage Account | [link](#storage-account) | Available |
| App Service: Web App | [link](#app-service-web-app) | Available |
| App Service: Functions | [link](#app-service-functions) | Available |
| Azure SQL | [link](#azure-sql) | Available |
| Azure Kubernetes Service (AKS) | [link](#azure-kubernetes-service-(AKS)) | Available |
| Azure Container Registry (ACR) | [link](#azure-container-registry-(ACR)) | Available |
| Azure Cosmos DB | [link](#azure-cosmos-db) | Available |
| Service Bus | [link](#service-bus) | Available |
| Azure Compute Gallery | [link](#azure-compute-gallery) | Future |
| PostgreSQL | [link](#postgresql) | Future |

## Table of Customer Workload templates

| Template Name | Link | Status|
|--|--|--|
| RemoteApp | [link](#remote-app) | Available |
| Remote Desktop | [link](#Remote-Desktop) | Future |
| DNS Forwarder |  | Future |
| Identity |  | Future |
| Admin VM |  | Future |
| Winget REST Source |  | Future |
| Linux VM |  | Future |

Additional templates will be added over time

## Remote App

[How to create a Remote App VM](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20RemoteApp%20VM%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description:
This template and deploy a virtual machine that is domain joined and optionally published as a [RemoteApp](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp?tabs=portal) by joining and deploying a host pool, app location group, and workspace. The default application published as a remote app is the edge browser.

Documentation:
[Remote App Streaming Overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/remote-app-streaming/overview)
[How-to deploy a Streaming App (RemoteApp)](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20RemoteApp%20VM%20from%20the%20Service%20Catalog%20into%20a%20Workload)

## Remote Desktop
Description:
Similar to a RemoteApp but the whole desktop is streamed to the user rather than a single application.

Status: **Future Development**

## Storage Account
[How to create an AVE compliant Storage Account](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20a%20Storage%20Account%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: This template deploys an azure storage account available from the virtual network inside the azure virtual enclave. The template deploys the storage account with customer managed keys and other policies required to operate inside an azure virtual enclave. [learn more](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)


## App Service Web App
[How to create an AVE compliant App Service Web App](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20an%20App%20Service%20Web%20App%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Web Apps provides a fully managed platform for building and hosting web applications using popular programming languages such as.NET, Java, Node.js, Python, and PHP. [learn more](https://learn.microsoft.com/en-us/azure/app-service/overview)

## App Service Functions
[How to create an AVE compliant App Service Function](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20a%20App%20Service%20Function%20App%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running. [learn more](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)


## Azure SQL
[How to create an AVE compliant Azure SQL](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20Azure%20SQL%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure SQL Database, a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement. [learn more](https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview)


## Azure Kubernetes Service (AKS)
[How to create an AVE compliant AKS](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20Azure%20Kubernetes%20Service%20(AKS)%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Kubernetes Service (AKS) is a managed Kubernetes service that you can use to deploy and manage containerized applications. You need minimal container orchestration expertise to use AKS. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. [learn more](https://learn.microsoft.com/en-us/azure/aks/what-is-aks)


## Azure Container Registry (ACR)
[How to create an AVE compliant ACR](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20Azure%20Container%20Registry%20(ACR)%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Container Registry allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. Use Azure container registries with your existing container development and deployment pipelines. Use Azure Container Registry Tasks to build container images in Azure on-demand, or automate builds triggered by source code updates, updates to a container's base image, or timers. [learn more](https://learn.microsoft.com/en-us/azure/container-registry/)


## PostgreSQL

Description: Azure Database for PostgreSQL flexible server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. The service generally provides more flexibility and server configuration customizations based on user requirements. [learn more](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/overview)

Status: **Future development**


## Azure Cosmos DB
[How to create an AVE compliant Cosmos DB](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20Azure%20Cosmos%20DB%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Cosmos DB simplifies and expedites your application development by being the single database for your operational data needs, from geo-replicated distributed caching to backup to vector indexing and search. It provides the data infrastructure for modern applications like AI agent, digital commerce, Internet of Things, and booking management. It can accommodate all your operational data models, including relational, document, vector, key-value, graph, and table. [learn more](https://learn.microsoft.com/en-us/azure/cosmos-db/introduction)


## Service Bus
[How to create an AVE compliant Service Bus](/docs/How%20To%20Guides/Service%20Catalog/Deploy%20Service%20Bus%20from%20the%20Service%20Catalog%20into%20a%20Workload)

Description: Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other. [learn more](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)


## Azure Compute Gallery

Description: An Azure Compute Gallery helps you build structure and organization around your Azure resources, like images and applications. [learn more](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)

Status: **Future Development**

Documentation:
[Azure Compute Gallery Overview](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)

# Request new service
Submit a feature request using [here](https://aka.ms/ave/newfeature)
