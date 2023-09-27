---
title: Review TrackAvailability() test results
description: This article explains how to review data logged by TrackAvailability() tests
ms.topic: conceptual
ms.date: 09/12/2023
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

The following example demonstrates a web availability test that requires a simple URL ping using the `getStringAsync()` method.

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

For advanced scenarios where the business logic must be adjusted to access the URL, such as obtaining tokens, setting parameters, and other test cases, custom code is necessary.

## Next steps

* [Standard tests](availability-standard-tests.md)
* [Availability alerts](availability-alerts.md)
* [Application Map](./app-map.md)
* [Transaction diagnostics](./transaction-diagnostics.md)
