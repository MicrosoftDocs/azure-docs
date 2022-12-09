---
title: Create Power BI visual plans in Partner Center for Microsoft AppSource
description: Learn how to create plans for a Power BI visual offer in Partner Center for Microsoft AppSource.
author: trkeya
ms.author: trkeya
ms.reviewer: pooja.surnis
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 07/18/2022
---

# Create Power BI visual plans

> [!NOTE]
> If you enabled the “Managing license and selling with Microsoft” option on the [Offer setup](power-bi-visual-offer-setup.md#setup-details) page, the **Plans overview** tab appears in the left-nav as shown in the following screenshot. Otherwise, go to [Manage Power BI visual offer names](power-bi-visual-manage-names.md).

:::image type="content" source="./media/power-bi-visual/plan-overview-tab.png" alt-text="Screenshot the Plan overview tab in the left-nav of the Plan overview page.":::

You need to define at least one plan, if your offer has app license management enabled. You can create a variety of plans with different options for the same offer. These plans (sometimes referred to as SKUs) can differ in terms of monetization or tiers of service.

## Create a plan

1. In the left-nav, select **Plan overview**.
1. Near the top of the page, select **+ Create new plan**.
1. In the dialog box that appears, in the **Plan ID** box, enter a unique plan ID. Use up to 50 lowercase alphanumeric characters, dashes, or underscores. You cannot modify the plan ID after you select **Create**.
1. In the **Plan name** box, enter a unique name for this plan. Use a maximum of 200 characters.
    > [!NOTE]
    > This is the plan that customers will see in [Microsoft AppSource](https://appsource.microsoft.com/) and [Microsoft 365 admin center](https://admin.microsoft.com/).
1. Select **Create**.

## Define the plan listing

On the **Plan listing** tab, you can define the plan name and description as you want them to appear in the commercial marketplace. This information will be shown on the Microsoft AppSource listing page.

1. In the **Plan name** box, the name you provided earlier for this plan appears here. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer.
1. In the **Plan description** box, explain what makes this plan unique and any differences from other plans within your offer. This description may contain up to 3,000 characters.
1. Select **Save draft**.

## Define pricing and availability

1. In the left-nav, select **Pricing and availability**.
1. In the **Markets** section, select **Edit markets**.
1. On the side panel that appears, select at least one market. To make your offer available in every possible market, choose **Select all** or select only the specific markets you want. When you're finished, select **Save**.

    Your selections here apply only to new acquisitions; if someone already has your app in a certain market, and you later remove that market, the people who already have the offer in that market can continue to use it, but no new customers in that market will be able to get your offer.

    > [!IMPORTANT]
    > It is your responsibility to meet any local legal requirements, even if those requirements aren't listed here or in Partner Center. Even if you select all markets, local laws, restrictions, or other factors may prevent certain offers from being listed in some countries and regions.

### Configure per user pricing

1. On the **Pricing and availability** tab, under **User limits**, optionally specify the minimum and maximum number of users for this plan.

    > [!NOTE]
    > If you choose not to define the user limits, the default value of one to one million users will be used.

1. Under Billing term, specify a monthly price, annual price, or both.

    > [!NOTE]
    > You must specify a price for your offer, even if the price is zero.

    :::image type="content" source="./media/power-bi-visual/pricing-and-availability.png" alt-text="Screenshot of the pricing and availability tab.":::

### Enable a free trial

You can optionally configure a free trial for each plan in your offer. To enable a free trial, select the **Allow a one-month free trial** check box.

> [!IMPORTANT]
> After your transactable offer has been published with a free trial, it cannot be disabled for that plan. Make sure this setting is correct before you publish the offer to avoid having to re-create the plan.

If you select this option, customers are not charged for the first month of use. At the end of the free month, one of the following occurs:

- If the customer chooses recurring billing, they will automatically be upgraded to a paid plan and the selected payment method is charged.
- If the customer didn’t choose recurring billing, the plan will expire at the end of the free trial.

### Choose who can see your plan

You can configure each plan to be visible to everyone (public) or to only a specific audience (private).

Private plans restrict the discovery and deployment of your solution to a specific set of customers you choose and offer customized software and pricing. You can provide specialized pricing and support custom scenarios, as well as early access to limited release software to such customers.

If you only configure private plans for a visual:

- They'll be hidden from everyone else. Therefore, if a visual is already available to the public, you can’t change it to private plan only.
- They won’t be auto-updated, won’t appear in the store, and can’t be marked with a certification badge.

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private. If you upgrade an offer from list only to transactable, and add private plans only, the offer will be hidden from AppSource.

You grant access to a private plan using tenant IDs with the option to include a description of each tenant ID you assign. You can add a maximum of 10 tenant IDs manually or up to 20,000 tenant IDs using a .CSV file.

#### Make your plan public

1. Under **Plan visibility**, select **Public**.
1. Select **Save draft**, and then go to [View your plans](#view-your-plans).

#### Manually add tenant IDs for a private plan

1. Under **Plan visibility**, select **Private**.
1. In the **Tenant ID** box that appears, enter the Azure AD tenant ID of the audience you want to grant access to this private plan. A minimum of one tenant ID is required.
1. (Optional) Enter a description of this audience in the **Description** box.
1. To add another tenant ID, select **Add ID**, and then repeat steps 2 and 3.
1. When you're done adding tenant IDs, select **Save draft**, and then go to [View your plans](#view-your-plans).

#### Use a .CSV file for a private plan

1. Under **Plan visibility**, select **Private**.
1. Select the **Export Audience (csv)** link.
1. Open the .CSV file and add the Azure IDs you want to grant access to the private offer to the **ID** column.
1. (Optional) Enter a description for each audience in the **Description** column.
1. Add "TenantID" in the **Type** column, for each row with an Azure ID.
1. Save the .CSV file.
1. On the **Pricing and availability** tab, under **Plan visibility**, select the **Import Audience (csv)** link.
1. In the dialog box that appears, select **Yes**.
1. Select the .CSV file and then select **Open**.
1. Select **Save draft**, and then the next section: View your plans.

### View your plans

1. Select **Save draft** before leaving the _Pricing and availability_ page.
1. In the breadcrumb at the top of the page, select **Plan overview**.
1. To create another plan for this offer, at the top of the **Plan overview** page, repeat the steps in the [Create a plan](#create-a-plan) section. Otherwise, if you're done creating plans, go to the next section: Integrate your Visual with the Power BI License APIs.

## Integrate your Visual with the Power BI License APIs

You need to update the license enforcement in your visual.

For information about how to create a visual package, see [Package a Power BI visual](/power-bi/developer/visuals/package-visual).
For instructions on how to update license enforcement in your visual, see [Licensing API](/power-bi/developer/visuals/licensing-api).

## Next steps

- [Manage Power BI visual offer names](power-bi-visual-manage-names.md)
