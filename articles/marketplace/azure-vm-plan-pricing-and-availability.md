---
title: Configure pricing and availability for a virtual machine offer on Azure Marketplace
description: Configure pricing and availability for a virtual machine offer in the Microsoft commercial marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 02/18/2022
---

# Configure pricing and availability for a virtual machine offer

On this pane, you configure:

- Markets where this plan is available. Every plan must be available in at least one [market](marketplace-geo-availability-currencies.md).
- The price per hour.
- Whether to make the plan visible to everyone or only to specific customers (a private audience).

### Markets

Every plan must be available in at least one market. Most markets are selected by default. To edit the list, select **Edit markets** and select or clear check boxes for each market location where this plan should (or shouldn't) be available for purchase. Users in selected markets can still deploy the offer to all Azure regions selected in the ["Plan setup"](azure-vm-plan-setup.md) section.

Select **Select only Microsoft Tax Remitted** to select only countries/regions in which Microsoft remits sales and use tax on your behalf. Publishing to China is limited to plans that are either *Free* or *Bring-your-own-license* (BYOL).

If you've already set prices for your plan in US dollar (USD) currency and add another market location, the price for the new market is calculated according to current exchange rates. Always review the price for each market before you publish. Review your pricing by selecting **Export prices (xlsx)** after you save your changes.

When you remove a market, customers from that market who are using active deployments won't be able to create new deployments or scale up their existing deployments. Existing deployments aren't affected.

Select **Save** to continue.

### Pricing

For the **License model**, select **Usage-based monthly billed plan** to configure pricing for this plan, or **Bring your own license** to let customers use this plan with their existing license. 

For a usage-based monthly billed plan, Microsoft will charge the customer for their hourly usage and they're billed monthly. This is our _Pay-as-you-go_ plan, where customers are only billed for the hours that they've used. When you select this plan, choose one of the following pricing options:

- **Free** – Your VM offer is free.
- **Flat rate (recommended)** – Your VM offer is the same hourly price regardless of the hardware it runs on.
- **Per core** – Your VM offer pricing is based on per CPU core count. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware.
- **Per core size** – Your VM offer is priced based on the number of CPU cores on the hardware it's deployed on.
- **Per market and core size** – Assign prices based on the number of CPU cores on the hardware it's deployed on, and also for all markets. Currency conversion is done by you, the publisher. This option is easier if you use the import pricing feature.

For **Per core size** and **Per market and core size**, enter a **Price per core**, and then select **Generate prices**. The tables of price/hour calculations are populated for you. You can then adjust the price per core, if you choose. If using the _Per market and core size_ pricing option, you can additionally customize the price/hour calculation tables for each market that’s selected for this plan.

> [!NOTE]
> To ensure that the prices are right before you publish them, export the pricing spreadsheet and review the prices in each market. Before you export pricing data, first select **Save draft** near the bottom of the page to save pricing changes.

Some things to consider when selecting a pricing option:
- For the first four options, Microsoft does the currency conversion.
- Microsoft suggests using a flat rate pricing for software solutions.
- Prices are fixed, so once the plan is published the prices can't be adjusted. However, if you would like to reduce prices for your VM offers you can open a [support ticket](support.md).

> [!IMPORTANT]
> Occasionally, Microsoft expands the list of supported core sizes available. When this occurs, we will notify you and request that you take action on your offer within a specified timeframe. If you do not review your offer within the timeframe specified, we’ll publish the new core sizes at the price that we have calculated for you. For details about updating core sizes, see [Update core size for an Azure virtual machine offer](azure-vm-plan-manage.md).

### Free Trial

You can offer a one-month, three-month, or six-month **Free Trial** to your customers.

### Plan visibility

You can design each plan to be visible to everyone or only to a preselected private audience.

**Public**: Your plan can be seen by everyone.

**Private**: Make your plan visible only to a preselected audience. After it's published as a private plan, you can update the private audience or change it to public. After you make a plan public, it must remain public. It can't be changed back to a private plan. If the plan is private, you can specify the private audience that will have access to this plan using *Azure tenant IDs*, *subscription IDs*, or both. Optionally, include a **Description** of each Azure tenant ID or subscription ID that you assign. Add up to 10 subscription IDs and tenant IDs manually or import a CSV spreadsheet if more than 10 IDs are required. For a published offer, select **Sync private audience** for the changes to the private audience to take effect automatically without needing to republish the offer.

> [!NOTE]
> A private audience is different from the preview audience that you defined on the **Preview audience** pane. A preview audience can access and view all private and public plans for validation purposes before it's published live to Azure Marketplace. A private audience can only access the specific plans that they are authorized to have access to once the offer is live.

Private offers aren't supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP).

### Hide plan

If your virtual machine is meant to be used only indirectly when it's referenced through another solution template or managed application, select this check box to publish the virtual machine but hide it from customers who might be searching or browsing for it directly.

Any Azure customer can deploy the offer using either PowerShell or CLI.  If you wish to make this offer available to a limited set of customers, then set the plan to **Private**.

Hidden plans don't generate preview links. However, you can test them by [following these steps](azure-vm-create-faq.yml#how-do-i-test-a-hidden-preview-image-).

Select **Save draft** before continuing to the next tab in the left-nav Plan menu, **Technical configuration**.

## Next step

- [Technical configuration](azure-vm-plan-technical-configuration.md)
