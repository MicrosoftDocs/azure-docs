---
title: Create a VM and storage account for a scalable application in Azure
description: Learn how to deploy a VM to be used to run a scalable application using Azure blob storage
author: roygara
ms.service: azure-storage
ms.topic: tutorial
ms.date: 02/20/2018
ms.author: rogarana
ms.custom: devx-track-azurepowershell
---

# Create a virtual machine and storage account for a scalable application

This tutorial is part one of a series. This tutorial shows you deploy an application that uploads and download large amounts of random data with an Azure storage account. When you're finished, you have a console application running on a virtual machine that you upload and download large amounts of data to a storage account.

In part one of the series, you learn how to:

> [!div class="checklist"]
> - Create a storage account
> - Create a virtual machine
> - Configure a custom script extension

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module Az version 0.7 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a storage account

The sample uploads 50 large files to a blob container in an Azure Storage account. A storage account provides a unique namespace to store and access your Azure storage data objects. Create a storage account in the resource group you created by using the [New-AzStorageAccount](/powershell/module/az.Storage/New-azStorageAccount) command.

In the following command, substitute your own globally unique name for the Blob storage account where you see the `<blob_storage_account>` placeholder.

```powershell-interactive
$storageAccount = New-AzStorageAccount -ResourceGroupName myResourceGroup `
  -Name "<blob_storage_account>" `
  -Location EastUS `
  -SkuName Standard_LRS `
  -Kind Storage `
```

## Create a virtual machine

Create a virtual machine configuration. This configuration includes the settings that are used when deploying the virtual machine such as a virtual machine image, size, and authentication configuration. When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine.

Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm).

```azurepowershell-interactive
# Variables for common values
$resourceGroup = "myResourceGroup"
$location = "eastus"
$vmName = "myVM"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a subnet configuration
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create a virtual network card and associate with public IP address
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName myVM -VMSize Standard_DS14_v2 | `
    Set-AzVMOperatingSystem -Windows -ComputerName myVM -Credential $cred | `
    Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer `
    -Skus 2016-Datacenter -Version latest | Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig

Write-host "Your public IP address is $($pip.IpAddress)"
```

## Deploy configuration

For this tutorial, there are pre-requisites that must be installed on the virtual machine. The custom script extension is used to run a PowerShell script that completes the following tasks:

> [!div class="checklist"]
> - Install .NET core 2.0
> - Install chocolatey
> - Install GIT
> - Clone the sample repo
> - Restore NuGet packages
> - Creates 50 1-GB files with random data

Run the following cmdlet to finalize configuration of the virtual machine. This step takes 5-15 minutes to complete.

```azurepowershell-interactive
# Start a CustomScript extension to use a simple PowerShell script to install .NET core, dependencies, and pre-create the files to upload.
Set-AzVMCustomScriptExtension -ResourceGroupName myResourceGroup `
    -VMName myVM `
    -Location EastUS `
    -FileUri https://raw.githubusercontent.com/azure-samples/storage-dotnet-perf-scale-app/master/setup_env.ps1 `
    -Run 'setup_env.ps1' `
    -Name DemoScriptExtension
```

## Next steps

In part one of the series, you learned about creating a storage account, deploying a virtual machine and configuring the virtual machine with the required pre-requisites such as how to:

> [!div class="checklist"]
> - Create a storage account
> - Create a virtual machine
> - Configure a custom script extension

Advance to part two of the series to upload large amounts of data to a storage account using exponential retry and parallelism.

> [!div class="nextstepaction"]
> [Upload large amounts of large files in parallel to a storage account](storage-blob-scalable-app-upload-files.md)
