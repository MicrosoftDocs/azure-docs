---
title: Azure Marketplace
description: Describes how EA customers can use Azure Marketplace
author: bandersmsft
ms.reviewer: baolcsva
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 09/03/2020
ms.author: banders
---

# Azure Marketplace

This article explains how EA customers and partners can view marketplace charges and enable Azure Marketplace purchases.

## Azure Marketplace for EA customers

For direct customers, Azure Marketplace charges are visible on the Azure Enterprise portal. Azure Marketplace purchases and consumption are billed outside of Azure Prepayment on a quarterly or monthly cadence and in arrears.

Indirect customers can find their Azure Marketplace subscriptions on the **Manage Subscriptions** page of the Azure Enterprise portal, but pricing will be hidden. Customers should contact their Licensing Solutions Provider (LSP) for information on Azure Marketplace charges.

New monthly or annually recurring Azure Marketplace purchases are billed in full during the period when Azure Marketplace items are purchased. These items will autorenew in the following period on the same day of the original purchase.

Existing, monthly recurring charges will continue to renew on the first of each calendar month. Annual charges will renew on the anniversary of the purchase date.

Some third-party reseller services available on Azure Marketplace now consume your Enterprise Agreement (EA) Azure Prepayment balance. Previously these services were billed outside of EA Azure Prepayment and were invoiced separately. EA Azure Prepayment for these services in Azure Marketplace helps simplify customer purchase and payment management. For a complete list of services that now consume Azure Prepayment, see the [March 06, 2018 update on the Azure website](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).

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

## Next steps

- Get more information about [Pricing](ea-pricing-overview.md).
- Read the [Cost Management + Billing FAQ](../cost-management-billing-faq.yml) to see a list of questions and answers about Azure Marketplace services and Azure EA Prepayment.