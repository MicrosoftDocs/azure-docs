---
title:  Enable telemetry for feature flags in an ASP.NET Core application
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in ASP.NET Core for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: rossgrambo
ms.author: rossgrambo
ms.topic: how-to
ms.date: 11/04/2025
---

# Enable telemetry for feature flags in an ASP.NET Core application

In this tutorial, you use telemetry in your ASP.NET Core application to track feature flag evaluations and custom events. Telemetry allows you to make informed decisions about your feature management strategy. You utilize the feature flag with telemetry enabled created in the [overview for enabling telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature flag named *Greeting* in your Configuration store with telemetry enabled. This tutorial builds on top of the tutorial for [using variant feature flags in an ASP.NET Core application](./howto-variant-feature-flags-aspnet-core.md).

## Prerequisites

- The variant feature flag with telemetry enabled from [Enable telemetry for feature flags](./howto-telemetry.md).
- The application from [Use variant feature flags in an ASP.NET Core application](./howto-variant-feature-flags-aspnet-core.md).

## Add telemetry to your ASP.NET Core application

1. Add the latest version of the Application Insights package.

    ```dotnetcli
    dotnet add package Microsoft.ApplicationInsights.AspNetCore
    dotnet add package Microsoft.FeatureManagement.Telemetry.ApplicationInsights
    ```

1. Add Application Insights telemetry services to the container. Add the following code after the line that adds Azure App Configuration.

    ```csharp
    // Add Application Insights telemetry
    builder.Services.AddApplicationInsightsTelemetry(options =>
    {
        options.ConnectionString = builder.Configuration.GetConnectionString("ApplicationInsights");
    });
    ```

1. Update the feature management services to enable telemetry publishing. Modify the existing feature management configuration to include the `AddApplicationInsightsTelemetry()` call.

    ```csharp
    // Add Azure App Configuration and feature management services to the container.
    builder.Services.AddAzureAppConfiguration()
        .AddFeatureManagement()
        .WithTargeting()
        .AddApplicationInsightsTelemetry();
    ```

1. Add the targeting middleware to associate outgoing events with the targeting ID. Add the following code after the line `app.UseAzureAppConfiguration();`.

    ```csharp
    // Use targeting middleware to associate events with the targeting ID
    app.UseMiddleware<TargetingHttpContextMiddleware>();
    ```

## Track custom events

Now you'll add a custom event to track when users like a quote. You'll create a backend endpoint to handle the like action and track it using Application Insights.

1. In *Index.cshtml.cs*, add a using statement for Application Insights.

    ```csharp
    using Microsoft.ApplicationInsights;
    ```

1. Adjust the `IndexModel` to get a `TelemetryClient`.

    ```csharp
    public class IndexModel(
            TelemetryClient telemetry,
            ILogger<IndexModel> logger,
            IVariantFeatureManagerSnapshot featureManager
        ) : PageModel
    {
        private readonly TelemetryClient _telemetry = telemetry;
    ```

1. Additionally, add a OnPostLike() function, tracking an event called "Liked" when the endpoint is used.

    ```csharp
    public IActionResult OnPostLike()
    {
        _telemetry.TrackEvent("Liked");
        return new JsonResult(new { success = true });
    }
    ```

1. In *Index.cshtml*, add an antiforgerytoken before the script tag.

    ```html
    <form method="post" style="display:none;">
        @Html.AntiForgeryToken()
    </form>
    
    <script>
        ...
    ```

1. Adjust the heartClicked function with the following content.
    
    ```javascript
    async function heartClicked(button) {
        const response = await fetch(`?handler=Like`, { method: "POST" });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                var icon = button.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        }
    }
    ```

    The `OnPostLike` method handles the like action. It uses the `TelemetryClient` to track a custom "Liked" event when a user clicks the heart button.

## Build and run the app

1. Application Insights requires a connection string to connect to your Application Insights resource. Set the `ConnectionStrings:ApplicationInsights` as a user secret.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:ApplicationInsights "<your-Application-Insights-Connection-String>"
    ```

1. After setting the environment variable, restart your terminal and rebuild and run the application.

    ```dotnetcli
    dotnet build
    dotnet run
    ```

## Collect telemetry

Deploy your application to begin collecting telemetry from your users. To test its functionality, you can simulate user activity by creating many test users. Each user will experience one of the greeting message variants, and they can interact with the application by clicking the heart button to like a quote. As your user base grows, you can monitor the increasing volume of telemetry data collected in Azure App Configuration. Additionally, you can drill down into the data to analyze how each variant of the feature flag influences user behavior.
- [Review telemetry results in App Configuration](./howto-telemetry.md#review-telemetry-results-in-azure-app-configuration).

## Additional resources

- [Quote of the Day sample](https://github.com/Azure-Samples/quote-of-the-day-dotnet)
- For the full feature rundown of the .NET feature management library, refer to the [.NET Feature Management reference documentation](./feature-management-dotnet-reference.md).
