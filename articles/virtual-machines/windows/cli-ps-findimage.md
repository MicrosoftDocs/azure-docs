---
title: Find and use marketplace purchase plan information using PowerShell 
description: Use Azure PowerShell to find image URNs and purchase plan parameters, like the publisher, offer, SKU, and version, for Marketplace VM images.
ms.service: virtual-machines
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 03/17/2021
author: ebolton-cyber
ms.author: edewebolton
ms.custom: contperf-fy21q3, devx-track-azurepowershell
---
# Find and use Azure Marketplace VM images with Azure PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets


This article describes how to use Azure PowerShell to find VM images in the Azure Marketplace. You can then specify a Marketplace image and plan information when you create a VM.

You can also browse available images and offers using the [Azure Marketplace](https://azuremarketplace.microsoft.com/) or the [Azure CLI](../linux/cli-ps-findimage.md). 

## Terminology

A Marketplace image in Azure has the following attributes:

* **Publisher**: The organization that created the image. Examples: Canonical, MicrosoftWindowsServer
* **Offer**: The name of a group of related images created by a publisher. Examples: UbuntuServer, WindowsServer
* **SKU**: An instance of an offer, such as a major release of a distribution. Examples: 18.04-LTS, 2019-Datacenter
* **Version**: The version number of an image SKU. 

These values can be passed individually or as an image *URN*, combining the values separated by the colon (:). For example: *Publisher*:*Offer*:*Sku*:*Version*. You can replace the version number in the URN with `latest` to use the latest version of the image. 

If the image publisher provides other license and purchase terms, then you must accept those before you can use the image. For more information, see [Accept purchase plan terms](#accept-purchase-plan-terms).

## Default Images

Powershell offers several pre-defined image aliases to make the resource creation process easier. There are different images for resources with either a Windows or Linux operating system. Several Powershell cmdlets, such as `New-AzVM` and `New-AzVmss`, allow you to input the alias name as a parameter. 
For example:

```powershell
$rgname = <Resource Group Name>
$location = <Azure Region>
$vmName = "v" + $rgname
$domainNameLabel = "d" + $rgname
$securePassword = <Password> | ConvertTo-SecureString -AsPlainText -Force
$username = <Username>
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)
New-AzVM -ResourceGroupName $rgname -Location $location -Name $vmName -image CentOS85Gen285Gen2 -Credential $credential -DomainNameLabel $domainNameLabel
```

The Linux image alias names and their details are:
```output
Alias                     Architecture    Offer                         Publisher               Sku                                 Urn                                                                            Version
-----------------------   --------------  ----------------------------  ----------------------  ----------------------------------  ------------------------------------------------------------------------------ ---------
CentOS85Gen2              x64             CentOS                        OpenLogic               8_5-gen2                            OpenLogic:CentOS:8_5-gen2:latest                                               latest
Debian11                  x64             Debian-11                     Debian                  11-backports-gen2                   Debian:debian-11:11-backports-gen2:latest                                      latest
FlatcarLinuxFreeGen2      x64             flatcar-container-linux-free  kinvolk                 stable                              kinvolk:flatcar-container-linux-free:stable:latest                             latest
OpenSuseLeap154Gen2       x64             opensuse-leap-15-4            SUSE                    gen2                                SUSE:opensuse-leap-15-4:gen2:latest                                            latest
RHELRaw8LVMGen2           x64             RHEL                          RedHat                  8-lvm-gen2                          RedHat:RHEL:8-lvm-gen2:latest                                                  latest
SLES                      x64             sles-15-sp3                   SUSE                    gen2                                SUSE:sles-15-sp3:gen2:latest                                                   latest
Ubuntu2204                x64             0001-com-ubuntu-server-jammy  Canonical               22_04-lts-gen2                      Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest                   latest
```

The Windows image alias names and their details are:
```output
Alias                   Architecture    Offer                         Publisher               Sku                                 Urn                                                                              Version
----------------------- --------------  ----------------------------  ----------------------  ----------------------------------  ------------------------------------------------------------------------------   ---------
Win2022Datacenter       x64             WindowsServer                 MicrosoftWindowsServer  2022-Datacenter                     MicrosoftWindowsServer:WindowsServer:2022-Datacenter:latest                      latest
Win2022AzureEditionCore x64             WindowsServer                 MicrosoftWindowsServer  2022-datacenter-azure-edition-core  MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition-core:latest   latest
Win10                   x64             Windows                       MicrosoftVisualStudio   Windows-10-N-x64                    MicrosoftVisualStudio:Windows:Windows-10-N-x64:latest                            latest
Win2019Datacenter       x64             WindowsServer                 MicrosoftWindowsServer  2019-Datacenter                     MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest                      latest
Win2016Datacenter       x64             WindowsServer                 MicrosoftWindowsServer  2016-Datacenter                     MicrosoftWindowsServer:WindowsServer:2016-Datacenter:latest                      latest
Win2012R2Datacenter     x64             WindowsServer                 MicrosoftWindowsServer  2012-R2-Datacenter                  MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest                   latest
Win2012Datacenter       x64             WindowsServer                 MicrosoftWindowsServer  2012-Datacenter                     MicrosoftWindowsServer:WindowsServer:2012-Datacenter:latest                      latest
```

## List images

You can use PowerShell to narrow down a list of images if you want to use a specific image that is not provided by default. Replace the values of the below variables to meet your needs.

1. List the image publishers using [Get-AzVMImagePublisher](/powershell/module/az.compute/get-azvmimagepublisher).
    
    ```powershell
    $locName="<location>"
    Get-AzVMImagePublisher -Location $locName | Select PublisherName
    ```
1. For a given publisher, list their offers using [Get-AzVMImageOffer](/powershell/module/az.compute/get-azvmimageoffer).
    
    ```powershell
    $pubName="<publisher>"
    Get-AzVMImageOffer -Location $locName -PublisherName $pubName | Select Offer
    ```
1. For a given publisher and offer, list the SKUs available using [Get-AzVMImageSku](/powershell/module/az.compute/get-azvmimagesku).
    
    ```powershell
    $offerName="<offer>"
    Get-AzVMImageSku -Location $locName -PublisherName $pubName -Offer $offerName | Select Skus
    ```
1. For a SKU, list the versions of the image using [Get-AzVMImage](/powershell/module/az.compute/get-azvmimage).

    ```powershell
    $skuName="<SKU>"
    Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Sku $skuName | Select Version
    ```
    You can also use `latest` if you want to use the latest image and not a specific older version.


Now you can combine the selected publisher, offer, SKU, and version into a URN (values separated by :). Pass this URN with the `-Image` parameter when you create a VM with the [New-AzVM](/powershell/module/az.compute/new-azvm) cmdlet. You can also replace the version number in the URN with `latest` to get the latest version of the image.

If you deploy a VM with a Resource Manager template, then you must set the image parameters individually in the `imageReference` properties. See the [template reference](/azure/templates/microsoft.compute/virtualmachines).


## View purchase plan properties

Some VM images in the Azure Marketplace have other license and purchase terms that you must accept before you can deploy them programmatically. You need to accept the image's terms once per subscription.

To view an image's purchase plan information, run the `Get-AzVMImage` cmdlet. If the `PurchasePlan` property in the output is not `null`, the image has terms you need to accept before programmatic deployment.  

For example, the *Windows Server 2016 Datacenter* image doesn't have additional terms, so the `PurchasePlan` information is `null`:

```powershell
$version = "2016.127.20170406"
Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Skus $skuName -Version $version
```

The output looks similar to the following output:

```output
Id               : /Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Providers/Microsoft.Compute/Locations/westus/Publishers/MicrosoftWindowsServer/ArtifactTypes/VMImage/Offers/WindowsServer/Skus/2016-Datacenter/Versions/2019.0.20190115
Location         : westus
PublisherName    : MicrosoftWindowsServer
Offer            : WindowsServer
Skus             : 2019-Datacenter
Version          : 2019.0.20190115
FilterExpression :
Name             : 2019.0.20190115
OSDiskImage      : {
                     "operatingSystem": "Windows"
                   }
PurchasePlan     : null
DataDiskImages   : []

```

The example below shows a similar command for the *Data Science Virtual Machine - Windows 2016* image, which has the following `PurchasePlan` properties: `name`, `product`, and `publisher`. Some images also have a `promotion code` property. To deploy this image, see the following sections to accept the terms and to enable programmatic deployment.

```powershell
Get-AzVMImage -Location "westus" -PublisherName "microsoft-ads" -Offer "windows-data-science-vm" -Skus "windows2016" -Version "0.2.02"
```

The output looks similar to the following output:

```
Id               : /Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Providers/Microsoft.Compute/Locations/westus/Publishers/microsoft-ads/ArtifactTypes/VMImage/Offers/windows-data-science-vm/Skus/windows2016/Versions/19.01.14
Location         : westus
PublisherName    : microsoft-ads
Offer            : windows-data-science-vm
Skus             : windows2016
Version          : 19.01.14
FilterExpression :
Name             : 19.01.14
OSDiskImage      : {
                     "operatingSystem": "Windows"
                   }
PurchasePlan     : {
                     "publisher": "microsoft-ads",
                     "name": "windows2016",
                     "product": "windows-data-science-vm"
                   }
DataDiskImages   : []

```

To view the license terms, use the [Get-AzMarketplaceterms](/powershell/module/az.marketplaceordering/get-azmarketplaceterms) cmdlet and pass in the purchase plan parameters. The output provides a link to the terms for the Marketplace image and shows whether you previously accepted the terms. Be sure to use all lowercase letters in the parameter values.

```powershell
Get-AzMarketplaceterms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016"
```

The output will look similar to the following:

```output
Publisher         : microsoft-ads
Product           : windows-data-science-vm
Plan              : windows2016
LicenseTextLink   : https://storelegalterms.blob.core.windows.net/legalterms/3E5ED_legalterms_MICROSOFT%253a2DADS%253a24WINDOWS%253a2DDATA%253a2DSCIENCE%253a2DVM%253a24WINDOWS2016%253a24OC5SKMQOXSED66BBSNTF4XRCS4XLOHP7QMPV54DQU7JCBZWYFP35IDPOWTUKXUC7ZAG7W6ZMDD6NHWNKUIVSYBZUTZ245F44SU5AD7Q.txt
PrivacyPolicyLink : https://www.microsoft.com/EN-US/privacystatement/OnlineServices/Default.aspx
Signature         : 2UMWH6PHSAIM4U22HXPXW25AL2NHUJ7Y7GRV27EBL6SUIDURGMYG6IIDO3P47FFIBBDFHZHSQTR7PNK6VIIRYJRQ3WXSE6BTNUNENXA
Accepted          : False
Signdate          : 1/25/2019 7:43:00 PM
```

## Accept purchase plan terms

Use the [Set-AzMarketplaceterms](/powershell/module/az.marketplaceordering/set-azmarketplaceterms) cmdlet to accept or reject the terms. You only need to accept terms once per subscription for the image. Be sure to use all lowercase letters in the parameter values. 

```powershell
$agreementTerms=Get-AzMarketplaceterms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016"

Set-AzMarketplaceTerms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016" -Terms $agreementTerms -Accept
```



```output
Publisher         : microsoft-ads
Product           : windows-data-science-vm
Plan              : windows2016
LicenseTextLink   : https://storelegalterms.blob.core.windows.net/legalterms/3E5ED_legalterms_MICROSOFT%253a2DADS%253a24WINDOWS%253a2DDATA%253a2DSCIENCE%253a2DV
                    M%253a24WINDOWS2016%253a24OC5SKMQOXSED66BBSNTF4XRCS4XLOHP7QMPV54DQU7JCBZWYFP35IDPOWTUKXUC7ZAG7W6ZMDD6NHWNKUIVSYBZUTZ245F44SU5AD7Q.txt
PrivacyPolicyLink : https://www.microsoft.com/EN-US/privacystatement/OnlineServices/Default.aspx
Signature         : XXXXXXK3MNJ5SROEG2BYDA2YGECU33GXTD3UFPLPC4BAVKAUL3PDYL3KBKBLG4ZCDJZVNSA7KJWTGMDSYDD6KRLV3LV274DLBXXXXXX
Accepted          : True
Signdate          : 2/23/2018 7:49:31 PM
```


## Create a new VM from a marketplace image

If you already have the information about what image you want to use, you can pass that information into [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage) cmdlet to add image information to the VM configuration. See the next sections for searching and listing the images available in the marketplace.

Some paid images also require that you provide purchase plan information using the [Set-AzVMPlan](/powershell/module/az.compute/set-azvmplan). 

```powershell
...

$vmConfig = New-AzVMConfig -VMName "myVM" -VMSize Standard_D1

# Set the Marketplace image
$offerName = "windows-data-science-vm"
$skuName = "windows2016"
$version = "19.01.14"
$vmConfig = Set-AzVMSourceImage -VM $vmConfig -PublisherName $publisherName -Offer $offerName -Skus $skuName -Version $version

# Set the Marketplace plan information, if needed
$publisherName = "microsoft-ads"
$productName = "windows-data-science-vm"
$planName = "windows2016"
$vmConfig = Set-AzVMPlan -VM $vmConfig -Publisher $publisherName -Product $productName -Name $planName

...
```

You'll then pass the VM configuration along with the other configuration objects to the `New-AzVM` cmdlet. For a detailed example of using a VM configuration with PowerShell, see this [script](https://github.com/Azure/azure-docs-powershell-samples/blob/master/virtual-machine/create-vm-detailed/create-windows-vm-detailed.ps1).

If you get a message about accepting the terms of the image, see the earlier section [Accept purchase plan terms](#accept-purchase-plan-terms).

## Create a new VM from a VHD with purchase plan information

If you have an existing VHD that was created using an Azure Marketplace image, you might need to supply the purchase plan information when you create a new VM from that VHD.

If you still have the original VM, or another VM created from the same image, you can get the plan name, publisher, and product information from it using Get-AzVM. This example gets a VM named *myVM* in the *myResourceGroup* resource group and then displays the purchase plan information.

```azurepowershell-interactive
$vm = Get-azvm `
   -ResourceGroupName myResourceGroup `
   -Name myVM
$vm.Plan
```

If you didn't get the plan information before the original VM was deleted, you can file a [support request](https://portal.azure.com/#create/Microsoft.Support). The support request needs at minimum the VM name, subscription ID and the time stamp of the delete operation.

To create a VM using a VHD, refer to this article [Create a VM from a specialized VHD](create-vm-specialized.md) and add in a line to add the plan information to the VM configuration using [Set-AzVMPlan](/powershell/module/az.compute/set-azvmplan) similar to the following:

```azurepowershell-interactive
$vmConfig = Set-AzVMPlan `
   -VM $vmConfig `
   -Publisher "publisherName" `
   -Product "productName" `
   -Name "planName"
```


## Next steps

To create a virtual machine quickly with the `New-AzVM` cmdlet by using basic image information, see [Create a Windows virtual machine with PowerShell](quick-create-powershell.md).

For more information on using Azure Marketplace images to create custom images in an Azure Compute Gallery (formerly known as Shared Image Gallery), see [Supply Azure Marketplace purchase plan information when creating images](../marketplace-images.md).
