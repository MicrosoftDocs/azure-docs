---
title: Group and allocate costs using tag inheritance
titleSuffix: Microsoft Cost Management
description: This article explains how to group costs using tag inheritance.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: sadoulta
---

# Group and allocate costs using tag inheritance

Tags are widely used to group costs to align with different business units, engineering environments, cost departments, and so on. Tags provide the visibility needed for businesses to manage and allocate costs across the different groups.

This article explains how to use the tag inheritance setting in Cost Management. When enabled, tag inheritance applies billing, resource group, and subscription tags to child resource usage records. You don't have to tag every resource or rely on resources that emit usage to have their own tags.

Tag inheritance is available for the following billing account types:

- Enterprise Agreement (EA)
- Microsoft Customer Agreement (MCA)
- Microsoft Partner Agreement (MPA) with Azure plan subscriptions

Here's an example diagram showing how a tag is inherited.

>[!NOTE]
> Inherited tags are applied to child resource usage records and not the resources themselves.

:::image type="content" source="./media/enable-tag-inheritance/tag-example-01.svg" alt-text="Example diagram showing how a tag is inherited." border="false" lightbox="./media/enable-tag-inheritance/tag-example-01.svg":::

## Required permissions

- For subscriptions:
  - Cost Management reader to view
  - Cost Management Contributor to edit
- For EA billing accounts:
  - Enterprise Administrator (read-only) to view
  - Enterprise Administrator to edit
- For MCA billing profiles:
  - Billing profile reader to view
  - Billing profile contributor to edit

## Enable tag inheritance

You can enable the tag inheritance setting in the Azure portal. You apply the setting at the EA billing account, MCA billing profile, and subscription scopes.

>[!NOTE]
> If you don't see the Configuration page, or if you don't see the **Tag Inheritance** option, make sure that you have have a supported scope selected and that you have the correct permissions to the scope.

### To enable tag inheritance in the Azure portal for an EA billing account

1. In the Azure portal, search for **Cost Management** and select it (the green hexagon-shaped symbol, *not* Cost Management + Billing).
1. Select a scope.
1. In the left menu under **Settings**, select **Configuration**.
1. Under **Tag inheritance**, select **Edit**.  
    :::image type="content" source="./media/enable-tag-inheritance/edit-tag-inheritance.png" alt-text="Screenshot showing the Edit option for Tag inheritance for an EA billing account." lightbox="./media/enable-tag-inheritance/edit-tag-inheritance.png" :::
1. In the Tag inheritance window, select **Automatically apply subscription and resource group tags to new data**.  
    :::image type="content" source="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data.png" alt-text="Screenshot showing the Automatically apply subscription and resource group tags to new data option for a billing account."  lightbox="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data.png":::

After tag inheritance is enabled, subscription and resource group tags are applied to child resource usage records for the current month within 24 hours.

### To enable tag inheritance in the Azure portal for an MCA billing profile

1. In the Azure portal, search for **Cost Management** and select it (the green hexagon-shaped symbol, *not* Cost Management + Billing).
1. Select a scope.
1. In the left menu under **Settings**, select **Manage billing profile**.
1. Under **Tag inheritance**, select **Edit**.  
    :::image type="content" source="./media/enable-tag-inheritance/edit-tag-inheritance-billing-profile.png" alt-text="Screenshot showing the Edit option for Tag inheritance for an MCA billing profile." lightbox="./media/enable-tag-inheritance/edit-tag-inheritance-billing-profile.png":::
1. In the Tag inheritance window, select **Automatically apply billing, subscription and resource group tags to new usage data**.  
    :::image type="content" source="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data-billing-profile.png" alt-text="Screenshot showing the Automatically apply subscription and resource group tags to new data option for a billing profile." lightbox="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data-billing-profile.png":::

After tag inheritance is enabled, billing profile, invoice section, subscription, and resource group tags are applied to child resource usage records for the current month within 24 hours.

### To enable tag inheritance in the Azure portal for a subscription

