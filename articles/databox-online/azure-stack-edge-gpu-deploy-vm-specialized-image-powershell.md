---
title: Create VM images from specialized image of Windows VHD for your Azure Stack Edge Pro GPU device
description: Describes how to create VM images from specialized images starting from a Windows VHD or a VHDX. Use this specialized image to create VM images to use with VMs deployed on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.custom: devx-track-arm-template, devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/28/2023
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro GPU device so that I can deploy VMs on the device.
---

# Deploy a VM from a specialized image on your Azure Stack Edge Pro GPU device via Azure PowerShell 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the steps required to deploy a virtual machine (VM) on your Azure Stack Edge Pro GPU device from a specialized image. 

To prepare a generalized image for deploying VMs in Azure Stack Edge Pro GPU, see [Prepare generalized image from Windows VHD](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md) or [Prepare generalized image from an ISO](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md).

## About VM images

A Windows VHD or VHDX can be used to create a *specialized* image or a *generalized* image. The following table summarizes key differences between the *specialized* and the *generalized* images.

[!INCLUDE [about-vm-images-for-azure-stack-edge](../../includes/azure-stack-edge-about-vm-images.md)]

## Workflow

The high-level workflow to deploy a VM from a specialized image is:

1. Copy the VHD to a local storage account on your Azure Stack Edge Pro GPU device.
1. Create a new managed disk from the VHD.
1. Create a new virtual machine from the managed disk and attach the managed disk.

## Prerequisites

Before you can deploy a VM on your device via PowerShell, make sure that:

- You have access to a client that you use to connect to your device.
    - Your client runs a [Supported OS](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device).
    - Your client is configured to connect to the local Azure Resource Manager of your device as per the instructions in [Connect to Azure Resource Manager for your device](azure-stack-edge-gpu-connect-resource-manager.md).

## Verify the local Azure Resource Manager connection

Verify that your client can connect to the local Azure Resource Manager. 

1. Call local device APIs to authenticate:

    ```powershell
    Login-AzureRMAccount -EnvironmentName <Environment Name>
    ```

2. Provide the username `EdgeArmUser` and the password to connect via Azure Resource Manager. If you don't recall the password, [Reset the password for Azure Resource Manager](azure-stack-edge-gpu-set-azure-resource-manager-password.md) and use this password to sign in.

## Deploy VM from specialized image

The following sections contain step-by-step instructions to deploy a VM from a specialized image.

## Copy VHD to local storage account on device

Follow these steps to copy VHD to local storage account:

1. Copy the source VHD to a local blob storage account on your Azure Stack Edge.

