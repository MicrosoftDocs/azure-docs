---
title: Application Insights SDK for ASP.NET Core applications | Microsoft Docs
description: Application Insights SDK tutorial to monitor ASP.NET Core web applications for availability, performance, and usage.
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 10/11/2023
ms.reviewer: mmcc
---

# Enable Application Insights for ASP.NET Core applications

This article describes how to enable Application Insights for an [ASP.NET Core](/aspnet/core) application deployed as an Azure Web App. This implementation uses an SDK-based approach. An [autoinstrumentation approach](./codeless-overview.md) is also available.

Application Insights can collect the following telemetry from your ASP.NET Core application:

> [!div class="checklist"]
> * Requests
> * Dependencies
> * Exceptions
> * Performance counters
> * Heartbeats
> * Logs

For a sample application, we'll use an [ASP.NET Core MVC application](https://github.com/AaronMaxwell/AzureCafe) that targets `net6.0`. However, you can apply these instructions to all ASP.NET Core applications. If you're using the [Worker Service](/aspnet/core/fundamentals/host/hosted-services#worker-service-template), use the instructions from [here](./worker-service.md).

> [!NOTE]
> An [OpenTelemetry-based .NET offering](./opentelemetry-enable.md?tabs=net) is available. [Learn more](./opentelemetry-overview.md).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Supported scenarios

The [Application Insights SDK for ASP.NET Core](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore) can monitor your applications no matter where or how they run. If your application is running and has network connectivity to Azure, Application Insights can collect telemetry from it. Application Insights monitoring is supported everywhere .NET Core is supported. The following scenarios are supported:
* **Operating system**: Windows, Linux, or Mac
* **Hosting method**: In process or out of process
* **Deployment method**: Framework dependent or self-contained
* **Web server**: Internet Information Server (IIS) or Kestrel
* **Hosting platform**: The Web Apps feature of Azure App Service, Azure VM, Docker, Azure Kubernetes Service (AKS), and so on
* **.NET Core version**: All officially [supported .NET Core versions](https://dotnet.microsoft.com/download/dotnet-core) that aren't in preview
* **IDE**: Visual Studio, Visual Studio Code, or command line

## Prerequisites

To complete this tutorial, you need:

* Visual Studio 2022
* The following Visual Studio workloads: 
  * ASP.NET and web development
  * Data storage and processing
  * Azure development
* .NET 6.0
* Azure subscription and user account (with the ability to create and delete resources)

## Deploy Azure resources

Please follow the [guidance to deploy the sample application from its GitHub repository.](https://github.com/gitopsbook/sample-app-deployment).

In order to provide globally unique names to resources, a six-character suffix is assigned to some resources. Please make note of this suffix for use later on in this article.

:::image type="content" source="media/tutorial-asp-net-core/naming-suffix.png" alt-text="Screenshot of the deployed Azure resource listing in the Azure portal with the six-character suffix highlighted." lightbox="media/tutorial-asp-net-core/naming-suffix.png":::

## Create an Application Insights resource

1. In the [Azure portal](https://portal.azure.com), select the **application-insights-azure-cafe** resource group.

2. From the top toolbar menu, select **+ Create**.

    :::image type="content" source="media/tutorial-asp-net-core/create-resource-menu.png" alt-text="Screenshot of the application-insights-azure-cafe resource group in the Azure portal with the + Create button highlighted on the toolbar menu." lightbox="media/tutorial-asp-net-core/create-resource-menu.png":::

3. On the **Create a resource** screen, search for and select **Application Insights** in the marketplace search textbox.

   :::image type="complex" source="media/tutorial-asp-net-core/search-application-insights.png" alt-text="Screenshot of the Create a resource screen in the Azure portal." lightbox="media/tutorial-asp-net-core/search-application-insights.png":::
      Screenshot of the Create a resource screen in the Azure portal. The screenshot shows a search for Application Insights highlighted and Application Insights displaying in the search results, which is also highlighted.
   :::image-end:::

4. On the Application Insights resource overview screen, select **Create**.

   :::image type="content" source="media/tutorial-asp-net-core/create-application-insights-overview.png" alt-text="Screenshot of the Application Insights overview screen in the Azure portal with the Create button highlighted." lightbox="media/tutorial-asp-net-core/create-application-insights-overview.png":::

5. On the Application Insights screen, **Basics** tab, complete the form by using the following table, then select the **Review + create** button. Fields not specified in the table below may retain their default values.

    | Field | Value |
    |-------|-------|
    | Name  | Enter `azure-cafe-application-insights-{SUFFIX}`, replacing **{SUFFIX}** with the appropriate suffix value recorded earlier. |
    | Region | Select the same region chosen when deploying the article resources. |
    | Log Analytics Workspace | Select **azure-cafe-log-analytics-workspace**. Alternatively, you can create a new log analytics workspace. |

   :::image type="content" source="media/tutorial-asp-net-core/application-insights-basics-tab.png" alt-text="Screenshot of the Basics tab of the Application Insights screen in the Azure portal with a form populated with the preceding values." lightbox="media/tutorial-asp-net-core/application-insights-basics-tab.png":::

6. Once validation has passed, select **Create** to deploy the resource.

    :::image type="content" source="media/tutorial-asp-net-core/application-insights-validation-passed.png" alt-text="Screenshot of the Application Insights screen in the Azure portal. The message stating validation has passed and Create button are both highlighted." lightbox="media/tutorial-asp-net-core/application-insights-validation-passed.png":::

7. Once the resource is deployed, return to the `application-insights-azure-cafe` resource group, and select the Application Insights resource you deployed.

    :::image type="content" source="media/tutorial-asp-net-core/application-insights-resource-group.png" alt-text="Screenshot of the application-insights-azure-cafe resource group in the Azure portal with the Application Insights resource highlighted." lightbox="media/tutorial-asp-net-core/application-insights-resource-group.png":::

8. On the Overview screen of the Application Insights resource, select the **Copy to clipboard** button to copy the connection string value. You will use the connection string value in the next section of this article.

   :::image type="complex" source="media/tutorial-asp-net-core/application-insights-connection-string-overview.png" alt-text="Screenshot of the Application Insights Overview screen in the Azure portal." lightbox="media/tutorial-asp-net-core/application-insights-connection-string-overview.png":::
      Screenshot of the Application Insights Overview screen in the Azure portal. The screenshot shows the connection string value highlighted and the Copy to clipboard button selected and highlighted.
   :::image-end:::

## Configure the Application Insights connection string application setting in the web App Service

1. Return to the `application-insights-azure-cafe` resource group and open the **azure-cafe-web-{SUFFIX}** App Service resource.

    :::image type="content" source="media/tutorial-asp-net-core/web-app-service-resource-group.png" alt-text="Screenshot of the application-insights-azure-cafe resource group in the Azure portal with the azure-cafe-web-{SUFFIX} resource highlighted." lightbox="media/tutorial-asp-net-core/web-app-service-resource-group.png":::

2. From the left menu, under the Settings section, select **Configuration**. Then, on the **Application settings** tab, select **+ New application setting** beneath the Application settings header.

   :::image type="complex" source="media/tutorial-asp-net-core/app-service-app-setting-button.png" alt-text="Screenshot of the App Service resource screen in the Azure portal." lightbox="media/tutorial-asp-net-core/app-service-app-setting-button.png":::
      Screenshot of the App Service resource screen in the Azure portal. The screenshot shows Configuration in the left menu under the Settings section selected and highlighted, the Application settings tab selected and highlighted, and the + New application setting toolbar button highlighted.
   :::image-end:::

3. In the Add/Edit application setting pane, complete the form as follows and select **OK**.

    | Field | Value |
    |-------|-------|
    | Name  | APPLICATIONINSIGHTS_CONNECTION_STRING |
    | Value | Paste the Application Insights connection string value you copied in the preceding section. |

    :::image type="content" source="media/tutorial-asp-net-core/add-edit-app-setting.png" alt-text="Screenshot of the Add/Edit application setting pane in the Azure portal with the preceding values populated in the Name and Value fields." lightbox="media/tutorial-asp-net-core/add-edit-app-setting.png":::

4. On the App Service Configuration screen, select the **Save** button from the toolbar menu. When prompted to save the changes, select **Continue**.

    :::image type="content" source="media/tutorial-asp-net-core/save-app-service-configuration.png" alt-text="Screenshot of the App Service Configuration screen in the Azure portal with the Save button highlighted on the toolbar menu." lightbox="media/tutorial-asp-net-core/save-app-service-configuration.png":::

## Install the Application Insights NuGet Package

We need to configure the ASP.NET Core MVC web application to send telemetry. This is accomplished using the [Application Insights for ASP.NET Core web applications NuGet package](https://nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore).

1. In Visual Studio, open `1 - Starter Application\src\AzureCafe.sln`.

2. In the Visual Studio Solution Explorer panel, right-click on the AzureCafe project file and select **Manage NuGet Packages**.

    :::image type="content" source="media/tutorial-asp-net-core/manage-nuget-packages-menu.png" alt-text="Screenshot of the Visual Studio Solution Explorer with the Azure Cafe project selected and the Manage NuGet Packages context menu item highlighted." lightbox="media/tutorial-asp-net-core/manage-nuget-packages-menu.png":::

3. Select the **Browse** tab and then search for and select **Microsoft.ApplicationInsights.AspNetCore**. Select **Install**, and accept the license terms. It is recommended you use the latest stable version. For the full release notes for the SDK, see the [open-source GitHub repo](https://github.com/Microsoft/ApplicationInsights-dotnet/releases).

   :::image type="complex" source="media/tutorial-asp-net-core/asp-net-core-install-nuget-package.png" alt-text="Screenshot of the NuGet Package Manager user interface in Visual Studio." lightbox="media/tutorial-asp-net-core/asp-net-core-install-nuget-package.png":::
      Screenshot that shows the NuGet Package Manager user interface in Visual Studio with the Browse tab selected. Microsoft.ApplicationInsights.AspNetCore is entered in the search box, and the Microsoft.ApplicationInsights.AspNetCore package is selected from a list of results. In the right pane, the latest stable version of the Microsoft.ApplicationInsights.AspNetCore package is selected from a drop down list and the Install button is highlighted.
   :::image-end:::

   Keep Visual Studio open for the next section of the article.

## Enable Application Insights server-side telemetry

The Application Insights for ASP.NET Core web applications NuGet package encapsulates features to enable sending server-side telemetry to the Application Insights resource in Azure.

1. From the Visual Studio Solution Explorer, open the **Program.cs** file.

    :::image type="content" source="media/tutorial-asp-net-core/solution-explorer-programcs.png" alt-text="Screenshot of the Visual Studio Solution Explorer with the Program.cs file highlighted." lightbox="media/tutorial-asp-net-core/solution-explorer-programcs.png":::

2. Insert the following code prior to the `builder.Services.AddControllersWithViews()` statement. This code automatically reads the Application Insights connection string value from configuration. The `AddApplicationInsightsTelemetry` method registers the `ApplicationInsightsLoggerProvider` with the built-in dependency injection container that will then be used to fulfill [ILogger](/dotnet/api/microsoft.extensions.logging.ilogger) and [ILogger\<TCategoryName\>](/dotnet/api/microsoft.extensions.logging.iloggerprovider) implementation requests.

    ```csharp
    builder.Services.AddApplicationInsightsTelemetry();
    ```

    :::image type="content" source="media/tutorial-asp-net-core/enable-server-side-telemetry.png" alt-text="Screenshot of a code window in Visual Studio with the preceding code snippet highlighted." lightbox="media/tutorial-asp-net-core/enable-server-side-telemetry.png":::

    > [!TIP]
    > Learn more about the [configuration options in ASP.NET Core](/aspnet/core/fundamentals/configuration).

## Enable client-side telemetry for web applications

The preceding steps are enough to help you start collecting server-side telemetry. The sample application has client-side components. Follow the next steps to start collecting [usage telemetry](./usage-overview.md).

1. In Visual Studio Solution Explorer, open `\Views\_ViewImports.cshtml`. 

2. Add the following code at the end of the existing file.

    ```cshtml
    @inject Microsoft.ApplicationInsights.AspNetCore.JavaScriptSnippet JavaScriptSnippet
    ```

    :::image type="content" source="media/tutorial-asp-net-core/view-imports-injection.png" alt-text="Screenshot of the _ViewImports.cshtml file in Visual Studio with the preceding line of code highlighted." lightbox="media/tutorial-asp-net-core/view-imports-injection.png":::

3. To properly enable client-side monitoring for your application, in Visual Studio Solution Explorer, open  `\Views\Shared\_Layout.cshtml` and insert the following code immediately before the closing `<\head>` tag. This JavaScript snippet must be inserted in the `<head>` section of each page of your application that you want to monitor.

    ```cshtml
    @Html.Raw(JavaScriptSnippet.FullScript)
    ```

    :::image type="content" source="media/tutorial-asp-net-core/layout-head-code.png" alt-text="Screenshot of the _Layout.cshtml file in Visual Studio with the preceding line of code highlighted within the head section of the file." lightbox="media/tutorial-asp-net-core/layout-head-code.png":::

    > [!TIP]
    > An alternative to using `FullScript` is `ScriptBody`. Use `ScriptBody` if you need to control the `<script>` tag to set a Content Security Policy:

    ```cshtml
    <script> // apply custom changes to this script tag.
        @Html.Raw(JavaScriptSnippet.ScriptBody)
    </script>
    ```

> [!NOTE]
> JavaScript injection provides a default configuration experience. If you require [configuration](./javascript.md#configuration) beyond setting the connection string, you are required to remove auto-injection as described above and manually add the [JavaScript SDK](./javascript.md#add-the-javascript-sdk).

## Enable monitoring of database queries

When investigating causes for performance degradation, it is important to include insights into database calls. You enable monitoring by configuring the [dependency module](./asp-net-dependencies.md). Dependency monitoring, including SQL, is enabled by default. 

Follow these steps to capture the full SQL query text.

> [!NOTE]
> SQL text may contain sensitive data such as passwords and PII. Be careful when enabling this feature.

1. From the Visual Studio Solution Explorer, open the **Program.cs** file.

2. At the top of the file, add the following `using` statement.

    ```csharp
    using Microsoft.ApplicationInsights.DependencyCollector;
    ```

3. To enable SQL command text instrumentation, insert the following code immediately after the `builder.Services.AddApplicationInsightsTelemetry()` code.

    ```csharp
    builder.Services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) => { module.EnableSqlCommandTextInstrumentation = true; });
    ```

    :::image type="content" source="media/tutorial-asp-net-core/enable-sql-command-text-instrumentation.png" alt-text="Screenshot of a code window in Visual Studio with the preceding code highlighted." lightbox="media/tutorial-asp-net-core/enable-sql-command-text-instrumentation.png":::

## Run the Azure Cafe web application

After you deploy the web application code, telemetry will flow to Application Insights. The Application Insights SDK automatically collects incoming web requests to your application.

1. From the Visual Studio Solution Explorer, right-click on the **AzureCafe** project and select **Publish** from the context menu.

    :::image type="content" source="media/tutorial-asp-net-core/web-project-publish-context-menu.png" alt-text="Screenshot of the Visual Studio Solution Explorer with the Azure Cafe project selected and the Publish context menu item highlighted." lightbox="media/tutorial-asp-net-core/web-project-publish-context-menu.png":::

2. Select **Publish** to promote the new code to the Azure App Service.

    :::image type="content" source="media/tutorial-asp-net-core/publish-profile.png" alt-text="Screenshot of the AzureCafe publish profile with the Publish button highlighted." lightbox="media/tutorial-asp-net-core/publish-profile.png":::

   When the Azure Cafe web application is successfully published, a new browser window opens to the Azure Cafe web application.

    :::image type="content" source="media/tutorial-asp-net-core/azure-cafe-index.png" alt-text="Screenshot of the Azure Cafe web application." lightbox="media/tutorial-asp-net-core/azure-cafe-index.png":::

3. To generate some telemetry, follow these steps in the web application to add a review.

   1. To view a cafe's menu and reviews, select **Details** next to a cafe.

        :::image type="content" source="media/tutorial-asp-net-core/cafe-details-button.png" alt-text="Screenshot of a portion of the Azure Cafe list in the Azure Cafe web application with the Details button highlighted." lightbox="media/tutorial-asp-net-core/cafe-details-button.png":::

   2. To view and add reviews, on the Cafe screen, select the **Reviews** tab. Select the **Add review** button to add a review.

        :::image type="content" source="media/tutorial-asp-net-core/cafe-add-review-button.png" alt-text="Screenshot of the Cafe details screen in the Azure Cafe web application with the Add review button highlighted." lightbox="media/tutorial-asp-net-core/cafe-add-review-button.png":::

   3. On the Create a review dialog, enter a name, rating, comments, and upload a photo for the review. When finished, select **Add review**.

        :::image type="content" source="media/tutorial-asp-net-core/create-a-review-dialog.png" alt-text="Screenshot of the Create a review dialog in the Azure Cafe web application." lightbox="media/tutorial-asp-net-core/create-a-review-dialog.png":::

   4. If you need to generate additional telemetry, add additional reviews.

### Live metrics

You can use [Live Metrics](./live-stream.md) to quickly verify if Application Insights monitoring is configured correctly. Live Metrics shows CPU usage of the running process in near real time. It can also show other telemetry such as Requests, Dependencies, and Traces. Note that it might take a few minutes for the telemetry to appear in the portal and analytics.

### Viewing the application map

The sample application makes calls to multiple Azure resources, including Azure SQL, Azure Blob Storage, and the Azure Language Service (for review sentiment analysis).

:::image type="content" source="media/tutorial-asp-net-core/azure-cafe-app-insights.png" alt-text="Diagram that shows the architecture of the Azure Cafe sample web application." lightbox="media/tutorial-asp-net-core/azure-cafe-app-insights.png":::

Application Insights introspects the incoming telemetry data and is able to generate a visual map of the system integrations it detects.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Open the resource group for the sample application, which is `application-insights-azure-cafe`.

3. From the list of resources, select the `azure-cafe-insights-{SUFFIX}` Application Insights resource.

4. From the left menu, beneath the **Investigate** heading, select **Application map**. Observe the generated Application map.

    :::image type="content" source="media/tutorial-asp-net-core/application-map.png" alt-text="Screenshot of the Application Insights application map in the Azure portal." lightbox="media/tutorial-asp-net-core/application-map.png":::

### Viewing HTTP calls and database SQL command text

1. In the Azure portal, open the Application Insights resource.

2. On the left menu, beneath the **Investigate** header, select **Performance**.

3. The **Operations** tab contains details of the HTTP calls received by the application. To toggle between Server and Browser (client-side) views of the data, use the Server/Browser toggle.

   :::image type="complex" source="media/tutorial-asp-net-core/server-performance.png" alt-text="Screenshot of the Performance screen in the Azure portal." lightbox="media/tutorial-asp-net-core/server-performance.png":::
      Screenshot of the Application Insights Performance screen in the Azure portal. The screenshot shows the Server/Browser toggle and HTTP calls received by the application highlighted.
   :::image-end:::

4. Select an Operation from the table, and choose to drill into a sample of the request.
 
    :::image type="complex" source="media/tutorial-asp-net-core/select-operation-performance.png" alt-text="Screenshot of the Application Insights Performance screen in the Azure portal with operations and sample operations listed." lightbox="media/tutorial-asp-net-core/select-operation-performance.png":::
       Screenshot of the Application Insights Performance screen in the Azure portal. The screenshot shows a POST operation and a sample operation from the suggested list selected and highlighted and the Drill into samples button is highlighted.
    :::image-end:::

   The end-to-end transaction displays for the selected request. In this case, a review was created, including an image, so it includes calls to Azure Storage and the Language Service (for sentiment analysis). It also includes database calls into SQL Azure to persist the review. In this example, the first selected Event displays information relative to the HTTP POST call.

    :::image type="content" source="media/tutorial-asp-net-core/e2e-http-call.png" alt-text="Screenshot of the end-to-end transaction in the Azure portal with the HTTP Post call selected." lightbox="media/tutorial-asp-net-core/e2e-http-call.png":::

5. Select a SQL item to review the SQL command text issued to the database.

    :::image type="content" source="media/tutorial-asp-net-core/e2e-db-call.png" alt-text="Screenshot of the end-to-end transaction in the Azure portal with SQL command details." lightbox="media/tutorial-asp-net-core/e2e-db-call.png":::

6. Optionally, select the Dependency (outgoing) requests to Azure Storage or the Language Service.

7. Return to the **Performance** screen and select the **Dependencies** tab to investigate calls into external resources. Notice the Operations table includes calls into Sentiment Analysis, Blob Storage, and Azure SQL.

    :::image type="content" source="media/tutorial-asp-net-core/performance-dependencies.png" alt-text="Screenshot of the Application Insights Performance screen in the Azure portal with the Dependencies tab selected and the Operations table highlighted." lightbox="media/tutorial-asp-net-core/performance-dependencies.png":::

## Application logging with Application Insights

### Logging overview

Application Insights is one type of [logging provider](/dotnet/core/extensions/logging-providers) available to ASP.NET Core applications that becomes available to applications when the [Application Insights for ASP.NET Core](#install-the-application-insights-nuget-package) NuGet package is installed and [server-side telemetry collection is enabled](#enable-application-insights-server-side-telemetry). 

As a reminder, the following code in **Program.cs** registers the `ApplicationInsightsLoggerProvider` with the built-in dependency injection container.

```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

With the `ApplicationInsightsLoggerProvider` registered as the logging provider, the app is ready to log into Application Insights by using either constructor injection with <xref:Microsoft.Extensions.Logging.ILogger> or the generic-type alternative <xref:Microsoft.Extensions.Logging.ILogger%601>. 

> [!NOTE]
> By default, the logging provider is configured to automatically capture log events with a severity of <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType> or greater.

Consider the following example controller. It demonstrates the injection of ILogger, which is resolved with the `ApplicationInsightsLoggerProvider` that is registered with the dependency injection container. Observe in the **Get** method that an Informational, Warning, and Error message are recorded. 

> [!NOTE]
> By default, the Information level trace will not be recorded. Only the Warning and above levels are captured.

```csharp
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    private readonly ILogger _logger;

    public ValuesController(ILogger<ValuesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<string>> Get()
    {
        //Info level traces are not captured by default
        _logger.LogInformation("An example of an Info trace..");
        _logger.LogWarning("An example of a Warning trace..");
        _logger.LogError("An example of an Error level message");

        return new string[] { "value1", "value2" };
    }
}
```

For more information, see [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging).

## View logs in Application Insights

The ValuesController above is deployed with the sample application and is located in the **Controllers** folder of the project.

1. Using an internet browser, open the sample application. In the address bar, append `/api/Values` and press <kbd>Enter</kbd>.

    :::image type="content" source="media/tutorial-asp-net-core/values-api-url.png" alt-text="Screenshot of a browser window with /api/Values appended to the URL in the address bar." lightbox="media/tutorial-asp-net-core/values-api-url.png":::

2. In the [Azure portal](https://portal.azure.com), wait a few moments and then select the **azure-cafe-insights-{SUFFIX}** Application Insights resource.

    :::image type="content" source="media/tutorial-asp-net-core/application-insights-resource-group.png" alt-text="Screenshot of the application-insights-azure-cafe resource group in the Azure portal with the Application Insights resource highlighted." lightbox="media/tutorial-asp-net-core/application-insights-resource-group.png":::

3. From the left menu of the Application Insights resource, under the **Monitoring** section, select **Logs**. 
 
4. In the **Tables** pane, under the **Application Insights** tree, double-click on the **traces** table. 

5. Modify the query to retrieve traces for the **Values** controller as follows, then select **Run** to filter the results.

    ```kql
    traces 
    | where operation_Name == "GET Values/Get"
    ```

   The results display the logging messages present in the controller. A log severity of 2 indicates a warning level, and a log severity of 3 indicates an Error level.

6. Alternatively, you can also write the query to retrieve results based on the category of the log. By default, the category is the fully qualified name of the class where the ILogger is injected. In this case, the category name is **ValuesController** (if there is a namespace associated with the class, the name will be prefixed with the namespace). Re-write and run the following query to retrieve results based on category.

    ```kql
    traces 
    | where customDimensions.CategoryName == "ValuesController"
    ```

## Control the level of logs sent to Application Insights

`ILogger` implementations have a built-in mechanism to apply [log filtering](/dotnet/core/extensions/logging#how-filtering-rules-are-applied). This filtering lets you control the logs that are sent to each registered provider, including the Application Insights provider. You can use the filtering either in configuration (using an *appsettings.json* file) or in code. For more information about log levels and guidance on how to use them appropriately, see the [Log Level](/aspnet/core/fundamentals/logging#log-level) documentation.

The following examples show how to apply filter rules to the `ApplicationInsightsLoggerProvider` to control the level of logs sent to Application Insights.

### Create filter rules with configuration

The `ApplicationInsightsLoggerProvider` is aliased as **ApplicationInsights** in configuration. The following section of an *appsettings.json* file sets the default log level for all providers to <xref:Microsoft.Extensions.Logging.LogLevel.Warning?displayProperty=nameWithType>. The configuration for the ApplicationInsights provider, specifically for categories that start with "ValuesController," overrides this default value with <xref:Microsoft.Extensions.Logging.LogLevel.Error?displayProperty=nameWithType> and higher.

```json
{
  //... additional code removed for brevity
  "Logging": {
    "LogLevel": { // No provider, LogLevel applies to all the enabled providers.
      "Default": "Warning"
    },
    "ApplicationInsights": { // Specific to the provider, LogLevel applies to the Application Insights provider.
      "LogLevel": {
        "ValuesController": "Error" //Log Level for the "ValuesController" category
      }
    }
  }
}
```

Deploying the sample application with the preceding code in *appsettings.json* will yield only the error trace being sent to Application Insights when interacting with the **ValuesController**. This is because the **LogLevel** for the **ValuesController** category is set to **Error**. Therefore, the **Warning** trace is suppressed.

## Turn off logging to Application Insights

To disable logging by using configuration, set all LogLevel values to "None".

```json
{
  //... additional code removed for brevity
  "Logging": {
    "LogLevel": { // No provider, LogLevel applies to all the enabled providers.
      "Default": "None"
    },
    "ApplicationInsights": { // Specific to the provider, LogLevel applies to the Application Insights provider.
      "LogLevel": {
        "ValuesController": "None" //Log Level for the "ValuesController" category
      }
    }
  }
}
```

Similarly, within the code, set the default level for the `ApplicationInsightsLoggerProvider` and any subsequent log levels to **None**.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.None);
builder.Logging.AddFilter<Microsoft.Extensions.Logging.ApplicationInsights.ApplicationInsightsLoggerProvider>("ValuesController", LogLevel.None);
```

## Open-source SDK

* [Read and contribute to the code](https://github.com/microsoft/ApplicationInsights-dotnet).

For the latest updates and bug fixes, see the [release notes](./release-notes.md).

## Next steps

* [Explore user flows](./usage-flows.md) to understand how users navigate through your app.
* [Configure a snapshot collection](./snapshot-debugger.md) to see the state of source code and variables at the moment an exception is thrown.
* [Use the API](./api-custom-events-metrics.md) to send your own events and metrics for a detailed view of your app's performance and usage.
* [Availability overview](availability-overview.md)
* [Dependency Injection in ASP.NET Core](/aspnet/core/fundamentals/dependency-injection)
* [Logging in ASP.NET Core](/aspnet/core/fundamentals/logging)
* [.NET trace logs in Application Insights](./asp-net-trace-logs.md)
* [Autoinstrumentation for Application Insights](./codeless-overview.md)
