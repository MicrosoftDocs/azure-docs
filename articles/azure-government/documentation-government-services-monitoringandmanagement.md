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
| VMWare/Physical  | GA | GA |
| Hyper-V | GA | GA |
| Site to Site | GA | GA |

>[!NOTE]
>Table applies to US Gov Virginia and US Gov Iowa.

The following URLs for Site Recovery are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| \*.hypervrecoverymanager.windowsazure.com | \*.hypervrecoverymanager.windowsazure.us | Access to the Site Recovery Service |
| \*.backup.windowsazure.com  | \*.backup.windowsazure.us | Access to Protection Service |
| \*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net | For storing the VM Snapshots |
| http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | http://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | To download MySQL |


## Monitor
Azure Monitor is in public preview in Azure Government.

For more information, see [Monitor commercial documentation](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview).

### Variations
The following Monitor features are not currently available in Azure Government:

* Metrics and Alerts
* Diagnostic Logs
* Autoscale
* Action Groups


## Log Analytics
Log Analytics is generally available in Azure Government.

### Variations
The following Log Analytics features and solutions are not currently available in Azure Government.

* Solutions that are in preview in Microsoft Azure, including:
  * Network Monitoring solution
  * Service Map
  * Office 365 solution
  * Windows 10 Upgrade Analytics solution
  * Application Insights solution
  * Azure Networking Analytics solution
  * Azure Automation Analytics solution
  * Key Vault Analytics solution
* Solutions and features that require updates to on-premises software, including:
  * Surface Hub solution
* Features that are in preview in public Azure, including:
  * Export of data to Power BI
* Azure metrics and Azure diagnostics
* Operations Management Suite mobile applications

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
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
