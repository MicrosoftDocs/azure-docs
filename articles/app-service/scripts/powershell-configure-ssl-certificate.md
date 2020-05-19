---
title: 'PowerShell: Upload and bind TLS/SSL'
description: Learn how to use Azure PowerShell to automate deployment and management of App Service. This sample shows how to bind a custom TLS/SSL certificate to an app.
author: msangapu-msft
tags: azure-service-management

ms.assetid: 23e83b74-614a-49a0-bc08-7542120eeec5
ms.topic: sample
ms.date: 03/20/2017
ms.custom: mvc, seodec18
---

# Bind a custom TLS/SSL certificate to a web app using PowerShell

This sample script creates a web app in App Service with its related resources, then binds the TLS/SSL certificate of a custom domain name to it. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Connect-AzAccount` to create a connection with Azure. Also, ensure that:

- A connection with Azure has been created using the `az login` command.
- You have access to your domain registrar's DNS configuration page.
- You have a valid .PFX file and its password for the TLS/SSL certificate you want to upload and bind.

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-azurepowershell-interactive[main](../../../powershell_scripts/app-service/configure-ssl-certificate/configure-ssl-certificate.ps1?highlight=1-3 "Bind a custom TLS/SSL certificate to a web app")]

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
| [Set-AzAppServicePlan](/powershell/module/az.websites/set-azappserviceplan) | Modifies an App Service plan to change its pricing tier. |
| [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp) | Modifies a web app's configuration. |
| [New-AzWebAppSSLBinding](/powershell/module/az.websites/new-azwebappsslbinding) | Creates a TLS/SSL certificate binding for a web app. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure App Service Web Apps can be found in the [Azure PowerShell samples](../samples-powershell.md).
