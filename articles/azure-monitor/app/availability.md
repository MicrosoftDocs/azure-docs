---
title: Application Insights availability tests 
description: Set up recurring web tests to monitor availability and responsiveness of your app or website.
ms.topic: conceptual
ms.date: 07/05/2024
ms.reviewer: cogoodson
---

# Application Insights availability tests

[Application Insights](./app-insights-overview.md) enables you to set up recurring web tests that monitor your website or application's availability and responsiveness from various points around the world. These availability tests send web requests to your application at regular intervals and alert you if your application isn't responding or if the response time is too slow.

Availability tests don't require any modifications to the website or application you're testing. They work for any HTTP or HTTPS endpoint accessible from the public internet, including REST APIs that your service depends on. This means you can monitor not only your own applications but also external services that are critical to your application's functionality. You can create up to 100 availability tests per Application Insights resource.

> [!NOTE]
> Availability tests are stored encrypted, according to [Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services) policies.

## Types of availability tests

There are four types of availability tests:

* **Standard test:** A type of availability test that checks the availability of a website by sending a single request, similar to the deprecated URL ping test. In addition to validating whether an endpoint is responding and measuring the performance, Standard tests also include TLS/SSL certificate validity, proactive lifetime check, HTTP request verb (for example, `GET`,`HEAD`, and `POST`), custom headers, and custom data associated with your HTTP request.

* **Custom TrackAvailability test:** If you decide to create a custom application to run availability tests, you can use the [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) method to send the results to Application Insights.

* **[(Deprecated) Multi-step web test](availability-multistep.md):** You can play back this recording of a sequence of web requests to test more complex scenarios. Multi-step web tests are created in Visual Studio Enterprise and uploaded to the portal, where you can run them.

* **[(Deprecated) URL ping test](monitor-web-app-availability.md):** You can create this test through the Azure portal to validate whether an endpoint is responding and measure performance associated with that response. You can also set custom success criteria coupled with more advanced features, like parsing dependent requests and allowing for retries.

