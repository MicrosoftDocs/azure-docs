---
title: Enable staged rollout of features for targeted audiences
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/05/2024
---

# Enable staged rollout of features for targeted audiences

Targeting is a feature management strategy that enables developers to progressively roll out new features to their user base. The strategy is built on the concept of targeting a set of users known as the target audience. An audience is made up of specific users, groups, and a designated percentage of the entire user base.

- The users can be actual user accounts, but they can also be machines, devices, or any uniquely identifiable entities to which you want to roll out a feature.

- The groups are up to your application to define. They can be Microsoft Entra groups, your workloads at different locations, or any common attributes based on which you want to categorize your audience.

In this article, you learn how to roll out a new feature in an ASP.NET Core web application to specified users and groups, using `TargetingFilter` with Azure App Configuration.

## Prerequisites

- Finish the [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md).
- Update the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) package to version **3.0.0** or later.

## Create a web application with authentication and feature flags

In this section, you will create a web application that allows users to sign in and use the **Beta** feature flag you created before. Most of steps is very similar to what you have done in [Quickstart](./quickstart-feature-flag-aspnet-core.md).

1. Create a web application that authenticates against a local database using the following command.

   ```dotnetcli
   dotnet new mvc --auth Individual -o TestFeatureFlags
   ```

1. Add references to the following NuGet packages.

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    ```

1. Store the connection string for you App Configuration store.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set ConnectionStrings:AppConfig "<your_connection_string>"
    ```

1. Update the *Program.cs* with the following code.

    ``` C#
    // Existing code in Program.cs
    // ... ...

    // Retrieve the connection string
    string connectionString = builder.Configuration.GetConnectionString("AppConfig");

    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString);
        options.UseFeatureFlags();
    });

    // The rest of existing code in program.cs
    // ... ...
    ```

    ``` C#
    // Existing code in Program.cs
    // ... ...

    // Add Azure App Configuration middleware to the container of services.
    builder.Services.AddAzureAppConfiguration();
    // Add feature management to the container of services.
    builder.Services.AddFeatureManagement()

    // The rest of existing code in program.cs
    // ... ...
    ```

    ``` C#
    // Existing code in Program.cs
    // ... ...

    // Use Azure App Configuration middleware for dynamic configuration refresh.
    app.UseAzureAppConfiguration();

    // The rest of existing code in program.cs
    // ... ...
    ```

1. Add *Beta.cshtml* under the *Views\Home* directory and update it with the following markup.

    ``` cshtml
    @{
        ViewData["Title"] = "Beta Page";
    }

    <h1>This is the beta website.</h1>
    ```

1. Open the *HomeController.cs* under the *Controllers* directory and update it with the following code.

    ``` C#
    public IActionResult Beta()
    {
        return View();
    }
    ```

1. Open *_ViewImports.cshtml*, and register the feature manager Tag Helper using an `@addTagHelper` directive:

    ``` cshtml
    @addTagHelper *, Microsoft.FeatureManagement.AspNetCore
    ```

1. Open *_Layout.cshtml* in the Views\Shared directory. Insert a new `<feature>` tag in between the *Home* and *Privacy* navbar items.

    ``` html
    <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
        <ul class="navbar-nav flex-grow-1">
            <li class="nav-item">
                <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Index">Home</a>
            </li>
            <feature name="Beta">
                <li class="nav-item">
                    <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Beta">Beta</a>
                </li>
            </feature>
            <li class="nav-item">
                <a class="nav-link text-dark" asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
            </li>
        </ul>
        <partial name="_LoginPartial" />
    </div>
    ```

1. Build and run. Then select the **Register** link in the upper right corner to create a new user account. Use an email address of `test@contoso.com`. On the **Register Confirmation** screen, select **Click here to confirm your account**.

1. Toggle the feature flag in App Configuration. Validate that this action controls the visibility of the **Beta** item on the navigation bar.

## Update the web application code to use `TargetingFilter`

At this point, you can use the feature flag to enable or disable the `Beta` feature for all users. To enable the feature flag for some users while disabling it for others, update your code to use `TargetingFilter`. In this example, you use the signed-in user's email address as the user ID, and the domain name portion of the email address as the group. You add the user and group to the `TargetingContext`. The `TargetingFilter` uses this context to determine the state of the feature flag for each request.

1. Update to the latest version of the `Microsoft.FeatureManagement.AspNetCore` package.

   ```dotnetcli
   dotnet add package Microsoft.FeatureManagement.AspNetCore
   ```