1. In the Azure portal, search for **Cost Management** and select it (the green hexagon-shaped symbol, *not* Cost Management + Billing).
1. Select a subscription scope.
1. In the left menu under **Settings**, select **Manage subscription**.
1. Under **Tag inheritance**, select **Edit**.  
    :::image type="content" source="./media/enable-tag-inheritance/edit-tag-inheritance-subscription.png" alt-text="Screenshot showing the Edit option for Tag inheritance for a subscription." lightbox="./media/enable-tag-inheritance/edit-tag-inheritance-subscription.png":::
1. In the Tag inheritance window, select **Automatically apply subscription and resource group tags to new data**.  
    :::image type="content" source="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data-subscription.png" alt-text="Screenshot showing the Automatically apply subscription and resource group tags to new data option for a subscription." lightbox="./media/enable-tag-inheritance/automatically-apply-tags-new-usage-data-subscription.png":::

## Choose between resource and inherited tags

When a resource tag matches the inherited tag being applied, the resource tag is applied to its usage record by default. You can change the default behavior to have the inherited tag override the resource tag.

**For EA customers**:

In the Tag inheritance window, select the **Use the subscription or resource group tag** option.

:::image type="content" source="./media/enable-tag-inheritance/use-subscription-resource-group-tag.png" alt-text="Screenshot showing the inherited tag option selected for EA customers." :::

**For MCA customers**:

In the tag inheritance window, select the **Use the inherited tag** option.

:::image type="content" source="./media/enable-tag-inheritance/tag-inheritance-use-inherited-tag.png" alt-text="Screenshot showing the inherited tag option selected for MCA customers." lightbox="./media/enable-tag-inheritance/tag-inheritance-use-inherited-tag.png" :::

Let's look at an example of how a resource tag gets applied. In the following diagram, resource 4 and resource group 2 have the same tag: *App*. Because the user chose to keep the resource tag, usage record 4 is updated with the resource tag value *E2E*.

:::image type="content" source="./media/enable-tag-inheritance/tag-example-02.svg" alt-text="Example diagram showing how a resource tag gets applied." border="false" lightbox="./media/enable-tag-inheritance/tag-example-02.svg":::

Let's look at another example where a resource tag gets overridden. In the following diagram, resource 4 and resource group 2 have the same tag: **App**. Because the user chose to use the resource group or subscription tag, usage record 4 is updated with the resource group tag value, which is *backend*¹.

¹ When the subscription and resource group tags are the same as the resource tag and you select the **Use the subscription or resource group tag** option, the subscription tag is used.

:::image type="content" source="./media/enable-tag-inheritance/tag-example-03.svg" alt-text="Example diagram showing how a resource tag gets overridden." border="false" lightbox="./media/enable-tag-inheritance/tag-example-03.svg":::

## Usage record updates

After the tag inheritance setting is updated, it takes about 8-24 hours for the child resource usage records to get updated. Any update to the setting or the tags being inherited takes effect for the current month.

For example, if the tag inheritance setting is enabled on October 20, child resource usage records are updated from October 1 using the tags that existed on October 20. 
 
> [!NOTE]
> If there are purchases or resources that don’t emit usage at a subscription scope, they will not have the subscription tags applied even if the setting is enabled.

## View costs grouped by tags

You can use Cost analysis to view the costs grouped by tags.

1. In the Azure portal, navigate to **Cost Management**.
1. In the left menu, select **Cost Analysis**.
1. Select a scope.
1. In the **Group by** list, select the tag you want to view costs for.

Here's an example showing costs for the *org* tag.

:::image type="content" source="./media/enable-tag-inheritance/cost-analysis-view-tag.png" alt-text="Screenshot showing costs for the org example tag." lightbox="./media/enable-tag-inheritance/cost-analysis-view-tag.png" :::You can create Budgets with filters on the inherited tags, 24 hours after enabling tag inheritance. You can also view the inherited tags by downloading your Azure usage. For more information, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md).

## Next steps

- Learn how to [split shared costs](allocate-costs.md).
