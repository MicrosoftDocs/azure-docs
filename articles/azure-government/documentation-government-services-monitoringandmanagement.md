---
title: Azure Government Monitoring + Management | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 4/25/2017
ms.author: magoedte; ryansoc

---
# Azure Government Monitoring + Management
This article outlines the monitoring and management services variations and considerations for the Azure Government environment.

## Automation
Automation is generally available in Azure Government.
For more information, see [Automation public documentation](../automation/automation-intro.md).

## Backup
Backup is generally available in Azure Government.

For more information, see [Azure Government Backup](documentation-government-services-backup.md).

## Resource Policy

[Azure resource policies](../azure-resource-manager/resource-manager-policy.md) are not available in Azure Government.

## Site Recovery
Azure Site Recovery is generally available in Azure Government.

For more information, see [Site Recovery commercial documentation](../site-recovery/site-recovery-overview.md).

### Variations
The following Site Recovery features are not currently available in Azure Government:
* Email notification

| Site Recovery | Classic | Resource Manager |
| --- | --- | --- |
| VMWare/Physical  | GA | GA |
| Hyper-V | GA | GA |
| Site to Site | GA | GA |

The following URLs for Site Recovery are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| \*.hypervrecoverymanager.windowsazure.com | \*.hypervrecoverymanager.windowsazure.us | Access to the Site Recovery Service |
| \*.backup.windowsazure.com  | \*.backup.windowsazure.us | Access to Protection Service |
| \*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net | For storing the VM Snapshots |
| http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | To download MySQL |

## Monitor
Azure Monitor is generally available in Azure Government.

For more information, see [Monitor commercial documentation](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview).

### Variations
The following sections detail differences and workarounds for features of Azure Monitor in Azure Government:

#### Action Groups 
Action Groups do not support SMS at this time but will in a coming update.    

#### Activity Log Alerts
Activity Log Alerts are generally available in Azure Government with no differences from commercial Azure.

#### Autoscale
<aside class="warning">
Autoscale via the portal is not currently available. This feature is coming soon.  
</aside>

In the meantime, please use PowerShell/ARM/Rest calls to specify the settings. You will need to set the "Location" of the Autoscale to USGov Virginia or USGov Iowa. The resource targetted by Autoscale can exist in any region. An example of the setting is below:

```PowerShell
$rule1 = New-AzureRmAutoscaleRule -MetricName "Requests" -MetricResourceId "/subscriptions/S1/resourceGroups/RG1/providers/Microsoft.Web/sites/WebSite1" -Operator GreaterThan -MetricStatistic Average -Threshold 10 -TimeGrain 00:01:00 -ScaleActionCooldown 00:05:00 -ScaleActionDirection Increase -ScaleActionScaleType ChangeCount -ScaleActionValue "1" 
$rule2 = New-AzureRmAutoscaleRule -MetricName "Requests" -MetricResourceId "/subscriptions/S1/resourceGroups/RG1/providers/Microsoft.Web/sites/WebSite1" -Operator GreaterThan -MetricStatistic Average -Threshold 10 -TimeGrain 00:01:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Increase -ScaleActionScaleType ChangeCount -ScaleActionValue "2"
$profile1 = New-AzureRmAutoscaleProfile -DefaultCapacity 2 -MaximumCapacity 10 -MinimumCapacity 2 -Rules $rule1, $rule2 -Name "MyProfile"
$webhook_scale = New-AzureRmAutoscaleWebhook -ServiceUri https://example.com?mytoken=mytokenvalue
$notification1= New-AzureRmAutoscaleNotification -CustomEmails myname@company.com -SendEmailToSubscriptionAdministrator -SendEmailToSubscriptionCoAdministrators -Webhooks $webhook_scale
Add-AzureRmAutoscaleSetting -Location "USGov Virginia" -Name "MyScaleVMSSSetting" -ResourceGroup sdubeys-usgv -TargetResourceId /subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Web/serverFarms/ServerFarm1 -AutoscaleProfiles $profile1 -Notifications $notification1
```

If you are interested in implementing autoscale on your resources, please use PowerShell/ARM/Rest calls to specify the settings. 