> [!IMPORTANT]
> There are two upcoming availability tests retirements:
> * **Multi-step web tests:** On August 31, 2024, multi-step web tests in Application Insights will be retired. We advise users of these tests to transition to alternative availability tests before the retirement date. Following this date, we will be taking down the underlying infrastructure which will break remaining multi-step tests.
>
> * **URL ping tests:** On September 30, 2026, URL ping tests in Application Insights will be retired. Existing URL ping tests will be removed from your resources. Review the [pricing](https://azure.microsoft.com/pricing/details/monitor/#pricing) for standard tests and [transition](https://aka.ms/availabilitytestmigration) to using them before September 30, 2026 to ensure you can continue to run single-step availability tests in your Application Insights resources.

## Create an availability test

## [Standard test](#tab/standard)

### Prerequisites

> [!div class="checklist"]
> * [Workspace-based Application Insights resource](create-workspace-resource.md)

### Get started

1. Go to your Application Insights resource and open the **Availability** experience.

1. Select **Add Standard test** from the top navigation bar.

    :::image type="content" source="media/availability/add-standard-test.png" alt-text="Screenshot showing the Availability experience with the Add Standard test tab open." lightbox="media/availability/add-standard-test.png":::

1. Input your test name, URL, and other settings described in the following table, then select **Create**.

    | Section | Setting | Description |
    |---------|---------|-------------|
    | **Basic Information** | | |
    | | **URL** | The URL can be any webpage you want to test, but it must be visible from the public internet. The URL can include a query string. So, for example, you can exercise your database a little. If the URL resolves to a redirect, we follow it up to 10 redirects. |
    | | **Parse dependent requests** | Test requests images, scripts, style files, and other files that are part of the webpage under test. The recorded response time includes the time taken to get these files. The test fails if any of these resources can't be successfully downloaded within the timeout for the whole test. If the option isn't selected, the test only requests the file at the URL you specified. Enabling this option results in a stricter check. The test could fail for cases, which might not be noticeable when you manually browse the site. We parse only up to 15 dependent requests. |
    | | **Enable retries for availability test failures** | When the test fails, it retries after a short interval. A failure is reported only if three successive attempts fail. Subsequent tests are then performed at the usual test frequency. Retry is temporarily suspended until the next success. This rule is applied independently at each test location. *We recommend this option*. On average, about 80% of failures disappear on retry. |
    | | **Enable SSL certificate validity** | You can verify the SSL certificate on your website to make sure it's correctly installed, valid, trusted, and doesn't give any errors to any of your users. |
    | | **Proactive lifetime check** | This setting enables you to define a set time period before your SSL certificate expires. After it expires, your test will fail. |
    | | **Test frequency** | Sets how often the test is run from each test location. With a default frequency of five minutes and five test locations, your site is tested on average every minute. |
    | | **Test locations** |  Our servers send web requests to your URL from these locations. *Our minimum number of recommended test locations is five* to ensure that you can distinguish problems in your website from network issues. You can select up to 16 locations. |
    | **Standard test info** | | |
    | | **HTTP request verb** | Indicate what action you want to take with your request. |
    | | **Request body** | Custom data associated with your HTTP request. You can upload your own files, enter your content, or disable this feature. |
    | | **Add custom headers** | Key value pairs that define the operating parameters. |
    | **Success criteria** | | |
    | | **Test Timeout** | Decrease this value to be alerted about slow responses. The test is counted as a failure if the responses from your site aren't received within this period. If you selected **Parse dependent requests**, all the images, style files, scripts, and other dependent resources must be received within this period. |
    | | **HTTP response** | The returned status code counted as a success. The number 200 is the code that indicates that a normal webpage is returned. |
    | | **Content match** | A string, like "Welcome!" We test that an exact case-sensitive match occurs in every response. It must be a plain string, without wildcards. Don't forget that if your page content changes, you might have to update it. *Only English characters are supported with content match.* |

## [TrackAvailability()](#tab/track)

> [!IMPORTANT]
> [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) requires making a developer investment in writing and maintanining potentially complex custom code.
>
> *Standard tests should always be used if possible*, as they require little investment, no maintenance, and have few prerequisites.

This example is designed only to show you the mechanics of how the `TrackAvailability()` API call works within an Azure Functions app. It doesn't show how to write the underlying HTTP test code or business logic required to turn this example into a fully functional availability test.

### Prerequisites

> [!div class="checklist"]
> * [Workspace-based Application Insights resource](create-workspace-resource.md)
> * Access to the source code of an [Azure Functions app](../../azure-functions/functions-how-to-use-azure-function-app-settings.md)
> * Developer expertise to author custom code for [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability), tailored to your specific business needs

### Get started

> [!NOTE]
> To follow these instructions, you must use either the [App Service](../../azure-functions/dedicated-plan.md) plan or Functions Premium plan to allow editing code in App Service Editor.
> 
> If you're testing behind a virtual network or testing nonpublic endpoints, you'll need to use the Functions Premium plan.

#### Create a timer trigger function

1. [Create an Azure Functions resource](../../azure-functions/functions-create-scheduled-function.md#create-a-function-app) with the following consideration:

    * **If you don't have an Application Insights resource yet for your timer-triggered function,** it's created *by default* when you create an Azure Functions app.

    * **If you already have an Application Insights resource,** go to the **Monitoring** tab while creating the Azure Functions app, and select or enter the name of your existing resource in the Application Insights dropdown:

        :::image type="content" source="media/availability/create-application-insights.png" alt-text="Screenshot showing selecting your existing Application Insights resource on the Monitoring tab.":::

1. Follow the instructions to [create a timer triggered function](../../azure-functions/functions-create-scheduled-function.md#create-a-timer-triggered-function).

#### Add and edit code in the App Service Editor

Go to your deployed Azure Functions app, and under **Development Tools**, select the **App Service Editor** tab.

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

    :::image type="content" source="media/availability/function-proj.png" alt-text=" Screenshot showing function.proj in the App Service Editor." lightbox="media/availability/function-proj.png":::

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

1. Replace the existing code in **run.csx** with the following:

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

    // If this file does not exist, add it first 

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

> [!NOTE]
> Tests created with `TrackAvailability()` will appear with **CUSTOM** next to the test name.
>
> :::image type="content" source="media/availability/availability-test-list.png" alt-text="Screenshot showing the Availability experience with two different tests listed.":::

---

## Availability alerts

Alerts are automatically enabled by default, but to fully configure an alert, you must initially create your availability test.

| Setting                      | Description                                                                                                                                                                                                                                    |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Near real time**           | We recommend using near real time alerts. Configuring this type of alert is done after your availability test is created.                                                                                                                      |
| **Alert location threshold** | We recommend a minimum of 3/5 locations. The optimal relationship between alert location threshold and the number of test locations is **alert location threshold** = **number of test locations - 2, with a minimum of five test locations.** |

### Location population tags

You can use the following population tags for the geo-location attribute when you deploy a Standard test or URL ping test [by using Azure Resource Manager](../alerts/alerts-create-rule-cli-powershell-arm.md#create-a-new-alert-rule-using-an-arm-template).

| Provider                                 | Display name                           | Population name     |
|------------------------------------------|----------------------------------------|---------------------|
| **Azure**                                |                                        |                     |
|                                          | Australia East                         | emea-au-syd-edge    |
|                                          | Brazil South                           | latam-br-gru-edge   |
|                                          | Central US                             | us-fl-mia-edge      |
|                                          | East Asia                              | apac-hk-hkn-azr     |
|                                          | East US                                | us-va-ash-azr       |
|                                          | France South (Formerly France Central) | emea-ch-zrh-edge    |
|                                          | France Central                         | emea-fr-pra-edge    |
|                                          | Japan East                             | apac-jp-kaw-edge    |
|                                          | North Europe                           | emea-gb-db3-azr     |
|                                          | North Central US                       | us-il-ch1-azr       |
|                                          | South Central US                       | us-tx-sn1-azr       |
|                                          | Southeast Asia                         | apac-sg-sin-azr     |
|                                          | UK West                                | emea-se-sto-edge    |
|                                          | West Europe                            | emea-nl-ams-azr     |
|                                          | West US                                | us-ca-sjc-azr       |
|                                          | UK South                               | emea-ru-msa-edge    |
| **Azure Government**                     |                                        |                     |
|                                          | USGov Virginia                         | usgov-va-azr        |
|                                          | USGov Arizona                          | usgov-phx-azr       |
|                                          | USGov Texas                            | usgov-tx-azr        |
|                                          | USDoD East                             | usgov-ddeast-azr    |
|                                          | USDoD Central                          | usgov-ddcentral-azr |
| **Microsoft Azure operated by 21Vianet** |                                        |                     |
|                                          | China East                             | mc-cne-azr          |
|                                          | China East 2                           | mc-cne2-azr         |
|                                          | China North                            | mc-cnn-azr          |
|                                          | China North 2                          | mc-cnn2-azr         |

### Enable alerts

> [!NOTE]
> With the [new unified alerts](../alerts/alerts-overview.md), the alert rule severity and notification preferences with [action groups](../alerts/action-groups.md) *must be* configured in the alerts experience. Without the following steps, you'll only receive in-portal notifications.

1. After you save the availability test, open the context menu by the test you made, then select **Open Rules (Alerts) page**.

    :::image type="content" source="media/availability/open-rules-page.png" alt-text="Screenshot showing the Availability experience for an Application Insights resource in the Azure portal and the Open Rules (Alerts) page menu option." lightbox="media/availability/open-rules-page.png":::

1. On the **Alert rules** page, open your alert, then select **Edit** in the top navigation bar. Here you can set the severity level, rule description, and action group that have the notification preferences you want to use for this alert rule.

    :::image type="content" source="media/availability/edit-alert.png" alt-text="Screenshot showing an alert rule page in the Azure portal with Edit highlighted." lightbox="media/availability/edit-alert.png":::

### Alert criteria

Automatically enabled availability alerts trigger one email when the endpoint becomes unavailable, and another email when it's available again. Availability alerts that are created through this experience are *state based*. When the alert criteria are met, a single alert gets generated when the website is detected as unavailable. If the website is still down the next time the alert criteria is evaluated, it won't generate a new alert.

For example, suppose that your website is down for an hour and you set up an email alert with an evaluation frequency of 15 minutes. You only receive an email when the website goes down and another email when it's back online. You don't receive continuous alerts every 15 minutes to remind you that the website is still unavailable.

#### Change the alert criteria

You might not want to receive notifications when your website is down for only a short period of time, for example, during maintenance. You can change the evaluation frequency to a higher value than the expected downtime, up to 15 minutes. You can also increase the alert location threshold so that it only triggers an alert if the website is down for a specific number of regions.

> [!TIP]
> For longer scheduled downtimes, temporarily deactivate the alert rule or create a custom rule. It gives you more options to account for the downtime.

To make changes to the location threshold, aggregation period, and test frequency, go to the **Edit alert rule** page (see step 2 under [Enable alerts](#enable-alerts)), then select the condition to open the **Configure signal logic** window.

:::image type="content" source="media/availability/configure-signal-logic.png" alt-text="Screenshot showing a highlighted alert condition and the Configure signal logic window." lightbox="media/availability/configure-signal-logic.png":::

### Create a custom alert rule

If you need advanced capabilities, you can create a custom alert rule on the **Alerts** tab. Select **Create** > **Alert rule**. Choose **Metrics** for **Signal type** to show all available signals and select **Availability**.

A custom alert rule offers higher values for the aggregation period (up to 24 hours instead of 6 hours) and the test frequency (up to 1 hour instead of 15 minutes). It also adds options to further define the logic by selecting different operators, aggregation types, and threshold values.

* **Alert on X out of Y locations reporting failures**: The X out of Y locations alert rule is enabled by default in the [new unified alerts experience](../alerts/alerts-overview.md) when you create a new availability test. You can opt out by selecting the "classic" option or by choosing to disable the alert rule. Configure the action groups to receive notifications when the alert triggers by following the preceding steps. Without this step, you only receive in-portal notifications when the rule triggers.

* **Alert on availability metrics**: By using the [new unified alerts](../alerts/alerts-overview.md), you can alert on segmented aggregate availability and test duration metrics too:

    1. Select an Application Insights resource in the **Metrics** experience, and select an **Availability** metric.
    
    1. The **Configure alerts** option from the menu takes you to the new experience where you can select specific tests or locations on which to set up alert rules. You can also configure the action groups for this alert rule here.

* **Alert on custom analytics queries**: By using the [new unified alerts](../alerts/alerts-overview.md), you can alert on [custom log queries](../alerts/alerts-types.md#log-alerts). With custom queries, you can alert on any arbitrary condition that helps you get the most reliable signal of availability issues. It's also applicable if you're sending custom availability results by using the TrackAvailability SDK.

    The metrics on availability data include any custom availability results you might be submitting by calling the TrackAvailability SDK. You can use the alerting on metrics support to alert on custom availability results.

### Automate alerts

To automate this process with Azure Resource Manager templates, see [Create a metric alert with an Azure Resource Manager template](../alerts/alerts-metric-create-templates.md#template-for-an-availability-test-along-with-a-metric-alert).

## See your availability test results

This section explains how to review availability test results in the Azure portal and query the data using [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor). Availability test results can be visualized with both **Line** and **Scatter Plot** views.
 
### Check availability

Start by reviewing the graph in the **Availability** experience in the Azure portal.

:::image type="content" source="media/availability/scatter-plot.png" alt-text="Screenshot showing the Availability experience graph, highlighting the toggle between line and scatter plot." lightbox="media/availability/scatter-plot.png":::

By default, the Availability experience shows a line graph. Change the view to **Scatter Plot** (toggle above the graph) to see samples of the test results that have diagnostic test-step detail in them. The test engine stores diagnostic detail for tests that have failures. For successful tests, diagnostic details are stored for a subset of the executions. To see the test, test name, and location, hover over any of the green dots or red crosses.

Select a particular test or location. Or you can reduce the time period to see more results around the time period of interest. Use Search Explorer to see results from all executions. Or you can use Log Analytics queries to run custom reports on this data.

To see the end-to-end transaction details, under **Drill into**, select **Successful** or **Failed**. Then select a sample. You can also get to the end-to-end transaction details by selecting a data point on the graph.

:::image type="content" source="media/availability/sample-availability-test.png" alt-text="Screenshot showing selecting a sample availability test.":::

### Inspect and edit tests

To edit, temporarily disable, or delete a test, open the context menu (ellipsis) by the test, then select **Edit**. It might take up to 20 minutes for configuration changes to propagate to all test agents after a change is made.

> [!TIP]
> You might want to disable availability tests or the alert rules associated with them while you're performing maintenance on your service.

### If you see failures

Open the **End-to-end transaction details** view by selecting a red cross on the Scatter Plot.

:::image type="content" source="media/availability/end-to-end-transaction-details.png" alt-text="Screenshot showing the End-to-end transaction details tab." lightbox="media/availability/end-to-end-transaction-details.png":::

Here you can:

* Review the **Troubleshooting Report** to determine what potentially caused your test to fail.
* Inspect the response received from your server.
* Diagnose failure with correlated server-side telemetry collected while processing the failed availability test.
* Track the problem by logging an issue or work item in Git or Azure Boards. The bug contains a link to the event in the Azure portal.
* Open the web test result in Visual Studio.

To learn more about the end-to-end transaction diagnostics experience, see the [transaction diagnostics documentation](./transaction-search-and-diagnostics.md?tabs=transaction-diagnostics).

Select the exception row to see the details of the server-side exception that caused the synthetic availability test to fail. You can also get the [debug snapshot](./snapshot-debugger.md) for richer code-level diagnostics.

In addition to the raw results, you can also view two key availability metrics in [metrics explorer](../essentials/metrics-getting-started.md):

* **Availability**: Percentage of the tests that were successful across all test executions.
* **Test Duration**: Average test duration across all test executions.

### Query in Log Analytics

You can use Log Analytics to view your availability results (`availabilityResults`), dependencies (`dependencies`), and more. To learn more about Log Analytics, see [Log query overview](../logs/log-query-overview.md).

:::image type="content" source="media/availability/availability-results.png" alt-text="Screenshot showing availability results in Logs." lightbox="media/availability/availability-results.png":::

## Migrate classic URL ping tests to standard tests

The following steps walk you through the process of creating [standard tests](availability-standard-tests.md) that replicate the functionality of your [URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability). It allows you to more easily start using the advanced features of [standard tests](availability-standard-tests.md) using your previously created [URL ping tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability).

> [!IMPORTANT]
> A cost is associated with running **[standard tests](/editor/availability-standard-tests.md)**. Once you create a **[standard test](/editor/availability-standard-tests.md)**, you will be charged for test executions. Refer to **[Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/#pricing)** before starting this process.

#### Prerequisites

> [!div class="checklist"]
> * Any [URL ping test](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) within Application Insights
> * [Azure PowerShell](/powershell/azure/get-started-azureps) access

#### Get started

1. Connect to your subscription with Azure PowerShell (`Connect-AzAccount` + `Set-AzContext`).

1. List all URL ping tests in the current subscription:

    ```azurepowershell
    Get-AzApplicationInsightsWebTest | `
    Where-Object { $_.WebTestKind -eq "ping" } | `
    Format-Table -Property ResourceGroupName,Name,WebTestKind,Enabled;
    ```

1. Find the URL ping test you want to migrate and record its resource group and name.

1. Create a standard test with the same logic as the URL ping test using the following commands, which work for both HTTP and HTTPS endpoints.

    ```shell
    $resourceGroup = "pingTestResourceGroup";
    $appInsightsComponent = "componentName";
    $pingTestName = "pingTestName";
    $newStandardTestName = "newStandardTestName";
    
    $componentId = (Get-AzApplicationInsights -ResourceGroupName $resourceGroup -Name $appInsightsComponent).Id;
    $pingTest = Get-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup -Name $pingTestName;
    $pingTestRequest = ([xml]$pingTest.ConfigurationWebTest).WebTest.Items.Request;
    $pingTestValidationRule = ([xml]$pingTest.ConfigurationWebTest).WebTest.ValidationRules.ValidationRule;
    
    $dynamicParameters = @{};
    
    if ($pingTestRequest.IgnoreHttpStatusCode -eq [bool]::FalseString) {
    $dynamicParameters["RuleExpectedHttpStatusCode"] = [convert]::ToInt32($pingTestRequest.ExpectedHttpStatusCode, 10);
    }
    
    if ($pingTestValidationRule -and $pingTestValidationRule.DisplayName -eq "Find Text" `
    -and $pingTestValidationRule.RuleParameters.RuleParameter[0].Name -eq "FindText" `
    -and $pingTestValidationRule.RuleParameters.RuleParameter[0].Value) {
    $dynamicParameters["ContentMatch"] = $pingTestValidationRule.RuleParameters.RuleParameter[0].Value;
    $dynamicParameters["ContentPassIfTextFound"] = $true;
    }
    
    New-AzApplicationInsightsWebTest @dynamicParameters -ResourceGroupName $resourceGroup -Name $newStandardTestName `
    -Location $pingTest.Location -Kind 'standard' -Tag @{ "hidden-link:$componentId" = "Resource" } -TestName $newStandardTestName `
    -RequestUrl $pingTestRequest.Url -RequestHttpVerb "GET" -GeoLocation $pingTest.PropertiesLocations -Frequency $pingTest.Frequency `
    -Timeout $pingTest.Timeout -RetryEnabled:$pingTest.RetryEnabled -Enabled:$pingTest.Enabled `
    -RequestParseDependent:($pingTestRequest.ParseDependentRequests -eq [bool]::TrueString);
    ```

    The new standard test doesn't have alert rules by default, so it doesn't create noisy alerts. No changes are made to your URL ping test so you can continue to rely on it for alerts.

1. Validate the functionality of the new standard test, then [update your alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules) that reference the URL ping test to reference the standard test instead. 

1. Disable or delete the URL ping test. To do so with Azure PowerShell, you can use this command:

    ```azurepowershell
    Remove-AzApplicationInsightsWebTest -ResourceGroupName $resourceGroup -Name $pingTestName;
    ```

## Testing behind a firewall

To ensure endpoint availability behind firewalls, enable public availability tests or run availability tests in disconnected or no ingress scenarios.

### Public availability test enablement

Ensure your internal website has a public Domain Name System (DNS) record. Availability tests fail if DNS can't be resolved. For more information, see [Create a custom domain name for internal application](../../cloud-services/cloud-services-custom-domain-name-portal.md#add-an-a-record-for-your-custom-domain).

> [!WARNING]
> The IP addresses used by the availability tests service are shared and can expose your firewall-protected service endpoints to other tests. IP address filtering alone doesn't secure your service's traffic, so it's recommended to add extra custom headers to verify the origin of web request. For more information, see [Virtual network service tags](../../virtual-network/service-tags-overview.md#virtual-network-service-tags).

#### Authenticate traffic

Set custom headers in [standard availability tests](availability-standard-tests.md) to validate traffic.

1. Create an alphanumeric string without spaces to identify this availability test (for example, MyAppAvailabilityTest). From here on we refer to this string as the *availability test string identifier*.

1. Add the custom header *X-Customer-InstanceId* with the value `ApplicationInsightsAvailability:<your availability test string identifier>` under the **Standard test info** section when creating or updating your availability tests.

    :::image type="content" source="media/availability/custom-header.png" alt-text="Screenshot showing custom validation header.":::

1. Ensure your service checks if incoming traffic includes the header and value defined in the previous steps.

Alternatively, set the *availability test string identifier* as a query parameter.

**Example:** ```https://yourtestendpoint/?x-customer-instanceid=applicationinsightsavailability:<your availability test string identifier>```

#### Configure your firewall to permit incoming requests from availability tests

> [!NOTE]
> This example is specific to network security group service tag usage. Many Azure services accept service tags, each requiring different configuration steps.

To simplify enabling Azure services without authorizing individual IPs or maintaining an up-to-date IP list, use [Service tags](../../virtual-network/service-tags-overview.md). Apply these tags across Azure Firewall and network security groups, allowing the availability test service access to your endpoints. The service tag `ApplicationInsightsAvailability` applies to all availability tests.

1. If you're using [Azure network security groups](../../virtual-network/network-security-groups-overview.md), go to your network security group resource and under **Settings**, open the **Inbound security rules** experience, then select **Add**.

1. Next, select *Service Tag* as the **Source** and *ApplicationInsightsAvailability* as the **Source service tag**. Use open ports 80 (http) and 443 (https) for incoming traffic from the service tag.

To manage access when your endpoints are outside Azure or when service tags aren't an option, allowlist the [IP addresses of our web test agents](ip-addresses.md). You can query IP ranges using PowerShell, Azure CLI, or a REST call with the [Service Tag API](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api). For a comprehensive list of current service tags and their IP details, download the [JSON file](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).
  
1. In your network security group resource, under **Settings**, open the **Inbound security rules** experience, then select **Add**.

1. Next, select *IP Addresses* as your **Source**. Then add your IP addresses in a comma-delimited list in **Source IP address/CIRD ranges**.

### Disconnected or no ingress scenarios

1. Connect your Application Insights resource to your internal service endpoint using [Azure Private Link](../logs/private-link-security.md).

1. Write custom code to periodically test your internal server or endpoints. Send the results to Application Insights using the [TrackAvailability()](availability-azure-functions.md) API in the core SDK package.

### Supported TLS configurations

To provide best-in-class encryption, all availability tests use Transport Layer Security (TLS) 1.2 and 1.3 as the encryption mechanisms of choice. In addition, the following Cipher suites and Elliptical curves are also supported within each version.

TLS 1.3 is currently only available in the availability test regions NorthCentralUS, CentralUS, EastUS, SouthCentralUS, and WestUS.

| Version | Cipher suites | Elliptical curves |
|---------|---------|---------|
| TLS 1.2 | • TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384<br>• TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256<br>• TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384<br>• TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256<br>• TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384<br>• TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256<br>• TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384<br>• TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | • NistP384<br>• NistP256 |
| TLS 1.3 | • TLS_AES_256_GCM_SHA384<br>• TLS_AES_128_GCM_SHA256 | • NistP384<br>• NistP256 |

### Deprecating TLS configuration

> [!IMPORTANT]
> On 31 October 2024, in alignment with the [Azure wide legacy TLS deprecation](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/), TLS 1.0/1.1 protocol versions and the listed TLS 1.2/1.3 legacy Cipher suites and Elliptical curves will be retired for Application Insights availability tests.

#### TLS 1.0 and TLS 1.1

TLS 1.0 and TLS 1.1 are being retired.

#### TLS 1.2 and TLS 1.3

| Version | Cipher suites | Elliptical curves |
|---------|---------|---------|
| TLS 1.2 | • TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA<br>• TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA<br>• TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA<br>• TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA<br>• TLS_RSA_WITH_AES_256_GCM_SHA384<br>• TLS_RSA_WITH_AES_128_GCM_SHA256<br>• TLS_RSA_WITH_AES_256_CBC_SHA256<br>• TLS_RSA_WITH_AES_128_CBC_SHA256<br>• TLS_RSA_WITH_AES_256_CBC_SHA<br>• TLS_RSA_WITH_AES_128_CBC_SHA | • curve25519 |
| TLS 1.3 | | • curve25519 |

### Troubleshooting

> [!WARNING]
> We have recently enabled TLS 1.3 in availability tests. If you are seeing new error messages as a result, ensure that clients running on Windows Server 2022 with TLS 1.3 enabled can connect to your endpoint. If you are unable to do this, you may consider temporarily disabling TLS 1.3 on your endpoint so that availability tests will fall back to older TLS versions.
> 
> For additional information, check the  [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/troubleshoot-availability).

## Downtime & Outages workbook

This section introduces a simple way to calculate and report service-level agreement (SLA) for web tests through a single pane of glass across your Application Insights resources and Azure subscriptions. The downtime and outage report provides powerful prebuilt queries and data visualizations to enhance your understanding of your customer's connectivity, typical application response time, and experienced downtime.

The SLA workbook template can be accessed from your Application Insights resource in two ways:

* Open the **Availability** experience, then select **SLA Report** from the top navigation bar.

* Open the **Workbooks** experience, then select **Downtime & Outages** template.

### Parameter flexibility

The parameters set in the workbook influence the rest of your report.

:::image type="content" source="media/availability/workbook-parameters.png" alt-text=" Screenshot showing parameters." lightbox= "media/sla-report/parameters.png":::

* `Subscriptions`, `App Insights Resources`, and `Web Test`: These parameters determine your high-level resource options. They're based on Log Analytics queries and are used in every report query.
* `Failure Threshold` and `Outage Window`: You can use these parameters to determine your own criteria for a service outage. An example is the criteria for an Application Insights availability alert based on a failed location counter over a chosen period. The typical threshold is three locations over a five-minute window.
* `Maintenance Period`: You can use this parameter to select your typical maintenance frequency. `Maintenance Window` is a datetime selector for an example maintenance period. All data that occurs during the identified period is ignored in your results.
* `Availability Target %`: This parameter specifies your target objective and takes custom values.

### Overview page

The overview page contains high-level information about your:

* Total SLA (excluding maintenance periods, if defined)
* End-to-end outage instances
* Application downtime

Outage instances are determined from the moment a test begins to fail until it successfully passes again, according to your outage parameters. If a test starts failing at 8:00 AM and succeeds again at 10:00 AM, that entire period of data is considered the same outage. You can also investigate the longest outage that occurred over your reporting period.

Some tests are linkable back to their Application Insights resource for further investigation. But that's only possible in the [workspace-based Application Insights resource](create-workspace-resource.md).

### Downtime, outages, and failures

There are two more tabs next to the **Overview** page:

* The **Outages & Downtime** tab has information on total outage instances and total downtime broken down by test.

* The **Failures by Location** tab has a geo-map of failed testing locations to help identify potential problem connection areas.

### Other features

* **Customization:** You can edit the report like any other [Azure Monitor workbook](../visualize/workbooks-overview.md) and customize the queries or visualizations based on your team's needs.

* **Log Analytics:** The queries can all be run in [Log Analytics](../logs/log-analytics-overview.md) and used in other reports or dashboards. Remove the parameter restriction and reuse the core query.

* **Access and sharing:** The report can be shared with your teams and leadership or pinned to a dashboard for further use. The user needs read permissions and access to the Application Insights resource where the actual workbook is stored.

## Frequently asked questions

This section provides answers to common questions.

### General

#### Can I run availability tests on an intranet server?

Our [web tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) run on points of presence that are distributed around the globe. There are two solutions:
          
* **Firewall door**: Allow requests to your server from [the long and changeable list of web test agents](../ip-addresses.md).
* **Custom code**: Write your own code to send periodic requests to your server from inside your intranet. You could run Visual Studio web tests for this purpose. The tester could send the results to Application Insights by using the `TrackAvailability()` API.

#### What is the user agent string for availability tests?

The user agent string is **Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; AppInsights)**

### TLS support

#### How does this deprecation impact my web test behavior?

Availability tests act as a distributed client in each of the supported web test locations. Every time a web test is executed the availability test service attempts to reach out to the remote endpoint defined in the web test configuration. A TLS Client Hello message is sent which contains all the currently supported TLS configuration. If the remote endpoint shares a common TLS configuration with the availability test client, then the TLS handshake succeeds. Otherwise, the web test fails with a TLS handshake failure. 

#### How do I ensure my web test isn't impacted?

To avoid any impact, each remote endpoint (including dependent requests) your web test interacts with needs to support at least one combination of the same Protocol Version, Cipher Suite, and Elliptical Curve that availability test does. If the remote endpoint doesn't support the needed TLS configuration, it needs to be updated with support for some combination of the above-mentioned post-deprecation TLS configuration. These endpoints can be discovered through viewing the [Transaction Details](/azure/azure-monitor/app/availability-standard-tests#see-your-availability-test-results) of your web test (ideally for a successful web test execution). 

#### How do I validate what TLS configuration a remote endpoint supports?

There are several tools available to test what TLS configuration an endpoint supports. One way would be to follow the example detailed on this [page](/security/engineering/solving-tls1-problem#appendix-a-handshake-simulation). If your remote endpoint isn't available via the Public internet, you need to ensure you validate the TLS configuration supported on the remote endpoint from a machine that has access to call your endpoint. 

> [!NOTE]
> For steps to enable the needed TLS configuration on your web server, it is best to reach out to the team that owns the hosting platform your web server runs on if the process is not known. 

#### After October 31, 2024, what will the web test behavior be for impacted tests?

There's no one exception type that all TLS handshake failures impacted by this deprecation would present themselves with. However, the most common exception your web test would start failing with would be `The request was aborted: Couldn't create SSL/TLS secure channel`. You should also be able to see any TLS related failures in the TLS Transport [Troubleshooting Step](/troubleshoot/azure/azure-monitor/app-insights/availability/diagnose-ping-test-failure) for the web test result that is potentially impacted. 

#### Can I view what TLS configuration is currently in use by my web test?

The TLS configuration negotiated during a web test execution can't be viewed. As long as the remote endpoint supports common TLS configuration with availability tests, no impact should be seen post-deprecation. 

#### Which components does the deprecation affect in the availability test service?

The TLS deprecation detailed in this document should only affect the availability test web test execution behavior after October 31, 2024. For more information about interacting with the availability test service for CRUD operations, see [Azure Resource Manager TLS Support](/azure/azure-resource-manager/management/tls-support). This resource provides more details on TLS support and deprecation timelines.

#### Where can I get TLS support?

For any general questions around the legacy TLS problem, see [Solving TLS problems](/security/engineering/solving-tls1-problem).

## Next steps

* [Troubleshooting](troubleshoot-availability.md)
* [Web tests Azure Resource Manager template](/azure/templates/microsoft.insights/webtests?tabs=json)
* [Web test REST API](/rest/api/application-insights/web-tests)
