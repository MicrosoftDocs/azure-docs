---
title: "Tutorial: Use Azure App Configuration to manage feature flags"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to manage feature flags separately from your application by using Azure App Configuration.
services: azure-app-configuration
documentationcenter: ''
author: maud-lv
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 03/31/2022
ms.author: malev
ms.custom: "devx-track-csharp, mvc"

#Customer intent: I want to control feature availability in my app by using App Configuration.
---

# Tutorial: Manage feature flags in Azure App Configuration

You can store all feature flags in Azure App Configuration and administer them from a single place. App Configuration has a portal UI named **Feature Manager** that's designed specifically for feature flags. App Configuration also natively supports the .NET Core feature-flag data schema.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Define and manage feature flags in App Configuration.
> * Access feature flags from your application.

## Create feature flags

The Feature Manager in the Azure portal for App Configuration provides a UI for creating and managing the feature flags that you use in your applications.

To add a new feature flag:

1. Open an Azure App Configuration store and from the **Operations** menu, select **Feature Manager** > **+Add**.

    :::image type="content" source="media/azure-app-configuration-feature-flags.png" alt-text="Screenshot of the Azure platform. Add a feature flag.":::

1. Check the box **Enable feature flag** to make the new feature flag active as soon as you've completed the creation of the feature flag.

1. You can use a key name to filter feature flags that are loaded in your application. A key name matching the name of your feature flag is automatically added to the form. You can edit this name if you want to.

1. Optionally select one of your existing labels from the dropdown menu.

1. Optionally enter a description.

    :::image type="content" source="media/azure-app-configuration-feature-flag-create.png" alt-text="Screenshot of the Azure platform. Feature flag creation form - part 1.":::

1. Optionally  select the **User feature filter** checkbox. A Feature filter consistently evaluates the state of a feature flag. The App Configuration feature management library supports three types of built-in filters: **Targeting**, **Time window**, and **Custom** filters, which can be created based on different factors

    Enter a built-in or custom filter key, and then select **+Add parameter** to associate one or more parameters with the filter. App Configuration has two built-in filters:

    | Filter | Description |
    |---|---|
    | Targeting | Filter defining users, groups, and rollout percentages. You can select a default percentage impacting the entire user base, or assign a percentage to a group.
    | Time window | Select a start date and an optional expiry date to enable features based on a specific period of time. |

    You can instead choose to use custom filters:

    | Filter | JSON parameters |
    |---|---|
    | Microsoft.Percentage | {"Value": 0-100 percent} |
    | Microsoft.Targeting | { "Audience": JSON blob defining users, groups, and rollout percentages. See an example under the `EnabledFor` element of [this settings file](https://github.com/microsoft/FeatureManagement-Dotnet/blob/master/examples/FeatureFlagDemo/appsettings.json) }|
    | Microsoft.TimeWindow | {"Start": UTC time, "End": UTC time} |

    :::image type="content" source="media/azure-app-configuration-feature-flag-filter.png" alt-text="Screenshot of the Azure platform. Add a feature filter.":::

1. Select **Apply** to validate the creation of the feature flag.

## Update feature flag states

To change a feature flag's state value:

1. From the menu on the left, select **Feature Manager**.

1. To the right of a feature flag you want to modify, select the **More actions** ellipsis (**...**), and then select **Edit**.

    :::image type="content" source="media/azure-app-configuration-feature-flag-edit.png" alt-text="Screenshot of the Azure platform. Edit a feature flag.":::

1. Update the feature flag. You can enable or disable it, edit its description and filters.

## Access feature flags

Feature flags created by the Feature Manager are stored and retrieved as regular key-values. They're kept under a special namespace prefix `.appconfig.featureflag`. To view the underlying key-values, in the **Operations** menu open the **Configuration explorer**.

:::image type="content" source="media/azure-app-configuration-feature-flag-retrieve.png" alt-text="Screenshot of the Azure platform. Retrieve a feature flag.":::

Your application can retrieve these values by using the App Configuration configuration providers, SDKs, command-line extensions, and REST APIs.

## Next steps

In this tutorial, you learned how to manage feature flags and their states by using App Configuration. For more information about feature-management support in App Configuration and ASP.NET Core, go to:

* [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md)
