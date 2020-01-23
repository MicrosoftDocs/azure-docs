---
title: 'PowerShell: Deploy continuously from GitHub'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to create an app with CI/CD from GitHub.
tags: azure-service-management

ms.assetid: 42f901f8-02f7-4869-b22d-d99ef59f874c
ms.topic: sample
ms.date: 03/20/2017
ms.custom: mvc
---

# Create a web app with continuous deployment from GitHub

This sample script creates a web app in App Service with its related resources, and then sets up [continuous deployment](../deploy-continuous-deployment.md) from a GitHub repository. For GitHub deployment without continuous deployment, see [Create a web app and deploy code from GitHub](powershell-deploy-github.md).

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure. Also, ensure that:

- The application code is in a public or private GitHub repository that you own. To get automatic builds, structure your repository according to the [Prepare your repository](../deploy-continuous-deployment.md#prepare-your-repository) table.
- You have [created a personal access token in your GitHub account](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/deploy-github-continuous/deploy-github-continuous.ps1?highlight=1-2 "Create a web app with continuous deployment from GitHub")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, web app, and all related resources.

```powershell
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) | Creates an App Service plan. |
| [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) | Creates a web app. |
| [Set-AzResource](/powershell/module/az.resources/set-azresource) | Modifies a resource in a resource group. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
