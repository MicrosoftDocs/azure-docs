---
title: What is Azure Monitor for VMs?
description: Overview of Azure Monitor for VMs which monitors the health and performance of the Azure VMs in addition to automatically discovering and mapping application components and their dependencies. 
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2020

---

# What is Azure Monitor for VMs?

Azure Monitor for VMs monitors the performance and health of your virtual machines and virtual machine scale sets, including their running processes and dependencies on other resources. It can help deliver predictable performance and availability of vital applications by identifying performance bottlenecks and network issues and can also help you understand whether an issue is related to other dependencies.

Azure Monitor for VMs supports Windows and Linux operating systems on the following:

- Azure virtual machines
- Azure virtual machine scale sets
- Hybrid virtual machines connected with Azure Arc
- On-premises virtual machines
- Virtual machines hosted in another cloud environment
  


>[!NOTE]
>We recently [announced changes](https://azure.microsoft.com/updates/updates-to-azure-monitor-for-virtual-machines-preview-before-general-availability-release/
) we are making to the Health feature based on the feedback we have received from our public preview customers. Given the number of changes we will be making, we are going to stop offering the Health feature for new customers. Existing customers can continue to use the health feature. For more details, please refer to our [General Availability FAQ](vminsights-ga-release-faq.md).  


Azure Monitor for VMs stores its data in Azure Monitor Logs which allows it to deliver powerful aggregation and filtering and to analyze data trends over time. You can view this data in a single VM from the virtual machine directly, or you can use Azure Monitor to deliver an aggregated view of multiple VMs.

![Virtual machine insights perspective in the Azure portal](media/vminsights-overview/vminsights-azmon-directvm.png)


## Pricing
There is no direct cost for Azure Monitor for VMs, but you are charged for its activity in the Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), Azure Monitor for VMs is billed for:

- Data ingested from agents and stored in the workspace.
- Alert rules based on log and health data.
- Notifications sent from alert rules.

The log size varies by the string lengths of performance counters, and it can increase with the number of logical disks and network adapters allocated to the VM. If you're already using Service Map, the only change you'll see is the additional connection data that's sent to Azure Monitor.​


## Configuring Azure Monitor for VMs
The steps to configure Azure Monitor for VMs are as follows. Follow each link for detailed guidance on each step:

- [Create Log Analytics workspace.](vminsights-configure-workspace.md#create-log-analytics-workspace)
- [Add VMInsights solution to workspace.](vminsights-configure-workspace.md#add-vminsights-solution-to-workspace)
- [Install agents on VM and VMSS to be monitored.](vminsights-enable-overview.md)

## Role-based access control

To enable and access the features in Azure Monitor for VMs, you must have the [Log Analytics contributor role](../platform/manage-access.md#manage-access-using-azure-permissions) in the workspace. To view performance, health, and map data, you must have the [monitoring reader role](../platform/roles-permissions-security.md#built-in-monitoring-roles) for the Azure VM.

For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../../azure-monitor/platform/manage-access.md).



 see [access modes overview](../platform/design-logs-deployment.md#access-mode).


## Next steps

To understand the requirements and methods that help you monitor your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-enable-overview.md).

