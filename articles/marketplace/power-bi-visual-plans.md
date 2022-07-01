---
title: Create Power Bi visual plans in Partner Center for Microsoft AppSource
description: Learn how to create plans for a Power BI visual offer in Partner Center for Microsoft AppSource.
author: posurnis
ms.author: posurnis
ms.reviewer: pooja.surnis
ms.service: powerbi
ms.subservice: powerbi-custom-visuals
ms.topic: how-to
ms.date: 07/18/2022
---

# Create Power Bi visual plans

> [!NOTE]
> If you enabled app license management for your offer, the **Plans overview** tab appears in the left-nav as shown in the following screenshot. Otherwise, go to [Manage Power BI visual offer names](power-bi-visual-manage-names.md).

:::image type="content" source="./media/power-bi-visual/plan-overview-tab.png" alt-text="Screenshot the Plan overview tab in the left-nav of the Plan overview page.":::

You need to define at least one plan, if your offer has app license management enabled. You can create a variety of plans with different options for the same offer. These plans (sometimes referred to as SKUs) can differ in terms of monetization or tiers of service. Later, you will map the Service IDs of each plan in the metadata of your solution package to enable a runtime license check by the Dynamics platform against these plans (we'll walk you through this process later). You’ll map the Service ID of each plan in your solution package.

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

1. In the **Plan name** box, the name you provided earlier for this plan appears here. You can change it at any time. This name will appear in the commercial marketplace as the title of your offer's software plan.
1. In the **Plan description** box, explain what makes this software plan unique and any differences from other plans within your offer. This description may contain up to 3,000 characters.
1. Select **Save draft**.

## Define pricing and availability

If you chose to sell through Microsoft and have Microsoft host transactions on your behalf, then the **Pricing and availability** tab appears in the left-nav. Otherwise, go to [Copy the Service IDs](#copy-the-service-ids).

1. In the left-nav, select **Pricing and availability**.
1. In the **Markets** section, select **Edit markets**.
1. On the side panel that appears, select at least one market. To make your offer available in every possible market, choose **Select all** or select only the specific markets you want. When you're finished, select **Save**.

    Your selections here apply only to new acquisitions; if someone already has your app in a certain market, and you later remove that market, the people who already have the offer in that market can continue to use it, but no new customers in that market will be able to get your offer.

    > [!IMPORTANT]
    > It is your responsibility to meet any local legal requirements, even if those requirements aren't listed here or in Partner Center. Even if you select all markets, local laws, restrictions, or other factors may prevent certain offers from being listed in some countries and regions.

## Configure per user pricing




## Copy the Service IDs
