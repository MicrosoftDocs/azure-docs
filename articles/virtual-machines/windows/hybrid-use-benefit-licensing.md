---
title: Azure Hybrid Benefit for Windows Server | Microsoft Docs
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure
services: virtual-machines-windows
documentationcenter: ''
author: xujing
manager: timlt
editor: ''

ms.assetid: 332583b6-15a3-4efb-80c3-9082587828b0
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 4/22/2018
ms.author: xujing-ms

---
# Azure Hybrid Benefit for Windows Server
For customers with Software Assurance, Azure Hybrid Benefit for Windows Server allows you to use your on-premises Windows Server licenses and run Windows virtual machines on Azure at a reduced cost. You can use Azure Hybrid Benefit for Windows Server to deploy new virtual machines with Windows OS. This article goes over the steps on how to deploy new VMs with Azure Hybrid Benefit for Windows Server and how you can update existing running VMs. For more information about Azure Hybrid Benefit for Windows Server licensing and cost savings, see the [Azure Hybrid Benefit for Windows Server licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/).


> [!Important]
> Using Azure Hybrid Benefit for Windows Server with VMs that are charged for additional software such as SQL Server or any of the third-party marketplace images is now available in all regions.
>

> [!NOTE]
> For classic VMs, only deploying new VM from on-prem custom images is supported. To take advantage of the capabilities supported in this article, you must first migrate classic VMs to Resource Manager model.
>


## Ways to use Azure Hybrid Benefit for Windows Server
There are few ways to use Windows virtual machines with the Azure Hybrid Benefit:

1. You can deploy VMs from one of the provided  [Windows Server images on the Azure Marketplace](#https://azuremarketplace.microsoft.com/en-us/marketplace/apps/Microsoft.WindowsServer?tab=Overview)
2. You can  [upload a custom VM](#upload-a-windows-vhd) and [deploy using a Resource Manager template](#deploy-a-vm-via-resource-manager) or [Azure PowerShell](#detailed-powershell-deployment-walkthrough)
3. You can toggle and convert existing VM between running with Azure Hybrid Benefit or pay on-demand cost for Windows Server
4. You can also apply Azure Hybrid Benefit for Windows Server on virtual machine scale set as well


## How to create a VM with Azure Hybrid Benefit for Windows Server
All Windows Server OS based images are supported for Azure Hybrid Benefit for Windows Server. You can use Azure platform support images or upload your own custom Windows Server images. 

### Portal
To create a VM with Azure Hybrid Benefit for Windows Server, use the toggle under the "Save money" section.

### Powershell
```Azure Powershell
New-AzureRmVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVM" `
    -Location "East US" `
    -ImageName "Win2016Datacenter" `
    -LicenseType "Windows_Server"
```
### CLI
```Azure CLI
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --location eastus \
    --license-type Windows_Server
```
### Template
Within your Resource Manager templates, an additional parameter `licenseType` must be specified. You can read more about [authoring Azure Resource Manager templates](../../resource-group-authoring-templates.md)
```json
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   }
```

## How to convert an existing VM using Azure Hybrid Benefit for Windows Server
If you have an existing VM that you would like to convert to take advantage of Azure Hybrid Benefit for Windows Server, you can update your VM's license type as follows:

### Portal
From portal VM blade, you can update the VM to use Azure Hybrid Benefit by selecting "Configuration" option and toggle the "Azure hybrid benefit" option

### Powershell
- Convert existing Windows Server VMs to Azure Hybrid Benefit for Windows Server
    ```Azure Powershell
    $vm = Get-AzureRmVM -ResourceGroup "rg-name" -Name "vm-name"
    $vm.LicenseType = "Windows_Server"
    Update-AzureRmVM -ResourceGroupName rg-name -VM $vm
    ```
- Convert Windows Server VMs with benefit back to pay-as-you-go
    ```Azure Powershell
    $vm = Get-AzureRmVM -ResourceGroup "rg-name" -Name "vm-name"
    $vm.LicenseType = "None"
    Update-AzureRmVM -ResourceGroupName rg-name -VM $vm
    ```
### CLI
- Convert existing Windows Server VMs to Azure Hybrid Benefit for Windows Server
    ```Azure CLI
    az vm update \
        --resource-group myResourceGroup \
        --name myVM \
        --set licenseType=Windows_Server
    ```

### How to verify your VM is utilizing the licensing benefit
Once you have deployed your VM through either PowerShell, Resource Manager template or portal, you can verify the setting in the following methods.

### Portal
From portal VM blade, you can view the toggle for Azure Hybrid Benefit for Windows Server by selecting "Configuration" tab.

### Powershell
The following example shows the license type for a single VM
```powershell
Get-AzureRmVM -ResourceGroup "myResourceGroup" -Name "myVM"
```
Output:
```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Server
```

This output contrasts with the following VM deployed without Azure Hybrid Benefit for Windows Server licensing:
```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```
### CLI
```Azure CLI
az vm get-instance-view -g MyResourceGroup -n MyVm --query '[?licenseType==Windows_Server]' -o table
```

## List all VMs with Azure Hybrid Benefit for Windows Server in a subscription
To see and count all virtual machines deployed with Azure Hybrid Benefit for Windows Server, you can run the following command from your subscription:

### Portal
From the Virtual Machine or Virtual machine scale sets resource blade, you can view a list of all your VM(s) and licensing type by configuring the table column to include "Azure Hybrid Benefit". The VM setting can either be in "Enabled", "Not enabled" or "Not supported" state.

### Powershell
```Azure Powershell
$vms = Get-AzureRMVM 
$vms | ?{$_.LicenseType -like "Windows_Server"} | select ResourceGroupName, Name, LicenseType
```
### CLI
```Azure CLI
az vm list --query '[?licenseType==Windows_Server]' -o table
```

## Deploy a virtual machine scale set with Azure Hybrid Benefit for Windows Server
Within your virtual machine scale set Resource Manager templates, an additional parameter `licenseType` must be specified. You can read more about [authoring Azure Resource Manager templates](../../resource-group-authoring-templates.md). Edit your Resource Manager template to include the licenseType property as part of the scale set’s virtualMachineProfile and deploy your template as normal - see following example using 2016 Windows Server image:


```json
"virtualMachineProfile": {
    "storageProfile": {
        "osDisk": {
            "createOption": "FromImage"
        },
        "imageReference": {
            "publisher": "MicrosoftWindowsServer",
            "offer": "WindowsServer",
            "sku": "2016-Datacenter",
            "version": "latest"
        }
    },
    "licenseType": "Windows_Server",
    "osProfile": {
            "computerNamePrefix": "[parameters('vmssName')]",
            "adminUsername": "[parameters('adminUsername')]",
            "adminPassword": "[parameters('adminPassword')]"
    }
```
You can also [Create and deploy a virtual machine scale set](#https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-create) and set the LicenseType property

## Next steps
Read more about [How to save money with the Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/)

Learn more about [Azure Hybrid Benefit for Windows Server licensing detailed guidance](https://docs.microsoft.com/windows-server/get-started/azure-hybrid-benefit)

Learn more about [Using Resource Manager templates](../../azure-resource-manager/resource-group-overview.md)

Learn more about [Azure Hybrid Benefit for Windows Server and Azure Site Recovery make migrating applications to Azure even more cost-effective](https://azure.microsoft.com/blog/hybrid-use-benefit-migration-with-asr/)

Learn more about [Windows 10 on Azure with Multitenant Hosting Right](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment)

Read more about [Frequently asked questions](#https://azure.microsoft.com/en-us/pricing/hybrid-use-benefit/faq/)
