---
title: Autoscale Azure Virtual Machine Scale Sets | Microsoft Docs
description: Set up autoscaling for a Windows or Linux Virtual Machine Scale Set using Azure CLI
services: virtual-machine-scale-sets
documentationcenter: ''
author: Thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: ''
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/13/2017
ms.author: adegeo
---

# Automatically scale machines in a virtual machine scale set
Virtual machine scale sets make it easy for you to deploy and manage identical virtual machines as a set. Scale sets provide a highly scalable and customizable compute layer for hyperscale applications, and they support Windows platform images, Linux platform images, custom images, and extensions. For more information about scale sets, see [Virtual Machine Scale Sets](virtual-machine-scale-sets-overview.md).

This tutorial will show you how to create an Azure Resource Manager template that will deploy a Virtual Machine Scale Set. You will deploy the following types of resources through the template:

* Microsoft.Storage/storageAccounts
* Microsoft.Network/virtualNetworks
* Microsoft.Network/publicIPAddresses
* Microsoft.Network/loadBalancers
* Microsoft.Network/networkInterfaces
* Microsoft.Compute/virtualMachines
* Microsoft.Compute/virtualMachineScaleSets
* Microsoft.Insights.VMDiagnosticsSettings
* Microsoft.Insights/autoscaleSettings

>[!NOTE]
>For more information about Azure Resource Manager resources, see [Azure Resource Manager vs. classic deployment](../azure-resource-manager/resource-manager-deployment-model.md).

## Log in to azure

For more information on how to install, setup, and log into Azure with Azure CLI 2.0, see [Getting Started with Azure CLI 2.0](cli/azure/get-started-with-azure-cli.md).

```azurecli
az login
```

For more informaiton on how to install, setup, and log into Azure with PowerShell, see [Get started with Azure PowerShell cmdlets](powershell/resourcemanager/)

```powershell
Login-AzureRmAccount

```

## Step 1: Create a resource group and storage account


```azurecli
az group create -l "West US" -n "vmss-test-1"
```

```powershell
New-AzureRmResourceGroup
```


```azurecli
az storage account create -l "West US" -n "vmsstest1storage" -g "vmss-test-1" --kind Storage --sku Standard_LRS
```

```powershell
New-AzureRmStorageAccount
```

## Step 2: Create the virtual machine scale set

The virtual machine that backs the scale set can be Windows or Linux. When choosing the VM image you want, you have a few choices. 

1. URN alias  
Use a predefined image by 

 --image             [Required]: The name of the operating system image (URN alias, URN, or URI).
        URN aliases: CentOS, CoreOS, Debian, openSUSE, RHEL, SLES, UbuntuLTS, Win2008R2SP1,
        Win2012Datacenter, Win2012R2Datacenter.
        Example URN: MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest
        Example Custom Image Resource ID or Name: /subscriptions/subscription-
        id/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyImage
        Example URI: http://<storageAccount>.blob.core.windows.net/vhds/osdiskimage.vhd.

```azurecli

```

```powershell

```


## Capture a template


## Use an existing template