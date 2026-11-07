---
title:  Enable telemetry for feature flags in an ASP.NET Core application
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in ASP.NET Core for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: yuanqu72
ms.author: yuanqu
ms.topic: how-to
ms.date: 11/02/2026
zone_pivot_groups: app-configuration-telemetry-aspnet-core
---

# Enable telemetry for feature flags in an ASP.NET Core application

In this tutorial, you use telemetry in your ASP.NET Core application to track feature flag evaluations and custom events. Telemetry helps you make informed decisions about your feature management strategy. You use the feature flag with telemetry enabled that you created in the [overview for enabling telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature flag named *Greeting* in your Configuration store with telemetry enabled. You must complete [Use variant feature flags in an ASP.NET Core application](./howto-variant-feature-flags-aspnet-core.md) before starting this tutorial, which extends the application created there.

> [!TIP]
> OpenTelemetry is the recommended integration for feature flag telemetry in Azure App Configuration, especially if you're setting up telemetry for the first time. The Application Insights SDK integration remains available for applications that already use it.

## Prerequisites

- The variant feature flag with telemetry enabled from [Enable telemetry for feature flags](./howto-telemetry.md).
- The application from [Use variant feature flags in an ASP.NET Core application](./howto-variant-feature-flags-aspnet-core.md).
- An Application Insights resource. If you don't have one, [create an Application Insights resource](/azure/azure-monitor/app/create-workspace-resource).

::: zone pivot="app-configuration-telemetry-opentelemetry"

## Add telemetry to your ASP.NET Core application

1. Add the following NuGet packages to your project. OpenTelemetry integration requires version **4.8.0 or later** of `Microsoft.FeatureManagement.Telemetry.OpenTelemetry` and `Microsoft.FeatureManagement.AspNetCore`.

    ```dotnetcli
    dotnet add package Azure.Monitor.OpenTelemetry.AspNetCore
    dotnet add package Microsoft.FeatureManagement.Telemetry.OpenTelemetry
    ```

1. In *Program.cs*, add the following using statement.

    ```csharp
    using Azure.Monitor.OpenTelemetry.AspNetCore;
    ```

1. Keep the Azure App Configuration and feature management service registration, including `WithTargeting()`.

    ```csharp
    builder.Services.AddAzureAppConfiguration()
        .AddFeatureManagement()
        .WithTargeting();
    ```

1. After registering feature management services and before `builder.Build()`, add OpenTelemetry and the feature management processors. Then configure Azure Monitor to export telemetry.

    ```csharp
    var openTelemetry = builder.Services.AddOpenTelemetry();

    openTelemetry.AddFeatureManagementProcessors();

    openTelemetry.UseAzureMonitor(options =>
    {
        options.ConnectionString =
            builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];
        options.TracesPerSecond = null;
        options.SamplingRatio = 1.0F;
        options.EnableTraceBasedLogsSampler = false;
    });
    ```

    > [!WARNING]
    > Call `AddFeatureManagementProcessors()` before `UseAzureMonitor()` so the processors can publish feature evaluation events and enrich logs and traces with the targeting ID before export. The sampling settings retain all traces and prevent trace-based sampling from dropping experiment events.

1. Add the targeting middleware after authentication and before authorization. Ensure the middleware appears in the following order, without duplicating existing calls.

    ```csharp
    app.UseAzureAppConfiguration();
    app.UseAuthentication();
    app.UseMiddleware<TargetingHttpContextMiddleware>();
    app.UseAuthorization();
    ```

    > [!WARNING]
    > Authentication must run before the targeting middleware so the signed-in user's identity is available when associating feature evaluations and custom events with a targeting ID.

### Track custom events

Use the existing `ILogger` in *Index.cshtml.cs* to record when a signed-in user likes a quote. Azure Monitor maps a log with the `microsoft.custom_event.name` attribute to an Application Insights custom event.

1. In *Index.cshtml.cs*, add the following handler to the `IndexModel` class.

    ```csharp
    public IActionResult OnPostHeartQuoteAsync()
    {
        string? userId = User.Identity?.Name;

        if (!string.IsNullOrEmpty(userId))
        {
            _logger.LogInformation("{microsoft.custom_event.name}", "Liked");

            return new JsonResult(new { success = true });
        }
        else
        {
            return new JsonResult(new
            {
                success = false,
                error = "User not authenticated"
            });
        }
    }
    ```

1. In *Index.cshtml*, add an antiforgery token before the script tag.

    ```cshtml
    <form action="/" method="post">
        @Html.AntiForgeryToken()
    </form>
    ```

1. Replace the `heartClicked` function with the following code.

    ```javascript
    function heartClicked(button) {
        var icon = button.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');

        if (icon.classList.contains('fas')) {
            fetch('/Index?handler=HeartQuote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
                }
            });
        }
    }
    ```

    > [!NOTE]
    > The request invokes `OnPostHeartQuoteAsync` and includes the antiforgery token required by Razor Pages. A `Liked` event is recorded when a signed-in user selects the heart, but not when they deselect it.

### Build and run the app

1. Copy your Application Insights resource's connection string from its **Overview** page in the Azure portal. From your application's project directory, set the connection string as a user secret.

    ```dotnetcli
    dotnet user-secrets set "APPLICATIONINSIGHTS_CONNECTION_STRING" "<ApplicationInsightsConnectionString>"
    ```

1. After setting the user secret, rebuild and run the application.

    ```powershell
    dotnet build
    dotnet run
    ```

::: zone-end

::: zone pivot="app-configuration-telemetry-appinsights"

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

1. In *Index.cshtml*, add an antiforgery token before the script tag.

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
    dotnet user-secrets set ConnectionStrings:ApplicationInsights "<ApplicationInsightsConnectionString>"
    ```

1. After setting the environment variable, restart your terminal and rebuild and run the application.

    ```dotnetcli
    dotnet build
    dotnet run
    ```

::: zone-end

## Collect telemetry

Deploy your application to begin collecting telemetry from your users. To test its functionality, you can simulate user activity by creating many test users. Each user will experience one of the greeting message variants, and they can interact with the application by clicking the heart button to like a quote. As your user base grows, you can monitor the increasing volume of telemetry data collected in Azure App Configuration. Additionally, you can drill down into the data to analyze how each variant of the feature flag influences user behavior.
- [View feature flag events](./howto-telemetry-review-results.md).

## Additional resources

- [Quote of the Day sample](https://github.com/Azure-Samples/quote-of-the-day-dotnet)
- For the full feature rundown of the .NET feature management library, refer to the [.NET Feature Management reference documentation](./feature-management-dotnet-reference.md).
