---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 08/03/2020
ms.author: alkohli
---


### List VMs running on the device

To return a list of all the VMs running on your Azure Stack Edge device, run the following command.


`Get-AzureRmVM -ResourceGroupName <String> -Name <String>`
 

### Turn on the VM

Run the following cmdlet to turn on a virtual machine running on your device:


`Start-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>`


For more information on this cmdlet, go to [Start-AzureRmVM](https://docs.microsoft.com/powershell/module/azurerm.compute/start-azurermvm?view=azurermps-6.13.0).

### Suspend or shut down the VM

Run the following cmdlet to stop or shut down a virtual machine running on your device:


```powershell
Stop-AzureRmVM [-Name] <String> [-StayProvisioned] [-ResourceGroupName] <String>
```


For more information on this cmdlet, go to [Stop-AzureRmVM cmdlet](https://docs.microsoft.com/powershell/module/azurerm.compute/stop-azurermvm?view=azurermps-6.13.0).

### Add a data disk

If the workload requirements on your VM increase, then you may need to add a data disk.

```powershell
Add-AzureRmVMDataDisk -VM $VirtualMachine -Name "disk1" -VhdUri "https://contoso.blob.core.windows.net/vhds/diskstandard03.vhd" -LUN 0 -Caching ReadOnly -DiskSizeinGB 1 -CreateOption Empty 
 
Update-AzureRmVM -ResourceGroupName "<Resource Group Name string>" -VM $VirtualMachine
```

### Delete the VM

Run the following cmdlet to remove a virtual machine from your device:

```powershell
Remove-AzureRmVM [-Name] <String> [-ResourceGroupName] <String>
```

For more information on this cmdlet, go to [Remove-AzureRmVm cmdlet](https://docs.microsoft.com/powershell/module/azurerm.compute/remove-azurermvm?view=azurermps-6.13.0).

