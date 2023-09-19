---
title: Use Windows client images in Azure 
description: How to use Visual Studio subscription benefits to deploy Windows 7, Windows 8, or Windows 10 in Azure for dev/test scenarios
author: ebolton-cyber
ms.author: edewebolton
ms.subservice: imaging
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 12/15/2017

---
# Use Windows client in Azure for dev/test scenarios

**Applies to:** :heavy_check_mark: Windows VMs 

You can use Windows 7, Windows 8, or Windows 10 Enterprise (x64) in Azure for dev/test scenarios provided you have an appropriate Visual Studio (formerly MSDN) subscription. 

To run Windows 10 in a production environment see, [How to deploy Windows 10 on Azure with Multitenant Hosting Rights](windows-desktop-multitenant-hosting-deployment.md).


## Subscription eligibility
Active Visual Studio subscribers (people who have acquired a Visual Studio subscription license) can use Windows client images for development and testing purposes. Windows client images can be used on your own hardware or on Azure virtual machines.

Certain Windows client images are available from the Azure Marketplace. Visual Studio subscribers within any type of offer can also [prepare and create](prepare-for-upload-vhd-image.md) 64-bit Windows 7, Windows 8, or Windows 10 images and then [upload to Azure](upload-generalized-managed.md).

## Eligible offers and client images
The following table details the offer IDs that are eligible to deploy Windows client images through the Azure Marketplace. The Windows client images are only visible to the following offers. 

> [!NOTE]
> Image offers are under **Windows Client** in the Azure Marketplace. Use **Windows Client** when searching for client images available to Visual Studio subscribers. If you need to purchase a Visual Studio subscription, see the various options at [Buy Visual Studio](https://visualstudio.microsoft.com/vs/pricing/?tab=business)

| Offer Name | Offer Number | Available client images | 
|:--- |:---:|:---:|
| [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/) |0023P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Visual Studio Enterprise (MPN) subscribers](https://azure.microsoft.com/offers/ms-azr-0029p/) |0029P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Visual Studio Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0059p/) |0059P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Visual Studio Test Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0060p/) |0060P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Visual Studio Enterprise subscribers](https://azure.microsoft.com/offers/ms-azr-0063p/) |0063P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Visual Studio Enterprise (BizSpark) subscribers](https://azure.microsoft.com/offers/ms-azr-0064p/) |0064P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |
| [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/) |0148P | Windows 10 Enterprise N (x64) <br> Windows 8.1 Enterprise N (x64) <br> Windows 7 Enterprise N with SP1 (x64) |

For more information, see [Understand Microsoft offer types](../../cost-management-billing/costs/understand-cost-mgt-data.md#supported-microsoft-azure-offers)

## Check your Azure subscription
If you do not know your offer ID, you can obtain it through the Azure portal.  
- On the *Subscriptions* window:
  ![Offer ID details from the Azure portal](./media/client-images/offer-id-azure-portal.png) 
- Or, click **Billing** and then click your subscription ID. The offer ID appears in the *Billing* window. 

## Next steps
You can now deploy your VMs using [PowerShell](quick-create-powershell.md), [Resource Manager templates](ps-template.md), or [Visual Studio](../../azure-resource-manager/templates/create-visual-studio-deployment-project.md).
