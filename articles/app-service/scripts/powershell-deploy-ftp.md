---
title: 'PowerShell: Upload files using FTP'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to upload files to an app using FTP.
tags: azure-service-management

ms.assetid: b7d46d6f-44fd-454c-8008-87dab6eefbc1
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
---

# Upload files to a web app using FTP

This sample script creates a web app in App Service with its related resources, and then deploys a file to it using FTPS (via [System.Net.FtpWebRequest](/dotnet/api/system.net.ftpwebrequest)).

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/), and then run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/deploy-ftp/deploy-ftp.ps1?highlight=1 "Upload files to a web app using FTP")]

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
| [Get-AzWebAppPublishingProfile](/powershell/module/az.websites/get-azwebapppublishingprofile) | Get a web app's publishing profile. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
