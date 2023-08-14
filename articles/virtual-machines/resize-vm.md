---
title: Resize a virtual machine
description: Change the VM size used for an Azure virtual machine.
author: ericd-mst-github
ms.service: virtual-machines
ms.workload: infrastructure
ms.topic: how-to
ms.date: 08/09/2023
ms.author: cynthn 
ms.custom: compute-cost-fy24

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

To resize a VM, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

The below script checks if the desired VM size is available before resizing. If the desired size is not available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again. You can replace the values of `resourceGroup`, `vm`, and `size` with your own.
   
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

The below script sets the variables `resourceGroup`, `vm`, and `size`. It then checks if the desired VM size is available by using `az vm list-vm-resize-options` and checking if the output contains the desired size. If the desired size is not available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again.

```azurecli-interactive

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

This script sets the variables `$resourceGroup`, `$vm`, and `$size`. It then checks if the desired VM size is available by using `az vm list-vm-resize-options` and checking if the output contains the desired size. If the desired size is not available, the script exits with an error message. If the desired size is available, the script deallocates the VM, resizes it, and starts it again.

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

If the new size for a VM in an availability set isn't available on the hardware cluster currently hosting the VM, then you will need to deallocate all VMs in the availability set to resize the VM. You also might need to update the size of other VMs in the availability set after one VM has been resized. To resize a VM in an availability set, run the below script. You can replace the values of `$resourceGroup`, `$vmName`, `$newVmSize`, and `$availabilitySetName` with your own.

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

This script sets the variables `$resourceGroup`, `$vmName`, `$newVmSize`, and `$availabilitySetName`. It then checks if the desired VM size is available by using `Get-AzVMSize` and checking if the output contains the desired size. If the desired size is not available, the script deallocates all VMs in the availability set, resizes them, and starts them again. If the desired size is available, the script resizes the VM.

### [Terraform](#tab/terraform)

To resize your VM in Terraform code, you modify the `size` parameter in the `azurerm_linux_virtual_machine` or `azurerm_windows_virtual_machine` resource blocks to the desired size and run `terraform plan -out main.tfplan` to see the VM size change that will be made. Then run `terraform apply main.tfplan` to apply the changes to resize the VM.

> [!IMPORTANT]
> The below Terraform example modifies the size of an existing virtual machine when you're using the state file that created the original virtual machine.

```Terraform
# Create virtual machine
resource "azurerm_windows_virtual_machine" "main" {
  name                  = "${var.prefix}-vm"
  admin_username        = "azureuser"
  admin_password        = random_password.password.result
  location              = azurerm_resource_group.rg.location
  resource_group_name   = azurerm_resource_group.rg.name
  network_interface_ids = [azurerm_network_interface.my_terraform_nic.id]
  size                  = "Standard_DS1_v2" # Change the VM size here

  os_disk {
    name                 = "myOsDisk"
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2022-datacenter-azure-edition"
    version   = "latest"
  }


  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.my_storage_account.primary_blob_endpoint
  }
}
```
   > [!WARNING]
   > Deallocating the VM also releases any dynamic IP addresses assigned to the VM. The OS and data disks are not affected.
   > 
   > If you are resizing a production VM, consider using [Azure Capacity Reservations](capacity-reservation-overview.md) to reserve Compute capacity in the region. 

---
## Limitations

You can't resize a VM size that has a local temp disk to a VM size with no local temp disk and vice versa.

The only combinations allowed for resizing are:

- VM (with local temp disk) -> VM (with local temp disk); and
- VM (with no local temp disk) -> VM (with no local temp disk).

For a work-around, see [How do I migrate from a VM size with local temp disk to a VM size with no local temp disk? ](azure-vms-no-temp-disk.yml#how-do-i-migrate-from-a-vm-size-with-local-temp-disk-to-a-vm-size-with-no-local-temp-disk---). The work-around can be used to resize a VM with no local temp disk to VM with a local temp disk. You will create a snapshot of the VM with no local temp disk > create a disk from the snapshot > create VM from the disk with appropriate [VM size](sizes.md) that supports VMs with a local temp disk.


## Next steps

- For more scalability, run multiple VM instances and scale out.
- For more SKU selection information, see [Sizes for virtual machines in Azure](sizes.md).
- To find VM sizes by workload type, OS and software, or deployment region, see [Azure VM Selector](https://azure.microsoft.com/en-us/pricing/vm-selector/).
- For more information, see [Automatically scale machines in a Virtual Machine Scale Set](../virtual-machine-scale-sets/tutorial-autoscale-powershell.md).
- For more cost management planning information, see the [Plan and manage your Azure costs](https://learn.microsoft.com/en-us/training/modules/plan-manage-azure-costs/1-introduction) module.
