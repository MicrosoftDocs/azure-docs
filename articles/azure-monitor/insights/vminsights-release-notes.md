---
title: Azure Monitor for VMs (preview) release notes | Microsoft Docs
description: This article contains the release notes for Azure Monitor for VMs, a solution in Azure that combines health and performance monitoring of the Azure VM operating system. 
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/07/2019
ms.author: magoedte
---

# Microsoft Azure Monitor for VMs release notes (preview)

This article contains the release notes for Azure Monitor for VMs (preview) release, a solution in Azure that combines health and performance monitoring of the Azure VM operating system. 

## New
- The Health feature is enabled for all VMs that are connected to the Log Analytics workspace. Even when the action is initiated for a single VM.
- For Linux VMs, the title of the page listing the health criteria for a single VM view has the entire domain name of the VM instead of the user-defined VM name.  
- After you disable monitoring for a VM by using the supported methods and you try deploying it again, you should deploy it in the same workspace. If you use a new workspace and try to view the health state for that VM, it might show inconsistent behavior.
- The time period and frequency of health criteria can't be modified with this release. 
- Health criteria can't be disabled. 
- After deployment, it can take time before data is displayed in the **Azure Monitor** > **Virtual Machines** > **Health** pane or the **VM resource** > **Insights** pane.
- The Alerts summary included with Azure Monitor for VM only displays alerts that result from health issues detected with monitored Azure VMs.
- Health alert severity cannot be modified, they can only be enabled or disabled. Additionally, some alert severities update based on the state of health criteria.   
- If you modify any setting of a health criterion instance, all health criteria instances of the same type on the VM are modified. For example, if the threshold of the disk free-space health criterion instance that corresponds to logical disk C: is modified, this threshold applies to all other logical disks that are discovered and monitored for the same VM.  
- Thresholds for health criteria that target a Windows VM aren’t modifiable, because their health states are set to *running* or *available*. When you query the health state from the [Workload Monitor API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components), it displays the *comparisonOperator* value of **LessThan** or **GreaterThan** with a *threshold* value of **4** for the service or entity if:
   - DNS Client Service Health – Service isn't running. 
   - DHCP client service health – Service isn't running. 
   - RPC Service Health – Service isn't running. 
   - Windows firewall service health – Service isn't running.
   - Windows event log service health – Service isn't running. 
   - Server service health – Service isn't running. 
   - Windows remote management service health – Service isn't running. 
   - File system error or corruption – Logical Disk is unavailable.

- Thresholds for the following Linux health criteria aren’t modifiable, because their health state is already set to *true*. The health state displays the *comparisonOperator* with a value **LessThan** and *threshold* value of **1** when queried from the Workload Monitoring API for the entity, depending on its context:
   - Logical Disk Status – Logical disk isn't online/ available
   - Disk Status – Disk isn't online/ available
   - Network Adapter Status -  Network adapter is disabled  

- Individual processor and logical processor level health criteria aren't available in Windows. Only Total CPU utilization is available for a Windows VM. 
- Alert rules that are defined for each health criterion aren't displayed in the Azure portal. You can enable or disable a health alert rule only in the [Workload Monitor API](https://docs.microsoft.com/rest/api/monitor/microsoft.workloadmonitor/components). 
- You can't assign an [Azure Monitor action group](../../azure-monitor/platform/action-groups.md) for health alerts in the Azure portal. You can use only the notification setting API to configure an action group to be triggered whenever a health alert is fired. Currently, you can assign action groups against a VM so that all *health alerts* fired against the VM trigger the same action groups. Unlike traditional Azure alerts, there's no concept of a separate action group for each health alert rule. Additionally, only action groups that are configured to provide email or SMS notifications are supported when health alerts are triggered. 

## Known issues

- If an Azure VM is removed or deleted, it's displayed in the VM list view for sometime. Additionally, clicking the state of a removed or deleted VM opens the **Health Diagnostics** view and then initiates a loading loop. Selecting the name of the deleted VM opens a pane with a message stating that the VM has been deleted.
- Configuration changes, such as updating a threshold, take up to 30 minutes even if the portal or Workload Monitor API might update them immediately. 
- The Health Diagnostics experience updates faster than the other views. The information might be delayed when you switch between them. 
- Shutting down VMs updates some of health criteria to *critical* and others to *healthy*. The net VM state is displayed as *critical*.

## Next steps
To understand the requirements and methods for enabling monitoring of your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-onboard.md).
