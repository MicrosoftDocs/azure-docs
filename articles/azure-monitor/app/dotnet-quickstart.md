---
title: 'Quickstart: Monitor an ASP.NET Core app with Azure Monitor Application Insights'
description: Quickly instrument an ASP.NET Core web app for monitoring with Azure Monitor Application Insights

ms.topic: quickstart
author: lgayhardt
ms.author: lagayhar
ms.date: 06/11/2021

ms.custom: devx-track-dotnet
---

# Quickstart: Monitor an ASP.NET Core app with Azure Monitor Application Insights

In this quickstart, you'll instrument an ASP.NET Core app using the Application Insights SDK to gather client-side and server-side telemetry.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- .NET 5 SDK. [Install the latest .NET 5.0 SDK](https://dotnet.microsoft.com/download/dotnet/5.0) for Windows, macOS, or Linux.

## Create an Application Insights resource

To begin ingesting telemetry, create an Application Insights resource in your Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource** > **Developer tools** > **Application Insights**.

1. Complete the form that appears.
    1. Verify the selected **Subscription**.
    1. Select or create a new **Resource Group**.
    1. Specify a **Name** for this Application Insights resource.
    1. Select a **Region** near your location.
    1. Set the **Resource Mode** to *Classic*. 

1. Select the **Review + Create** button.
1. Select the **Create** button.
1. After deployment completes, select the **Go to resource** button.
1. From the **Overview** that appears, copy your **Instrumentation Key** (found under **Essentials**).

## Create and configure an ASP.NET Core web app

Complete the following steps to create and configure a new ASP.NET Core web app:

1. Create a new ASP.NET Core Razor Pages app.
    
    ```dotnetcli
    dotnet new razor -o ai.quickstart
    ```
    
    The previous command creates a new ASP.NET Core Razor Pages app in a directory named *ai.quickstart*. 
    
    > [!TIP]
    > You may prefer to [use Visual Studio to create your app](/visualstudio/ide/quickstart-aspnet-core).

1. Using a text editor or IDE, modify *appsettings.json* to contain a value for `ApplicationInsights.InstrumentationKey`, as shown. Use the instrumentation key you copied earlier.

    :::code language="json" source="snippets/dotnet-quickstart/appsettings.json" range="1-12" highlight="2-4":::

## Configure server-side telemetry

In the `ConfigureServices` method of *Startup.cs*, add the Application Insights service to the pipeline. Add a `services.AddApplicationInsightsTelemetry()` as shown:

```csharp
public void ConfigureServices(IServiceCollection services)
{
   services.AddRazorPages();
   services.AddApplicationInsightsTelemetry();
}
```

## Configure client-side telemetry

Complete the following steps to instrument the app to send server-side telemetry:

1. In *Pages/_ViewImports.cshtml*, add the following line:

    ```razor
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
    ```

    The previous change registers a `Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet` dependency containing the Application Insights client-side script element.

1. In *Pages/Shared/_Layout.cshtml*, in the `<head>` element, add the highlighted line:

    :::code language="razor" source="snippets/dotnet-quickstart/_layout.cshtml" range="3-10" highlight="7":::

   This change uses the injected `JavaScriptSnippet` object to ensure the script is rendered in the head of every page in the app.

## Validate telemetry ingestion

It takes several minutes for telemetry to be ingested into Application Insights for analysis. To verify that your app is sending telemetry in real-time, use **Live metrics** as shown in the following steps:

1. Run web app using `dotnet run` or your IDE.
1. In the Azure portal, when viewing your Application Insights resource, select **Live metrics** under **Investigate**.
1. Select the *Home* and *Privacy* links repeatedly.
1. Observe activity on the **Live metrics** screens as requests are made in the app.

## Next steps

- [Learn more about Application Insights in ASP.NET Core](asp-net-core.md)
- [Find runtime exceptions](tutorial-runtime-exceptions.md)
- [Find performance issues](tutorial-performance.md)
- [Alert on app health](tutorial-alert.md)
