---
title: Attach an existing OS disk to a VM 
description: Create a new Windows VM by attaching a specialized OS disk.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 03/30/2023
ms.author: cynthn 
ms.custom: devx-track-azurepowershell

---
# Create a VM from a specialized disk by using PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

Create a new VM by attaching an existing OS disk to a new VM. This option is useful if you have a VM that isn't working correctly. You can delete the VM and then reuse the disk to create a new VM.

> [!IMPORTANT]
>
> You can also use the VHD as a source to create an Azure Compute Gallery image. For more information, see [Create an image definition and image version](image-version.md). Customers are encouraged to use Azure Compute Gallery as all new features like ARM64, Trusted Launch, and Confidential VM, are only supported through Azure Compute Gallery.  Creating an image instead of just attaching a disk means you can create multiple VMs from the same source disk.
>
> When you use a specialized disk to create a new VM, the new VM retains the computer name of the original VM. Other computer-specific information (like the CMID) is also kept and, in some cases, this duplicate information could cause issues. When copying a VM, be aware of what types of computer-specific information your applications rely on.  



We recommend that you limit the number of concurrent deployments to 20 VMs from a single VHD or snapshot.


### [Portal](#tab/portal)


Create a snapshot and then create a disk from the snapshot. This strategy allows you to keep the original VHD as a fallback:

1. Open the [Azure portal](https://portal.azure.com).
2. In the search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk appears.
4. From the menu at the top, select **Create snapshot**.
5. Choose a **Resource group** for the snapshot. You can use either an existing resource group or create a new one.
6. Enter a **Name** for the snapshot.
7. For **Snapshot type**, choose **Full**.
8. For **Storage type**, choose **Standard HDD**, **Premium SSD**, or **Zone-redundant** storage.
9. When you're done, select **Review + create** to create the snapshot.
10. After the snapshot has been created, select **Home** > **Create a resource**.
11. In the search box, enter **managed disk** and then select **Managed Disks** from the list.
12. On the **Managed Disks** page, select **Create**.
13. Choose a **Resource group** for the disk. You can use either an existing resource group or create a new one. This selection will also be used as the resource group where you create the VM from the disk.
14. For **Region**, you must select the same region where the snapshot is located.
15. Enter a **Name** for the disk.
16. In **Source type**, ensure **Snapshot** is selected.
17. In the **Source snapshot** drop-down, select the snapshot you want to use.
18. For **Size**, you can change the storage type and size as needed.
19. Make any other adjustments as needed and then select **Review + create** to create the disk. Once validation passes, select **Create**.


After you have the disk that you want to use, you can create the VM in the portal:

1. In the search box, enter **disks** and then select **Disks** to display the list of available disks.
3. Select the disk that you would like to use. The **Disk** page for that disk opens.
4. In the **Essentials** section, ensure that **Disk state** is listed as **Unattached**. If it isn't, you might need to either detach the disk from the VM or delete the VM to free up the disk.
4. In the menu at the top of the page, select **Create VM**.
5. On the **Basics** page for the new VM, enter a **Virtual machine name** and either select an existing **Resource group** or create a new one.
6. For **Size**, select **Change size** to access the **Size** page.
7. The disk name should be pre-filled in the **Image** section.
8. On the **Disks** page, you may notice that the **OS Disk Type** cannot be changed. This preselected value is configured at the point of Snapshot or VHD creation and will carry over to the new VM. If you need to modify disk type take a new snapshot from an existing VM or disk. 
9. On the **Networking** page, you can either let the portal create all new resources or you can select an existing **Virtual network** and **Network security group**. The portal always creates a new network interface and public IP address for the new VM.
10. On the **Management** page, make any changes to the monitoring options.
11. On the **Guest config** page, add any extensions as needed.
12. When you're done, select **Review + create**.
13. If the VM configuration passes validation, select **Create** to start the deployment.




### [PowerShell](#tab/powershell)


If you had a VM that you deleted and you want to reuse the OS disk to create a new VM, use [Get-AzDisk](/powershell/module/az.compute/get-azdisk).

```powershell
$resourceGroupName = 'myResourceGroup'
$osDiskName = 'myOsDisk'
$osDisk = Get-AzDisk `
-ResourceGroupName $resourceGroupName `
-DiskName $osDiskName
```
You can now attach this disk as the OS disk to a new VM.

Create the [virtual network](../virtual-network/virtual-networks-overview.md) and subnet for the VM.

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
    

To be able to sign in to your VM with remote desktop protocol (RDP), you'll need to have a security rule that allows RDP access on port 3389. In our example, the VHD for the new VM was created from an existing Windows specialized VM, so you can use an account that existed on the source virtual machine for RDP. This example denies RDP traffic, to be more secure. You can change `-Access` to `Allow` if you want to allow RDP access.

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

For more information about endpoints and NSG rules, see [Filter network traffic with a network security group](../virtual-network/tutorial-filter-network-traffic-powershell.md).

To enable communication with the virtual machine in the virtual network, you'll need a [public IP address](../virtual-network/ip-services/public-ip-addresses.md) and a network interface.

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
    


Set the VM name and size. This example sets the VM name to *myVM* and the VM size to *Standard_A2*.

```powershell
$vmName = "myVM"
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize "Standard_A2"
```

Add the NIC.
	
```powershell
$vm = Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id
```
	

Add the OS disk. Add the OS disk to the configuration by using [Set-AzVMOSDisk](/powershell/module/az.compute/set-azvmosdisk). This example sets the size of the disk to *128 GB* and attaches the disk as a *Windows* OS disk.
 
```powershell
$vm = Set-AzVMOSDisk -VM $vm -ManagedDiskId $osDisk.Id -StorageAccountType Standard_LRS `
    -DiskSizeInGB 128 -CreateOption Attach -Windows
```

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

You should see the newly created VM either in the [Azure portal](https://portal.azure.com) under **Browse** > **Virtual machines**, or by using the following PowerShell commands.

```powershell
$vmList = Get-AzVM -ResourceGroupName $destinationResourceGroup
$vmList.Name
```
---
**Next steps**
Learn more about [Azure Compute Gallery](azure-compute-gallery.md).