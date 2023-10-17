---
title: Azure Services with managed identities support
description: List of services supporting managed identities
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 05/25/2023
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: amycolannino
ms.collection: M365-identity-device-management
---

# Azure services that can use managed identities to access other services

Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. Using a managed identity, you can authenticate to any [service that supports Microsoft Entra authentication](./services-id-authentication-support.md) without managing credentials. We are integrating managed identities for Azure resources and Microsoft Entra authentication across Azure. This page provides links to services' content that can use managed identities to access other Azure resources. Each entry in the table includes a link to service documentation discussing managed identities.

>[!IMPORTANT]
> New technical content is added daily. This list does not include every article that talks about managed identities. Please refer to each service's content set for details on their managed identities support. Resource provider namespace information is available in the article titled [Resource providers for Azure services](/azure/azure-resource-manager/management/azure-services-resource-providers).

## Services supporting managed identities

The following Azure services support managed identities for Azure resources:


| Service Name                    |  Documentation                                                                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | [Use managed identities in Azure API Management](/azure/api-management/api-management-howto-use-managed-service-identity)                                                                                            |
| Application Gateway             | [TLS termination with Key Vault certificates](/azure/application-gateway/key-vault-certs)                                                                                                             |
| Azure App Configuration         | [How to use managed identities for Azure App Configuration](/azure/azure-app-configuration/overview-managed-identity)                                                                                                           |
| Azure App Services              | [How to use managed identities for App Service and Azure Functions](/azure/app-service/overview-managed-identity)    |
| Azure Arc enabled Kubernetes    | [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster)                                                                                                   |
| Azure Arc enabled servers       | [Authenticate against Azure resources with Azure Arc-enabled servers](/azure/azure-arc/servers/managed-identity-authentication)                                                                                                 |
| Azure Automanage                | [Repair an Automanage Account](/azure/automanage/repair-automanage-account)                                                                     |
| Azure Automation                | [Azure Automation account authentication overview](/azure/automation/automation-security-overview#managed-identities)                                       |
| Azure Batch                     | [Configure customer-managed keys for your Azure Batch account with Azure Key Vault and Managed Identity](/azure/batch/batch-customer-managed-key)  </BR> [Configure managed identities in Batch pools](/azure/batch/managed-identity-pools)          |
| Azure Blueprints                | [Stages of a blueprint deployment](/azure/governance/blueprints/concepts/deployment-stages)                              |
| Azure Cache for Redis           | [Managed identity for storage accounts with Azure Cache for Redis](/azure/azure-cache-for-redis/cache-managed-identity) |
| Azure Communications Gateway    | [Deploy Azure Communications Gateway](/azure/communications-gateway/deploy) |
| Azure Container Apps            | [Managed identities in Azure Container Apps](/azure/container-apps/managed-identity) |
| Azure Container Instance        | [How to use managed identities with Azure Container Instances](/azure/container-instances/container-instances-managed-identity)                                                                                          |
| Azure Container Registry        | [Use an Azure-managed identity in ACR Tasks](/azure/container-registry/container-registry-tasks-authentication-managed-identity)                                                                       |
| Azure AI services        | [Configure customer-managed keys with Azure Key Vault for Azure AI services](/azure/ai-services/encryption/cognitive-services-encryption-keys-portal)                                                                          |
| Azure Data Box                  | [Use customer-managed keys in Azure Key Vault for Azure Data Box](/azure/databox/data-box-customer-managed-encryption-key-portal)                                                                                             |
| Azure Data Explorer             | [Configure managed identities for your Azure Data Explorer cluster](/azure/data-explorer/configure-managed-identities-cluster?tabs=portal)                                                                                                     |
| Azure Data Factory              | [Managed identity for Data Factory](/azure/data-factory/data-factory-service-identity)                                                                                                           |
| Azure Data Lake Storage Gen1    | [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview)                                                                                                  |
| Azure Data Share                | [Roles and requirements for Azure Data Share](/azure/data-share/concepts-roles-permissions)   |
| Azure DevTest Labs             | [Enable user-assigned managed identities on lab virtual machines in Azure DevTest Labs](/azure/devtest-labs/enable-managed-identities-lab-vms) |
| Azure Digital Twins             | [Enable a managed identity for routing Azure Digital Twins events](../develop/configure-app-multi-instancing.md)                                                                                            |
| Azure Event Grid                | [Event delivery with a managed identity](/azure/event-grid/managed-service-identity)
| Azure Event Hubs                | [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs Resources](/azure/event-hubs/authenticate-managed-identity)
| Azure Image Builder             | [Azure Image Builder overview](/azure/virtual-machines/image-builder-overview#permissions)                                                                                                    |
| Azure Import/Export             | [Use customer-managed keys in Azure Key Vault for Import/Export service](/azure/import-export/storage-import-export-encryption-key-portal)
| Azure IoT Hub                   | [IoT Hub support for virtual networks with Private Link and Managed Identity](/azure/iot-hub/virtual-network-support)                                                                               |
| Azure Kubernetes Service (AKS)  | [Use managed identities in Azure Kubernetes Service](/azure/aks/use-managed-identity)                                                                                                                           |
| Azure Load Testing                | [Use managed identities for Azure Load Testing](/azure/load-testing/how-to-use-a-managed-identity)  |
| Azure Logic Apps                | [Authenticate access to Azure resources using managed identities in Azure Logic Apps](/azure/logic-apps/create-managed-service-identity)                                                                                                       |
| Azure Log Analytics cluster     | [Azure Monitor customer-managed key](/azure/azure-monitor/logs/customer-managed-keys)
| Azure Machine Learning Services | [Use Managed identities with Azure Machine Learning](../develop/configure-app-multi-instancing.md?tabs=python)                                                                                         |
| Azure Managed Disk              | [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](/azure/virtual-machines/disks-enable-customer-managed-keys-portal)                                                                                        |
| Azure Media services            | [Managed identities](/azure/media-services/latest/concept-managed-identities) |
| Azure Monitor                   | [Azure Monitor customer-managed key](/azure/azure-monitor/logs/customer-managed-keys?tabs=portal)                                                                                              |
| Azure Policy                    | [Remediate non-compliant resources with Azure Policy](/azure/governance/policy/how-to/remediate-resources)      |
| Microsoft Purview                   | [Credentials for source authentication in Microsoft Purview](../develop/configure-app-multi-instancing.md)                                                                                                                          |
| Azure Resource Mover            | [Move resources across regions (from resource group)](/azure/resource-mover/move-region-within-resource-group)
| Azure Site Recovery             | [Replicate machines with private endpoints](/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#enable-the-managed-identity-for-the-vault)                                  |
| Azure Search                    | [Set up an indexer connection to a data source using a managed identity](/azure/search/search-howto-managed-identities-data-sources)                                                                                            |
| Azure Service Bus               | [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](/azure/service-bus-messaging/service-bus-managed-service-identity)                                                                                                        |
| Azure Service Fabric            | [Using Managed identities for Azure with Service Fabric](/azure/service-fabric/concepts-managed-identity)                                                                                                        |
| Azure SignalR Service           | [Managed identities for Azure SignalR Service](/azure/azure-signalr/howto-use-managed-identity)                                                                                                     |
| Azure Spring Apps               | [Enable system-assigned managed identity for an application in Azure Spring Apps](/azure/spring-apps/how-to-enable-system-assigned-managed-identity) |
| Azure SQL                       | [Managed identities in Microsoft Entra for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)                                                                                     |
| Azure SQL Managed Instance      | [Managed identities in Microsoft Entra for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)                                                                                       |
| Azure Stack Edge                | [Manage Azure Stack Edge secrets using Azure Key Vault](/azure/databox-online/azure-stack-edge-gpu-activation-key-vault#recover-managed-identity-access)
| Azure Static Web Apps           | [Securing authentication secrets in Azure Key Vault](/azure/static-web-apps/key-vault-secrets)
| Azure Stream Analytics          | [Authenticate Stream Analytics to Azure Data Lake Storage Gen1 using managed identities](/azure/stream-analytics/stream-analytics-managed-identities-adls)                                                                                         |
| Azure Synapse                   | [Azure Synapse workspace managed identity](../develop/configure-app-multi-instancing.md)                                                                                         |
| Azure VM image builder          | [Configure Azure Image Builder Service permissions using Azure CLI](/azure/virtual-machines/linux/image-builder-permissions-cli#using-managed-identity-for-azure-storage-access)|
| Azure Virtual Machine Scale Sets      | [Configure managed identities on virtual machine scale set - Azure CLI](qs-configure-cli-windows-vmss.md)                                                                  |
| Azure Virtual Machines                | [Secure and use policies on virtual machines in Azure](../develop/configure-app-multi-instancing.md#managed-identities-for-azure-resources)                                                                  |
| Azure Web PubSub Service           | [Managed identities for Azure Web PubSub Service](/azure/azure-web-pubsub/howto-use-managed-identity)     |

## Next steps

- [Managed identities overview](Overview.md)
