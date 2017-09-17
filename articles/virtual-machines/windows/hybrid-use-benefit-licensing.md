---
title: Azure Hybrid Use Benefit for Window Server | Microsoft Docs
description: Learn how to maximize your Windows Software Assurance benefits to bring on-premises licenses to Azure
services: virtual-machines-windows
documentationcenter: ''
author: kmouss
manager: timlt
editor: ''

ms.assetid: 332583b6-15a3-4efb-80c3-9082587828b0
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 9/20/2017
ms.author: kmouss

---
# Azure Hybrid Use Benefit for Windows Server
For customers with Software Assurance, Azure Hybrid Use Benefit - AHUB allows you to use your on-premises Windows Server licenses and run Windows virtual machines on Azure at a reduced cost. You can use AHUB to deploy new virtual machine from any Azure supported platform Windows Server image or Windows custom images. As long as the image doesn't come with additional software such as SQL Server or third-party marketplace images. Existing Windows Server virtual machines that aren't charging for additional software can also be converted to using AHUB. This article goes over the steps on how to deploy new VMs with AHUB. The article also shows how you can convert existing Windows Server VMs to using AHUB. For more information about AHUB licensing and cost savings, see the [Azure Hybrid Use Benefit licensing page](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

> [!IMPORTANT]
> The '[HUB]' Windows Server images that were published for customers with Enterprise Agreement on Azure Marketplace has been retired as of 9/11/2017, use the standard Windows Server with the "Save Money" option on the portal for Azure Hybrid Use Benefit. For more information, please refer to this [article.](https://support.microsoft.com/en-us/help/4036360/retirement-azure-hybrid-use-benefit-images-for-ea-subscriptions)
>

> [!NOTE]
> Azure Hybrid Use Benefit can't be used with VMs that are charged for additional software such as SQL Server or any of the third-party marketplace images. You get a 409 error such as: Changing property 'LicenseType' is not allowed; if you try to convert a Windows Server VM that has additional software cost. 
>
>

> [!NOTE]
> For classic VMs, only deploying new VM from on-prem custom images is supported. To take advantage of the capabilities supported in this article, you must first migrate classic VMs to Resource Manager model.
>
>

## Ways to use Azure Hybrid Use Benefit
There are few ways to use Windows VMs with the Azure Hybrid Use Benefit:

1. You can deploy VMs from one of the provided  [Windows Server images on the Azure Marketplace](#https://azuremarketplace.microsoft.com/en-us/marketplace/apps/Microsoft.WindowsServer?tab=Overview)
2. You can convert a running Windows Server VM to using AHUB
3. You can  [upload a custom VM](#upload-a-windows-vhd) and [deploy using a Resource Manager template](#deploy-a-vm-via-resource-manager) or [Azure PowerShell](#detailed-powershell-deployment-walkthrough)
4. You can also deploy a new virtual machine scale set with AHUB

> [!NOTE]
> Converting an existing virtual machine scale set to use AHUB isn't currently supported
>

## Deploy a VM from a Windows Server Marketplace Image
All Windows Server images that are available from the Azure Marketplace are enabled with Azure Hybrid Use Benefit. For example, Windows Server 2016, Windows Server 2012R2, Windows Server 2012, and Windows Server 2008SP1 and more. You can use these images to deploy VMs directly from the Azure portal, Resource Manager templates, Azure PowerShell, or other SDKs.

You can deploy these images directly from the Azure portal. For use in Resource Manager templates and with Azure PowerShell, view the list of images as follows:

### Powershell
```powershell
Get-AzureRmVMImagesku -Location westus -PublisherName MicrosoftWindowsServer -Offer WindowsServer
```
You can follow the steps to [Create a Windows virtual machine with PowerShell](#https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-powershell?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json) and pass LicenseType = "Windows_Server". This option allows you to use your existing Windows Server license on Azure.

### Portal
You can follow the steps to [Create a Windows virtual machine with the Azure portal](#https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) and select the option to use your existing Windows Server license.

## Convert an existing VM to using AHUB
As long as the VM isn't charging for additional software such as SQL Server or third-party Marketplace cost. You can convert existing VM (no downtime is required if the VM is in running state) by executing the following powershell command or directly from the portal.

### Convert to using AHUB
```powershell
		$vm = Get-AzureRmVM -ResourceGroup "rg-name" -Name "vm-name"
		$vm.LicenseType = "Windows_Server"
		Update-AzureRmVM -ResourceGroupName rg-name -VM $vm
```

### Convert back to pay-as-you-go
```powershell
		$vm = Get-AzureRmVM -ResourceGroup "rg-name" -Name "vm-name"
		$vm.LicenseType = "None"
		Update-AzureRmVM -ResourceGroupName rg-name -VM $vm
```

## Upload a Windows Server VHD
To deploy a Windows Server VM in Azure, you first need to create a VHD that contains your base Windows build. This VHD must be appropriately prepared via Sysprep before you upload it to Azure. You can [read more about the VHD requirements and Sysprep process](upload-generalized-managed.md) and [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles). Back up the VM before running Sysprep. 

Once you have prepared your VHD, upload the VHD to your Azure Storage account as follows:

```powershell
Add-AzureRmVhd -ResourceGroupName "myResourceGroup" -LocalFilePath "C:\Path\To\myvhd.vhd" `
    -Destination "https://mystorageaccount.blob.core.windows.net/vhds/myvhd.vhd"
```

> [!NOTE]
> Microsoft SQL Server, SharePoint Server, and Dynamics can also utilize your Software Assurance licensing. You still need to prepare the Windows Server image by installing your application components and providing license keys accordingly, then uploading the disk image to Azure. Review the appropriate documentation for running Sysprep with your application, such as [Considerations for Installing SQL Server using Sysprep](https://msdn.microsoft.com/library/ee210754.aspx) or [Build a SharePoint Server 2016 Reference Image (Sysprep)](http://social.technet.microsoft.com/wiki/contents/articles/33789.build-a-sharepoint-server-2016-reference-image-sysprep.aspx).
>
>

You can also read more about [uploading the VHD to Azure process](upload-generalized-managed.md#upload-the-vhd-to-your-storage-account)


## Deploy a VM via Resource Manager Template
Within your Resource Manager templates, an additional parameter `licenseType` must be specified. You can read more about [authoring Azure Resource Manager templates](../../resource-group-authoring-templates.md). Once you have your VHD uploaded to Azure, edit you Resource Manager template to include the license type as part of the compute provider and deploy your template as normal:

```json
"properties": {  
   "licenseType": "Windows_Server",
   "hardwareProfile": {
        "vmSize": "[variables('vmSize')]"
   }
```

## Deploy a VM via PowerShell quickstart
When deploying your Windows Server VM via PowerShell, you have an additional parameter `-LicenseType`. Once you have your VHD uploaded to Azure, you create a VM using `New-AzureRmVM` and specify the licensing type as follows:

For Windows Server:
```powershell
New-AzureRmVM -ResourceGroupName "myResourceGroup" -Location "West US" -VM $vm -LicenseType "Windows_Server"
```

You can read a more descriptive guide on the different steps to [create a Windows VM using Resource Manager and PowerShell](../virtual-machines-windows-ps-create.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


## Verify your VM is utilizing the licensing benefit
Once you have deployed your VM through either PowerShell, Resource Manager template or portal, you can verify the license type with `Get-AzureRmVM` as follows:

```powershell
Get-AzureRmVM -ResourceGroup "myResourceGroup" -Name "myVM"
```

The output is similar to the following example for Windows Server:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Server
```

This output contrasts with the following VM deployed without Azure Hybrid Use Benefit licensing. For example, a VM deployed straight from the Azure Gallery without AHUB:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```

## List all AHUB VMs in a subscription

To see and count all virtual machines deployed with AHUB on your Azure subscription, you can run the following command:

```powershell
$vms = Get-AzureRMVM 
foreach ($vm in $vms) {"VM Name: " + $vm.Name, "   AHUB: "+ $vm.LicenseType}
```

## Deploy a virtual machine scale set with AHUB
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
You can also [Create and deploy a virtual machine scale set](#https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-create) and set the LicenseType property

## Next steps
Read more about [Azure Hybrid Use Benefit licensing](https://azure.microsoft.com/pricing/hybrid-use-benefit/).

Learn more about [using Resource Manager templates](../../azure-resource-manager/resource-group-overview.md).

Learn more about [Azure Hybrid Use Benefit and Azure Site Recovery make migrating applications to Azure even more cost-effective](https://azure.microsoft.com/blog/hybrid-use-benefit-migration-with-asr/).

Read more about [Frequently asked questions](#https://azure.microsoft.com/en-us/pricing/hybrid-use-benefit/faq/)
