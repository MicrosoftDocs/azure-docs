---
title: Handling maintenance notifications for Windows VMs in Azure | Microsoft Docs
description: View maintenance notifications for Windows virtual machines running in Azure and start self-service maintenance.
services: virtual-machines-windows
documentationcenter: ''
author: zivraf
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 10/26/2017
ms.author: zivr

---


# Handling planned maintenance notifications for Windows virtual machines

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. Updates are changes like patching the hosting environment or upgrading and decommissioning hardware. A majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you are given a time window where you can start the maintenance yourself, when it works for you.


Planned maintenance that requires a reboot, is scheduled in waves. Each wave has different scope (regions).

- A wave starts with a notification to customers. By default, notification is sent to subscription owner and co-owners. You can add more recipients and messaging options like email, SMS, and Webhooks, to the notifications.  
- Soon after the notification, a self-service window is set. During this window, you can find which of your virtual machines is included in this wave and start maintenance using proactive redeploy. 
- Following the self-service window, a scheduled maintenance window begins. At this time, Azure schedules and applies the required maintenance to your virtual machine. 

The goal in having two windows is to give you enough time to start maintenance and reboot your virtual machine while knowing when Azure will automatically start maintenance.


You can use the Azure portal, PowerShell, REST API, and CLI to query for the maintenance windows for your VMs and start self-service maintenance.

 > [!NOTE]
 > If you try to start maintenance and fail, Azure marks your VM as **skipped** and does not reboot it during the scheduled maintenance window. Instead, you are contacted in a later time with a new schedule. 


[!INCLUDE [virtual-machines-common-maintenance-notifications](../../../includes/virtual-machines-common-maintenance-notifications.md)]

## Check maintenance status using PowerShell

You can also use Azure Powershell to see when VMs are scheduled for maintenance. Planned maintenance information is available from the [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) cmdlet when you use the `-status` parameter.
 
Maintenance information is returned only if there is maintenance planned. If there is no maintenance scheduled that impacts the VM, the cmdlet does not return any maintenance information. 

```powershell
Get-AzureRmVM -ResourceGroupName rgName -Name vmName -Status
```

The following properties are returned under MaintenanceRedeployStatus: 
| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time ||
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM ||
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM ||
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled window when you can initiate maintenance on your VM ||
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window when you can initiate maintenance on your VM ||
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM ||



You can also get the maintenance status for all VMs in a resource group by using [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) and not specifying a VM.
 
```powershell
Get-AzureRmVM -ResourceGroupName rgName -Status
```

The following PowerShell function takes your subscription ID and prints out a list of VMs that are scheduled for maintenance.

```powershell

function MaintenanceIterator
{
    Select-AzureRmSubscription -SubscriptionId $args[0]

    $rgList= Get-AzureRmResourceGroup 

    for ($rgIdx=0; $rgIdx -lt $rgList.Length ; $rgIdx++)
    {
        $rg = $rgList[$rgIdx]
        $vmList = Get-AzureRMVM -ResourceGroupName $rg.ResourceGroupName 
        for ($vmIdx=0; $vmIdx -lt $vmList.Length ; $vmIdx++)
        {
            $vm = $vmList[$vmIdx]
            $vmDetails = Get-AzureRMVM -ResourceGroupName $rg.ResourceGroupName -Name $vm.Name -Status
              if ($vmDetails.MaintenanceRedeployStatus )
            {
                Write-Output "VM: $($vmDetails.Name)  IsCustomerInitiatedMaintenanceAllowed: $($vmDetails.MaintenanceRedeployStatus.IsCustomerInitiatedMaintenanceAllowed) $($vmDetails.MaintenanceRedeployStatus.LastOperationMessage)"               
            }
          }
    }
}

```

### Start maintenance on your VM using PowerShell

Using information from the function in the previous section, the following starts maintenance on a VM if **IsCustomerInitiatedMaintenanceAllowed** is set to true.

```powershell
Restart-AzureRmVM -PerformMaintenance -name $vm.Name -ResourceGroupName $rg.ResourceGroupName 
```

### Classic deployments

If you still have legacy VMs that were deployed using the classic deployment model, you can use PowerShell to query for VMs and initiate maintenance.

To get the maintenance status of a VM, type:

```
Get-AzureVM -ServiceName <Service name> -Name <VM name>
```

To start maintenance on you classic VM, type:

```
Restart-AzureVM -InitiateMaintenance -ServiceName <service name> -Name <VM name>
```

The following attributes will be shown during the maintenance wave: 

data:    MaintenanceStatus IsCustomerInitiatedMaintenanceAllowed true
data:    MaintenanceStatus PreMaintenanceWindowStartTime 2017-07-12T05:00:00.000Z
data:    MaintenanceStatus PreMaintenanceWindowEndTime 2017-07-25T05:00:00.000Z
data:    MaintenanceStatus MaintenanceWindowStartTime 2017-08-02T05:00:00.000Z
data:    MaintenanceStatus MaintenanceWindowEndTime 2017-08-04T05:00:00.000Z

