---
title: Review TrackAvailability() test results
description: This article explains how to review data logged by TrackAvailability() tests
ms.topic: conceptual
ms.date: 11/02/2023
---

# Review TrackAvailability() test results

This article explains how to review [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) test results in the Azure portal and query the data using [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor). [Standard tests](availability-standard-tests.md) **should always be used if possible** as they require little investment, no maintenance, and have few prerequisites.

## Prerequisites

> [!div class="checklist"]
> - [Workspace-based Application Insights resource](create-workspace-resource.md)
> - Access to the source code of a [function app](../../azure-functions/functions-how-to-use-azure-function-app-settings.md) in Azure Functions
> - Developer expertise capable of authoring [custom code](#basic-code-sample) for [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability), tailored to your specific business needs

> [!IMPORTANT]
> [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) requires making a developer investment in writing and maintanining potentially complex custom code.

## Check availability

Start by reviewing the graph on the **Availability** tab of your Application Insights resource.

> [!NOTE]
> Tests created with `TrackAvailability()` will appear with **CUSTOM** next to the test name.

 :::image type="content" source="media/availability-azure-functions/availability-custom.png" alt-text="Screenshot that shows the Availability tab with successful results." lightbox="media/availability-azure-functions/availability-custom.png":::

To see the end-to-end transaction details, under **Drill into**, select **Successful** or **Failed**. Then select a sample. You can also get to the end-to-end transaction details by selecting a data point on the graph.

:::image type="content" source="media/availability-azure-functions/sample.png" alt-text="Screenshot that shows selecting a sample availability test.":::

:::image type="content" source="media/availability-azure-functions/end-to-end.png" alt-text="Screenshot that shows end-to-end transaction details." lightbox="media/availability-azure-functions/end-to-end.png":::

## Query in Log Analytics

You can use Log Analytics to view your availability results, dependencies, and more. To learn more about Log Analytics, see [Log query overview](../logs/log-query-overview.md).

:::image type="content" source="media/availability-azure-functions/availabilityresults.png" alt-text="Screenshot that shows availability results." lightbox="media/availability-azure-functions/availabilityresults.png":::

:::image type="content" source="media/availability-azure-functions/dependencies.png" alt-text="Screenshot that shows the New Query tab with dependencies limited to 50." lightbox="media/availability-azure-functions/dependencies.png":::

## Basic code sample

> [!NOTE]
> This example is designed solely to show you the mechanics of how the `TrackAvailability()` API call works within an Azure function. It doesn't show you how to write the underlying HTTP test code or business logic that's required to turn this example into a fully functional availability test. By default, if you walk through this example, you'll be creating a basic availability HTTP GET test.
>
> To follow these instructions, you must use the [dedicated plan](../../azure-functions/dedicated-plan.md) to allow editing code in App Service Editor.
### Create a timer trigger function

1. Create an Azure Functions resource.
    - If you already have an Application Insights resource:

        - By default, Azure Functions creates an Application Insights resource. But if you want to use a resource you created previously, you must specify that during creation.
        - Follow the instructions on how to [create an Azure Functions resource](../../azure-functions/functions-create-scheduled-function.md#create-a-function-app) with the following modification:

          On the **Monitoring** tab, select the **Application Insights** dropdown box and then enter or select the name of your resource.

          :::image type="content" source="media/availability-azure-functions/app-insights-resource.png" alt-text="Screenshot that shows selecting your existing Application Insights resource on the Monitoring tab.":::

    - If you don't have an Application Insights resource created yet for your timer-triggered function:
        - By default, when you're creating your Azure Functions application, it creates an Application Insights resource for you. Follow the instructions on how to [create an Azure Functions resource](../../azure-functions/functions-create-scheduled-function.md#create-a-function-app).

    > [!NOTE]
    > You can host your functions on a Consumption, Premium, or App Service plan. If you're testing behind a virtual network or testing nonpublic endpoints, you'll need to use the Premium plan in place of the Consumption plan. Select your plan on the **Hosting** tab. Ensure the latest .NET version is selected when you create the function app.
1. Create a timer trigger function.
    1. In your function app, select the **Functions** tab.
    1. Select **Add**. On the **Add function** pane, select the following configurations:
        1. **Development environment**: **Develop in portal**
        1. **Select a template**: **Timer trigger**
    1. Select **Add** to create the timer trigger function.

    :::image type="content" source="media/availability-azure-functions/add-function.png" alt-text="Screenshot that shows how to add a timer trigger function to your function app." lightbox="media/availability-azure-functions/add-function.png":::

### Add and edit code in the App Service Editor

Go to your deployed function app, and under **Development Tools**, select the **App Service Editor** tab.

To create a new file, right-click under your timer trigger function (for example, **TimerTrigger1**) and select **New File**. Then enter the name of the file and select **Enter**.

1. Create a new file called **function.proj** and paste the following code:

    ```xml
    <Project Sdk="Microsoft.NET.Sdk"> 
        <PropertyGroup> 
            <TargetFramework>netstandard2.0</TargetFramework> 
        </PropertyGroup> 
        <ItemGroup> 
            <PackageReference Include="Microsoft.ApplicationInsights" Version="2.15.0" /> <!-- Ensure you’re using the latest version --> 
        </ItemGroup> 
    </Project> 
    ```

    :::image type="content" source="media/availability-azure-functions/function-proj.png" alt-text=" Screenshot that shows function.proj in the App Service Editor." lightbox="media/availability-azure-functions/function-proj.png":::

1. Create a new file called **runAvailabilityTest.csx** and paste the following code:

    ```csharp
    using System.Net.Http; 

    public async static Task RunAvailabilityTestAsync(ILogger log) 
    { 
        using (var httpClient = new HttpClient()) 
        { 
            // TODO: Replace with your business logic 
            await httpClient.GetStringAsync("https://www.bing.com/"); 
        } 
    } 
    ```

1. Define the `REGION_NAME` environment variable as a valid Azure availability location.

    Run the following command in the [Azure CLI](https://learn.microsoft.com/cli/azure/account?view=azure-cli-latest#az-account-list-locations&preserve-view=true) to list available regions.

    ```azurecli
    az account list-locations -o table
    ```

1. Copy the following code into the **run.csx** file. (You replace the pre-existing code.)

    ```csharp
    #load "runAvailabilityTest.csx" 

    using System; 

    using System.Diagnostics; 

    using Microsoft.ApplicationInsights; 

    using Microsoft.ApplicationInsights.Channel; 

    using Microsoft.ApplicationInsights.DataContracts; 

    using Microsoft.ApplicationInsights.Extensibility; 

    private static TelemetryClient telemetryClient; 

    // ============================================================= 

    // ****************** DO NOT MODIFY THIS FILE ****************** 

    // Business logic must be implemented in RunAvailabilityTestAsync function in runAvailabilityTest.csx 

    // If this file does not exist, please add it first 

    // ============================================================= 

    public async static Task Run(TimerInfo myTimer, ILogger log, ExecutionContext executionContext) 

    { 
        if (telemetryClient == null) 
        { 
            // Initializing a telemetry configuration for Application Insights based on connection string 

            var telemetryConfiguration = new TelemetryConfiguration(); 
            telemetryConfiguration.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING"); 
            telemetryConfiguration.TelemetryChannel = new InMemoryChannel(); 
            telemetryClient = new TelemetryClient(telemetryConfiguration); 
        } 

        string testName = executionContext.FunctionName; 
        string location = Environment.GetEnvironmentVariable("REGION_NAME"); 
        var availability = new AvailabilityTelemetry 
        { 
            Name = testName, 

            RunLocation = location, 

            Success = false, 
        }; 

        availability.Context.Operation.ParentId = Activity.Current.SpanId.ToString(); 
        availability.Context.Operation.Id = Activity.Current.RootId; 
        var stopwatch = new Stopwatch(); 
        stopwatch.Start(); 

        try 
        { 
            using (var activity = new Activity("AvailabilityContext")) 
            { 
                activity.Start(); 
                availability.Id = Activity.Current.SpanId.ToString(); 
                // Run business logic 
                await RunAvailabilityTestAsync(log); 
            } 
            availability.Success = true; 
        } 

        catch (Exception ex) 
        { 
            availability.Message = ex.Message; 
            throw; 
        } 

        finally 
        { 
            stopwatch.Stop(); 
            availability.Duration = stopwatch.Elapsed; 
            availability.Timestamp = DateTimeOffset.UtcNow; 
            telemetryClient.TrackAvailability(availability); 
            telemetryClient.Flush(); 
        } 
    } 

    ```

## Next steps

* [Standard tests](availability-standard-tests.md)
* [Availability alerts](availability-alerts.md)
* [Application Map](./app-map.md)
* [Transaction diagnostics](./search-and-transaction-diagnostics.md?tabs=transaction-diagnostics)
