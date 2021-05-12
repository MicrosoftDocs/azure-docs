---
title: Create and run custom availability tests using Azure Functions
description: This doc will cover how to create an Azure Function with TrackAvailability() that will run periodically according to the configuration given in TimerTrigger function. The results of this test will be sent to your Application Insights resource, where you will be able to query for and alert on the availability results data. Customized tests will allow you to write more complex availability tests than is possible using the portal UI, monitor an app inside of your Azure VNET, change the endpoint address, or create an availability test if it's not available in your region.
ms.topic: conceptual
ms.date: 05/06/2021

---

# Create and run custom availability tests using Azure Functions

This article will cover how to create an Azure Function with TrackAvailability() that will run periodically according to the configuration given in TimerTrigger function with your own business logic. The results of this test will be sent to your Application Insights resource, where you will be able to query for and alert on the availability results data. This allows you to create customized tests similar to what you can do via [Availability Monitoring](./monitor-web-app-availability.md) in the portal. Customized tests will allow you to write more complex availability tests than is possible using the portal UI, monitor an app inside of your Azure VNET, change the endpoint address, or create an availability test even if this feature is not available in your region.

> [!NOTE]
> This example is designed solely to show you the mechanics of how the TrackAvailability() API call works within an Azure Function. Not how to write the underlying HTTP Test code/business logic that would be required to turn this into a fully functional availability test. By default if you walk through this example you will be creating a basic availability HTTP GET test.

## Create a timer trigger function

1. Create a Azure Functions resource.
    - If you already have an Application Insights Resource:
        - By default Azure Functions creates an Application Insights resource but if you would like to use one of your already created resources you will need to specify that during creation.
        - Follow the instructions on how to [create an Azure Functions resource](../../azure-functions/functions-create-scheduled-function.md#create-a-function-app) with the following modification:
            - On the **Monitoring** tab, select the Application Insights dropdown box then type or select the name of your resource.
                :::image type="content" source="media/availability-azure-functions/app-insights-resource.png" alt-text="On the monitoring tab select your existing Application Insights resource.":::
    - If you do not have an Application Insights Resource created yet for your timer triggered function:
        - By default when you are creating your Azure Functions application it will create an Application Insights resource for you. Follow the instructions on how to [create an Azure Functions resource](../../azure-functions/functions-create-scheduled-function.md#create-a-function-app).
    > [!NOTE]
    > You can host your functions on a Consumption, Premium, or App Service plan. If you are testing behind a V-Net or testing non public endpoints then you will need to use the premium plan in place of the consumption. Select your plan on the **Hosting** tab.
2. Create a timer trigger function.
    1. In your function app, select the **Functions** tab.
    1. Select **Add** and in the Add function tab select the follow configurations:
        1. Development environment: *Develop in portal*
        1. Select a template: *Timer trigger*
    1. Select **Add** to create the Timer trigger function.

    :::image type="content" source="media/availability-azure-functions/add-function.png" alt-text="Screenshot of how to add a timer trigger function to your function app." lightbox="media/availability-azure-functions/add-function.png":::

## Add and edit code in the App Service Editor

Navigate to your deployed function app and under *Development Tools* select the **App Service Editor** tab.

To create a new file, right click under your timer trigger function (for example "TimerTrigger1") and select **New File**. Then type the name of the file and press enter.

1. Create a new file called "function.proj" and paste the following code:

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

     :::image type="content" source="media/availability-azure-functions/function-proj.png" alt-text=" Screenshot of function.proj in App Service Editor." lightbox="media/availability-azure-functions/function-proj.png":::

2. Create a new file called "runAvailabilityTest.csx" and paste the following code:

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

3. Copy the code below into the run.csx file (this will replace the pre-existing code):

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

## Check availability

To make sure everything is working, you can look at the graph in the Availability tab of your Application Insights resource.

> [!NOTE]
> Tests created with TrackAvailability() will appear with **CUSTOM** next to the test name.

 :::image type="content" source="media/availability-azure-functions/availability-custom.png" alt-text="Availability tab with successful results." lightbox="media/availability-azure-functions/availability-custom.png":::

To see the end-to-end transaction details, select **Successful** or **Failed** under drill into, then select a sample. You can also get to the end-to-end transaction details by selecting a data point on the graph.

:::image type="content" source="media/availability-azure-functions/sample.png" alt-text="Select a sample availability test.":::

:::image type="content" source="media/availability-azure-functions/end-to-end.png" alt-text="End-to-end transaction details." lightbox="media/availability-azure-functions/end-to-end.png":::

## Query in Logs (Analytics)

You can use Logs(analytics) to view you availability results, dependencies, and more. To learn more about Logs, visit [Log query overview](../logs/log-query-overview.md).

:::image type="content" source="media/availability-azure-functions/availabilityresults.png" alt-text="Availability results." lightbox="media/availability-azure-functions/availabilityresults.png":::

:::image type="content" source="media/availability-azure-functions/dependencies.png" alt-text="Screenshot shows New Query tab with dependencies limited to 50." lightbox="media/availability-azure-functions/dependencies.png":::

## Next steps

- [Application Map](./app-map.md)
- [Transaction diagnostics](./transaction-diagnostics.md)
