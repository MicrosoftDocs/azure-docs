---
title: Create or modify an Exchange peering by using the Azure portal
titleSuffix: Azure
description: Create or modify an Exchange peering by using the Azure portal
services: internet-peering
author: derekolo
ms.service: internet-peering
ms.topic: how-to
ms.date: 5/2/2020
ms.author: derekol
---

# Create or modify an Exchange peering by using the Azure portal

This article describes how to create a Microsoft Exchange peering by using the Azure portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using [PowerShell](howto-exchange-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* If you already have Exchange peerings with Microsoft that aren't converted to Azure resources, see [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md).

## Create and provision an Exchange peering

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create an Exchange peering


As an Internet Exchange Provider, you can create an exchange peering request by [Creating a Peering]( https://go.microsoft.com/fwlink/?linkid=2129593).

1. On the **Create a Peering** page, on the **Basics** tab, fill in the boxes as shown here:

    > [!div class="mx-imgBorder"] 
    > ![Register Peering Service](./media/setup-basics-tab.png)

*    Select your Azure Subscription.

* For Resource group, you can either choose an existing resource group from the drop-down list or create a new group by selecting Create new. We'll create a new resource group for this example.

* Name corresponds to the resource name and can be anything you choose.

* Region is auto-selected if you chose an existing resource group. If you chose to create a new resource group, you also need to choose the Azure region where you want the resource to reside.

>[!NOTE]
>The region where a resource group resides is independent of the location where you want to create peering with Microsoft. But it's a best practice to organize your peering resources within resource groups that reside in the closest Azure regions. For example, for peerings in Ashburn, you can create a resource group in East US or East US2.

* Select your ASN in the **PeerASN** box.

>[!IMPORTANT] 
>You can only choose an ASN with ValidationState as Approved before you submit a peering request. If you just submitted your PeerAsn request, wait for 12 hours or so for ASN association to be approved. If the ASN you select is pending validation, you'll see an error message. If you don't see the ASN you need to choose, check that you selected the correct subscription. If so, check if you have already created PeerAsn by using **[Associate Peer ASN to Azure subscription](https://go.microsoft.com/fwlink/?linkid=2129592)**.

* Select **Next: Configuration** to continue.

#### Configure connections and submit
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration.md)]

### <a name=get></a>Verify an Exchange peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange peering
[!INCLUDE [peering-exchange-modify-portal](./includes/exchange-portal-modify.md)]

## <a name="delete"></a>Deprovision an Exchange peering
[!INCLUDE [peering-exchange-delete-portal](./includes/delete.md)]

## Next steps

* [Create or modify a Direct peering by using the portal](howto-direct-portal.md)
* [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md)

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).
