---
title: Roll out features to targeted audiences in an ASP.NET Core app
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences in an ASP.NET Core app.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/26/2024
---

# Tutorial: Roll out features to targeted audiences in an ASP.NET Core app

In this tutorial, you'll use the targeting filter to roll out a feature to targeted audience for your ASP.NET Core app. For more information about the targeting filter, please read this [article](./howto-targetingfilter.md).

## Prerequisites

- Finish the [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md).
- Update the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) package to version **3.0.0** or later.

## Create a web application with authentication and feature flags

In this section, you will create a web application that allows users to sign in and use the **Beta** feature flag you created before. Most of the steps are very similar to what you have done in [Quickstart](./quickstart-feature-flag-aspnet-core.md).

1. Create a web application that authenticates against a local database using the following command.

   ```dotnetcli
   dotnet new mvc --auth Individual -o TestFeatureFlags
   ```

1. Add references to the following NuGet packages.

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    ```

1. Store the connection string for your App Configuration store.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set ConnectionStrings:AppConfig "<your_connection_string>"
    ```

1. Update *Program.cs* with the following code.

    ``` C#
    // Existing code in Program.cs
    // ... ...

    var builder = WebApplication.CreateBuilder(args);

    // Retrieve the App Config connection string
    string AppConfigConnectionString = builder.Configuration.GetConnectionString("AppConfig");

    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(AppConfigConnectionString);
        options.UseFeatureFlags();
    });

    // Add Azure App Configuration middleware to the container of services
    builder.Services.AddAzureAppConfiguration();

    // Add feature management to the container of services
    builder.Services.AddFeatureManagement();

    // The rest of existing code in Program.cs
    // ... ...
    ```

    ``` C#
    // Existing code in Program.cs
    // ... ...
    
    var app = builder.Build();

    // Use Azure App Configuration middleware for dynamic configuration refresh
    app.UseAzureAppConfiguration();

    // The rest of existing code in Program.cs
    // ... ...
    ```

1. Add *Beta.cshtml* under the *Views\Home* directory and update it with the following markup.

    ``` cshtml
    @{
        ViewData["Title"] = "Beta Page";
    }

    <h1>This is the beta website.</h1>
    ```

1. Open *HomeController.cs* under the *Controllers* directory and update it with the following code.

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

1. Add *ExampleTargetingContextAccessor.cs* file.

    ```csharp
    using Microsoft.AspNetCore.Http;
    using Microsoft.FeatureManagement.FeatureFilters;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    namespace TestFeatureFlags
    {
        public class ExampleTargetingContextAccessor : ITargetingContextAccessor
        {
            private const string TargetingContextLookup = "ExampleTargetingContextAccessor.TargetingContext";
            private readonly IHttpContextAccessor _httpContextAccessor;

            public ExampleTargetingContextAccessor(IHttpContextAccessor httpContextAccessor)
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

1. Open `Program.cs` and add the `ExampleTargetingContextAccessor` created in the earlier step and `TargetingFilter` to the service collection by calling the `WithTargeting` method after the existing line of `AddFeatureManagement`. The `TargetingFilter` will use the `ExampleTargetingContextAccessor` to determine the targeting context every time that the feature flag is evaluated.

    ```csharp
    // Existing code in Program.cs
    // ... ...

    // Add feature management to the container of services
    builder.Services.AddFeatureManagement()
                    .WithTargeting<ExampleTargetingContextAccessor>();

    // The rest of existing code in Program.cs
    // ... ...
    ```
    
    > [!NOTE]
    > For Blazor applications, see [instructions](./faq.yml#how-to-enable-feature-management-in-blazor-applications-or-as-scoped-services-in--net-applications) for enabling feature management as scoped services.

## TargetingFilter in action

Follow the instructions in [Roll out features to targeted audiences](./howto-targetingfilter.md) to add a targeting filter with a set of targeting rules for the **Beta** feature flag you created in the [Quickstart](./quickstart-feature-flag-aspnet-core.md).

To see the effects of added targeting filter to the feature flag, build and run the application again. Initially, the *Beta* item doesn't appear on the toolbar, because the _Default percentage_ option is set to 0.

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

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter-aspnet-core.md)
