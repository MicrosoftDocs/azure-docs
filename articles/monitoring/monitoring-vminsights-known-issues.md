---
title: Azure Monitor for VMs Known Issues | Microsoft Docs
description: Azure Monitor for VMs is a solution in Azure that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article covers known issues.
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
ms.date: 10/03/2018
ms.author: magoedte

---

# Known issues with Azure Monitor for VMs

The following are known issues with the Health feature of Azure Monitor for VMs:

- If an Azure VM doesn’t exist any more because it was removed or deleted, it will show up in the VM list view for three to seven days. Additionally, clicking on the state of a removed or deleted VM would launch the **Health Diagnostics** view for it, which then goes into a loading loop. Selecting the name of a deleted VM launches a blade with a message stating the VM has been deleted.
- The time period and frequency of health criteria cannot be modified with this release. 
- Health criteria cannot be disabled. 
- After onboarding, it can take time before data is shown in Azure Monitor -> Virtual Machines -> Health or from the VM resource blade -> Insights
- Health Diagnostics experience updates faster than any other view, so you may experience information delays when switching between views  
- Alerts summary provided in Azure Monitor for VM Health are only for alerts fired for health issues detected with monitored Azure VMs.
- The **Alerts list** view page in the single VM and Azure Monitor shows alerts whose monitor condition is set to “fired” in past 30 days.  They are not configurable. However, after clicking on the summary, once the **Alert list** view page is launched, you can change the filter value of both the monitor condition and time range.
- On the **Alerts list** view page, we suggest you don't modify the **Resource type**, **Resource**, and **Monitor Service** filters as they have been configured specific to the solution (this list view shows some extra fields as compared to the Azure monitor -> Alerts list view).    
- In Linux VMs, **Health Diagnostics** view has the entire domain name of the VM instead of the user-defined VM name.
- Shutting down VMs will update some of its health criteria to a critical state and others to a healthy state with net state of the VM in a critical state.
- Health alert severity cannot be modified, they can only be enabled or disabled.  Additionally, some severities update based on the state of health criteria.
- Modifying any setting of a health criterion instance, will lead to modification of the same setting across all the health criteria instances of the same type on the VM. For example, if the threshold of disk free space health criterion instance corresponding to logical disk C: is modified, then this threshold will apply to all other logical disks discovered and monitored for the same VM.   
- Thresholds for the following health criteria targeting a Windows VM aren’t modifiable, since their healthy state are already set to **running** or **available**. When queried from the [Workload Monitor API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/workloadmonitor/resource-manager), the health state shows the *comparisonOperator* value of **LessThan** or **GreaterThan** with a *threshold* value of **4** for the service or entity if:
   - DNS Client Service Health – Service is not running 
   - DHCP client service health – Service is not running 
   - RPC Service Health – Service is not running 
   - Windows firewall service health – Service is not running
   - Windows event log service health – Service is not running 
   - Server service health – Service is not running 
   - Windows  remote management service health – Service is not running 
   - File system error or corruption – Logical Disk is unavailable

- Thresholds for the following Linux health criteria aren’t modifiable, since their health state are already set to **true**.  The health state shows the *comparisonOperator* with a value **LessThan** and *threshold* value of **1** when queried from the Workload Monitoring API for the entity depending on its context:
   - Logical Disk Status – Logical disk is not online/ available
   - Disk Status – Disk is not online/ available
   - Network Adapter Status -  Network adapter is disabled  

- **Total CPU Utilization** health criterion in Windows shows a threshold of **not equal to 4** from the portal and when queried from the Workload Monitoring API when CPU Utilization is greater than 95% and system queue length is larger than 15. This health criterion cannot be modified in this release.  
- Configuration changes, such as updating a threshold, takes up to 30 minutes to take effect even though the portal or Workload Monitor API might update immediately.  
- Individual processor and logical processor level health criteria are not available in Windows, only **Total CPU utilization** is available for Windows VMs.  
- Alert rules defined for each health criterion aren't exposed in the Azure portal. They are only configurable from the [Workload Monitor API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/workloadmonitor/resource-manager) to enable or disable a health alert rule.  
- Assigning an [Azure Monitor action group](../monitoring-and-diagnostics/monitoring-action-groups.md) for health alerts isn’t possible from the Azure portal. You have to use the notification setting API to configure an action group to be triggered whenever a health alert is fired. Currently, action groups can be assigned against a VM, such that all *health alerts* fired against the VM triggered the same action group(s). There is no concept of a separate action group for every health alert rule, like traditional Azure alerts. Additionally, only action groups configured to notify by sending an email or SMS are supported when health alerts are triggered. 

## Next steps
Review [Onboard Azure Monitor for VMs](monitoring-vminsights-onboard.md) to understand requirements and methods to enable monitoring of your virtual machines.