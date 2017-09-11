---
title: Maintenance notifications Windows VMs in Azure | Microsoft Docs
description: View maintenance notifications for Windows virtual machines running in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/11/2017
ms.author: cynthn

---


# View maintenance notifications for Windows virtual machines

You can use the Azure portal, PowerShell or the API to query for the maintenance windows for your VMs. In addition, you will  receive an e-mail notification if one or more of your VMs are scheduled for maintenance.

Both self-service maintenance and scheduled maintenance phases begin with a notification. Expect to receive a single notification per Azure subscription. The notification is sent to the subscription’s admin and co-admin by default. You can also configure who receives maintenance notifications.



------------------
Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. While the majority of these updates are performed without any impact to the hosted virtual machines, there are cases where a maintenance operation results in virtual machines reboot. 
This guide describes how to monitor, control and orchestrate VM reboots during planned maintenance.

Planned maintenance wave 
Planned maintenance is scheduled in waves. Each wave has different scope (regions).
A wave starts with notification to customers. By default notification is sent to subscription owner and co-owners, However you can set activity log alerts to add more recipients and channels (email, SMS, Webhook) to the maintenance notification. 
Soon after the notification, a self-service window begins during which you can discover which of your virtual machines is included in this wave and initiate the maintenance at you own schedule. 
Following the self-service window, a scheduled maintenance window  begins in which Azure will schedule and apply the required maintenance to your virtual machine. 
The goal in having two windows is simple, give you enough time to initiate maintenance and reboot your virtual machine while knowing the window by which Azure will proceed with the maintenance.

Note: In case you try to start maintenance and fail, Azure will mark your VM as 'skipped' and will not reboot it during the scheduled maintenance window. Instead, you will be contacted in a later time with a new schedule. 
-----------------------------------------------


## View in the portal 

You can use the Azure portal and look for VMs scheduled for maintenance.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left navigation, click **Virtual Machines**.

3. In the Virtual Machines pane, click the **Columns** button to open the list of available columns.

4. Select and add the **Maintenance Window** columns. VMs that are scheduled for maintenance have the maintenance windows surfaced. Once maintenance is completed or aborted, the maintenance window is no longer be presented.


---------------------------



## Notification and alerts 

Azure will communicate a schedule for planned maintenance by sending an email to the subscription owner and co-owners group. You can add additional recipients and channels to this communication by creating Azure activity log alerts. For more information, see [Monitor subscription activity with the Azure Activity Log] (../../monitoring-and-diagnostics/monitoring-overview-activity-logs.md)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the menu on the left, select **Monitor**. 
3. In the **Monitor - Activity log** pane, select **Alerts**.
4. In the **Monitor - Alerts** pane, click **+ Add activity log alert**.
5. Complete the information in the **Add activity log alert** page and make sure you set the following in **Criteria**:
	**Type**: Maintenance 
	**Status**: All (Do not set status to Active or Resolved)
	**Level**: All
	
To learn more on how to configure Activity Log Alerts, see [Create activity log alerts](../../monitoring-and-diagnostics/monitoring-activity-log-alerts.md)
	
## VMs scheduled for maintenance

Once a planned maintenance wave is scheduled, and notifications are sent, you can observe the list of virtual machines which will be impacted by the upcoming maintenance wave. 


	1. Open The Azure Portal , Select Virtual Machines  
	2. Choose which Columns you're looking for 
	

Maintenance : shows the maintenance status for the VM. The following are the potential values:
	- Start now: The VM is in the self-service maintenance window which lets you initiate the maintenance yourself. See below on how to start maintenance on your VM
	- Scheduled: The VM is scheduled for maintenance with no option for you to initiate maintenance. You can learn of the maintenance window by selecting the Auto-Scheduled window in this view or by clicking on the VM
	- Completed: You have successfully initiated and completed maintenance on your VM.
	- Skipped: You have selected to initiate maintenance with no success. Azure has canceled the maintenance for your VM and will reschedule it in a later time
	- Retry later: You have selected to initiate maintenance and Azure was not able to fulfill your request. In this case, you can try again in a later time. 
	
Maintenance Pro-Active window: shows the time window when you can control and orchestrate maintenance on your VMs (See Start Maintenance).

Maintenance Scheduled window: shows the time window when Azure will reboot your VM in order to complete maintenance. 

	
Start Maintenance on your VM
Once looking at the VM details you will be able to identify more maintenance related details.  
At the top of the VM details view, a new notification ribbon will be added if your VM is included in a planned maintenance wave. In addition, a new option is added to start maintenance when possible. 


Click on the maintenance notification to see the maintenance blade with even more details on the planned maintenance. 


