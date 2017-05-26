---
title: Azure PowerShell Script Sample - Create a web app with continuous deployment from GitHub | Microsoft Docs
description: Azure PowerShell Script Sample - Create a web app with continuous deployment from GitHub
services: app-service\web
documentationcenter: 
author: cephalin
manager: erikre
editor: 
tags: azure-service-management

ms.assetid: 42f901f8-02f7-4869-b22d-d99ef59f874c
ms.service: app-service-web
ms.workload: web
ms.devlang: na
ms.topic: article
ms.date: 03/20/2017
ms.author: cephalin
---

# Create a web app with continuous deployment from GitHub

This sample script creates a web app in App Service with its related resources, and then sets up continuous deployment from a GitHub repository. For GitHub deployment without continuous deployment, see [Create a web app and deploy code from GitHub](app-service-powershell-deploy-github.md).

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview). Also, ensure that:

- A connection with Azure has been created using the `az login` command.
- The application code is in a public or private GitHub repository that you own.
- You have [created an access token in your GitHub account](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).

## Sample script

[!code-powershell[main](../../../powershell_scripts/app-service/deploy-github-continuous/deploy-github-continuous.ps1?highlight=1-2 "Create a web app with continuous deployment from GitHub")]

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

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../app-service-powershell-samples.md).
