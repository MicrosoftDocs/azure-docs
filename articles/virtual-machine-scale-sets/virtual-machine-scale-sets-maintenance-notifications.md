---
title: Maintenance notifications for virtual machine scale sets in Azure | Microsoft Docs
description: View maintenance notifications and start self-service maintenance for virtual machine scale sets in Azure.
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

# Planned maintenance notifications for virtual machine scale sets


Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines (VMs). Updates might include patching the hosting environment or upgrading and decommissioning hardware. Most updates don't affect the hosted VMs. However, updates affect VMs in these scenarios:

- If the maintenance doesn't require a reboot, Azure uses in-place migration to pause the VM while the host is updated. Maintenance operations that don't require a reboot are applied fault domain by fault domain. Progress is stopped if any warning health signals are received.

- If maintenance requires a reboot, you receive a notification that shows when the maintenance is planned. In these cases, you are given a time window in which you can start the maintenance yourself when it works best for you.


Planned maintenance that requires a reboot is scheduled in waves. Each wave has different scope (regions):

- A wave starts with a notification to customers. By default, notification is sent to the subscription owner and co-owners. You can add recipients and messaging options like email, SMS, and webhooks to the notifications by using Azure [Activity Log alerts](../azure-monitor/platform/activity-logs-overview.md).  
- With notification, a *self-service window* is made available. During this window, you can find which of your VMs are included in the wave. You can proactively start maintenance according to your own scheduling needs.
- After the self-service window, a *scheduled maintenance window* begins. At some point during this window, Azure schedules and applies the required maintenance to your VM. 

The goal in having two windows is to give you enough time to start maintenance and reboot your VM while knowing when Azure will automatically start maintenance.

You can use the Azure portal, PowerShell, the REST API, and the Azure CLI to query for maintenance windows for your virtual machine scale set VMs, and to start self-service maintenance.

## Should you start maintenance during the self-service window?  

The following guidelines can help you decide whether to start maintenance at a time that you choose.

> [!NOTE] 
> Self-service maintenance might not be available for all of your VMs. To determine whether proactive redeploy is available for your VM, look for **Start now** in the maintenance status. Currently, self-service maintenance isn't available for Azure Cloud Services (Web/Worker Role) and Azure Service Fabric.


Self-service maintenance isn't recommended for deployments that use *availability sets*. Availability sets are highly available setups in which only one update domain is affected at any time. For availability sets:

- Let Azure trigger the maintenance. For maintenance that requires a reboot, maintenance is done update domain by update domain. Update domains don't necessarily receive the maintenance sequentially. There's a 30-minute pause between update domains.
- If a temporary loss of some of your capacity (1/update domain count) is a concern, you can easily compensate for the loss by allocating additional instances during the maintenance period.
- For maintenance that doesn't require a reboot, updates are applied at the fault domain level. 
	
**Don't** use self-service maintenance in the following scenarios: 

- If you shut down your VMs frequently, either manually, by using DevTest Labs, by using auto-shutdown, or by following a schedule. Self-service maintenance in these scenarios might revert the maintenance status and cause additional downtime.
- On short-lived VMs that you know will be deleted before the end of the maintenance wave. 
- For workloads with a large state stored in the local (ephemeral) disk that you want to maintain after update. 
- If you resize your VM often. This scenario might revert the maintenance status. 
- If you have adopted scheduled events that enable proactive failover or graceful shutdown of your workload 15 minutes before maintenance shutdown begins.

**Do** use self-service maintenance if you plan to run your VM uninterrupted during the scheduled maintenance phase and none of the preceding counterindications apply. 

It's best to use self-service maintenance in the following cases:

- You need to communicate an exact maintenance window to management or your customer. 
- You need to complete the maintenance by a specific date. 
- You need to control the sequence of maintenance, for example, in a multi-tier application, to guarantee safe recovery.
- You need more than 30 minutes of VM recovery time between two update domains. To control the time between update domains, you must trigger maintenance on your VMs one update domain at a time.

 
## View virtual machine scale sets that are affected by maintenance in the portal

