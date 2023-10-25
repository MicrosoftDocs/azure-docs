---
title: Azure Government Marketplace images
description: This article provides an overview of Azure Government Marketplace image gallery
services: azure-government
cloud: gov

ms.service: azure-government
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 08/31/2021 
---

# Azure Government Marketplace images

Microsoft Azure Government Marketplace provides a similar experience as Azure Marketplace. You can choose to deploy prebuilt images from Microsoft and our partners, or upload your own VHDs. This approach gives you the flexibility to deploy your own standardized images if needed.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Images

To obtain a list of virtual machine images available in Azure Government, [connect to Azure Government via PowerShell](documentation-government-get-started-connect-with-ps.md) and run the following commands:

```powershell
Connect-AzAccount -Environment AzureUSGovernment

Get-AzVMImagePublisher -Location USGovVirginia | `
Get-AzVMImageOffer | `
Get-AzVMImageSku
```
<!-- 
Get-AzVMImagePublisher -Location USGovVirginia | `
Get-AzVMImageOffer | `
Get-AzVMImageSku | `
Select-Object @{Name="Entry";Expression={"| " + $_.PublisherName + " | " + $_.Offer +  " | " + $_.Skus + " |" }} | `
Select-Object -ExpandProperty Entry | `
Out-File vm-images.md
-->

Some of the prebuilt images include pay-as-you-go licensing for specific software. Work with your Microsoft account team or reseller for Azure Government-specific pricing. For more information, see [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/).

## Next steps

- [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md)
- [Create a Windows virtual machine with PowerShell](../virtual-machines/windows/quick-create-powershell.md)
- [Create a Windows virtual machine with the Azure CLI](../virtual-machines/windows/quick-create-cli.md)
- [Create a Linux virtual machine with the Azure portal](../virtual-machines/linux/quick-create-portal.md)
