---
title: Create a Windows VM from a specialized VHD in Azure 
description: Create a new Windows VM by attaching a specialized managed disk as the OS disk by using the Resource Manager deployment model.
author: cynthn
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 10/10/2019
ms.author: cynthn

---
# Create a Windows VM from a specialized disk by using PowerShell

Create a new VM by attaching a specialized managed disk as the OS disk. A specialized disk is a copy of a virtual hard disk (VHD) from an existing VM that contains the user accounts, applications, and other state data from your original VM. 

When you use a specialized VHD to create a new VM, the new VM retains the computer name of the original VM. Other computer-specific information is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.

You have several options:
* [Use an existing managed disk](#option-1-use-an-existing-disk). This option is useful if you have a VM that isn't working correctly. You can delete the VM and then reuse the managed disk to create a new VM. 
* [Upload a VHD](#option-2-upload-a-specialized-vhd) 
* [Copy an existing Azure VM by using snapshots](#option-3-copy-an-existing-azure-vm)

You can also use the Azure portal to [create a new VM from a specialized VHD](create-vm-specialized-portal.md).

This article shows you how to use managed disks. If you have a legacy deployment that requires using a storage account, see [Create a VM from a specialized VHD in a storage account](sa-create-vm-specialized.md).

We recommend that you limit the number of concurrent deployments to 20 VMs from a single VHD or snapshot. 

## Option 1: Use an existing disk

If you had a VM that you deleted and you want to reuse the OS disk to create a new VM, use [Get-AzDisk](https://docs.microsoft.com/powershell/module/az.compute/get-azdisk).

```powershell
$resourceGroupName = 'myResourceGroup'
$osDiskName = 'myOsDisk'
$osDisk = Get-AzDisk `
-ResourceGroupName $resourceGroupName `
-DiskName $osDiskName
```
You can now attach this disk as the OS disk to a [new VM](#create-the-new-vm).

## Option 2: Upload a specialized VHD

You can upload the VHD from a specialized VM created with an on-premises virtualization tool, like Hyper-V, or a VM exported from another cloud.

### Prepare the VM
Use the VHD as-is to create a new VM. 
  
  * [Prepare a Windows VHD to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). **Do not** generalize the VM by using Sysprep.
  * Remove any guest virtualization tools and agents that are installed on the VM (such as VMware tools).
  * Make sure the VM is configured to get the IP address and DNS settings from DHCP. This ensures that the server obtains an IP address within the virtual network when it starts up. 


### Upload the VHD

You can now upload a VHD straight into a managed disk. For instructions, see [Upload a VHD to Azure using Azure PowerShell](disks-upload-vhd-to-managed-disk-powershell.md).

## Option 3: Copy an existing Azure VM

You can create a copy of a VM that uses managed disks by taking a snapshot of the VM, and then by using that snapshot to create a new managed disk and a new VM.

If you want to copy an existing VM to another region, you might want to use azcopy to [create a copy of a disk in another region](disks-upload-vhd-to-managed-disk-powershell.md#copy-a-managed-disk). 

### Take a snapshot of the OS disk

You can take a snapshot of an entire VM (including all disks) or of just a single disk. The following steps show you how to take a snapshot of just the OS disk of your VM with the [New-AzSnapshot](https://docs.microsoft.com/powershell/module/az.compute/new-azsnapshot) cmdlet. 

First, set some parameters. 

 ```powershell
$resourceGroupName = 'myResourceGroup' 
$vmName = 'myVM'
$location = 'westus' 
$snapshotName = 'mySnapshot'  
```

Get the VM object.

```powershell
$vm = Get-AzVM -Name $vmName `
   -ResourceGroupName $resourceGroupName
```
Get the OS disk name.

 ```powershell
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName `
   -DiskName $vm.StorageProfile.OsDisk.Name
```

Create the snapshot configuration. 

 ```powershell
$snapshotConfig =  New-AzSnapshotConfig `
   -SourceUri $disk.Id `
   -OsType Windows `
   -CreateOption Copy `
   -Location $location 
```

Take the snapshot.

```powershell
$snapShot = New-AzSnapshot `
   -Snapshot $snapshotConfig `
   -SnapshotName $snapshotName `
   -ResourceGroupName $resourceGroupName
```


To use this snapshot to create a VM that needs to be high-performing, add the parameter `-AccountType Premium_LRS` to the New-AzSnapshotConfig command. This parameter creates the snapshot so that it's stored as a Premium Managed Disk. Premium Managed Disks are more expensive than Standard, so be sure you'll need Premium before using this parameter.

### Create a new disk from the snapshot

Create a managed disk from the snapshot by using [New-AzDisk](https://docs.microsoft.com/powershell/module/az.compute/new-azdisk). This example uses *myOSDisk* for the disk name.

Create a new resource group for the new VM.

```powershell
$destinationResourceGroup = 'myDestinationResourceGroup'
New-AzResourceGroup -Location $location `
   -Name $destinationResourceGroup
```

Set the OS disk name. 

```powershell
$osDiskName = 'myOsDisk'
```

Create the managed disk.

```powershell
$osDisk = New-AzDisk -DiskName $osDiskName -Disk `
    (New-AzDiskConfig  -Location $location -CreateOption Copy `
	-SourceResourceId $snapshot.Id) `
    -ResourceGroupName $destinationResourceGroup
```


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
To be able to sign in to your VM with remote desktop protocol (RDP), you'll need to have a security rule that allows RDP access on port 3389. In our example, the VHD for the new VM was created from an existing specialized VM, so you can use an account that existed on the source virtual machine for RDP.

This example sets the network security group (NSG) name to *myNsg* and the RDP rule name to *myRdpRule*.

```powershell
$nsgName = "myNsg"

$rdpRule = New-AzNetworkSecurityRuleConfig -Name myRdpRule -Description "Allow RDP" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 110 `
    -SourceAddressPrefix Internet -SourcePortRange * `
    -DestinationAddressPrefix * -DestinationPortRange 3389
$nsg = New-AzNetworkSecurityGroup `
   -ResourceGroupName $destinationResourceGroup `
   -Location $location `
   -Name $nsgName -SecurityRules $rdpRule
	
```

For more information about endpoints and NSG rules, see [Opening ports to a VM in Azure by using PowerShell](nsg-quickstart-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

### Create a public IP address and NIC
To enable communication with the virtual machine in the virtual network, you'll need a [public IP address](../../virtual-network/public-ip-addresses.md) and a network interface.

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

Add the OS disk to the configuration by using [Set-AzVMOSDisk](https://docs.microsoft.com/powershell/module/az.compute/set-azvmosdisk). This example sets the size of the disk to *128 GB* and attaches the managed disk as a *Windows* OS disk.
 
```powershell
$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -StorageAccountType Standard_LRS `
    -DiskSizeInGB 128 -CreateOption Attach -Windows
```

### Complete the VM 

Create the VM by using [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) with the configurations that we just created.

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

