---
title: 'Tutorial:  Run experiments with variant feature flags in Azure App Configuration'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to set up experiments in an App Configuration store using Split Experimentation Workspace.
#customerintent: As a user of Azure App Configuration, I want to learn how I can run experiments with variant feature flags, using Split Experimentation Workspace and Application Insights.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom:
  - build-2024
ms.topic: tutorial
ms.date: 05/07/2024
---

# Tutorial: Run experiments with variant feature flags (preview)

Running experiments on your application can help you make informed decisions to improve your app’s performance and user experience. In this guide, you learn how to set up and execute experimentations within an App Configuration store. You learn how to collect and measure data, using the capabilities of App Configuration, Application Insights (preview), and [Split Experimentation Workspace (preview)](../partner-solutions/split-experimentation/index.yml).

By doing so, you can make data-driven decisions to improve your application.

> [!NOTE]
> A quick way to start your experimentation journey is to run the [Quote of the Day AZD sample.](https://github.com/Azure-Samples/quote-of-the-day-dotnet/) This repository provides a comprehensive example, complete with Azure resource provisioning and a first experiment, on how to integrate Azure App Configuration with your .NET applications to run experiments.

In this tutorial, you:

> [!div class="checklist"]
> * Create a variant feature flag
> * Add an Application Insights resource to your store
> * Add a Split Experimentation Workspace to your store
> * Set up an app to run an experiment
> * Enable telemetry and create an experiment in your variant feature flag
> * Create metrics for your experiment
> * Get experimentation results

## Prerequisites

* An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
* An [App Configuration store](./quickstart-azure-app-configuration-create.md).
* A [Split Experimentation Workspace resource](../partner-solutions/split-experimentation/create.md).
* A [workspace-based Application Insights](/azure/azure-monitor/app/create-workspace-resource#create-a-workspace-based-resource) resource.

## Create a variant feature flag (preview)

Create a variant feature flag called *Greeting* with two variants, *Off* and *On*, as described in the [Feature Flag quickstart](./manage-feature-flags.md#create-a-variant-feature-flag-preview).

## Connect an Application Insights (preview) resource to your configuration store

To run an experiment, you first need to connect a workspace-based Application Insights resource to your App Configuration store. Connecting this resource to your App Configuration store sets the configuration store with the telemetry source for the experimentation.

1. In your App Configuration store, select **Telemetry > Application Insights (preview)**.

    :::image type="content" source="./media/run-experiments-aspnet-core/select-application-insights.png" alt-text="Screenshot of the Azure portal, adding an Application Insights to a store." lightbox="./media/run-experiments-aspnet-core/select-application-insights.png":::

1. Select the Application Insights resource you want to use as the telemetry provider for your variant feature flags and application, and select **Save**. If you don't have an Application Insights resource, create one by selecting **Create new**. For more information about how to proceed, go to [Create a worskpace-based resource](../azure-monitor/app/create-workspace-resource.md#create-a-workspace-based-resource). Then, back in **Application Insights (preview)**, reload the list of available Application Insights resources and select your new Application Insights resource.
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

In this example, you create an ASP.NET web app named _Quote of the Day_. When the app is loaded, it displays a quote. Users can hit the heart button to like it. To improve user engagement, you want to explore whether a personalized greeting message will increase the number of users who like the quote. You create the _Greeting_ feature flag in Azure App Configuration with two variants, _Off_ and _On_. Users who receive the _Off_ variant will see a standard title. Users who receive the _On_ variant will get a greeting message. You collect and save the telemetry of your user interactions in Application Insights. With Split Experimentation Workspace, you can analyze the effectiveness of your experiment.

### Create an app and add user secrets

1. Open a command prompt and run the following code. This creates a new Razor Pages application in ASP.NET Core, using Individual account auth, and places it in an output folder named *QuoteOfTheDay*.

    ```dotnetcli
    dotnet new razor --auth Individual -o QuoteOfTheDay
    ```

1. In the command prompt, navigate to the *QuoteOfTheDay* folder and run the following command to create a [user secret](/aspnet/core/security/app-secrets) for the application. This secret holds the connection string for App Configuration.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppConfiguration "<App Configuration Connection string>"
    ```

1. Create another user secret that holds the connection string for Application Insights.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppInsights "<Application Insights Connection string>"
    ```

### Update the application code

1. In *QuoteOfTheDay.csproj*, add the latest preview versions of the Feature Management and App Configuration SDKs as required packages.

    ```csharp
    <PackageReference Include="Microsoft.Azure.AppConfiguration.AspNetCore" Version="8.0.0-preview.2" />
    <PackageReference Include="Microsoft.FeatureManagement.Telemetry.ApplicationInsights" Version="4.0.0-preview3" />
    <PackageReference Include="Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore" Version="4.0.0-preview3" />
    <PackageReference Include="Microsoft.FeatureManagement.AspNetCore" Version="4.0.0-preview3" />
    ```

1. In *Program.cs*, under the line `var builder = WebApplication.CreateBuilder(args);`, add the App Configuration provider, which pulls down the configuration from Azure when the application starts. By default, the UseFeatureFlags method includes all feature flags with no label and sets a cache expiration time of 30 seconds.

    ```csharp
    builder.Configuration
        .AddAzureAppConfiguration(o =>
        {
            o.Connect(builder.Configuration.GetConnectionString("AppConfiguration"));
    
            o.UseFeatureFlags();
        });
    ```

1. In *Program.cs*, add the following using statements:

    ```csharp
    using Microsoft.ApplicationInsights.AspNetCore.Extensions;
    using Microsoft.ApplicationInsights.Extensibility;
    using Microsoft.FeatureManagement.Telemetry.ApplicationInsights.AspNetCore;
    ```

1. Under where `builder.Configuration.AddAzureAppConfiguration` is called, add:

    ```csharp
    // Add Application Insights telemetry.
    builder.Services.AddApplicationInsightsTelemetry(
        new ApplicationInsightsServiceOptions
        {
            ConnectionString = builder.Configuration.GetConnectionString("AppInsights"),
            EnableAdaptiveSampling = false
        })
        .AddSingleton<ITelemetryInitializer, TargetingTelemetryInitializer>();
    ```

    This snippet performs the following actions.

    * Adds an Application Insights telemetry client to the application.
    * Adds a telemetry initializer that appends targeting information to outgoing telemetry.
    * Disables adaptive sampling. For more information about disabling adaptive sampling, go to [Troubleshooting](../partner-solutions/split-experimentation/troubleshoot.md#sampling-in-application-insights).

1. In the root folder *QuoteOfTheDay*, create a new file named *ExampleTargetingContextAccessor.cs*. This creates a new class named `ExampleTargetingContextAccessor`. Paste the content below into the file.

    ```csharp
    using Microsoft.FeatureManagement.FeatureFilters;
    
    namespace QuoteOfTheDay
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
                    UserId = httpContext.User.Identity.Name ?? "guest",
                    Groups = groups
                };
                httpContext.Items[TargetingContextLookup] = targetingContext;
                return new ValueTask<TargetingContext>(targetingContext);
            }
        }
    }
    ```

    This class declares how FeatureManagement's targeting gets the context for a user. In this case, it reads `httpContext.User.Identity.Name` for the `UserId` and treats the domain of the email address as a `Group`.

1. Navigate back to *Program.cs* and add the following using statements.

    ```csharp
    using Microsoft.FeatureManagement.Telemetry;
    using Microsoft.FeatureManagement;
    using QuoteOfTheDay;
    ```

1. Under where `AddApplicationInsightsTelemetry` was called, add services to handle App Configuration Refresh, set up Feature Management, configure Feature Management Targeting, and enable Feature Management to publish telemetry events.

    ```csharp
    builder.Services.AddHttpContextAccessor();
    
    // Add Azure App Configuration and feature management services to the container.
    builder.Services.AddAzureAppConfiguration()
        .AddFeatureManagement()
        .WithTargeting<ExampleTargetingContextAccessor>()
        .AddTelemetryPublisher<ApplicationInsightsTelemetryPublisher>();
    ```

1. Under the line `var app = builder.Build();`, add a middleware that triggers App Configuration refresh when appropriate.

    ```csharp
    // Use Azure App Configuration middleware for dynamic configuration refresh.
    app.UseAzureAppConfiguration();
    ```

1. Under that, add the following code to enable the `TargetingTelemetryInitializer` to have access to targeting information by storing it on HttpContext.

    ```csharp
    // Add TargetingId to HttpContext for telemetry
    app.UseMiddleware<TargetingHttpContextMiddleware>();
    ```

1. In *QuoteOfTheDay* > *Pages* > *Shared* > *_Layout.cshtml*, under where `QuoteOfTheDay.styles.css` is added, add the following line to add the css for version 5.15.3 of `font-awesome`.

    ```css
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    ```

1. Open *QuoteOfTheDay* > *Pages* > *Index.cshtml.cs* and overwrite the content to the quote app.

    ```csharp
    using Microsoft.ApplicationInsights;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.RazorPages;
    using Microsoft.FeatureManagement;
    
    namespace QuoteOfTheDay.Pages;
    
    public class Quote
    {
        public string Message { get; set; }
    
        public string Author { get; set; }
    }
    
    public class IndexModel(IVariantFeatureManagerSnapshot featureManager, TelemetryClient telemetryClient) : PageModel
    {
        private readonly IVariantFeatureManagerSnapshot _featureManager = featureManager;
        private readonly TelemetryClient _telemetryClient = telemetryClient;
    
        private Quote[] _quotes = [
            new Quote()
            {
                Message = "You cannot change what you are, only what you do.",
                Author = "Philip Pullman"
            }];
    
        public Quote? Quote { get; set; }
    
        public bool ShowGreeting { get; set; }
    
        public async void OnGet()
        {
            Quote = _quotes[new Random().Next(_quotes.Length)];
    
            Variant variant = await _featureManager.GetVariantAsync("Greeting", HttpContext.RequestAborted);
    
            ShowGreeting = variant.Configuration.Get<bool>();
        }
    
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

    This `PageModel` picks a random quote, uses `GetVariantAsync` to get the variant for the current user, and sets a variable called "ShowGreeting" to the variant's value. The `PageModel` also handles Post requests, calling `_telemetryClient.TrackEvent("Like");`, which sends an event to Application Insights with the name *Like*. This event is automatically tied to the user and variant, and can be tracked by metrics.

1. Open *index.cshtml* and overwrite the content for the quote app.

    ```cshtml
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
        ViewData["Username"] = User.Identity.Name;
    }
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
    
        .quote-container {
            background-color: #fff;
            margin: 2em auto;
            padding: 2em;
            border-radius: 8px;
            max-width: 750px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: start;
            position: relative;
        }
    
        .vote-container {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 0em;
        }
    
        .vote-container .btn {
            background-color: #ffffff; /* White background */
            border-color: #ffffff; /* Light blue border */
            color: #333
        }
    
        .vote-container .btn:focus {
            outline: none;
            box-shadow: none;
        }
    
        .vote-container .btn:hover {
            background-color: #F0F0F0; /* Light gray background */
        }
    
        .greeting-content {
            font-family: 'Georgia', serif; /* More artistic font */
        }
    
        .quote-content p.quote {
            font-size: 2em; /* Bigger font size */
            font-family: 'Georgia', serif; /* More artistic font */
            font-style: italic; /* Italic font */
            color: #4EC2F7; /* Medium-light blue color */
        }
    </style>
    
    <div class="quote-container">
        <div class="quote-content">
            @if (Model.ShowGreeting)
            {
                <h3 class="greeting-content">Hi <b>@User.Identity.Name</b>, hope this makes your day!</h3>
            }
            else
            {
                <h3 class="greeting-content">Quote of the day</h3>
            }
            <br />
            <p class="quote">“@Model.Quote.Message”</p>
            <p>- <b>@Model.Quote.Author</b></p>
        </div>
    
        <div class="vote-container">
            <button class="btn btn-primary" onclick="heartClicked(this)">
                <i class="far fa-heart"></i> <!-- Heart icon -->
            </button>
        </div>
    
        <form action="/" method="post">
            @Html.AntiForgeryToken()
        </form>
    </div>
    
    <script>
        function heartClicked(button) {
            var icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
    
            // If the quote is hearted
            if (icon.classList.contains('fas')) {
                // Send a request to the server to save the vote
                fetch('/Index?handler=HeartQuote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
                    }
                });
            }
        }
    </script>
    ```

    This code corresponds to the UI to show the QuoteOfTheDay and handle using the heart action on a quote. It uses the previously mentioned `Model.ShowGreeting` value to show different things to different users, depending on their variant.

### Build and run the app

1. In the command prompt, in the *QuoteOfTheDay* folder, run: `dotnet build`.
1. Run: `dotnet run --launch-profile https`.
1. Look for a message in the format `Now listening on: https://localhost:{port}` in the output of the application. Navigate to the included link in your browser.
1. Once viewing the running application, select **Register** at the top right to register a new user.

    :::image type="content" source="media/run-experiments-aspnet-core/register.png" alt-text="Screenshot of the Quote of the day app, showing Register.":::

1. Register a new user named *user@contoso.com*. The password must have at least six characters and contain a number and a special character.

1. Select the link **Click here to validate email** after entering user information.

1. Register a second user named *userb@contoso.com*, enter another password, and validate this second email.

    > [!NOTE]
    > It's important for the purpose of this tutorial to use these names exactly. As long as the feature has been configured as expected, the two users should see different variants.

1. Select **Login** at the top right to sign in as userb (userb@contoso.com).

    :::image type="content" source="media/run-experiments-aspnet-core/login.png" alt-text="Screenshot of the Quote of the day app, showing **Login**.":::

1. Once logged in, you should see that userb@contoso.com sees a special message when viewing the app.

    :::image type="content" source="media/run-experiments-aspnet-core/special-message.png" alt-text="Screenshot of the Quote of the day app, showing a special message for the user.":::

    *userb@contoso.com* is the only user who sees the special message.

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
> Application Insights sampling is enabled by default and it may impact your experimentation results. For this tutorial, you are recommended to turn off sampling in Application Insights. Learn more about [Sampling in Application Insights](../azure-monitor/app/sampling-classic-api.md).

## Next step

> [Experimentation](./concept-experimentation.md)