From there you will be able to start maintenance on your VM.
Note: Once starting maintenance, your virtual machine will be rebooted and maintenance status will be updated to reflect the result within few minutes.

In case you have missed the window where you can star maintenance, you will still be able to see the window in which your VM will be rebooted by Azure 


Using PowerShell (Windows)
Discover VMs scheduled for maintenance
Planned maintenance information is added to the VM status cmdLet. 
Note that maintenance information is returned to the user only during a planned maintenance wave. In case there is no maintenance schedule which will impact the VM, the cmdlet will not include any maintenance information. 

{powershell}
Get-AzureRmVM -ResourceGroupName rgName -Name vmName -Status

The following properties are returned under MaintenanceRedeployStatus               : 
	-   IsCustomerInitiatedMaintenanceAllowed : Indicate whether you can start maitnenance on the VM at this time
	-   PreMaintenanceWindowStartTime         : The beginning of the maintenance self-service window when you can initiate maintenance on your VM 
	-   PreMaintenanceWindowEndTime           : The end of the maintenance self-service window when you can initiate maintenance on your VM 
	-   MaintenanceWindowStartTime            : The beginning ofthe maintenance scheduled window when you can initiate maintenance on your VM 
	-   MaintenanceWindowEndTime              : The end of the maintenance scheduled window when you can initiate maintenance on your VM 
	-   LastOperationResultCode               : The result of the last attempt to initiate mintenance on the VM 

You can also learn about maintenance status for all virtual machines in a resource group by calling the following cmdlet 
{powershell}
Get-AzureRmVM -ResourceGroupName rgName --Status

The following powershell functions takes in your subscription id and will print out VMs which are scheduled for maitnenanve

{powershell}

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


Initiate Maintenance on your VM
The following cmdLet will initiate maintenance on a VM in case IsCustomerInitiatedMaintenanceAllowed is set to true

{powershell}
restart-azurermVM -PerformMaintenance -name $vm.Name -ResourceGroupName $rg.ResourceGroupName 

 
Using the Command Line Interface (Windows/Linux)
Discover VMs scheduled for maintenance
Initiate Maintenance on your VM

FAQs (Windows/Linux)
Why do you need to reboot my virtual machines now ?
While the majority of updates and upgrades to the Azure platform do not impact virtual machine's availability, there are cases where we can't avoid rebooting virtual machines hosted in Azure. We have accumulated several changes which require us to restart our servers which will result in virtual machines reboot. 

I follow your recommendations for High Availability by using an Availability Set, am I safe ? 
Yes ! Virtual machines deployed in an availability set or virtual machine scale sets have the notion of Update Domains (UD). When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set).  Azure also wait for at least 30 minutes before moving to the next group of virtual machines.
For more information about high availability, refer to Manage the availability of Windows virtual machines in Azure or Manage the availability of Linux virtual machines in Azure .

I have disaster recovery set in another region. Am I safe ?
Each Azure region is paired with another region within the same geography (such as US, Europe, or Asia). Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage. During planned maintenance, Azure may schedule a similar window for users to start the maintenance, however the scheduled maintenance window will be different between the paired regions. 
For more information on Azure regions, refer to Regions and availability for virtual machines in Azure.  You can see the full list of regional pairs here.


How do I get notified about planned maintenance ?
I don't see any indication of planned maintenance in the portal, Powershell, or CLI, What is wrong ? 
Should I start the maintenance on my virtual machine ? 
Is there a way to know exactly when my virtual machine will be impacted ? 
I have received an email about hardware decommissioning, is this the same as planned maintenance ? 



---------------

## Query using the Azure API

Use the [get VM information
API](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-get)
and look for the instance view to discover the maintenance details on an
individual VM. The response includes the following elements:

  - isCustomerInitiatedMaintenanceAllowed: Indicates whether you can now initiate pre-emptive redeploy on the VM.

  - preMaintenanceWindowStartTime: The start time of the pre-emptive maintenance window.

  - preMaintenanceWindowEndTime: The end time of the pre-emptive maintenance window. After this time, you will no longer be able to initiate maintenance on this VM.
    
  - maintenanceWindowStartTime: The start time of the scheduled maintenance window when your VM are impacted.

  - maintenanceWindowEndTime: The end time of the scheduled maintenance window.
  
  - lastOperationResultCode: The result of your last Maintenance-Redeploy operation.
 
  - lastOperationMessage:  Message describing the result of your last Maintenance-Redeploy operation.


## Next Steps

To learn more about VM maintenance, see [Planned maintenance for Windows virtual machines](planned-maintenance.md).