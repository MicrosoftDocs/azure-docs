---
title: Resize a virtual machine
description: Change the VM size used for an Azure virtual machine.
author: ericd-mst-github
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 09/15/2023
ms.author: cynthn 
ms.custom: compute-cost-fy24, devx-track-azurecli, devx-track-azurepowershell, devx-track-terraform
---
# Change the size of a virtual machine 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to change an existing virtual machine's [VM size](sizes.md).

After you create a virtual machine (VM), you can scale the VM up or down by changing the VM size. In some cases, you must deallocate the VM first. Deallocation may be necessary if the new size isn't available on the same hardware cluster that is currently hosting the VM.

If your VM uses Premium Storage, make sure that you choose an **s** version of the size to get Premium Storage support. For example, choose Standard_E4**s**_v3 instead of Standard_E4_v3.

## Change the VM size

### [Portal](#tab/portal)

1. Open the [Azure portal](https://portal.azure.com).
1. Open the page for the virtual machine.
1. In the left menu, select **Size**.
1. Pick a new size from the list of available sizes and then select **Resize**.

> [!Note] 
> If the virtual machine is currently running, changing its size will cause it to restart. 

If your VM is still running and you don't see the size you want in the list, stopping the virtual machine may reveal more sizes.

   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 
  

### [CLI](#tab/cli)

To resize a VM, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az sign-in](/cli/azure/reference-index).

The below script checks if the desired VM size is available before resizing. If the desired size isn't available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again. You can replace the values of `resourceGroup`, `vm`, and `size` with your own.
   
```azurecli-interactive
 # Set variables
resourceGroup=myResourceGroup
vm=myVM
size=Standard_DS3_v2

# Check if the desired VM size is available
if ! az vm list-vm-resize-options --resource-group $resourceGroup --name $vm --query "[].name" | grep -q $size; then
    echo "The desired VM size is not available."
    exit 1
fi

# Deallocate the VM
az vm deallocate --resource-group $resourceGroup --name $vm

# Resize the VM
az vm resize --resource-group $resourceGroup --name $vm --size $size

# Start the VM
az vm start --resource-group $resourceGroup --name $vm
```
   
   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 

**Use Azure CLI to resize a VM in an availability set.**

The below script sets the variables `resourceGroup`, `vm`, and `size`. It then checks if the desired VM size is available by using `az vm list-vm-resize-options` and checking if the output contains the desired size. If the desired size isn't available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again.


```azurecli-interactive
# Set variables
resourceGroup="myResourceGroup"
vmName="myVM"
newVmSize="<newVmSize>"
availabilitySetName="<availabilitySetName>"

# Check if the desired VM size is available
availableSizes=$(az vm list-vm-resize-options \
  --resource-group $resourceGroup \
  --name $vmName \
  --query "[].name" \
  --output tsv)
if [[ ! $availableSizes =~ $newVmSize ]]; then
  # Deallocate all VMs in the availability set
  vmIds=$(az vmss list-instances \
    --resource-group $resourceGroup \
    --name $availabilitySetName \
    --query "[].instanceId" \
    --output tsv)
  az vm deallocate \
    --ids $vmIds \
    --no-wait

  # Resize and restart the VMs in the availability set
  az vmss update \
    --resource-group $resourceGroup \
    --name $availabilitySetName \
    --set virtualMachineProfile.hardwareProfile.vmSize=$newVmSize
  az vmss start \
    --resource-group $resourceGroup \
    --name $availabilitySetName \
    --instance-ids $vmIds
  exit
fi

# Resize the VM
az vm resize \
  --resource-group $resourceGroup \
  --name $vmName \
  --size $newVmSize
```

### [PowerShell](#tab/powershell)

**Use PowerShell to resize a VM not in an availability set.**

This script sets the variables `$resourceGroup`, `$vm`, and `$size`. It then checks if the desired VM size is available by using `az vm list-vm-resize-options` and checking if the output contains the desired size. If the desired size isn't available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again.

```azurepowershell-interactive
# Set variables
$resourceGroup = "myResourceGroup"
$vm = "myVM"
$size = "Standard_DS3_v2"

# Check if the desired VM size is available
if ((az vm list-vm-resize-options --resource-group $resourceGroup --name $vm --query "[].name" | ConvertFrom-Json) -notcontains $size) {
    Write-Host "The desired VM size is not available."
    exit 1
}

# Deallocate the VM
az vm deallocate --resource-group $resourceGroup --name $vm

# Resize the VM
az vm resize --resource-group $resourceGroup --name $vm --size $size

# Start the VM
az vm start --resource-group $resourceGroup --name $vm
```


   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region.


**Use PowerShell to resize a VM in an availability set**

