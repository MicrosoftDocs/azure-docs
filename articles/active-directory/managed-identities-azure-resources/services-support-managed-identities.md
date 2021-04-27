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

# Services that support managed identities for Azure resources

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without having credentials in your code. We are in the process of integrating managed identities for Azure resources and Azure AD authentication across Azure. Check back often for updates.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Azure services that support managed identities for Azure resources

The following Azure services support managed identities for Azure resources:


### Azure API Management

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Preview | Preview | Not available | Preview |

Refer to the following list to configure managed identity for Azure API Management (in regions where available):

- [Azure Resource Manager template](../../api-management/api-management-howto-use-managed-service-identity.md)

### Azure App Configuration

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not Available | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check]  | Not Available  | ![Available][check] |

Refer to the following list to configure managed identity for Azure App Configuration (in regions where available):

- [Azure CLI](../../azure-app-configuration/overview-managed-identity.md)

### Azure App Service

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check]  | ![Available][check]  | ![Available][check] |

Refer to the following list to configure managed identity for Azure App Service (in regions where available):

- [Azure portal](../../app-service/overview-managed-identity.md#using-the-azure-portal)
- [Azure CLI](../../app-service/overview-managed-identity.md#using-the-azure-cli)
- [Azure PowerShell](../../app-service/overview-managed-identity.md#using-azure-powershell)
- [Azure Resource Manager template](../../app-service/overview-managed-identity.md#using-an-azure-resource-manager-template)

### Azure Arc enabled Kubernetes

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Azure Arc enabled Kubernetes currently [supports system assigned identity](../../azure-arc/kubernetes/quickstart-connect-cluster.md). The managed service identity certificate is used by all Azure Arc enabled Kubernetes agents for communication with Azure.

### Azure Arc enabled servers

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

All Azure Arc enabled servers have a system assigned identity. You cannot disable or change the system assigned identity on an Azure Arc enabled server. Refer to the following resources to learn more about how to consume managed identities on Azure Arc enabled servers:

- [Authenticate against Azure resources with Arc enabled servers](../../azure-arc/servers/managed-identity-authentication.md)
- [Using a managed identity with Arc enabled servers](../../azure-arc/servers/security-overview.md#using-a-managed-identity-with-arc-enabled-servers)

### Azure Automanage

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following document to reconfigure a managed identity if you have moved your subscription to a new tenant:

* [Repair a broken Automanage Account](../../automanage/repair-automanage-account.md)

### Azure Automation

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following documents to use managed identity with [Azure Automation](../../automation/automation-intro.md):

* [Automation account authentication overview - Managed identities](../../automation/automation-security-overview.md#managed-identities-preview)
* [Enable and use managed identity for Automation](https://docs.microsoft.com/azure/automation/enable-managed-identity-for-automation)

### Azure Blueprints

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | Not available |
| User assigned | ![Available][check] | ![Available][check] | Not available | Not available |

Refer to the following list to use a managed identity with [Azure Blueprints](../../governance/blueprints/overview.md):

- [Azure portal - blueprint assignment](../../governance/blueprints/create-blueprint-portal.md#assign-a-blueprint)
- [REST API - blueprint assignment](../../governance/blueprints/create-blueprint-rest-api.md#assign-a-blueprint)


### Azure Cognitive Search

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

### Azure Cognitive Services

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |


### Azure Communication Services

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not available | Not available | Not available |
| User assigned | ![Available][check] | Not available | Not available | Not available |


### Azure Container Instances

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |
| User assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Container Instances (in regions where available):

- [Azure CLI](~/articles/container-instances/container-instances-managed-identity.md)
- [Azure Resource Manager template](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-resource-manager-template)
- [YAML](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-yaml-file)


### Azure Container Registry Tasks

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not available | Not available | Not available |
| User assigned | Preview | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Container Registry Tasks (in regions where available):

- [Azure CLI](~/articles/container-registry/container-registry-tasks-authentication-managed-identity.md)

### Azure Data Explorer

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

### Azure Data Factory V2

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Data Factory V2 (in regions where available):

- [Azure portal](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity)
- [PowerShell](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-powershell)
- [REST](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-rest-api)
- [SDK](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-sdk)

### Azure Digital Twins

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Digital Twins (in regions where available):

- [Azure portal](../../digital-twins/how-to-enable-managed-identities-portal.md)

### Azure Event Grid

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Preview | Not available | Preview |
| User assigned | Not available | Not available  | Not available  | Not available |

### Azure Firewall Policy

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Not available | Not available | Not available | Not available |
| User assigned | Preview | Not available  | Not available  | Not available |

### Azure Functions

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check]  | ![Available][check]  | ![Available][check]  |

Refer to the following list to configure managed identity for Azure Functions (in regions where available):

- [Azure portal](../../app-service/overview-managed-identity.md#using-the-azure-portal)
- [Azure CLI](../../app-service/overview-managed-identity.md#using-the-azure-cli)
- [Azure PowerShell](../../app-service/overview-managed-identity.md#using-azure-powershell)
- [Azure Resource Manager template](../../app-service/overview-managed-identity.md#using-an-azure-resource-manager-template)

### Azure IoT Hub

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure IoT Hub (in regions where available):

- [Azure portal](../../iot-hub/virtual-network-support.md#turn-on-managed-identity-for-iot-hub)

### Azure Import/Export

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available in the region where Azure Import Export service is available | Preview | Available | Available |
| User assigned | Not available | Not available | Not available | Not available |

### Azure Kubernetes Service (AKS)

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | Not available |
| User assigned | Preview | Not available | Not available | Not available |


For more information, see [Use managed identities in Azure Kubernetes Service](../../aks/use-managed-identity.md).

### Azure Log Analytics cluster

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |

For more information, see [how identity works in Azure Monitor](../../azure-monitor/logs/customer-managed-keys.md)

### Azure Logic Apps

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |


Refer to the following list to configure managed identity for Azure Logic Apps (in regions where available):

- [Azure portal](../../logic-apps/create-managed-service-identity.md#enable-system-assigned-identity-in-azure-portal)
- [Azure Resource Manager template](../../logic-apps/logic-apps-azure-resource-manager-templates-overview.md)

### Azure Machine Learning

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Not Available | Not available | Not available |
| User assigned | Preview | Not available | Not available | Not available |

For more information, see [Use managed identities with Azure Machine Learning](../../machine-learning/how-to-use-managed-identities.md).

### Azure Policy

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Policy (in regions where available):

- [Azure portal](../../governance/policy/tutorials/create-and-manage.md#assign-a-policy)
- [PowerShell](../../governance/policy/how-to/remediate-resources.md#create-managed-identity-with-powershell)
- [Azure CLI](/cli/azure/policy/assignment#az_policy_assignment_create)
- [Azure Resource Manager templates](/azure/templates/microsoft.authorization/policyassignments)
- [REST](/rest/api/policy/policyassignments/create)


### Azure Service Fabric

[Managed Identity for Service Fabric Applications](../../service-fabric/concepts-managed-identity.md) is available in all regions.

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not Available | Not Available | not Available |
| User assigned | ![Available][check] | Not Available | Not Available |Not Available |

Refer to the following list to configure managed identity for Azure Service Fabric applications in all regions:

- [Azure Resource Manager template](https://github.com/Azure-Samples/service-fabric-managed-identity/tree/anmenard-docs)

### Azure Spring Cloud

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not Available | Not Available | ![Available][check] |
| User assigned | Not Available | Not Available | Not Available | Not Available |


For more information, see [How to enable system-assigned managed identity for Azure Spring Cloud application](~/articles/spring-cloud/spring-cloud-howto-enable-system-assigned-managed-identity.md).

### Azure Stack Edge

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available in the region where Azure Stack Edge service is available | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

### Azure Virtual Machine Scale Sets

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |

Refer to the following list to configure managed identity for Azure Virtual Machine Scale Sets (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)



### Azure Virtual Machines

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |

Refer to the following list to configure managed identity for Azure Virtual Machines (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)
- [Azure SDKs](qs-configure-sdk-windows-vm.md)


### Azure VM Image Builder

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Not Available | Not Available | Not Available | Not Available |
| User assigned | [Available in supported regions](../../virtual-machines/image-builder-overview.md#regions) | Not Available | Not Available | Not Available |

To learn how to configure managed identity for Azure VM Image Builder (in regions where available), see the [Image Builder overview](../../virtual-machines/image-builder-overview.md#permissions).
### Azure SignalR Service

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Preview | Not available | Preview |
| User assigned | Preview | Preview | Not available | Preview |

Refer to the following list to configure managed identity for Azure SignalR Service (in regions where available):

- [Azure Resource Manager template](../../azure-signalr/howto-use-managed-identity.md)

### Azure Resource Mover

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Available in the regions where Azure Resource Mover service is available | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following document to use Azure Resource Mover:

- [Azure Resource Mover](../../resource-mover/overview.md)

## Azure services that support Azure AD authentication

The following services support Azure AD authentication, and have been tested with client services that use managed identities for Azure resources.

### Azure Resource Manager

Refer to the following list to configure access to Azure Resource Manager:

- [Assign access via Azure portal](howto-assign-access-portal.md)
- [Assign access via PowerShell](howto-assign-access-powershell.md)
- [Assign access via Azure CLI](howto-assign-access-CLI.md)
- [Assign access via Azure Resource Manager template](../../role-based-access-control/role-assignments-template.md)

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://management.azure.com/`| ![Available][check] |
| Azure Government | `https://management.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://management.microsoftazure.de/` | ![Available][check] |
| Azure China 21Vianet | `https://management.chinacloudapi.cn` | ![Available][check] |

### Azure Key Vault

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://vault.azure.net`| ![Available][check] |
| Azure Government | `https://vault.usgovcloudapi.net` | ![Available][check] |
| Azure Germany |  `https://vault.microsoftazure.de` | ![Available][check] |
| Azure China 21Vianet | `https://vault.azure.cn` | ![Available][check] |

### Azure Data Lake

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://datalake.azure.net/` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

### Azure SQL

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://database.windows.net/` | ![Available][check] |
| Azure Government | `https://database.usgovcloudapi.net/` | ![Available][check] |
| Azure Germany | `https://database.cloudapi.de/` | ![Available][check] |
| Azure China 21Vianet | `https://database.chinacloudapi.cn/` | ![Available][check] |

### Azure Data Explorer

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://<account>.<region>.kusto.windows.net` | ![Available][check] |
| Azure Government | `https://<account>.<region>.kusto.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://<account>.<region>.kusto.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://<account>.<region>.kusto.chinacloudapi.cn` | ![Available][check] |

### Azure Event Hubs

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://eventhubs.azure.net` | ![Available][check] |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

### Azure Service Bus

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://servicebus.azure.net`  | ![Available][check] |
| Azure Government |  | ![Available][check] |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |









### Azure Storage blobs and queues

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://storage.azure.com/` <br /><br />`https://<account>.blob.core.windows.net` <br /><br />`https://<account>.queue.core.windows.net` | ![Available][check] |
| Azure Government | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.usgovcloudapi.net` <br /><br />`https://<account>.queue.core.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.cloudapi.de` <br /><br />`https://<account>.queue.core.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://storage.azure.com/`<br /><br />`https://<account>.blob.core.chinacloudapi.cn` <br /><br />`https://<account>.queue.core.chinacloudapi.cn` | ![Available][check] |

### Azure Analysis Services

| Cloud | Resource ID | Status |
|--------|------------|:-:|
| Azure Global | `https://*.asazure.windows.net` | ![Available][check] |
| Azure Government | `https://*.asazure.usgovcloudapi.net` | ![Available][check] |
| Azure Germany | `https://*.asazure.cloudapi.de` | ![Available][check] |
| Azure China 21Vianet | `https://*.asazure.chinacloudapi.cn` | ![Available][check] |

> [!Note]
> Microsoft Power BI also [supports managed identities](../../stream-analytics/powerbi-output-managed-identity.md).


[check]: media/services-support-managed-identities/check.png "Available"
