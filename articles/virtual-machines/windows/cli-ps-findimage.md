---
title: Select Windows VM images in Azure 
description: Use Azure PowerShell to determine the publisher, offer, SKU, and version for Marketplace VM images.
author: cynthn
ms.service: virtual-machines-windows
ms.subservice: imaging
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 01/25/2019
ms.author: cynthn

---
# Find Windows VM images in the Azure Marketplace with Azure PowerShell

This article describes how to use Azure PowerShell to find VM images in the Azure Marketplace. You can then specify a Marketplace image when you create a VM programmatically with PowerShell, Resource Manager templates, or other tools.

You can also browse available images and offers using the [Azure Marketplace](https://azuremarketplace.microsoft.com/) storefront, the [Azure portal](https://portal.azure.com), or the [Azure CLI](../linux/cli-ps-findimage.md). 

 

[!INCLUDE [virtual-machines-common-image-terms](../../../includes/virtual-machines-common-image-terms.md)]

## Table of commonly used Windows images

This table shows a subset of available Skus for the indicated Publishers and Offers.

| Publisher | Offer | Sku |
|:--- |:--- |:--- |
| MicrosoftWindowsServer |WindowsServer |2019-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2019-Datacenter-Core |
| MicrosoftWindowsServer |WindowsServer |2019-Datacenter-with-Containers |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter-Server-Core |
| MicrosoftWindowsServer |WindowsServer |2016-Datacenter-with-Containers |
| MicrosoftWindowsServer |WindowsServer |2012-R2-Datacenter |
| MicrosoftWindowsServer |WindowsServer |2012-Datacenter |
| MicrosoftSharePoint |MicrosoftSharePointServer |sp2019 |
| MicrosoftSQLServer |SQL2019-WS2016 |Enterprise |
| MicrosoftRServer |RServer-WS2016 |Enterprise |

## Navigate the images

One way to find an image in a location is to run the [Get-AzVMImagePublisher](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimagepublisher), [Get-AzVMImageOffer](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimageoffer), and [Get-AzVMImageSku](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimagesku) cmdlets in order:

1. List the image publishers.
2. For a given publisher, list their offers.
3. For a given offer, list their SKUs.

Then, for a selected SKU, run [Get-AzVMImage](https://docs.microsoft.com/powershell/module/az.compute/get-azvmimage) to list the versions to deploy.

1. List the publishers:

    ```powershell
    $locName="<Azure location, such as West US>"
    Get-AzVMImagePublisher -Location $locName | Select PublisherName
    ```

2. Fill in your chosen publisher name and list the offers:

    ```powershell
    $pubName="<publisher>"
    Get-AzVMImageOffer -Location $locName -PublisherName $pubName | Select Offer
    ```

3. Fill in your chosen offer name and list the SKUs:

    ```powershell
    $offerName="<offer>"
    Get-AzVMImageSku -Location $locName -PublisherName $pubName -Offer $offerName | Select Skus
    ```

4. Fill in your chosen SKU name and get the image version:

    ```powershell
    $skuName="<SKU>"
    Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Sku $skuName | Select Version
    ```
    
From the output of the `Get-AzVMImage` command, you can select a version image to deploy a new virtual machine.

The following example shows the full sequence of commands and their outputs:

```powershell
$locName="West US"
Get-AzVMImagePublisher -Location $locName | Select PublisherName
```

Partial output:

```
PublisherName
-------------
...
abiquo
accedian
accellion
accessdata-group
accops
Acronis
Acronis.Backup
actian-corp
actian_matrix
actifio
activeeon
adgs
advantech
advantech-webaccess
advantys
...
```

For the *MicrosoftWindowsServer* publisher:

```powershell
$pubName="MicrosoftWindowsServer"
Get-AzVMImageOffer -Location $locName -PublisherName $pubName | Select Offer
```

Output:

```
Offer
-----
Windows-HUB
WindowsServer
WindowsServerSemiAnnual
```

For the *WindowsServer* offer:

```powershell
$offerName="WindowsServer"
Get-AzVMImageSku -Location $locName -PublisherName $pubName -Offer $offerName | Select Skus
```

Partial output:

```
Skus
----
2008-R2-SP1
2008-R2-SP1-smalldisk
2012-Datacenter
2012-Datacenter-smalldisk
2012-R2-Datacenter
2012-R2-Datacenter-smalldisk
2016-Datacenter
2016-Datacenter-Server-Core
2016-Datacenter-Server-Core-smalldisk
2016-Datacenter-smalldisk
2016-Datacenter-with-Containers
2016-Datacenter-with-RDSH
2019-Datacenter
2019-Datacenter-Core
2019-Datacenter-Core-smalldisk
2019-Datacenter-Core-with-Containers
...
```

Then, for the *2019-Datacenter* SKU:

```powershell
$skuName="2019-Datacenter"
Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Sku $skuName | Select Version
```

Now you can combine the selected publisher, offer, SKU, and version into a URN (values separated by :). Pass this URN with the `--image` parameter when you create a VM with the [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) cmdlet. You can optionally replace the version number in the URN with "latest" to get the latest version of the image.

If you deploy a VM with a Resource Manager template, then you'll set the image parameters individually in the `imageReference` properties. See the [template reference](/azure/templates/microsoft.compute/virtualmachines).

[!INCLUDE [virtual-machines-common-marketplace-plan](../../../includes/virtual-machines-common-marketplace-plan.md)]

### View plan properties

To view an image's purchase plan information, run the `Get-AzVMImage` cmdlet. If the `PurchasePlan` property in the output is not `null`, the image has terms you need to accept before programmatic deployment.  

For example, the *Windows Server 2016 Datacenter* image doesn't have additional terms, so the `PurchasePlan` information is `null`:

```powershell
$version = "2016.127.20170406"
Get-AzVMImage -Location $locName -PublisherName $pubName -Offer $offerName -Skus $skuName -Version $version
```

Output:

```
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

Output:

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

### Accept the terms

To view the license terms, use the [Get-AzMarketplaceterms](https://docs.microsoft.com/powershell/module/az.marketplaceordering/get-azmarketplaceterms) cmdlet and pass in the purchase plan parameters. The output provides a link to the terms for the Marketplace image and shows whether you previously accepted the terms. Be sure to use all lowercase letters in the parameter values.

```powershell
Get-AzMarketplaceterms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016"
```

Output:

```
Publisher         : microsoft-ads
Product           : windows-data-science-vm
Plan              : windows2016
LicenseTextLink   : https://storelegalterms.blob.core.windows.net/legalterms/3E5ED_legalterms_MICROSOFT%253a2DADS%253a24WINDOWS%253a2DDATA%253a2DSCIENCE%253a2DVM%253a24WINDOWS2016%253a24OC5SKMQOXSED66BBSNTF4XRCS4XLOHP7QMPV54DQU7JCBZWYFP35IDPOWTUKXUC7ZAG7W6ZMDD6NHWNKUIVSYBZUTZ245F44SU5AD7Q.txt
PrivacyPolicyLink : https://www.microsoft.com/EN-US/privacystatement/OnlineServices/Default.aspx
Signature         : 2UMWH6PHSAIM4U22HXPXW25AL2NHUJ7Y7GRV27EBL6SUIDURGMYG6IIDO3P47FFIBBDFHZHSQTR7PNK6VIIRYJRQ3WXSE6BTNUNENXA
Accepted          : False
Signdate          : 1/25/2019 7:43:00 PM
```

Use the [Set-AzMarketplaceterms](https://docs.microsoft.com/powershell/module/az.marketplaceordering/set-azmarketplaceterms) cmdlet to accept or reject the terms. You only need to accept terms once per subscription for the image. Be sure to use all lowercase letters in the parameter values. 

```powershell
$agreementTerms=Get-AzMarketplaceterms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016"

Set-AzMarketplaceTerms -Publisher "microsoft-ads" -Product "windows-data-science-vm" -Name "windows2016" -Terms $agreementTerms -Accept
```

Output:

```
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

### Deploy using purchase plan parameters

After accepting the terms for an image, you can deploy a VM in that subscription. As shown in the following snippet, use the [Set-AzVMPlan](https://docs.microsoft.com/powershell/module/az.compute/set-azvmplan) cmdlet to set the Marketplace plan information for the VM object. For a complete script to create network settings for the VM and complete the deployment, see the [PowerShell script examples](powershell-samples.md).

```powershell
...

$vmConfig = New-AzVMConfig -VMName "myVM" -VMSize Standard_D1

# Set the Marketplace plan information

$publisherName = "microsoft-ads"

$productName = "windows-data-science-vm"

$planName = "windows2016"

$vmConfig = Set-AzVMPlan -VM $vmConfig -Publisher $publisherName -Product $productName -Name $planName

$cred=Get-Credential

$vmConfig = Set-AzVMOperatingSystem -Windows -VM $vmConfig -ComputerName "myVM" -Credential $cred

# Set the Marketplace image

$offerName = "windows-data-science-vm"

$skuName = "windows2016"

$version = "19.01.14"

$vmConfig = Set-AzVMSourceImage -VM $vmConfig -PublisherName $publisherName -Offer $offerName -Skus $skuName -Version $version
...
```
You'll then pass the VM configuration along with network configuration objects to the `New-AzVM` cmdlet.

## Next steps

To create a virtual machine quickly with the `New-AzVM` cmdlet by using basic image information, see [Create a Windows virtual machine with PowerShell](quick-create-powershell.md).


See a PowerShell script example to [create a fully configured virtual machine](../scripts/virtual-machines-windows-powershell-sample-create-vm.md).


