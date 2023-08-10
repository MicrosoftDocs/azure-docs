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

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any [service that supports Azure AD authentication](services-azure-active-directory-support.md) without managing credentials. We are integrating managed identities for Azure resources and Azure AD authentication across Azure. This page provides links to services' content that can use managed identities to access other Azure resources. Each entry in the table includes a link to service documentation discussing managed identities.

>[!IMPORTANT]
> New technical content is added daily. This list does not include every article that talks about managed identities. Please refer to each service's content set for details on their managed identities support. Resource provider namespace information is available in the article titled [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md).

## Services supporting managed identities

The following Azure services support managed identities for Azure resources:


| Service Name                    |  Documentation                                                                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | [Use managed identities in Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md)                                                                                            |
| Application Gateway             | [TLS termination with Key Vault certificates](../../application-gateway/key-vault-certs.md)                                                                                                             |
| Azure App Configuration         | [How to use managed identities for Azure App Configuration](../../azure-app-configuration/overview-managed-identity.md)                                                                                                           |
| Azure App Services              | [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)    |
| Azure Arc enabled Kubernetes    | [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md)                                                                                                   |
| Azure Arc enabled servers       | [Authenticate against Azure resources with Azure Arc-enabled servers](../../azure-arc/servers/managed-identity-authentication.md)                                                                                                 |
| Azure Automanage                | [Repair an Automanage Account](../../automanage/repair-automanage-account.md)                                                                     |
| Azure Automation                | [Azure Automation account authentication overview](../../automation/automation-security-overview.md#managed-identities)                                       |
| Azure Batch                     | [Configure customer-managed keys for your Azure Batch account with Azure Key Vault and Managed Identity](../../batch/batch-customer-managed-key.md)  </BR> [Configure managed identities in Batch pools](../../batch/managed-identity-pools.md)          |
| Azure Blueprints                | [Stages of a blueprint deployment](../../governance/blueprints/concepts/deployment-stages.md)                              |
| Azure Cache for Redis           | [Managed identity for storage accounts with Azure Cache for Redis](../../azure-cache-for-redis/cache-managed-identity.md) |
| Azure Communications Gateway    | [Deploy Azure Communications Gateway](../../communications-gateway/deploy.md) |
| Azure Container Apps            | [Managed identities in Azure Container Apps](../../container-apps/managed-identity.md) |
| Azure Container Instance        | [How to use managed identities with Azure Container Instances](../../container-instances/container-instances-managed-identity.md)                                                                                          |
| Azure Container Registry        | [Use an Azure-managed identity in ACR Tasks](../../container-registry/container-registry-tasks-authentication-managed-identity.md)                                                                       |
| Azure AI services        | [Configure customer-managed keys with Azure Key Vault for Azure AI services](../../ai-services/encryption/cognitive-services-encryption-keys-portal.md)                                                                          |
| Azure Data Box                  | [Use customer-managed keys in Azure Key Vault for Azure Data Box](../../databox/data-box-customer-managed-encryption-key-portal.md)                                                                                             |
| Azure Data Explorer             | [Configure managed identities for your Azure Data Explorer cluster](/azure/data-explorer/configure-managed-identities-cluster?tabs=portal)                                                                                                     |
| Azure Data Factory              | [Managed identity for Data Factory](../../data-factory/data-factory-service-identity.md)                                                                                                           |
| Azure Data Lake Storage Gen1    | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md)                                                                                                  |
| Azure Data Share                | [Roles and requirements for Azure Data Share](../../data-share/concepts-roles-permissions.md)   |
| Azure DevTest Labs             | [Enable user-assigned managed identities on lab virtual machines in Azure DevTest Labs](../../devtest-labs/enable-managed-identities-lab-vms.md) |
| Azure Digital Twins             | [Enable a managed identity for routing Azure Digital Twins events](../../digital-twins/how-to-enable-managed-identities-portal.md)                                                                                            |
| Azure Event Grid                | [Event delivery with a managed identity](../../event-grid/managed-service-identity.md)
| Azure Event Hubs                | [Authenticate a managed identity with Azure Active Directory to access Event Hubs Resources](../../event-hubs/authenticate-managed-identity.md)
| Azure Image Builder             | [Azure Image Builder overview](../../virtual-machines/image-builder-overview.md#permissions)                                                                                                    |
| Azure Import/Export             | [Use customer-managed keys in Azure Key Vault for Import/Export service](../../import-export/storage-import-export-encryption-key-portal.md)
| Azure IoT Hub                   | [IoT Hub support for virtual networks with Private Link and Managed Identity](../../iot-hub/virtual-network-support.md)                                                                               |
| Azure Kubernetes Service (AKS)  | [Use managed identities in Azure Kubernetes Service](../../aks/use-managed-identity.md)                                                                                                                           |
| Azure Load Testing                | [Use managed identities for Azure Load Testing](../../load-testing/how-to-use-a-managed-identity.md)  |
| Azure Logic Apps                | [Authenticate access to Azure resources using managed identities in Azure Logic Apps](../../logic-apps/create-managed-service-identity.md)                                                                                                       |
| Azure Log Analytics cluster     | [Azure Monitor customer-managed key](../../azure-monitor/logs/customer-managed-keys.md)
| Azure Machine Learning Services | [Use Managed identities with Azure Machine Learning](../../machine-learning/how-to-use-managed-identities.md?tabs=python)                                                                                         |
| Azure Managed Disk              | [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](../../virtual-machines/disks-enable-customer-managed-keys-portal.md)                                                                                        |
| Azure Media services            | [Managed identities](/azure/media-services/latest/concept-managed-identities) |
| Azure Monitor                   | [Azure Monitor customer-managed key](../../azure-monitor/logs/customer-managed-keys.md?tabs=portal)                                                                                              |
| Azure Policy                    | [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md)      |
| Microsoft Purview                   | [Credentials for source authentication in Microsoft Purview](../../purview/manage-credentials.md)                                                                                                                          |
| Azure Resource Mover            | [Move resources across regions (from resource group)](../../resource-mover/move-region-within-resource-group.md)
| Azure Site Recovery             | [Replicate machines with private endpoints](../../site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints.md#enable-the-managed-identity-for-the-vault)                                  |
| Azure Search                    | [Set up an indexer connection to a data source using a managed identity](../../search/search-howto-managed-identities-data-sources.md)                                                                                            |
| Azure Service Bus               | [Authenticate a managed identity with Azure Active Directory to access Azure Service Bus resources](../../service-bus-messaging/service-bus-managed-service-identity.md)                                                                                                        |
| Azure Service Fabric            | [Using Managed identities for Azure with Service Fabric](../../service-fabric/concepts-managed-identity.md)                                                                                                        |
| Azure SignalR Service           | [Managed identities for Azure SignalR Service](../../azure-signalr/howto-use-managed-identity.md)                                                                                                     |
| Azure Spring Apps               | [Enable system-assigned managed identity for an application in Azure Spring Apps](../../spring-apps/how-to-enable-system-assigned-managed-identity.md) |
| Azure SQL                       | [Managed identities in Azure AD for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)                                                                                     |
| Azure SQL Managed Instance      | [Managed identities in Azure AD for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)                                                                                       |
| Azure Stack Edge                | [Manage Azure Stack Edge secrets using Azure Key Vault](../../databox-online/azure-stack-edge-gpu-activation-key-vault.md#recover-managed-identity-access)
| Azure Static Web Apps           | [Securing authentication secrets in Azure Key Vault](../../static-web-apps/key-vault-secrets.md)
| Azure Stream Analytics          | [Authenticate Stream Analytics to Azure Data Lake Storage Gen1 using managed identities](../../stream-analytics/stream-analytics-managed-identities-adls.md)                                                                                         |
| Azure Synapse                   | [Azure Synapse workspace managed identity](../../synapse-analytics/security/synapse-workspace-managed-identity.md)                                                                                         |
| Azure VM image builder          | [Configure Azure Image Builder Service permissions using Azure CLI](../../virtual-machines/linux/image-builder-permissions-cli.md#using-managed-identity-for-azure-storage-access)|
| Azure Virtual Machine Scale Sets      | [Configure managed identities on virtual machine scale set - Azure CLI](qs-configure-cli-windows-vmss.md)                                                                  |
| Azure Virtual Machines                | [Secure and use policies on virtual machines in Azure](../../virtual-machines/windows/security-policy.md#managed-identities-for-azure-resources)                                                                  |
| Azure Web PubSub Service           | [Managed identities for Azure Web PubSub Service](../../azure-web-pubsub/howto-use-managed-identity.md)     |

## Next steps

- [Managed identities overview](Overview.md)
