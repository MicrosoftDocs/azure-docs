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
:::image type="content" source="media/add-feature-flag.png" alt-text="Screenshot of the Azure platform. Add a feature flag." lightbox="media/add-feature-flag-expanded.png":::

1. Check the box **Enable feature flag** to make the new feature flag active as soon as the flag has been created.

1. Enter a **Feature flag name**. The feature flag name is the unique ID of the flag, and the name that should be used when referencing the flag in code.

1. You can edit the key for your feature flag. The default value for this key is the name of your feature flag. You can change the key to add a prefix, which can be used to find specific feature flags when loading the feature flags in your application. For example, using the application's name as prefix such as **appname:featureflagname**.

1. Optionally select an existing label or create a new one, and enter a description for the new feature flag.

1. Leave the **Use feature filter** box unchecked and select **Apply** to create the feature flag. To learn more about feature filters, visit [Use feature filters to enable conditional feature flags](howto-feature-filters-aspnet-core.md) and [Enable staged rollout of features for targeted audiences](howto-targetingfilter-aspnet-core.md).
:::image type="content" source="media/create-feature-flag.png" alt-text="Screenshot of the Azure platform. Feature flag creation form.":::

## Update feature flags

To update a feature flag:

1. From the **Operations** menu, select **Feature Manager**.

1. Move to the right end of the feature flag you want to modify, select the **More actions** ellipsis (**...**). From this menu, you can edit the flag, create a label, lock or delete the feature flag.
:::image type="content" source="media/edit-feature-flag.png" alt-text="Screenshot of the Azure platform. Edit a feature flag." lightbox="media/edit-feature-flag-expanded.png":::

1. Select **Edit** and update the feature flag.

In the **Feature manager**, you can also change the state of a feature flag by checking or unchecking the **Enable Feature flag** checkbox.

## Access feature flags

In the **Operations** menu, select **Feature manager**. You can select **Edit Columns** to add or remove columns, and change the column order.
create a label, lock or delete the feature flag.
:::image type="content" source="media/edit-columns-feature-flag.png" alt-text="Screenshot of the Azure platform. Edit feature flag columns." lightbox="media/edit-columns-feature-flag-expanded.png":::

Feature flags created with the Feature Manager are stored and retrieved as regular key-values. They're kept under a special namespace prefix `.appconfig.featureflag`.

To view the underlying key-values:

1. In the **Operations** menu, open the **Configuration explorer**.

1. Select **Manage view** > **Settings**.

1. Select **Include feature flags in the configuration explorer** and **Apply**.
:::image type="content" source="media/include-feature-flag-configuration-explorer.png" alt-text="Screenshot of the Azure platform. Include feature flags in Configuration explorer." lightbox="media/include-feature-flag-configuration-explorer.png":::

Your application can retrieve these values by using the App Configuration configuration providers, SDKs, command-line extensions, and REST APIs.

## Next steps

> [!div class="nextstepaction"]
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
