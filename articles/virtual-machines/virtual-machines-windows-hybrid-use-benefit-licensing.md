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
   ms.date="05/02/2016"
   ms.author="georgem"/>

# Azure Hybrid Use Benefit for Windows Server

For customers using Windows Server with Software Assurance, you can bring your on-prem Windows Server licenses to Azure and greatly reduce the cost of running Windows Server VMs. The Azure Hybrid Use Benefit allows (AHUB you to run Windows Server VMs in Azure but only get billed for the base compute rate. For more information, please see the [Azure Hybrid Use Benefit licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/). This article explains how to create and deploy Windows Server VMs to make use of this licensing benefit.

> [AZURE.NOTE] You cannot use the Azure Gallery images for Windows Server to deploy VMs and utilize AHUB. You must deploy your VMs using either PowerShell or Resource Manager templates in to correctly register your VMs as eligible for base compute rate discount.

## Deploy Windows Server VM via PowerShell
When deploying your Windows Server VM via PowerShell, you add an additional parameter for `-LicenseType`. This can either be `-WindowsServer` or `-WindowsClient` depending on the OS you are deploying and appropriately licensed for. In the following quick-start example, you first upload a VHD that you have appropriately prepared:

```
Add-AzureRmVhd -ResourceGroupName MyResourceGroup -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd" -LocalFilePath 'C:\Path\To\myvhd.vhd'
```

Then you can create a new VM using `New-AzureRmVM` and specify the licensing type with the following:

```
New-AzureRmVM -ResourceGroupName MyResourceGroup -Location "West US" -VM $vm
    -LicenseType Windows_Server
```

## Deploy Windows Server VM via Resource Manager
Within your existing Resource Manager templates, an additional parameter for `licenseType` can be specified when declaring your VMs for either `Windows_Server` or `Windows_Client` depending on the OS you are deploying and appropriately licensed for. The following details an example of specifying the license type within a Resource Manager template:

```
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   },
```
 
## Verify your VM is utilizing AHUB
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, you verify the the license type with `Get-AzureRmVM` as follows:
 
```
Get-AzureRmVM -ResourceGroup MyResourceGroup -Name MyVM
```

You should output similar to the following:

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
 
## Detailed walkthrough
 
```
# Securely obtain our credentials
$cred = Get-Credential

# Set your region, name your resource group, and create a public IP
$location = "West US"
$rgname = "TestLicensing"
$pipName = "testlicensingpip"
$pip = New-AzureRmPublicIpAddress -Name $pipName -ResourceGroupName $rgName -Location $location -AllocationMethod Dynamic

# Define your subnets, NIC, and VNET
$subnet1Name = "testlicensingsubnet"
$nicname = "testlicensingnic"
$vnetName = "testlicensingvnet"
$subnetconfig = New-AzureRmVirtualNetworkSubnetConfig -Name $subnet1Name -AddressPrefix 10.0.0.0/8
$vnet = New-AzureRmVirtualNetwork -Name $vnetName -ResourceGroupName $rgName -Location $location -AddressPrefix 10.0.0.0/8 -Subnet $subnetconfig
$nic = New-AzureRmNetworkInterface -Name $nicname -ResourceGroupName $rgName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id

# Name your VM and create a VM config
$vmName = "testlicensing"
$vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize "Standard_A1"

# Define your OS
$computerName = "testlicensing"
$vm = Set-AzureRmVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName -Credential $cred -ProvisionVMAgent -EnableAutoUpdate

# Add your NIC to the VM
$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id

# Define the storage account to use
$storageAcc = Get-AzureRmStorageAccount -ResourceGroupName $rgName -AccountName testlicensingikf

# Upload your VHD, suitably prepared, and attach to your VM for use
$osDiskName = "licensing.vhd"
$osDiskUri = '{0}vhds/{1}{2}.vhd' -f $storageAcc.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName
$urlOfUploadedImageVhd = "https://testlicensingikf.blob.core.windows.net/vhd/licensing.vhd"
$vm = Set-AzureRmVMOSDisk -VM $vm -Name $osDiskName -VhdUri $osDiskUri -CreateOption fromImage -SourceImageUri $urlOfUploadedImageVhd -Windows

# Finally, create your VM and define the licensing type to utilize AHUB
New-AzureRmVM -ResourceGroupName $rgName -Location $location -VM $vm -LicenseType Windows_Server
```

## Next steps

Read more about [Azure Hybrid Use Benefit licensing](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

Learn more about [using Resource Manager templates](../resource-group-overview.md).