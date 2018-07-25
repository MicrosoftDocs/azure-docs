---
title: Handling maintenance notifications for Virtual Machine Scale Sets in Azure | Microsoft Docs
description: View maintenance notifications for Virtual Machine Scale Sets in Azure and start self-service maintenance.
services: virtual-machine-scale-sets
documentationcenter: ''
author: shants123
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/09/2018
ms.author: shants

--- 


# Handling planned maintenance notifications for Virtual Machine Scale Sets

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. Updates are changes like patching the hosting environment or upgrading and decommissioning hardware. A majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated. These non-rebootful maintenance operations are applied fault domain by fault domain, and progress is stopped if any warning health signals are received.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you are given a time window where you can start the maintenance yourself, when it works for you.


Planned maintenance that requires a reboot, is scheduled in waves. Each wave has different scope (regions).

- A wave starts with a notification to customers. By default, notification is sent to subscription owner and co-owners. You can add more recipients and messaging options like email, SMS, and Webhooks, to the notifications using Azure [Activity Log Alerts](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md).  
- At the time of the notification, a *self-service window* is made available. During this window, you can find which of your virtual machines are included in this wave and proactively start maintenance according to your own scheduling needs.
- After the self-service window, a *scheduled maintenance window* begins. At some point during this window, Azure schedules and applies the required maintenance to your virtual machine. 

The goal in having two windows is to give you enough time to start maintenance and reboot your virtual machine while knowing when Azure will automatically start maintenance.


You can use the Azure portal, PowerShell, REST API, and CLI to query for the maintenance windows for your virtual machine scale set VMs and start self-service maintenance.

  
## Should you start maintenance during the self-service window?  

The following guidelines should help you decide whether to use this capability and start maintenance at your own time.

> [!NOTE] 
> Self-service maintenance might not be available for all of your VMs. To determine if proactive redeploy is available for your VM, look for the **Start now** in the maintenance status. Self-service maintenance is currently not available for Cloud Services (Web/Worker Role) and Service Fabric.


Self-service maintenance is not recommended for deployments using **availability sets** since these are highly available setups, where only one update domain is impacted at any given time. 

- Let Azure trigger the maintenance. For maintenance that requires reboot, be aware that the maintenance will be done update domain by update domain, that the update domains do not necessarily receive the maintenance sequentially, and that there is a 30-minute pause between update domains.
- If a temporary loss of some of your capacity (1/update domain count) is a concern, it can easily be compensated for by allocating additional instances during the maintenance period.
- For maintenance that does not require reboot, updates are applied at the fault domain level. 
	
**Don't** use self-service maintenance in the following scenarios: 

- If you shut down your VMs frequently, either manually, using DevTest Labs, using auto-shutdown, or following a schedule, it could revert the maintenance status and therefore cause additional downtime.
- On short-lived VMs that you know will be deleted before the end of the maintenance wave. 
- For workloads with a large state stored in the local (ephemeral) disk that is desired to be maintained upon update. 
- For cases where you resize your VM often, as it could revert the maintenance status. 
- If you have adopted scheduled events that enable proactive failover or graceful shutdown of your workload, 15 minutes before start of maintenance shutdown.

**Use** self-service maintenance, if you are planning to run your VM uninterrupted during the scheduled maintenance phase and none of the counter-indications mentioned above are applicable. 

It is best to use self-service maintenance in the following cases:

- You need to communicate an exact maintenance window to your management or end-customer. 
- You need to complete the maintenance by a given date. 
- You need to control the sequence of maintenance, for example, multi-tier application to guarantee safe recovery.
- You need more than 30 minutes of VM recovery time between two update domains (UDs). To control the time between update domains, you must trigger maintenance on your VMs one update domain (UD) at a time.

 
## View virtual machine scale sets impacted by maintenance in the portal

