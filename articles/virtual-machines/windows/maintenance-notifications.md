---
title: Maintenance notifications Windows VMs in Azure | Microsoft Docs
description: View maintenance notifications for Windows virtual machines running in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: zivr
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
ms.author: zivr

---


# View maintenance notifications for Windows virtual machines

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. These updates range from patching software components in the hosting environment (like operating system, hypervisor, and various agents deployed on the host), upgrading networking components, to hardware decommissioning. The majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you'll also be given a time window where you can start the maintenance yourself, at a time that works for you.


Both self-service maintenance and scheduled maintenance phases begin with an e-mail notification sent to the subscription admin and co-admin by default. You can also configure who receives maintenance notifications.

You can use the Azure portal or PowerShell to query for the maintenance windows for your VMs and start self-service maintenance.

 > [!NOTE]
 > If you try to start maintenance and fail, Azure will mark your VM as **skipped** and will not reboot it during the scheduled maintenance window. Instead, you will be contacted in a later time with a new schedule. 


[!INCLUDE [virtual-machines-common-maintenance-notifications](../../../includes/virtual-machines-common-maintenance-notifications.md)]

## Check maintenance status using PowerShell

You can also use Azure Powershell to see when VMs are scheduled for maintenance. Planned maintenance information is available from the [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) cmdlet when you use the `-status` parameter.
 
Maintenance information is returned only if there is maintenance planned, if there is no maintenance scheduled that will impact the VM, the cmdlet will not return any maintenance information. 

```powershell
Get-AzureRmVM -ResourceGroupName rgName -Name vmName -Status
```

The following properties are returned under MaintenanceRedeployStatus               : 
	-   IsCustomerInitiatedMaintenanceAllowed : Indicate whether you can start maitnenance on the VM at this time
	-   PreMaintenanceWindowStartTime         : The beginning of the maintenance self-service window when you can initiate maintenance on your VM 
	-   PreMaintenanceWindowEndTime           : The end of the maintenance self-service window when you can initiate maintenance on your VM 
	-   MaintenanceWindowStartTime            : The beginning ofthe maintenance scheduled window when you can initiate maintenance on your VM 
	-   MaintenanceWindowEndTime              : The end of the maintenance scheduled window when you can initiate maintenance on your VM 
	-   LastOperationResultCode               : The result of the last attempt to initiate mintenance on the VM 

You can also learn about maintenance status for all virtual machines in a resource group by calling using the using [Get-AzureRmVM](/powershell/module/azurerm.compute/get-azurermvm) and not specifying a VM.
 
```powershell
Get-AzureRmVM -ResourceGroupName rgName --Status
```

The following PowerShell function takes your subscription id and will print out a list of VMs which are scheduled for maintenance.

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

Using information from the function in the previous section, the following cmdlet will start maintenance on a VM if **IsCustomerInitiatedMaintenanceAllowed** is set to true.

```powershell
Restart-AzureRmVM -PerformMaintenance -name $vm.Name -ResourceGroupName $rg.ResourceGroupName 
```
 
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