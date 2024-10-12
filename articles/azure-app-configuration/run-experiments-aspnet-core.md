---
title: 'Tutorial:  Run experiments with variant feature flags in Azure App Configuration'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to set up experiments in an App Configuration store using Split Experimentation Workspace.
#customerintent: As a user of Azure App Configuration, I want to learn how I can run experiments with variant feature flags, using Split Experimentation Workspace and Application Insights.
author: rossgrambo
ms.author: rossgrambo
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom:
  - build-2024
ms.topic: tutorial
ms.date: 10/10/2024
---

# Tutorial: Run experiments with variant feature flags (preview)

Running experiments on your application can help you make informed decisions to improve your app’s performance and user experience. In this guide, you learn how to set up and execute experimentations within an App Configuration store. You learn how to collect and measure data, using the capabilities of App Configuration, Application Insights (preview), and [Split Experimentation Workspace (preview)](../partner-solutions/split-experimentation/index.yml).

By doing so, you can make data-driven decisions to improve your application.

> [!NOTE]
> A quick way to start your experimentation journey is to run the [Quote of the Day AZD sample.](https://github.com/Azure-Samples/quote-of-the-day-dotnet/) This repository provides a comprehensive example, complete with Azure resource provisioning and a first experiment, on how to integrate Azure App Configuration with your .NET applications to run experiments.

In this tutorial, you:

> [!div class="checklist"]
> * Add an Application Insights resource to your store
> * Add a Split Experimentation Workspace to your store
> * Set up an app to run an experiment
> * Enable telemetry and create an experiment in your variant feature flag
> * Create metrics for your experiment
> * Get experimentation results

## Prerequisites

* Complete the [Variant Feature Flag Tutorial](./use-variant-feature-flags-aspnet-core.md).
* An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
* An [App Configuration store](./quickstart-azure-app-configuration-create.md).
* A [Split Experimentation Workspace resource](../partner-solutions/split-experimentation/create.md).
* A [workspace-based Application Insights](/azure/azure-monitor/app/create-workspace-resource#create-a-workspace-based-resource) resource.

## Ensure you have an app running from the variant tutorial

You should have a variant feature flag called *Greeting* with three variants, *None*, *Simple*, and *Long*, as described in the [Variant Feature Flag Tutorial](./use-variant-feature-flags-aspnet-core.md).

## Connect an Application Insights (preview) resource to your configuration store

To run an experiment, you first need to connect a workspace-based Application Insights resource to your App Configuration store. Connecting this resource to your App Configuration store sets the configuration store with the telemetry source for the experimentation.

1. In your App Configuration store, select **Telemetry > Application Insights (preview)**.

    :::image type="content" source="./media/run-experiments-aspnet-core/select-application-insights.png" alt-text="Screenshot of the Azure portal, adding an Application Insights to a store." lightbox="./media/run-experiments-aspnet-core/select-application-insights.png":::

1. Select the Application Insights resource you want to use as the telemetry provider for your variant feature flags and application, and select **Save**. If you don't have an Application Insights resource, create one by selecting **Create new**. For more information about how to proceed, go to [Create a worskpace-based resource](/azure/azure-monitor/app/create-workspace-resource#create-a-workspace-based-resource). Then, back in **Application Insights (preview)**, reload the list of available Application Insights resources and select your new Application Insights resource.
1. A notification indicates that the Application Insights resource was updated successfully for the App Configuration store.

## Connect a Split Experimentation Workspace (preview) to your store

To run experiments in Azure App Configuration, you're going to use Split Experimentation Workspace. Follow the steps below to connect a Split Experimentation Workspace to your store.

1. In your App Configuration store, select **Experimentation** > **Split Experimentation Workspace (preview)** from the left menu.

    :::image type="content" source="./media/run-experiments-aspnet-core/add-split-experimentation-workspace.png" alt-text="Screenshot of the Azure portal, adding a Split Experimentation Workspace to the App Configuration store." lightbox="./media/run-experiments-aspnet-core/add-split-experimentation-workspace.png":::

1. Select a **Split Experimentation Workspace**, then **Save**. If you don't have a Split Experimentation Workspace, follow the [Split Experimentation Workspace quickstart](../partner-solutions/split-experimentation/create.md) to create one.

    > [!NOTE]
    > The data source selected in the Split Experimentation Workspace must be the same Application Insights resource as selected in the previous step.

1. A notification indicates that the operation was successful.

## Set up an app to run an experiment

Now that you’ve connected the Application Insights (preview) resource to the App Configuration store, set up an app to run your experiment (preview).

In the [variants tutorial](./use-variant-feature-flags-aspnet-core.md), you created an ASP.NET web app named _Quote of the Day_ which used three variants, _None_, _Simple_, and _Long_. Now, we will enable the app to collect and save the telemetry of your user interactions in Application Insights. With Split Experimentation Workspace, you can analyze the effectiveness of your experiment.

### Navigate to the Quote of the Day app and add user secret

1. In the command prompt, navigate to the *QuoteOfTheDay* folder and run the following command to create a [user secret](/aspnet/core/security/app-secrets) for the application. This secret holds the connection string for App Insights

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppInsights "<Application Insights Connection string>"
    ```

### Update the application code

1. In *QuoteOfTheDay.csproj*, add the `Microsoft.FeatureManagement.Telemetry` package.

    ```csharp
    <PackageReference Include="Microsoft.FeatureManagement.Telemetry" Version="4.0.0" />
    ```

1. In *Program.cs*, add the following using statements:

    ```csharp
    using Microsoft.ApplicationInsights.AspNetCore.Extensions;
    using Microsoft.ApplicationInsights.Extensibility;
    ```

1. Under where `builder.Configuration.AddAzureAppConfiguration` is called, add:

    ```csharp
    // Add Application Insights telemetry.
    builder.Services.AddApplicationInsightsTelemetry(
        new ApplicationInsightsServiceOptions
        {
            ConnectionString = builder.Configuration.GetConnectionString("AppInsights"),
            EnableAdaptiveSampling = false
        });
    ```

    This snippet performs the following actions.

    * Adds an Application Insights telemetry client to the application.
    * Adds a telemetry initializer that appends targeting information to outgoing telemetry.
    * Disables adaptive sampling. For more information about disabling adaptive sampling, go to [Troubleshooting](../partner-solutions/split-experimentation/troubleshoot.md#sampling-in-application-insights).

1. Also in *Program.cs*, add the following using statement.

    ```csharp
    using Microsoft.FeatureManagement.Telemetry;
    ```

1. Under the line `.AddFeatureManagement()` or under `.WithTargeting()`, call the `IFeatureManagementBuilder.AddApplicationInsightsTelemetry()` method. This causes feature evaluation events to be sent to the connected Application Insights.

    ```csharp
    // Add Azure App Configuration and feature management services to the container.
    builder.Services.AddAzureAppConfiguration()
        .AddFeatureManagement()
        .WithTargeting()
        .AddApplicationInsightsTelemetry();
    ```

1. Under that, add the following code to enable the `TargetingTelemetryInitializer` to have access to targeting information by storing it on HttpContext.

    ```csharp
    // Add TargetingId to HttpContext for telemetry
    app.UseMiddleware<TargetingHttpContextMiddleware>();
    ```

1. Open *QuoteOfTheDay* > *Pages* > *Index.cshtml.cs* edit the class to take a `TelemetryClient`. Also edit the `OnPostHeartQuoteAsync` method to send a telemetry event.

    ```csharp
    ...
    
    public class IndexModel(IVariantFeatureManagerSnapshot featureManager, TelemetryClient telemetryClient) : PageModel
    {
        private readonly IVariantFeatureManagerSnapshot _featureManager = featureManager;
        private readonly TelemetryClient _telemetryClient = telemetryClient;
    
        ...
    
        public IActionResult OnPostHeartQuoteAsync()
        {
            string? userId = User.Identity?.Name;
    
            if (!string.IsNullOrEmpty(userId))
            {
                // Send telemetry to Application Insights
                _telemetryClient.TrackEvent("Like");
    
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new { success = false, error = "User not authenticated" });
            }
        }
    }
    ```

    Now, when the `PageModel` handles post requests, you're calling `_telemetryClient.TrackEvent("Like");`. This sends an event to Application Insights with the name *Like*. This event is automatically tied to the user and variant, and can be tracked by metrics.

### Build and run the app

1. In the command prompt, in the *QuoteOfTheDay* folder, run: `dotnet build`.
1. Run: `dotnet run --launch-profile https`.
1. Look for a message in the format `Now listening on: https://localhost:{port}` in the output of the application. Navigate to the included link in your browser.
1. Login as `usera@contoso.com` or `userb@contoso.com` and click the heart icon.
 
   :::image type="content" source="./media/run-experiments-aspnet-core/heart.png" alt-text="Screenshot of the Quote of the day app, highlighting the heart icon.":::

## Enable telemetry and create an experiment in your variant feature flag

Enable telemetry and create an experiment in your variant feature flag by following the steps below:

1. In your App Configuration store, go to **Operations** > **Feature manager**.
1. Select the **...** context menu all the way to the right of your variant feature flag "Greeting", and select **Edit**.

    :::image type="content" source="./media/run-experiments-aspnet-core/edit-variant-feature-flag.png" alt-text="Screenshot of the Azure portal, editing a variant feature flag." lightbox="./media/run-experiments-aspnet-core/edit-variant-feature-flag.png":::

1. Go to the **Telemetry** tab and check the box **Enable Telemetry**.
1. Go to the **Experiment** tab, check the box **Create Experiment**, and give a name to your experiment.
1. **Select Review + update**, then **Update**.
1. A notification indicates that the operation was successful. In **Feature manager**, the variant feature flag should have the word **Active** under **Experiment**.

## Create metrics for your experiment

A *metric* in Split Experimentation Workspace is a quantitative measure of an event sent to Application Insights. This metric helps evaluate the impact of a feature flag on user behavior and outcomes.

When updating your app earlier, you added `_telemetryClient.TrackEvent("Like")` to your application code. `Like` is a telemetry event that represents a user action, in this case the Heart button selection. This event is sent to the Application Insights resource, which you'll connect to the metric you're about to create.
The app we created only specifies one event, but you can have multiple events and subsequently multiple metrics. Multiple metrics could also be based on a single Application Insight event.

1. Navigate to your Split Experimentation Workspace resource. Under **Configuration** > **Experimentation Metrics**, select **Create**.

1. Select or enter the following information under **Create an Experimentation Metric** and save with **Create**.

    :::image type="content" source="./media/run-experiments-aspnet-core/create-metric.png" alt-text="Screenshot of the Azure portal, creating a new experimentation metric.":::

    | Setting                             | Example value       | Description                                                                                                                                                                                                                                                                                                                                                                                    |
    |-------------------------------------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Name**                            | *Heart Vote* | The name of the experimentation metric.                                                                                                                                                                                                                                                                                                                                                        |
    | **Description**                     | *Count number of people who select the heart button when they see a special message, vs. when they don't.*               | Optional description for the metric.                                                                                                                                                                                                                                                                                                                                                           |
    | **Application Insights Event Name** | *Like*              | The name of the Application Insights event. This name is case-sensitive and it's the name specified in your code with `_telemetryClient.TrackEvent("<Event-Name>")`.                                                                                                                                                                                                                                                        |
    | **Measure as**                      | **Count**           | The following options are available: <br><ul><li>**Count**: counts the number of times the event is triggered by your users.</li><li>**Average**: averages the value of the event for your users.</li><li>**Sum**: adds up the values of the event for your users. Shows the average summed value.</li><li>**Percent**: calculates the percentage of users that triggered the event.</li></ul> |
    | **Desired Impact**                  | **Increase**        | This setting represents the ultimate goal or purpose behind measuring your created metric. |

    In this tutorial, our hypothesis is that more users click on the heart-shaped like button when there is a special message next to the Quote of the Day. The application code tracks this click as an event named *Like*. The application sends the Like event as telemetry to Application Insights and the **Desired Impact** for this experiment is to see an **Increase** in the number of user clicks (measured as **Count**) on the *Heart Vote*, to be able to validate the given hypothesis. If there's a decrease in the number of clicks on the button despite the special message being shown to the allocated audience, then the hypothesis is invalidated for this experiment.

1. Once created, the new metric is displayed in the portal. You can edit it or delete it by selecting the (**...**) context menu on the right side of the screen.

    :::image type="content" source="./media/run-experiments-aspnet-core/created-metric.png" alt-text="Screenshot of the Azure portal showing an experimentation metric.":::

## Get experimentation results

To put your newly setup experiment to the test and generate results for you to analyze, simulate some traffic to your application and wait a 10 to 15 minutes.

To view the results of your experiment, navigate to **Feature Manager** and on the list of variant feature flags, click on **...** > **Experiment**, or select the **Active** link in the **Experiment** column. This column isn't displayed by default. To show it, in **Feature manager**, select **Manage view** > **Edit Columns** > **Add Column** > **Experiment** and  **Apply**.

On the results page, a **Version** of the Experiment, a **Baseline** to compare the results against, and a **Comparison** variant are selected by default. If needed, change the defaults per your liking, then select **Apply** to view the result of your experiment.

:::image type="content" source="./media/run-experiments-aspnet-core/experimentation-result.png" alt-text="Screenshot of the Azure portal showing an experimentation result." lightbox="./media/run-experiments-aspnet-core/experimentation-result.png":::

The screenshot above shows that the experiment had the desired result, with the **On** variant for the **Heart Vote** resulting in 560.62% more Heart votes than the **Off** variant.

Any edit to a variant feature flag generates a new version of the experimentation, which you can select to view its results.

> [!NOTE]
> To get experimentation results, you need at least 30 events per variant, but we suggest you have more that the minimum sampling size to make sure that your experimentation is producing reliable results.

> [!NOTE]
> Application Insights sampling is enabled by default and it may impact your experimentation results. For this tutorial, you are recommended to turn off sampling in Application Insights. Learn more about [Sampling in Application Insights](/azure/azure-monitor/app/sampling-classic-api).

## Next step

To learn more about the experimentation concepts, refer to the following document.

> [!div class="nextstepaction"]
> [Experimentation](./concept-experimentation.md)

For the full feature rundown of the .NET feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