For more information on using PowerShell, please see [public documentation](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/insights-powershell-samples#create-and-manage-autoscale-settings).

#### Diagnostic Logs
Diagnostic Logs are generally available in Azure Government with no differences from commercial Azure.

#### Metrics
Metrics are supported in all regions, but only for services which are available in Azure Government; a few exceptions are below:

* Coming Soon: Azure IoT Hub

The same methods for viewing the metrics that are used in commercial Azure are used in Azure Government. 

#### Metric Alerts 
<aside class="warning">
Creating Metric Alerts for resources outside of USGov Virginia and USGov Iowa in the portal will fail. A fix for this issue is in progress. 
</aside>

In the meantime, please use PowerShell/ARM/Rest calls to specify the settings. You will need to set the "Location" of the metric alert to USGov Virginia or USGov Iowa. The resource targetted by the alert can exist in any region. An example of the setting is below:

```PowerShell
$actionEmail = New-AzureRmAlertRuleEmail -CustomEmail myname@company.com 
$actionWebhook = New-AzureRmAlertRuleWebhook -ServiceUri https://example.com?token=mytoken 
Add-AzureRmMetricAlertRule -Name vmcpu_gt_1 -Location "USGov Virginia" -ResourceGroup myrg1 -TargetResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.ClassicCompute/virtualMachines/my_vm1 -MetricName "Percentage CPU" -Operator GreaterThan -Threshold 1 -WindowSize 00:05:00 -TimeAggregationOperator Average -Actions $actionEmail, $actionWebhook -Description "alert on CPU > 1%" 
```

For more information on using PowerShell, please see [public documentation](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-powershell-samples#create-alert-rules).

## Log Analytics
Log Analytics is generally available in Azure Government.

### Variations
The following Log Analytics features and solutions are not currently available in Azure Government.

* Solutions that are in preview in Microsoft Azure, including:
  * Service Map
  * Windows 10 Upgrade Analytics solution
  * Application Insights solution
  * Azure Networking Security Group Analytics solution
  * Azure Automation Analytics solution
  * Key Vault Analytics solution
* Solutions and features that require updates to on-premises software, including:
  * Surface Hub solution
* Features that are in preview in public Azure, including:
  * Export of data to Power BI
* Azure metrics and Azure diagnostics
* Operations Management Suite mobile application

The URLs for Log Analytics are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| mms.microsoft.com |oms.microsoft.us |Log Analytics portal |
| *workspaceId*.ods.opinsights.azure.com |*workspaceId*.ods.opinsights.azure.us |[Data collector API](../log-analytics/log-analytics-data-collector-api.md) |
| \*.ods.opinsights.azure.com |\*.ods.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.oms.opinsights.azure.com |\*.oms.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.blob.core.windows.net |\*.blob.core.usgovcloudapi.net |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |

The following Log Analytics features behave differently in Azure Government:

* To connect your System Center Operations Manager management server to Log Analytics, you need to download and import updated management packs.
  + System Center Operations Manager 2016
    1. Install [Update Rollup 2 for System Center Operations Manager 2016](https://support.microsoft.com/help/3209591).
    2. Import the management packs included as part of Update Rollup 2 into Operations Manager. For information about how to import a management pack from a disk, see [How to Import an Operations Manager Management Pack](http://technet.microsoft.com/library/hh212691.aspx).
    3. To connect Operations Manager to Log Analytics, follow the steps in [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md).
  + System Center Operations Manager 2012 R2 UR3 (or later) / Operations Manager 2012 SP1 UR7 (or later)
    1. Download and save the [updated management packs](http://go.microsoft.com/fwlink/?LinkId=828749).
    2. Unzip the file that you downloaded.
    3. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see [How to Import an Operations Manager Management Pack](http://technet.microsoft.com/library/hh212691.aspx).
    4. To connect Operations Manager to Log Analytics, follow the steps in [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md).
  
* To use [computer groups from System Center Configuration Manager 2016](../log-analytics/log-analytics-sccm.md), you need to be using [Technical Preview 1701](https://docs.microsoft.com/en-us/sccm/core/get-started/technical-preview) or later.

### Frequently asked questions
* Can I migrate data from Log Analytics in Microsoft Azure to Azure Government?
  * No. It is not possible to move data or your workspace from Microsoft Azure to Azure Government.
* Can I switch between Microsoft Azure and Azure Government workspaces from the Operations Management Suite Log Analytics portal?
  * No. The portals for Microsoft Azure and Azure Government are separate and do not share information.

For more information, see [Log Analytics public documentation](../log-analytics/log-analytics-overview.md).

## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
