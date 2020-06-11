---
title: Convert a legacy Direct peering to an Azure resource by using the Azure portal
titleSuffix: Azure
description: Convert a legacy Direct peering to an Azure resource by using the Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: how-to
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Direct peering to an Azure resource by using the Azure portal

This article describes how to convert an existing legacy Direct peering to an Azure resource by using the Azure portal.

If you prefer, you can complete this guide by using [PowerShell](howto-legacy-direct-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.


## Convert a legacy Direct peering to an Azure resource

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert a legacy Direct peering

As an Internet Service Provider, you can convert legacy direct peering connections by using [Creating a Peering]( https://go.microsoft.com/fwlink/?linkid=2129593).

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

#### Launch the resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration-legacy.md)]

### <a name=get></a>Verify Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).

## Next steps

* [Create or modify a Direct peering by using the portal](howto-direct-portal.md)
