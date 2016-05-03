<properties
   pageTitle="Azure Hybrid Use Benefit for Window Server | Microsoft Azure"
   description="Learn how to maximize your Windows Server Software Assurance benefits to bring on-prem licenses to Azure"
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
   ms.date="05/03/2016"
   ms.author="georgem"/>

# Azure Hybrid Use Benefit for Windows Server

For customers using Windows Server with Software Assurance, you can bring your on-prem Windows Server licenses to Azure and greatly reduce the cost of running Windows Server VMs. The Azure Hybrid Use Benefit (AHUB) allows you to run Windows Server VMs in Azure and only get billed for the base compute rate. For more information, please see the [Azure Hybrid Use Benefit licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/). This article explains how to create and deploy Windows Server VMs to make use of this licensing benefit.

> [AZURE.NOTE] You cannot use Azure Gallery images to deploy Windows Server VMs utilizing AHUB. You must deploy your VMs using either PowerShell or Resource Manager templates in to correctly register your VMs as eligible for base compute rate discount.

## Deploy Windows Server VM via PowerShell Quick-Start
When deploying your Windows Server VM via PowerShell, you have an additional parameter for `-LicenseType`. This can either be `-WindowsServer` or `-WindowsClient` depending on the OS you are deploying and appropriately licensed for. 

In the following quick-start example, first upload a VHD that you have [appropriately prepared via Sysprep](./virtual-machines-windows-upload-image.md#prepare-the-vhd-for-upload):

```
Add-AzureRmVhd -ResourceGroupName MyResourceGroup -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd" -LocalFilePath 'C:\Path\To\myvhd.vhd'
```

Now create a new VM using `New-AzureRmVM` and specify the licensing type as follows:

```
New-AzureRmVM -ResourceGroupName MyResourceGroup -Location "West US" -VM $vm
    -LicenseType Windows_Server
```

## Deploy Windows Server VM via Resource Manager
Within your Resource Manager templates, an additional parameter for `licenseType` can be specified when declaring your VMs for either `Windows_Server` or `Windows_Client` depending on the OS you are deploying and appropriately licensed for. You can read more about [authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

As with deploying from PowerShell, you first need to upload a VHD that you have [appropriately prepared via Sysprep](./virtual-machines-windows-upload-image.md#prepare-the-vhd-for-upload):

```
Add-AzureRmVhd -ResourceGroupName MyResourceGroup -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd" -LocalFilePath 'C:\Path\To\myvhd.vhd'
```

You now edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:

```
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   },
```
 
## Verify your VM is utilizing AHUB
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, verify the the license type with `Get-AzureRmVM` as follows:
 
```
Get-AzureRmVM -ResourceGroup MyResourceGroup -Name MyVM
```

You will see output similar to the following:

```
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Server
```

This contrasts with the following VM deployed without AHUB licensing, such as a VM deployed straight from the Azure Gallery:

```
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : 
```
 
## Deploy Windows Server VM via PowerShell Detailed walkthrough

The following detailed PowerShell steps show a full deployment of a VM. You can read more context as to the actual cmdlets and different components being created in [Create a Windows VM using Resource Manager and PowerShell](./virtual-machines-windows-ps-create.md).
 
Securely obtain credentials, set a location, and resource group name:

```
$cred = Get-Credential
$location = "West US"
$rgname = "TestLicensing"
```

Create a public IP:

```
$pipName = "testlicensingpip"
$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic
```

Define your subnet, NIC, and VNET:

```
$subnet1Name = "testlicensingsubnet"
$nicname = "testlicensingnic"
$vnetName = "testlicensingvnet"
$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix 10.0.0.0/8
$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix 10.0.0.0/8 -Subnet $subnetconfig
$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id
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
$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName testlicensing
```

Upload your VHD, suitably prepared, and attach to your VM for use:

```
$osDiskName = "licensing.vhd"
$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName
$urlOfUploadedImageVhd = "https://testlicensing.blob.core.windows.net/vhd/licensing.vhd"
$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $urlOfUploadedImageVhd -Windows
```

Finally, create your VM and define the licensing type to utilize AHUB

```
New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm -LicenseType Windows_Server
```

## Next steps

Read more about [Azure Hybrid Use Benefit licensing](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

Learn more about [using Resource Manager templates](../resource-group-overview.md).