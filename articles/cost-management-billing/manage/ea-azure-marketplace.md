---
title: Azure Marketplace
description: Describes how EA customers can use Azure Marketplace.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 02/13/2024
ms.author: banders
---

# Azure Marketplace

This article explains how EA customers and partners can view marketplace charges and enable Azure Marketplace purchases.

## Azure Marketplace for EA customers

Azure Marketplace charges are visible on the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/BillingAccounts). Azure Marketplace purchases and consumption are billed outside of Azure Prepayment on a quarterly or monthly cadence and in arrears. See [Manage Azure Marketplace on Azure portal](direct-ea-administration.md#enable-azure-marketplace-purchases).

Customers should contact their Licensing Solutions Provider (LSP) for information on Azure Marketplace charges.

New monthly or annually recurring Azure Marketplace purchases are billed in full during the period when Azure Marketplace items are purchased. These items autorenew in the following period on the same day of the original purchase.

Existing, monthly recurring charges continue to renew on the first of each calendar month. Annual charges renew on the anniversary of the purchase date.

Some third-party reseller services available on Azure Marketplace now consume your Enterprise Agreement (EA) Azure Prepayment balance. Previously these services were billed outside of EA Azure Prepayment and were invoiced separately. EA Azure Prepayment for these services in Azure Marketplace helps simplify customer purchase and payment management. For a complete list of services that now consume Azure Prepayment, see the [March 06, 2018 update on the Azure website](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).


### Enabling Azure Marketplace purchases

Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. If the enterprise administrator disables purchases, and there are Azure subscriptions that already have Azure Marketplace subscriptions, those Azure Marketplace subscriptions aren't canceled or affected.

Although customers can convert their direct Azure subscriptions to Azure EA by associating them to their enrollment in the Azure portal, this action doesn't automatically convert the child subscriptions.

To enable Azure Marketplace purchase in the Azure portal:

1. Sign in to the Azure portal.
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select Billing scopes and then select a billing account scope.
1. In the left menu, select **Policies**.
1. Under Azure Marketplace, set the policy to **On**.
1. Select **Save**.

> [!NOTE]
> BYOL (bring your own license) and the Free Only option limits the purchase and acquisition of Azure Marketplace SKUs to BYOL and Free SKUs only.

### Services billed hourly for Azure EA

The following services are billed hourly under an Enterprise Agreement instead of the monthly rate in a Microsoft Online Services Program (MOSP) account:

- Application Delivery Network
- Web Application Firewall

### Azure RemoteApp

If you have an Enterprise Agreement, you pay for Azure RemoteApp based on your Enterprise Agreement price level. There aren't extra charges. The standard price includes an initial 40 hours. The unlimited price covers an initial 80 hours. RemoteApp stops emitting usage over 80 hours.

## Related content

- Get more information about [Pricing](ea-pricing-overview.md).
- Read the [Cost Management + Billing FAQ](../cost-management-billing-faq.yml) to see a list of questions and answers about Azure Marketplace services and Azure EA Prepayment.
