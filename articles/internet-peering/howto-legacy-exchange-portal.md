---
title: Convert a legacy Exchange peering to an Azure resource - Azure portal
description: Learn how to convert a legacy Exchange peering to an Azure resource using the Azure portal.
titleSuffix: Internet Peering
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/04/2023
---

# Convert a legacy Exchange peering to an Azure resource using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](howto-legacy-exchange-portal.md)
> - [PowerShell](howto-legacy-exchange-powershell.md)

This article describes how to convert an existing legacy Exchange peering to an Azure resource by using the Azure portal.

If you prefer, you can complete this guide by using [PowerShell](howto-legacy-exchange-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

## Convert a legacy Exchange peering to an Azure resource

As an Internet Exchange Provider, you can create an exchange peering request by [Creating a Peering]( https://go.microsoft.com/fwlink/?linkid=2129593).

1. On the **Create a Peering** page, on the **Basics** tab, fill in the boxes as shown here:

   ![Register Peering Service](./media/setup-basics-tab.png)

* Select your Azure Subscription.

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
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration-legacy.md)]

### <a name=get></a>Verify Exchange peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## Related content

- [Create or modify an Exchange peering by using the portal](howto-exchange-portal.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).