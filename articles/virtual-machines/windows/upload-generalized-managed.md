---
title: Create a VM from an uploaded generalized VHD 
description: Upload a generalized VHD to Azure and use it to create new VMs, in the Resource Manager deployment model.
author: cynthn
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: article
ms.date: 12/12/2019
ms.author: cynthn
---

# Upload a generalized VHD and use it to create new VMs in Azure

This article walks you through using PowerShell to upload a VHD of a generalized VM to Azure, create an image from the VHD, and create a new VM from that image. You can upload a VHD exported from an on-premises virtualization tool or from another cloud. Using [Managed Disks](managed-disks-overview.md) for the new VM simplifies the VM management and provides better availability when the VM is placed in an availability set. 

For a sample script, see [Sample script to upload a VHD to Azure and create a new VM](../scripts/virtual-machines-windows-powershell-upload-generalized-script.md).

## Before you begin

- Before uploading any VHD to Azure, you should follow [Prepare a Windows VHD or VHDX to upload to Azure](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
- Review [Plan for the migration to Managed Disks](on-prem-to-azure.md#plan-for-the-migration-to-managed-disks) before starting your migration to [Managed Disks](managed-disks-overview.md).

 
## Generalize the source VM by using Sysprep

If you haven't already, you need to Sysprep the VM before uploading the VHD to Azure. Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see the [Sysprep Overview](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles).

> [!IMPORTANT]
> If you plan to run Sysprep before uploading your VHD to Azure for the first time, make sure you have [prepared your VM](prepare-for-upload-vhd-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
> 
> 

1. Sign in to the Windows virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to %windir%\system32\sysprep, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is enabled.
4. For **Shutdown Options**, select **Shutdown**.
5. Select **OK**.
   
    ![Start Sysprep](./media/upload-generalized-managed/sysprepgeneral.png)
6. When Sysprep finishes, it shuts down the virtual machine. Do not restart the VM.


## Upload the VHD 

You can now upload a VHD straight into a managed disk. For instructions, see [Upload a VHD to Azure using Azure PowerShell](disks-upload-vhd-to-managed-disk-powershell.md).



Once the VHD is uploaded to the managed disk, you need to use [Get-AzDisk](https://docs.microsoft.com/powershell/module/az.compute/get-azdisk) to get the managed disk.

```azurepowershell-interactive
$disk = Get-AzDisk -ResourceGroupName 'myResourceGroup' -DiskName 'myDiskName'
```

## Create the image
Create a managed image from your generalized OS managed disk. Replace the following values with your own information.

First, set some variables:

```powershell
$location = 'East US'
$imageName = 'myImage'
$rgName = 'myResourceGroup'
```

Create the image using your managed disk.

```azurepowershell-interactive
$imageConfig = New-AzImageConfig `
   -Location $location
$imageConfig = Set-AzImageOsDisk `
   -Image $imageConfig `
   -OsState Generalized `
   -OsType Windows `
   -ManagedDiskId $disk.Id
```

Create the image.

```azurepowershell-interactive
$image = New-AzImage `
   -ImageName $imageName `
   -ResourceGroupName $rgName `
   -Image $imageConfig
```

## Create the VM

Now that you have an image, you can create one or more new VMs from the image. This example creates a VM named *myVM* from *myImage*, in *myResourceGroup*.


```powershell
New-AzVm `
    -ResourceGroupName $rgName `
    -Name "myVM" `
    -Image $image.Id `
    -Location $location `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNSG" `
    -PublicIpAddressName "myPIP" `
    -OpenPorts 3389
```


## Next steps

Sign in to your new virtual machine. For more information, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

