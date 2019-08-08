---
title: Enable diagnostic logging in Azure Traffic Manager
description: Learn how to enable diagnostic logging for your Traffic Manager profile and access the log files that are created as a result.
services: traffic-manager
author: asudbring
manager: twooley
ms.service: traffic-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/25/2019
ms.author: allensu
---

# Enable diagnostic logging in Azure Traffic Manager

This article describes how to enable diagnostic logging and access log data for a Traffic Manager profile.

Azure Traffic Manager diagnostic logs can provide insight into the behavior of the Traffic Manager profile resource. For example, you can use the profile's log data to determine why individual probes have timed out against an endpoint.

## Enable diagnostic logging

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can run the commands that follow in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell. It has common Azure tools preinstalled and configured to use with your account. 
If you run PowerShell from your computer, you need the Azure PowerShell module, 1.0.0 or later. You can run `Get-Module -ListAvailable Az` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to sign in to Azure.

1. **Retrieve the Traffic Manager profile:**

    To enable diagnostic logging, you need the ID of a Traffic Manager profile. Retrieve the Traffic Manager profile that you want to enable diagnostic logging for with [Get-AzTrafficManagerProfile](/powershell/module/az.TrafficManager/Get-azTrafficManagerProfile). The output includes the Traffic Manager profile's ID information.

    ```azurepowershell-interactive
    Get-AzTrafficManagerProfile -Name <TrafficManagerprofilename> -ResourceGroupName <resourcegroupname>
    ```

2. **Enable diagnostic logging for the Traffic Manager profile:**

    Enable diagnostic logging for the Traffic Manager profile using the ID obtained in the previous step with [Set-AzDiagnosticSetting](https://docs.microsoft.com/powershell/module/az.monitor/set-azdiagnosticsetting?view=latest). The following command stores verbose logs for the Traffic Manager profile to a specified Azure Storage account. 

      ```azurepowershell-interactive
    Set-AzDiagnosticSetting -ResourceId <TrafficManagerprofileResourceId> -StorageAccountId <storageAccountId> -Enabled $true
      ``` 
3. **Verify diagnostic settings:**

      Verify diagnostic settings for the Traffic Manager profile using [Get-AzDiagnosticSetting](https://docs.microsoft.com/powershell/module/az.monitor/get-azdiagnosticsetting?view=latest). The following command displays the categories that are logged for a resource.

     ```azurepowershell-interactive
     Get-AzDiagnosticSetting -ResourceId <TrafficManagerprofileResourceId>
     ```  
      Ensure that all log categories associated with the Traffic Manager profile resource display as enabled. Also, verify that the storage account is correctly set.

## Access log files
1. Sign in to the [Azure portal](https://portal.azure.com). 
1. Navigate to your Azure Storage account in the portal.
2. On the **Overview** page of your Azure storage account, under **Services** select **Blobs**.
3. For **Containers**, select **insights-logs-probehealthstatusevents**, and navigate down to the PT1H.json file and click **Download** to download and save a copy of this log file.

    ![Access log files of your Traffic Manager profile from a blob storage](./media/traffic-manager-logs/traffic-manager-logs.png)


## Traffic Manager log schema

All diagnostic logs available through Azure Monitor share a common top-level schema, with flexibility for each service to emit unique properties for their own events. 
For top-level diagnostic logs schema, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../azure-monitor/platform/tutorial-dashboards.md).

The following table includes logs schema specific to the Azure Traffic Manager profile resource.

|||||
|----|----|---|---|
|**Field Name**|**Field Type**|**Definition**|**Example**|
|EndpointName|String|The name of the Traffic Manager endpoint whose health status is being recorded.|*myPrimaryEndpoint*|
|Status|String|The health status of the Traffic Manager endpoint that was probed. The status can either be **Up** or **Down**.|**Up**|
|||||

## Next steps

* Learn more about [Traffic Manager Monitoring](traffic-manager-monitoring.md)

