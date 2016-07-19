<properties
   pageTitle="Azure Hybrid Use Benefit for Window Server | Microsoft Azure"
   description="Learn how to maximize your Windows Server Software Assurance benefits to bring on-premises licenses to Azure"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="07/13/2016"
   ms.author="georgem"/>

# Azure Hybrid Use Benefit for Windows Server

For customers using Windows Server with Software Assurance, you can bring your on-premises Windows Server licenses to Azure and run Windows Server VMs in Azure at a reduced cost. The Azure Hybrid Use Benefit allows you to run Windows Server VMs in Azure and only get billed for the base compute rate. For more information, please see the [Azure Hybrid Use Benefit licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/). This article explains how to deploy Windows Server VMs in Azure to make use of this licensing benefit.

> [AZURE.NOTE] You cannot use Azure Marketplace images to deploy Windows Server VMs utilizing the Azure Hybrid Use Benefit. You must deploy your VMs using either PowerShell or Resource Manager templates to correctly register your VMs as eligible for base compute rate discount.

## Pre-requisites
There are a couple of pre-requisites in order to utilize Azure Hybrid Use Benefit for Windows Server VMs in Azure:

- Have the Azure PowerShell module installed
- Have your Windows Server VHD uploaded to Azure Storage

### Install Azure PowerShell
See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about how to install the latest version of Azure PowerShell, select the subscription that you want to use, and sign in to your Azure account. Even if you are going to deploy your VMs using Resource Manager templates, you will still need Azure PowerShell installed in order to upload your Windows Server VHD (see the next step below).

### Upload a Windows Server VHD

In order to deploy a Windows Server VM in Azure you first need to create a VHD that contains your base Windows Server build. This VHD must be appropriately prepared via Sysprep before you upload it to Azure. You can [read more about the VHD requirements and Sysprep process](./virtual-machines-windows-upload-image.md). Once you have prepared your VHD, you upload the VHD to your Azure Storage account using the `Add-AzureRmVhd` cmdlet as follows:

```
Add-AzureRmVhd -ResourceGroupName MyResourceGroup -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd" -LocalFilePath 'C:\Path\To\myvhd.vhd'
```

> [AZURE.NOTE] Microsoft SQL Server, SharePoint Server, and Dynamics can also utilize your Software Assurance licensing. You still need to prepare the Windows Server image by installing your application components and providing license keys accordingly, then uploading the disk image to Azure. Review the appropriate documentation for running Sysprep with your application, such as [Considerations for Installing SQL Server using Sysprep](https://msdn.microsoft.com/library/ee210754.aspx) or [Build a SharePoint Server 2016 Reference Image (Sysprep)](http://social.technet.microsoft.com/wiki/contents/articles/33789.build-a-sharepoint-server-2016-reference-image-sysprep.aspx).

You can also read more about [uploading the VHD to Azure process](./virtual-machines-windows-upload-image.md#upload-the-vm-image-to-your-storage-account).

> [AZURE.TIP] This article focuses on deploying Windows Server VMs, however you can also deploy Windows Client VMs in the same manner. In the following examples, you replace `Server` with `Client` appropriately.

## Deploy a VM via PowerShell Quick-Start
When deploying your Windows Server VM via PowerShell, you have an additional parameter for `-LicenseType`. Once you have your VHD uploaded to Azure, you create a new VM using `New-AzureRmVM` and specify the licensing type as follows:

```
New-AzureRmVM -ResourceGroupName MyResourceGroup -Location "West US" -VM $vm -LicenseType Windows_Server
```

You can [read a more detailed walkthrough on deploying a VM in Azure via PowerShell](./virtual-machines-windows-hybrid-use-benefit-licensing.md#deploy-windows-server-vm-via-powershell-detailed-walkthrough) below, or read a more desriptive guide on the different steps to [create a Windows VM using Resource Manager and PowerShell](./virtual-machines-windows-ps-create.md).

## Deploy a VM via Resource Manager
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified. You can read more about [authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). Once you have your VHD uploaded to Azure, edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:

```
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   },
```
 
## Verify your VM is utilizing the licensing benefit
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, verify the license type with `Get-AzureRmVM` as follows:
 
```
Get-AzureRmVM -ResourceGroup MyResourceGroup -Name MyVM
```

You will see output similar to the following:

```
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Server
```

This contrasts with the following VM deployed without Azure Hybrid Use Benefit licensing, such as a VM deployed straight from the Azure Gallery:

```
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : 
```
 
## Detailed PowerShell Walkthrough

The following detailed PowerShell steps show a full deployment of a VM. You can read more context as to the actual cmdlets and different components being created in [Create a Windows VM using Resource Manager and PowerShell](./virtual-machines-windows-ps-create.md). You'll step through creating your resource group, storage account, and virtual networking, then define your VM and finally create your VM.
 
First, securely obtain credentials, set a location, and resource group name:

```
$cred = Get-Credential
$location = "West US"
$resourceGroupName = "TestLicensing"
```

Create a public IP:

```
$publicIPName = "testlicensingpublicip"
$publicIP = New-AzureRmPublicIpAddress -Name $publicIPName -ResourceGroupName $resourceGroupName -Location $location -AllocationMethod Dynamic
```

Define your subnet, NIC, and VNET:

```
$subnetName = "testlicensingsubnet"
$nicName = "testlicensingnic"
$vnetName = "testlicensingvnet"
$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix 10.0.0.0/8
$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroupName -Location $location -AddressPrefix 10.0.0.0/8 -Subnet $subnetconfig
$nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $resourceGroupName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $publicIP.Id
```

Name your VM and create a VM config:

```
$vmName = "testlicensing"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A1"
```

Define your OS:

```
$computerName = "testlicensing"
$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
```

Add your NIC to the VM:

```
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
```

Define the storage account to use:

```
$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -AccountName testlicensing
```

Upload your VHD, suitably prepared, and attach to your VM for use:

```
$osDiskName = "licensing.vhd"
$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName
$urlOfUploadedImageVhd = "https://testlicensing.blob.core.windows.net/vhd/licensing.vhd"
$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption FromImage -SourceImageUri $urlOfUploadedImageVhd -Windows
```

Finally, create your VM and define the licensing type to utilize Azure Hybrid Use Benefit:

```
New-AzureRmVM -ResourceGroupName $resourceGroupName -Location $location -VM $vm -LicenseType Windows_Server
```

## Next steps

Read more about [Azure Hybrid Use Benefit licensing](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

Learn more about [using Resource Manager templates](../resource-group-overview.md).
