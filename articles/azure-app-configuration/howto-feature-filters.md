---
title: Enable Conditional Features with Feature Filters
titleSuffix: Azure App Configuration
description: Find out how to use feature filters in Azure App Configuration to turn on conditional feature flags for your application.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 07/18/2025
# customer intent: As a developer, I want to find out how to use feature filters in Azure App Configuration conditional feature flags so that I can specify conditions for turning features on and off in my application.

---

# Enable conditional features with feature filters

Feature flags provide a way to activate or deactivate functionality in your application. A basic feature flag is either on or off. The application behaves according to the value of the flag in all circumstances. For example, you can roll out a new feature behind a feature flag. When the feature flag is turned on, all users experience the new feature. Turning off the feature flag hides the new feature.

In contrast, when you use a _conditional feature flag_, you can dynamically turn the feature flag on or off. The behavior of the application depends on the feature flag criteria. This capability is useful when you want to show your new feature to a small subset of users at first. You can use a conditional feature flag to turn on the feature flag for some users while turning it off for others. 

This article shows you how to set criteria for dynamically changing the state of a conditional feature flag.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure App Configuration store.

## What is a feature filter?

_Feature filters_ are conditions for determining the state of a feature flag. When you add feature filters to a feature flag, you can invoke custom code each time the feature flag is evaluated.

The Microsoft feature management libraries include the following built-in feature filters, which you can configure in the Azure portal:

- The **Time window filter** type turns on a feature flag during a specified window of time.
- The **Targeting filter** type turns on a feature flag for specified users and groups.

You can create custom feature filters that turn on features based on specific criteria in your code. This article guides you through adding a custom feature filter to a feature flag. In the last step, you can follow links to instructions for implementing the feature filter in your application.

## Add a custom feature filter

1. Create a feature flag named **Beta** in your App Configuration store and open it for editing. For more information about how to add and edit a feature flag, see [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag) and [Edit feature flags](./manage-feature-flags.md#edit-feature-flags).

1. In the **Edit feature flag** dialog, select **Enable feature flag** if it isn't already selected. Select **Use feature filter**, and then select **Create**.

   :::image type="content" source="./media/feature-filters/edit-feature-flag.png" alt-text="Screenshot of the Azure portal Edit feature flag dialog. The Create button and the Enable feature flag and Use feature filter options are highlighted." lightbox="./media/feature-filters/edit-feature-flag.png":::

1. In the **Create a new filter** dialog, enter the following information:
   - Under **Filter type**, select **Custom filter**.
   - Under **Custom filter name**, enter **Random**.

   :::image type="content" source="./media/feature-filters/add-custom-filter.png" alt-text="Screenshot of the Create a new filter dialog. The Custom filter type is selected, and the Custom filter name box contains Random." lightbox="./media/feature-filters/add-custom-filter.png":::

1. Add a parameter by taking the following steps:
   - Under **Parameter name**, enter **Percentage**.
   - Under **Value**, enter **50**.

   Feature filters can optionally use parameters for configurable conditions. In this example, you configure the filter to turn on the feature flag with a 50 percent chance. When you implement the filter in your code, you use the specified percentage and a random number to evaluate the state of the feature flag.

   :::image type="content" source="./media/feature-filters/add-custom-filter-parameter.png" alt-text="Screenshot of the Create a new filter dialog. A parameter named Percentage is visible. It has a value of 50." lightbox="./media/feature-filters/add-custom-filter-parameter.png":::

1. To save the new feature filter, select **Add**. In the **Edit feature flag** dialog, the **Random** filter is now listed in the **Feature filters** section. 

1. To save the feature flag, select **Apply**.

   :::image type="content" source="./media/feature-filters/feature-flag-edit-apply-filter.png" alt-text="Screenshot of the Edit feature flag dialog. The Random filter is listed in the Feature filters section, and an Apply button is available." lightbox="./media/feature-filters/feature-flag-edit-apply-filter.png":::

   The **Edit feature flag** dialog closes, and your custom filter is added to your feature flag.

1. To implement the feature filter in your application, see the instructions that are appropriate for your language or platform:

   - [ASP.NET Core](./howto-feature-filters-aspnet-core.md)
   - [Node.js](./howto-feature-filters-javascript.md)
   - [Python](./howto-feature-filters-python.md)
   - [Go Gin](./howto-feature-filters-go.md)

## Next steps

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)