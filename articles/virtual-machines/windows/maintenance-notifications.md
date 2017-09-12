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
ms.date: 09/12/2017
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

The following properties are returned under MaintenanceRedeployStatus: 
| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maitnenance on the VM at this time ||
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM ||
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM ||
| MaintenanceWindowStartTime            | The beginning ofthe maintenance scheduled window when you can initiate maintenance on your VM ||
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window when you can initiate maintenance on your VM ||
| LastOperationResultCode               | The result of the last attempt to initiate mintenance on the VM ||



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
 

## Next Steps

To learn more about VM maintenance, see [Planned maintenance for Windows virtual machines](planned-maintenance.md).