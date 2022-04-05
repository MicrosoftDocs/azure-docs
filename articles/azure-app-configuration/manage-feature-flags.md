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
ms.date: 04/05/2022
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

1. Check the box **Enable feature flag** to make the new feature flag active as soon as the flag has been created.

1. Enter a **feature flag name**. The feature flag name is the unique ID of the flag, and the name that should be used when referencing the flag in code.

1. You can also set a **key** name for your feature flag. The default value of this key name is the name of your feature flag. You can change the key name to a filter, which can be used to filter for specific feature flags when loading in your application. For example, adding a prefix or a namespace for grouping.

1. Optionally select one of your existing labels from the dropdown menu and enter a description.

1. Leave the **User feature filter** box unchecked and select **Apply** to validate the creation of the feature flag. To learn more about feature filters, visit [Use feature filters to enable conditional feature flags](howto-feature-filters-aspnet-core.md) and [Enable staged rollout of features for targeted audiences](howto-targetingfilter-aspnet-core.md).

    :::image type="content" source="media/azure-app-configuration-feature-flag-create.png" alt-text="Screenshot of the Azure platform. Feature flag creation form - part 1.":::

## Update feature flag states

To change a feature flag's state value:

1. From the menu on the left, select **Feature Manager**.

1. To the right of a feature flag you want to modify, select the **More actions** ellipsis (**...**), and then select **Edit**.

    :::image type="content" source="media/azure-app-configuration-feature-flag-edit.png" alt-text="Screenshot of the Azure platform. Edit a feature flag.":::

1. Update the feature flag. You can enable or disable it, as well as edit its description and filters.

## Access feature flags

Feature flags created with the Feature Manager are stored and retrieved as regular key-values. They're kept under a special namespace prefix `.appconfig.featureflag`. To view the underlying key-values, in the **Operations** menu open the **Configuration explorer**.

:::image type="content" source="media/azure-app-configuration-feature-flag-retrieve.png" alt-text="Screenshot of the Azure platform. Retrieve a feature flag.":::

Your application can retrieve these values by using the App Configuration configuration providers, SDKs, command-line extensions, and REST APIs.

## Next steps

> [!div class="nextstepaction"]
> [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md)
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
