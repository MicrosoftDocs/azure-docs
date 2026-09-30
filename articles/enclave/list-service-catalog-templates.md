---
title: List of service catalog templates
description: List of service catalog templates.
author: aserfass-msft
ms.author: aserfass
ai-usage: ai-assisted
ms.topic: overview
ms.date: 6/30/2026
---

# List of service catalog templates
The current list of Azure services and workload templates in the service catalog.

## Table of Azure Service templates
These customer workload accelerators are available from the workload service catalog or [scripts](./deploy-template-service-catalog-azure-cli.md)

| Template Name | Documentation | Status |
|--|--|--|
| Admin VM | [link](#admin-vm) | Available |
| App Service: Web App | [link](#app-service-web-app) | Available |
| Azure Container Registry (ACR) | [link](#azure-container-registry-acr) | Available |
| Azure Cosmos DB | [link](#azure-cosmos-db) | Available |
| Azure Kubernetes Service (AKS) | [link](#azure-kubernetes-service-aks) | Available |
| Azure SQL | [link](#azure-sql) | Available |
| ExpressRoute Connection | [link](#expressroute-connection) | Available |
| Common Dependencies | [link](#common-dependencies) | Available |
| App Service: Functions | [link](#app-service-function-app) | Available |
| Key Vault | [link](#key-vault) | Available |
| Private DNS Zones | [link](#private-dns-zones) | Available |
| Service Bus | [link](#service-bus) | Available |
| Workload Quickstart | [link](#workload-quickstart) | Available |
| Storage Account | [link](#storage-account) | Available |
| Virtual Machine | [link](#virtual-machine) | Available |
| VPN Connection | [link](#vpn-connection) | Available |

## Admin VM
[How to create an Admin VM](./deploy-admin-vm-service-catalog.md)

Description: A Virtual Machine (VM) created to securely access enclave resources for administrative purposes. Admin VM Virtual Machines (VMs) that can be remotely accessed through [Azure Bastion](https://aka.ms/bastion).

Documentation:
[Understanding Admin VMs](./understand-admin-vm.md)

## Common Dependencies
[How to create the common Azure service dependencies you need to create the other resources from the service catalog](./deploy-common-dependencies-service-catalog.md)

Description: This template creates the resources needed to secure the other resources you can deploy from the service catalog and remain compliant with the Azure Enclave policies. These resources include the key vault and Customer Managed Keys (CMK) needed to encrypt the resources in your enclave.

Documentation:
  - [Key Vault](/azure/key-vault/general/overview)
  - [Customer Managed Key (CMK)](/azure/storage/common/customer-managed-keys-overview) for encryption
  - [Disk Encryption Set (DES)](/azure/virtual-machines/disk-encryption#full-control-of-your-keys) for disk encryption
  - [Storage Account](/azure/storage/common/storage-account-overview) quickstart. See the separate Storage Account service catalog template for more deployment customization
  - [Managed Identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) to securely access your resources within Azure Enclave

## Private DNS Zones
[How to create the Private DNS Zones you need for your other resources from the service catalog](./deploy-private-dns-zones-service-catalog.md)

Description: This template makes it easier to create the [Private DNS Zones](/azure/dns/private-dns-privatednszone) needed for you to access your Azure resources or create custom Private DNS Zones to access your custom zones. The records contained in a private DNS zone aren't resolvable from the Internet. DNS resolution against a private DNS zone works only from virtual networks that are linked to it. Private DNS zones linked to a virtual network are queried first when using the default DNS settings of a virtual network.

## Virtual Machine
[How to create a Virtual Machine](./deploy-virtual-machine-service-catalog.md)

Description:
This template creates a virtual machine. You can decide if the Virtual Machine is joined to the domain or published as a [RemoteApp](/azure/virtual-desktop/publish-applications-stream-remoteapp).

Documentation:
[RemoteApp Streaming Overview](/azure/virtual-desktop/remote-app-streaming/overview)
[How-to deploy a Streaming App (RemoteApp)](./deploy-virtual-machine-service-catalog.md)

## VPN Connection
[How to create an Azure Enclave compliant VPN Connection](./deploy-vpn-connection-service-catalog.md)

Description: This template creates a site-to-site VPN connection from a Transit Hub VPN gateway to an on-premises VPN device. It can also create the customer-side VPN connection when the required gateway resources already exist. [Learn more](/azure/vpn-gateway/vpn-gateway-about-vpngateways)

## Storage Account
[How to create an Azure Enclave compliant Storage Account](./deploy-storage-account-service-catalog.md)

Description: This template deploys an Azure storage account available from the virtual network inside the Azure Enclave. The template deploys the storage account with customer managed keys and other policies required to operate inside an Azure Enclave. [Learn more](/azure/storage/common/storage-account-overview)

## Key Vault
Description: Azure Key Vault is one of several key management solutions in Azure, and helps solve the following problems:

 - Secrets Management - Azure Key Vault can be used to Securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets
 - Key Management - Azure Key Vault can be used as a Key Management solution. Azure Key Vault makes it easy to create and control the encryption keys used to encrypt your data.
 - Certificate Management - Azure Key Vault lets you easily create, manage, and deploy public and private certificates for use with Azure and your internal connected resources.

Documentation:
[About Azure Key Vault](/azure/key-vault/general/overview)
[Azure Key Vault basic concepts](/azure/key-vault/general/basic-concepts)

## App Service Web App
[How to create an Azure Enclave compliant App Service Web App](./deploy-app-service-web-app-service-catalog.md)

Description: Azure Web Apps provides a fully managed platform for building and hosting web applications using popular programming languages such as .NET, Java, Node.js, Python, and PHP. [Learn more](/azure/app-service/overview)

## App Service Function App
[How to create an Azure Enclave compliant App Service Function](./deploy-app-service-function-app-service-catalog.md)

Description: Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Instead of worrying about deploying and maintaining servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running. [Learn more](/azure/azure-functions/functions-overview)

## Azure SQL
[How to create an Azure Enclave compliant Azure SQL](./deploy-azure-sql-service-catalog.md)

Description: Azure SQL Database, a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement. [Learn more](/azure/azure-sql/database/sql-database-paas-overview)

## ExpressRoute Connection
[How to create an Azure Enclave compliant ExpressRoute Connection](./deploy-express-route-connection-service-catalog.md)

Description: This template connects a Transit Hub ExpressRoute gateway to a customer-owned ExpressRoute circuit. Use this template when you already have a provisioned circuit with private peering configured. [Learn more](/azure/expressroute/expressroute-introduction)

## Workload Quickstart
[How to create an Azure Enclave compliant Workload Quickstart](./deploy-workload-quickstart-service-catalog.md)

Description: This template quickly creates the common workload resources you need in Azure Enclave, including private DNS zones, a key vault with a customer-managed key, a user-assigned managed identity, a disk encryption set, a storage account, and a virtual machine. [Learn more](/azure/virtual-network/virtual-networks-overview)

## Azure Kubernetes Service (AKS)
[How to create an Azure Enclave compliant AKS](./deploy-azure-kubernetes-service-service-catalog.md)

Description: Azure Kubernetes Service (AKS) is a managed Kubernetes service that you can use to deploy and manage containerized applications. You need minimal container orchestration expertise to use AKS. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. [Learn more](/azure/aks/what-is-aks)

## Azure Container Registry (ACR)
[How to create an Azure Enclave compliant ACR](./deploy-azure-container-registry-service-catalog.md)

Description: Azure Container Registry allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. Use Azure container registries with your existing container development and deployment pipelines. Use Azure Container Registry Tasks to build container images in Azure on-demand, or automate builds triggered by source code updates, updates to a container's base image, or timers. [Learn more](/azure/container-registry/container-registry-intro)

## Azure Cosmos DB
[How to create an Azure Enclave compliant Cosmos DB](./deploy-azure-cosmos-db-service-catalog.md)

Description: Azure Cosmos DB simplifies and expedites your application development by being the single database for your operational data needs, from geo-replicated distributed caching to back up to vector indexing and search. It provides the data infrastructure for modern applications like AI agent, digital commerce, Internet of Things, and booking management. It can accommodate all your operational data models, including relational, document, vector, key-value, graph, and table. [Learn more](/azure/cosmos-db/introduction)

## Service Bus
[How to create an Azure Enclave compliant Service Bus](./deploy-service-bus-service-catalog.md)

Description: Azure Service Bus is a fully managed enterprise message broker with message [queues](/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#queues) and [topics and subscriptions](/azure/service-bus-messaging/service-bus-queues-topics-subscriptions#topics-and-subscriptions). Service Bus is used to decouple applications and services from each other. [Learn more](/azure/service-bus-messaging/service-bus-messaging-overview)