1. Take note of the resulting URI. You use this URI in a later step.

    To create and access a local storage account, see the sections [Create a storage account](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#create-a-local-storage-account) through [Upload a VHD](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#upload-a-vhd) in the article: [Deploy VMs on your Azure Stack Edge device via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md). 

## Create a managed disk from VHD

Follow these steps to create a managed disk from a VHD that you uploaded to the storage account earlier:

1. Set some parameters.

    ```powershell
    $VhdURI = <URI of VHD in local storage account>
    $DiskRG = <managed disk resource group>
    $DiskName = <managed disk name>    
    ```
    Here's an example output.

    ```powershell
    PS C:\WINDOWS\system32> $VHDURI = "https://myasevmsa.blob.myasegpudev.wdshcsso.com/vhds/WindowsServer2016Datacenter.vhd"
    PS C:\WINDOWS\system32> $DiskRG = "myasevm1rg"
    PS C:\WINDOWS\system32> $DiskName = "myasemd1"
    ```
1. Create a new managed disk.

    ```powershell
    $StorageAccountId = (Get-AzureRmStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName).Id
    
    $DiskConfig = New-AzureRmDiskConfig -Location DBELocal -StorageAccountId $StorageAccountId -CreateOption Import -SourceUri "Source URL for your VHD"

    ```

    Here's an example output. The location here is set to the location of the local storage account and is always `DBELocal` for all local storage accounts on your Azure Stack Edge Pro GPU device. 

    ```powershell
    PS C:\WINDOWS\system32> $DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import -SourceUri $VHDURI
    PS C:\WINDOWS\system32> $disk = New-AzureRMDisk -ResourceGroupName $DiskRG -DiskName $DiskName -Disk $DiskConfig
    PS C:\WINDOWS\system32>    
    ```
## Create a VM from managed disk

Follow these steps to create a VM from a managed disk:

1. Set some parameters.

    ```powershell
    $NicRG = <NIC resource group>
    $NicName = <NIC name>
    $IPConfigName = <IP config name>
    $PrivateIP = <IP address> #Optional
    
    $VMRG = <VM resource group>
    $VMName = <VM name>
    $VMSize = <VM size> 
    ```

    >[!NOTE]
    > The `PrivateIP` parameter is optional. Use this parameter to assign a static IP else the default is a dynamic IP using DHCP.

    Here's an example output. In this example, the same resource group is specified for all the VM resources though you can create and specify separate resource groups for the resources if needed.

    ```powershell
    PS C:\WINDOWS\system32> $NicRG = "myasevm1rg"
    PS C:\WINDOWS\system32> $NicName = "myasevmnic1"
    PS C:\WINDOWS\system32> $IPConfigName = "myaseipconfig1" 

    PS C:\WINDOWS\system32> $VMRG = "myasevm1rg"
    PS C:\WINDOWS\system32> $VMName = "myasetestvm1"
    PS C:\WINDOWS\system32> $VMSize = "Standard_D1_v2"   
    ```

1. Get the virtual network information and create a new network interface.

    This sample assumes you're creating a single network interface on the default virtual network `ASEVNET` that is associated with the default resource group `ASERG`. If needed, you could specify an alternate virtual network, or create multiple network interfaces. For more information, see [Add a network interface to a VM via the Azure portal](azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal.md).

    ```powershell
    $armVN = Get-AzureRMVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG
    $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name $IPConfigName -SubnetId $armVN.Subnets[0].Id [-PrivateIpAddress $PrivateIP]
    $nic = New-AzureRmNetworkInterface -Name $NicName -ResourceGroupName $NicRG -Location DBELocal -IpConfiguration $ipConfig
    ```

    Here's an example output.

    ```powershell
    PS C:\WINDOWS\system32> $armVN = Get-AzureRMVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG
    PS C:\WINDOWS\system32> $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name $IPConfigName -SubnetId $armVN.Subnets[0].Id
    PS C:\WINDOWS\system32> $nic = New-AzureRmNetworkInterface -Name $NicName -ResourceGroupName $NicRG -Location DBELocal -IpConfiguration $ipConfig
    WARNING: The output object type of this cmdlet will be modified in a future release.
    PS C:\WINDOWS\system32>    
    ```
1. Create a new VM configuration object.

    ```powershell
    $vmConfig = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
    ```

    
1. Add the network interface to the VM.

    ```powershell
    $vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
    ```

1. Set the OS disk properties on the VM.

    ```powershell
    $vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $disk.Id -StorageAccountType StandardLRS -CreateOption Attach –[Windows/Linux]
    ```
    The last flag in this command will be either `-Windows` or `-Linux` depending on which OS you're using for your VM.

1. Create the VM.

    ```powershell
    New-AzureRmVM -ResourceGroupName $VMRG -Location DBELocal -VM $vm 
    ```

    Here's an example output. 

    ```powershell
    PS C:\WINDOWS\system32> $vmConfig = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
    PS C:\WINDOWS\system32> $vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
    PS C:\WINDOWS\system32> $vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $disk.Id -StorageAccountType StandardLRS -CreateOption Attach -Windows
    PS C:\WINDOWS\system32> New-AzureRmVM -ResourceGroupName $VMRG -Location DBELocal -VM $vm
    WARNING: Since the VM is created using premium storage or managed disk, existing standard storage account, myasevmsa, is used for
    boot diagnostics.    
    RequestId IsSuccessStatusCode StatusCode ReasonPhrase
    --------- ------------------- ---------- ------------
                             True         OK OK        
    PS C:\WINDOWS\system32>
    ```

## Delete VM and resources

This article used only one resource group to create all the VM resource. Deleting that resource group deletes the VM and all the associated resources. 

1. First view all the resources created under the resource group.

    ```powershell
    Get-AzureRmResource -ResourceGroupName <Resource group name>
    ```
    Here's an example output.
    
    ```powershell
    PS C:\WINDOWS\system32> Get-AzureRmResource -ResourceGroupName myasevm1rg
    
    
    Name              : myasemd1
    ResourceGroupName : myasevm1rg
    ResourceType      : Microsoft.Compute/disks
    Location          : dbelocal
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myasevm1rg/providers/Microsoft.Compute/disk
                        s/myasemd1
    
    Name              : myasetestvm1
    ResourceGroupName : myasevm1rg
    ResourceType      : Microsoft.Compute/virtualMachines
    Location          : dbelocal
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myasevm1rg/providers/Microsoft.Compute/virt
                        ualMachines/myasetestvm1
    
    Name              : myasevmnic1
    ResourceGroupName : myasevm1rg
    ResourceType      : Microsoft.Network/networkInterfaces
    Location          : dbelocal
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myasevm1rg/providers/Microsoft.Network/netw
                        orkInterfaces/myasevmnic1
    
    Name              : myasevmsa
    ResourceGroupName : myasevm1rg
    ResourceType      : Microsoft.Storage/storageaccounts
    Location          : dbelocal
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myasevm1rg/providers/Microsoft.Storage/stor
                        ageaccounts/myasevmsa
    
    PS C:\WINDOWS\system32>
    ```

1. Delete the resource group and all the associated resources.

    ```powershell
    Remove-AzureRmResourceGroup -ResourceGroupName <Resource group name>
    ```
    Here's an example output.
    
    ```powershell
    PS C:\WINDOWS\system32> Remove-AzureRmResourceGroup -ResourceGroupName myasevm1rg
    
    Confirm
    Are you sure you want to remove resource group 'myasevm1rg'
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
    True
    PS C:\WINDOWS\system32>
    ```

1. Verify that the resource group has deleted. Get all the resource groups that exist on the device. 

    ```powershell
    Get-AzureRmResourceGroup
    ```
    Here's an example output.

    ```powershell
    PS C:\WINDOWS\system32> Get-AzureRmResourceGroup

    ResourceGroupName : ase-image-resourcegroup
    Location          : dbelocal
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/ase-image-resourcegroup
    
    ResourceGroupName : ASERG
    Location          : dbelocal
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/ASERG
    
    ResourceGroupName : myaserg
    Location          : dbelocal
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/992601bc-b03d-4d72-598e-d24eac232122/resourceGroups/myaserg
        
    PS C:\WINDOWS\system32>
    ```

## Next steps

- [Prepare a generalized image from a Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md)
- [Prepare a generalized image from an ISO to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md)
d