1. Add a *TestTargetingContextAccessor.cs* file.

    ```csharp
    using Microsoft.AspNetCore.Http;
    using Microsoft.FeatureManagement.FeatureFilters;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace TestFeatureFlags
    {
        public class TestTargetingContextAccessor : ITargetingContextAccessor
        {
            private const string TargetingContextLookup = "TestTargetingContextAccessor.TargetingContext";
            private readonly IHttpContextAccessor _httpContextAccessor;

            public TestTargetingContextAccessor(IHttpContextAccessor httpContextAccessor)
            {
                _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            }

            public ValueTask<TargetingContext> GetContextAsync()
            {
                HttpContext httpContext = _httpContextAccessor.HttpContext;
                if (httpContext.Items.TryGetValue(TargetingContextLookup, out object value))
                {
                    return new ValueTask<TargetingContext>((TargetingContext)value);
                }
                List<string> groups = new List<string>();
                if (httpContext.User.Identity.Name != null)
                {
                    groups.Add(httpContext.User.Identity.Name.Split("@", StringSplitOptions.None)[1]);
                }
                TargetingContext targetingContext = new TargetingContext
                {
                    UserId = httpContext.User.Identity.Name,
                    Groups = groups
                };
                httpContext.Items[TargetingContextLookup] = targetingContext;
                return new ValueTask<TargetingContext>(targetingContext);
            }
        }
    }
    ```

1. Add `TestTargetingContextAccessor` created in the earlier step and `TargetingFilter` to the service collection by calling the `WithTargeting` method. The `TargetingFilter` will use the `TestTargetingContextAccessor` to determine the targeting context every time that the feature flag is evaluated.

    ```csharp
    services.AddFeatureManagement()
            .WithTargeting<TestTargetingContextAccessor>();
    ```
    
    > [!NOTE]
    > For Blazor applications, see [instructions](./faq.yml#how-to-enable-feature-management-in-blazor-applications-or-as-scoped-services-in--net-applications) for enabling feature management as scoped services.

## Update the feature flag to use TargetingFilter

1. In the Azure portal, go to your App Configuration store and select **Feature manager**.

1. Select the context menu for the *Beta* feature flag that you created in the quickstart. Select **Edit**.

    > [!div class="mx-imgBorder"]
    > ![Edit Beta feature flag](./media/edit-beta-feature-flag.png)

1. In the **Edit** screen, select the **Enable feature flag** checkbox if it isn't already selected. Then select the **Use feature filter** checkbox.

1. Select the **Create** button.

1. Select the **Targeting filter** in the filter type dropdown.

1. Select the **Override by Groups** and **Override by Users** checkbox.

1. Select the following options.

    - **Default percentage**: 0
    - **Include Groups**: Enter a **Name** of _contoso.com_ and a **Percentage** of _50_
    - **Exclude Groups**: `contoso-xyz.com`
    - **Include Users**: `test@contoso.com`
    - **Exclude Users**: `testuser@contoso.com`

    The feature filter screen will look like this.

    > [!div class="mx-imgBorder"]
    > ![Conditional feature flag](./media/feature-flag-filter-enabled.png)

    These settings result in the following behavior.

    - The feature flag is always disabled for user `testuser@contoso.com`, because `testuser@contoso.com` is listed in the _Exclude Users_ section.
    - The feature flag is always disabled for users in the `contoso-xyz.com`, because `contoso-xyz.com` is listed in the _Exclude Groups_ section.
    - The feature flag is always enabled for user `test@contoso.com`, because `test@contoso.com` is listed in the _Include Users_ section.
    - The feature flag is enabled for 50% of users in the _contoso.com_ group, because _contoso.com_ is listed in the _Include Groups_ section with a _Percentage_ of _50_.
    - The feature is always disabled for all other users, because the _Default percentage_ is set to _0_.

1. Select **Add** to save the targeting filter.

1. Select **Apply** to save these settings and return to the **Feature manager** screen.

1. The **Feature filter** for the feature flag now appears as *Targeting*. This state indicates that the feature flag is enabled or disabled on a per-request basis, based on the criteria enforced by the *Targeting* feature filter.

## TargetingFilter in action

To see the effects of this feature flag, build and run the application. Initially, the *Beta* item doesn't appear on the toolbar, because the _Default percentage_ option is set to 0.

Now sign in as `test@contoso.com`, using the password you set when registering. The *Beta* item now appears on the toolbar, because `test@contoso.com` is specified as a targeted user.

Now sign in as `testuser@contoso.com`, using the password you set when registering. The *Beta* item doesn't appear on the toolbar, because `testuser@contoso.com` is specified as an excluded user.

The following video shows this behavior in action.

> [!div class="mx-imgBorder"]
> ![TargetingFilter in action](./media/feature-flags-targetingfilter.gif)

You can create more users with `@contoso.com` and `@contoso-xyz.com` email addresses to see the behavior of the group settings.

Users with `contoso-xyz.com` email addresses won't see the *Beta* item. While 50% of users with `@contoso.com` email addresses will see the *Beta* item, the other 50% won't see the *Beta* item.

## Next steps

> [!div class="nextstepaction"]
> [Feature management overview](./concept-feature-management.md)
