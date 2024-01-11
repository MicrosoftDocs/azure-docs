---
title: "Tutorial: Use Azure App Configuration to manage feature flags"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to manage feature flags separately from your application by using Azure App Configuration.
services: azure-app-configuration
documentationcenter: ''
author: maud-lv
ms.service: azure-app-configuration
ms.topic: tutorial
ms.date: 10/18/2023
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

1. Open an Azure App Configuration store and from the **Operations** menu, select **Feature Manager** > **Create**.

    :::image type="content" source="media\manage-feature-flags\add-feature-flag.png" alt-text="Screenshot of the Azure platform. Create a feature flag.":::

1. Check the box **Enable feature flag** to make the new feature flag active as soon as the flag has been created.

    :::image type="content" source="media\manage-feature-flags\create-feature-flag.png" alt-text="Screenshot of the Azure platform. Feature flag creation form.":::

1. Enter a **Feature flag name**. The feature flag name is the unique ID of the flag, and the name that should be used when referencing the flag in code.

1. You can edit the **Key** for your feature flag. The default value for this key is the name of your feature flag. You can change the key to add a prefix, which can be used to find specific feature flags when loading the feature flags in your application. For example, using the application's name as prefix such as **appname:featureflagname**.

1. Optionally select an existing **Label** or create a new one, and enter a description for the new feature flag.

1. Leave the **Use feature filter** box unchecked and select **Apply** to create the feature flag. To learn more about feature filters, visit [Use feature filters to enable conditional feature flags](howto-feature-filters-aspnet-core.md) and [Enable staged rollout of features for targeted audiences](howto-targetingfilter-aspnet-core.md).

## Update feature flags

To update a feature flag:

1. From the **Operations** menu, select **Feature Manager**.

1. Move to the right end of the feature flag you want to modify and select the **More actions** ellipsis (**...**). From this menu, you can edit the flag, create a label, update tags, review the history, lock or delete the feature flag.

1. Select **Edit** and update the feature flag.

    :::image type="content" source="media\manage-feature-flags\edit-feature-flag.png" alt-text="Screenshot of the Azure platform. Edit a feature flag.":::

In the **Feature manager**, you can also change the state of a feature flag by checking or unchecking the **Enable Feature flag** checkbox.

## Access feature flags

In the **Operations** menu, select **Feature manager** to display all your feature flags.

:::image type="content" source="media\manage-feature-flags\edit-columns-feature-flag.png" alt-text="Screenshot of the Azure platform. Edit feature flag columns." lightbox="media/edit-columns-feature-flag-expanded.png":::

**Manage view** > **Edit Columns** lets you add or remove columns and change the column order.

**Manage view** > **Settings** lets you choose how many feature flags will be loaded per **Load more** action. **Load more** will only be visible if there are more than 200 feature flags.

Feature flags created with the Feature Manager are stored as regular key-values. They're kept with a special prefix `.appconfig.featureflag/` and content type `application/vnd.microsoft.appconfig.ff+json;charset=utf-8`.

To view the underlying key-values:

1. In the **Operations** menu, open the **Configuration explorer**.

    :::image type="content" source="media\manage-feature-flags\include-feature-flag-configuration-explorer.png" alt-text="Screenshot of the Azure platform. Include feature flags in Configuration explorer.":::

1. Select **Manage view** > **Settings**.

1. Select **Include feature flags in the configuration explorer** and **Apply**.

Your application can retrieve these values by using the App Configuration configuration providers, SDKs, command-line extensions, and REST APIs.

## Next steps

> [!div class="nextstepaction"]
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