If the new size for a VM in an availability set isn't available on the hardware cluster currently hosting the VM, then you need to deallocate all VMs in the availability set to resize the VM. You also might need to update the size of other VMs in the availability set after one VM has been resized. To resize a VM in an availability set, run the below script. You can replace the values of `$resourceGroup`, `$vmName`, `$newVmSize`, and `$availabilitySetName` with your own.

```azurepowershell-interactive
# Set variables
$resourceGroup = "myResourceGroup"
$vmName = "myVM"
$newVmSize = "<newVmSize>"
$availabilitySetName = "<availabilitySetName>"

# Check if the desired VM size is available
$availableSizes = Get-AzVMSize `
  -ResourceGroupName $resourceGroup `
  -VMName $vmName |
  Select-Object -ExpandProperty Name
if ($availableSizes -notcontains $newVmSize) {
  # Deallocate all VMs in the availability set
  $as = Get-AzAvailabilitySet `
    -ResourceGroupName $resourceGroup `
    -Name $availabilitySetName
  $virtualMachines = $as.VirtualMachinesReferences | Get-AzResource | Get-AzVM
  $virtualMachines | Stop-AzVM -Force -NoWait

  # Resize and restart the VMs in the availability set
  $virtualMachines | Foreach-Object { $_.HardwareProfile.VmSize = $newVmSize }
  $virtualMachines | Update-AzVM
  $virtualMachines | Start-AzVM
  exit
}

# Resize the VM
$vm = Get-AzVM `
  -ResourceGroupName $resourceGroup `
  -VMName $vmName
$vm.HardwareProfile.VmSize = $newVmSize
Update-AzVM `
  -VM $vm `
  -ResourceGroupName $resourceGroup
```

This script sets the variables `$resourceGroup`, `$vmName`, `$newVmSize`, and `$availabilitySetName`. It then checks if the desired VM size is available by using `Get-AzVMSize` and checking if the output contains the desired size. If the desired size isn't available, the script deallocates all VMs in the availability set, resizes them, and starts them again. If the desired size is available, the script resizes the VM.

### [Terraform](#tab/terraform)

To resize your VM in Terraform code, you modify the `size` parameter in the `azurerm_linux_virtual_machine` or `azurerm_windows_virtual_machine` resource blocks to the desired size and run `terraform plan -out main.tfplan` to see the VM size change that will be made. Then run `terraform apply main.tfplan` to apply the changes to resize the VM.

> [!IMPORTANT]
> The below Terraform example modifies the size of an existing virtual machine when you're using the state file that created the original virtual machine. For the full Terraform code, see the [Windows Terraform quickstart](./windows/quick-create-terraform.md).

:::code language="Terraform" source="~/terraform_samples/quickstart/101-windows-vm-with-iis-server/main.tf" range="91-117" highlight="8":::

   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 

---

## Choose the right SKU

When resizing a VM, it's important to choose the right SKU based on the signals from the VM to determine whether you need more CPU, memory, or storage capacity:

- If the VM is running a CPU-intensive workload, such as a database server or a web server with high traffic, you may need to choose a SKU with more CPU cores.
- If the VM is running a memory-intensive workload, such as a machine learning model or a big data application, you may need to choose a SKU with more memory.
- If the VM is running out of storage capacity, you may need to choose a SKU with more storage.


For more information on choosing the right SKU, you can use the following resources:
- [Sizes for VMs in Azure](sizes.md): This article lists all the VM sizes available in Azure.
- [Azure VM Selector](https://azure.microsoft.com/pricing/vm-selector/): This tool helps you find the right VM SKU based on your workload type, OS and software, and deployment region.



## Limitations

You can't resize a VM size that has a local temp disk to a VM size with no local temp disk and vice versa.

The only combinations allowed for resizing are:

- VM (with local temp disk) -> VM (with local temp disk); and
- VM (with no local temp disk) -> VM (with no local temp disk).

For a work-around, see [How do I migrate from a VM size with local temp disk to a VM size with no local temp disk? ](azure-vms-no-temp-disk.yml#how-do-i-migrate-from-a-vm-size-with-local-temp-disk-to-a-vm-size-with-no-local-temp-disk---). The work-around can be used to resize a VM with no local temp disk to VM with a local temp disk. You create a snapshot of the VM with no local temp disk > create a disk from the snapshot > create VM from the disk with appropriate [VM size](sizes.md) that supports VMs with a local temp disk.


## Next steps

- For more scalability, run multiple VM instances and scale out.
- For more SKU selection information, see [Sizes for virtual machines in Azure](sizes.md).
- To determine VM sizes by workload type, OS and software, or deployment region, see [Azure VM Selector](https://azure.microsoft.com/pricing/vm-selector/).
- For more information on Virtual Machine Scale Sets (VMSS) sizes, see [Automatically scale machines in a VMSS](../virtual-machine-scale-sets/tutorial-autoscale-powershell.md).
- For more cost management planning information, see the [Plan and manage your Azure costs](/training/modules/plan-manage-azure-costs/1-introduction) module.
