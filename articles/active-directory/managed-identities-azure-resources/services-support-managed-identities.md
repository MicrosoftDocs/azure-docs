---
title: Azure Services that support managed identities for Azure resources
description: List of services that support managed identities for Azure resources and Azure AD authentication
services: active-directory
author: MarkusVi
ms.author: markvi
ms.date: 06/19/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: msi
manager: markvi
ms.collection: M365-identity-device-management
---

# Services that support managed identities for Azure resources

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without having credentials in your code. We are in the process of integrating managed identities for Azure resources and Azure AD authentication across Azure. Check back often for updates.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Azure services that support managed identities for Azure resources

The following Azure services support managed identities for Azure resources:

### Azure Virtual Machines

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview | 
| User assigned | Preview | Preview | Preview | Preview |

Refer to the following list to configure managed identity for Azure Virtual Machines (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)

### Azure Virtual Machine Scale Sets

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview |
| User assigned | Preview | Preview | Preview | Preview |

Refer to the following list to configure managed identity for Azure Virtual Machine Scale Sets (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)

### Azure App Service

| Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure App Service (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)

### Azure Blueprints

|Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Preview | Not available | Not available | Not available |
| User assigned | Preview | Not available | Not available | Not available |

Refer to the following list to use a managed identity with [Azure Blueprints](../../governance/blueprints/overview.md):

- [Azure portal - blueprint assignment](../../governance/blueprints/create-blueprint-portal.md#assign-a-blueprint)
- [REST API - blueprint assignment](../../governance/blueprints/create-blueprint-rest-api.md#assign-a-blueprint)

### Azure Functions

Managed identity type |All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Functions (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)

### Azure Logic Apps

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Preview | Preview | Not available | Preview |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Logic Apps (in regions where available):

- [Azure portal](/azure/logic-apps/create-managed-service-identity#azure-portal)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity)

### Azure Data Factory V2

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Data Factory V2 (in regions where available):

- [Azure portal](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity)
- [PowerShell](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-powershell)
- [REST](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-rest-api)
- [SDK](~/articles/data-factory/data-factory-service-identity.md#generate-managed-identity-using-sdk)

### Azure API Management

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure API Management (in regions where available):

- [Azure Resource Manager template](/azure/api-management/api-management-howto-use-managed-service-identity)

### Azure Container Instances

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |
| User assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Container Instances (in regions where available):

- [Azure CLI](~/articles/container-instances/container-instances-managed-identity.md)
- [Azure Resource Manager template](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-resource-manager-template)
- [YAML](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-yaml-file)

### Azure Container Registry Tasks

Managed identity type | All Generally Available<br>Global Azure Regions | Azure Government | Azure Germany | Azure China 21Vianet |
| --- | --- | --- | --- | --- |
| System assigned | Available | Not available | Not available | Not available |
| User assigned | Preview | Not available | Not available | Not available |

Refer to the following list to configure managed identity for Azure Container Registry Tasks (in regions where available):

- [Azure CLI](~/articles/container-registry/container-registry-tasks-authentication-managed-identity.md)

## Azure services that support Azure AD authentication

The following services support Azure AD authentication, and have been tested with client services that use managed identities for Azure resources.

### Azure Resource Manager

Refer to the following list to configure access to Azure Resource Manager:

- [Assign access via Azure portal](howto-assign-access-portal.md)
- [Assign access via Powershell](howto-assign-access-powershell.md)
- [Assign access via Azure CLI](howto-assign-access-CLI.md)
- [Assign access via Azure Resource Manager template](../../role-based-access-control/role-assignments-template.md)

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://management.azure.com/`| Available |
| Azure Government | `https://management.usgovcloudapi.net/` | Available |
| Azure Germany | `https://management.microsoftazure.de/` | Available |
| Azure China 21Vianet | `https://management.chinacloudapi.cn` | Available |

### Azure Key Vault

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://vault.azure.net`| Available |
| Azure Government | `https://vault.usgovcloudapi.net` | Available |
| Azure Germany |  `https://vault.microsoftazure.de` | Available |
| Azure China 21Vianet | `https://vault.azure.cn` | Available |

### Azure Data Lake 

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://datalake.azure.net/` | Available |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

### Azure SQL 

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://database.windows.net/` | Available |
| Azure Government | `https://database.usgovcloudapi.net/` | Available |
| Azure Germany | `https://database.cloudapi.de/` | Available |
| Azure China 21Vianet | `https://database.chinacloudapi.cn/` | Available |

### Azure Event Hubs

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://eventhubs.azure.net` | Preview |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

### Azure Service Bus

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://servicebus.azure.net`  | Preview |
| Azure Government |  | Not Available |
| Azure Germany |   | Not Available |
| Azure China 21Vianet |  | Not Available |

### Azure Storage blobs and queues

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://storage.azure.com/` | Available |
| Azure Government | `https://storage.azure.com/` | Available |
| Azure Germany | `https://storage.azure.com/` | Available |
| Azure China 21Vianet | `https://storage.azure.com/` | Available |

### Azure Analysis Services

| Cloud | Resource ID | Status |
|--------|------------|--------|
| Azure Global | `https://*.asazure.windows.net` | Available |
| Azure Government | `https://*.asazure.usgovcloudapi.net` | Available |
| Azure Germany | `https://*.asazure.cloudapi.de` | Available |
| Azure China 21Vianet | `https://*.asazure.chinacloudapi.cn` | Available |
