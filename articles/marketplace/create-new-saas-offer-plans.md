---
title: How to create plans for your SaaS offer in Microsoft Partner Center 
description: How to create plans for a new software as a service (SaaS) offer using the Microsoft commercial marketplace portal in Partner Center. 
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 09/02/2020
---

# How to create plans for your SaaS offer

Offers sold through the Microsoft commercial marketplace must have at least one plan. You can create a variety of plans with different options within the same offer. These plans (sometimes referred to as SKUs) can differ in terms of version, monetization, or tiers of service. For detailed guidance on plans, see [Plans and pricing for commercial marketplace offers](plans-pricing.md).

> [!NOTE]
> If you choose to process transactions independently, you will not see this option. Instead, skip to [How to sell your SaaS offer](create-new-saas-offer-marketing.md).

## Create a plan

1. Near the top of the **Plan overview** tab, select **+ Create new plan**.

1. In the dialog box that appears, in the **Plan ID** box, enter a unique plan ID. Use up to 50 lowercase alphanumeric characters, dashes, or underscores. You cannot modify the plan ID after you select **Create**.

1. In the **Plan name** box, enter a unique name for this plan. Use a maximum of 50 characters.

1. Select **Create**.

## Define the plan listing

On the **Plan listing** tab, you can define the plan name and description as you want them to appear in the commercial marketplace.

1. In the **Plan name** box, the name you provided earlier for this plan appears here. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer's software plan.

1. In the **Plan description** box, explain what makes this software plan unique and any differences from other plans within your offer. This description may contain up to 500 characters.
1. Select **Save draft** before continuing to the next tab: **Pricing and availability**.

## Define markets, pricing, and availability

Every plan must be available in at least one market. On the **Pricing and availability** tab, you can configure the markets this plan will be available in, the desired monetization model, price, and billing terms. In addition, you can indicate whether to make the plan visible to everyone or only to specific customers (also called a private plan).

1. Under **Markets**, select the **Edit markets** link.
1. In the dialog box that appears, select the market locations where you want to make your plan available. You must select a minimum of one and maximum of 141 markets.

   > [!NOTE]
   > This dialog box includes a search box and an option to filter on only "Tax Remitted" countries, in which Microsoft remits sales and use tax on your behalf.

1. Select **Save**, to close the dialog box.

## Define a pricing model

You must associate a pricing model with each plan: either _flat rate_ or _per user_. All plans in the same offer must use the same pricing model. For example, an offer cannot have one plan that's flat rate and another plan that’s per user. For more information, see [SaaS pricing models](plan-saas-offer.md#saas-pricing-models).

> [!IMPORTANT]
> After your offer is published, you cannot change the pricing model. In addition, all plans for the same offer must share the same pricing model.

### Configure flat rate pricing

1. On the **Pricing and availability** tab, under **Pricing**, select **Flat rate**.
1. Select either the **Monthly** or **Annual** check box, or both and then enter the price.

### Add a custom meter dimension

This option is available only if you selected flat rate pricing. For more information, see [Metered billing for SaaS using the commercial marketplace metering service](./partner-center-portal/saas-metered-billing.md).

1. Under **Marketplace Metering Service dimensions**, select the **Add a Custom Meter Dimension (Max 30)** link.
1. In the **ID** box, enter the immutable identifier reference while emitting usage events.
1. In the **Display Name** box, enter the display name associated with the dimension. For example, "text messages sent".
1. In the **Unit of Measure** box, enter the description of the billing unit. For example, "per text message" or "per 100 emails".
1. In the **Price per unit in USD** box, enter the price for one unit of the dimension.
1. In the **Monthly quantity included in base** box, enter the quantity (as an integer) of the dimension that's included each month for customers who pay the recurring monthly fee. To set an unlimited quantity, select the check box instead.
1. In the **Annual quantity included in base** box, enter the quantity of the dimension (as an integer) that's included each month for customers who pay the recurring annual fee. To set an unlimited quantity, select the check box instead.
1. To add another custom meter dimension, select the **Add another Dimension** link, and then repeat steps 1 through 7.

### Configure per user pricing

1. On the **Pricing and availability** tab, under **Pricing**, select **Per User**.
2. If applicable, under **User limits**, specify the minimum and maximum number of users for this plan.
3. Under **Billing term**, specify a monthly price, annual price, or both.

### Validate custom prices

To set custom prices in an individual market, export, modify, and then import the pricing spreadsheet. You're responsible for validating this pricing and owning these settings. For detailed information, see [Custom prices](plans-pricing.md#custom-prices).

