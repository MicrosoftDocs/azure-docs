---
title: Azure PowerShell Script Sample - Create a web app and deploy code from a local Git repository | Microsoft Docs
description: Azure PowerShell Script Sample - Create a web app and deploy code from a local Git repository
services: app-service\web
documentationcenter: 
author: cephalin
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 5a927f23-8e70-45fd-9aae-980d4e7a007d
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: cephalin
ms.custom: mvc
---

# Create a web app and deploy code from a local Git repository

This sample script creates a web app in App Service with its related resources, and then deploys your web app code in a local Git repository.

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzureRmAccount` to create a connection with Azure. Also, your application code needs to be committed into a local Git repository.

## Sample script

[!code-powershell[main](../../../powershell_scripts/app-service/deploy-local-git/deploy-local-git.ps1?highlight=1 "Create a web app and deploy code from a local Git repository")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmAppServicePlan](/powershell/module/azurerm.websites/new-azurermappserviceplan) | Creates an App Service plan. |
| [New-AzureRmWebApp](/powershell/module/azurerm.websites/new-azurermwebapp) | Creates a web app. |
| [Set-AzureRmResource](/powershell/module/azurerm.resources/set-azurermresource) | Modifies a resource in a resource group. |
| [Get-AzureRmWebAppPublishingProfile](/powershell/module/azurerm.websites/get-azurermwebapppublishingprofile) | Get a web app's publishing profile. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../app-service-powershell-samples.md).