When a planned maintenance wave is scheduled, you can view the list of virtual machine scale sets that are impacted by the upcoming maintenance wave using the Azure portal. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** on the left navigation and choose **Virtual machine scale sets**.
3. On the **Virtual machine scale sets** page, choose the **Edit columns** option at the top to open the list of available columns.
4. In the **Available columns section**, select the **Self-service maintenance** item and use the arrow buttons to move it into the **Selected columns** list. You can switch the dropdown in the **Available columns** section from **All** to **Properties** to make the **Self-service maintenance** item easier to find. Once you have the **Self-service maintenance** item in the **Selected columns** section, select the **Apply** button at the bottom of the page. 

After following the steps above, the **Self-service maintenance** column will appear in the list of virtual machine scale sets. Each virtual machine scale set can have one of the following values for the self-service maintenance column:

| Value | Description |
|-------|-------------|
| Yes | At least one virtual machine in your virtual machine scale set is in a self-service window. You can start maintenance at any time during this self-service window. | 
| No | There are no virtual machines that are in a self-service window in the affected virtual machine scale set. | 
| - | Your virtual machines scale sets are not part of a planned maintenance wave.| 

## Notification and alerts in the portal

Azure communicates a schedule for planned maintenance by sending an email to the subscription owner and co-owners group. You can add additional recipients and channels to this communication by creating Azure activity log alerts. For more information, see [Monitor subscription activity with the Azure Activity Log] (../monitoring-and-diagnostics/monitoring-overview-activity-logs.md)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the menu on the left, select **Monitor**. 
3. In the **Monitor - Alerts (classic)** pane, click **+ Add activity log alert**.
4. Complete the information in the **Add activity log alert** page and make sure you set the following in **Criteria**:
   - **Event category**: Service Health
   - **Services**: Virtual Machine Scale Sets and Virtual Machines
   - **Type**: Planned maintenance 
	
To learn more on how to configure Activity Log Alerts, see [Create activity log alerts](../monitoring-and-diagnostics/monitoring-activity-log-alerts.md)
	
	
## Start maintenance on your virtual machine scale set from the portal

While looking at the overview of virtual machine scale sets, you will be able to see more maintenance related details. If at least one virtual machine in the virtual machine scale set is included in the planned maintenance wave, a new notification ribbon will be added near the top of the page. You can click on the notification ribbon to go to the **Maintenance** page to see which virtual machine instance is affected by the planned maintenance. 

From there, you will be able to start maintenance by checking the box corresponding to the affected virtual machine and then clicking on **Start maintenance** option.

Once you start maintenance, the affected virtual machines in your virtual machine scale set will undergo maintenance and be temporarily unavailable. If you missed the self-service window, you will still be able to see the window when your virtual machine scale set will be maintained by Azure.
 
## Check maintenance status using PowerShell

You can use Azure Powershell to see when VMs in your virtual machine scale sets are scheduled for maintenance. Planned maintenance information is available from the [Get-AzureRmVmss](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss) cmdlet when you use the `-InstanceView` parameter.
 
Maintenance information is returned only if there is maintenance planned. If no maintenance is scheduled that impacts the VM instance, the cmdlet does not return any maintenance information. 

```powershell
Get-AzureRmVmss -ResourceGroupName rgName -VMScaleSetName vmssName -InstanceId id -InstanceView
```

The following properties are returned under MaintenanceRedeployStatus: 
| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time ||
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM ||
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM ||
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled in which Azure initiates maintenance on your VM ||
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window in which Azure initiates maintenance on your VM ||
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM ||



### Start maintenance on your VM instance using PowerShell

You can start maintenance on a VM if **IsCustomerInitiatedMaintenanceAllowed** is set to true by using [Set-AzureRmVmss](/powershell/module/azurerm.compute/set-azurermvmss) cmdlet with `-PerformMaintenance` parameter.

```powershell
Set-AzureRmVmss -ResourceGroupName rgName -VMScaleSetName vmssName -InstanceId id -PerformMaintenance 
```

## Check maintenance status using CLI

