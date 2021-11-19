---
title: Azure Services that support managed identities - Azure AD
description: List of services that support managed identities for Azure resources and Azure AD authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 11/19/2021
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: karenh444
ms.collection: M365-identity-device-management
ms.custom: references_regions
---

# Azure services that support the use of Managed identities to access other services

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without managing credentials. We are integrating managed identities for Azure resources and Azure AD authentication across Azure. This page provides links to services' content that can use managed identities to access other Azure resources. Each entry in the table includes a link to service documentation discussing managed identities.

>[!IMPORTANT]
> New content is added to docs.microsoft.com every day. This list does not include every article that talks about managed identities. Please refer to each service's content set for details on their managed identities support.

The following Azure services support managed identities for Azure resources:

>[!NOTE]
> Table entries ordered by Resource provider namespace

| Service Name                    | Resource Provider namespace       | Documentation                                                                                                                                                                                |
|---------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| API Management                  | microsoft.apimanagement           | [Use managed identities in Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md)                                                                                            |
| Azure App Configuration         | microsoft.appconfiguration        | [How to use managed identities for Azure App Configuration](../../azure-app-configuration/overview-managed-identity.md)                                                                                                           |
| Azure Spring Cloud              | microsoft.appplatform             | [How to enable system-assigned managed identity for Azure Spring Cloud application](../../spring-cloud/how-to-enable-system-assigned-managed-identity.md) |
| Azure Policy                    | microsoft.authorization           | [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md)      |
| Azure Automanage                | microsoft.automanage              | [Repair an Automanage Account](../../automanage/repair-automanage-account.md)                                                                     |
| Azure Automation                | microsoft.automation              | [Azure Automation account authentication overview](../../automation/automation-security-overview#managed-identities-preview.md)                                       |
| Azure Batch                     | microsoft.batch                   | [Configure customer-managed keys for your Azure Batch account with Azure Key Vault and Managed Identity](../../batch/batch-customer-managed-key.md)  </BR>- [Configure managed identities in Batch pools](../../batch/managed-identity-pools.md)          |
| Azure Blueprints                | microsoft.blueprint               | [Stages of a blueprint deployment](../../governance/blueprints/concepts/deployment-stages.md)                              |
| Azure Cognitive Services        | microsoft.cognitiveservices       | [Configure customer-managed keys with Azure Key Vault for Cognitive Services](../../cognitive-services/encryption/cognitive-services-encryption-keys-portal.md)                                                                          |
| Virtual Machine Scale Sets      | microsoft.compute                 | [Configure managed identities on virtual machine scale set - Azure CLI](qs-configure-cli-windows-vmss.md)                                                                  |
| Virtual Machines                | microsoft.compute                 | [Secure and use policies on virtual machines in Azure](../../virtual-machines/windows/security-policy.md#managed-identities-for-azure-resources)                                                                   |
| Azure Managed Disk              | microsoft.compute                 | [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](../../virtual-machines/disks-enable-customer-managed-keys-portal.md)                                                                                        |
| Azure Container Instance        | microsoft.containerinstance       | [How to use managed identities with Azure Container Instances](../../container-instances/container-instances-managed-identity.md)                                                                                          |
| Azure Container Registry        | microsoft.containerregistry       | [Use an Azure-managed identity in ACR Tasks](../../container-registry/container-registry-tasks-authentication-managed-identity.md)                                                                       |
| Azure Kubernetes Service (AKS)  | microsoft.containerservice        | [Use managed identities in Azure Kubernetes Service](../../aks/use-managed-identity.md)                                                                                                                           |
| Azure Data Box                  | microsoft.databoxedge             | [Use customer-managed keys in Azure Key Vault for Azure Data Box](../../databox/data-box-customer-managed-encryption-key-portal.md)                                                                                             |
| Azure Data Factory              | microsoft.datafactory             | [Managed identity for Data Factory](../../data-factory/data-factory-service-identity.md)                                                                                                           |
| Azure Data Share                | microsoft.datashare               | [Roles and requirements for Azure Data Share](../../data-share/concepts-roles-permissions.md)                                                                                                             |
| Azure IoT Hub                   | microsoft.devices                 | [IoT Hub support for virtual networks with Private Link and Managed Identity](../../iot-hub/virtual-network-support.md#turn-on-managed-identity-for-iot-hub)                                                                               |
| Azure Digital Twins             | microsoft.digitaltwins            | [Enable a managed identity for routing Azure Digital Twins events](../../digital-twins/how-to-enable-managed-identities-portal.md)                                                                                            |
| Azure Arc enabled servers       | microsoft.hybridcompute           | [Authenticate against Azure resources with Azure Arc-enabled servers](../../azure-arc/servers/managed-identity-authentication.md)                                                                                                 |
| Azure Import/Export             | microsoft.importexport            | [Use customer-managed keys in Azure Key Vault for Import/Export service](../../import-export/storage-import-export-encryption-key-portal.md)                                                                                         |
| Azure Arc enabled Kubernetes    | microsoft.kubernetes              | [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md)                                                                                                   |
| Azure Data Explorer             | microsoft.kusto                   | [Configure managed identities for your Azure Data Explorer cluster](../../data-explorer/managed-identities.md)                                                                                                     |
| Azure Logic App                 | microsoft.logic                   | [Authenticate access to Azure resources using managed identities in Azure Logic Apps](../../logic-apps/create-managed-service-identity.md)                                                                                                       |
| Azure Machine Learning Services | microsoft.machinelearningservices | [Use Managed identities with Azure Machine Learning](/machine-learning/how-to-use-managed-identities.md?tabs=python)                                                                                         |
| Application Gateway             | microsoft.network                 | [TLS termination with Key Vault certificates](../../application-gateway/key-vault-certs.md)                                                                                                             |
| Azure Monitor                   | microsoft.operationalinsights     | [Azure Monitor customer-managed key](../../azure-monitor/logs/customer-managed-keys.md?tabs=portal)                                                                                              |
| Azure Purview                   | microsoft.purview                 | [Credentials for source authentication in Azure Purview](../../purview/manage-credentials.md)                                                                                                                          |
| Azure Site Recovery             | microsoft.recoveryservices        | [Replicate machines with private endpoints](../../site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints.md#enable-the-managed-identity-for-the-vault)                                  |
| Azure Search                    | microsoft.search                  | [Set up an indexer connection to a data source using a managed identity](../../search/search-howto-managed-identities-data-sources.md)                                                                                            |
| Azure Service Fabric            | microsoft.servicefabric           | [Using Managed identities for Azure with Service Fabric](../../service-fabric/concepts-managed-identity)                                                                                                        |
| Azure SignalR Service           | microsoft.signalrservice          | [Managed identities for Azure SignalR Service](../../azure-signalr/howto-use-managed-identity.md)                                                                                                     |
| Azure SQL                       | microsoft.sql                     | [Azure SQL Transparent Data Encryption with customer-managed key](../../azure-sql/database/transparent-data-encryption-byok-overview.md)                                                                                     |
| Azure SQL Managed Instance      | microsoft.sql                     | [Azure SQL Transparent Data Encryption with customer-managed key](../../azure-sql/database/transparent-data-encryption-byok-overview.md)                                                                                       |
| Azure Data Lake Storage Gen1    | microsoft.storage                 | [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md)                                                                                                  |
| Azure Stream Analytics          | microsoft.streamanalytics         | [Authenticate Stream Analytics to Azure Data Lake Storage Gen1 using managed identities](../../stream-analytics/stream-analytics-managed-identities-adls.md)                                                                                         |
| Azure Synapse                   | microsoft.synapse                 | [Azure Synapse workspace managed identity](../../synapse-analytics/security/synapse-workspace-managed-identity.md)                                                                                         |
| Azure Image Builder             | microsoft.virtualmachineimages    | [Azure Image Builder overview](../../virtual-machines/image-builder-overview#permissions.md)                                                                                                    |
| Azure App Services              | microsoft.web                     | [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)                                                                                                                 |

