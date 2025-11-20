---
title: Roll Out Features to Targeted Audiences
titleSuffix: Azure App Configuration
description: Find out how to enable a staged rollout of features for targeted audiences by using a targeting filter in an Azure App Configuration feature flag.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 08/13/2025
# customer intent: As a developer, I want to find out how to use a targeting filter in an Azure App Configuration feature flag so that I can roll out features in stages to targeted audiences.
---

# Roll out features to targeted audiences

Targeting is a feature management strategy that developers can use to progressively roll out new features to their user base. The strategy is built on the concept of targeting a set of users known as the targeted audience. An audience is made up of specific users, groups, and a designated percentage of the entire user base.

- The users can be actual user accounts, but they can also be machines, devices, or any uniquely identifiable entities to which you want to roll out a feature.

- The groups are up to your application to define. For example, when you target user accounts, you can use Microsoft Entra groups or groups that denote user locations. When you target machines, you can group them based on rollout stages. You can base groups on any common attributes that you want to use to categorize your audience.

[Feature filters](./howto-feature-filters.md#what-is-a-feature-filter) provide a way for you to enable or disable a feature flag conditionally. The targeting filter is one of the feature management library's built-in feature filters. You can use a targeting filter to turn a feature on or off for targeted audiences.

This article shows you how to add and configure a targeting filter for a feature flag.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure App Configuration store.

## Add a targeting filter

1. Create a feature flag named *Beta* in your App Configuration store and open it for editing. For more information about how to add and edit a feature flag, see [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag) and [Edit feature flags](./manage-feature-flags.md#edit-feature-flags).

1. In the **Edit feature flag** dialog, select **Enable feature flag** if it isn't already selected. Select **Use feature filter**, and then select **Create**.

   :::image type="content" source="./media/feature-filters/edit-feature-flag.png" alt-text="Screenshot of the Azure portal Edit feature flag dialog. The Create button and the Enable feature flag and Use feature filter options are highlighted." lightbox="./media/feature-filters/edit-feature-flag.png":::

1. In the **Create a new filter** dialog, make the following selections:
   - Under **Filter type**, select **Targeting filter**.
   - Select **Override by Groups**.
   - Select **Override by Users**.

1. Enter the following information:
   - Under **Default Percentage**, enter **0**.
   - Under **Include Groups**:
     - For **Name**, enter `contoso.com`.
     - For **Percentage**, enter **50**.
   - Under **Exclude Groups**, enter `contoso-xyz.com`.
   - Under **Include Users**, enter `test@contoso.com`.
   - Under **Exclude Users**, enter `testuser@contoso.com`.

   :::image type="content" source="./media/feature-filters/add-targeting-filter.png" alt-text="Screenshot of the Azure portal. In the Create a new filter dialog, groups, users, and percentages are configured for a targeting filter." lightbox="./media/feature-filters/add-targeting-filter.png":::

   These settings result in the following behavior:

   - The feature flag is always disabled for user `testuser@contoso.com`, because `testuser@contoso.com` is listed in the **Exclude Users** section.
   - The feature flag is always disabled for users in the `contoso-xyz.com` group, because `contoso-xyz.com` is listed in the **Exclude Groups** section.
   - The feature flag is always enabled for user `test@contoso.com`, because `test@contoso.com` is listed in the **Include Users** section.
   - The feature flag is enabled for 50 percent of users in the `contoso.com` group, because `contoso.com` is listed in the **Include Groups** section with a **Percentage** value of **50**.
   - The feature is always disabled for all other users, because the **Default percentage** value is set to **0**.

   The targeting filter is evaluated for a given user as shown in the following diagram.

   :::image type="content" source="./media/feature-filters/targeting-evaluation-flow.png" alt-text="Flowchart with decision points for percentages, included users and groups, and excluded users and groups, and the end states Enabled and Disabled.":::

1. To save the configuration of the targeting filter, select **Add**. The **Edit feature flag** page lists the targeting feature filter and its parameters.

1. To save the feature flag, select **Apply**.

   :::image type="content" source="./media/feature-filters/feature-flag-edit-apply-targeting-filter.png" alt-text="Screenshot of the Edit feature flag dialog. The targeting filter is listed in the Feature filters section, and an Apply button is available." lightbox="./media/feature-filters/feature-flag-edit-apply-targeting-filter.png":::

   The targeting filter is added to your feature flag. This targeting filter uses the targeting rule you configured to enable or disable the feature flag for specific users and groups. 

1. To use the feature flag with the targeting filter in your application, see the instructions that are appropriate for your language or platform:

   - [ASP.NET Core](./howto-targetingfilter-aspnet-core.md)
   - [Node.js](./howto-targetingfilter-javascript.md)
   - [Go Gin](./howto-targetingfilter-go.md)

## Next steps

To find out more about feature filters, continue to the following articles:

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)