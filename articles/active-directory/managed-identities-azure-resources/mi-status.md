---
title: Azure Services that support managed identities - Azure AD
description: List of services that support managed identities for Azure resources and Azure AD authentication
services: active-directory
author: barclayn
ms.author: barclayn
ms.date: 01/28/2021
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: daveba
ms.collection: M365-identity-device-management
ms.custom: references_regions
---

# List of services that use Managed identities to access other services

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without having to manage credentials. We are in the process of integrating managed identities for Azure resources and Azure AD authentication across Azure. This page provides links to individual services' content that can use managed identities to access other Azure resources. We include a link to the service documentation. Please refer to each service content for specifics on their managed identities support.

The following Azure services support managed identities for Azure resources:
| Service Name                    | Resource Provider namespace       | Documentation                                                                                                                                                                                |
|---------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [API Management                  | microsoft.apimanagement           | [Use managed identities in Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md)                                                                                            |
| Azure App Configuration         | microsoft.appconfiguration        | [How to use managed identities for Azure App Configuration](https://docs.microsoft.com/azure/azure-app-configuration/overview-managed-identity)                                                                                                           |
| Azure Spring Cloud              | microsoft.appplatform             | [How to enable system-assigned managed identity for Azure Spring Cloud application](https://docs.microsoft.com/azure/spring-cloud/how-to-enable-system-assigned-managed-identity) |
| Azure Policy                    | microsoft.authorization           | [Remediate non-compliant resources with Azure Policy](https://docs.microsoft.com/azure/governance/policy/how-to/remediate-resources)      |
| Azure Automanage                | microsoft.automanage              | https://docs.microsoft.com/azure/automanage/repair-automanage-account                                                                     |
| Azure Automation                | microsoft.automation              | https://docs.microsoft.com/azure/automation/automation-security-overview#managed-identities-preview                                       |
| Azure Batch                     | microsoft.batch                   | https://docs.microsoft.com/azure/batch/batch-customer-managed-key, https://docs.microsoft.com/azure/batch/managed-identity-pools          |
| Azure Blueprints                | microsoft.blueprint               | https://docs.microsoft.com/azure/governance/blueprints/concepts/deployment-stages#optional---azure-blueprints-creates-system-assigned-managed-identity                              |
| Azure Cognitive Services        | microsoft.cognitiveservices       | https://docs.microsoft.com/azure/cognitive-services/encryption/cognitive-services-encryption-keys-portal                                                                          |
| Virtual Machine Scale Sets      | microsoft.compute                 | https://docs.microsoft.com/azure/virtual-machines/windows/security-policy#managed-identities-for-azure-resources                                                                  |
| Virtual Machines                | microsoft.compute                 | https://docs.microsoft.com/azure/virtual-machines/windows/security-policy#managed-identities-for-azure-resources                                                                   |
| Azure Managed Disk              | microsoft.compute                 | https://docs.microsoft.com/azure/virtual-machines/disks-enable-customer-managed-keys-portal                                                                                        |
| Azure Container Instance        | microsoft.containerinstance       | https://docs.microsoft.com/azure/container-instances/container-instances-managed-identity                                                                                          |
| Azure Container Registry        | microsoft.containerregistry       | https://docs.microsoft.com/azure/container-registry/container-registry-tasks-authentication-managed-identity                                                                       |
| Azure Kubernetes Service (AKS)  | microsoft.containerservice        | https://docs.microsoft.com/azure/aks/use-managed-identity                                                                                                                           |
| Azure Data Box                  | microsoft.databoxedge             | https://docs.microsoft.com/azure/databox/data-box-customer-managed-encryption-key-portal                                                                                             |
| Azure Data Factory              | microsoft.datafactory             | https://docs.microsoft.com/azure/data-factory/data-factory-service-identity                                                                                                           |
| Azure Data Share                | microsoft.datashare               | https://docs.microsoft.com/azure/data-share/concepts-roles-permissions                                                                                                             |
| Azure IoT Hub                   | microsoft.devices                 | https://docs.microsoft.com/azure/iot-hub/virtual-network-support#turn-on-managed-identity-for-iot-hub                                                                               |
| Azure Digital Twins             | microsoft.digitaltwins            | https://docs.microsoft.com/azure/digital-twins/how-to-enable-managed-identities-portal                                                                                            |
| Azure Arc enabled servers       | microsoft.hybridcompute           | https://docs.microsoft.com/azure/azure-arc/servers/managed-identity-authentication                                                                                                 |
| Azure Import/Export             | microsoft.importexport            | https://docs.microsoft.com/azure/import-export/storage-import-export-encryption-key-portal                                                                                         |
| Azure Arc enabled Kubernetes    | microsoft.kubernetes              | https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster                                                                                                   |
| Azure Data Explorer             | microsoft.kusto                   | https://docs.microsoft.com/azure/data-explorer/managed-identities?tabs=portal                                                                                                     |
| Azure Logic App                 | microsoft.logic                   | https://docs.microsoft.com/azure/logic-apps/create-managed-service-identity                                                                                                       |
| Azure Machine Learning Services | microsoft.machinelearningservices | https://docs.microsoft.com/azure/machine-learning/how-to-use-managed-identities?tabs=python                                                                                         |
| Application Gateway             | microsoft.network                 | https://docs.microsoft.com/azure/application-gateway/key-vault-certs                                                                                                             |
| Azure Firewall Policy           | microsoft.network                 | https://azure.microsoft.com/blog/azure-firewall-premium-now-in-preview-2/                                                                                                           |
| Azure Monitor                   | microsoft.operationalinsights     | https://docs.microsoft.com/azure/azure-monitor/logs/customer-managed-keys?tabs=portal                                                                                              |
| Azure Purview                   | microsoft.purview                 | https://docs.microsoft.com/azure/purview/manage-credentials                                                                                                                          |
| Azure Quantum Service           | microsoft.quantum                 | https://azure.microsoft.com/services/quantum/                                                                                                                                        |
| Azure Site Recovery             | microsoft.recoveryservices        | https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#enable-the-managed-identity-for-the-vault                                  |
| Azure Search                    | microsoft.search                  | https://docs.microsoft.com/azure/search/search-howto-managed-identities-data-sources                                                                                            |
| Azure Service Fabric            | microsoft.servicefabric           | https://docs.microsoft.com/azure/service-fabric/concepts-managed-identity                                                                                                        |
| Azure SignalR Service           | microsoft.signalrservice          | https://docs.microsoft.com/azure/azure-signalr/howto-use-managed-identity                                                                                                     |
| Azure SQL                       | microsoft.sql                     | https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-byok-overview                                                                                     |
| Azure SQL Managed Instance      | microsoft.sql                     | https://docs.microsoft.com/azure/azure-sql/database/transparent-data-encryption-byok-overview                                                                                       |
| Azure Data Lake Storage Gen1    | microsoft.storage                 | https://docs.microsoft.com/azure/storage/common/customer-managed-keys-overview                                                                                                  |
| Azure Stream Analytics          | microsoft.streamanalytics         | https://docs.microsoft.com/azure/stream-analytics/stream-analytics-managed-identities-adls                                                                                         |
| Azure Synapse                   | microsoft.synapse                 | https://docs.microsoft.com/azure/synapse-analytics/security/synapse-workspace-managed-identity                                                                                         |
| Azure Image Builder             | microsoft.virtualmachineimages    | https://docs.microsoft.com/azure/virtual-machines/image-builder-overview#permissions                                                                                                    |
| Azure App Services              | microsoft.web                     | https://docs.microsoft.com/azure/app-service/overview-managed-identity                                                                                                                 |

