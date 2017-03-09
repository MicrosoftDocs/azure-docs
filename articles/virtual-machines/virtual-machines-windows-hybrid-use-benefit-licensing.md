---
title: Azure Hybrid Use Benefit for Window Server and Windows Client| Microsoft Docs
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure
services: virtual-machines-windows
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid: 332583b6-15a3-4efb-80c3-9082587828b0
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/17/2016
ms.author: georgem

---
# Azure Hybrid Use Benefit 
The Azure Hybrid Use Benefit allows you to bring your on-premises Windows Client and Windows Server licenses to Azure and run  Windows Server and Windows Client virtual machines (VMs) in Azure at a reduced cost. For more information, please see the [Azure Hybrid Use Benefit licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/). 

For Windows Client customers are required to 

## Ways to use Azure Hybrid Use Benefit
There are a couple of different ways to deploy Windows VMs with the Azure Hybrid Use Benefit:

1. If you have an Enterprise Agreement subscription, you can [deploy VMs from specific Marketplace images](#deploy-a-vm-using-the-azure-marketplace) that are pre-configured with Azure Hybrid Use Benefit.
2. Without an Enterprise Agreement, you can [upload a custom VM](#upload-a-windows-vhd) and [deploy using a Resource Manager template](#deploy-a-vm-via-resource-manager) or [Azure PowerShell](#detailed-powershell-deployment-walkthrough).

## Deploy a VM using the Azure Marketplace
For customers with [Enterprise Agreement subscriptions](https://www.microsoft.com/Licensing/licensing-programs/enterprise.aspx), images are available in the Marketplace pre-configured with Azure Hybrid Use Benefit. These images can be deployed directly from the Azure portal, Resource Manager templates, or Azure PowerShell, for example. Images in the Marketplace are noted by the `[HUB]` name as follows:

![Azure Hybrid Use Benefit images in Azure Marketplace](./media/virtual-machines-windows-hybrid-use-benefit/ahub-images-portal.png)

You can deploy these images directly from the Azure portal. For use in Resource Manager templates and with Azure PowerShell, view the list of images as follows:

For Windows Server:
```powershell
Get-AzureRMVMImageSku -Location "West US" -Publisher "MicrosoftWindowsServer" `
    -Offer "WindowsServer-HUB"
```

For Windows Client:
```powershell
Get-AzureRMVMImageSku -Location "West US" -Publisher "MicrosoftWindowsServer" `
    -Offer "Windows-HUB"
```

If you don't have an Enterprise Agreement subscription, continue reading for instructions on how to upload a custom VM and deploy with Azure Hybrid Use Benefit.


## Upload a Windows VHD
To deploy a Windows VM in Azure, you first need to create a VHD that contains your base Windows build. This VHD must be appropriately prepared via Sysprep before you upload it to Azure. You can [read more about the VHD requirements and Sysprep process](virtual-machines-windows-upload-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles). Back up the VM before running Sysprep. 

Make sure you have [installed and configured the latest Azure PowerShell](../powershell-install-configure.md). Once you have prepared your VHD, upload the VHD to your Azure Storage account using the `Add-AzureRmVhd` cmdlet as follows:

```powershell
Add-AzureRmVhd -ResourceGroupName "myResourceGroup" -LocalFilePath "C:\Path\To\myvhd.vhd" `
    -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd"
```

> [!NOTE]
> Microsoft SQL Server, SharePoint Server, and Dynamics can also utilize your Software Assurance licensing. You still need to prepare the Windows Server image by installing your application components and providing license keys accordingly, then uploading the disk image to Azure. Review the appropriate documentation for running Sysprep with your application, such as [Considerations for Installing SQL Server using Sysprep](https://msdn.microsoft.com/library/ee210754.aspx) or [Build a SharePoint Server 2016 Reference Image (Sysprep)](http://social.technet.microsoft.com/wiki/contents/articles/33789.build-a-sharepoint-server-2016-reference-image-sysprep.aspx).
>
>

You can also read more about [uploading the VHD to Azure process](virtual-machines-windows-upload-image.md#upload-the-vhd-to-your-storage-account)


## Deploy an uploaded VM via Resource Manager
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified. You can read more about [authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). Once you have your VHD uploaded to Azure, edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:

For Windows Server:
```json
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   },
```

For Windows Client:
```json
"properties": {  
   "licenseType": "Windows_Client",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   },
```

## Deploy an uploaded VM via PowerShell quickstart
When deploying your Windows Server VM via PowerShell, you have an additional parameter for `-LicenseType`. Once you have your VHD uploaded to Azure, you create a VM using `New-AzureRmVM` and specify the licensing type as follows:

For Windows Server:
```powershell
New-AzureRmVM -ResourceGroupName "myResourceGroup" -Location "West US" -VM $vm -LicenseType "Windows_Server"
```

For Windows Client:
```powershell
New-AzureRmVM -ResourceGroupName "myResourceGroup" -Location "West US" -VM $vm -LicenseType "Windows_Client"
```

You can [read a more detailed walkthrough on deploying a VM in Azure via PowerShell](virtual-machines-windows-hybrid-use-benefit-licensing.md#detailed-powershell-deployment-walkthrough) below, or read a more descriptive guide on the different steps to [create a Windows VM using Resource Manager and PowerShell](virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


## Verify your VM is utilizing the licensing benefit
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, verify the license type with `Get-AzureRmVM` as follows:

```powershell
Get-AzureRmVM -ResourceGroup "myResourceGroup" -Name "myVM"
```

The output is similar to the following example for Windows Server:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Server
```

This output contrasts with the following VM deployed without Azure Hybrid Use Benefit licensing, such as a VM deployed straight from the Azure Gallery:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```

## Detailed PowerShell deployment walkthrough
The following detailed PowerShell steps show a full deployment of a VM. You can read more context as to the actual cmdlets and different components being created in [Create a Windows VM using Resource Manager and PowerShell](virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). You step through creating your resource group, storage account, and virtual networking, then define your VM and finally create your VM.

First, securely obtain credentials, set a location, and resource group name:

```powershell
$cred = Get-Credential
$location = "West US"
$resourceGroupName = "myResourceGroup"
```

Create a public IP:

```powershell
$publicIPName = "myPublicIP"
$publicIP = New-AzureRmPublicIpAddress -Name $publicIPName -ResourceGroupName $resourceGroupName `
    -Location $location -AllocationMethod "Dynamic"
```

Define your subnet, NIC, and VNET:

```powershell
$subnetName = "mySubnet"
$nicName = "myNIC"
$vnetName = "myVnet"
$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/8
$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroupName -Location $location `
    -AddressPrefix 10.0.0.0/8 -Subnet $subnetconfig
$nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $resourceGroupName -Location $location `
    -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $publicIP.Id
```

Name your VM and create a VM config:

```powershell
$vmName = "myVM"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A1"
```

Define your OS:

```powershell
$computerName = "myVM"
$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred `
    -ProvisionVMAgent -EnableAutoUpdate
```

Add your NIC to the VM:

```powershell
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Define the storage account to use:

```powershell
$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -AccountName mystorageaccount
```

Upload your VHD, suitably prepared, and attach to your VM for use:

```powershell
$osDiskName = "licensing.vhd"
$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName
$urlOfUploadedImageVhd = "https://mystorageaccount.blob.core.windows.net/vhd/myvhd.vhd"
$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption FromImage `
    -SourceImageUri $urlOfUploadedImageVhd -Windows
```

Finally, create your VM and define the licensing type to utilize Azure Hybrid Use Benefit:

For Windows Server:
```powershell
New-AzureRmVM -ResourceGroupName $resourceGroupName -Location $location -VM $vm -LicenseType "Windows_Server"
```

For Windows Client:
```powershell
New-AzureRmVM -ResourceGroupName $resourceGroupName -Location $location -VM $vm -LicenseType "Windows_Client"
```

## Next steps
Read more about [Azure Hybrid Use Benefit licensing](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

Learn more about [using Resource Manager templates](../azure-resource-manager/resource-group-overview.md).
