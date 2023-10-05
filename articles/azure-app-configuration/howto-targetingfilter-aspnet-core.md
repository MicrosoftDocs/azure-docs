---
title: Enable staged rollout of features for targeted audiences
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences
ms.service: azure-app-configuration
ms.devlang: csharp
author: maud-lv
ms.author: malev
ms.topic: conceptual
ms.date: 11/20/2020
---

# Enable staged rollout of features for targeted audiences

Feature flags allow you to dynamically activate or deactivate functionality in your application. Feature filters determine the state of a feature flag each time it's evaluated. The `Microsoft.FeatureManagement` library includes `TargetingFilter`, which enables a feature flag for a specified list of users and groups, or for a specified percentage of users. `TargetingFilter` is "sticky." This means that once an individual user receives a feature, they'll continue to see that feature on all future requests. You can use `TargetingFilter` to enable a feature for a specific account during a demo, to progressively roll out new features to users in different groups or "rings," and much more.

In this article, you'll learn how to roll out a new feature in an ASP.NET Core web application to specified users and groups, using `TargetingFilter` with Azure App Configuration.

## Create a web application with feature flags and authentication

To roll out features based on users and groups, you'll need a web application that allows users to sign in.

1. Create a web application that authenticates against a local database using the following command:

   ```dotnetcli
   dotnet new mvc --auth Individual -o TestFeatureFlags
   ```

1. Build and run, then select the **Register** link in the upper right corner to create a new user account. Use an email address of `test@contoso.com`. On the **Register Confirmation** screen, select **Click here to confirm your account**.

1. Follow the instructions in [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) to add a feature flag to your new web application.

1. Toggle the feature flag in App Configuration. Validate that this action controls the visibility of the **Beta** item on the navigation bar.

## Update the web application code to use TargetingFilter

At this point, you can use the feature flag to enable or disable the `Beta` feature for all users. To enable the feature flag for some users while disabling it for others, update your code to use `TargetingFilter`. In this example, you'll use the signed-in user's email address as the user ID, and the domain name portion of the email address as the group. You'll add the user and group to the `TargetingContext`. The `TargetingFilter` uses this context to determine the state of the feature flag for each request.

1. Update to the latest version of the `Microsoft.FeatureManagement.AspNetCore` package.

   ```dotnetcli
   dotnet add package Microsoft.FeatureManagement.AspNetCore
   ```

1. Add a *TestTargetingContextAccessor.cs* file:

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

1. In *Startup.cs*, add a reference to the *Microsoft.FeatureManagement.FeatureFilters* namespace:

    ```csharp
    using Microsoft.FeatureManagement.FeatureFilters;
    ```

1. Update the *ConfigureServices* method to register `TargetingFilter`, following the call to `AddFeatureManagement()`:

    ```csharp
    services.AddFeatureManagement()
            .AddFeatureFilter<TargetingFilter>();
    ```

1. Update the *ConfigureServices* method to add the `TestTargetingContextAccessor` created in the earlier step to the service collection. The *TargetingFilter* uses it to determine the targeting context every time that the feature flag is evaluated.

    ```csharp
      services.AddSingleton<ITargetingContextAccessor, TestTargetingContextAccessor>();
    ```

The entire *ConfigureServices* method will look like this:

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlite(
            Configuration.GetConnectionString("DefaultConnection")));
    services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<ApplicationDbContext>();
    services.AddControllersWithViews();
    services.AddRazorPages();

    // Add feature management, targeting filter, and ITargetingContextAccessor to service collection
    services.AddFeatureManagement().AddFeatureFilter<TargetingFilter>();
    services.AddSingleton<ITargetingContextAccessor, TestTargetingContextAccessor>();
    }
```

## Update the feature flag to use TargetingFilter

1. In the Azure portal, go to your App Configuration store and select **Feature manager**.

1. Select the context menu for the *Beta* feature flag that you created in the quickstart. Select **Edit**.

    > [!div class="mx-imgBorder"]
    > ![Edit Beta feature flag](./media/edit-beta-feature-flag.png)

1. In the **Edit** screen, select the **Enable feature flag** checkbox if it isn't already selected. Then select the **Use feature filter** checkbox.

1. Select the **Create** button.

1. Select the **Targeting filter** in the filter type dropdown.

1. Select the **Override by Groups** and **Override by Users** checkbox.

1. Select the following options:

    - **Default percentage**: 0
    - **Include Groups**: Enter a **Name** of _contoso.com_ and a **Percentage** of _50_
    - **Exclude Groups**: `contoso-xyz.com`
    - **Include Users**: `test@contoso.com`
    - **Exclude Users**: `testuser@contoso.com`

    The feature filter screen will look like this:

    > [!div class="mx-imgBorder"]
    > ![Conditional feature flag](./media/feature-flag-filter-enabled.png)

    These settings result in the following behavior:

    - The feature flag is always disabled for user `testuser@contoso.com`, because `testuser@contoso.com` is listed in the _Exclude Users_ section.
    - The feature flag is always disabled for users in the `contoso-xyz.com`, because `contoso-xyz.com` is listed in the _Exclude Groups_ section.
    - The feature flag is always enabled for user `test@contoso.com`, because `test@contoso.com` is listed in the _Include Users_ section.
    - The feature flag is enabled for 50% of users in the _contoso.com_ group, because _contoso.com_ is listed in the _Include Groups_ section with a _Percentage_ of _50_.
    - The feature is always disabled for all other users, because the _Default percentage_ is set to _0_.

1. Select **Add** to save the targeting filter.

1. Select **Apply** to save these settings and return to the **Feature manager** screen.

1. The **Feature filter** for the feature flag now appears as *Targeting*. This state indicates that the feature flag will be enabled or disabled on a per-request basis, based on the criteria enforced by the *Targeting* feature filter.

## TargetingFilter in action

To see the effects of this feature flag, build and run the application. Initially, the *Beta* item doesn't appear on the toolbar, because the _Default percentage_ option is set to 0.

Now sign in as `test@contoso.com`, using the password you set when registering. The *Beta* item now appears on the toolbar, because `test@contoso.com` is specified as a targeted user.

Now sign in as `testuser@contoso.com`, using the password you set when registering. The *Beta* item doesn't appear on the toolbar, because `testuser@contoso.com` is specified as an excluded user.

The following video shows this behavior in action.

> [!div class="mx-imgBorder"]
> ![TargetingFilter in action](./media/feature-flags-targetingfilter.gif)

You can create additional users with `@contoso.com` and `@contoso-xyz.com` email addresses to see the behavior of the group settings.

Users with `contoso-xyz.com` email addresses will not see the *Beta* item. While 50% of users with `@contoso.com` email addresses will see the *Beta* item, the other 50% won't see the *Beta* item.

## Next steps

> [!div class="nextstepaction"]
> [Feature management overview](./concept-feature-management.md)