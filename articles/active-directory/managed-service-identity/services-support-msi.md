---
title: Azure Services that support Managed Service Identity
description: List of services that support Managed Service Identity and Azure AD authentication
services: active-directory
author: daveba
ms.author: daveba
ms.date: 03/28/2018
ms.topic: reference
ms.service: active-directory
manager: mtillman
---

# Services that support Managed Service Identity 

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. Using a managed identity, you can authenticate to any service that supports Azure AD authentication without having credentials in your code. We are in the process of integrating MSI and Azure AD authentication across Azure. Check back often for updates.

## Azure services that support Managed Service Identity

The following Azure services support Managed Service Identity.

| Service | Status | Date | Configure | Get a token |
| ------- | ------ | ---- | --------- | ----------- |
| Azure Virtual Machines | Preview | September 2017 | [Azure portal](qs-configure-portal-windows-vm.md)<br>[PowerShell](qs-configure-powershell-windows-vm.md)<br>[Azure CLI](qs-configure-cli-windows-vm.md)<br>[Azure Resource Manager templates](qs-configure-template-windows-vm.md) | [REST](how-to-use-vm-token.md#get-a-token-using-http)<br>[.NET](how-to-use-vm-token.md#get-a-token-using-c)<br>[Bash/Curl](how-to-use-vm-token.md#get-a-token-using-curl)<br>[Go](how-to-use-vm-token.md#get-a-token-using-go)<br>[PowerShell](how-to-use-vm-token.md#get-a-token-using-azure-powershell) |
| Azure App Service | Preview | September 2017 | [Azure portal](/azure/app-service/app-service-managed-service-identity#using-the-azure-portal)<br>[Azure Resource Manager template](/azure/app-service/app-service-managed-service-identity#using-an-azure-resource-manager-template) | [.NET](/azure/app-service/app-service-managed-service-identity#asal)<br>[REST](/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol) |
| Azure Functions | Preview | September 2017 | [Azure portal](/azure/app-service/app-service-managed-service-identity#using-the-azure-portal)<br>[Azure Resource Manager template](/azure/app-service/app-service-managed-service-identity#using-an-azure-resource-manager-template) | [.NET](/azure/app-service/app-service-managed-service-identity#asal)<br>[REST](/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol) |
| Azure Data Factory V2 | Preview | November 2017 | [Azure portal](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity)<br>[PowerShell](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-powershell)<br>[REST](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-rest-api)<br>[SDK](~/articles/data-factory/data-factory-service-identity.md#generate-service-identity-using-sdk) |
| Azure API Management | Preview | October 2017 | [Azure Resource Manager template](/azure/api-management/api-management-howto-use-managed-service-identity) |

## Azure services that support Azure AD authentication

The following services support Azure AD authentication, and have been tested with client services that use Managed Service Identity.

| Service | Resource ID | Status | Date | Assign access |
| ------- | ----------- | ------ | ---- | ------------- |
| Azure Resource Manager | https://management.azure.com | Available | September 2017 | [Azure portal](howto-assign-access-portal.md) <br>[PowerShell](howto-assign-access-powershell.md) <br>[Azure CLI](howto-assign-access-CLI.md) |
| Azure Key Vault | https://vault.azure.net | Available | September 2017 | |
| Azure Data Lake | https://datalake.azure.net | Available | September 2017 | |
| Azure SQL | https://database.windows.net | Available | October 2017 | |
| Azure Event Hubs | https://eventhubs.azure.net | Available | December 2017 | |
| Azure Service Bus | https://servicebus.azure.net | Available | December 2017 | |
