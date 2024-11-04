---
title: Enable features on a schedule
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule using time window filters in Azure App Configuration.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 10/31/2024
#customer intent: As an application developer, I want to enable a recurring time window filter in a feature flag so that I can enable or disable features on a schedule.
---

# Enable features on a schedule

[Feature filters](./howto-feature-filters.md#what-is-a-feature-filter) allow a feature flag to be enabled or disabled conditionally. The time window filter is one of the feature management library's built-in feature filters. It allows you to turn on or off a feature on a schedule. For example, when you have a new product announcement, you can use it to unveil a feature automatically at a planned time. You can also use it to discontinue a promotional discount as scheduled after the marketing campaign ends.

In this article, you learn how to add and configure a time window filter for your feature flags.

## Add a time window filter

1. Create a feature flag named *Beta* in the **Feature Manager** menu of your App Configuration store and move to the right end of the feature flag you want to modify, then select the **More actions** ellipsis (**...**) action and **Edit**. For more information about how to add and edit a feature flag, see [Manage feature flags](./manage-feature-flags.md).

1. In the **Edit** pane that opens, check the **Enable feature flag** checkbox if it isn't already enabled. Then check the **Use feature filter** checkbox and select **Create**.

    :::image type="content" source="media/feature-filters/edit-a-feature-flag.png" alt-text="Screenshot of the Azure portal showing how to edit a feature flag.":::

1. The pane **Create a new filter** opens. Under **Filter type**, select the **Time window filter** in the dropdown.

    :::image type="content" source="media/feature-filters/add-timewindow-filter.png" alt-text="Screenshot of the Azure portal showing time window feature filter configuration.":::

1. A time window filter includes a start time and/or an end time. The start time indicates when the feature flag is activated, and the end time indicates when the flag is deactivated. Both **Start time** and **End time** checkboxes are checked by default. Enter a start time a few minutes ahead of your current time and enter an end time.

    > [!NOTE]
    > If you don't want the feature flag to automatically deactivate, uncheck the **End time** box. However, both start time and end time must be set to enable feature recurrence.

1. A time zone is selected by default, based on your browser's current time zone. Optionally select another time zone.

## Configure recurrence

1. Select the **Enable recurrence** checkbox to set up a recurring schedule for the feature flag. This allows you to automate the activation and deactivation of the feature flag based on a regular schedule, such as during periods of low or high traffic. Choose a daily or weekly frequency, the specific days, and the expiration time.

    :::image type="content" source="media/feature-filters/add-timewindow-filter-recurrence.png" alt-text="Screenshot of the Azure portal showing feature filter recurrence.":::

1. Select **Add** to save the configuration of the time window filter and return to the **Edit feature flag** screen.

1. The time window filter is now listed in the feature filter details, under **Feature filters**. Select **Apply** to save the feature flag with the new feature filter.

For more information about the time window feature filter, refer to the [Microsoft.TimeWindow feature reference](/azure/azure-app-configuration/feature-management-dotnet-reference?pivots=stable-version).

## Next steps

In this tutorial, you learned the concept of the time window filter and added it to a feature flag.

To learn how to use the feature flag with a time window filter in your application, continue to the following tutorial.

> [!div class="nextstepaction"]
> [ASP.NET Core](./howto-timewindow-filter-aspnet-core.md)

To learn more about the feature filters, continue to the following tutorials:

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)