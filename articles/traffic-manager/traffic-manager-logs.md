---
title: How to access Traffic Manager log files
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

# How to access Traffic Manager log files
This articles provides instructions to enable creation of logs for a given resource. The logs created for the resource can be used for getting insight into the behaviour of a given resource. For example, it can be used to determine why individual probes have timed out against an endpoint.
You can access Traffic Manager logs using Azure PowerShell. The procedure procedure described below requires you to use AzureRM PowerShell module version 6.13.1 or later. 
1.	To find the installed version, run `Get-Module -ListAvailable AzureRM`. For installation or upgrade information, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps).
After installing or upgrading the Azure PowerShell module, run the [Connect-AzureRmAccount](https://docs.microsoft.com/en-us/powershell/module/azurerm.profile/connect-azurermaccount?view=latest) command to create a connection with Azure.
1. Configure the diagnostic settings for Traffic Manager using the following commands: 
    1. Use the [Set-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/set-azurermdiagnosticsetting?view=latest) command to enables log category for the particular resource. The logs and metrics are stored in the specified storage account. 

    ```azurepowershell-interactive
    Set-AzureRmDiagnosticSetting -ResourceId <resourceId> -StorageAccountId <storageAccountId> -Enabled $true
    ``` 
    This stores verbose logs into the specified storage account. 
 
    2. Use the [Get-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/get-azurermdiagnosticsetting?view=latest) command to get the categories that are logged for a resource.

    ```azurepowershell-interactive
    Get-AzureRmDiagnosticSetting -ResourceId <resourceId>
    ```  
    Ensure that all log categories associated with Traffic Manager resources are displayed enabled and that the storage account is correctly set.


## Next steps

* [Traffic Manager Monitoring](traffic-manager-monitoring.md)

