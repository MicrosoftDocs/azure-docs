---
title: Azure Services that support managed identities for Azure resources
description: List of services that support managed identities for Azure resources and Azure AD authentication
services: active-directory
author: daveba
ms.author: daveba
ms.date: 11/28/2018
ms.topic: conceptual
ms.service: active-directory
ms.component: msi
manager: mtillman
---

# Services that support managed identities for Azure resources

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without having credentials in your code. We are in the process of integrating managed identities for Azure resources and Azure AD authentication across Azure. Check back often for updates.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Azure services that support managed identities for Azure resources

The following Azure services support managed identities for Azure resources:

### Azure Virtual Machines

|Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview | Preview |
| User assigned | Preview | Preview | Preview | Preview | Preview

Refer to the following list to configure managed identity for Azure Virtual Machines (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)

### Azure Virtual Machine Scale Sets

|Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview |
| User assigned | Preview | Preview | Preview | Preview

Refer to the following list to configure managed identity for Azure Virtual Machine Scale Sets (in regions where available):

- [Azure portal](qs-configure-portal-windows-vm.md)
- [PowerShell](qs-configure-powershell-windows-vm.md)
- [Azure CLI](qs-configure-cli-windows-vm.md)
- [Azure Resource Manager templates](qs-configure-template-windows-vm.md)
- [REST](qs-configure-rest-vm.md)

### Azure App Service

|Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure App Service (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)

### Azure Functions

Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure Functions (in regions where available):

- [Azure portal](/azure/app-service/overview-managed-identity#using-the-azure-portal)
- [Azure CLI](/azure/app-service/overview-managed-identity#using-the-azure-cli)
- [Azure PowerShell](/azure/app-service/overview-managed-identity#using-azure-powershell)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#using-an-azure-resource-manager-template)

### Azure Logic Apps

Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Not available | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure Logic Apps (in regions where available):

- [Azure portal](/azure/logic-apps/create-managed-service-identity#azure-portal)
- [Azure Resource Manager template](/azure/app-service/overview-managed-identity#deployment-template)

### Azure Data Factory V2

Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure Data Factory V2 (in regions where available):

- [Azure portal](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity)
- [PowerShell](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-powershell)
- [REST](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-rest-api)
- [SDK](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-sdk)

### Azure API Management

Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure API Management (in regions where available):

- [Azure Resource Manager template](/azure/api-management/api-management-howto-use-managed-service-identity)

### Azure Container Instances

Managed identity type |  All Generally Available<br>Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |
| User assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available

Refer to the following list to configure managed identity for Azure Container Instances (in regions where available):

- [Azure CLI](~/articles/container-instances/container-instances-managed-identity.md)
- [Azure Resource Manager template](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-resource-manager-template)
- [YAML](~/articles/container-instances/container-instances-managed-identity.md#enable-managed-identity-using-yaml-file)


## Azure services that support Azure AD authentication

The following services support Azure AD authentication, and have been tested with client services that use managed identities for Azure resources.

| Service | Resource ID | Status | Assign access |
| ------- | ----------- | ------ | ---- | ------------- |
| Azure Resource Manager | `https://management.azure.com/` | Available | [Azure portal](howto-assign-access-portal.md) <br>[PowerShell](howto-assign-access-powershell.md) <br>[Azure CLI](howto-assign-access-CLI.md) <br>[Azure Resource Manager template](../../role-based-access-control/role-assignments-template.md) |
| Azure Key Vault | `https://vault.azure.net` | Available |  
| Azure Data Lake | `https://datalake.azure.net/` | Available |
| Azure SQL | `https://database.windows.net/` | Available |
| Azure Event Hubs | `https://eventhubs.azure.net` | Preview |
| Azure Service Bus | `https://servicebus.azure.net` | Preview |
| Azure Storage | `https://storage.azure.com/` | Preview |