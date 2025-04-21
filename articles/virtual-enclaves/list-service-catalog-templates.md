---
title: List of Service Catalog templates
description: List of Service Catalog templates.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# List of Service Catalog Templates
This is the current list of Azure services and workload templates in the Service Catalog.

## Table of Azure Service templates

| Template Name | Link | Status |
|--|--|--|
| Admin VM | [link](#admin-vm) | Available |
| Common Dependencies | [link](#common-dependencies) | Available |
| Remote App | [link](#remote-app) | Available |
| Storage Account | [link](#storage-account) | Available |
| Key Vault | [link](#key-vault) | Available |
| App Service: Web App | [link](#app-service-web-app) | Available |
| App Service: Functions | [link](#app-service-functions) | Available |
| Azure SQL | [link](#azure-sql) | Available |
| Azure Kubernetes Service (AKS) | [link](#azure-kubernetes-service-aks) | Available |
| Azure Container Registry (ACR) | [link](#azure-container-registry-acr) | Available |
| Azure Cosmos DB | [link](#azure-cosmos-db) | Available |
| Service Bus | [link](#service-bus) | Available |
| Azure Compute Gallery | [link](#azure-compute-gallery) | Future |

Additional templates will be added over time

## Admin VM

[How to create an Admin VM](./deploy-admin-vm-service-catalog.md)

Description: A Virtual Machine (VM) created for the purpose of securely accessing enclave resources for administrative purposes. Admin Workstation Virtual Machines (VMs) that can be remotely accessed through [Azure Bastion](https://aka.ms/bastion).

Documentation:
[Understanding Admin VMs](understanding-admin-vm.md)

## Common Dependencies

[How to create the common Azure service dependencies you will need to create the other resources from the service catalog](./deploy-common-dependencies-from-the-service-catalog-into-a-workload.md)

Description: This template creates the resources needed to secure the other resources you can deploy from the service catalog and remain compliant with the Azure Virtual Enclaves policies. These resources include the key vault and Customer Managed Keys (CMK) needed to encrypt the resources in your enclave.

Documentation:

## Remote App

[How to create a Remote App VM](./deploy-remoteapp-service-catalog.md)

Description:
This template and deploy a virtual machine that is domain joined and optionally published as a [RemoteApp](../virtual-desktop/publish-applications-stream-remoteapp.md) by joining and deploying a host pool, app location group, and workspace. The default application published as a remote app is the edge browser.

Documentation:
[Remote App Streaming Overview](../virtual-desktop/remote-app-streaming/overview.md)
[How-to deploy a Streaming App (RemoteApp)](./deploy-remoteapp-service-catalog.md)


## Storage Account
[How to create an AVE compliant Storage Account](./deploy-storage-account-service-catalog.md)

Description: This template deploys an azure storage account available from the virtual network inside the azure virtual enclave. The template deploys the storage account with customer managed keys and other policies required to operate inside an azure virtual enclave. [Learn more](../storage/common/storage-account-overview.md)

## Key Vault

Description: Azure Key Vault is one of several key management solutions in Azure, and helps solve the following problems:

 - Secrets Management - Azure Key Vault can be used to Securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets
 - Key Management - Azure Key Vault can be used as a Key Management solution. Azure Key Vault makes it easy to create and control the encryption keys used to encrypt your data.
 - Certificate Management - Azure Key Vault lets you easily provision, manage, and deploy public and private Transport Layer Security/Secure Sockets Layer (TLS/SSL) certificates for use with Azure and your internal connected resources.

Documentation:
[About Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/overview)
[Azure Key Vault basic concepts](https://learn.microsoft.com/azure/key-vault/general/basic-concepts)


## App Service Web App
[How to create an AVE compliant App Service Web App](./deploy-app-service-web-app-service-catalog.md)

Description: Azure Web Apps provides a fully managed platform for building and hosting web applications using popular programming languages such as .NET, Java, Node.js, Python, and PHP. [Learn more](../app-service/overview.md)

## App Service Functions
[How to create an AVE compliant App Service Function](./deploy-app-service-function-app-service-catalog.md)

Description: Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running. [Learn more](../azure-functions/functions-overview.md)


## Azure SQL
[How to create an AVE compliant Azure SQL](./deploy-azure-sql-service-catalog.md)

Description: Azure SQL Database, a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement. [Learn more](https://learn.microsoft.com/azure/azure-sql/database/sql-database-paas-overview)


## Azure Kubernetes Service (AKS)
[How to create an AVE compliant AKS](./deploy-azure-kubernetes-service-service-catalog.md)

Description: Azure Kubernetes Service (AKS) is a managed Kubernetes service that you can use to deploy and manage containerized applications. You need minimal container orchestration expertise to use AKS. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. [Learn more](https://learn.microsoft.com/azure/aks/what-is-aks)


## Azure Container Registry (ACR)
[How to create an AVE compliant ACR](./deploy-azure-container-registry-service-catalog.md)

Description: Azure Container Registry allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. Use Azure container registries with your existing container development and deployment pipelines. Use Azure Container Registry Tasks to build container images in Azure on-demand, or automate builds triggered by source code updates, updates to a container's base image, or timers. [Learn more](https://learn.microsoft.com/azure/container-registry/container-registry-intro)


## Azure Cosmos DB
[How to create an AVE compliant Cosmos DB](./deploy-azure-cosmos-db-service-catalog.md)

Description: Azure Cosmos DB simplifies and expedites your application development by being the single database for your operational data needs, from geo-replicated distributed caching to backup to vector indexing and search. It provides the data infrastructure for modern applications like AI agent, digital commerce, Internet of Things, and booking management. It can accommodate all your operational data models, including relational, document, vector, key-value, graph, and table. [Learn more](https://learn.microsoft.com/azure/cosmos-db/introduction)


## Service Bus
[How to create an AVE compliant Service Bus](./deploy-service-bus-service-catalog.md)

Description: Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. Service Bus is used to decouple applications and services from each other. [Learn more](../service-bus-messaging/service-bus-messaging-overview.md)


## Azure Compute Gallery

Description: An Azure Compute Gallery helps you build structure and organization around your Azure resources, like images and applications. [Learn more](https://learn.microsoft.com/azure/virtual-machines/azure-compute-gallery)

Status: **Future Development**

## Request new service
Submit a feature request using [this form](https://aka.ms/ave/scask)
