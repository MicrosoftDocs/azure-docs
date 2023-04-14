---
title: Get maintenance notifications for Azure VMs using PowerShell
description: View maintenance notifications for virtual machines running in Azure and start self-service maintenance using PowerShell.
ms.service: virtual-machines
ms.subservice: maintenance
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/19/2019
ms.custom: devx-track-azurepowershell
#pmcontact: shants
---


# Handling planned maintenance using PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can use Azure PowerShell to see when VMs are scheduled for [maintenance](maintenance-notifications.md). Planned maintenance information is available from the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet when you use the `-status` parameter.
  
Maintenance information is returned only if there is maintenance planned. If no maintenance is scheduled that impacts the VM, the cmdlet does not return any maintenance information. 


```powershell
Get-AzVM -ResourceGroupName myResourceGroup -Name myVM -Status
```

Output

```
MaintenanceRedeployStatus               : 
  IsCustomerInitiatedMaintenanceAllowed : True
  PreMaintenanceWindowStartTime         : 5/14/2018 12:30:00 PM
  PreMaintenanceWindowEndTime           : 5/19/2018 12:30:00 PM
  MaintenanceWindowStartTime            : 5/21/2018 4:30:00 PM
  MaintenanceWindowEndTime              : 6/4/2018 4:30
  LastOperationResultCode               : None 
```

The following properties are returned under MaintenanceRedeployStatus: 

| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maintenance on the VM at this time |
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM |
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM |
| MaintenanceWindowStartTime            | The beginning of the maintenance scheduled in which Azure initiates maintenance on your VM |
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window in which Azure initiates maintenance on your VM |
| LastOperationResultCode               | The result of the last attempt to initiate maintenance on the VM |



You can also get the maintenance status for all VMs in a resource group by using [Get-AzVM](/powershell/module/az.compute/get-azvm) and not specifying a VM.
 
```powershell
Get-AzVM -ResourceGroupName myResourceGroup -Status
```

The following PowerShell example takes your subscription ID and returns a list of VMs indicating whether they are scheduled for maintenance.

```powershell

function MaintenanceIterator {
  param (
    $SubscriptionId
  )
  
  Select-AzSubscription -SubscriptionId $SubscriptionId | Out-Null

  $rgList = Get-AzResourceGroup
  foreach ($rg in $rgList) {
    $vmList = Get-AzVM -ResourceGroupName $rg.ResourceGroupName 
    foreach ($vm in $vmList) {
      $vmDetails = Get-AzVM -ResourceGroupName $rg.ResourceGroupName -Name $vm.Name -Status
      [pscustomobject]@{
        Name                                  = $vmDetails.Name
        ResourceGroupName                     = $rg.ResourceGroupName
        IsCustomerInitiatedMaintenanceAllowed = [bool]$vmDetails.MaintenanceRedeployStatus.IsCustomerInitiatedMaintenanceAllowed
        LastOperationMessage                  = $vmDetails.MaintenanceRedeployStatus.LastOperationMessage
      }
    }
  }
}

```

### Start maintenance on your VM using PowerShell

Using information from the function in the previous section, the following starts maintenance on a VM if **IsCustomerInitiatedMaintenanceAllowed** is set to true.

```powershell

MaintenanceIterator -SubscriptionId <Subscription ID> |
    Where-Object -FilterScript {$_.IsCustomerMaintenanceAllowed} |
        Restart-AzVM -PerformMaintenance

```

## Classic deployments

[!INCLUDE [classic-vm-deprecation](../../includes/classic-vm-deprecation.md)]

If you still have legacy VMs that were deployed using the classic deployment model, you can use PowerShell to query for VMs and initiate maintenance.

To get the maintenance status of a VM, type:

```
Get-AzureVM -ServiceName <Service name> -Name <VM name>
```

To start maintenance on your classic VM, type:

```
Restart-AzureVM -InitiateMaintenance -ServiceName <service name> -Name <VM name>
```

## Next steps

You can also handle planned maintenance using the [Azure CLI](maintenance-notifications-cli.md) or [portal](maintenance-notifications-portal.md).
