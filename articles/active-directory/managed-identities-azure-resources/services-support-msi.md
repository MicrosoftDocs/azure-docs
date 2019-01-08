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

|Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview | Preview |
| User assigned | Preview | Preview | Preview | Preview | Preview

Global Azure Regions

|Service| Managed identity type | Status | Configure | Get a token|
| --- | --- | --- | --- | --- |
| Azure Virtual Machines | System Assigned<br><br>User assigned | Available<br><br><br>Preview |  [Azure portal](qs-configure-portal-windows-vm.md)<br>[PowerShell](qs-configure-powershell-windows-vm.md)<br>[Azure CLI](qs-configure-cli-windows-vm.md)<br>[Azure Resource Manager templates](qs-configure-template-windows-vm.md)<br>[REST](qs-configure-rest-vm.md) | [REST](how-to-use-vm-token.md#get-a-token-using-http)<br>[.NET](how-to-use-vm-token.md#get-a-token-using-c)<br>[Bash/Curl](how-to-use-vm-token.md#get-a-token-using-curl)<br>[Go](how-to-use-vm-token.md#get-a-token-using-go)<br>[PowerShell](how-to-use-vm-token.md#get-a-token-using-azure-powershell)      

### Azure Virtual Machine Scale Sets

|Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Preview | Preview | Preview |
| User assigned | Preview | Preview | Preview | Preview

### Azure App Service

|Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available 

### Azure Functions

Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Preview | Not available | Not available | Not available 

### Azure Logic Apps

Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Available | Available |
| User assigned | Not available | Not available | Not available | Not available

### Azure Data Factory V2

Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Not available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available

### Azure API Management

Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Available | Available | Not available | Not available |
| User assigned | Not available | Not available | Not available | Not available

### Azure Container Instances

Managed identity type |  Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| System assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available |
| User assigned | Linux: Preview<br>Windows: Not available | Not available | Not available | Not available


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