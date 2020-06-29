---
title: Azure Marketplace
description: Describes how EA customers can use Azure Marketplace
author: bandersmsft
ms.reviewer: baolcsva
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 06/01/2020
ms.author: banders

---

# Azure Marketplace

This article explains how EA customers and partners can view marketplace charges and enable Azure Marketplace purchases.

## Azure Marketplace for EA customers

For direct customers, Azure Marketplace charges are visible on the Azure Enterprise portal. Azure Marketplace purchases and consumption are billed outside of monetary commitment on a quarterly or monthly cadence and in arrears.

Indirect customers can find their Azure Marketplace subscriptions on the **Manage Subscriptions** page of the Azure Enterprise portal, but pricing will be hidden. Customers should contact their Licensing Solutions Provider (LSP) for information on Azure Marketplace charges.

New monthly or annually recurring Azure Marketplace purchases are billed in full during the period when Azure Marketplace items are purchased. These items will autorenew in the following period on the same day of the original purchase.

Existing, monthly recurring charges will continue to renew on the first of each calendar month. Annual charges will renew on the anniversary of the purchase date.

Some third-party reseller services available on Azure Marketplace now consume your Enterprise Agreement (EA) monetary commitment balance. Previously these services were billed outside of EA monetary commitment and were invoiced separately. EA monetary commitment for these services in Azure Marketplace helps simplify customer purchase and payment management. For a complete list of services that now consume monetary commitment, see the [March 06, 2018 update on the Azure website](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).

### Partners

LSPs can download an Azure Marketplace price list from the price sheet page in the Azure Enterprise portal. Select the **Marketplace Price list** link in the upper right. Azure Marketplace price list shows all available services and their prices.

To download the price list:

1. In the Azure Enterprise portal, go to **Reports** > **Price Sheet**.
1. In the top-right corner, find the link to Azure Marketplace price list under your username.
1. Right-click the link and select **Save Target As**.
1. On the **Save** window, change the title of the document to `AzureMarketplacePricelist.zip`, which will change the file from an .xlsx to a .zip file.
1. After the download is complete, you'll have a zip file with country-specific price lists.
1. LSPs should reference the individual country file for country-specific pricing. LSPs can use the **Notifications** tab to be aware of SKUs that are net new or retired.
1. Price changes occur infrequently. LSPs get email notifications of price increases and foreign exchange (FX) changes 30 days in advance.
1. LSPs receive one invoice per enrollment, per ISV, per quarter.

### Enabling Azure Marketplace purchases

Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. If the enterprise administrator disables purchases, and there are Azure subscriptions that already have Azure Marketplace subscriptions, those Azure Marketplace subscriptions won't be canceled or affected.

Although customers can convert their direct Azure subscriptions to Azure EA by associating them to their enrollment in the Azure Enterprise portal, this action doesn't automatically convert the child subscriptions.

To enable Azure Marketplace purchases:

1. Sign in to the Azure Enterprise portal as an enterprise administrator.
1. Go to **Manage**.
1. Under **Enrollment Detail**, select the pencil icon next to the **Azure Marketplace** line item.
1. Toggle **Enabled/Disabled** or Free **BYOL SKUs Only** as appropriate.
1. Select **Save**.

> [!NOTE]
> BYOL (bring your own license) and the Free Only option limits the purchase and acquisition of Azure Marketplace SKUs to BYOL and Free SKUs only.

### Services billed hourly for Azure EA

The following services are billed hourly under an Enterprise Agreement instead of the monthly rate in MOSP:

- Application Delivery Network
- Web Application Firewall

### Azure RemoteApp

If you have an Enterprise Agreement, you pay for Azure RemoteApp based on your Enterprise Agreement price level. There aren't additional charges. The standard price includes an initial 40 hours. The unlimited price covers an initial 80 hours. RemoteApp stops emitting usage over 80 hours.

## Azure Marketplace FAQ

This section explains how your Azure monetary commitment might apply to some third-party reseller services in Azure Marketplace.

### What changed with Azure Marketplace services and EA monetary commitment?

As of March 1, 2018, some third-party reseller services  consume EA monetary commitment (MC). Except for Azure reserved VM instances (RIs), services were previously billed outside EA monetary commitment and were invoiced separately.

We expanded the use of MC to include some of the third party published Azure Marketplace services that are purchased most frequently. EA monetary commitment for these services in Azure Marketplace helps simplify your purchase and payment management.

### Why did we make this change?

Customers are continually looking for additional ways to leverage the upfront MC payment. This change was frequently requested by customers, and it impacted a large portion of Azure Marketplace customers.

### How do you benefit?

You get a simpler billing experience and are better able to spend your EA monetary commitment. Because these services are included in your pre-paid MC, your EA monetary commitment becomes more valuable.

### What Azure Marketplace services use EA monetary commitment, and how do I know?

When you purchase a service that uses MC, Azure Marketplace presents a disclaimer. Supported are some services published by Red Hat, SUSE, Autodesk, and Oracle. Currently, similarly named services published by other parties don't deduct from MC. A full list is available at the end of this FAQ.

### What if my EA monetary commitment runs out?

If you consume all your MC and go into overage, charges related to these services will appear on your next overage invoice along with any other consumption services. Before the March 1, 2018 change, these charges were invoiced with other Azure Marketplace services.

### Why don't all Azure Marketplaces consume EA monetary commitment?

We frequently work to deliver the best customer experience related to EA monetary commitment. This change addressed a large number of customers and a significant portion of the total spend in Azure Marketplace. Other services might be added in the future.

### How does this impact indirect enrollment and partners?

There's no impact to our indirect enrollment customers or partners. These services are subject to the same partner markup capabilities as other consumption services. The only change is that the charges appear on a different invoice, and the payment of the charges comes out of the customer's EA monetary commitment.

### Is there a list of Azure Marketplace services that consume EA monetary commitment?

Specific Azure Marketplace offers can use monetary commitment funds. See [third-party services that use monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment) for a complete list of products participating in this program.


## Next steps

- Get more information about [Pricing](ea-pricing-overview.md).