---
title: Enable Traffic Manager metrics logging in Azure
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

# Enable Traffic Manager metrics logging in Azure

Azure Traffic Manager logging metrics can provide insight into the behavior of the Traffic Manager profile resource. For example, you can use a Traffic Manager profile's log data to determine why individual probes have timed out against an endpoint.

This articles describes how to enable metrics logging and access log data for a Traffic Manager profile.

## Enable metrics logging for a Traffic Manager profile using Azure PowerShell

1. Launch Azure Cloud Shell

    The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. Just click the **Copy** to copy the code, paste it into the Cloud Shell, and then press enter to run it. There are a few ways to launch the Cloud Shell:

    |  |   |
    |-----------------------------------------------|---|
    | Click **Try It** in the upper right corner of a code block. | ![Cloud Shell in this article](./media/cloud-shell-powershell/cloud-shell-powershell-try-it.png) |
    | Open Cloud Shell in your browser. | [![https://shell.azure.com/powershell](./media/cloud-shell-powershell/launchcloudshell.png)](https://shell.azure.com/powershell) |
    | Click the **Cloud Shell** button on the menu in the upper right of the Azure portal. | [![Cloud Shell in the portal](./media/cloud-shell-try-it/cloud-shell-menu.png)](https://portal.azure.com) |
    |  |  |

    If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 6.13.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure. 

1. Enable metrics logging using [Set-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/set-azurermdiagnosticsetting?view=latest). The following command stores verbose logs and metrics to the specified storage account. 

     ```azurepowershell-interactive
    Set-AzDiagnosticSetting -ResourceId <resourceId> -StorageAccountId <storageAccountId> -Enabled $true
     ``` 
3. Verify diagnostic settings for the Traffic Manager profile using [Get-AzureRmDiagnosticSetting](https://docs.microsoft.com/en-us/powershell/module/azurerm.insights/get-azurermdiagnosticsetting?view=latest). The following command displays the categories that are logged for a resource.

     ```azurepowershell-interactive
    Get-AzureRmDiagnosticSetting -ResourceId <resourceId>
     ```  
   Ensure that all log categories associated with the Traffic Manager profile resource display as enabled. Also, verify that the storage account is correctly set.

## Access log files for a Traffic Manager profile using the Azure portal
1. Navigate to your Azure storage account in the portal.
2. On the **Overview** page of your Azure storage account, under **Services** select **Blobs**.
3. For **Containers**, select **insights-logs-probehealthstatusevents**, and navigate down to the PT1H.json file and click **Download** to download and save a copy of this log file.

## Traffic Manager log schema
All diagnostic logs available through Azure Monitor share a common top-level schema, with flexibility for each service to emit unique properties for their own events. For top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/platform/tutorial-dashboards.md).
The following table includes logs schema specific to the Azure Traffic Manager profile resource.


|||||
|----|----|---|---|
|Field Name|Field Type|Definition|Example|
|EndpointName|String|The resource name of the endpoint the health status is being recorded for.|"myPrimaryEndpoint"|
|Status|String|The health status of the endpoint which was probed. Can either be "Up" or "Down"|"Up"|
|||||

## Next steps

* Learn more about [Traffic Manager Monitoring](traffic-manager-monitoring.md)