1. You must first save your pricing changes to enable export of pricing data. Near the bottom of the **Pricing and availability** tab, select **Save draft**.
1. Under **Pricing**, select the **Export pricing data** link.
1. Open the exportedPrice.xlsx file in Microsoft Excel.
1. In the spreadsheet, make the updates you want to your pricing information and then save the .CSV file.<br> You may need to enable editing in Excel before you can update the file.
2. On the **Pricing and availability** tab, under **Pricing**, select the **Import pricing data** link.
3. In the dialog box that appears, click **Yes**.
4. Select the exportedPrice.xlsx file you updated, and then click **Open**.

### Enable a free trial

You can configure a free trial for each plan in your offer. Select the check box to allow a one-month free trial. This check box isn't available for plans that use the marketplace metering service. For more information, see [Free trials](plans-pricing.md#free-trials).

> [!IMPORTANT]
> After your transactable offer has been published with a free trial, it cannot be disabled for that plan. Make sure this setting is correct before you publish the offer to avoid having to re-create the plan.

- Under **Free Trial**, select the **Allow a one-month free trial** check box.

## Choose who can see your plan

You can configure each plan to be visible to everyone or to only a specific audience. You grant access to a private plan using tenant IDs with the option to include a description of each tenant ID you assign. You can add a maximum of 10 tenant IDs manually or up to 20,000 tenant IDs using a .CSV file.

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private.

### Make your plan public

1. Under **Plan visibility**, select the **Public** box.
1. Select **Save draft**, and then in the upper left of the tab, select **Plan overview** to return to the **Plan overview** tab.
1. To create another plan for this offer, near the top of the **Plan overview** tab, select **+ Create new plan**. Then repeat the steps in the [Create a plan](#create-a-plan) section. Otherwise, go to [View your plans](#view-your-plans).

### Manually add tenant IDs for a private plan 

1. Under **Plan visibility**, select the **This is a private plan** box.
1. In the **Tenant ID** box that appears, enter the Azure AD tenant ID of the audience you want to grant access to this private plan. A minimum of one tenant ID is required.
1. (Optional) Enter a description of this audience in the **Description** box.
1. To add another tenant ID, repeat steps 2 and 3.
1. When you're done adding tenant IDs, select **Save draft**, and then in the upper left of the tab, select **Plan overview** to return to the **Plan overview** tab.
1. To create another plan for this offer, near the top of the **Plan overview** tab, select **+ Create new plan**. Then repeat the steps in the [Create a plan](#create-a-plan) section. Otherwise, go to [View your plans](#view-your-plans).

### Use a .CSV file for a private plan

1. Under **Plan visibility**, select the **This is a private plan** box.
2. Select the **Export Audience (csv)** link.
3. Open the .CSV file and add the Azure IDs you want to grant access to the private offer to the **ID** column.
4. Optionally, enter a description for each audience in the **Description** column.
5. Add "TenantID" in the **Type** column, for each row with an Azure ID.
6. Save the .CSV file.
7. On the **Pricing and availability** tab, under **Plan visibility**, select the **Import Audience (csv)** link.
8. In the dialog box that appears, select **Yes**.
9. Select the .CSV file and then select **Open**.
10. Select **Save draft**, and then in the upper left of the tab, select **Plan overview** to return to the **Plan overview** tab.
11. To create another plan for this offer, at the top of the **Plan overview** tab, select **+ Create new plan**. Then repeat the steps in the [Create a plan](#create-a-plan) section. Otherwise, if you're done creating plans, go to the next section: **View your plans**.

## View your plans

After you create one or more plans, you'll see your plan name, plan ID, pricing model, availability (Public or Private), current publishing status, and any available actions on the **Plan overview** tab.

The actions that are available in the **Action** column of the **Plan overview** tab vary depending on the status of your plan, and may include the following:

- If the plan status is **Draft**, the link in the **Action** column will say **Delete draft**.
- If the plan status is **Live**, the link in the **Action** column will be either **Stop sell plan** or **Sync private audience**. The **Sync private audience** link will publish only the changes to your private audiences, without publishing any other updates you might have made to the offer.

## Next steps

- Learn [How to sell your SaaS offer](create-new-saas-offer-marketing.md) through the **Co-sell with Microsoft** and **Resell through CSPs** programs.
- [How to test and publish a SaaS offer to the commercial marketplace](test-publish-saas-offer.md).
