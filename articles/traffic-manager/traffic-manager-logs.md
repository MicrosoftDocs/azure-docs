---
title: Enable Traffic Manager metrics logging using Azure PowerShell
description: This article will help you access your Traffic Manager log files.
services: traffic-manager
author: KumudD
manager: twooley
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/22/2019
ms.author: kumud
---

# Enable Traffic Manager resource metrics logging using AzurePowerShell

This article provides instructions to enable metrics logging for a Traffic Manager profile resource using Azure PowerShell. The logs created for the resource can then be used to get insight its behavior. For example, you can use a Traffic Manager profile's log data to determine why individual probes have timed out against an endpoint.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 6.13.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure. 

2. Log in to an Azure account using [Connect-AzureRMAccount](/powershell/module/azurerm.profile/connect-azurermaccount).

 ```azurepowershell-interactive
    Connect-AzureRMAccount
 ``` 

1. Enable metrics logging using [Set-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/set-azurermdiagnosticsetting?view=latest). The following command stores verbose logs and metrics to the specified storage account. 

 ```azurepowershell-interactive
    Set-AzDiagnosticSetting -ResourceId <resourceId> -StorageAccountId <storageAccountId> -Enabled $true
 ``` 
 3. Verify diagnostic settings for the Traffic Manager profile using [Get-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/get-azurermdiagnosticsetting?view=latest). The following command displays the categories that are logged for a resource.

 ```azurepowershell-interactive
    Get-AzureRmDiagnosticSetting -ResourceId <resourceId>
 ```  
 4. Ensure that all log categories associated with the Traffic Manager profile resource display as enabled. Also, verify that the storage account is correctly set.

## Next steps

* Learn more about [Traffic Manager Monitoring](traffic-manager-monitoring.md)

