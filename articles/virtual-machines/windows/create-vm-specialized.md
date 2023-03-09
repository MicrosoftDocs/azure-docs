---
title: Attach an OS disk to a VM 
description: Create a new Windows VM by attaching a specialized OS disk.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 03/08/2023
ms.author: cynthn 
ms.custom: devx-track-azurepowershell

---
# Create a VM from a specialized disk by using PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

Create a new VM by attaching an existing OS disk to a new VM. This option is useful if you have a VM that isn't working correctly. You can delete the VM and then reuse the disk to create a new VM.


You can also use the Azure portal to [create a new VM from an existing disk](create-vm-specialized-portal.md).


> [!IMPORTANT]
> 
> Creating an image instead of just attaching a disk means you can create multiple VMs from the same source disk.
> When you use a specialized disk to create a new VM, the new VM retains the computer name of the original VM. Other computer-specific information (e.g. CMID) is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.  
>
> You can also use the VHD as a source to create an Azure Compute Gallery image. For more information, see [Create an image definition and image version](../image-version.md). Customers are encouraged to use Azure Compute Gallery as all new features like ARM64, Trusted Launch, and Confidential VM,are only supported through Azure Compute Gallery.  

We recommend that you limit the number of concurrent deployments to 20 VMs from a single VHD or snapshot.
## Get an existing disk

If you had a VM that you deleted and you want to reuse the OS disk to create a new VM, use [Get-AzDisk](/powershell/module/az.compute/get-azdisk).

```powershell
$resourceGroupName = 'myResourceGroup'
$osDiskName = 'myOsDisk'
$osDisk = Get-AzDisk `
-ResourceGroupName $resourceGroupName `
-DiskName $osDiskName
```
You can now attach this disk as the OS disk to a [new VM](#create-the-new-vm).



## Create the new VM 

Create networking and other VM resources to be used by the new VM.

### Create the subnet and virtual network

Create the [virtual network](../../virtual-network/virtual-networks-overview.md) and subnet for the VM.

1. Create the subnet. This example creates a subnet named *mySubNet*, in the resource group *myDestinationResourceGroup*, and sets the subnet address prefix to *10.0.0.0/24*.
   
    ```powershell
    $subnetName = 'mySubNet'
    $singleSubnet = New-AzVirtualNetworkSubnetConfig `
       -Name $subnetName `
       -AddressPrefix 10.0.0.0/24
    ```
    
2. Create the virtual network. This example sets the virtual network name to *myVnetName*, the location to *West US*, and the address prefix for the virtual network to *10.0.0.0/16*. 
   
    ```powershell
    $vnetName = "myVnetName"
    $vnet = New-AzVirtualNetwork `
       -Name $vnetName -ResourceGroupName $destinationResourceGroup `
       -Location $location `
       -AddressPrefix 10.0.0.0/16 `
       -Subnet $singleSubnet
    ```    
    

### Create the network security group and an RDP rule
To be able to sign in to your VM with remote desktop protocol (RDP), you'll need to have a security rule that allows RDP access on port 3389. In our example, the VHD for the new VM was created from an existing specialized VM, so you can use an account that existed on the source virtual machine for RDP. This example denies RDP traffic, to be more secure. You can change `-Access` to `Allow` if you want to allow RDP access.

This example sets the network security group (NSG) name to *myNsg* and the RDP rule name to *myRdpRule*.

```powershell
$nsgName = "myNsg"

$rdpRule = New-AzNetworkSecurityRuleConfig -Name myRdpRule -Description "Deny RDP" `
    -Access Deny -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $destinationResourceGroup `
   -Location $location `
   -Name $nsgName -SecurityRules $rdpRule
	
```

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure by using PowerShell](nsg-quickstart-powershell.md).

### Create a public IP address and NIC
To enable communication with the virtual machine in the virtual network, you'll need a [public IP address](../../virtual-network/ip-services/public-ip-addresses.md) and a network interface.

1. Create the public IP. In this example, the public IP address name is set to *myIP*.
   
    ```powershell
    $ipName = "myIP"
    $pip = New-AzPublicIpAddress `
       -Name $ipName -ResourceGroupName $destinationResourceGroup `
       -Location $location `
       -AllocationMethod Dynamic
    ```       
    
2. Create the NIC. In this example, the NIC name is set to *myNicName*.
   
    ```powershell
    $nicName = "myNicName"
    $nic = New-AzNetworkInterface -Name $nicName `
       -ResourceGroupName $destinationResourceGroup `
       -Location $location -SubnetId $vnet.Subnets[0].Id `
       -PublicIpAddressId $pip.Id `
       -NetworkSecurityGroupId $nsg.Id
    ```
    


### Set the VM name and size

This example sets the VM name to *myVM* and the VM size to *Standard_A2*.

```powershell
$vmName = "myVM"
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize "Standard_A2"
```

### Add the NIC
	
```powershell
$vm = Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id
```
	

### Add the OS disk 

Add the OS disk to the configuration by using [Set-AzVMOSDisk](/powershell/module/az.compute/set-azvmosdisk). This example sets the size of the disk to *128 GB* and attaches the disk as a *Windows* OS disk.
 
```powershell
$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -StorageAccountType Standard_LRS `
    -DiskSizeInGB 128 -CreateOption Attach -Windows
```

### Complete the VM 

Create the VM by using [New-AzVM](/powershell/module/az.compute/new-azvm) with the configurations that we just created.

```powershell
New-AzVM -ResourceGroupName $destinationResourceGroup -Location $location -VM $vm
```

If this command is successful, you'll see output like this:

```powershell
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK   

```

### Verify that the VM was created
You should see the newly created VM either in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands.

```powershell
$vmList = Get-AzVM -ResourceGroupName $destinationResourceGroup
$vmList.Name
```

## Next steps
Sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md).