When a planned maintenance wave is scheduled, you can view the list of virtual machine scale sets that are affected by the upcoming maintenance wave by using the Azure portal. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the left menu, select **All services**, and then select **Virtual machine scale sets**.
3. Under **Virtual machine scale sets**, select **Edit columns** to open the list of available columns.
4. In the **Available columns** section, select **Self-service maintenance**, and then move it to the **Selected columns** list. Select **Apply**.  

    To make the **Self-service maintenance** item easier to find, you can change the drop-down option in the **Available columns** section from **All** to **Properties**.

The **Self-service maintenance** column now appears in the list of virtual machine scale sets. Each virtual machine scale set can have one of the following values for the self-service maintenance column:

| Value | Description |
|-------|-------------|
| Yes | At least one VM in your virtual machine scale set is in a self-service window. You can start maintenance at any time during this self-service window. | 
| No | No VMs are in a self-service window in the affected virtual machine scale set. | 
| - | Your virtual machines scale sets aren't part of a planned maintenance wave.| 

## Notification and alerts in the portal

Azure communicates a schedule for planned maintenance by sending an email to the subscription owner and co-owners group. You can add recipients and channels to this communication by creating Activity Log alerts. For more information, see [Monitor subscription activity with the Azure Activity Log](../azure-monitor/platform/activity-logs-overview.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the left menu, select **Monitor**. 
3. In the **Monitor - Alerts (classic)** pane, select **+Add activity log alert**.
4. On the **Add activity log alert** page, select or enter the requested information. In **Criteria**, make sure that you set the following values:
   - **Event category**: Select **Service Health**.
   - **Services**: Select **Virtual Machine Scale Sets and Virtual Machines**.
   - **Type**: Select **Planned maintenance**. 
	
To learn more about how to configure Activity Log alerts, see [Create Activity Log alerts](../azure-monitor/platform/activity-log-alerts.md)
	
	
## Start maintenance on your virtual machine scale set from the portal

You can see more maintenance-related details in the overview of virtual machine scale sets. If at least one VM in the virtual machine scale set is included in the planned maintenance wave, a new notification ribbon is added near the top of the page. Select the notification ribbon to go to the **Maintenance** page. 

On the **Maintenance** page, you can see which VM instance is affected by the planned maintenance. To start maintenance, select the check box that corresponds to the affected VM. Then, select  **Start maintenance**.

After you start maintenance, the affected VMs in your virtual machine scale set undergo maintenance and are temporarily unavailable. If you missed the self-service window, you can still see the time window when your virtual machine scale set will be maintained by Azure.
 
## Check maintenance status by using PowerShell

You can use Azure PowerShell to see when VMs in your virtual machine scale sets are scheduled for maintenance. Planned maintenance information is available by using the [Get-AzVmss](https://docs.microsoft.com/powershell/module/az.compute/get-azvmss) cmdlet when you use the `-InstanceView` parameter.
 
Maintenance information is returned only if maintenance is planned. If no maintenance is scheduled that affects the VM instance, the cmdlet doesn't return any maintenance information. 

```powershell
Get-AzVmss -ResourceGroupName rgName -VMScaleSetName vmssName -InstanceId id -InstanceView
```

The following properties are returned under **MaintenanceRedeployStatus**: 

| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time. |
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM. |
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM. |
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled in which Azure initiates maintenance on your VM. |
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window in which Azure initiates maintenance on your VM. |
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM. |



### Start maintenance on your VM instance by using PowerShell

You can start maintenance on a VM if **IsCustomerInitiatedMaintenanceAllowed** is set to **true**. Use the [Set-AzVmss](/powershell/module/az.compute/set-azvmss) cmdlet with `-PerformMaintenance` parameter.

```powershell
Set-AzVmss -ResourceGroupName rgName -VMScaleSetName vmssName -InstanceId id -PerformMaintenance 
```

## Check maintenance status by using the CLI

You can view planned maintenance information by using [az vmss list-instances](/cli/azure/vmss?view=azure-cli-latest#az-vmss-list-instances).
 
Maintenance information is returned only if maintenance is planned. If no maintenance that affects the VM instance is scheduled, the command doesn't return any maintenance information. 

```azure-cli
az vmss list-instances -g rgName -n vmssName --expand instanceView
```

The following properties are returned under **MaintenanceRedeployStatus** for each VM instance: 

| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time. |
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM. |
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM. |
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled in which Azure initiates maintenance on your VM. |
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window in which Azure initiates maintenance on your VM. |
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM. |


### Start maintenance on your VM instance by using the CLI

The following call initiates maintenance on a VM instance if `IsCustomerInitiatedMaintenanceAllowed` is set to **true**:

```azure-cli
az vmss perform-maintenance -g rgName -n vmssName --instance-ids id
```

## FAQ

**Q: Why do you need to reboot my VMs now?**

**A:** Although most updates and upgrades to the Azure platform don't affect VM availability, in some cases, we can't avoid rebooting VMs hosted in Azure. We have accumulated several changes that require us to restart our servers that will result in VM reboot.

**Q: If I follow your recommendations for high availability by using an availability set, am I safe?**

**A:** Virtual machines deployed in an availability set or in virtual machine scale sets use update domains. When performing maintenance, Azure honors the update domain constraint and doesn't reboot VMs from a different update domain (within the same availability set). Azure also waits for at least 30 minutes before moving to the next group of VMs. 

For more information about high availability, see [Regions and availability for virtual machines in Azure](../virtual-machines/windows/availability.md).

**Q: How can I be notified about planned maintenance?**

**A:** A planned maintenance wave starts by setting a schedule to one or more Azure regions. Soon after, an email notification is sent to the subscription owners (one email per subscription). You can add channels and recipients for this notification by using Activity Log alerts. If you deploy a VM to a region in which planned maintenance is already scheduled, you don't receive the notification. Instead, check the maintenance state of the VM.

**Q: I don't see any indication of planned maintenance in the portal, PowerShell, or the CLI. What's wrong?**

**A:** Information related to planned maintenance is available during a planned maintenance wave only for the VMs that are affected by the planned maintenance. If you don't see data, the maintenance wave might already be finished (or not started), or your VM might already be hosted on an updated server.

**Q: Is there a way to know exactly when my VM will be affected?**

**A:** When we set the schedule, we define a time window of several days. The exact sequencing of servers (and VMs) within this window is unknown. If you want to know the exact time your VMs will be updated, you can use [scheduled events](../virtual-machines/windows/scheduled-events.md). When you use scheduled events, you can query from within the VM and receive a 15-minute notification before a VM reboot.

**Q: How long will it take you to reboot my VM?**

**A:**  Depending on the size of your VM, reboot might take up to several minutes during the self-service maintenance window. During the Azure-initiated reboots in the scheduled maintenance window, the reboot typically takes about 25 minutes. If you use Cloud Services (Web/Worker Role), virtual machine scale sets, or availability sets, you are given 30 minutes between each group of VMs (update domain) during the scheduled maintenance window. 

**Q: I don’t see any maintenance information on my VMs. What went wrong?**

**A:** There are several reasons why you might not see any maintenance information on your VMs:
   - You are using a subscription marked as *Microsoft Internal*.
   - Your VMs aren't scheduled for maintenance. It might be that the maintenance wave ended, was canceled, or was modified so that your VMs are no longer affected by it.
   - You don’t have the **Maintenance** column added to your VM list view. Although we added this column to the default view, if you configure your view to see non-default columns, you must manually add the **Maintenance** column to your VM list view.

**Q: My VM is scheduled for maintenance for the second time. Why?**

**A:** In several use cases, your VM is scheduled for maintenance after you have already completed your maintenance and redeployed:
   - We have canceled the maintenance wave and restarted it with a different payload. It might be that we've detected a faulted payload and we simply need to deploy an additional payload.
   - Your VM was *service healed* to another node due to a hardware fault.
   - You have selected to stop (deallocate) and restart the VM.
   - You have **auto shutdown** turned on for the VM.

## Next steps

Learn how to register for maintenance events from within the VM by using [scheduled events](../virtual-machines/windows/scheduled-events.md).
