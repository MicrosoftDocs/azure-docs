---
title: Azure Monitor for VMs (preview) known issues | Microsoft Docs
description: This article covers known issues with Azure Monitor for VMs, a solution in Azure that combines health and performance monitoring of the Azure VM operating system. Azure Monitor for VMs also automatically discovers application components and dependencies with other resources and maps the communication between them.
services:  azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service:  azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/07/2018
ms.author: magoedte

---

# Known issues with Azure Monitor for VMs (preview)

This article covers known issues with Azure Monitor for VMs, a solution in Azure that combines health and performance monitoring of the Azure VM operating system. 

The following are known issues with the Health feature:

- The Health feature is enabled for all VMs that are connected to the Log Analytics workspace. This is so even when the action begins and ends in a single VM.
- After you disable monitoring for a VM by using the supported methods and you try deploying it again, you should deploy it in the same workspace. If you use a new workspace and try to view the health state for that VM, it might display anomalous behavior.
- If an Azure VM is removed or deleted, it's displayed in the VM list view for three to seven days. Additionally, clicking the state of a removed or deleted VM opens the **Health Diagnostics** view and then initiates a loading loop. Selecting the name of the deleted VM opens a pane with a message stating that the VM has been deleted.
- The time period and frequency of health criteria can't be modified with this release. 
- Health criteria can't be disabled. 
- After deployment, it can take time before data is displayed in the **Azure Monitor** > **Virtual Machines** > **Health** pane or the **VM resource** > **Insights** pane.
- The Health Diagnostics experience updates faster than any other view. The information might be delayed when you switch between views. 
- The Alerts summary that's included with Azure Monitor for VM displays only alerts that result from health issues that are detected with monitored Azure VMs.
- The **Alerts list** pane in the single VM and Azure Monitor displays alerts whose monitor condition is set to *fired* in the past 30 days. The alerts aren't configurable. However, after the **Alert list** pane opens, you can click the summary to change the filter value of both the monitor condition and time range.
- In the **Alerts list** pane, we recommend not modifying the **Resource type**, **Resource**, and **Monitor Service** filters. They've been configured specific to the solution. This list view displays more fields than the **Azure monitor** > **Alerts** list view does.   
- In Linux VMs, the **Health Diagnostics** view displays the entire domain name of the VM instead of the user-defined VM name.
- Shutting down VMs updates some of health criteria to *critical* and others to *healthy*. The net VM state is displayed as *critical*.
- Health alert severity can't be modified. It can only be enabled or disabled. Additionally, some severities are updated based on the state of health criteria.
- If you modify any setting of a health criterion instance, all health criteria instances of the same type on the VM are modified. For example, if the threshold of the disk free-space health criterion instance that corresponds to logical disk C: is modified, this threshold applies to all other logical disks that are discovered and monitored for the same VM.  
- Thresholds for health criteria that target a Windows VM aren’t modifiable, because their health states are set to *running* or *available*. When you query the health state from the [Workload Monitor API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/workloadmonitor/resource-manager), it displays the *comparisonOperator* value of **LessThan** or **GreaterThan** with a *threshold* value of **4** for the service or entity if:
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

- The *total CPU utilization* health criterion in Windows displays a threshold of **not equal to 4** in both the portal and the Workload Monitoring API. The threshold is reached when *total CPU utilization* is greater than 95 percent and the system queue length is greater than 15. This health criterion can't be modified in this release. 
- Configuration changes, such as updating a threshold, take up to 30 minutes even if the portal or Workload Monitor API might update them immediately. 
- Individual processor and logical processor level health criteria aren't available in Windows. Only Total CPU utilization is available for Windows VMs. 
- Alert rules that are defined for each health criterion aren't displayed in the Azure portal. You can enable or disable a health alert rule only in the [Workload Monitor API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/workloadmonitor/resource-manager). 
- You can't assign an [Azure Monitor action group](../../monitoring-and-diagnostics/monitoring-action-groups.md) for health alerts in the Azure portal. You can use only the notification setting API to configure an action group to be triggered whenever a health alert is fired. Currently, you can assign action groups against a VM so that all *health alerts* fired against the VM trigger the same action groups. Unlike traditional Azure alerts, there's no concept of a separate action group for each health alert rule. Additionally, only action groups that are configured to provide email or SMS notifications are supported when health alerts are triggered. 

## Next steps
To understand the requirements and methods for enabling monitoring of your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-onboard.md).
