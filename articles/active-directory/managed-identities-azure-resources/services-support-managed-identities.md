---
title: Azure Services that support managed identities - Azure AD
description: List of services that support managed identities for Azure resources and Azure AD authentication
services: active-directory
author: MarkusVi
ms.author: markvi
ms.date: 06/11/2020
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: markvi
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

- [Azure Resource Manager template](/azure/api-management/api-management-howto-use-managed-service-identity)


### Azure App Service

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check]  | ![Available][check]  | ![Available][check] |

Refer to the following list to configure managed identity for Azure App Service (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)


### Azure Blueprints

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | Not available |
| User assigned | ![Available][check] | ![Available][check] | Not available | Not available |

Refer to the following list to use a managed identity with [Azure Blueprints](../../governance/blueprints/overview.md):

- [Azure portal - blueprint assignment](../../governance/blueprints/create-blueprint-portal.md#assign-a-blueprint)
- [REST API - blueprint assignment](../../governance/blueprints/create-blueprint-rest-api.md#assign-a-blueprint)


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



### Azure Event Grid 

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Preview | Not available | Not available | Not available |
| User assigned | Not available | Not available  | Not available  | Not available |









### Azure Functions

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check]  | ![Available][check]  | ![Available][check]  |

Refer to the following list to configure managed identity for Azure Functions (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)

### Azure IoT Hub

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Data Factory V2 (in regions where available):

- [Azure portal](../../iot-hub/virtual-network-support.md#turn-on-managed-identity-for-iot-hub)

### Azure Import/Export

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available in the region where Azure Import Export service is available | Preview | Available | Available |
| User assigned | Not available | Not available | Not available | Not available |

### Azure Kubernetes Service (AKS)

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | - | - | - | 
| User assigned | ![Available][check] | - | - | - |


For more information, see [Use managed identities in Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/use-managed-identity).


### Azure Logic Apps

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |
| User assigned | ![Available][check] | ![Available][check] | Not available | ![Available][check] |


Refer to the following list to configure managed identity for Azure Logic Apps (in regions where available):

- [Azure portal](/azure/logic-apps/create-managed-service-identity#enable-system-assigned-identity-in-azure-portal)
- [Azure Resource Manager template](https://docs.microsoft.com/azure/logic-apps/logic-apps-azure-resource-manager-templates-overview)


### Azure Policy

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | ![Available][check] | ![Available][check] |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Policy (in regions where available):

- [Azure portal](../../governance/policy/tutorials/create-and-manage.md#assign-a-policy)
- [PowerShell](../../governance/policy/how-to/remediate-resources.md#create-managed-identity-with-powershell)
- [Azure CLI](https://docs.microsoft.com/cli/azure/policy/assignment?view=azure-cli-latest#az-policy-assignment-create)
- [Azure Resource Manager templates](https://docs.microsoft.com/azure/templates/microsoft.authorization/policyassignments)
- [REST](https://docs.microsoft.com/rest/api/resources/policyassignments/create)


### Azure Service Fabric

[Managed Identity for Service Fabric Applications](https://docs.microsoft.com/azure/service-fabric/concepts-managed-identity) is in Preview and available in all regions.

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not Available | Not Available | not Available |
| User assigned | ![Available][check] | Not Available | Not Available |Not Available |

Refer to the following list to configure managed identity for Azure Service Fabric applications in all regions:

- [Azure Resource Manager template](https://github.com/Azure-Samples/service-fabric-managed-identity/tree/anmenard-docs)

### Azure Spring Cloud

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Not Available | Not Available | Not Available | 
| User assigned | Not Available | Not Available | Not Available | Not Available |


For more information, see [How to enable system-assigned managed identity for Azure Spring Cloud application](~/articles/spring-cloud/spring-cloud-howto-enable-system-assigned-managed-identity.md).


### Azure Virtual Machine Scale Sets

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | Preview | Preview | Preview |
| User assigned | ![Available][check] | Preview | Preview | Preview |

Refer to the following list to configure managed identity for Azure Virtual Machine Scale Sets (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)



### Azure Virtual Machines

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | ![Available][check] | ![Available][check] | Preview | Preview | 
| User assigned | ![Available][check] | ![Available][check] | Preview | Preview |

Refer to the following list to configure managed identity for Azure Virtual Machines (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)


### Azure VM Image Builder

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | :-: | :-: | :-: | :-: |
| System assigned | Not Available | Not Available | Not Available | Not Available | 
| User assigned | [Available in supported regions](https://docs.microsoft.com/azure/virtual-machines/windows/image-builder-overview#regions) | Not Available | Not Available | Not Available |

To learn how to configure managed identity for Azure VM Image Builder (in regions where available), see the [Image Builder overview](https://docs.microsoft.com/azure/virtual-machines/windows/image-builder-overview#permissions).

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
> Microsoft Power BI also [supports managed identities](https://docs.microsoft.com/azure/stream-analytics/powerbi-output-managed-identity).


[check]: media/services-support-managed-identities/check.png "Available"