Planned maintenance information can be seen using [az vmss list-instances](/cli/azure/vmss?view=azure-cli-latest#az-vmss-list-instances).
 
Maintenance information is returned only if there is maintenance planned. If there is no maintenance scheduled that impacts the VM instance, the command does not return any maintenance information. 

```azure-cli
az vmss list-instances -g rgName -n vmssName --expand instanceView
```

The following properties are returned under MaintenanceRedeployStatus for each VM instance: 
| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time ||
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM ||
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM ||
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled in which Azure initiates maintenance on your VM ||
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window in which Azure initiates maintenance on your VM ||
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM ||


### Start maintenance on your VM instance using CLI

The following call will initiate maintenance on a VM instance if `IsCustomerInitiatedMaintenanceAllowed` is set to true.

```azure-cli
az vmss perform-maintenance -g rgName -n vmssName --instance-ids id
```

## FAQ


**Q: Why do you need to reboot my virtual machines now?**

**A:** While the majority of updates and upgrades to the Azure platform do not impact virtual machine's availability, there are cases where we can't avoid rebooting virtual machines hosted in Azure. We have accumulated several changes that require us to restart our servers that will result in virtual machines reboot.

**Q: If I follow your recommendations for High Availability by using an Availability Set, am I safe?**

**A:** Virtual machines deployed in an availability set or virtual machine scale sets have the notion of Update Domains (UD). When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set).  Azure also waits for at least 30 minutes before moving to the next group of virtual machines. 

For more information about high availability, see [Regions and availability for virtual machines in Azure](../virtual-machines/windows/regions-and-availability.md).

**Q: How do I get notified about planned maintenance?**

**A:** A planned maintenance wave starts by setting a schedule to one or more Azure regions. Soon after, an email notification is sent to the subscription owners (one email per subscription). Additional channels and recipients for this notification could be configured using Activity Log Alerts. In case you deploy a virtual machine to a region where planned maintenance is already scheduled, you will not receive the notification but rather need to check the maintenance state of the VM.

**Q: I don't see any indication of planned maintenance in the portal, Powershell, or CLI. What is wrong?**

**A:** Information related to planned maintenance is available during a planned maintenance wave only for the VMs that are going to be impacted by it. In other words, if you see not data, it could be that the maintenance wave has already completed (or not started) or that your virtual machine is already hosted in an updated server.

**Q: Is there a way to know exactly when my virtual machine will be impacted?**

**A:** When setting the schedule, we define a time window of several days. However, the exact sequencing of servers (and VMs) within this window is unknown. Customers who would like to know the exact time for their VMs can use [scheduled events](../virtual-machines/windows/scheduled-events.md) and query from within the virtual machine and receive a 15-minute notification before a VM reboot.

**Q: How long will it take you to reboot my virtual machine?**

**A:**  Depending on the size of your VM, reboot may take up to several minutes during the self-service maintenance window. During the Azure initiated reboots in the scheduled maintenance window, the reboot will typically take about 25 minutes. Note that in case you use Cloud Services (Web/Worker Role), Virtual Machine Scale Sets, or availability sets, you will be given 30 minutes between each group of VMs (UD) during the scheduled maintenance window. 

**Q: I don’t see any maintenance information on my VMs. What went wrong?**

**A:** There are several reasons why you’re not seeing any maintenance information on your VMs:
   - You are using a subscription marked as Microsoft internal.
   - Your VMs are not scheduled for maintenance. It could be that the maintenance wave has ended, canceled, or modified so that your VMs are no longer impacted by it.
   - You don’t have the **Maintenance** column added to your VM list view. While we have added this column to the default view, customers who configured to see non-default columns must manually add the **Maintenance** column to their VM list view.

**Q: My VM is scheduled for maintenance for the second time. Why?**

**A:** There are several use cases where you will see your VM scheduled for maintenance after you have already completed your maintenance-redeploy:
   - We have canceled the maintenance wave and restarted it with a different payload. It could be that we've detected faulted payload and we simply need to deploy an additional payload.
   - Your VM was *service healed* to another node due to a hardware fault.
   - You have selected to stop (deallocate) and restart the VM.
   - You have **auto shutdown** turned on for the VM.

## Next steps

Learn how you can register for maintenance events from within the VM using [Scheduled Events](../virtual-machines/windows/scheduled-events.md).
