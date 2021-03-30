---
title: Create VM images from specialized image of Windows VHD for your Azure Stack Edge Pro GPU device
description: Describes how to create VM images from specialized images starting from a Windows VHD or a VHDX. Use this specialized image to create VM images to use with VMs deployed on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/30/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Deploy a VM from a specialized image on your Azure Stack Edge Pro device via Azure PowerShell 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the steps required to deploy a virtual machine (VM) on your Azure Stack Edge Pro device from a specialized image. 

## About specialized images

A Windows VHD or VHDX can be used to create a *specialized* image or a *generalized* image. The following table summarizes key differences between the *specialized* and the *generalized* images.


|Image type  |Generalized  |Specialized  |
|---------|---------|---------|
|Target     |Deployed on any system         | Targeted to a specific system        |
|Setup after boot     | Setup required at first boot of the VM.          | Setup not needed. <br> Platform turns the VM on.        |
|Configuration     |Hostname, admin-user, and other VM-specific settings required.         |Completely pre-configured.         |
|Used to     |Create multiple new VMs from the same image.         |Migrate a specific machine or restoring a VM from previous backup.         |


This article covers steps required to deploy from a specialized image. To deploy from a generalized image, see [Use generalized Windows VHD](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md) for your device.


## VM image workflow

The high-level workflow to deploy a VM from a specialized image is:

1. Copy the VHD to a local storage account on your Azure Stack Edge Pro GPU device.
1. Create a new managed disk from the VHD.
1. Create a new virtual machine and attach the managed disk.


## Prerequisites

Before you can deploy a VM on your device via PowerShell, make sure that:

- You have access to a client that you'll use to connect to your device.
    - Your client runs a [Supported OS](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device).
    - Your client is configured to connect to the local Azure Resource Manager of your device as per the instructions in [Connect to Azure Resource Manager for your device](azure-stack-edge-gpu-connect-resource-manager.md).

## Verify the local Azure Resource Manager connection

Verify that your client can connect to the local Azure Resource Manager. 

1. Call local device APIs to authenticate:

    ```powershell
    Login-AzureRMAccount -EnvironmentName <Environment Name>
    ```

2. Provide the username `EdgeARMuser` and the password to connect via Azure Resource Manager. If you do not recall the password, [Reset the password for Azure Resource Manager](azure-stack-edge-gpu-set-azure-resource-manager-password.md) and use this password to sign in.
 

## Deploy VM from specialized image

## Copy VHD to local storage account on device

Follow these steps to copy VHD to local storage account:

1. Copy the source VHD to a local blob storage account on your Azure Stack Edge. 

1. Take note of the resulting URI. You'll use this URI in a later step.
    
    To create and access a local storage account, see the sections [Create a storage account](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#create-a-storage-account) through [Upload a VHD](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#upload-a-vhd) in the article: [Deploy VMs on your Azure Stack Edge device via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md). 

## Create a managed disk from VHD

Follow these steps to create a managed disk from a VHD that you uploaded to the storage account earlier:

1. Set some parameters.

    ```powershell
    $VhdURI = <URI of VHD in local storage account>
    $DiskRG = <managed disk resource group>
    $DiskName = <managed disk name>    
    ```

1. Create a new managed disk.

    ```powershell
    $DiskConfig = New-AzureRmDiskConfig -Location DBELocal -CreateOption Import -SourceUri $VhdURI
    $disk = New-AzureRMDisk -ResourceGroupName $DiskRG -DiskName $DiskName -Disk $DiskConfig
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
    > The PrivateIP parameter is optional. Using it will give a static IP to your network interface. Otherwise, it will default to a dynamic IP using DHCP.

1. Get the virtual network info and create a new network interface.

    This sample assumes you are creating a single network interface on the default VNET. If needed, you could specify an alternate VNET, or create multiple network interfaces. For more information, see [Add a network interface to a VM via the Azure portal](azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal.md).

    ```powershell
    $armVN = Get-AzureRMVirtualNetwork -Name ASEVNET -ResourceGroupName ASERG
    $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name $IPConfigName -SubnetId $armVN.Subnets[0].Id [-PrivateIpAddress $PrivateIP  ]
    $nic = New-AzureRmNetworkInterface -Name $NicName -ResourceGroupName $NicRG -Location DBELocal -IpConfiguration $ipConfig
    ```

1. Create a new VM configuration object.

    ```powershell
    $vmConfig = New-AzureRmVMConfig -VMName $VMName -VMSize $VMSize
    ```

1. Add the network interface to the VM.

    ```powershell
    $vm = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id
    ```

1. Set the OS Disk.

    The last flag in this command will be either `-Windows` or `-Linux` depending on which OS you are using.

    ```powershell
    $vm = Set-AzureRmVMOSDisk -VM $vm -ManagedDiskId $disk.Id -StorageAccountType StandardLRS -CreateOption Attach –[Windows/Linux]
    ```

1. Create the VM.

    ```powershell
    New-AzureRmVM -ResourceGroupName $VMRG -Location DBELocal -VM $vm 
    ```


## Next steps

Depending on the nature of deployment, you can choose one of the following procedures.

- [Deploy a VM from a generalized image via Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)  
- [Deploy a VM via Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)

