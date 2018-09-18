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
ms.date: 09/18/2018
ms.author: magoedte

---

# Known issues with Azure Monitor for VMs

The following are known issues with the Health feature of Azure Monitor for VMs:

- The time period and frequency of health criteria cannot be modified with this release. This will be addressed in a future release.  
- Health criteria cannot be disabled. 
- After onboarding, it can take time before data is shown in Azure Monitor -> Virtual Machines -> Health or from the VM resource blade -> Insights
- Health Diagnostics experience updates faster than any other view, so you may experience information delays when switching between views  
- Alerts summary provided in Azure Monitor for VM Health are only for alerts fired for health issues detected with monitored Azure VMs.
- The **Alerts list** view page in the single VM and Azure Monitor shows alerts whose monitor condition is set to “fired” in past 30 days.  They are not configurable. However, after clicking on the summary, once the **Alert list** view page is launched, you can change the filter value of both the monitor condition and time range.
- On the **Alerts list** view page, we suggest you don't modify the **Resource type**, **Resource**, and **Monitor Service** filters as they have been configured specific to the solution (this list view shows some extra fields as compared to the Azure monitor -> Alerts list view).    
- In Linux VMs, **Health Diagnostics** view has the entire domain name of the VM instead of the user-defined VM name.
- Shutting down VMs will update some of its health criteria to critical state and others in healthy state with net state of the VM being critical, we are working
- Health alert severity cannot be modified, they can only be enabled or disabled.  Additionally, some severities update based on the state of health criteria.
- Modifying any setting of a health criterion instance, will lead to modification of the same setting across all the health criteria instances of the same type on the VM. For example, if the threshold of disk free space health criterion instance corresponding to logical disk C: is modified, then this threshold will apply to all other logical disks discovered and monitored for the same VM.   
- Thresholds for some Windows health criteria like DNS Client Service Health aren’t modifiable, since their healthy state is already locked to the **running**, **available** state of the service or entity depending upon the context.  Instead the value is represented by number 4, it will be converted to the actual display string in a future release.  
- Thresholds for some Linux health criteria aren’t modifiable such as Logical Disk Health, as they are already set to trigger on unhealthy state.  These indicate whether something is online/offline, or on or off, and are represented and indicate the same by showing the value 1 or 0.
- Updating the Resource group filter in any resource group while using the at scale Azure monitor -> Virtual Machines -> Health -> Any list view with preselected subscription and resource group, will cause the list view to show **no result**.  Go back to the Azure Monitor -> Virtual Machines -> Health tab and select the desired subscription and resource group, and then navigate to the list view.
