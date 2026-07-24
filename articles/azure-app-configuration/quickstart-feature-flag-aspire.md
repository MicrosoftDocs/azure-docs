---
title: Quickstart for adding feature flags to Aspire apps
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your Aspire application using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 12/5/2025
zone_pivot_groups: appconfig-aspire
ms.author: zhiyuanliang
#Customer intent: As an Aspire developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to an Aspire app

In this quickstart, you'll create a feature flag in Azure App Configuration and use it to dynamically control the availability of a new web page in an Aspire app without restarting or redeploying it.

The feature management support extends the dynamic configuration feature in App Configuration. The example in this quickstart builds on the Aspire app introduced in the dynamic configuration tutorial. Before you continue, finish the [quickstart](./quickstart-aspire.md), and the [tutorial](./enable-dynamic-configuration-aspire.md) to create an Aspire app with dynamic configuration first.

## Prerequisites

Follow the documents to create an Aspire solution with dynamic configuration.

- [Quickstart: Create an Aspire solution with App Configuration](./quickstart-aspire.md)
- [Tutorial: Use dynamic configuration in an Aspire app](./enable-dynamic-configuration-aspire.md)

## Create a feature flag

:::zone target="docs" pivot="azure"

Add a feature flag called *Beta* to the App Configuration store (created in the [Prerequisites](./quickstart-feature-flag-aspire.md#prerequisites) steps), and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

:::image type="content" source="media/add-beta-feature-flag.png" alt-text="Screenshot of adding a feature flag called Beta." lightbox="media/add-beta-feature-flag.png":::

:::zone-end

:::zone target="docs" pivot="emulator"

Add the following key-value through the App Configuration emulator UI.

| Key                           | Content Type                                                | Value                           |
|-------------------------------|-------------------------------------------------------------| --------------------------------|
| *.appconfig.featureflag/Beta* | *application/vnd.microsoft.appconfig.ff+json;charset=utf-8* | *{"id":"Beta","enabled":false}* |

:::image type="content" source="media/aspire/emulator-feature-flag.png" alt-text="Screenshot of adding a feature flag to emulator." lightbox="media/aspire/emulator-feature-flag.png":::

 Feature flags are special key-values that define Microsoft feature flags. Configuration providers identify feature flag by their specific content type and key prefix. The value of a feature flag is a json object that follows [`Microsoft Feature Flag schema`](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureFlag.v2.0.0.schema.json).

 - Feature flag content type: `application/vnd.microsoft.appconfig.ff+json;charset=utf-8`
 - Feature flag key prefix: `.appconfig.featureflag/`

:::zone-end

## Use a feature flag

1. Navigate into the `Web` project's directory (created in the [Prerequisites](./enable-dynamic-configuration-aspire.md#prerequisites) steps). Run the following command to add the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore) Nuget package.

    ```dotnetcli
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    ```

1. Open *Program.cs*, and add a call to the `UseFeatureFlags` method inside the `AddAzureAppConfiguration` call. You can connect to App Configuration using either Microsoft Entra ID (recommended) or a connection string. The following code snippet demonstrates using Microsoft Entra ID.

    ```csharp
    builder.AddAzureAppConfiguration(
        "appconfiguration",
        configureOptions: options =>
        {
            // Load all keys that start with `TestApp:` and have no label.
            options.Select("TestApp:*", LabelFilter.Null);
            // Reload configuration if any key-values have changed.
            options.ConfigureRefresh(refreshOptions =>
                refreshOptions.RegisterAll());
            // Load all feature flags with no label
            options.UseFeatureFlags();
        });
    ```

    > [!TIP]
    > When no parameter is passed to the `UseFeatureFlags` method, it loads *all* feature flags with *no label* in your App Configuration store. The default refresh interval of feature flags is 30 seconds. You can customize this behavior via the `FeatureFlagOptions` parameter. For example, the following code snippet loads only feature flags that start with *TestApp:* in their *key name* and have the label *dev*. The code also changes the refresh interval time to 5 minutes. Note that this refresh interval time is separate from that for regular key-values.
    >
    > ```csharp
    > options.UseFeatureFlags(featureFlagOptions =>
    > {
    >     featureFlagOptions.Select("TestApp:*", "dev");
    >     featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(5);
    > });
    > ```

1. Add feature management to the service collection of your app by calling `AddFeatureManagement`.

    Update *Program.cs* with the following code. 

    ```csharp
    // Existing code in Program.cs
    // ... ...

    // Add Azure App Configuration middleware to the container of services.
    builder.Services.AddAzureAppConfiguration();

    // Add feature management to the container of services.
    builder.Services.AddFeatureManagement();

    var app = builder.Build();

    // The rest of existing code in program.cs
    // ... ...
    ```

    Add `using Microsoft.FeatureManagement;` at the top of the file if it's not present.

1. Add a new Razor page named **Beta.razor** under the *Components/Pages* directory.

    ```cs
    @page "/beta"

    @inject IFeatureManager FeatureManager

    @if (isBetaEnabled)
    {
        <h1>This is the beta website.</h1>
    } 
    else
    {
        <h1>Not found.</h1>
    }

    @code {
        private bool isBetaEnabled;

        protected override async Task OnInitializedAsync()
        {
            isBetaEnabled = await FeatureManager.IsEnabledAsync("Beta");
        }
    }
    ```

1. Open *_Imports.razor*, and import the feature management namespace.

    ```cs
    @using Microsoft.FeatureManagement
    ```

1. Open *NavMenu.razor* in the *Components/Layout* directory. 

    Inject `IVariantFeatureManager` at the top of the file.

    ```cs
    @inject IVariantFeatureManager FeatureManager

    <div class="top-row ps-3 navbar navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="">AspireApp</a>
        </div>
    </div>
    ```

    Add the following code.

    ```cs
    // Existing code
    // ... ...
    <div class="nav-scrollable" onclick="document.querySelector('.navbar-toggler').click()">
        <nav class="nav flex-column">
            // Existing code
            // ... ...

            @if (isBetaEnabled)
            {
                <div class="nav-item px-3">
                    <NavLink class="nav-link" href="beta">
                        <span class="bi bi-list-nested" aria-hidden="true"></span> Beta
                    </NavLink>
                </div>
            }
        </nav>
    </div>

    @code {
        private bool isBetaEnabled;

        protected override async Task OnInitializedAsync()
        {
            isBetaEnabled = await FeatureManager.IsEnabledAsync("Beta");
        }
    }
    ```

:::zone target="docs" pivot="azure"

## Run the app locally

1. Run the `AppHost` project. Go to the Aspire dashboard and open the web app.

    :::image type="content" source="media/aspire/feature-flag-disabled.png" alt-text="Screenshot of a web app with three buttons on the side bar." lightbox="media/aspire/feature-flag-disabled.png":::

1. In the Azure portal, navigate to the **Feature manager** of your App Configuration store and locate the *Beta* feature flag. Enable the flag by selecting the checkbox under **Enabled**.

1. Refresh the page a few times. When the refresh interval time window passes, the page will show with updated content.

    :::image type="content" source="media/aspire/feature-flag-disabled.png" alt-text="Screenshot of a web app with Beta button on the side bar." lightbox="media/aspire/feature-flag-disabled.png":::

1. Click the **Beta** button. It will bring you to the beta page that you enabled dynamically.

    :::image type="content" source="media/aspire/beta-page.png" alt-text="Screenshot of the Beta page." lightbox="media/aspire/beta-page.png":::

:::zone-end

:::zone target="docs" pivot="emulator"

## Run the app locally

1. Run the `AppHost` project. Go to the Aspire dashboard and open the web app.

    :::image type="content" source="media/aspire/feature-flag-disabled.png" alt-text="Screenshot of a web app with three buttons on the side bar." lightbox="media/aspire/feature-flag-disabled.png":::

1. Go to the emulator, edit the value of the feature flag to enable it.

    | Key                          | Value                          |
    |------------------------------|--------------------------------|
    | *appconfig.featureflag/Beta* | *{"id":"Beta","enabled":true}* |

1. Refresh the page a few times. When the refresh interval time window passes, the page will show with updated content.

    :::image type="content" source="media/aspire/feature-flag-enabled.png" alt-text="Screenshot of a web app with Beta button on the side bar." lightbox="media/aspire/feature-flag-enabled.png":::

1. Click the **Beta** button. It will bring you to the beta page that you enabled dynamically.

    :::image type="content" source="media/aspire/beta-page.png" alt-text="Screenshot of the Beta page." lightbox="media/aspire/beta-page.png":::

:::zone-end

## Next steps

In this quickstart, you added feature management capability to an Aspire app on top of dynamic configuration. The [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore) library offers integration with ASP.NET Core apps, including feature management in MVC controller actions, razor pages, views, routes, and middleware. For the full feature rundown of the .NET feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)

While a feature flag allows you to activate or deactivate functionality in your app, you may want to customize a feature flag based on your app's logic. Feature filters allow you to enable a feature flag conditionally. For more information, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

Azure App Configuration offers built-in feature filters that enable you to activate a feature flag only during a specific period or to a particular targeted audience of your app. For more information, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)

To enable feature management capability for other types of apps, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Use feature flags in ASP.NET Core apps](./quickstart-feature-flag-aspnet-core.md)

To learn more about managing feature flags in Azure App Configuration, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Manage feature flags in Azure App Configuration](./manage-feature-flags.md)
