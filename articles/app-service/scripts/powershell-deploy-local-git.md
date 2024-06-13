---
title: 'PowerShell: Deploy from local Git repo'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to deploy code from a local Git repository.
tags: azure-service-management

ms.assetid: 5a927f23-8e70-45fd-9aae-980d4e7a007d
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
---

# Create a web app and deploy code from a local Git repository

This sample script creates a web app in App Service with its related resources, and then deploys your web app code from a local Git repository.

If needed, update to the latest Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure. Also, your application code needs to be committed into a local Git repository.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/deploy-local-git/deploy-local-git.ps1?highlight=1 "Create a web app and deploy code from a local Git repository")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name $webappname -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app with necessary resource group and App Service group. When the current directory contains a Git repository, also add an `azure` remote. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource in a resource group. |
| [Get-AzWebAppPublishingProfile](/powershell/module/az.websites/get-azwebapppublishingprofile) | Get a web app's publishing profile. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
