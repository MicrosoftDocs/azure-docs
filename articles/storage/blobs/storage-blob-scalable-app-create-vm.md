---
title: Create a virtual machine and storage account for a scalable application | Microsoft Docs 
description: Build a scalable application using Azure blob storage
services: storage
documentationcenter: 
author: georgewallace
manager: timlt
editor: ''

ms.service: storage
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: csharp
ms.topic: tutorial
ms.date: 11/13/2017
ms.author: gwallace
ms.custom: mvc
---

# Create a virtual machine and storage account for a scalable application

This tutorial is part one of a series. This tutorial shows you deploy an application that uploads large amount of random data and download data with an Azure storage account. When you're finished, you have a console application running on a virtual machine that you upload and download large amounts of data to a storage account.

In part one of the series, you learn how to:

> [!div class="checklist"]
> * Create a storage account
> * Create a virtual machine
> * Configure a custom script extension

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a storage account
 
The sample uploads large files to a blob container in an Azure Storage account. A storage account provides a unique namespace to store and access your Azure storage data objects. Create a storage account in the resource group you created by using the [New-AzureRmStorageAccount](/powershell/module/AzureRM.Storage/New-AzureRmStorageAccount) command.

In the following command, substitute your own globally unique name for the Blob storage account where you see the `<blob_storage_account>` placeholder.

```powershell-interactive
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName myResourceGroup `
  -Name "mystorageaccount" `
  -Location EastUS `
  -SkuName Standard_LRS `
  -Kind Storage `
  -EnableEncryptionService Blob
```

## Create virtual machine

Create a virtual machine configuration. This configuration includes the settings that are used when deploying the virtual machine such as a virtual machine image, size, and authentication configuration. When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine.

Create the virtual machine with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm).

```azurepowershell-interactive
# Variables for common values
$resourceGroup = "myResourceGroup"
$location = "eastus"
$vmName = "myVM"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create a virtual network card and associate with public IP address
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName myVM -VMSize Standard_DS14_v2 | `
    Set-AzureRmVMOperatingSystem -Windows -ComputerName myVM -Credential $cred | `
    Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer `
    -Skus 2016-Datacenter -Version latest | Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig

Write-host "Your public IP address is $($pip.IpAddress)"
```

## Deploy configuration

For this tutorial, there are pre-requisites that must be installed on the virtual machine. The custom script extension is used to run a PowerShell script that does the following tasks:

> [!div class="checklist"]
> * Install .NET core 2.0
> * Install chocolatey
> * Install GIT
> * Clone the sample repo
> * Restore NuGet packages
> * Creates 32 1-GB files with random data

Run the following cmdlet to finalize configuration of the virtual machine. This step takes 5-10 minutes to complete.

```azurepowershell-interactive
# Start a CustomScript extension to use a simple PowerShell script to instal .NET core, dependancies, and pre-create the files to upload.
Set-AzureRMVMCustomScriptExtension -ResourceGroupName myResourceGroup `
    -VMName myVM `
    -Location EastUS `
    -FileUri https://raw.githubusercontent.com/georgewallace/StoragePerfandScalabilityExample/master/script.ps1 `
    -Run 'setup_env.ps1' `
    -Name DemoScriptExtension
```

## Next steps

In part one of the series, you learned about creating a storage account, deploying a virtual machine and configuring the virtual machine with the required pre-requisites such as how to:

> [!div class="checklist"]
> * Create a storage account
> * Create a virtual machine
> * Configure a custom script extension

Advance to part two of the series to upload large amounts of data to a storage account using exponential retry and parallelism.

> [!div class="nextstepaction"]
> [Upload large amounts of large files in parallel to a storage account](storage-blob-scalable-app-upload-files.md)