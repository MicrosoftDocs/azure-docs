---
title: Configure pricing and availability for a virtual machine offer in Partner Center
description: Configure pricing and availability for a virtual machine offer in Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 08/22/2022
---

# Configure pricing and availability for a virtual machine offer

On this pane, you configure:

- Markets where this plan is available. Every plan must be available in at least one [market](marketplace-geo-availability-currencies.md).
- The price per hour.
- Whether to make the plan visible to everyone or only to specific customers (a private audience).

## Markets

Every plan must be available in at least one market. Most markets are selected by default. To edit the list, select **Edit markets** and select or clear check boxes for each market location where this plan should (or shouldn't) be available for purchase. Users in selected markets can still deploy the offer to all Azure regions selected in the ["Plan setup"](azure-vm-plan-setup.md) section.

Select **Select only Microsoft Tax Remitted** to select only countries/regions in which Microsoft remits sales and use tax on your behalf. Publishing to China is limited to plans that are either *Free* or *Bring-your-own-license* (BYOL).

If you've already set prices for your plan in US dollar (USD) currency and add another market location, the price for the new market is calculated according to current exchange rates. Always review the price for each market before you publish. Review your pricing by selecting **Export prices (xlsx)** after you save your changes.

When you remove a market, customers from that market who are using active deployments won't be able to create new deployments or scale up their existing deployments. Existing deployments aren't affected.

Select **Save** to continue.

## Pricing

For the **License model**, select **Usage-based monthly billed plan** to configure pricing for this plan, or **Bring your own license** to let customers use this plan with their existing license.

For a usage-based monthly billed plan, Microsoft will charge the customer for their hourly usage and they're billed monthly. This is our *Pay-as-you-go* plan, where customers are only billed for the hours that they've used. When you select this plan, choose one of the following pricing options:

- **Free** – Your VM offer is free.
- **Flat rate** – Your VM offer is the same hourly price regardless of the hardware it runs on.
- **Per core** – Your VM offer pricing is based on per CPU core count. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware.
- **Per core size** – Your VM offer is priced based on the number of CPU cores on the hardware it's deployed on.
- **Per market and core size** – Assign prices based on the number of CPU cores on the hardware it's deployed on, and also for all markets. Currency conversion is done by you, the publisher. This option is easier if you use the import pricing feature.

For **Per core size** and **Per market and core size**, enter a **Price per core**, and then select **Generate prices**. The tables of price/hour calculations are populated for you. You can then adjust the price per core, if you choose. If using the *Per market and core size* pricing option, you can additionally customize the price/hour calculation tables for each market that’s selected for this plan.

> [!NOTE]
> To ensure the prices are right before you publish them, export the pricing spreadsheet and review them in each market. Before you export pricing data, first select **Save draft** to save pricing changes.

When selecting a pricing option, Microsoft does the currency conversion for the Flat rate, Per core, and Per core size pricing options.

### Configure reservation pricing (optional)

When you select either the _Flat rate_, _Per core_, and _Per core size_ price option, the **Reservation pricing** section appears. You can choose to offer savings for a 1-year commitment, 3-year commitment, or both. For more information about reservation pricing, including how prices are calculated, see [Plan a virtual machine offer](marketplace-virtual-machines.md#reservation-pricing-optional).

These steps assume you have already selected either the _Flat rate_, _Per core_, or _Per core size_ price option and entered a per hour price.

1. Under **Reservation pricing**, select **Yes, offer reservation pricing**.
1. To offer a 1-year discount, select the **1-year saving %** check box and then enter the percentage discount you want to offer.
1. To offer a 3-year discount, select the **3-year saving %** check box and then enter the percentage discount you want to offer.
1. To see the discounted prices, select **Price per core size**. A table with the 1-year and 3-year prices for each core size is shown. These prices are calculated based on the number of hours in the term with the percentage discount subtracted.

    > [!TIP]
    > For Per core size plans, you can optionally change the price for a particular core size in the **Price/hour** column of the table.

1. Make sure to select **Save draft** before you leave the page. The changes are applied once you publish the offer.

## Free trial

You can offer a one-month, three-month, or six-month **Free Trial** to your customers.

## Plan visibility

You can design each plan to be visible to everyone or only to a preselected private audience.

**Public**: Your plan can be seen by everyone.

**Private**: Make your plan visible only to a preselected audience. After it's published as a private plan, you can update the private audience or change it to public. After you make a plan public, it must remain public. It can't be changed back to a private plan. If the plan is private, you can specify the private audience that will have access to this plan using *Azure tenant IDs*, *subscription IDs*, or both. Optionally, include a **Description** of each Azure tenant ID or subscription ID that you assign. Add up to 10 subscription IDs and tenant IDs manually or import a CSV spreadsheet if more than 10 IDs are required. For a published offer, select **Sync private audience** for the changes to the private audience to take effect automatically without needing to republish the offer.

> [!NOTE]
> A private audience is different from the preview audience that you defined on the **Preview audience** pane. A preview audience can access and view all private and public plans for validation purposes before it's published live to Azure Marketplace. A private audience can only access the specific plans that they are authorized to have access to once the offer is live.

Private offers aren't supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP).

## Hide plan

A hidden plan is not visible on Azure Marketplace and can only be deployed through another Solution Template, Managed Application, Azure CLI or Azure PowerShell. Hiding a plan is useful when trying to limit exposure to customers that would normally be searching or browsing for it directly via Azure Marketplace. By selecting this checkbox all virtual machine images associated to your plan will be hidden from Azure Marketplace storefront.

> [!NOTE]
> A hidden plan is different from a private plan. When a plan is publicly available but hidden, it is still available for any Azure customer to deploy via Solution Template, Managed Application, Azure CLI or Azure PowerShell. However, a plan can be both hidden and private in which case only the customers configured in the private audience can deploy via these methods. If you wish to make the plan available to a limited set of customers, then set the plan to **Private**.

> [!IMPORTANT]
> Hidden plans don't generate preview links. However, you can test them by [following these steps](./azure-vm-faq.yml).

## Next steps

- [Technical configuration](azure-vm-plan-technical-configuration.md)