---
title: Azure API Management - API version retirements (September 2023) | Microsoft Docs
description: The Azure API Management service is retiring all API versions prior to 2021-08-01. If you use one of these API versions, you must update your tools, scripts, or programs to use the latest versions.
services: api-management
documentationcenter: ''
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 07/25/2022
ms.author: danlep
---

# API version retirements (September 2023)

Azure API Management uses Azure Resource Manager (ARM) to configure your API Management instances. The API version is embedded in your use of templates that describe your infrastructure, tools that are used to configure the service, and programs that you write to manage your Azure API Management services. 

On 30 September 2023, all API versions for the Azure API Management service prior to **2021-08-01** will be retired and API calls using those API versions will fail. This means you'll no longer be able to create or manage your API Management services using your existing templates, tools, scripts, and programs until they've been updated. Data operations (such as accessing the APIs or Products configured on Azure API Management) will be unaffected by this update, including after 30 September 2023. 

From now through 30 September 2023, you can continue to use the templates, tools, and programs without impact. You can transition to API version 2021-08-01 or later at any point prior to 30 September 2023. 

## Is my service affected by this?

While your service isn't affected by this change, any tool, script, or program that uses the Azure Resource Manager (such as the Azure CLI, Azure PowerShell, Azure API Management DevOps Resource Kit, or Terraform) to interact with the API Management service is affected by this change. You'll be unable to run those tools successfully unless you update the tools.

## What is the deadline for the change?

The affected API versions will no longer be valid after 30 September 2023.

After 30 September 2023, if you prefer not to update your tools, scripts, and programs, your services will continue to run but you won't be able to add or remove APIs, change API policy, or otherwise configure your API Management service. 

## Required action

* **ARM, Bicep, or Terraform templates** - Update the template to use API version 2021-08-01 or later. 

* **Azure CLI** - Run `az version` to check your version. If you're running version 2.38.0 or later, no action is required. Use the `az upgrade` command to upgrade the Azure CLI if necessary. For more information, see [How to update the Azure CLI](/cli/azure/update-azure-cli).

* **Azure PowerShell** - Run `Get-Module -ListAvailable -Name Az` to check your version. If you're running version 8.1.0 or later, no action is required. Use `Update-Module -Name Az -Repository PSGallery` to update the module if necessary. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

* **Other tools** - Use the following versions (or later):

    * API Management DevOps Resource Kit: 1.0.0
    * Terraform azurerm provider: 3.0.0
    
* **Azure SDKs** - Update the Azure API Management SDKs to the latest versions (or later): 

    * .NET: 8.0.0 
    * Go: 1.0.0 
    * Python: 3.0.0 
    * JavaScript: 8.0.1 

## More information

* [Azure CLI](/cli/azure/update-azure-cli)
* [Azure PowerShell](/powershell/azure/install-azure-powershell)
* [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
* [Terraform on Azure](/azure/developer/terraform/)
* [Bicep](../../azure-resource-manager/bicep/overview.md)
* [Microsoft Q&A](/answers/topics/azure-api-management.html)

## Next steps

See all [upcoming breaking changes and feature retirements](overview.md).
