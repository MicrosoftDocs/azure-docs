---
title: Azure API Management - API version retirements (June 2024) | Microsoft Docs
description: Starting June 1, 2024, the Azure API Management service is retiring all API versions prior to 2021-08-01. If you use one of these API versions, you must update affected tools, scripts, or programs to use the latest versions.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 04/26/2024
ms.author: danlep
---

# API version retirements (June 2024)

[!INCLUDE [api-management-availability-premium-dev-standard-basic-consumption](../../../includes/api-management-availability-premium-dev-standard-basic-consumption.md)]

Azure API Management uses Azure Resource Manager (ARM) to configure your API Management instances. The API version is embedded in your use of templates that describe your infrastructure, tools that are used to configure the service, and programs that you write to manage your Azure API Management services. 

Starting June 1, 2024, all API versions for the Azure API Management service prior to [**2021-08-01**](/rest/api/apimanagement/operation-groups?view=rest-apimanagement-2021-08-01) are being retired (disabled). The previously communicated retirement date was September 30, 2023. At any time after June 1, 2024, API calls using an API version prior to 2021-08-01 may fail without further notice. You'll no longer be able to create or manage your API Management services with existing templates, tools, scripts, and programs using a retired API version until they've been updated to use API version 2021-08-01 or later. Data plane operations (such as mediating API requests in the gateway) will be unaffected by this update, including after June 1, 2024.

## Is my service affected by this?

While your service isn't affected by this change, any tool, script, or program that uses the Azure Resource Manager (such as the Azure CLI, Azure PowerShell, Azure API Management DevOps Resource Kit, or Terraform) to interact with the API Management service and calls an API Management API version prior to 2021-08-01 is affected by this change. After an API version is retired, you'll be unable to run any affected tools successfully unless you update the tools.

## What is the deadline for the change?

The affected API versions will be retired gradually starting June 1, 2024.

After an API version is retired, if you prefer not to update your affected tools, scripts, and programs, your services will continue to run. However, you won't be able to add or remove APIs, change API policy, or otherwise configure your API Management service with affected tools. 

## Required action

Update your tools, scripts, and programs using the details in the following section. 

We also recommend setting the **Minimum API version** in your API Management instance.

### Update your tools, scripts, and programs

* **ARM, Bicep, or Terraform templates** - Update the template to use API version 2021-08-01 or later. 

* **Azure CLI** - Run `az version` to check your version. If you're running version 2.42.0 or later, no action is required. Use the `az upgrade` command to upgrade the Azure CLI if necessary. For more information, see [How to update the Azure CLI](/cli/azure/update-azure-cli).

* **Azure PowerShell** - Run `Get-Module -ListAvailable -Name Az` to check your version. If you're running version 8.1.0 or later, no action is required. Use `Update-Module -Name Az -Repository PSGallery` to update the module if necessary. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell).

* **Other tools** - Use the following versions (or later):

    * API Management DevOps Resource Kit: 1.0.0
    * Terraform azurerm provider: 3.0.0
    
* **Azure SDKs** - Update the Azure API Management SDKs to the latest versions or at least the following versions: 
    * .NET: v1.1.0 
    * Go: 1.0.0 
    * Python: 3.0.0 
   - JavaScript: 8.0.1 
   - Java: 1.0.0-beta3

### Update Minimum API version setting on your API Management instance

We recommend setting the **Minimum API version** for your API Management instance using the Azure portal or using the REST API or other tools. This setting limits control plane API calls to your instance to an API version equal to or newer than this value. By setting this value to **2021-08-01**, you can assess the impact of the API version retirements on your tooling.



To set the **Minimum API version** in the portal:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Deployment + infrastructure**, select **Management API**.
1. Select the **Management API settings** tab.
1. Under **Enforce minimum API version**, select **Yes**. The **Minimum API version** appears.
1. Select **Save**.

> [!IMPORTANT]
> If the **Minimum API version** in the portal is grayed out, you can only update the setting programmatically, for example, using the [REST API](/rest/api/apimanagement/api-management-service/update?view=rest-apimanagement-2022-08-01) or the [az apim update](/cli/azure/apim#az-apim-update) command in the Azure CLI.
   
## More information

* [Supported API Management API versions](/rest/api/apimanagement/operation-groups)
* [Azure CLI](/cli/azure/update-azure-cli)
* [Azure PowerShell](/powershell/azure/install-azure-powershell)
* [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
* [Terraform on Azure](/azure/developer/terraform/)
* [Bicep](../../azure-resource-manager/bicep/overview.md)
* [Microsoft Q&A](/answers/topics/azure-api-management.html)

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