## FAQ


**Q: Why do you need to reboot my virtual machines now?**

**A:** While the majority of updates and upgrades to the Azure platform do not impact virtual machine's availability, there are cases where we can't avoid rebooting virtual machines hosted in Azure. We have accumulated several changes which require us to restart our servers which will result in virtual machines reboot.

**Q: If I follow your recommendations for High Availability by using an Availability Set, am I safe?**

**A:**Virtual machines deployed in an availability set or virtual machine scale sets have the notion of Update Domains (UD). When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set).  Azure also waits for at least 30 minutes before moving to the next group of virtual machines. 

For more information about high availability, refer to Manage the availability of Windows virtual machines in Azure or Manage the availability of Linux virtual machines in Azure.

**Q: I have disaster recovery set in another region. Am I safe?**

**A:** Each Azure region is paired with another region within the same geography (such as US, Europe, or Asia). Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage. During planned maintenance, Azure may schedule a similar window for users to start the maintenance, however the scheduled maintenance window will be different between the paired regions.  

For more information on Azure regions, refer to Regions and availability for virtual machines in Azure.  You can see the full list of regional pairs here.

**Q: How do I get notified about planned maintenance?**

**A:** A planned maintenance wave starts by setting a schedule to one or more Azure regions. Soon after, an email notification is sent to the subscription owners (one email per subscription). Additional channels and recipients for this notification could be configured using Activity Log Alerts. In case you deploy a virtual machine to a region where planned maintenance is already scheduled, you will not receive the notification but rather need to check the maintenance state of the VM.

**Q: I don't see any indication of planned maintenance in the portal, Powershell, or CLI, What is wrong?**

**A:** Information related to planned maintenance is available during a planned maintenance wave only for the VMs which are going to be impacted by it. In other words, if you see not data, it could be that the maintenance wave has already completed (or not started) or that your virtual machine is already hosted in an updated server.

**Q: Should I start the maintenance on my virtual machine?**

**A:** In general, workloads which are deployed in a cloud service, availability set, or virtual machines scale set, are resilient to planned maintenance.  During planned maintenance, only a single update domain is impacted at any given time. Be aware that the order of update domains being impacted does not necessarily happen sequentially.

You may want to start maintenance yourself in the following cases:
- Your application runs on a single virtual machine and you need to apply all maintenance during off-hours
- You need to coordinate the time of the maintenance as part of your SLA
- You need more than 30 minutes between each VM restart even within an availability set.
- You want to take down the entire application (multiple tiers, multiple update domains) in order to complete the maintenance faster.

**Q: Is there a way to know exactly when my virtual machine will be impacted?**

**A:** When setting the schedule, we define a time window of several days. However, the exact sequencing of servers (and VMs) within this window is unknown. Customers who would like to know the exact time for their VMs can use scheduled events and query from within the virtual machine and receive a 10 minutes notification prior to a VM reboot.
  
**Q: How long will it take you to reboot my virtual machine?**

**A:** Depending on the size of your VM, reboot may take up to several minutes. Note that in case you use cloud services, scale sets, or availability set, you will be given 30 minutes between each group of VMs (UD). 

**Q: What will be the experience in the case of cloud services, scale sets, and Service Fabric?**

**A:** While these platforms are impacted by planned maintenance, customers using these platforms are considered safe given that only VMs in a single Upgrade Domain (UD) will be impacted at any given time.  

**Q: I have received an email about hardware decommissioning, is this the same as planned maintenance?**

**A:** While hardware decommissioning is a planned maintenance event, we have not yet onboarded this use case to the new experience.  We expect customers to get confused in case they receive two similar emails about two different planned maintenance waves.

**Q: I don’t see any maintenance information on my VMs. What went wrong?**

**A:** There are several reasons why you’re not seeing any maintenance information on your VMs:
1.	You are using a subscription marked as Microsoft internal.
2.	Your VMs are not scheduled for maintenance. It could be that the maintenance wave has ended, canceled or modified so that your VMs are no longer impacted by it.
3.	You don’t have the ‘maintenance’ column added to your VM list view. While we have added this column to the default view, customers who configured to see non-default columns must manually add the **Maintenance** column to their VM list view.

**Q: My VM is scheduled for maintenance for the second time. Why?**

**A:** There are several use cases where you will see your VM scheduled for maintenance after you have already completed your maintenance-redeploy:
1.	We have canceled the maintenance wave and restarted it with a different payload. It could be that we've detected faulted payload and we simply need to deploy an additional payload.
2.	Your VM was *service healed* to another node due to a hardware fault
3.	You have selected to stop (deallocate) and restart the  VM
4.	You have **auto shutdown** turned on for the VM


## Next Steps

Learn how you can register for maintenance events from within the VM using [Scheduled Events](scheduled-events.md).
