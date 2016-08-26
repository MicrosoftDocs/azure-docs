<properties
   pageTitle="Using Windows 10 images for dev / test | Microsoft Azure"
   description="How to use Visual Studio subscription benefits to deploy Windows 10 in Azure for dev / test scenarios"
   services="virtual-machines-windowse"
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
   ms.date="08/26/2016"
   ms.author="iainfou"/>

# Using Windows 10 in Azure for dev/test

You can use Windows 10 in Azure for dev / test scenarios provided you have an appropriate Visual Studio (formerly MSDN) subscription. This article outlines the eligibility requirements for running Windows 10 in Azure and use of the Azure Gallery images.


## Subscription eligibility
Visual Studio subscriptions are licensed to deploy Windows 10 for dev / test scenarios only. All other Azure subscriptions are not eligible to deploy Windows 10.

Depending on the specific Visual Studio offer type, you deploy Windows 10 from the Azure Gallery or by uploading your own image:

- Visual Studio subscriptions with one of the offers detailed in the [following table](#eligible-offers) can deploy Windows 10 from the Azure Gallery.
- All other Visual Studio subscriptions require you to [adequately prepare and create](virtual-machines-windows-prepare-for-upload-vhd-image.md) a Windows 10 image and [then upload to Azure](virtual-machines-windows-upload-image.md). 


## Check your Azure subscription
If you do not know your offer ID, you can obtain it through the Azure portal or the Account portal.

The subscription offer ID is noted on the 'Subscriptions' blade within the Azure portal:

![Offer ID details from the Azure portal](./media/virtual-machines-windows-client-images/offer_id_azure_portal.png) 

You can also view the offer ID from the ['Subscriptions' tab](http://account.windowsazure.com/Subscriptions) of the Azure Account portal:

![Offer ID details from the Azure Account portal](./media/virtual-machines-windows-client-images/offer_id_azure_account_portal.png) 


## Eligible offers
The following table details the particular offer IDs that are eligible to deploy Windows 10 through the Azure Gallery. The Windows 10 image is only visible to the following offers. All other Visual Studio subscriptions require you to [adequately prepare and create](virtual-machines-windows-prepare-for-upload-vhd-image.md) a Windows 10 image and [then upload to Azure](virtual-machines-windows-upload-image.md).

| Offer Name | Offer Number | Available client images |
|:-----------|:------------:|:-----------------------:|
| [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)                          | 0023P | Windows 10 |
| [Visual Studio Enterprise (MPN) subscribers](https://azure.microsoft.com/offers/ms-azr-0029p/)      | 0029P | Windows 10 |
| [Visual Studio Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0059p/)          | 0059P | Windows 10 |
| [Visual Studio Test Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0060p/)     | 0060P | Windows 10 |
| [Visual Studio Premium with MSDN (benefit)](https://azure.microsoft.com/offers/ms-azr-0061p/)       | 0061P | Windows 10 |
| [Visual Studio Enterprise subscribers](https://azure.microsoft.com/offers/ms-azr-0063p/)            | 0063P | Windows 10 |
| [Visual Studio Enterprise (BizSpark) subscribers](https://azure.microsoft.com/offers/ms-azr-0064p/) | 0064P | Windows 10 |
| [Enterprise Dev/Test](https://azure.microsoft.com/ofers/ms-azr-0148p/)                              | 0148P | Windows 10 |


## Next steps
You can now deploy your VMs using [PowerShell](virtual-machines-windows-ps-create.md), [Resource Manager templates](virtual-machines-windows-ps-template.md), or [Visual Studio](../vs-azure-tools-resource-groups-deployment-projects-create-deploy.md).